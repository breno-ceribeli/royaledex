import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiter — 30 requisições por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
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

// Endpoint de teste
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'RoyaleDex backend is running' })
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})
