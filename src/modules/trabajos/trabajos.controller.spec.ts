import { Test, TestingModule } from '@nestjs/testing';
import { TrabajosController } from './trabajos.controller';
import { TrabajosService } from './trabajos.service';

describe('TrabajosController', () => {
  let controller: TrabajosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrabajosController],
      providers: [TrabajosService],
    }).compile();

    controller = module.get<TrabajosController>(TrabajosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
