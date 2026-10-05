import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    city: { type: String, default: '' },
    teaches: { type: [String], default: [] },
    wants: { type: [String], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
