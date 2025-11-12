import { Test, TestingModule } from '@nestjs/testing';
import { RegistroIngresosAdminController } from './registro-ingresos-admin.controller';
import { RegistroIngresosAdminService } from './registro-ingresos-admin.service';

describe('RegistroIngresosAdminController', () => {
  let controller: RegistroIngresosAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroIngresosAdminController],
      providers: [RegistroIngresosAdminService],
    }).compile();

    controller = module.get<RegistroIngresosAdminController>(RegistroIngresosAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
