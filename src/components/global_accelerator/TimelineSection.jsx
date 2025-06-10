import { useEffect, useRef, useState } from "react";
import { mentorsData } from "./mentorData";

const webinarSeriesData = {
  type: "webinarSeries", // To identify this special event
  img: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  sessions: [
    {
      month: "March",
      sessionNum: "1A",
      date: [
        "Fri, 14 Mar (11:00-12:30 PM IST)",
        "Tues, 18 Mar (11:00-12:30 PM IST)",
      ],
      topic: "Masterclass on Fundraising",
      speakersVCA: "Sanchayan Chakraborty (Aavishkaar Capital)",
      speakersLocal: "",
      id: "sanchayan-chakraborty",
      mentorImg: mentorsData.find(
        (mentor) => mentor.id === "sanchayan-chakraborty"
      )?.imgSrc,
    },
    {
      month: "April",
      sessionNum: "2A",
      date: [
        "Mon, 5 Apr (03:00-05:30 PM IST)",
        "Thurs, 8 Apr (03:00-05:30 PM IST)",
      ],
      topic:
        "What Do VCs Look for in a Startup? A Masterclass on Securing Investment",
      speakersVCA: "Raiyaan Shingati (Transition VC)",
      speakersLocal: "",
      id: "raiyaan-shingati",
      mentorImg: mentorsData.find((mentor) => mentor.id === "raiyaan-shingati")
        ?.imgSrc,
    },

    {
      month: "May",
      sessionNum: "3A",
      date: [
        "Wed, 21 May (02:00-03:30 PM IST)",
        "Wed, 28 May (02:00-03:30 PM IST)",
      ],
      topic:
        "Crafting a compelling narrative and pitch, Problem-solution fit, User centric design/ rapid prototyping approaches.",
      speakersVCA: "Sreya Bhattacharya (Dalberg)",
      speakersLocal: "",
      id: "sreya-bhattacharya",
      mentorImg: mentorsData.find(
        (mentor) => mentor.id === "sreya-bhattacharya"
      )?.imgSrc,
    },
    {
      month: "June",
      sessionNum: "4A",
      date: [
        "Thurs, 5 June (01:30-03:00 PM IST)",
        "Thurs, 19 June (01:30-03:00 PM IST)",
      ],
      topic: "Fundraising with the exit in mind.",
      speakersVCA: "Thomas Van Halen (VC4A)",
      speakersLocal: "",
      id: "thomas-van-halen",
      mentorImg: mentorsData.find((mentor) => mentor.id === "thomas-van-halen")
        ?.imgSrc,
    },
    {
      month: "July",
      sessionNum: "5A",
      date: [
        "Thurs, 17 July (10:00-11:30 PM IST)",
        "Thurs, 24 July (10:00-11:30 PM IST)",
      ],
      topic: "Investor readiness, selection, and key considerations",
      speakersVCA: "Babatunde Usman (Acumen)",
      speakersLocal: "",
      id: "babatunde-usman",
      mentorImg: mentorsData.find((mentor) => mentor.id === "babatunde-usman")
        ?.imgSrc,
    },
    {
      month: "August",
      sessionNum: "6A",
      date: ["Thurs, 7 Aug", "Thurs, 21 Aug"],
      topic:
        "ESG and climate risks for the RE sector. Sustainable finance and innovative financing mechanisms for RE",
      speakersVCA: "Namita Vikas (AuctusESG)",
      speakersLocal: "",
      id: "namita-vikas",
      mentorImg: mentorsData.find((mentor) => mentor.id === "namita-vikas")
        ?.imgSrc,
    },
  ],
};

const transformedTimelineEvents = webinarSeriesData.sessions.map(
  (session, index) => {
    let isUpcoming = false;
    if (session.month != "March" && session.month != "April") {
      isUpcoming = true;
    }

    const imagePool = [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=600&auto=format&fit=crop",
    ];

    let descriptionContent = `<strong>Speaker: </strong> ${
      session.speakersVCA || "N/A"
    }`;
    if (session.speakersLocal) {
      descriptionContent += `<br/><strong>Speakers (Local):</strong> ${session.speakersLocal}`;
    }
    // Add the topic to the description if it's long, or keep it in title.
    // For this example, the topic is the title.
    // descriptionContent += `<br/><br/><i>This session is part of the ${session.month} webinar series (Session ${session.sessionNum}).</i>`;

    // date: [
    //   "Thurs, July 17 (10:00-11:30 PM IST)",
    //   "Thurs, July 24 (10:00-11:30 PM IST)",
    // ],
    // Extract month and year from the date string, removing the day
    const firstDate = session.date[0].split("(")[0].trim();
    const secondDate = session.date[1].split("(")[0].trim();

    // Extract just month and year from dates
    const getMonthYear = (dateStr) => {
      const parts = dateStr.split(", ");
      if (parts.length > 1) {
        // Remove the day part (e.g., "Fri" from "Fri, Mar 14")
        return parts[1];
      }
      return dateStr;
    };

    const monthYear1 = getMonthYear(firstDate);
    const monthYear2 = getMonthYear(secondDate);

    const da = `${monthYear1} 2025 & ${monthYear2} 2025`;

    return {
      img: imagePool[index % imagePool.length],
      // For the timeline slide 'date' field, use the session's full date string
      date: `${da}`, // E.g., "Mar 14 & Mar 18"
      title: session.topic, // The topic of the webinar session is the title of the timeline event
      id: session.id, // Unique identifier for the session speaker
      description: descriptionContent,
      isUpcoming: isUpcoming,
      imgSrc: session.mentorImg || "https://via.placeholder.com/150", // Fallback image if mentorImg is not found
      key: `webinar-${session.month}-${session.sessionNum}-${index}`, // More specific key
    };
  }
);

// const allEventsRaw = [...transformedTimelineEvents];
const sortedTimelineEventsData = [...transformedTimelineEvents];

// const sortedTimelineEventsData = allEventsRaw.sort((a, b) => {
//   const dateA = getMonthDay(
//     a.date.replace("Upcoming: ", "").replace("Phase: ", "")
//   );
//   const dateB = getMonthDay(
//     b.date.replace("Upcoming: ", "").replace("Phase: ", "")
//   );

//   // Handle cases where parsing might fail or for non-date specific titles
//   if (!dateA && !dateB) return 0; // Keep original order if both unparsable
//   if (!dateA) return 1; // Put unparsable ones (like "Future Plan") at the end
//   if (!dateB) return -1; // Put unparsable ones at the end

//   if (dateA.monthIndex !== dateB.monthIndex) {
//     return dateA.monthIndex - dateB.monthIndex;
//   }
//   return dateA.day - dateB.day;
// });

// --- TimelineSection Component ---
const MOBILE_BREAKPOINT = 768; // Tailwind's 'md' breakpoint
const TimelineSection = () => {
  const scrollSectionRef = useRef(null);
  const stickyParentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // console.log(transformedTimelineEvents);

  const [dimensions, setDimensions] = useState({
    scrollWidth: 0,
    viewportWidth: 0,
    stickyParentOffsetTop: 0,
    stickyParentHeight: 0,
    viewportHeight: 0,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const calculateDimensions = () => {
      checkMobile(); // Check mobile state on dimension calculation
      if (scrollSectionRef.current && stickyParentRef.current) {
        setDimensions({
          scrollWidth: scrollSectionRef.current.scrollWidth,
          viewportWidth: window.innerWidth,
          stickyParentOffsetTop: stickyParentRef.current.offsetTop,
          stickyParentHeight: stickyParentRef.current.offsetHeight,
          viewportHeight: window.innerHeight,
        });
      }
    };

    // Debounce calculateDimensions to avoid excessive calls during resize storm
    let resizeTimer;
    const debouncedCalculateDimensions = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateDimensions, 100);
    };

    calculateDimensions(); // Initial calculation
    const resizeObserver = new ResizeObserver(debouncedCalculateDimensions);
    if (scrollSectionRef.current)
      resizeObserver.observe(scrollSectionRef.current);
    if (stickyParentRef.current)
      resizeObserver.observe(stickyParentRef.current);
    window.addEventListener("resize", debouncedCalculateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCalculateDimensions);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      // If mobile, don't apply scroll-driven animation
      if (scrollSectionRef.current) {
        scrollSectionRef.current.style.transform = "translate3d(0px, 0, 0)";
      }
      return;
    }

    const scrollSectionNode = scrollSectionRef.current;
    if (
      !scrollSectionNode ||
      dimensions.scrollWidth === 0 ||
      dimensions.viewportWidth === 0
    )
      return;

    const updateScrollAnimation = () => {
      const scrollY = window.scrollY;
      const {
        stickyParentOffsetTop,
        stickyParentHeight,
        viewportHeight,
        scrollWidth,
        viewportWidth,
      } = dimensions;

      const start = stickyParentOffsetTop;
      // Ensure end calculation is valid
      const scrollableDistance = stickyParentHeight - viewportHeight;
      if (scrollableDistance <= 0) {
        // Not enough space to scroll sticky parent
        scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        return;
      }
      const end = start + scrollableDistance;

      if (scrollWidth <= viewportWidth) {
        scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        return;
      }
      const maxTranslate = scrollWidth - viewportWidth;

      if (scrollY >= start && scrollY <= end) {
        const progress = Math.max(
          0,
          Math.min(1, (scrollY - start) / scrollableDistance)
        );
        const translateX = -progress * maxTranslate;
        scrollSectionNode.style.transform = `translate3d(${translateX}px, 0, 0)`;
      } else {
        if (scrollY < start) {
          scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        } else {
          // scrollY > end
          scrollSectionNode.style.transform = `translate3d(${-maxTranslate}px, 0, 0)`;
        }
      }
    };

    window.addEventListener("scroll", updateScrollAnimation, { passive: true });
    updateScrollAnimation(); // Initial call to set position

    return () => window.removeEventListener("scroll", updateScrollAnimation);
  }, [dimensions]); // Re-run this effect when dimensions change

  return (
    <section className="timeline-section-container bg-gradient-to-tr from-gray-900 via-orange-900 to-orange-700 text-white py-16 md:py-20">
      <div
        className="relative w-full h-[600vh]" // This height drives the scroll duration of the effect
        ref={!isMobile ? stickyParentRef : undefined}
      >
        <div
          className={`overflow-hidden ${
            !isMobile ? "sticky" : ""
          } top-0 h-screen w-screen`}
        >
          <div
            className="absolute top-0 left-0 pt-24 h-full flex items-center" // scroll-section
            ref={!isMobile ? scrollSectionRef : undefined}
            style={{ willChange: "transform" }}
          >
            {sortedTimelineEventsData.map(
              (
                event // Use sorted data
              ) => (
                <div
                  className="flex flex-row justify-center items-center w-screen flex-shrink-0 h-full box-border px-6 sm:px-12 md:px-20 lg:px-24" // timeline-event
                  key={event.key || event.title} // Use the key property or fallback
                >
                  <div className="relative">
                    {event.isUpcoming && (
                      <div
                        className="absolute top-5 right-36 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-2 px-6 rounded-md z-10"
                        style={{
                          animation: "pulse-banner 2s infinite",
                          fontSize: "12px",
                        }}
                      >
                        UPCOMING
                      </div>
                    )}
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-[650px] max-w-[70%] xl:max-w-[70%] h-[80vh] max-h-[600px] object-cover object-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] rounded-2xl mr-8 xl:mr-12 border-2 border-white/10 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)]"
                    />
                    <style jsx>{`
                      @keyframes pulse-banner {
                        0% {
                          opacity: 1;
                          transform: translateX(-50%) scale(1);
                          box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
                        }
                        50% {
                          opacity: 0.8;
                          transform: translateX(-50%) scale(1.05);
                          box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
                        }
                        100% {
                          opacity: 1;
                          transform: translateX(-50%) scale(1);
                          box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
                        }
                      }
                    `}</style>
                  </div>
                  <div className="w-full md:w-[55%] xl:w-[60%] h-full flex flex-col justify-center items-start md:pl-4">
                    <div className="flex flex-col items-start mb-6 relative">
                      <h2 className="text-5xl lg:text-5xl font-bold pb-2.5 relative mb-2 text-white h-3/5 self-start">
                        {event.title}
                        <div className="w-2/5 h-1.5 mt-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      </h2>
                      <div className="h-2/5 self-end w-full">
                        <div className="w-full flex flex-col items-start justify-start space-x-4">
                          <img
                            src={event.imgSrc}
                            alt={`${event.id}'s image`}
                            className="ml-4"
                            style={{
                              width: "120px",
                              height: "120px",
                              borderRadius: "9999px",
                              objectFit: "cover",
                            }}
                          />
                          <h3 className="text-2xl font-semibold text-white">
                            <a href={`#${event.id}`}>
                              <span // description
                                className="w-full max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-700/50 pr-2 [&_ul]:list-outside [&_ul]:mt-3 [&_ul]:pl-5 [&_li]:mb-1.5 [&_li]:text-white [&_strong]:text-white"
                                dangerouslySetInnerHTML={{
                                  __html: event.description,
                                }}
                              ></span>
                            </a>
                          </h3>
                          <div className="text-3xl text-white font-medium mt-8">
                            {event.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
