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

export default function StartupDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const checkCompany = async () => {
      if (id) {
        try {
          setLoading(true);

          const baseUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(
            `${baseUrl}/api/startups?filters[id][$eq]=${id}&populate=*`
          );
          const data = await response.json();

          if (!(data && data.data && data.data.length > 0)) {
            setError("Company not found");
          }
        } catch (err) {
          console.error("Error checking company:", err);
          setError("Error loading company data");
        } finally {
          setLoading(false);
        }
      }
    };

    checkCompany();
  }, [id]);

  if (loading) {
    return (
      <div className={`relative ${isCookieSet ? "translate-y-0.5" : ""}`}>
        <SolarXNavbar />
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
        <SolarXNavbar />
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
    <div className={`relative ${isCookieSet ? "-translate-y-[32px]" : ""}`}>
      <SolarXNavbar />
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
