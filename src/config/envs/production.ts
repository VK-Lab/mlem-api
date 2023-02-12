export const config = {
  port: 80,

  baseUrl: 'http://localhost:4000/v1',

  jwtSecret: 'PvJjQ52aDBfiRn3jmpg4o31M2sMGOl',

  esms: {
    apiKey: process.env.ESMS_API_KEY,
    secretKey: process.env.ESMS_SECRET_KEY,
    smsType: 2,
    brandName: 'Baotrixemay',
  },
};
