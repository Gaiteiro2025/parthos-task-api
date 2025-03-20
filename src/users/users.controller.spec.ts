import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('../auth/guards/jwt-auth.guard');

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };
      const createdUser: User = {
        id: '1',
        ...createUserDto,
        password: 'hashed_password',
      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user: User = { id: '1', name: 'Test User', email: 'test@test.com', password: 'hashed_password' };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await usersController.findByEmail('test@test.com');

      expect(result).toEqual(user);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@test.com');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      mockUsersService.update.mockResolvedValue({ id: '1', email: 'test@test.com', ...updateUserDto, password: 'hashed_password' });

      const result = await usersController.update('1', updateUserDto);

      expect(result).toEqual({ id: '1', email: 'test@test.com', ...updateUserDto, password: 'hashed_password' });
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const successResponse = { success: true, message: 'Usuário removido com sucesso' };
      mockUsersService.remove.mockResolvedValue(successResponse);

      const result = await usersController.remove('1');

      expect(result).toEqual(successResponse);
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
