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
  entities: [Usuario],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Usuario);

  // Admin
  const admin = await repo.findOne({ where: { email: 'admin@correo.cl' } });
  if (!admin) {
    await repo.save(
      repo.create({
        nombre: 'Admin',
        rut: '11111111-1',
        email: 'admin@correo.cl',
        password: await bcrypt.hash('Admin123!', 10),
        rol: RolUsuario.ADMIN,
      }),
    );
    console.log('Usuario administrador creado');
  } else {
    console.log('Usuario administrador ya existe');
  }

  // Guardia
  const guardia = await repo.findOne({ where: { email: 'guardia@correo.cl' } });
  if (!guardia) {
    await repo.save(
      repo.create({
        nombre: 'Guardia',
        rut: '22222222-2',
        email: 'guardia@correo.cl',
        password: await bcrypt.hash('Guardia123!', 10),
        rol: RolUsuario.GUARDIA,
      }),
    );
    console.log('Usuario guardia creado');
  } else {
    console.log('ℹUsuario guardia ya existe');
  }

  // Locatario
  const locatario = await repo.findOne({ where: { email: 'locatario@correo.cl' } });
  if (!locatario) {
    await repo.save(
      repo.create({
        nombre: 'Locatario',
        rut: '33333333-3',
        email: 'locatario@correo.cl',
        password: await bcrypt.hash('Locatario123!', 10),
        rol: RolUsuario.LOCATARIO,
      }),
    );
    console.log('Usuario locatario creado');
  } else {
    console.log('ℹUsuario locatario ya existe');
  }

  await AppDataSource.destroy();
  console.log('Seed completado correctamente');
}

seed().catch((err) => {
  console.error('Error ejecutando el seed:', err);
});
