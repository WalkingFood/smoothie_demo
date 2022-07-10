import { IngredientUnit } from "../entities/ingredient";

export interface UpdateSmoothieDto {
  name?: string
  ingredients?: UpdateIngredientDto[]
}

export interface UpdateIngredientDto {
  id?: number
  delete?: boolean
  name?: string
  quantity?: number
  unit?: IngredientUnit
}