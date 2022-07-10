import { IngredientUnit } from "../entities/ingredient";

export interface UserResultDto {
  id: number
  uuid: string
}

export interface SmoothieResultDto {
  id: number
  user: UserResultDto
  name: string
  ingredients: IngredientResultDto[]
}

export interface IngredientResultDto {
  id: number
  name: string
  quantity: number
  unit: IngredientUnit
}