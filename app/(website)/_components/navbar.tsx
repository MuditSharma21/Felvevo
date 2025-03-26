import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export const LandingPageNavbar = () => {
  return (
    <div className='flex w-full justify-between items-center'>
        <div className='text-3xl font-semibold flex items-center gap-x-3'>
            <Image 
                alt='logo'
                src={'/logo.png'}
                height={40}
                width={40}
            />
            Felvevő
        </div>
            <Modal
                title=''
                description=''
                trigger={<Button className='text-base bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:text-black flex gap-x-2'>
                    Login
                </Button>}
            >
                <div className='flex flex-col'>
                    <p className='font-semibold'>Use the dummy credentials below for signing in - </p>
                    <p className='text-sm'>Username - dummyuser_123</p>
                    <p className='text-sm'>Password - dummy_user_123</p>
                </div>
                    <Link href={'/auth/signin'}>
                        <Button>
                            Login
                        </Button>
                    </Link>
            </Modal>
        </div>
  )
}