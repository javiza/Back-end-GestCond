import { Test, TestingModule } from '@nestjs/testing';
import { GuardiasService } from './guardias.service';

describe('GuardiasService', () => {
  let service: GuardiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardiasService],
    }).compile();

    service = module.get<GuardiasService>(GuardiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
