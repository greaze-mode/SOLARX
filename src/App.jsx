import { useState, useEffect } from "react";
import { API_URL } from "./services/api.js";
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
import MeetTheTeam from "./components/MeetTheTeam.jsx";
// import { SimpleGlobe } from "./components/Globe.jsx";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [navItems, setNavItems] = useState([]); // State to hold nav links from CMS

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
    { label: "Global Reach", href: "#reach" },
    { label: "Media Coverage", href: "#media" },
    { label: "Global Impact", href: "#impact" },
    { label: "Events", href: "#events" },
    {
      label: "Global Accelerator Program",
      href: "/global-accelerator",
    },
  ];

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/home-page?populate[0]=nav_links&populate[1]=nav_links.dropdown_files&populate[2]=nav_links.dropdown_files.pdf_file`,
        );
        const apiData = await response.json();

        // Transform the data to match the expected format { label, href, dropdown? }
        const transformedNavLinks = apiData.data.nav_links.map((link) => ({
          label: link.Label,
          // Use URL if available, otherwise '#' as a fallback for dropdown triggers
          href: link.URL || "#",
          // Map dropdown files to a simpler structure
          dropdown: (link.dropdown_files || []).map((file) => ({
            label: file.Label,
            href: file.pdf_file.url,
          })),
        }));

        setNavItems(transformedNavLinks);
      } catch (error) {
        console.error("Failed to fetch navigation links:", error);
        // Fallback to hardcoded links in case of an API error
        setNavItems([
          { label: "Global Accelerator", href: "/global-accelerator" },
          { label: "Collateral", href: "#" },
          { label: "Media Coverage & Events", href: "#events" },
          {
            label: "Apply Now",
            href: "https://solarx.isa.int/registration_lac",
          },
        ]);
      }
    };

    fetchNavLinks();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="relative">
      <SolarXNavbar isMobile={isMobile} navItems={navItems} />

      <div className="relative mt-16">
        <HeroCarousel />
        <EventSection />
        <AboutSolarXChallenge isMobile={isMobile} />
        <MeetTheTeam />
        <SolarXWinners isMobile={isMobile} />
        <StatsSection isMobile={isMobile} />
        <FundingInvestorsDashboard isMobile={isMobile} />
        <SolarXGlobalReach isMobile={isMobile} />
        {/* <SimpleGlobe /> */}
        {/* <SuccessStories isMobile={isMobile} /> */}
        <MediaCoverageSection isMobile={isMobile} />
        <GlobalImpactSection isMobile={isMobile} />
        {/* <HeroCarousel /> */}
        <AboutSolarXChallenge isMobile={isMobile} />
        <Footer quickLinks={quickLinks} />
      </div>
    </div>
  );
}
