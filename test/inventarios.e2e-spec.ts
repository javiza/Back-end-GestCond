import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Inventarios E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let prendaId: number;
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

    // crear prenda
    const prenda = await request(app.getHttpServer())
      .post('/prendas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Toalla',
        detalle: 'Toalla blanca',
        peso: 0.2,
        tipo: 'baño',
        cantidad: 30,
      })
      .expect(201);

    prendaId = prenda.body.id_prenda;

    // crear unidad clínica
    const unidad = await request(app.getHttpServer())
      .post('/unidades-clinicas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Hospitalización',
        descripcion: 'Unidad de hospitalización general',
      })
      .expect(201);

    unidadId = unidad.body.id_unidad;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Debe reflejar inventario inicial en ropería', async () => {
    const res = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const inventarioPrenda = res.body.find(
      (inv) => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    );

    expect(inventarioPrenda).toBeDefined();
    expect(inventarioPrenda.cantidad).toBe(30);
  });

  it('Debe actualizar inventario tras movimiento a unidad clínica', async () => {
    // crear movimiento
    await request(app.getHttpServer())
      .post('/movimientos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 5,
        desde_tipo: 'ROPERIA',
        hacia_tipo: 'UNIDAD',
        hacia_id_unidad: unidadId,
        descripcion: 'Envío de toallas a Hospitalización',
      })
      .expect(201);

    // verificar inventario ropería bajó
    const res = await request(app.getHttpServer())
      .get('/inventarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const roperia = res.body.find(
      (inv) => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'ROPERIA',
    );
    const unidad = res.body.find(
      (inv) => inv.prenda.id_prenda === prendaId && inv.tipo_entidad === 'UNIDAD',
    );

    expect(roperia.cantidad).toBe(25); // 30 - 5
    expect(unidad.cantidad).toBe(5);   // recibido en Hospitalización
  });

  it('Debe rechazar movimiento que deja stock negativo', async () => {
    await request(app.getHttpServer())
      .post('/movimientos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id_prenda: prendaId,
        cantidad: 9999, // demasiado alto
        desde_tipo: 'ROPERIA',
        hacia_tipo: 'UNIDAD',
        hacia_id_unidad: unidadId,
        descripcion: 'Intento inválido',
      })
      .expect(400); // debe fallar
  });
});
