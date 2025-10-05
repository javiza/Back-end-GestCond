import { DataSource } from 'typeorm';
import { RolUsuario, Usuario } from '../modules/usuarios/usuarios.entity';

import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jona',
  password: '1234',
  database: 'roperia_db',
  entities: [Usuario], // <-- Agrégala aquí
  synchronize: false, // aca true solo para desarrollo en caso de que cree tablas automáticamente
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Usuario);

  const adminExists = await repo.findOne({ where: { email: 'admin@correo.cl' } });
  const userExists = await repo.findOne({ where: { email: 'usuario@correo.cl' } });

  if (!adminExists) {
    const admin = repo.create({
      nombre_usuario: 'Admin',
      rut: '11111111-1',
      email: 'admin@correo.cl',
      password: await bcrypt.hash('Admin123!', 10),
      rol: RolUsuario.ADMIN, 
    });
    await repo.save(admin);
    console.log('Usuario administrador creado');
  }
  if (!userExists) {
    const usuario = repo.create({
      nombre_usuario: 'Usuario',
      rut: '22222222-2',
      email: 'usuario@correo.cl',
      password: await bcrypt.hash('Usuario123!', 10),
      rol: RolUsuario.USUARIO,
    });
    await repo.save(usuario);
    console.log('Usuario normal creado');
  }
  await AppDataSource.destroy();
}

seed();
