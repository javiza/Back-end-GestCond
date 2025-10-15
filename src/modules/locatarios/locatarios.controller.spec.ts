import { Test, TestingModule } from '@nestjs/testing';
import { LocatariosController } from './locatarios.controller';
import { LocatariosService } from './locatarios.service';

describe('LocatariosController', () => {
  let controller: LocatariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocatariosController],
      providers: [LocatariosService],
    }).compile();

    controller = module.get<LocatariosController>(LocatariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
