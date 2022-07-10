import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Ingredient } from "./ingredient";

@Entity()
export class Smoothie {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((_) => User)
  @JoinColumn({name: "user_id", referencedColumnName: "id"})
  public user: User;

  @Column()
  public name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.smoothie)
  public ingredients: Ingredient[];

  @DeleteDateColumn({ name: "deleted_on"})
  public deletedOn: boolean;
}