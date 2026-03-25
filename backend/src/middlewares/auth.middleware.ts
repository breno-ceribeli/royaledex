import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header missing or malformed. Expected: Bearer <token>'
    })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token not found in Authorization header'
    })
    return
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.userId = decodedToken.uid
    next()
  } catch (error: unknown) {  // ✅ alinhado com try
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'auth/id-token-expired'
    ) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired. Please sign in again.'
      })
      return
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
    return
  }
}