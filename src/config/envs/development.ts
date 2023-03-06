export const config = {
  port: 4000,

  baseUrl: process.env.BASE_URL || 'http://localhost:4000/v1',

  jwtSecret: process.env.JWT_SECRET || 'dqwdq312ed12d21d12d',

  casper: {
    nodeUrl: process.env.NODE_RPC_URL || 'https://node-clarity-testnet.make.services/rpc',
    networkName: process.env.NETWORK_NAME || 'casper-test',
  },
};
