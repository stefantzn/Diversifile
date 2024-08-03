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
  
  const goPortfolio = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (user) {
      axios.post(`http://localhost:5001/createUser`, { username: user.name, email: user.email })
      .then((res) => {
        console.log(res.data);
        if (res.data.doneSurvey) {
          router.push('/portfolio');
          return
        } else {
          toast.error("Please complete the survey to start building your portfolio.");
        }
      })
    } else {
      toast.error("Please log in to access your portfolio.");
    }
  }

  const goInvest = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (user) {
      axios.post(`http://localhost:5001/createUser`, { username: user.name, email: user.email })
      .then((res) => {
        console.log(res.data);
        if (res.data.doneSurvey) {
          router.push('/invest');
          return
        } else {
          toast.error("Please complete the survey to invest.");
        }
      })
    } else {
      toast.error("Please log in to invest.");
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
            {/* <Link href="/portfolio" className="text-white hover:text-gray-300">
              Portfolio
            </Link> */}
            <button onClick={goPortfolio} className="text-white hover:text-gray-300">
              Portfolio
            </button>
          </li>
          <li>
            {/* <Link href="/invest" className="text-white hover:text-gray-300">
              Invest
            </Link> */}
            <button onClick={goInvest} className="text-white hover:text-gray-300">
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