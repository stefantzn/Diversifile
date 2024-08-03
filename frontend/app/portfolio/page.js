"use client"; // Ensure this file is treated as a Client Component

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; // Adjust the import path as needed
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      fetchPortfolioItems();
    }
  }, [user]);

  const fetchPortfolioItems = async () => {
    try {
      const res = await axios.get(`/api/portfolio?email=${user.email}`);
      setPortfolioItems(res.data);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-3">My Portfolio</h1>

        {portfolioItems.length === 0 ? (
          <p>No portfolio items found.</p>
        ) : (
          <div className="flex flex-wrap gap-8">
            {portfolioItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    width="250"
                    height="250"
                    className="mb-4 rounded-2xl"
                  />
                )}
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <p className="text-sm mb-4">{item.description}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                >
                  View More
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
