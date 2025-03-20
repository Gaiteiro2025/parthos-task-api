import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { User } from '../../src/users/entities/user.entity';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
    let controller: UsersController;

    const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };

    const mockUserRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

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
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtAuthGuard,
                    useValue: mockJwtAuthGuard,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /users', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@test.com', name: 'Test User',
                password: ''
            };
            const result = { ...createUserDto, id: '123' };
            mockUsersService.create.mockResolvedValue(result);

            const response = await controller.create(createUserDto);

            expect(response).toEqual(result);
            expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('GET /users/:email', () => {
        it('should return a user by email', async () => {
            const email = 'test@test.com';
            const result = { id: '123', email, name: 'Test User' };
            mockUsersService.findByEmail.mockResolvedValue(result);

            const response = await controller.findByEmail(email);

            expect(response).toEqual(result);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
        });

        it('should throw NotFoundException if user not found', async () => {
            const email = 'nonexistent@test.com';
            mockUsersService.findByEmail.mockRejectedValue(new NotFoundException(`Usuário com email ${email} não encontrado.`));


            await expect(controller.findByEmail(email)).rejects.toThrow(NotFoundException);
            await expect(controller.findByEmail(email)).rejects.toThrow(`Usuário com email ${email} não encontrado.`);
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update a user', async () => {
            const updateUserDto = { name: 'Updated User' };
            const result = { id: '123', email: 'test@test.com', ...updateUserDto };
            mockUsersService.update.mockResolvedValue(result);

            const response = await controller.update('123', updateUserDto);

            expect(response).toEqual(result);
            expect(mockUsersService.update).toHaveBeenCalledWith('123', updateUserDto);
        });

        it('should throw NotFoundException if user not found', async () => {
            const updateUserDto = { name: 'Updated User' };
            mockUsersService.update.mockRejectedValue(new NotFoundException());

            await expect(controller.update('nonexistent-id', updateUserDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should remove a user', async () => {
            const result = { success: true, message: 'Usuário removido com sucesso.' };
            mockUsersService.remove.mockResolvedValue(result);

            const response = await controller.remove('123');

            expect(response).toEqual(result);
            expect(mockUsersService.remove).toHaveBeenCalledWith('123');
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUsersService.remove.mockRejectedValue(new NotFoundException());

            await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
