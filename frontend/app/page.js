'use client';

import Navbar from "../components/Navbar";
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { toast } from 'react-hot-toast';


const axios = require("axios");


export default function Home() {

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log("This is the user: ", user)
    if (user) {
      axios.post(`http://localhost:5001/createUser`, { username: user.name, email: user.email })
      .then((res) => {
        console.log(res);
      })
    }
  }, [user]);

  const handleSurvey = (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Check if user exists (isLoggedIn should be replaced with your actual check)
    if (user) {
      // User exists, proceed to navigate
      router.push('/survey');
    } else {
      // User does not exist, show toast message
      console.log("hey")
      toast.error("Please log in to build your portfolio.");
    }
  }

  return (
    
    
    <div className="flex min-h-screen flex-col items-center justify-center py-2">

    <link rel="icon" href="/favicon.ico" sizes="any" />

      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-8xl font-bold p-2">
          <span className="gradient-text animate-gradient">Diversifile</span>
        </h1>
        
        {user ? (
        <h3 className="text-xl font-bold text-white pb-20">
          Welcome back {user.name}!
        </h3>
        ) : (
          <h3 className="text-xl font-bold text-white pb-20">
          a simple way to <span className="gradient-text animate-gradient">diversify</span> your assets.
          </h3>
        )}
        {/* <Link href="/survey"> */}
          <button onClick={handleSurvey}
                  className="relative inline-block bg-white text-black text-2xl font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white">
            <span className="relative z-10">Build your portfolio here</span>
            <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        {/* </Link> */}
      </main>

      <footer className="text-white text-xs py-4 w-full text-center">
        <p>Made with ❤️ from Hack the 6ix</p>
      </footer>
    </div>
  );
}
