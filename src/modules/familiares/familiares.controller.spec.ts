import { Test, TestingModule } from '@nestjs/testing';
import { FamiliaresController } from './familiares.controller';
import { FamiliaresService } from './familiares.service';

describe('FamiliaresController', () => {
  let controller: FamiliaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamiliaresController],
      providers: [FamiliaresService],
    }).compile();

    controller = module.get<FamiliaresController>(FamiliaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
