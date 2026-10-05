import jwt from 'jsonwebtoken'

export default function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
      req.userId = payload.id
    } catch {
      // not logged in, continue as a visitor
    }
  }
  next()
}
