import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Smoothie } from "../entities/smoothie";
import { Ingredient, IngredientUnit } from "../entities/ingredient";
import { User } from "../entities/user";

export interface IngredientData {
  name: string,
  quantity: number,
  unit: IngredientUnit
}

export interface UpdateIngredientData {
  id?: number,
  delete?: boolean,
  name?: string,
  quantity?: number,
  unit?: IngredientUnit
}

@Injectable()
export class SmoothieService {
  constructor(
    @InjectRepository(Smoothie)
    private smoothieRepository: Repository<Smoothie>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  public async requireById(id: number): Promise<Smoothie> {
    return this.smoothieRepository.findOneOrFail({
      where: { id },
      withDeleted: false,
      relations: {
        user: true
      }
    });
  }

  public async requireByIdWithRelations(id: number): Promise<Smoothie> {
    return this.smoothieRepository.findOneOrFail({
      where: { id },
      withDeleted: false,
      relations: {
        user: true,
        ingredients: true
      }
    });
  }

  public async findAllByUser(user: User): Promise<Smoothie[]> {
    return this.smoothieRepository.find({
      where: {
        user: { id: user.id }
      },
      withDeleted: false,
      relations: {
        user: true,
        ingredients: true
      }
    })
  }

  public async create(
    user: User,
    name: string,
    ingredients: IngredientData[]
  ): Promise<Smoothie> {
    const smoothie = await this.smoothieRepository.save({ user, name });
    smoothie.ingredients = await Promise.all(ingredients.map( (ingredient) => {
      return this.ingredientRepository.save({
        ...ingredient,
        smoothie,
      })
    }));
    return smoothie;
  }

  public async delete(id: number) {
    await this.smoothieRepository.softDelete({ id });
  }

  public async update(
    id: number,
    newName?: string,
    newIngredients?: UpdateIngredientData[]
  ): Promise<Smoothie> {
    if (newName) {
      await this.smoothieRepository.update({ id }, { name: newName })
    }
    if (newIngredients && newIngredients.length > 0) {
      for (const newIngredient of newIngredients) {
        // If the intent is to modify an existing ingredient
        if (newIngredient.id) {
          // If we're deleting it, just do that
          if (newIngredient.delete) {
            await this.ingredientRepository.softDelete({ id: newIngredient.id });
          }
          // Otherwise, only update the fields that were included in the request
          else {
            await this.ingredientRepository.update(
              { id: newIngredient.id },
              {
                ...(newIngredient.name && { name: newIngredient.name }),
                ...(newIngredient.unit && { unit: newIngredient.unit }),
                ...(newIngredient.quantity && { quantity: newIngredient.quantity }),
              }
              );
          }
        }
        // If sufficient data is present to create a new ingredient
        else if (
          !newIngredient.delete &&
          newIngredient.name &&
          newIngredient.unit &&
          newIngredient.quantity
        ) {
          await this.ingredientRepository.save({
            ...newIngredient,
            smoothie: { id },
            delete: undefined
          });
        }
      }
    }
    return this.requireByIdWithRelations(id);
  }
}