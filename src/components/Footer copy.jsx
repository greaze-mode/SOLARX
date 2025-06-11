import React from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import logo from "/logo.svg";

const Footer = ({
  centerTop = "SolarX",
  centerBottom = "Startup Challenge",
}) => {
  return (
    <footer id="footer" className="bg-[#f2f3f5] text-gray-900 py-6 sm:py-8">
      <div className=" max-w-screen-2xl mx-auto px-4 sm:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 sm:mb-8">
          {/* Logo & Description */}
          <div className="text-center sm:text-left col-span-1">
            <div className="flex items-center mb-3 justify-center sm:justify-start">
              <div className="flex flex-col md:flex-row items-center mb-3 justify-center sm:justify-between ">
                <img
                  src={logo}
                  alt="International Solar Alliance Logo"
                  className="h-14 p-1 rounded-sm mr-2 w-1/3"
                />

                {/* Mobile */}
                <div className="md:hidden flex flex-col items-center justify-center text-xl font-semibold px-2 text-gray-900 mt-6">
                  <div className="flex items-center space-x-2 text-2xl">
                    <div className="h-1 w-16 bg-white"></div>
                    <span className="">{centerTop}</span>
                    <div className="h-1 w-16 bg-white"></div>
                  </div>
                  <span className="text-center mb-1">{centerBottom}</span>
                  <div className="h-1 w-full bg-white"></div>
                </div>

                {/* Desktop */}
                <div className="hidden md:flex flex-col items-center justify-between w-full text-xl font-semibold px-2 text-gray-900">
                  <div className="flex items-center space-x-2 text-xl">
                    <div className="h-1 w-10 bg-white"></div>
                    <span className="">{centerTop}</span>
                    <div className="h-1 w-10 bg-white"></div>
                  </div>
                  <span className="text-center mb-1 text-lg">
                    {centerBottom}
                  </span>
                  <div className="h-1 w-40 bg-white"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-900/80 text-xs leading-relaxed">
              The SolarX Challenge is a flagship program by the International
              Solar Alliance to accelerate solar innovation globally.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left col-span-1 lg:col-span-3 px-10">
            <h4 className="text-base font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-900/80">
              {[
                { label: "Home", href: "/" },
                { label: "SolarX Winners", href: "#winners" },
                { label: "Funding & Investors", href: "#funding" },
                { label: "Global Reach", href: "#global-reach" },
                { label: "Media Coverage", href: "#media" },
                { label: "Global Impact", href: "#impact" },
                { label: "Events", href: "#events" },
                { label: "About SolarX Startup Challenge", href: "#about" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-gray-900 transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-900/80">
              <li className="flex items-start justify-center sm:justify-start">
                <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-900/60 flex-shrink-0" />
                <span>International Solar Alliance</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start">
                <FaEnvelope className="h-4 w-4 mr-2 text-gray-900/60 flex-shrink-0" />
                <span>solarx@isolaralliance.org</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start">
                <FaPhone className="h-4 w-4 mr-2 text-gray-900/60 flex-shrink-0" />
                <span>+91 120 2970 138</span>
              </li>
              {/* <li className="flex space-x-3 mt-3 justify-center sm:justify-start">
                <SocialIcon href="#" icon={<FaFacebookF />} />
                <SocialIcon href="#" icon={<FaTwitter />} />
                <SocialIcon href="#" icon={<FaInstagram />} />
                <SocialIcon href="#" icon={<FaGithub />} />
              </li> */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/20 text-center">
          <p className="text-gray-900/60 text-xs">
            © {new Date().getFullYear()} SolarX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Simplified SocialIcon component using React Icons
const SocialIcon = ({ href, icon }) => {
  return (
    <a
      href={href}
      className="bg-white/10 hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm"
    >
      {icon}
    </a>
  );
};

export default Footer;
