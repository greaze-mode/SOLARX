import { useState, useEffect } from "react";
import "./App.css";
import SolarXNavbar from "./components/SolarXNavbar";
import SolarXWinners from "./components/SolarXWinners";
import StatsSection from "./components/StatsSection";
import Footer from "./components/Footer";
import HeroCarousel from "./components/HeroCarousel";
import FundingInvestorsDashboard from "./components/FundingInvestorsDashboard";
// import SuccessStories from "./components/SuccessStories";
import MediaCoverageSection from "./components/MediaCoverageSection";
import AboutSolarXChallenge from "./components/AboutSolarXChallenge";
import GlobalImpactSection from "./components/GlobalImpactSection";
import SolarXGlobalReach from "./components/SolarXGlobalReach";
import { EventSection } from "./components/EventSection.jsx";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCookieSet, setIsCookieSet] = useState(false);

  // Check if the 'googtrans' cookie is set
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));
    if (cookieValue) {
      setIsCookieSet(true);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "SolarX Winners", href: "#winners" },
    { label: "Funding & Investors", href: "#funding" },
    { label: "Media Coverage", href: "#media" },
    { label: "Global Impact", href: "#impact" },
    { label: "Events", href: "#events" },
    {
      label: "Global Accelerator Program",
      href: "/global-accelerator",
    },
  ];

  return (
    <div className={`relative ${isCookieSet ? "translate-y-0.5" : ""}`}>
      <SolarXNavbar isMobile={isMobile} />

      <div className="relative">
        <HeroCarousel />
        <SolarXWinners isMobile={isMobile} />
        <StatsSection isMobile={isMobile} />
        <FundingInvestorsDashboard isMobile={isMobile} />
        <SolarXGlobalReach isMobile={isMobile} />
        {/* <SuccessStories isMobile={isMobile} /> */}
        <MediaCoverageSection isMobile={isMobile} />
        <GlobalImpactSection isMobile={isMobile} />
        <EventSection />
        <AboutSolarXChallenge isMobile={isMobile} />
        <Footer quickLinks={quickLinks} />
      </div>
    </div>
  );
}
