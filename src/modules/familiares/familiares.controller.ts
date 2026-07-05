import {
Controller,
Get,
Post,
Body,
Patch,
Param,
Delete,
ParseIntPipe,
UseGuards
} from '@nestjs/common';

import {
ApiBearerAuth,
ApiOperation,
ApiTags
} from '@nestjs/swagger';

import {
FamiliaresService
} from './familiares.service';

import {
CreateFamiliareDto
} from './dto/create-familiare.dto';

import {
UpdateFamiliareDto
} from './dto/update-familiare.dto';

import { JwtAuthGuard }
from '../auth/jwt-auth.guard';

import { RolesGuard }
from '../auth/roles.guard';

import { Roles }
from '../auth/roles.decorator';

import { RolUsuario }
from '../usuarios/usuarios.entity';

@ApiTags('Familiares')

@ApiBearerAuth()

@UseGuards(
JwtAuthGuard,
RolesGuard
)

@Controller('familiares')

export class FamiliaresController {

constructor(
private readonly service:FamiliaresService
){}

@Post()

@Roles(
RolUsuario.ADMINISTRADOR,
RolUsuario.GUARDIA
)

@ApiOperation({
summary:'Crear familiar'
})

create(
@Body()
dto:CreateFamiliareDto
){
return this.service.create(dto);
}

@Get()

@ApiOperation({
summary:'Listar familiares'
})

findAll(){
return this.service.findAll();
}

@Get(':id')

findOne(

@Param(
'id',
ParseIntPipe
)
id:number

){
return this.service.findOne(id);
}

@Patch(':id')

update(

@Param(
'id',
ParseIntPipe
)
id:number,

@Body()
dto:UpdateFamiliareDto

){
return this.service.update(
id,
dto
);
}

@Delete(':id')

remove(

@Param(
'id',
ParseIntPipe
)
id:number

){
return this.service.remove(
id
);
}

}