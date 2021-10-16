import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { USER } from '../common/models/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Create User
   * @param userDTO
   */
  async store(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    return await newUser.save();
  }

  /**
   * Get All Users
   */
  async getAll(): Promise<IUser[]> {
    return this.model.find();
  }

  /**
   * Find User
   * @param id
   */
  async find(id: string): Promise<IUser> {
    return this.model.findById(id);
  }

  /**
   * Update User
   * @param id
   * @param userDTO
   */
  async update(id: string, userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const user = { ...userDTO, password: hash };
    return this.model.findByIdAndUpdate(id, user, { new: true });
  }

  /**
   * Destroy User
   * @param id
   */
  async destroy(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      message: 'Deleted',
    };
  }

  /**
   * Get By Username
   * @param username
   */
  async getByUsername(username: string) {
    return this.model.findOne({ username });
  }

  /**
   * Check Password
   * @param password
   * @param passwordDB
   */
  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }
}
