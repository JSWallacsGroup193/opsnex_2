import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Configuration Validation Service
 * Enforces required environment variables at application startup
 * Prevents deployment with missing critical configuration
 */
@Injectable()
export class ConfigValidationService implements OnModuleInit {
  private readonly logger = new Logger(ConfigValidationService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.validateRequiredConfig();
  }

  private validateRequiredConfig() {
    const requiredVars = [
      { key: 'JWT_SECRET', description: 'JWT signing secret' },
      { key: 'DATABASE_URL', description: 'PostgreSQL database connection string' },
    ];

    const missingVars: string[] = [];

    for (const { key, description } of requiredVars) {
      const value = this.configService.get<string>(key);
      
      if (!value || value.trim() === '') {
        missingVars.push(`${key} (${description})`);
      }
    }

    if (missingVars.length > 0) {
      const errorMessage = `
╔═══════════════════════════════════════════════════════════════╗
║           CRITICAL CONFIGURATION ERROR                       ║
╚═══════════════════════════════════════════════════════════════╝

Missing required environment variables:

${missingVars.map((v, i) => `  ${i + 1}. ${v}`).join('\n')}

Application cannot start without these variables.
Please set them in your environment or .env file.

For production deployment, ensure all required secrets are configured.
      `;
      
      this.logger.error(errorMessage);
      throw new Error('Missing required environment variables. Check logs for details.');
    }

    // Validate JWT secret strength in production
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    
    if (nodeEnv === 'production' && jwtSecret && jwtSecret.length < 32) {
      this.logger.warn(
        '⚠️  JWT_SECRET is too short for production. Recommended: 32+ characters'
      );
    }

    // Note: CORS validation is now enforced in main.ts
    // Production deployment will fail if ALLOWED_ORIGINS is not set

    this.logger.log('✅ Configuration validation passed');
  }
}
