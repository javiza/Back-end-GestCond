import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Usuarios E2E', () => {
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

  it('Admin puede listar usuarios', async () => {
    return request(app.getHttpServer())
      .get('/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('Usuario normal NO puede crear usuarios', async () => {
    return request(app.getHttpServer())
      .post('/usuarios')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre_usuario: 'Prohibido',
        rut: '44444444-4',
        email: `noautorizado${Date.now()}@correo.cl`,
        password: 'Test123!',
        rol: 'usuario',
      })
      .expect(403);
  });

  it('Admin puede crear un usuario nuevo', async () => {
    const uniqueEmail = `nuevo${Date.now()}@correo.cl`; 
    const res = await request(app.getHttpServer())
      .post('/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre_usuario: 'Nuevo Usuario',
        rut: '55555555-5',
        email: uniqueEmail,
        password: 'Test123!',
        rol: 'usuario',
      })
      .expect(201);

    expect(res.body.email).toBe(uniqueEmail);
  });

  afterAll(async () => {
    await app.close();
  });
});
