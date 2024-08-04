"use client"; // Ensure this file is treated as a Client Component

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; // Adjust the import path as needed
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const { user, isLoading } = useUser();

  const [displaySingle, setDisplaySingle] = useState(false);
  const [tickerRes, setTickerRes] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);
  const [latestOHLC, setLatestOHLC] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolioItems();
    }
  }, [user]);

  const fetchPortfolioItems = async () => {
    try {
      console.log("Fetching portfolio items for user:", user);
      // const res = await axios.get(`/api/portfolio?email=${user.email}`);
      const res = await axios.post(`http://localhost:5001/getUserPortfolio`, { email: user.email, username: user.name });

      console.log("Portfolio items:", res.data);
      setPortfolioItems(res.data);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    }
  };

  const viewTicker = async (ticker) => {
    console.log("Viewing ticker:", ticker);
    setLoading(true);
    
    try {
      const res = await axios.post(
        `http://localhost:5001/getTickerImage`,
        { ticker: ticker, username: user.name, email: user.email },
        { responseType: "blob" }
      );

      // const res = await axios.post(
      //   `http://localhost:5001/populateBank`,
      //   { ticker: ticketVal },
      //   { responseType: "blob" }
      // );

      console.log(res.status);
      if (res.status === 204) {
        console.log("No data available");
        setImageMessage(`No data available for "${ticketVal}"`);
        setImageUrl(null);
      } else {
        setImageUrl(URL.createObjectURL(res.data));
        setImageMessage(null);
      }

      const res2 = await axios.post(`http://localhost:5001/getTickerData`, {
        username: user.name,
        email: user.email,
      });
      console.log(res2.data);
      setTickerRes(res2.data);
      setLatestOHLC(res2.data.lastOHLC);
      setPrediction(res2.data.prediction);

      console.log("Ticker data:", tickerRes);
      console.log("Latest OHLC:", latestOHLC);
      console.log("Prediction:", prediction);
    } catch (error) {
      console.log("Some error occurred: ", error.message)
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }

    setDisplaySingle(true);

  }

  useEffect(() => {
    console.log("Portfolio items:", portfolioItems.tickers);
    if (portfolioItems.tickers) {
      portfolioItems.tickers.forEach(async (item) => {
        console.log(`${item}.png`)
      });
    }
  }, [portfolioItems]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      <main className="flex-1 p-4">
      <aside className={`${loading ? "opacity-50" : ""}`}>
        <h1 className="text-2xl font-bold mb-3">My Portfolio</h1>
        {portfolioItems.length === 0 ? (
          <p>No portfolio items found.</p>
        ) : (
          <div className="flex gap-8">
            {loading && (
            <div className="fixed top-0 left-7 w-full h-full flex justify-center items-center">
              <svg
                className="animate-spin h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
            {!displaySingle && portfolioItems.tickers && portfolioItems.tickers.map((item) => (
              <button key={item} onClick={() => {viewTicker(item)}} className="flex flex-col items-center bg-gray-300 p-4 rounded-lg shadow-lg" disabled={loading}>
                  <img
                    src={`${item}.png`}
                    alt={item}
                    width="250"
                    height="250"
                    className="mb-4 rounded-2xl"
                  />
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <p className="text-sm mb-4">{item.description}</p>
                <div
                  // href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-600 hover:text-gray-800"
                >
                  View More
                </div>
              </button>
            ))}
            {displaySingle && (
              <>
                <div className="flex justify-center">
                    <img
                      src={imageUrl}
                      alt="Graph"
                      width="850"
                      height="850"
                      className="rounded-2xl"
                    />
                  </div>
                <div className="flex flex-col justify-between">
                  <div className="ml-4 flex flex-col space-y-1 text-2xl h-full font-extrabold ">
                    {tickerRes && <div className="text-5xl font-black pb-20">Ticker: {tickerRes.ticker}</div>}
                    {prediction && (
                      <div className="pb-10 text-3xl">
                        <div>Latest Pattern: {prediction.latestPattern}</div>
                        <div>Time: {prediction.detectedTime}</div>
                        <div>Pattern Type: <span className={`${prediction.patternType === "Bullish" ? "text-green-500" : "text-red-500"}`}>{prediction.patternType}</span></div>
                        <div>Accuracy Rate: {prediction.successRate} %</div>
                      </div>
                    )}
                    {latestOHLC && (
                      <div>
                        <div>Open: {latestOHLC.open}  </div>
                        <div>Close: {latestOHLC.close}</div>
                        <div>High: {latestOHLC.high}  </div>
                        <div>Low: {latestOHLC.low}</div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setDisplaySingle(false)}
                    className="relative inline-block bg-white text-black text-sm font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
                    disabled={loading}
                  >
                    <span className="relative z-10">Back to Portfolio</span>
                    <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
                <div className="flex justify-center items-start mt-5">
                
              </div>
            </>)}
          </div>
        )}
        </aside>
      </main>
    </div>
  );
};

export default Portfolio;
