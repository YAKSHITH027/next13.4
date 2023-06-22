import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)
  if (isConnected) {
    console.log('mongodb is already connected')
    return
  }
  try {
    await mongoose.connect(
      'mongodb+srv://yakshith:yakshith@cluster0.utgd1da.mongodb.net/prompt?retryWrites=true&w=majority'
    )
    isConnected = true
    console.log('mongodb connected')
  } catch (error) {
    console.log(error.messge)
  }
}
