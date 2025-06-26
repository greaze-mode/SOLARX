import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SolarXNavbar from "../components/SolarXNavbar";
import SolarFlowHero from "../components/SolarFlowHero";
import MentorCarousel from "../components/MentorCarousel";
import CompanyInfoSection from "../components/CompanyInformation";
import BusinessSummary from "../components/BusinessSummary";
import TechnologySection from "../components/TechnologySection";
import ImpactMetrics from "../components/ImpactMetrics";
import FundingJourney from "../components/FundingJourney";
import PressFeaturesSection from "../components/PressFeaturesSection";
import ProjectGallery from "../components/ProjectGallery";
import GlobalPresence from "../components/GlobalPresence";
import Footer from "../components/Footer";
import { API_URL } from "../services/api";
import axios from "axios";

export default function StartupDetail() {
  const { documentId } = useParams();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navItems, setNavItems] = useState([]); // State to hold nav links from CMS

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Founders", href: "#founders" },
    { label: "Company Details", href: "#details" },
    { label: "Business Summary", href: "#summary" },
    { label: "Technologies", href: "#tech" },
    { label: "Impact Metrics", href: "#impact" },
    { label: "Funding", href: "#funding" },
    { label: "Media Coverage", href: "#media" },
    { label: "Projects", href: "#projects" },
    { label: "Global Impact", href: "#impact" },
  ];

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/home-page?populate[0]=nav_links&populate[1]=nav_links.dropdown_files&populate[2]=nav_links.dropdown_files.pdf_file`,
        );
        const apiData = await response.json();

        // Transform the data to match the expected format { label, href, dropdown? }
        const transformedNavLinks = apiData.data.nav_links
          .filter((link) => !link.Label.includes("Media"))
          .map((link) => ({
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
          {
            label: "Apply Now",
            href: "https://solarx.isa.int/registration_lac",
          },
        ]);
      }
    };

    fetchNavLinks();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const checkCompany = async () => {
      if (documentId) {
        setLoading(true);

        axios
          .get(`${API_URL}/startups/${documentId}`)
          .then((response) => {
            // console.log("Company data:", response.data.data);
            setId(response.data.data.id);
          })
          .catch((err) => {
            console.error("Error checking company:", err);
            setError("Error loading company data");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    checkCompany();
  }, [documentId]);

  if (loading) {
    return (
      <div className={`relative`}>
        <SolarXNavbar navItems={navItems} />
        <div className="container mx-auto px-4 pt-20 pb-6 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Loading company details...
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <SolarXNavbar navItems={navItems} />
        <div className="container mx-auto px-4 pt-20 pb-6 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative`}>
      <SolarXNavbar navItems={navItems} />
      <div className="max-w-screen-2xl mx-auto px-4 pb-6 mt-[2rem]"></div>
      <SolarFlowHero companyId={id} key={`hero-${id}`} />
      <MentorCarousel companyId={id} />
      <CompanyInfoSection companyId={id} />
      <BusinessSummary companyId={id} />
      <TechnologySection companyId={id} />
      <ImpactMetrics companyId={id} />
      <FundingJourney companyId={id} />
      <PressFeaturesSection companyId={id} />
      <ProjectGallery companyId={id} />
      <GlobalPresence companyId={id} />

      <Footer quickLinks={quickLinks} />
    </div>
  );
}
