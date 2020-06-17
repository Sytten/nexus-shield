export type Context = {
  user?: {
    id: string;
    isAdmin: boolean;
  };
};

export const createContext = (): Context => {
  return {
    user: {
      id: 'sytten',
      isAdmin: false,
    },
  };
};
