import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const SectionHeader = ({ title }) => (
  <div className="mb-8 md:mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 z-10">
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

const MemberPopup = ({ member, onClose }) => {
  useEffect(() => {
    // When the popup is mounted, disable scrolling on the body
    document.body.style.overflow = "hidden";

    // When the popup is unmounted (closed), re-enable scrolling
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount and cleanup on unmount

  // Close popup on "Escape" key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => e.stopPropagation();

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="relative bg-stone-50 p-4 md:p-8 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 bg-white/70 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-300"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Layout similar to DirectorGeneralSection */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center ">
          {/* Left Column: Photo */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative shadow-xl rounded-lg overflow-hidden">
              <img
                src={member.imageUrl}
                alt={`Portrait of ${member.name}`}
                className="w-full h-auto object-cover"
              />
              <div
                className="absolute bottom-0 left-0 w-full p-6"
                style={{ backgroundColor: "#F97316" }}
              >
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-white opacity-90">{member.title}</p>
              </div>
            </div>
          </div>
          {/* Right Column: Bio */}
          <div className="w-full md:w-3/5">
            <div className="text-gray-600 space-y-4 text-base leading-relaxed">
              {member.bio && member.bio.length > 0 ? (
                member.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>No biography available for this member.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecretariatMemberCard = ({ member, onClick }) => (
  <div
    className="text-center group p-4 bg-white rounded-md h-full hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl cursor-pointer"
    onClick={onClick}
  >
    <div className="overflow-hidden rounded-md shadow-2xl">
      <img
        src={member.imageUrl}
        alt={`Portrait of ${member.name}`}
        className="w-full h-full object-cover object-center border-2 border-orange-200 shadow-2xl"
      />
    </div>
    <div className="group-hover:bg-orange-600 rounded-md group-hover:text-white transition-all duration-300 group-hover:shadow-lg p-2 mt-2">
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-200">
        {member.name}
      </h3>
      <p className="text-base text-gray-500 group-hover:text-gray-50">
        {member.title}
      </p>
    </div>
  </div>
);

const SecretariatSection = ({ members }) => {
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [selectedMember, setSelectedMember] = useState(null); // State for the popup

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    active: isCarouselActive,
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  // Handlers for popup
  const handleCardClick = (member) => setSelectedMember(member);
  const handleClosePopup = () => setSelectedMember(null);

  // Main effect for handling responsiveness
  useEffect(() => {
    const handleResize = () => {
      let newSlidesToShow = 5;
      if (window.innerWidth < 640) newSlidesToShow = 2;
      else if (window.innerWidth < 768) newSlidesToShow = 3;
      else if (window.innerWidth < 1024) newSlidesToShow = 4;

      setSlidesToShow(newSlidesToShow);
      const shouldBeActive = members.length > newSlidesToShow;
      if (shouldBeActive !== isCarouselActive) {
        setIsCarouselActive(shouldBeActive);
      }
      emblaApi?.reInit();
    };

    if (members.length > 0) {
      handleResize();
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
                flex: isCarouselActive ? `0 0 ${100 / slidesToShow}%` : "none",
                minWidth: 0,
              }}
              className={`py-10 px-2 ${!isCarouselActive ? "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" : ""}`}
            >
              <SecretariatMemberCard
                member={member}
                onClick={() => handleCardClick(member)}
              />
            </div>
          ))}
        </div>
      </div>

      {!selectedMember && (
        <>
          <ArrowButton direction="left" onClick={scrollPrev} />
          <ArrowButton direction="right" onClick={scrollNext} />
        </>
      )}

      {/* Render the popup when a member is selected */}
      {selectedMember && (
        <MemberPopup member={selectedMember} onClose={handleClosePopup} />
      )}
    </div>
  );
};

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
    <section
      id="meet-the-team"
      className="bg-gradient-to-r from-orange-200 to-orange-500 relative w-full"
    >
      <div className="py-16 md:py-24 z-10 relative">
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
      <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-20 z-0"></div>
    </section>
  );
}
