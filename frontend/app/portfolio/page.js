'use client'; // Ensure this file is treated as a Client Component

import Navbar from "../../components/Navbar";
import { useState } from 'react';

const Page = () => {

  const [ticker, setTicker] = useState("") 

  const searchTicker = () => {
    // Handle the search logic here (e.g., send ticker to an API)
    console.log('Searching for ticker:', ticker);

    // Clear the input field
    setTicker('');
  };

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      <div className="flex flex-1">
        <aside className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          
          <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 rounded-l-md border border-gray-600 bg-gray-900 text-white focus:outline-none"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <button
              onClick={searchTicker}
              className="p-2 bg-blue-600 rounded-r-md border border-blue-700 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
        </aside>

        {/* Main content area */}
        <main className="w-1/2 p-4">
          <h1 className="text-2xl font-bold">Your Portfolio</h1>
          {/* Your main content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Page;
