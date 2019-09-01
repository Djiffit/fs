import * as mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject._id
      delete returnedObject.__v
    },
  })

export const User = mongoose.model('User', userSchema)
