import { Test, TestingModule } from '@nestjs/testing';
import { FamiliaresService } from './familiares.service';

describe('FamiliaresService', () => {
  let service: FamiliaresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamiliaresService],
    }).compile();

    service = module.get<FamiliaresService>(FamiliaresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
