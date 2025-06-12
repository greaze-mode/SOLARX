import React, { useState, useEffect, useMemo, useRef } from "react";
import { API_URL } from "../services/api";
import {
  Newspaper,
  Trophy,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeatureCard = ({ type, source, title, link }) => {
  const Icon = type === "award" ? Trophy : Newspaper;
  const linkText = type === "award" ? "View Award" : "Read Article";

  return (
    <div className="flex h-full flex-col bg-white border border-gray-200/80 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 ">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-orange-600 mb-4">
          <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-semibold uppercase tracking-wider truncate">
            {source}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex-grow">
          {title}
        </h3>
      </div>
      {link && (
        <div className="bg-gray-50 p-4 rounded-b-xl border-t border-gray-200/80">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 font-semibold group inline-flex items-center w-full"
          >
            {linkText}
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default function PressFeaturesSection({ companyId }) {
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) {
        setError("Company ID is required to fetch press features.");
        setLoading(false);
        setMediaCoverage([]);
        setAwards([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const apiUrl = `${API_URL}/startups?filters[id][$eq]=${companyId}&populate=Media&pagination[pageSize]=100`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        const result = await response.json();
        if (result && result.data && result.data.length > 0) {
          const mediaItemsFromApi = result.data[0].Media || [];
          const processedMediaItems = [];
          const processedAwardItems = [];
          mediaItemsFromApi.forEach((apiItem) => {
            const item = {
              id: apiItem.id,
              source: apiItem.Source || "Media Source",
              title: apiItem.Headline || "Article Headline",
              date: apiItem.Date || "",
              link: apiItem.URL || "",
            };
            const isAward =
              item.title &&
              (item.title.toLowerCase().includes("award") ||
                item.title.toLowerCase().includes("honor"));
            if (isAward) processedAwardItems.push(item);
            else processedMediaItems.push(item);
          });
          setMediaCoverage(processedMediaItems);
          setAwards(processedAwardItems);
        } else {
          setMediaCoverage([]);
          setAwards([]);
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  const allItems = [
    ...mediaCoverage.map((item) => ({ ...item, type: "media" })),
    ...awards.map((item) => ({ ...item, type: "award" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const chunkedItems = useMemo(() => {
    const chunked = [];
    if (!isMobile) {
      for (let i = 0; i < allItems.length; i += 6) {
        chunked.push(allItems.slice(i, i + 6));
      }
    } else {
      for (let i = 0; i < allItems.length; i += 2) {
        chunked.push(allItems.slice(i, i + 2));
      }
    }
    return chunked;
  }, [allItems, isMobile]);

  const sliderSettings = useMemo(() => {
    const numItems = chunkedItems.length;

    const calculateResponsiveSettings = (maxSlidesForView) => {
      // const slidesToShow = Math.min(maxSlidesForView, Math.max(1, numItems)); // Ensure at least 1 slide is shown
      const slidesToShow = 1;
      return {
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: numItems > slidesToShow,
      };
    };

    const desktopResponsiveConfig = calculateResponsiveSettings(3);

    return {
      dots: true,
      speed: 500,
      initialSlide: 0,
      autoplay: desktopResponsiveConfig.infinite,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      swipeToSlide: true,
      ...desktopResponsiveConfig,
      responsive: [
        {
          breakpoint: 1024, // lg
          settings: calculateResponsiveSettings(2), // Max 2 for large tablets
        },
        {
          breakpoint: 768, // md
          settings: calculateResponsiveSettings(2), // Max 2 for smaller tablets
        },
        {
          breakpoint: 640, // sm
          settings: calculateResponsiveSettings(1), // 1 slide for mobile
        },
      ],
    };
  }, [chunkedItems.length]);

  const showSliderNavButtons = sliderSettings.infinite;

  if (!loading && !error && allItems.length === 0) {
    return null;
  }

  return (
    allItems.length > 0 && (
      <div className="w-full bg-gray-50/70 px-4 py-16 sm:px-6 lg:px-[69px]">
        <div className="mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Media & Recognition
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
            Featured in leading publications and recognized for innovation and
            impact.
          </p>

          {loading && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-700">Loading Features...</p>
            </div>
          )}

          {error && !loading && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-2xl mx-auto"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {showSliderNavButtons && !loading && (
            <>
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

          {/* --- Carousel Implementation --- */}
          {!loading && !error && allItems.length > 0 && (
            <div className="press-features-carousel-wrapper">
              <Slider ref={sliderRef} {...sliderSettings}>
                {chunkedItems.map((group, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {group.map((item) => (
                        <FeatureCard key={item.id} {...item} />
                      ))}
                    </div>
                  </div>
                ))}
              </Slider>
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
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out 0.2s both;
          }
          /* Custom Carousel Styling */
          .press-features-carousel-wrapper .slick-slider {
            margin: 0 -8px;
          }

          .press-features-carousel-wrapper .slick-dots {
            bottom: -40px;
          }

          .press-features-carousel-wrapper .slick-dots li button:before {
            font-size: 12px;
            color: #fb923c; /* orange-400 */
            opacity: 0.5;
            transition: all 0.3s ease;
          }

          .press-features-carousel-wrapper
            .slick-dots
            li.slick-active
            button:before {
            color: #f97316; /* orange-500 */
            opacity: 1;
          }

          .press-features-carousel-wrapper .slick-arrow {
            width: 40px;
            height: 40px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10;
            transition: all 0.3s ease;
          }

          .press-features-carousel-wrapper .slick-arrow:hover {
            background-color: #fef3c7; /* orange-100 */
            transform: scale(1.1);
          }

          .press-features-carousel-wrapper .slick-prev {
            left: -20px;
          }
          .press-features-carousel-wrapper .slick-next {
            right: -20px;
          }

          .press-features-carousel-wrapper .slick-arrow:before {
            font-size: 18px;
            color: #f97316; /* orange-500 */
          }
        `}</style>
      </div>
    )
  );
}
