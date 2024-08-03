import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="p-6 w-full">
      <div className="flex items-center justify-between">
        <div className="text-white text-4xl font-bold pl-4">
          <Link href="/" className="hover text-gray-300">
            D
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/Companies" className="text-white hover:text-gray-300">
              Companies
            </Link>
          </li>
          <li>
            <Link href="/About" className="text-white hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/Login" className="text-white hover:text-gray-300">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;