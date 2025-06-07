import HeroSectionGA from "../components/global_accelerator/HeroSectionGA";
import TimelineSection from "../components/global_accelerator/TimelineSection";
import MentorsSection from "../components/global_accelerator/MentorsSection";
import FutureSection from "../components/global_accelerator/FutureSection";
import ProgressBar from "../components/global_accelerator/ProgressBar";
import SolarXNavbar from "../components/SolarXNavbar";
import MediaHighlightsSection from "../components/global_accelerator/MediaHighlightsSection";
import "../styles/timeline.css";

const GlobalAccelerator = () => {
  return (
    <>
      <SolarXNavbar centerBottom="Global Accelerator" />
      <HeroSectionGA />
      <TimelineSection />
      <MentorsSection />
      <MediaHighlightsSection />
      <FutureSection />
      <ProgressBar />
    </>
  );
};

export default GlobalAccelerator;
