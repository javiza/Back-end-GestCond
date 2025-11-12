import { Test, TestingModule } from '@nestjs/testing';
import { RegistroIngresosAdminService } from './registro-ingresos-admin.service';

describe('RegistroIngresosAdminService', () => {
  let service: RegistroIngresosAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistroIngresosAdminService],
    }).compile();

    service = module.get<RegistroIngresosAdminService>(RegistroIngresosAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
