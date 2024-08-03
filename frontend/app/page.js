import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
    
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-8xl font-bold p-2">
          <span className="gradient-text animate-gradient">Diversifile</span>
        </h1>
        <h3 className="text-xl font-bold text-white pb-20">
          a simple way to <span className="gradient-text animate-gradient">diversify</span> your assets.
        </h3>

        <button className="relative inline-block bg-white text-black text-2xl font-bold py-4 px-8 rounded-2xl transition duration-300 hover:bg-gray-500 hover:text-white">
          <span className="relative z-10">Build your portfolio here</span>
          <div className="absolute inset-0 z-0 animated-gradient opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </main>
    </div>
  );
}
