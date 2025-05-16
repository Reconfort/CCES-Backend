import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';
import { EmailService } from '../common/services/email.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Create User
  async signup(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; message: string }> {
    const { name, email, password } = signUpDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });

    return { token, message: 'User registered successfully' };
  }

  // Log User In
  async signIn(dto: SignInDto): Promise<{ token: string; message: string }> {
    if (!dto.password || !dto.email) {
      throw new BadRequestException('Email and password must be provided');
    }

    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user._id) {
      throw new UnauthorizedException('Invalid user ID');
    }
    const token = this.signToken(user._id.toString(), user.email);
    return { token, message: 'Logged in successfully' };
  }

  // Send password reset code
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = dto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code before storing it
    const hashedCode = await bcrypt.hash(code, 10);

    // Save the reset code to the database
    await this.passwordResetModel.deleteMany({ user: user._id }); // Delete any existing codes
    await this.passwordResetModel.create({
      user: user._id,
      code: hashedCode,
      used: false,
    });
    console.log(`Stored code ${code} for user ${user.id}`);

    // Send the code via email
    await this.emailService.sendPasswordResetCode(email, code);

    return { message: 'Password reset code sent to your email' };
  }

  // Verify reset code and provide token
  async verifyCode(dto: VerifyCodeDto): Promise<{ token: string; message: string }> {
    const { email, code } = dto;

    console.log('=== Starting verification process ===');
    console.log('Received:', { email, code });

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('Found user:', { id: user._id, email: user.email });

    // Find the most recent reset entry for this user
    const resetEntry = await this.passwordResetModel
      .findOne({
        user: user._id,
        used: false,
      })
      .sort({ createdAt: -1 }); // Get the most recent one

    if (!resetEntry) {
      console.log('No reset entry found for user');
      // Let's check if there are any entries at all
      const allEntries = await this.passwordResetModel.find({ user: user._id });
      console.log('All entries for user:', allEntries.map(entry => ({
        id: entry._id,
        createdAt: entry.createdAt,
        used: entry.used
      })));

      throw new BadRequestException('No valid reset code found. Please request a new code.');
    }

    console.log('Found reset entry:', {
      id: resetEntry._id,
      createdAt: resetEntry.createdAt,
      used: resetEntry.used,
      ageInMinutes: (Date.now() - resetEntry.createdAt.getTime()) / 60000
    });

    // Verify the code first before checking expiry
    try {
      const codeValid = await bcrypt.compare(code, resetEntry.code);
      console.log('Code validation result:', codeValid);

      if (!codeValid) {
        console.log('Invalid code provided');
        throw new BadRequestException('Invalid reset code');
      }

      // Only check expiry if code is valid
      const now = new Date();
      const expiryTime = new Date(resetEntry.createdAt.getTime() + 3600000);

      if (now > expiryTime) {
        console.log('Code has expired');
        resetEntry.used = true;
        await resetEntry.save();
        throw new BadRequestException('Reset code has expired. Please request a new code.');
      }

      // If we get here, code is valid and not expired
      resetEntry.used = true;
      await resetEntry.save();

      const resetToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          purpose: 'password-reset'
        },
        { expiresIn: '15m' }
      );

      return { token: resetToken, message: 'Code verified successfully' };

    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error validating reset code');
    }
  }

  // Reset password using token
  async resetPassword(
    userId: string,
    dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
    );

    // Clean up used reset codes
    await this.passwordResetModel.deleteMany({ user: userId });

    return { message: 'Password reset successfully' };
  }

  private signToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
