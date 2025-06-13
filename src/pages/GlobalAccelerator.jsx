import HeroSectionGA from "../components/global_accelerator/HeroSectionGA";
import TimelineSection from "../components/global_accelerator/TimelineSection";
import MentorsSection from "../components/global_accelerator/MentorsSection";
import FutureSection from "../components/global_accelerator/FutureSection";
import ProgressBar from "../components/global_accelerator/ProgressBar";
import SolarXNavbar from "../components/SolarXNavbar";
import MediaHighlightsSection from "../components/global_accelerator/MediaHighlightsSection";
import Footer from "../components/Footer";
import "../styles/timeline.css";
import { useState, useEffect } from "react";

const GlobalAccelerator = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Global Accelerator Program", href: "#gap" },
    { label: "Events", href: "#events" },
    { label: "Meet the Mentors", href: "#mentors" },
    { label: "Media Coverage", href: "#media" },
    { label: "Future Plans", href: "#future" },
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Global Accelerator", href: "/global-accelerator" },
    { label: "Events", href: "#events" },
    { label: "Apply Now", href: "/apply" },
  ];

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

  return (
    <div className={`relative ${isCookieSet ? "translate-y-0" : ""}`}>
      <SolarXNavbar centerBottom="Global Accelerator" navItems={navItems} />
      <HeroSectionGA />
      <TimelineSection />
      <MentorsSection />
      <MediaHighlightsSection />
      <FutureSection />
      <ProgressBar />
      <Footer
        centerBottom="Global Accelerator Program"
        quickLinks={quickLinks}
      />
    </div>
  );
};

export default GlobalAccelerator;
