import { PartialType } from '@nestjs/swagger';

import { CreateFamiliareDto }
from './create-familiare.dto';

export class UpdateFamiliareDto
extends PartialType(CreateFamiliareDto){}