import { Test, TestingModule } from '@nestjs/testing';
import { ResidentesService } from './residentes.service';

describe('ResidentesService', () => {
  let service: ResidentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResidentesService],
    }).compile();

    service = module.get<ResidentesService>(ResidentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
