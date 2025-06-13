import { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import {
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa6";
import logo from "/logo.svg";

// Simplified SocialIcon component using React Icons
const SocialIcon = ({ href, icon, classes }) => {
  return (
    <a
      href={href}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-lg sm:text-xl hover:scale-110 hover:shadow-xl duration-0 ${classes}`}
    >
      {icon}
    </a>
  );
};

const Footer = ({
  centerTop = "SolarX",
  centerBottom = "Startup Challenge",
  quickLinks = [],
}) => {
  const [location, setLocation] = useState("hq");
  return (
    <footer id="footer" className="bg-[#f2f3f5] text-gray-900 py-6">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-20">
        <div className="flex flex-col items-center space-y-6">
          <div className="lg:w-full">
            <img
              src={logo}
              alt="International Solar Alliance Logo"
              className="w-36 self-center lg:self-start"
            />
          </div>
          <hr className="bg-gray-300 h-0.5 w-full rounded-xl" />
          <div className="flex flex-col sm:flex-row items-center justify-between w-full text-gray-900 space-y-8 md:space-y-0">
            <div>
              <div className="flex items-center space-x-2 text-sm">
                <button
                  className={`font-semibold ${
                    location === "hq"
                      ? "underline decoration-orange-600 decoration-2 underline-offset-4"
                      : ""
                  }`}
                  onClick={() => setLocation("hq")}
                >
                  Headquarters
                </button>
                <div className="h-4 w-[1px] bg-gray-600" />
                <button
                  className={`font-semibold ${
                    location === "liason"
                      ? "underline decoration-orange-600 decoration-2 underline-offset-4"
                      : ""
                  }`}
                  onClick={() => setLocation("liason")}
                >
                  Liason Office
                </button>
              </div>
              {location === "hq" ? (
                <div className="flex flex-col items-start mt-4 text-xs text-gray-900/90 space-y-1">
                  <span className="">
                    International Solar Alliance Secretariat
                  </span>
                  <span className="">Surya Bhawan</span>
                  <span className="">NISE Campus</span>
                  <span className="">Gwal Pahari, Faridabad-Gurugram Road</span>
                  <span className="">Gurugram, Haryana - 122003</span>
                  <span className="">India</span>

                  <span className="flex items-center space-x-1 pt-4">
                    <span className="font-semibold text-gray-900">Phone:</span>
                    <span>+91 124 362 3090/69</span>
                  </span>
                  <span className="flex items-center space-x-1 pt-1">
                    <span className="font-semibold text-gray-900">Email:</span>
                    <a href="mailto:info@isolaralliance.org">
                      info@isolaralliance.org
                    </a>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-start mt-4 text-xs text-gray-900/90 space-y-1">
                  <span className="">International Solar Alliance</span>
                  <span className="">
                    Meridien Commercial Tower, Office 204 (2nd Floor)
                  </span>
                  <span className="">Le Meridien Hotel</span>
                  <span className="">Raisina Road, Windsor Place</span>
                  <span className="">Janpath, New Delhi—110001</span>
                  <span className="">India</span>

                  <span className="flex items-center space-x-1 pt-4">
                    <span className="font-semibold text-gray-900">Phone:</span>
                    <span>011-3508 2603</span>
                  </span>
                  <span className="flex items-center space-x-1 pt-1">
                    <span className="font-semibold text-gray-900">Email:</span>
                    <a href="mailto:info@isolaralliance.org">
                      info@isolaralliance.org
                    </a>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-1 text-xs text-gray-900/90">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-orange-600 hover:underline decoration-orange-600 decoration-2 underline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Quick Links */}

            {/* Other ISA Sites */}
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-semibold mb-3">Other ISA Sites</h4>
              <ul className="space-y-1 text-xs text-gray-900/90">
                {[
                  { label: "ISA Website", href: "https://isa.int/" },
                  {
                    label: "Regulatory Data Portal",
                    href: "https://regulation.isolaralliance.org/",
                  },
                  {
                    label: "Solar Data Portal",
                    href: "https://solardata.isa.int/",
                  },
                  {
                    label: "Solar Finance Database",
                    href: "https://isa.int/solar_finance_database",
                  },
                  {
                    label: "Solar Training Programmes",
                    href: "https://isa.int/capacity_building",
                  },
                  {
                    label: "Green Hydrogen Innovation Centre",
                    href: "https://isa-ghic.org/",
                  },
                  {
                    label: "Ease of Doing Solar ",
                    href: "https://isolaralliance.org/eods2022",
                  },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-orange-600 hover:underline decoration-orange-600 decoration-2 underline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Other ISA Sites */}
          </div>

          {/* Social Icons */}
          <ul className="flex space-x-3 mt-6 justify-center sm:justify-start md:self-start">
            <li>
                <SocialIcon
                  href="https://www.facebook.com/InternationalSolarAlliance/"
                  icon={<FaFacebookF />}
                  classes={"bg-[#4267B2] text-white"}
                />
            </li>
            <li>
              <SocialIcon
                href="https://in.linkedin.com/company/internationalsolaralliance"
                icon={<FaLinkedinIn />}
                classes={"bg-[#0a66c2] text-white"}
              />
            </li>
            <li>
              <SocialIcon
                href="https://www.youtube.com/@internationalsolaralliance"
                icon={<FaYoutube />}
                classes={"bg-[#FF0000] text-white"}
              />
            </li>
            <li>
              <SocialIcon
                href="https://x.com/@isolaralliance"
                icon={<FaXTwitter />}
                classes={"bg-black text-white"}
              />
            </li>
          </ul>
          {/* Social Icons */}

          <hr className="bg-gray-300 h-0.5 w-full rounded-xl" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-900/90 text-xs">
              Website Policy © ISA International Solar Alliance
            </p>
          </div>
          {/* Copyright */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
