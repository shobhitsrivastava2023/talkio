
import Link from 'next/link';
import React from 'react';
import { validateRequest } from '@/lib/validate-request';
import { Button } from '@/components/ui/button';
import { lucia } from '@/lib/auth';

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const Navbar = async () => {
    
    

    const { user } = await validateRequest();

    return (
        <div className="flex flex-row max-w-full mt-5 gap-5">
            <div className="m-5 flex flex-row w-full">
                <Link href = {'/'}><h1 className="text-4xl font-bold">Talkio</h1></Link>
                
                <span className="text-gray-600 text-sm font-normal"> beta</span>
            </div>

            <div className="flex flex-row justify-end items-center w-full gap-5 m-4">
            <div>
                    <Link href="/Dashboard" className='text-lg font-semibold underline'>Dashboard</Link>
                </div>

                <div>
                    <Link href="/About">About</Link>
                </div>


                <div>
                    {user ? (
                      <form action={logout}>
                      <button>Sign out</button>
                  </form>
                    ) : (
                        <Link href="/loginPage">Login</Link>
                    )}
                </div>
                
            </div>
        </div>
    );
};
async function logout(): Promise<void> {
	"use server";
	const { session } = await validateRequest();
    if (!session) {
        throw new Error("Unauthorized");
    }
	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/loginPage");
}
export default Navbar;
