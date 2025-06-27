// src/components/TechnologySection.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Using axios as in your original
import useEmblaCarousel from "embla-carousel-react";
import TechnologyCard from "./TechnologyCard"; // Import the new card
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { API_URL } from "../services/api";

// Reusable Embla Navigation Buttons (can be in a separate file)
const PrevButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--prev p-2 bg-white/50 hover:bg-white/80 rounded-full shadow-md disabled:opacity-30 transition-opacity absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous Technology"
  >
    <ChevronLeft size={24} className="text-orange-600" />
  </button>
);

const NextButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--next p-2 bg-white/50 hover:bg-white/80 rounded-full shadow-md disabled:opacity-30 transition-opacity absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next Technology"
  >
    <ChevronRight size={24} className="text-orange-600" />
  </button>
);

export default function TechnologySection({ companyId }) {
  const [techData, setTechData] = useState([]);
  const [techTags, setTechTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  // Embla Carousel state
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  }); // Loop false might be better for distinct technologies
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect); // Re-calculate on re-initialization
  }, [emblaApi, onSelect]);

  const parseRichTextForSection = (content) => {
    // Renamed to avoid conflict
    if (!content || !Array.isArray(content)) return "";
    return content
      .map((block) => block.children?.map((child) => child.text).join("") || "")
      .join("\n")
      .trim();
  };

  useEffect(() => {
    const fetchTechData = async () => {
      if (!companyId) {
        setTechData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_URL}/startups?filters[id][$eq]=${companyId}&populate[0]=Technology&populate[1]=Technology.Highlights&populate[2]=Technology.Demonstration&pagination[pageSize]=100`,
        );

        const startup = response.data?.data?.[0];
        if (
          !startup ||
          !startup.Technology ||
          startup.Technology.length === 0
        ) {
          // console.log("No technology data found for company:", companyId);
          setTechData([]);
        } else {
          const technologies = startup.Technology;
          // console.log("Fetched and processed technologies:", technologies);
          setTechData(technologies);
          // randomise and limit to 5 items for Technology_Tags
          const randomTags = startup.Technology_Tags.sort(
            () => 0.5 - Math.random(),
          ).slice(0, 5);
          setTechTags(randomTags || []);
        }
      } catch (err) {
        console.error("Error fetching technology data:", err);
        setError("Failed to load technology information.");
        setTechData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechData();
  }, [companyId]);

  return (
    techData.length !== 0 && (
      <div
        id="tech"
        className="w-full px-4 md:px-[69px] mt-12 md:mt-20 pb-16 h-full"
      >
        <div className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full h-full">
          <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-1 ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600  left-[20px]">
              Our Offerings
            </span>
          </h1>
          <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="ml-3 text-orange-600">Loading Technologies...</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md text-center shadow-md">
            <p className="font-semibold">{error}</p>
          </div>
        )}
        {!loading && !error && techData.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600 text-lg">
              No specific technology details available for this company.
            </p>
          </div>
        )}
        {!loading && !error && techData.length > 0 && (
          <div className="relative h-full">
            <div
              className="embla overflow-hidden rounded-xl h-full"
              ref={emblaRef}
            >
              <div className="embla__container flex my-8 h-full">
                {techData.map((techItem, index) => (
                  <div
                    className="embla__slide min-w-0 p-1 sm:p-2 h-full" // min-w-0 important for flex items
                    style={{ flex: "0 0 auto", width: "100%", height: "100%" }}
                    key={techItem.id || index}
                  >
                    <div className="h-full">
                      <TechnologyCard
                        technology={techItem}
                        techTags={techTags}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {techData.length > 1 && ( // Show nav only if multiple slides
              <>
                <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                <div className="embla__dots absolute bottom-[-30px] sm:bottom-[-35px] left-1/2 -translate-x-1/2 flex gap-2 mt-8">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none ring-offset-1 ring-offset-white/50 dark:ring-offset-gray-800/50 focus:ring-2
                                ${
                                  index === selectedIndex
                                    ? "bg-orange-500 ring-orange-500 scale-110"
                                    : "bg-gray-300 hover:bg-gray-400 ring-transparent"
                                }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  );
}
