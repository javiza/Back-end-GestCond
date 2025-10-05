import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un usuario y hashear el password', async () => {
    const createDto = {
      nombre_usuario: 'Juan Pérez',
      rut: '12345678-9',
      email: 'juan@correo.cl',
      password: 'Password123!',
      rol: 'usuario',
    };

    // Mock: repo.create devuelve el DTO, repo.save devuelve el usuario con id y password hasheado
    (repo.create as jest.Mock).mockReturnValue(createDto);
    (repo.save as jest.Mock).mockImplementation(async (user) => ({
      ...user,
      id: 'uuid',
      password: await bcrypt.hash(user.password, 10),
    }));

    const usuario = await service.create(createDto as any);
    expect(usuario.password).not.toEqual('Password123!');
    expect(usuario.nombre_usuario).toEqual('Juan Pérez');
    expect(usuario.email).toEqual('juan@correo.cl');
    expect(usuario.rut).toEqual('12345678-9');
    expect(usuario.rol).toEqual('usuario');
  });
});