import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Smoothie } from "./smoothie";

export enum IngredientUnit {
  CUP = "CUP",
  OZ = "OZ",
  GRAM = "GRAM",
  LB = "LB",
  GALLON = "GALLON"
}

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((_) => Smoothie)
  @JoinColumn({name: "smoothie_id", referencedColumnName: "id"})
  public smoothie: Smoothie;

  @Column()
  public name: string;

  @Column()
  public quantity: number;

  @Column()
  public unit: IngredientUnit;

  @DeleteDateColumn({ name: "deleted_on"})
  public deletedOn: boolean;
}