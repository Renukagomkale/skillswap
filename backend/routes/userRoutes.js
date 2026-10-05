import { Router } from 'express'
import auth from '../middleware/auth.js'
import optionalAuth from '../middleware/optionalAuth.js'
import { getMe, updateMe, listUsers } from '../controllers/userController.js'

const router = Router()

router.get('/', optionalAuth, listUsers)
router.get('/me', auth, getMe)
router.put('/me', auth, updateMe)

export default router
