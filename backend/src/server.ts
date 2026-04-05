import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import apiRoutes from './routes/index'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000)
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 90)

// Health check endpoint (sem middlewares)
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'RoyaleDex backend is running' })
})

// Rate limiter global por IP
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  message: { error: 'Too many requests, please try again later.' }
})

// Middlewares
app.use(helmet())
app.use(limiter)
app.use(express.json())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
}))

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// API Routes
app.use('/api', apiRoutes)

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})
