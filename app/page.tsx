'use client'

import { useRouter } from 'next/navigation'
import { createClient } from './lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      {user ? (
        <div className='mb-4 text-center'>
          <div className='font-semibold text-lg'>Xin chào, {user.email}</div>
          <div className='text-sm text-gray-500'>ID: {user.id}</div>
        </div>
      ) : (
        <div className='mb-4 text-center text-gray-400'>
          Đang tải thông tin người dùng...
        </div>
      )}
      <button
        onClick={handleLogout}
        className='px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-lg'>
        Đăng xuất
      </button>
    </div>
  )
}

export default HomePage
