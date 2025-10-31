import { Test, TestingModule } from '@nestjs/testing';
import { AutorizacionQrService } from './autorizacion_qr.service';

describe('AutorizacionQrService', () => {
  let service: AutorizacionQrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutorizacionQrService],
    }).compile();

    service = module.get<AutorizacionQrService>(AutorizacionQrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
