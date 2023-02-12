export const config = {
  port: 4000,

  baseUrl: process.env.BASE_URL || 'http://localhost:4000/v1',

  jwtSecret: 'eGmbntXV1M6y1ypLeNqLk0b5lyAISj',

  esms: {
    apiKey: process.env.ESMS_API_KEY,
    secretKey: process.env.ESMS_SECRET_KEY,
    smsType: '2',
    brandName: 'Baotrixemay',
  },
};
