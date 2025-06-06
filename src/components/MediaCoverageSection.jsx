import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import MediaMentionCard from "./global_accelerator/MediaMentionCard";

const mediaMentionsData = [
  {
    id: 1,
    headline:
      "Sri Lankan Start-ups ace the SolarX Startup Challenge of Invest India and International Solar Alliance",
    publisher: "Sri-Lankan Govt.",
    platform: "Press Release",
    year: 2024,
    link: "https://www.hcicolombo.gov.in/section/press-releases/sri-lankan-start-ups-ace-the-solarx-startup-challenge-of-invest-india-and-international-solar-alliance/",
    quotePlaceholder:
      "Sri Lanka boasts the highest number of winners at the SolarX Startup Challenge (Asia-Pacific Chapter). The Challenge launched at COP 28 by the International Solar Alliance in collaboration with Invest India is committed to identifying and fostering innovative solutions in the solar energy sector.",
  },
  {
    id: 2,
    headline:
      "International Solar Alliance announces winners of SolarX Startup Challenge 2024: APAC and India Edition",
    publisher: "Economic Times",
    platform: "News",
    year: 2024,
    link: "https://economictimes.indiatimes.com/small-biz/sme-sector/international-solar-alliance-announces-winners-of-solarx-startup-challenge-2024-apac-and-india-edition/articleshow/113162541.cms?from=mdr",
    quotePlaceholder:
      "The SolarX Startup Challenge 2024: APAC saw a remarkable response, with over 270 solar entrepreneurs and innovators participating from the Asia-Pacific region demonstrating the region’s vibrant solar energy ecosystem. Among the 30 winners of the challenge, 10 winners are from India and 20 winners hail from various other countries across the Asia-Pacific region. Each winner will receive a USD 15,000 cash grant, along with technical assistance through an acceleration program tailored to their specific needs.",
  },
  {
    id: 3,
    headline: "ISA Announces Twenty Winners of the SolarX Startup Challenge",
    publisher: "Energetica India",
    platform: "News",
    year: 2023,
    link: "https://www.energetica-india.net/news/isa-announces-twenty-winners-of-the-solarx-startup-challenge",
    quotePlaceholder:
      "The International Solar Alliance, announced winners of its SolarX Startup Challenge, at a side-event of the G20 Energy Transitions Working Group meeting in Goa. Around twenty companies from ten African countries were declared winners, who will work to increase solar deployment in the Africa Region. Out of the twenty winning companies, seven are led by women entrepreneurs. Along with a cash grant of USD 15,000 each, the winning startups will receive support from ISA, Invest India, WAIPA, GOGLA and other partner organisations. They will benefit from mentorship programmes, investor connections, and market access programmes, enabling them to implement their innovations on a larger scale",
  },
  {
    id: 4,
    headline:
      "SolarX Startup Challenge 2024: ISA Enlists 10 Winners From India",
    publisher: "Saur Energy International",
    platform: "News",
    year: 2024,
    link: "https://www.saurenergy.com/solar-energy-news/solarx-startup-challenge-2024-isa-enlists-10-winners-from-india",
    quotePlaceholder:
      "The winners will also receive extensive support from ISA, Invest India, and other partner organisations through mentorship programs, investor connections, and market access initiatives. This support will empower them to scale their innovations and make a significant impact on the solar energy landscape across the APAC region. Through entrepreneurship, finance, and increased investments, ISA anticipates a transformative shift in enabling a swift energy transition in the Asia-Pacific.",
  },
  {
    id: 5,
    headline:
      "ISA's Solar X Startup Challenge Hosts Its First Investor Pitch for Winners From Africa Edition",
    publisher: "PV Magazine India",
    platform: "Press Release",
    year: 2024,
    link: "https://www.pv-magazine-india.com/press-releases/isas-solar-x-startup-challenge-hosts-its-first-investor-pitch-for-winners-from-africa-edition/",
    quotePlaceholder:
      "On the sidelines of its Africa Regional Committee Meeting, the International Solar Alliance (ISA) conducted its first investor pitch session for the SolarX Startup Challenge 2023 winners. This initiative aims to provide a robust platform for the SolarX 2023 winners to showcase their innovative ideas to pioneering investors from the continent. The pitch session featured investors from Africa's solar and climate change space. The session witnessed dynamic innovators delivering compelling pitches to get investments from trailblazing investors.",
  },
  {
    id: 6,
    headline: "SOLARX STARTUP CHALLENGE 2023",
    publisher: "Green Sceene Ethiopia",
    platform: "Article",
    year: 2023,
    link: "https://greensceneethiopia.com/2024/09/25/solarx-startup-challenge-2023/",
    quotePlaceholder:
      "Recently, Deputy CEO Mr. Biniam Tufa had the opportunity to represent Our company and our country in Abidjan, Cote d’Ivoire, during a successful pitch to investors worldwide. He had a productive meeting with Dr. Habtamu, the Minister of Water and Energy of Ethiopia, where he discussed our company’s vision and the support needed to achieve it. “Witnessing the positivity and potential benefits for both our company and country from the ongoing changes, which are creating a favorable environment for foreign direct investment (FDI), was truly inspiring” Said Mr. Biniam.",
  },
];

export default function MediaCoverageSection() {
  return (
    <div className="max-w-5xl min-w-full mx-auto pb-16 bg-white px-4 pt-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
          Media Coverage & Recognition
        </span>
      </h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
      <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12">
        SolarX and our startups have been featured in leading publications and
        received prestigious awards.
      </p>

      <div className="grid md:grid-cols-3 gap-8 animate-slide-in-left max-w-7xl mx-auto px-4">
        {mediaMentionsData.length > 0 ? (
          mediaMentionsData.map((item, index) => (
            <MediaMentionCard key={index} {...item} />
          ))
        ) : (
          <div className="col-span-2 text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">
              No Media Coverage Available
            </h3>
            <p className="text-gray-500 mt-2">
              Media stories will appear here once available.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
