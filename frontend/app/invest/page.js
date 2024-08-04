"use client"; // Ensure this file is treated as a Client Component

import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
// import { set } from "@auth0/nextjs-auth0/dist/session";

import { toast } from "react-hot-toast";
// import { set } from "@auth0/nextjs-auth0/dist/session";

const axios = require("axios");

const Page = () => {
  const [ticker, setTicker] = useState("");
  const [tickerRes, setTickerRes] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);
  const [latestOHLC, setLatestOHLC] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  const { user } = useUser();

  const searchTicker = async (ticketVal="") => {
    setLoading(true);
    if (ticker) {
      ticketVal = ticker;
    }
    console.log("ew")
    setTicker("");

    try {
      const res = await axios.post(
        `http://localhost:5001/getTickerImage`,
        { ticker: ticketVal, username: user.name, email: user.email },
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
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTickerToPortfolio = async () => {
    try {
      await axios.post(`http://localhost:5001/addTickerToPortfolio`, {
        ticker: tickerRes.ticker,
        username: user.name,
        email: user.email,
      });
      toast.success(`${tickerRes.ticker} added to portfolio`);
      setImageMessage(null);
      setImageUrl(null);
      setTickerRes(null);
    } catch (error) {
      console.error("Error adding ticker to portfolio:", error)
      toast.error("Error adding ticker to portfolio");
    }}

  useEffect(() => {
    if (user) {
      console.log("This is the user: ", user);

      let riskAversionScore;
      axios.post(`http://localhost:5001/getScore`, { username: user.name, email: user.email })
      .then((res) => {
        console.log(res.data);
        riskAversionScore = res.data.riskAversionScore;

        axios.post(`http://localhost:5001/getRecommendations`, { username: user.name, email: user.email, riskAversionScore: riskAversionScore })
        .then((res) => {
          console.log(res.data);
          setRecommendations(res.data);
          if (tickerRes) {
            const recommendedList = res.data.filter(item => item !== tickerRes.ticker);
            setRecommendations(recommendedList);
          }
        })
      })
    }
    
    // console.log(res.data);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      <div className="flex flex-1">
        <aside className={`w-1/2 p-4 ${loading ? "opacity-50" : ""}`}>
          <h1 className="text-2xl font-bold">Search</h1>
          <div className="flex items-center my-5">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 rounded-l-md border border-gray-600 bg-gray-900 text-white focus:outline-none"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
            <button
              onClick={searchTicker}
              className="p-2 bg-blue-600 rounded-r-md border border-blue-700 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-10 w-10 text-white"
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

          {imageUrl && (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Graph"
                width="600"
                height="600"
                className="rounded-2xl"
              />
            </div>
          )}

          {imageUrl && (
            <div className="flex justify-center items-start mt-5">
              <button
                onClick={addTickerToPortfolio}
                className="relative inline-block bg-white text-black text-sm font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
                disabled={loading}
              >
                <span className="relative z-10">Add to your portfolio</span>
                <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <div className="ml-4 flex flex-col space-y-1 text-xs">
                {tickerRes && <div className="text-base font-black pb-4">Ticker: {tickerRes.ticker}</div>}
                {prediction && (
                  <div className="text-xs font-extrabold pb-2">
                    <div>Latest Pattern: {prediction.latestPattern} | Time: {prediction.detectedTime}</div>
                    <div>Pattern Type: {prediction.patternType} | Accuracy Rate: {prediction.successRate} %</div>
                  </div>
                )}
                {latestOHLC && (
                  <div>
                    <div>Open: {latestOHLC.open} | Close: {latestOHLC.close}</div>
                    <div>High: {latestOHLC.high} | Low: {latestOHLC.low}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {imageMessage && <div>{imageMessage}</div>}
        </aside>

        <main className="w-1/2 p-4 crater-effect rounded-xl">
          <h1 className="text-2xl font-bold mb-6">Recommendations</h1>
          <div className="flex justify-center flex-wrap gap-8 overflow-y-auto max-h-[75vh]">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={`${recommendation}.png`}
                  alt="Graph"
                  width="250"
                  height="250"
                  className="mb-2 rounded-2xl"
                />
                {/* Uncomment if you have a specific message for each image */}
                {/* <div>{imageMessage}</div> */}
                <button
                  onClick={() => { searchTicker(recommendation); }}
                  className="relative inline-block bg-white text-black text-xs font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white"
                  disabled={loading}
                >
                  <span className="relative z-10">{recommendation}</span>
                  <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
