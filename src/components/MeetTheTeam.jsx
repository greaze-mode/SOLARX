import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const SectionHeader = ({ title }) => (
  <div className="mb-8 md:mb-12">
    <h2
      className="text-3xl md:text-4xl font-bold text-gray-800"
      style={{ color: "#F97316" }}
    >
      {title}
    </h2>
    <div className="mt-2 h-1 w-40" style={{ backgroundColor: "#F97316" }}></div>
  </div>
);

const ArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${direction === "left" ? "left-0 md:-left-5" : "right-0 md:-right-5"}`}
    aria-label={direction === "left" ? "Previous" : "Next"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

const DirectorGeneralSection = ({ directors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? directors.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === directors.length - 1 ? 0 : prev + 1));
  };

  if (!directors || directors.length === 0) {
    return (
      <p className="text-gray-500">
        Director General information is currently unavailable.
      </p>
    );
  }

  const director = directors[currentIndex];

  return (
    <div className="relative bg-stone-50 p-4 md:p-8 rounded-lg">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Left Column: Photo */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <div className="relative shadow-xl rounded-lg overflow-hidden">
            <img
              src={director.imageUrl}
              alt={`Portrait of ${director.name}`}
              className="w-full h-auto object-cover"
            />
            <div
              className="absolute bottom-0 left-0 w-full p-6"
              style={{ backgroundColor: "#F97316" }}
            >
              <h3 className="text-2xl font-bold text-white">{director.name}</h3>
              <p className="text-white opacity-90">{director.title}</p>
            </div>
          </div>
        </div>
        {/* Right Column: Bio */}
        <div className="w-full md:w-3/5">
          <div className="text-gray-600 space-y-4 text-base leading-relaxed">
            {director.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      {/* Navigation Arrows (only show if more than one director) */}
      {directors.length > 1 && (
        <>
          <ArrowButton direction="left" onClick={handlePrev} />
          <ArrowButton direction="right" onClick={handleNext} />
        </>
      )}
    </div>
  );
};

const SecretariatMemberCard = ({ name, title, imageUrl }) => (
  <div className="text-center group p-2">
    <div className="overflow-hidden rounded-md shadow-2xl">
      <img
        src={imageUrl}
        alt={`Portrait of ${name}`}
        className="w-full h-full object-cover object-center transform transition-all duration-500 ease-in-out group-hover:scale-105"
      />
    </div>
    <h3 className="mt-4 text-md font-bold text-gray-800">{name}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

const SecretariatSection = ({ members }) => {
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(5);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // <-- SET TO TRUE FOR INFINITE LOOPING
    align: "start",
    containScroll: "trimSnaps",
    active: isCarouselActive,
  });

  // Handlers for the buttons
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  // Main effect for handling responsiveness
  useEffect(() => {
    const handleResize = () => {
      let newSlidesToShow = 5;
      if (window.innerWidth < 640) newSlidesToShow = 2;
      else if (window.innerWidth < 768) newSlidesToShow = 3;
      else if (window.innerWidth < 1024) newSlidesToShow = 4;

      setSlidesToShow(newSlidesToShow);
      // Activate carousel only if there are more members than can be shown
      const shouldBeActive = members.length > newSlidesToShow;
      if (shouldBeActive !== isCarouselActive) {
        setIsCarouselActive(shouldBeActive);
      }
      // Re-initialize Embla to recalculate dimensions, especially on resize
      emblaApi?.reInit();
    };

    if (members.length > 0) {
      handleResize(); // Run on initial load
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [members.length, emblaApi, isCarouselActive]);

  if (!members || members.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className="flex"
          // If carousel is inactive, let it wrap and center the items
          style={
            !isCarouselActive
              ? { flexWrap: "wrap", justifyContent: "center" }
              : {}
          }
        >
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                // If carousel is active, calculate slide width.
                flex: isCarouselActive ? `0 0 ${100 / slidesToShow}%` : "none",
                minWidth: 0,
              }}
              // Add horizontal padding for spacing AND responsive width classes for when carousel is INACTIVE
              className={`px-2 ${!isCarouselActive ? "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" : ""}`}
            >
              <SecretariatMemberCard {...member} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - only show if the carousel is active */}
      {isCarouselActive && (
        <>
          <ArrowButton direction="left" onClick={scrollPrev} />
          <ArrowButton direction="right" onClick={scrollNext} />
        </>
      )}
    </div>
  );
};
// --- The Main Component with API Fetching Logic ---

export default function MeetTheTeam() {
  const [directors, setDirectors] = useState([]);
  const [secretariatMembers, setSecretariatMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://20.0.137.179:1337/api/home-page?populate[0]=meet_the_team&populate[1]=meet_the_team.image",
        );
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }
        const apiData = await response.json();

        // --- Transform API data into a usable format ---
        const allMembers = apiData.data?.meet_the_team || [];

        const parseDescription = (desc) => {
          if (!desc || !Array.isArray(desc)) return [];
          return desc
            .map(
              (block) =>
                block.children?.map((child) => child.text).join("") || "",
            )
            .filter((paragraph) => paragraph.trim() !== "");
        };

        const topRow = [];
        const bottomRow = [];

        allMembers.forEach((member) => {
          const formattedMember = {
            id: member.id,
            name: member.name,
            title: member.designation,
            imageUrl:
              member.image?.formats?.large?.url ||
              member.image?.url ||
              "https://via.placeholder.com/400x500",
            bio: parseDescription(member.description),
          };

          if (member.row === "top") {
            topRow.push(formattedMember);
          } else if (member.row === "bottom") {
            bottomRow.push(formattedMember);
          }
        });

        setDirectors(topRow);
        setSecretariatMembers(bottomRow);
      } catch (err) {
        console.error("Failed to fetch team data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Render based on loading/error state ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Team Information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-16 p-4 text-center bg-red-50 text-red-700 rounded-lg">
        <p className="font-bold">Could not load team information.</p>
        <p className="text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-600">
          Meet The <span className="text-orange-600">Team</span>
        </h2>
        <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
      </div>
      <div className="container mx-auto px-4 space-y-20">
        <section>
          <SectionHeader title="Director General" />
          <DirectorGeneralSection directors={directors} />
        </section>

        <section>
          <SectionHeader title="Secretariat" />
          <SecretariatSection members={secretariatMembers} />
        </section>
      </div>
    </div>
  );
}
