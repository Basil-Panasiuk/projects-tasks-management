import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/users/schemas/user.schema';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import {
  InvalidatedRefreshTokenError,
  RedisService,
} from 'src/redis/redis.service';
import { Response } from 'express';
import { ITokens } from '../interfaces/tokens.interface';
import { TokenType } from './enums/token-type.enum';
import { SameSite } from './enums/same-site.enum';
import { AuthType } from './enums/auth-type.enum';
import { UsersService } from 'src/users/users.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    await this.checkUserExists(signUpDto.email);

    const user = new this.userModel();
    user.email = signUpDto.email;
    user.password = await this.hashingService.hash(signUpDto.password);

    return user.save();
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userModel
      .findOne({
        email: signInDto.email,
      })
      .exec();
    if (!user) {
      throw new UnauthorizedException({
        message: 'User does not exist',
      });
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException({
        message: 'Password does not match',
      });
    }
    const tokens = await this.generateTokens(user);
    return {
      tokens,
      user: this.usersService.toUserResponseDto(user),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken, this.jwtConfiguration);
      const user = await this.usersService.findOne(sub);

      const isValid = await this.redisService.validateRefreshToken(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        this.redisService.invalidateRefreshToken(user.id);
      }
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException({ message: 'Access denied' });
      }
      throw new UnauthorizedException({ message: 'Refresh token expired' });
    }
  }

  async logout(response: Response, userId: string) {
    await this.redisService.invalidateRefreshToken(userId);
    response.clearCookie(TokenType.ACCESS);
    response.clearCookie(TokenType.REFRESH);
  }

  private async checkUserExists(email: string) {
    const existingUser = await this.userModel
      .findOne({
        email,
      })
      .exec();

    if (existingUser) {
      throw new ConflictException({
        message: 'User with this email already exists',
      });
    }
  }

  async generateTokens(user: User): Promise<ITokens> {
    const refreshTokenId = randomUUID();
    const [access, refresh] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.redisService.storeRefreshToken(user.id, refreshTokenId);

    return {
      access,
      refresh,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async persistCookies(response: Response, tokens: ITokens) {
    response.cookie(
      TokenType.ACCESS,
      `${AuthType.BEARER} ${tokens.access}`,
      this.getCookieConfig(this.jwtConfiguration.accessTokenTtl, SameSite.LAX),
    );
    response.cookie(
      TokenType.REFRESH,
      tokens.refresh,
      this.getCookieConfig(
        this.jwtConfiguration.refreshTokenTtl,
        SameSite.STRICT,
      ),
    );
  }

  private getCookieConfig(ttl: number, sameSite: SameSite) {
    return {
      secure: true,
      sameSite,
      maxAge: ttl * 1000,
    };
  }
}
