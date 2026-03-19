'use client'

import { useRouter } from 'next/navigation'
import { createClient } from './lib/supabase/client'
import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'

const HomePage = () => {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    fetchSession()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      {loading ? (
        <div className='mb-4 text-center text-gray-400'>
          Đang tải thông tin session...
        </div>
      ) : session ? (
        <div className='mb-4 text-left w-full max-w-xl break-words bg-gray-100 p-4 rounded shadow'>
          <div className='font-semibold text-lg mb-2'>Session Supabase:</div>
          <pre className='text-xs whitespace-pre-wrap'>
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      ) : (
        <div className='mb-4 text-center text-gray-400'>
          Không có session Supabase.
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
