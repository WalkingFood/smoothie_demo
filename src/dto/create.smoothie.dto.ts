import { IngredientUnit } from "../entities/ingredient";

export interface CreateSmoothieDto {
  name: string
  ingredients: CreateIngredientDto[]
}

export interface CreateIngredientDto {
  name: string
  quantity: number
  unit: IngredientUnit
}