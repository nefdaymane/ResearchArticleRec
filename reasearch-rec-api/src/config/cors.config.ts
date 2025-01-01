export const CorsConfig = () => ({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS || 'Content-Type, Accept, Authorization',
  },
});
