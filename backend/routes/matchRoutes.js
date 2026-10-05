import { Router } from 'express'
import auth from '../middleware/auth.js'
import {
  requestMatch,
  respondToMatch,
  listMatches,
  listPendingRequests,
  getMessages,
} from '../controllers/matchController.js'

const router = Router()

router.use(auth)
router.post('/', requestMatch)
router.patch('/:id', respondToMatch)
router.get('/', listMatches)
router.get('/requests', listPendingRequests)
router.get('/:id/messages', getMessages)

export default router
