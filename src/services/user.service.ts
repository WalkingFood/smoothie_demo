import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  public async create(uuid: string): Promise<User> {
    return this.userRepository.create({ uuid });
  }

  public async findOrCreate(uuid: string): Promise<User> {
    return this.userRepository.findOneBy({ uuid })
      .then(existingUser => {
        if (existingUser) { return existingUser; }
        else return this.userRepository.save({ uuid })
      })
  }
}