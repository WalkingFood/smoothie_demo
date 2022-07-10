import {
  BadRequestException,
  Body,
  Controller,
  Delete, ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { SmoothieService } from "../services/smoothie.service";
import { Smoothie } from "../entities/smoothie";
import { UserCtx } from "../interceptors/user.interceptor";
import { User } from "../entities/user";
import { CreateSmoothieDto } from "../dto/create.smoothie.dto";
import { SmoothieResultDto } from "../dto/result.dto";
import { UpdateSmoothieDto } from "../dto/update.smoothie.dto";

@Controller("smoothie")
export class SmoothieController {
  constructor(private readonly smoothieService: SmoothieService) {}

  @Get("all")
  async getMySmoothies(@UserCtx() user?: User): Promise<SmoothieResultDto[]> {
    const validUser = SmoothieController.validateUser(user);
    const smoothies = this.smoothieService.findAllByUser(validUser);
    return SmoothieController.mapSmoothiesToResults(smoothies);
  }

  @Post()
  async createSmoothie(
    @Body() input: CreateSmoothieDto,
    @UserCtx() user?: User
  ): Promise<SmoothieResultDto> {
    const validUser = SmoothieController.validateUser(user);
    SmoothieController.validateSmoothie(input);
    const smoothie = this.smoothieService.create(validUser, input.name, input.ingredients);
    return SmoothieController.mapSmoothieToResult(smoothie);
  }

  @Put(":id")
  async updateSmoothie(
    @Param("id") id: number,
    @Body() input: UpdateSmoothieDto,
    @UserCtx() user?: User
  ): Promise<SmoothieResultDto> {
    const validUser = SmoothieController.validateUser(user);
    return await this.validateSmoothieOwnerAndDo(validUser, id, () => {
      const smoothie = this.smoothieService.update(id, input.name, input.ingredients);
      return SmoothieController.mapSmoothieToResult(smoothie);
    });
  }

  @Delete(":id")
  async deleteSmoothie(
    @Param("id") id: number,
    @UserCtx() user?: User
  ): Promise<void> {
    const validUser = SmoothieController.validateUser(user);
    await this.validateSmoothieOwnerAndDo(validUser, id, () => {
      this.smoothieService.delete(id);
    });
  }

  private static validateUser(user?: User): User {
    if (user) {
      return user;
    }
    else throw new BadRequestException("No user defined! This should not be reachable!");
  }

  private static validateSmoothie(input: CreateSmoothieDto) {
    if (input.name.length < 1 || input.name.length > 100) {
      throw new BadRequestException("Smoothie name must be between 1 to 100 characters!");
    }
    if (input.ingredients.length < 1 || input.ingredients.length > 100) {
      throw new BadRequestException("Smoothie ingredient list must be between 1 to 100 entries!");
    }
  }

  private validateSmoothieOwnerAndDo<T>(user: User, id: number, action: () => T): Promise<T> {
    return this.smoothieService.requireById(id)
      .then(smoothie => {
        if (smoothie.user.id == user.id) {
          return action();
        }
        else {
          throw new ForbiddenException("You cannot delete that smoothie");
        }
      })
      .catch(_ => {
        throw new NotFoundException(`Could not find smoothie of id ${id}`);
      });
  }

  private static async mapSmoothieToResult(smoothie: Promise<Smoothie>): Promise<SmoothieResultDto> {
    return smoothie.then( sm => this.doMapSmoothieToResult(sm));
  }

  private static async mapSmoothiesToResults(smoothies: Promise<Smoothie[]>): Promise<SmoothieResultDto[]> {
    return smoothies.then( sms => sms.map( sm => this.doMapSmoothieToResult(sm) ) );
  }

  private static doMapSmoothieToResult(sm: Smoothie): SmoothieResultDto {
    return {
      id: sm.id,
      user: { ...sm.user },
      name: sm.name,
      ingredients: sm.ingredients
        ?.filter( (ing) => !ing.deletedOn)
        ?.map( (ing) => {
          return {
            ...ing,
            smoothie: undefined,
            deletedOn: undefined
          };
        })
    }
  }
}