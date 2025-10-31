import { Test, TestingModule } from '@nestjs/testing';
import { AutorizacionQrController } from './autorizacion_qr.controller';
import { AutorizacionQrService } from './autorizacion_qr.service';

describe('AutorizacionQrController', () => {
  let controller: AutorizacionQrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutorizacionQrController],
      providers: [AutorizacionQrService],
    }).compile();

    controller = module.get<AutorizacionQrController>(AutorizacionQrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
