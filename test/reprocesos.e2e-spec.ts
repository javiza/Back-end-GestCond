import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reprocesos E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let reprocesoId: number;
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
      .expect(201);
    adminToken = adminLogin.body.access_token;

    // Login usuario normal
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(201);
    userToken = userLogin.body.access_token;

    // Crear prenda base para pruebas de inventario
    const prenda = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Sábana reproceso',
        detalle: 'Sábana blanca con manchas',
        peso: 0.5,
        tipo: 'ropa_cama',
        cantidad: 10,
      })
      .expect(201);

    prendaId = prenda.body.id_prenda;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin puede crear un reproceso', async () => {
    const res = await request(app.getHttpServer())
      .post('/reprocesos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 3,
        descripcion: 'Reproceso por manchas',
        responsable: 'Carlos López',
      })
      .expect(201);

    reprocesoId = res.body.id_reproceso;
    expect(res.body).toHaveProperty('descripcion', 'Reproceso por manchas');
  });

  it('Usuario normal NO puede crear reprocesos', async () => {
    await request(app.getHttpServer())
      .post('/reprocesos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 2,
        descripcion: 'Intento de usuario normal',
      })
      .expect(403);
  });

  it('Listar reprocesos (cualquier usuario autenticado)', async () => {
    const res = await request(app.getHttpServer())
      .get('/reprocesos')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Obtener un reproceso por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/reprocesos/${reprocesoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id_reproceso', reprocesoId);
  });

  it('Admin puede actualizar un reproceso', async () => {
    const res = await request(app.getHttpServer())
      .put(`/reprocesos/${reprocesoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descripcion: 'Reproceso corregido' })
      .expect(200);

    expect(res.body).toHaveProperty('descripcion', 'Reproceso corregido');
  });

  it('Usuario normal NO puede actualizar un reproceso', async () => {
    await request(app.getHttpServer())
      .put(`/reprocesos/${reprocesoId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ descripcion: 'Intento inválido' })
      .expect(403);
  });

  it('El inventario debe disminuir en Ropería al crear un reproceso', async () => {
    // inventario inicial
    const inventarioInicial = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const stockInicial = inventarioInicial.body.find(
      (inv) =>
        inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    // crear reproceso nuevo
    await request(app.getHttpServer())
      .post('/reprocesos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 2,
        descripcion: 'Segundo reproceso',
        responsable: 'Ana Torres',
      })
      .expect(201);

    // inventario actualizado
    const inventarioFinal = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const stockFinal = inventarioFinal.body.find(
      (inv) =>
        inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    )?.cantidad ?? 0;

    expect(stockFinal).toBe(stockInicial - 2);
  });

  it('Admin puede eliminar un reproceso', async () => {
    await request(app.getHttpServer())
      .delete(`/reprocesos/${reprocesoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it('Usuario normal NO puede eliminar un reproceso', async () => {
    await request(app.getHttpServer())
      .delete(`/reprocesos/${reprocesoId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
