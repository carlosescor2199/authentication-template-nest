import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUpDto';
import { UserRoles } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      access_token: await this.jwtService.signAsync({
        email: user.email,
        role: user.role,
        sub: user._id,
      }),
    };
  }

  async signUp({
    firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    address,
    document,
    documentType,
    password,
    role,
  }: SignUpDto & { role?: UserRoles }) {
    let user = await this.usersService.findOne(email);

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    user = await this.usersService.findByDocument(document, documentType);

    if (user) {
      throw new UnauthorizedException('Document already exists');
    }

    const salt = await genSalt();
    const pass = await hash(password, salt);

    const newUser = await this.usersService.create({
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      address,
      document,
      documentType,
      password: pass,
      role: role || UserRoles.USER,
    });

    return newUser;
  }

  async refresh() {
    return {
      access_token: await this.jwtService.signAsync({ sub: 'refresh' }),
    };
  }
}
