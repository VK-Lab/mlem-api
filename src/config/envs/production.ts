export const config = {
  port: 80,

  baseUrl: 'http://localhost:4000/v1',

  jwtSecret: process.env.JWT_SECRET,

  casper: {
    nodeUrl: process.env.NODE_RPC_URL || 'https://node-clarity-testnet.make.services/rpc',
    networkName: process.env.NETWORK_NAME || 'casper-test',
  },
};
