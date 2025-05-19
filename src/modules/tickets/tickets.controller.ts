import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTicketDto } from './dto/create‐ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guards';
import { UserRole } from 'src/common/enums/user-role';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tickets')
export class TicketController {
  constructor(private svc: TicketsService) {}

  @Post() @Roles(UserRole.USER)
  create(@Req() req, @Body() dto: CreateTicketDto) {
    return this.svc.create(dto, req.user._id);
  }

  @Get() @Roles(UserRole.ADMIN,UserRole.USER)
  findAll(@Req() req) {
    return this.svc.findAll(req.user);
  }

  @Get(':id') @Roles(UserRole.ADMIN,UserRole.USER)
  findOne(@Req() req, @Param('id') id: string) {
    return this.svc.findOne(id, req.user);
  }

  @Patch(':id') @Roles(UserRole.ADMIN,UserRole.USER)
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.svc.update(id, dto, req.user);
  }

  @Delete(':id') @Roles(UserRole.ADMIN)
  remove(@Req() req, @Param('id') id: string) {
    return this.svc.remove(id, req.user);
  }
}
