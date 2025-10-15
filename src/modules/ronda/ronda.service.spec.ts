import { Test, TestingModule } from '@nestjs/testing';
import { RondaService } from './ronda.service';

describe('RondaService', () => {
  let service: RondaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RondaService],
    }).compile();

    service = module.get<RondaService>(RondaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
