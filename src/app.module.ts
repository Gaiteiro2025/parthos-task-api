import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { appDataSource } from './ormconfig';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    AuthModule,
    UsersModule,
  ],
  providers: [ConfigService],
})
export class AppModule { }
