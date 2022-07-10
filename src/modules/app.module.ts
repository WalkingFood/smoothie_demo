import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../entities/user";
import { Smoothie } from "../entities/smoothie";
import { Ingredient } from "../entities/ingredient";
import { UserModule } from "./user.module";
import { SmoothieModule } from "./smoothie.module";
import { UserInterceptor } from "../interceptors/user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Smoothie, Ingredient],
        synchronize: false
      })
    }),
    UserModule,
    SmoothieModule
  ],
  providers: [{
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor
    }],
})
export class AppModule {}
