import Link from 'next/link'

export default function LoginErrorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-xl font-semibold'>Đăng nhập thất bại</h1>
        <p className='mt-2 text-sm text-gray-500'>
          Vui lòng thử lại hoặc liên hệ quản trị viên.
        </p>

        <Link href='/' className='mt-4 inline-block text-sm underline'>
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
