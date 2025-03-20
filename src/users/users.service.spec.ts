import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const userData = { name: 'Test User', email: 'test@test.com', password: 'hashed_password' };
      const user: User = { id: '1', ...userData };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(userData);

      expect(result).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user: User = { id: '1', name: 'Test User', email: 'test@test.com', password: 'hashed_password' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
    });

    it('should throw NotFoundException if no user is found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@test.com')).rejects.toThrow(NotFoundException);
      await expect(service.findByEmail('nonexistent@test.com')).rejects.toThrow('Usuário com email nonexistent@test.com não encontrado.');


      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@test.com' } });
    });
  });



  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto = { name: 'Updated User' };
      const existingUser: User = { id: '1', name: 'Old User', email: 'test@test.com', password: 'hashed_password' };
      const updatedUser: User = { id: '1', ...updateUserDto, email: 'test@test.com', password: 'hashed_password' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const updateUserDto = { name: 'Updated User' };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateUserDto)).rejects.toThrowError(
        new NotFoundException('Usuário com id 1 não encontrado.')
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove', () => {
    it('should remove and return a success message', async () => {
      const successResponse = { success: true, message: 'Usuário com id 1 removido com sucesso.' };
      const user: User = { id: '1', name: 'Test User', email: 'test@test.com', password: 'hashed_password' };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(result).toEqual(successResponse);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrowError(
        new NotFoundException('Usuário com id 1 não encontrado.')
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
