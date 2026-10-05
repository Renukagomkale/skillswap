import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import connectDB from './config/db.js'
import initSocket from './socket.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import matchRoutes from './routes/matchRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong' })
})

const httpServer = createServer(app)
initSocket(httpServer)

const port = process.env.PORT || 5000

connectDB().then(() => {
  httpServer.listen(port, () => console.log(`Server running on port ${port}`))
})
