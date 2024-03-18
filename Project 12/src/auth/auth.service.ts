import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException, NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Repository, EntityId } from "redis-om";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import { RedisClientService } from "src/redis-client/redis-client.service";
import { IJwt } from "../config/interfaces/jwt.interface";
import { User, userSchema } from "./entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly usersRepository: Repository;
  private readonly jwt: IJwt;

  constructor(
    private readonly redisClient: RedisClientService,
    private readonly configService: ConfigService
  ) {
    this.usersRepository = new Repository(userSchema, redisClient.getClient());
    this.jwt = configService.get<IJwt>("jwt");
  }

  public async onModuleInit() {
    await this.usersRepository.createIndex();
  }


  private async generateToken(user: User): Promise<string> {
    return new Promise((resolve) => {
      sign(
        { id: user[EntityId] },
        this.jwt.secret,
        { expiresIn: this.jwt.time },
        (error, token) => {
          if (error)
            throw new InternalServerErrorException("Something went wrong");

          resolve(token);
        }
      );
    });
  }


  public async registerUser({
                              email,
                              name,
                              password1,
                              password2
                            }: RegisterDto): Promise<string> {

    // Check if passwords match
    if (password1 !== password2) {
      throw new BadRequestException("Passwords do not match");
    }

    email = email.toLowerCase(); // so its always consistent and lowercase.
    const count = await this.usersRepository
      .search()
      .where("email")
      .equals(email)
      .count();

    // We use the count to check if the email is already in use.
    if (count > 0) {
      throw new BadRequestException("Email already in use");
    }

    // Create the user with a hashed password
    const user = new User();
    user.email = email;
    user.name = name // Capitalize and trim the name
      .trim()
      .replace(/\n/g, " ")
      .replace(/\s\s+/g, " ")
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
    user.password = await hash(password1, 10);
    user.createdAt = new Date();

    await this.usersRepository.save({ ...user });
    return this.generateToken(user); // Generate an access token for the user
  }

  public async login({ email, password }: LoginDto): Promise<string> {
    // Find the first user with a given email
    const user = await this.usersRepository
      .search()
      .where('email')
      .equals(email.toLowerCase())
      .first();

    // Check if the user exists and the password is valid
    // @ts-ignore
     if (!user || !(await compare(password, user.password))){
      throw new UnauthorizedException("Invalid credentials");
    }

    // @ts-ignore
    return this.generateToken(user); // Generate an access token for the user
  }


  public async userById(id: string): Promise<User> {
    const user = await this.usersRepository.fetch(id);

    if (!user || !user.email) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user[EntityId],
      ...user,
    } as User;
  }


  public async remove(id: string, password: string): Promise<string> {
    const user = await this.userById(id);

    if (!(await compare(password, user.password))) {
      throw new BadRequestException("Invalid password");
    }

    await this.usersRepository.remove(id);

    return 'User deleted successfully';
  }


}
