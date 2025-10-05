import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bajas E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let usuarioToken: string;
  let prendaId: number;
  let bajaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // login admin
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@correo.cl', password: 'Admin123!' })
      .expect(200); //login devuelve 200
    adminToken = adminLogin.body.access_token;

    // login usuario normal
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(200);
    usuarioToken = userLogin.body.access_token;

    // Crear una prenda base
    const prenda = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Bata blanca baja test',
        detalle: 'Prenda para pruebas de bajas',
        peso: 0.5,
        tipo: 'bata',
        cantidad: 10,
      })
      .expect(201);

    prendaId = prenda.body.id_prenda;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin puede registrar una baja y se descuenta del inventario', async () => {
    // stock inicial
    const inventarioInicial = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const stockInicial = inventarioInicial.body.find(
      inv => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    // registrar baja
    const res = await request(app.getHttpServer())
      .post('/bajas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        motivo: 'Prenda dañada',
        cantidad: 2,
      })
      .expect(201);

    expect(res.body.id_baja).toBeDefined();
    expect(res.body.motivo).toBe('Prenda dañada');
    bajaId = res.body.id_baja;

    // stock final
    const inventarioFinal = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const stockFinal = inventarioFinal.body.find(
      inv => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    expect(stockFinal).toBe(stockInicial - 2);
  });

  it('Usuario normal también puede registrar una baja', async () => {
    const res = await request(app.getHttpServer())
      .post('/bajas')
      .set('Authorization', `Bearer ${usuarioToken}`)
      .send({
        id_prenda: prendaId,
        motivo: 'Prenda perdida',
        cantidad: 1,
      })
      .expect(201);

    expect(res.body.id_baja).toBeDefined();
    expect(res.body.motivo).toBe('Prenda perdida');
  });

  it('Debe listar todas las bajas', async () => {
    const res = await request(app.getHttpServer())
      .get('/bajas')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener una baja por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/bajas/${bajaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id_baja).toBe(bajaId);
    expect(res.body.motivo).toBe('Prenda dañada');
  });

  it('Debe eliminar una baja (solo si no tiene movimientos)', async () => {
    await request(app.getHttpServer())
      .delete(`/bajas/${bajaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204); 

    await request(app.getHttpServer())
      .get(`/bajas/${bajaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
