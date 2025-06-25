import { useState, useEffect, useRef } from "react";
import logo from "/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";

// An icon for the dropdown
const ChevronDownIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-5 h-5 inline-block ml-1 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

// TODO: Reuse this component in StartupDetails.jsx
export default function SolarXNavbar({
  centerTop = "SolarX",
  centerBottom = "Startup Challenge",
  navItems,
}) {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks the open dropdown
  const dropdownRef = useRef(null);

  // Listen for scroll events to detect when banner is hidden
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsBannerVisible(false);
      } else {
        setIsBannerVisible(true);
      }
    };

    // Check initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown ref exists and the click was outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null); // Close the dropdown
      }
    };

    // Add event listener only when a dropdown is open
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]); // This effect depends on the openDropdown state

  // Close mobile dropdown when the main mobile menu is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setOpenMobileDropdown(null);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    // The selector for the Google Translate banner iframe
    const bannerSelector = "div[class=skiptranslate]";

    // This observer will watch for attribute changes on the banner iframe
    let observer;

    const startObserving = (targetNode) => {
      // Define what to observe: changes to the 'style' attribute
      const config = { attributes: true, attributeFilter: ["style"] };

      // The callback function to execute when mutations are observed
      const callback = (mutationsList, obs) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            // The style attribute changed. Check if it's visible.
            const isBannerVisible = targetNode.style.display !== "none";
            document.body.classList.toggle(
              "google-translate-banner-visible",
              isBannerVisible,
            );
          }
        }
      };

      observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    };

    // We need to wait for the iframe to be added to the DOM first.
    // We can use another observer for that, or simply poll.
    const intervalId = setInterval(() => {
      const bannerFrame = document.querySelector(bannerSelector);
      if (bannerFrame) {
        // The banner iframe has been found!
        clearInterval(intervalId); // Stop searching for it.

        // Start observing it for style changes.
        startObserving(bannerFrame);

        // Initial check in case it's already visible
        const isVisible = bannerFrame.style.display !== "none";
        document.body.classList.toggle(
          "google-translate-banner-visible",
          isVisible,
        );
      }
    }, 200);

    // Cleanup function to run when the component unmounts
    return () => {
      clearInterval(intervalId);
      if (observer) {
        observer.disconnect();
      }
      // Make sure to remove the class on unmount
      document.body.classList.remove("google-translate-banner-visible");
    };
  }, []); // Empty dependency array ensures this runs only once.

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 bg-[#f4831f] pr-3 md:pr-6 flex justify-between items-center w-full shadow-sm transition-all duration-300 z-[1000]">
      <a
        href="/"
        className="flex flex-row items-center space-x-4 rounded-sm h-full flex-grow"
      >
        <div className="bg-white px-1 md:px-8">
          <img
            src={logo}
            alt="International Solar Alliance Logo"
            className="py-[20px] h-full rounded-sm w-24 md:w-32 lg:w-36 object-contain bg-white "
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="md:hidden flex flex-col items-center justify-center text-xl font-semibold px-2 text-white">
            <div className="flex items-center space-x-2 text-xl">
              <div className="h-1 w-10 bg-white"></div>
              <span className="">{centerTop}</span>
              <div className="h-1 w-10 bg-white"></div>
            </div>
            <span className="text-center mb-1 text-lg">{centerBottom}</span>
            <div className="h-1 w-full bg-white"></div>
          </div>
        </div>

        {/* Desktop */}
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="hidden md:flex flex-col items-center justify-center text-xl font-semibold px-2 text-white">
            <div className="flex items-center space-x-2 text-3xl">
              <div className="h-1 w-16 bg-white"></div>
              <span className="">{centerTop}</span>
              <div className="h-1 w-16 bg-white"></div>
            </div>
            <span className="text-center mb-1 text-2xl">{centerBottom}</span>
            <div className="h-1 w-full bg-white"></div>
          </div>
        </div>
      </a>
      <nav className="hidden lg:block">
        <ul className="flex space-x-6 flex-grow items-center">
          {(navItems || []).map((item) => {
            // Case for items with a dropdown
            if (item.dropdown && item.dropdown.length > 0) {
              const isDropdownOpen = openDropdown === item.label;
              return (
                <li
                  key={item.label}
                  className="relative group"
                  // Assign the ref only to the dropdown list item
                  ref={isDropdownOpen ? dropdownRef : null}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(isDropdownOpen ? null : item.label)
                    }
                    className="relative text-stone-50 font-medium text-md flex items-center cursor-pointer bg-transparent border-none p-0"
                  >
                    {item.label}
                    {/* This span creates the underline on hover, via the parent 'group' */}
                    <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 rounded-md bg-white transition-all duration-300 group-hover:w-full"></span>
                    <ChevronDownIcon
                      className={`transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Dropdown Menu - visibility is now controlled by state */}
                  <ul
                    className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-opacity duration-200 ${
                      isDropdownOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    {item.dropdown.map((subItem) => (
                      <li key={subItem.label}>
                        <a
                          href={subItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                          onClick={() => setOpenDropdown(null)} // Close dropdown on item click
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            // Special case for "Apply Now" button
            if (item.label.includes("Apply Now")) {
              return (
                <li
                  key={item.label}
                  className="relative group hover:scale-105 transition-all duration-300 shadow-md hover:shadow-[0px_0px_30px_4px_rgba(220,220,220,0.8)]"
                >
                  <a
                    href={item.href}
                    className="text-orange-600 font-semibold text-md bg-white rounded-xl px-3 py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              );
            }

            // Default case for regular links
            return (
              <li key={item.label} className="relative group">
                <a
                  href={item.href}
                  className="text-stone-50 font-medium text-md"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 rounded-md bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-4 h-full flex items-center ">
        {/* <div id="google_translate_element"></div> */}
        <LanguageSwitcher />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col space-y-1 z-[1002]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-0.5 transform transition-all duration-500 ${
            mobileMenuOpen
              ? "origin-center rotate-45 translate-y-1.5 bg-black"
              : "bg-white"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 bg-white transition-all duration-500 ${
            mobileMenuOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 transform transition-all duration-500 ${
            mobileMenuOpen
              ? "origin-center -rotate-45 -translate-y-1.5 bg-black"
              : "bg-white"
          }`}
        ></span>
      </button>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-amber-50 z-[1001] flex flex-col justify-center items-center transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <nav className="w-full max-w-md px-6 h-auto max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col space-y-4">
            {(navItems || []).map((item) => {
              // Case for items with a dropdown
              if (item.dropdown && item.dropdown.length > 0) {
                const isDropdownOpen = openMobileDropdown === item.label;
                return (
                  <li
                    key={item.label}
                    className="border-b border-gray-200 pb-2"
                  >
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(
                          isDropdownOpen ? null : item.label,
                        )
                      }
                      className="w-full flex justify-between items-center text-gray-800 hover:text-orange-500 transition-colors duration-300 text-lg font-medium py-1.5 text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={`transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <ul className="pl-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <li key={subItem.label}>
                            <a
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-orange-500 text-base block"
                              onClick={() => setMobileMenuOpen(false)} // Close main menu on click
                            >
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Special case for "Apply Now" button
              if (item.label.includes("Apply Now")) {
                return (
                  <li className="pt-2" key={item.label}>
                    <a
                      href={item.href}
                      className="bg-orange-500 text-white font-medium rounded-full px-6 py-2 text-lg block text-center shadow-md hover:bg-orange-600 transition-colors duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              }

              // Default case for regular links
              return (
                <li key={item.label} className="border-b border-gray-200 pb-2">
                  <a
                    href={item.href}
                    className="text-gray-800 hover:text-orange-500 transition-colors duration-300 text-lg font-medium block py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
