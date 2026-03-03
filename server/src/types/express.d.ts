declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      username?: string;
      user?: {
        id: string;
      };
    }
  }
}
export {};
