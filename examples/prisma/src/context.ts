import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  user?: {
    id: number;
    isAdmin: boolean;
  };
};

export const createContext = (): Context => {
  return {
    prisma,
    user: {
      id: 1,
      isAdmin: true, // CHANGE THIS TO VERIFY
    },
  };
};
