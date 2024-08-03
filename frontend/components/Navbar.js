'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import logo from '../public/logo.png';
import { useUser } from '@auth0/nextjs-auth0/client';

import { useState } from 'react';

import { json } from "./json";
import { useRouter } from 'next/navigation';

import { Toaster, toast } from "react-hot-toast";


const axios = require("axios");

const Navbar = () => {
  const router = useRouter();

  const { user } = useUser();

  const [imageUrl, setImageUrl] = useState(null);

  const call = async () => {
    console.log("Calling");
    const res = await axios.get(`http://localhost:5001/getTickerImage`, { responseType: 'blob' });
    setImageUrl(URL.createObjectURL(res.data));
    console.log(imageUrl);
  }

  const goInvest = () => {
    if (user) {
      router.push('/invest');
    } else {
      console.log("skeg")
      toast.error("Please log in to build your portfolio.");
    }
  }

  return (
    <nav className="p-6 w-full">
      <Toaster />
      <div className="flex items-center justify-between">
        <div className="pl-4">
          <Link href="/">
            <Image src={logo} alt="Logo" width={40} height={40} /> 
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/portfolio" className="text-white hover:text-gray-300">
              Portfolio
            </Link>
          </li>
          <li>
            {/* <Link href="/invest" className="text-white hover:text-gray-300">
              Invest
            </Link> */}
            <button onclick={goInvest} className="text-white hover:text-gray-300">
              Invest
            </button>
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
          {/* <button onClick={call}>
            Test
          </button>
          <img src={imageUrl} alt="Test" /> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;