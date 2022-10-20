import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    autoLoadEntities: true,
    dropSchema: true
  }), UsersModule],
})
export class AppModule {}
