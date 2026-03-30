/// <reference types="express" />

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export {}