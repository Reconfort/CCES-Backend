// modules/institution/institution.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create‑institution.dto';
import { UpdateInstitutionDto } from './dto/update‑institution.dto';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('institutions')
export class InstitutionController {
  constructor(private svc: InstitutionService) {}

  @Post() @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateInstitutionDto) {
    return this.svc.create(dto);
  }

  @Get() @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id') @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id') @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id') @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
