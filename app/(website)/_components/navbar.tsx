import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export const LandingPageNavbar = () => {
  return (
    <div className='flex w-full justify-between items-center'>
        <div className='text-3xl font-semibold flex items-center gap-x-3'>
            {/* <Menu className='w-8 h-8'/> */}
            <Image 
                alt='logo'
                src={'/logo.png'}
                height={40}
                width={40}
            />
            Felvevő
        </div>
        {/* <div className='hidden gap-x-10 items-center lg:flex'>
            <Link
                href={'/'}
                className='bg-[#005F4C] py-2 px-5 font-semibold text-llg rounded-full hover:bg-[#005F4C]/80'
            >
                Home
            </Link>
            <Link href={'/'}>Pricing</Link>
            <Link href={'/'}>Contact</Link>
        </div> */}
            <Link href={'/auth/signin'}>
                <Button className='text-base bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:text-black flex gap-x-2'>
                    Login
                </Button>
            </Link>
    </div>
  )
}