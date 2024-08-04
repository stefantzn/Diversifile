// 'use client';

// import Link from 'next/link';
// import Image from 'next/image'; 
// import logo from '../public/logo.png';
// // import { useUser } from '@auth0/nextjs-auth0/client';
// import { useState } from 'react';


// import { json } from "./json";
// const axios = require("axios");

// const Navbar = () => {
//   const [imageUrl, setImageUrl] = useState(null);

//   const call = async () => {
//     console.log("Calling");
//     const res = await axios.get(`http://localhost:5001/getTicker`, { responseType: 'blob' });
//     setImageUrl(URL.createObjectURL(res.data));
//     console.log(imageUrl);
//   }

//   return (
//     <nav className="p-6 w-full">
//       <div className="flex items-center justify-between">
//         <div className="pl-4">
//           <Link href="/">
//             <Image src={logo} alt="Logo" width={40} height={40} /> 
//           </Link>
//         </div>

//         {/* Navigation Links */}
//         <ul className="flex space-x-4">
//           <li>
//             <Link href="/Companies" className="text-white hover:text-gray-300">
//               Companies
//             </Link>
//           </li>
//           <li>
//             <Link href="/About" className="text-white hover:text-gray-300">
//               About
//             </Link>
//           </li>
//           <li>
//             <Link href="/Login" className="text-white hover:text-gray-300">
//               Login
//             </Link>
//           </li>
//           <button onClick={call}>
//             Test
//           </button>
//           <img src={imageUrl} alt="Test" />
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// console.log( Math.floor(7 / 2))

const { exec } = require('child_process');

const company = "TSLA";

const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "Candlestick_Analysis_Polygon('${company}'); exit;"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing MATLAB script: ${error.message}`);
      return; // Removed res.status(500).send('Error running MATLAB script') to focus on the child process handling
    }
    console.log(`MATLAB stdout: ${stdout}`);
})

