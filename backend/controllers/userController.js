import User from '../models/User.js'

export async function getMe(req, res) {
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
}

export async function updateMe(req, res) {
  const { city, teaches, wants } = req.body

  const user = await User.findByIdAndUpdate(
    req.userId,
    { city, teaches, wants },
    { new: true }
  ).select('-password')

  res.json(user)
}

export async function listUsers(req, res) {
  const { skill } = req.query

  const filter = req.userId ? { _id: { $ne: req.userId } } : {}
  if (skill) {
    filter.teaches = { $regex: skill, $options: 'i' }
  }

  const users = await User.find(filter).select('-password')
  res.json(users)
}
