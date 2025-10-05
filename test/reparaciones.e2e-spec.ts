import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reparaciones E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let reparacionId: number;
  let prendaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Login admin
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@correo.cl', password: 'Admin123!' })
      .expect(200);
    adminToken = adminLogin.body.access_token;

    // Login usuario normal
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(200);
    userToken = userLogin.body.access_token;

    // Crear prenda base
    const prenda = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Chaqueta Reparación',
        detalle: 'Chaqueta con costura dañada',
        peso: 0.8,
        tipo: 'uniforme',
        cantidad: 5,
      })
      .expect(201);

    prendaId = prenda.body.id_prenda;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin puede crear una reparación y descontar inventario', async () => {
    const inventarioInicial = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const stockInicial = inventarioInicial.body.find(
      inv => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    const res = await request(app.getHttpServer())
      .post('/reparaciones')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 2,
        descripcion: 'Costura de chaqueta',
      })
      .expect(201);

    reparacionId = res.body.id_reparacion;
    expect(res.body).toHaveProperty('descripcion', 'Costura de chaqueta');

    const inventarioFinal = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const stockFinal = inventarioFinal.body.find(
      inv => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    expect(stockFinal).toBe(stockInicial - 2);
  });

  it('Usuario normal NO puede crear reparaciones', async () => {
    await request(app.getHttpServer())
      .post('/reparaciones')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 1,
        descripcion: 'Intento de usuario normal',
      })
      .expect(403);
  });

  it('Listar reparaciones (cualquier usuario autenticado)', async () => {
    const res = await request(app.getHttpServer())
      .get('/reparaciones')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Obtener una reparación por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/reparaciones/${reparacionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id_reparacion', reparacionId);
  });

  it('Admin puede eliminar una reparación (si no tiene movimientos)', async () => {
    await request(app.getHttpServer())
      .delete(`/reparaciones/${reparacionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204); // 204 No Content
  });

  it('Usuario normal NO puede eliminar una reparación', async () => {
    await request(app.getHttpServer())
      .delete(`/reparaciones/${reparacionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
