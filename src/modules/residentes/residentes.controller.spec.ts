import { Test, TestingModule } from '@nestjs/testing';
import { ResidentesController } from './residentes.controller';
import { ResidentesService } from './residentes.service';

describe('ResidentesController', () => {
  let controller: ResidentesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentesController],
      providers: [ResidentesService],
    }).compile();

    controller = module.get<ResidentesController>(ResidentesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
