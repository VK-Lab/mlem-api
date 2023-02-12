import type { Request } from 'express';

type RequestUser = Request & {
  user: {
    userId: string;
    roles: string[];
  };
  id: string;
};
