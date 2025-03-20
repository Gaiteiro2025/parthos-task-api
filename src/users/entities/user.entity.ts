import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Identificador único do usuário', readOnly: true })
    id: string;

    @Column()
    @ApiProperty({ description: 'Nome do usuário' })
    name: string;

    @Column({ unique: true })
    @ApiProperty({ description: 'Email do usuário', uniqueItems: true })
    email: string;

    @Column()
    @ApiProperty({ description: 'Senha criptografada do usuário', writeOnly: true })
    password: string;
}
