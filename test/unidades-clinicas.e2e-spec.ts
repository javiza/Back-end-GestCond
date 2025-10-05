import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Unidades Clínicas E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let usuarioToken: string;
  let unidadId: number;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin puede crear una unidad clínica', async () => {
    const res = await request(app.getHttpServer())
      .post('/unidades-clinicas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Pediatría',
        descripcion: 'Unidad de pediatría',
      })
      .expect(201);

    expect(res.body.id_unidad).toBeDefined();
    expect(res.body.nombre).toBe('Pediatría');
    unidadId = res.body.id_unidad;
  });

  it('Usuario normal también puede crear unidad clínica', async () => {
    const res = await request(app.getHttpServer())
      .post('/unidades-clinicas')
      .set('Authorization', `Bearer ${usuarioToken}`)
      .send({
        nombre: 'Oncología',
        descripcion: 'Unidad de oncología',
      })
      .expect(201);

    expect(res.body.id_unidad).toBeDefined();
    expect(res.body.nombre).toBe('Oncología');
  });

  it('Debe listar todas las unidades clínicas', async () => {
    const res = await request(app.getHttpServer())
      .get('/unidades-clinicas')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener una unidad clínica por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/unidades-clinicas/${unidadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id_unidad).toBe(unidadId);
    expect(res.body.nombre).toBe('Pediatría');
  });

  it('Debe eliminar una unidad clínica', async () => {
    await request(app.getHttpServer())
      .delete(`/unidades-clinicas/${unidadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // confirmar que ya no existe
    await request(app.getHttpServer())
      .get(`/unidades-clinicas/${unidadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
