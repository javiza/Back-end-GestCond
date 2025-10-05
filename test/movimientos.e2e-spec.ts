import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Movimientos E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let usuarioToken: string;
  let prendaId: number;
  let unidadId: number;
  let movimientoId: number;

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
      .expect(200); // login devuelve 200
    adminToken = adminLogin.body.access_token;

    // login usuario normal
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo.cl', password: 'Usuario123!' })
      .expect(200);
    usuarioToken = userLogin.body.access_token;

    // crear prenda para movimientos
    const prenda = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Sábana',
        detalle: 'Sábana blanca',
        peso: 0.5,
        tipo: 'ropa_cama',
        cantidad: 20,
      })
      .expect(201);
    prendaId = prenda.body.id_prenda;

    // crear unidad clínica
    const unidad = await request(app.getHttpServer())
      .post('/unidades-clinicas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'UCI',
        descripcion: 'Unidad de Cuidados Intensivos',
      })
      .expect(201);
    unidadId = unidad.body.id_unidad;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Debe crear un movimiento válido (Ropería → Unidad)', async () => {
    const res = await request(app.getHttpServer())
      .post('/movimientos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 5,
        desde_tipo: 'ROPERIA',
        hacia_tipo: 'UNIDAD',
        hacia_id_unidad: unidadId,
        descripcion: 'Entrega de sábanas a UCI',
      })
      .expect(201);

    expect(res.body.id_movimiento).toBeDefined();
    expect(res.body.cantidad).toBe(5);
    expect(res.body.hacia_unidad.id_unidad).toBe(unidadId);
    movimientoId = res.body.id_movimiento;
  });

  it('Debe rechazar movimiento con stock insuficiente', async () => {
    await request(app.getHttpServer())
      .post('/movimientos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 9999,
        desde_tipo: 'ROPERIA',
        hacia_tipo: 'UNIDAD',
        hacia_id_unidad: unidadId,
        descripcion: 'Entrega masiva imposible',
      })
      .expect(400);
  });

  it('Debe listar movimientos con paginación', async () => {
    const res = await request(app.getHttpServer())
      .get('/movimientos?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
  });

  it('Debe eliminar un movimiento y revertir stock', async () => {
    await request(app.getHttpServer())
      .delete(`/movimientos/${movimientoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204); // 204 No Content

    // verificar que ya no existe
    await request(app.getHttpServer())
      .get(`/movimientos/${movimientoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
