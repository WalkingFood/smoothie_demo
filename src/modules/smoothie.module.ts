import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Smoothie } from "../entities/smoothie";
import { Ingredient } from "../entities/ingredient";
import { SmoothieService } from "../services/smoothie.service";
import { SmoothieController } from "../controllers/smoothie.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Smoothie]),
    TypeOrmModule.forFeature([Ingredient]),
  ],
  providers: [SmoothieService],
  controllers: [SmoothieController]
})
export class SmoothieModule {}