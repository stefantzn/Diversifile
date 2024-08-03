"use client"; // Ensure this file is treated as a Client Component

import 'survey-core/defaultV2.min.css';
import SurveyComponent from '../../components/SurveyComponent';
import Navbar from "../../components/Navbar";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Survey component below the Navbar */}
      <div className="flex-1 flex items-center justify-center p-4">
        <SurveyComponent />
      </div>
    </div>
  );
};

export default Page;