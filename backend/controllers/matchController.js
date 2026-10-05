import Match from '../models/Match.js'
import Message from '../models/Message.js'

export async function requestMatch(req, res) {
  const { recipientId } = req.body

  if (recipientId === req.userId) {
    return res.status(400).json({ message: 'You cannot match with yourself' })
  }

  const existing = await Match.findOne({
    requester: req.userId,
    recipient: recipientId,
  })
  if (existing) {
    return res.status(409).json({ message: 'Match request already sent' })
  }

  const match = await Match.create({ requester: req.userId, recipient: recipientId })
  res.status(201).json(match)
}

export async function respondToMatch(req, res) {
  const { status } = req.body

  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Status must be accepted or declined' })
  }

  const match = await Match.findOneAndUpdate(
    { _id: req.params.id, recipient: req.userId },
    { status },
    { new: true }
  )

  if (!match) {
    return res.status(404).json({ message: 'Match not found' })
  }

  res.json(match)
}

export async function listPendingRequests(req, res) {
  const requests = await Match.find({
    recipient: req.userId,
    status: 'pending',
  }).populate('requester', 'name city')

  res.json(requests)
}

export async function listMatches(req, res) {
  const matches = await Match.find({
    $or: [{ requester: req.userId }, { recipient: req.userId }],
    status: 'accepted',
  })
    .populate('requester', 'name city')
    .populate('recipient', 'name city')

  res.json(matches)
}

export async function getMessages(req, res) {
  const messages = await Message.find({ match: req.params.id }).sort('createdAt')
  res.json(messages)
}
