import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';


import { UserDocument, User } from './schemas/user.schema';
import {
  CreateUserDto,
  ProfileDto,
} from './dto';

import { Logger, RoleEnum } from '@/common';

const encryptPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(UserService.name);

  }

  public async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  public async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id);
  }

  public async getProfile(id: Types.ObjectId): Promise<ProfileDto> {
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) {
      throw new BadRequestException('user_not_found');
    }

    return {
      id: foundUser._id,
      phoneNumber: foundUser.phoneNumber,
      walletAddress: foundUser.walletAddress,
    };
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  public async findByVerifiedPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber: phone, isVerifyPhone: true });
  }

  public async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.userModel.findOne({ walletAddress });
  }

  public async findOrCreateUserByWalletAddress(walletAddress: string): Promise<User> {
    const foundUser = await this.userModel.findOne({ walletAddress });
    if (foundUser) {
      return foundUser;
    }

    const user = await this.userModel.create({
      walletAddress,
    });

    return user;
  }

  public async updateNewPassword(
    userId: string,
    password: string,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      {
        password: await encryptPassword(password),
      },
    );
  }

  public async findUserWithRole(walletAddress: string, role: RoleEnum): Promise<User | null> {
    return this.userModel.findOne({ walletAddress, role });
  }

  public async create(registerDto: CreateUserDto): Promise<User> {
    const oldUser = await this.userModel.findOne({ walletAddress: registerDto.walletAddress });
    if (!_.isEmpty(oldUser)) {
      throw new BadRequestException('wallet_does_exist', 'Wallet does exist');
    }

    const user = await this.userModel.create({
      ...registerDto,
    });

    return user;
  }

  public async updatePhoneNumber(userId: Types.ObjectId, phoneNumber: string): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      {
        phoneNumber,
      },
    );
  }

  public async markPhoneVerified(userId: Types.ObjectId, verified: boolean): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      {
        isVerifyPhone: verified,
      },
    );
  }

  public async validatePassword(
    userPassword: string,
    password: string,
  ): Promise<boolean> {
    if (!password) {
      throw new BadRequestException('old_password_is_not_correct');
    }

    return bcrypt.compare(password, userPassword);
  }
}
