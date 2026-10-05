import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from './models/Message.js'

export default function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
  })

  io.use((socket, next) => {
    try {
      const payload = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET)
      socket.userId = payload.id
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('join-match', (matchId) => {
      socket.join(matchId)
    })

    socket.on('send-message', async ({ matchId, text }) => {
      const message = await Message.create({
        match: matchId,
        sender: socket.userId,
        text,
      })
      io.to(matchId).emit('new-message', message)
    })
  })

  return io
}
