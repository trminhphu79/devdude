import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',

  // Database
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'devdude',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'your-refresh-secret-key-change-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // Cookies
  cookies: {
    maxAgeRefreshToken: parseInt(
      process.env.MAX_AGE_REFRESH_TOKEN || '604800000', // 7 days in ms
      10
    ),
  },
}));
