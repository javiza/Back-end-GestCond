import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Peticiones E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let usuarioToken: string;
  let unidadId: number;
  let peticionId: number;

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
      .expect(201);
    adminToken = adminLogin.body.access_token;

    // login usuario normal
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(201);
    usuarioToken = userLogin.body.access_token;

    // crear unidad clínica necesaria para las peticiones
    const unidad = await request(app.getHttpServer())
      .post('/unidades-clinicas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Medicina Interna',
        descripcion: 'Unidad de Medicina Interna',
      })
      .expect(201);

    unidadId = unidad.body.id_unidad;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Usuario normal puede crear una petición', async () => {
    const res = await request(app.getHttpServer())
      .post('/peticiones')
      .set('Authorization', `Bearer ${usuarioToken}`)
      .send({
        id_unidad: unidadId,
        detalle: 'Se necesitan 20 sábanas adicionales',
      })
      .expect(201);

    expect(res.body.id_peticion).toBeDefined();
    expect(res.body.unidad.id_unidad).toBe(unidadId);
    peticionId = res.body.id_peticion;
  });

  it('Admin también puede crear una petición', async () => {
    const res = await request(app.getHttpServer())
      .post('/peticiones')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_unidad: unidadId,
        detalle: 'Pedido urgente de 10 batas',
      })
      .expect(201);

    expect(res.body.id_peticion).toBeDefined();
  });

  it('Debe listar todas las peticiones', async () => {
    const res = await request(app.getHttpServer())
      .get('/peticiones')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener una petición por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/peticiones/${peticionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id_peticion).toBe(peticionId);
    expect(res.body.unidad.id_unidad).toBe(unidadId);
  });

  it('Debe eliminar una petición existente', async () => {
    await request(app.getHttpServer())
      .delete(`/peticiones/${peticionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // confirmar que ya no existe
    await request(app.getHttpServer())
      .get(`/peticiones/${peticionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
