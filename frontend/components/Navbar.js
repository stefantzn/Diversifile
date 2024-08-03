'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import logo from '../public/logo.png';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar = () => {

  const { user } = useUser();

  return (
    <nav className="p-6 w-full">
      <div className="flex items-center justify-between">
        <div className="pl-4">
          <Link href="/">
            <Image src={logo} alt="Logo" width={40} height={40} /> 
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/Companies" className="text-white hover:text-gray-300">
              Companies
            </Link>
          </li>
          <li>
            <Link href="/About" className="text-white hover:text-gray-300">
              About
            </Link>
          </li>
          {!user ? (
            <li>
              <a className="text-white" href="/api/auth/login">Login</a>
            </li>
          ) : (
            <li>
              <a className="text-white" href="/api/auth/logout">Logout</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;