import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@utils/database'
import User from '@models/user'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        '126793556678-ona65dft60jvj11u7mfkdd2ps393cir0.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email })
      session.user.id = sessionUser._id.toString()

      return session
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB()

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email })

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          const newUser = new User({
            email: profile.email,
            userName: profile.name.replace(' ', '').toLowerCase(),
            image: profile.picture,
          })
          await newUser.save()
        }

        return true
      } catch (error) {
        console.log('Error checking if user exists: ', error.message)
        return false
      }
    },
  },
})

export { handler as GET, handler as POST }
