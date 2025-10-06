import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { PersonalInternoService } from './personal-interno.service';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('personal-interno')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PersonalInternoController {
  constructor(private readonly service: PersonalInternoService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreatePersonalInternoDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePersonalInternoDto) { return this.service.update(+id, dto); }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
