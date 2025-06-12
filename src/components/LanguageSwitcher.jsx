import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import "./LanguageSwitcher.css"; // Import your CSS styles for the dropdown

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", country_code: "gb" },
    { code: "es", name: "Español", country_code: "es" },
    { code: "fr", name: "Français", country_code: "fr" },
    { code: "de", name: "Deutsch", country_code: "de" },
    { code: "pt", name: "Português", country_code: "pt" },
  ];

  const handleLanguageChange = (langCode) => {
    // Set the 'googtrans' cookie
    document.cookie = `googtrans=/en/${langCode};path=/`;
    // Reload the page to apply the translation
    window.location.reload();
  };

  useEffect(() => {
    // Define the initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          // We don't need to specify includedLanguages here when using the cookie method
        },
        "google_translate_element"
      );
    };

    // Add the Google Translate script to the document if it's not already there
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Listener to close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-switcher-button"
      >
        <Globe size={24} className="text-white hover:text-orange-600" />
      </button>
      {isOpen && (
        <ul className="language-dropdown">
          {languages.map((lang) => (
            <li key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
              {lang.name}
            </li>
          ))}
        </ul>
      )}
      {/* This div is still necessary for the script to initialize */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default LanguageSwitcher;
