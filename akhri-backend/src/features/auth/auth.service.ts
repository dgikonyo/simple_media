import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) { }

  async verifyToken(token: string): Promise<any> {
    const startTime = Date.now();
    // Log only a prefix of the token to avoid exposing secrets, but maintain traceability
    const tokenPrefix = token.substring(0, 6) + '...';
    this.logger.debug(`Verifying token: ${tokenPrefix}`);

    try {
      const { data: { user }, error, } = await this.supabase.auth.getUser(token);
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Token verified successfully for user ${user.id} in ${duration}ms`);

      return user;
    } catch (err: any) {
      if (!(err instanceof UnauthorizedException)) {
        this.logger.error(`Unexpected error during token verification for ${tokenPrefix}`, err.stack);
      }

      throw err;
    }
  }
}
