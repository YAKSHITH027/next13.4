'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Profile from '@components/Profile'
const MyProfile = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const handleEdit = (post) => {
    console.log('clicked')
    router.push(`/update-prompt?id=${post._id}`)
  }
  const handleDelete = async (post) => {
    const hasConfirmed = confirm('are you sure you want to delete this?')
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id}`, {
          method: 'DELETE',
        })
        const filteredPosts = posts.filter((item) => item._id != post._id)
        setPosts(filteredPosts)
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    console.log('profile useeffect', session)
    const fetchPosts = async () => {
      const response = await fetch(`api/users/${session?.user.id}/posts`)
      const data = await response.json()
      console.log('profile', data)
      setPosts(data)
    }
    session?.user.id && fetchPosts()
  }, [])
  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile
