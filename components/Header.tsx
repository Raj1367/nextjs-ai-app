import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { checkUser } from '@/lib/CheckUser';

const Header = async() => {

    await checkUser()

    return (
        <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">

            <nav className="container mx-auto p-4 flex items-center justify-between">

                <Link href="/">
                    {/* <Image
                        alt="logo"
                        priority
                        width={200}
                        height={60}
                        className="h-12 w-auto object-contain"
                        src={"/logo.png"}
                    /> */}
                    <h3 className='font-bold text-xl'>WEALTH AI</h3>
                </Link>

                <div className="flex items-center space-x-4">

                    <SignedIn >
                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                            <Button variant="outline">
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">dashboard</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedIn >
                        <Link href="/transaction/create" className="text-gray-600 hover:text-blue-600">
                            <Button>
                                <PenBox size={18} />
                                <span className="hidden md:inline">Add transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl={"/dashboard"} >
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton appearance={{ elements: { avatarBox: "custom-avatar-box" } }} />
                    </SignedIn>
                </div>

            </nav>
        </div>
    )
}

export default Header