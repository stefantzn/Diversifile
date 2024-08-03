'use client'; // Ensure this file is treated as a Client Component

// import { set } from "@auth0/nextjs-auth0/dist/session";
import { useUser } from '@auth0/nextjs-auth0';
import Navbar from "../../components/Navbar";
import { useState } from 'react';

const axios = require("axios");

const Page = () => {

  const [ticker, setTicker] = useState("") 

  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);

  const searchTicker = async () => {
    // Handle the search logic here (e.g., send ticker to an API)
    console.log('Searching for ticker:', ticker);
    const ticketVal = ticker;

    // Clear the input field
    setTicker('');

    const res = await axios.post(`http://localhost:5001/getTicker`, { ticker: ticketVal }, { responseType: 'blob' });
    if (res.status === 204) {
      console.log('No data available for the given date range.');
      setImageMessage(`No data available for "${ticketVal}"`);
      setImageUrl(null);
    } else {
      setImageUrl(URL.createObjectURL(res.data));
      setImageMessage(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      <div className="flex flex-1">
        <aside className="w-1/2 p-4">
          <h1 className="text-2xl font-bold ">Search</h1>
          
          <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 rounded-l-md border border-gray-600 bg-gray-900 text-white focus:outline-none my-5"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
            <button
              onClick={searchTicker}
              className="p-2 bg-blue-600 rounded-r-md border border-blue-700 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>

            
            {imageUrl && <img src={imageUrl} alt="Graph" width="600" height="600" class="rounded-2xl"/>}
            
                {imageUrl && (
                    <button
                    className=" mt-5 relative inline-block bg-white text-black text-2xl font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
                    >
                    <span className="relative z-10">Add to your portfolio</span>
                    <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                )}
    
            {imageMessage && <div>{imageMessage}</div>}
           

        </aside>

        

        <main className="w-1/2 p-4">
  <h1 className="text-2xl font-bold mb-3">Recommendations</h1>

  <div className="flex flex-wrap gap-8">
    {/* First set of images and messages */}
    <div className="flex flex-col items-center">
      {imageUrl && <img src={imageUrl} alt="Graph" width="250" height="250" className="mb-4" class="rounded-2xl"/>}
      {imageMessage && <div>{imageMessage}</div>}
      <button
        className=" mt-5 relative inline-block bg-white text-black text-xs font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
        >
        <span className="relative z-10">Add to your portfolio</span>
        <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    </div>

    {/* Second set of images and messages */}
    <div className="flex flex-col items-center">
      {imageUrl && <img src={imageUrl} alt="Graph" width="250" height="250" className="mb-4" class="rounded-2xl"/>}
      {imageMessage && <div>{imageMessage}</div>}
      <button
        className=" mt-5 relative inline-block bg-white text-black text-xs font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
        >
        <span className="relative z-10">Add to your portfolio</span>
        <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    </div>

    {/* Third set of images and messages */}
    <div className="flex flex-col items-center">
      {imageUrl && <img src={imageUrl} alt="Graph" width="250" height="250" className="mb-4" class="rounded-2xl"/>}
      {imageMessage && <div>{imageMessage}</div>}
      <button
        className=" mt-5 relative inline-block bg-white text-black text-xs font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
        >
        <span className="relative z-10">Add to your portfolio</span>
        <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    </div>

    {/* Fourth set of images and messages */}
    <div className="flex flex-col items-center">
      {imageUrl && <img src={imageUrl} alt="Graph" width="250" height="250" className="mb-4" class="rounded-2xl"/>}
      {imageMessage && <div>{imageMessage}</div>}
      <button
        className=" mt-5 relative inline-block bg-white text-black text-xs font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
        >
        <span className="relative z-10">Add to your portfolio</span>
        <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    </div>
  </div>
</main>


    
      </div>
    </div>
  );
};

export default Page;
