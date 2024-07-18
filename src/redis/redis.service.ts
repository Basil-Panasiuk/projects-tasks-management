import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  storeRefreshToken(userId: string, tokenId: string) {
    return this.redisRepository.set(this.getUserKey(userId), tokenId);
  }

  async validateRefreshToken(userId: string, tokenId: string) {
    const storedTokenId = await this.redisRepository.get(
      this.getUserKey(userId),
    );

    if (storedTokenId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }

    return true;
  }

  invalidateRefreshToken(userId: string) {
    return this.redisRepository.remove(this.getUserKey(userId));
  }

  private getUserKey(userId: string): string {
    return `user-${userId}`;
  }
}
