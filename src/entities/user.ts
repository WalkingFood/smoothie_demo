import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Smoothie } from "./smoothie";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public uuid: string;

  @OneToMany(() => Smoothie, (smoothie) => smoothie.user)
  public smoothies: Promise<Smoothie[]>;
}