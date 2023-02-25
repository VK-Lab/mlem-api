export const config = {
  port: 4000,
  isDebuggingOtp: process.env.IS_DEBUGGING_OTP || false,
  isDebugging: process.env.IS_DEBUGGING || false,

  // Mongodb.
  mongodb: {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
  },

  jwtSecret: 'bdK2PNTSV0A7APnHfOkYXib',

  telegram: {
    token: process.env.TELEGRAM_CHANNEL_TOKEN || '',
    channelId: process.env.TELEGRAM_CHANNEL_ID || '',
  },
};
