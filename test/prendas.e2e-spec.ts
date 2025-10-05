import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Prendas E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login Admin
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@correo.cl', password: 'Admin123!' })
      .expect(200); // login devuelve 200 OK

    adminToken = adminLogin.body.access_token;

    // Login Usuario
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(200);

    userToken = userLogin.body.access_token;
  });

  it('Admin puede crear una prenda', async () => {
    const res = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Pantalón Admin',
        detalle: 'De algodón azul',
        peso: 0.5,
        tipo: 'uniforme',
        cantidad: 10,
      })
      .expect(201);

    expect(res.body.nombre).toBe('Pantalón Admin');
  });

  it('Usuario normal también puede crear una prenda', async () => {
    const res = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'Pantalón Usuario',
        detalle: 'De algodón verde',
        peso: 0.6,
        tipo: 'uniforme',
        cantidad: 5,
      })
      .expect(201);

    expect(res.body.nombre).toBe('Pantalón Usuario');
  });

  it('Todos los usuarios autenticados pueden listar prendas', async () => {
    return request(app.getHttpServer())
      .get('/prendas')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('Admin puede actualizar una prenda', async () => {
    const created = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Camisa Admin',
        detalle: 'Camisa blanca',
        peso: 0.3,
        tipo: 'uniforme',
        cantidad: 8,
      });

    const id = created.body.id_prenda;

    const res = await request(app.getHttpServer())
      .put(`/prendas/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Camisa Admin Actualizada' })
      .expect(200);

    expect(res.body.nombre).toBe('Camisa Admin Actualizada');
  });

  it('Usuario normal también puede actualizar una prenda', async () => {
    const created = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'Chaqueta Usuario',
        detalle: 'Chaqueta de lana',
        peso: 0.9,
        tipo: 'uniforme',
        cantidad: 3,
      });

    const id = created.body.id_prenda;

    const res = await request(app.getHttpServer())
      .put(`/prendas/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Chaqueta Usuario Editada' })
      .expect(200);

    expect(res.body.nombre).toBe('Chaqueta Usuario Editada');
  });

  it('Admin puede eliminar (baja lógica) una prenda', async () => {
    const created = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Zapatos Admin',
        detalle: 'Zapatos de cuero',
        peso: 1.2,
        tipo: 'uniforme',
        cantidad: 2,
      });

    const id = created.body.id_prenda;

    await request(app.getHttpServer())
      .delete(`/prendas/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it('Usuario normal también puede eliminar una prenda', async () => {
    const created = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'Zapatos Usuario',
        detalle: 'Zapatos deportivos',
        peso: 1.0,
        tipo: 'uniforme',
        cantidad: 1,
      });

    const id = created.body.id_prenda;

    await request(app.getHttpServer())
      .delete(`/prendas/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
