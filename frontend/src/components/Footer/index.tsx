import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { ImFacebook } from "react-icons/im";
import { RiFacebookFill, RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";




const Footer = () => {
  return (
    <footer className="flex justify-between items-center h-[11%] pr-8 pl-28 pt-6 pb-6 bg-footerBgColor text-footerTextColor w-full mt-auto mr-3 z-10 fixed bottom-0">
      <div className="flex items-center">
        <img src="/images/logo.png" alt="Logo" className="w-12 h-12 mr-16" />
        <div>
          <h2 className="text-lg font-semibold">123 Market St. #22B</h2>
          <p>CITY, XYZ 44635</p>
        </div>
      </div>
      <div>
        <p className="mb-2 underline">Phone: (434) 546-4356</p>
        <p className='underline'>Email: contact@tms.com</p>
      </div>
      <div className="flex">
        <Link href="#">
          <RiFacebookFill className="mr-4 cursor-pointer text-4xl border-4 border-gray-500 rounded-full p-1" />
        </Link>
        <Link href="#">
          <RiLinkedinFill className="mr-4 cursor-pointer text-4xl border-4 border-gray-500 rounded-full p-1" />
        </Link>
        <Link href="#">
          <RiTwitterXFill className="cursor-pointer text-4xl border-4 border-gray-500 rounded-full p-1" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
