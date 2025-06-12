import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import "./LanguageSwitcher.css";

// Define the callback function globally so it's stable.
const initializeGoogleTranslateWidget = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      autoDisplay: false,
    },
    "google_translate_element"
  );
};
window.googleTranslateElementInit = initializeGoogleTranslateWidget;

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  const languages = [
    { code: "en", name: "English", country_code: "gb" },
    { code: "es", name: "Español", country_code: "es" },
    { code: "pt", name: "Português", country_code: "pt" },
    { code: "fr", name: "Français", country_code: "fr" },
  ];

  const handleLanguageChange = (langCode) => {
    if (!isTranslateReady) {
      console.warn("Google Translate widget is not ready yet.");
      return;
    }
    const langSelect = document.querySelector(
      "#google_translate_element select.goog-te-combo"
    );
    if (!langSelect) {
      console.error("Could not find the Google Translate <select> element.");
      return;
    }
    langSelect.value = langCode;
    langSelect.dispatchEvent(new Event("change", { bubbles: true }));
    setIsOpen(false);
  };

  // This is the main effect that handles everything.
  useEffect(() => {
    let scriptLoadTimeoutId = null;

    // Define a function to append the script to the page.
    const loadGoogleTranslateScript = () => {
      const scriptId = "google-translate-script";
      if (document.getElementById(scriptId)) {
        // If script already exists, do nothing.
        return;
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Check if the translation cookie exists.
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));

    if (cookieValue) {
      // --- If cookie is found, delay loading the script ---
      console.log(
        "Translation cookie found. Delaying Google Translate script load by 2 seconds."
      );
      scriptLoadTimeoutId = setTimeout(() => {
        loadGoogleTranslateScript();
      }, 3000); // 2-second delay to allow the page to render.
    } else {
      // --- If no cookie, load the script immediately ---
      console.log(
        "No translation cookie found. Loading Google Translate script immediately."
      );
      loadGoogleTranslateScript();
    }

    // This polling logic is still necessary to know when the widget is interactable.
    const intervalId = setInterval(() => {
      const selectElement = document.querySelector(
        "#google_translate_element .goog-te-combo"
      );
      if (selectElement) {
        setIsTranslateReady(true);
        clearInterval(intervalId);
      }
    }, 200);

    // This cleanup function is crucial.
    return () => {
      clearInterval(intervalId);
      // If the component unmounts during the timeout, clear it to prevent the script from loading.
      if (scriptLoadTimeoutId) {
        clearTimeout(scriptLoadTimeoutId);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on initial mount.

  // This separate effect for the click listener is good practice.
  useEffect(() => {
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
              <span>{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default LanguageSwitcher;
