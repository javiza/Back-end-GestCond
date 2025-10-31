import { Test, TestingModule } from '@nestjs/testing';
import { GuardiasController } from './guardias.controller';
import { GuardiasService } from './guardias.service';

describe('GuardiasController', () => {
  let controller: GuardiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardiasController],
      providers: [GuardiasService],
    }).compile();

    controller = module.get<GuardiasController>(GuardiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
