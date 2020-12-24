import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database.options';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseOptions>('database');

        return {
          type: 'mysql',
          name: 'default',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.name,
          username: dbConfig.user,
          password: dbConfig.pass,
          // synchronize: dbConfig.sync,
          synchronize: true,
          keepConnectionAlive: true,
          entities: ['dist/**/**/*.entity{.ts,.js}']
        };
      },
    }),
  ],
  providers: [],
})
export class DatabaseModule {}