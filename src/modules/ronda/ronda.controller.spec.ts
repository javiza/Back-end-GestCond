import { RondasService } from './ronda.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RondasController } from './ronda.controller';


describe('RondaController', () => {
  let controller: RondasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RondasController],
      providers: [RondasService],
    }).compile();

    controller = module.get<RondasController>(RondasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
