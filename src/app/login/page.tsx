"use client";

import Login from '@components/login'

const LoginPage = () => {
  return (
    <section>
      <div className='hero'>
        <div className='absolute left-1/2 top-1/3 transform -translate-y-1/2 -translate-x-1/2' >
          <h1 className='text-6xl'>Music for everyone</h1>
          <p className='text-center py-2 text-base text-[#ddd]'>Search and Play your favorite music simply using your voice.</p>
          
          <div className='flex justify-center align-middle my-10'>
            <Login />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage