import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { mentorsData } from "./mentorData"; // Ensure this path is correct
import "../../styles/timeline.css";
import axios from "axios";
import { API_URL } from "../../services/api";

const PrevButton = ({ enabled, onClick }) => (
  <button
    className="workshops-embla__button workshops-embla__button--prev"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous slide"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
    </svg>
  </button>
);

const NextButton = ({ enabled, onClick }) => (
  <button
    className="workshops-embla__button workshops-embla__button--next"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next slide"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z" />
    </svg>
  </button>
);

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
    if (
      session.month != "March" &&
      session.month != "April" &&
      session.month != "May"
    ) {
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

const checkUpcomingEvents = (dates) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dates.some((dateStr) => {
    const date = new Date(dateStr);
    return date > today;
  });
};

// --- TimelineSection Component ---
const TimelineSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      axios
        .get(
          `${API_URL}/global-accelerator?populate[0]=events&populate[1]=events.Image&populate[2]=events.mentor&populate[3]=events.mentor.Profile_Picture&populate[4]=events.mentor.mentor_designation`
        )
        .then((response) => {
          const eventsData = response.data.data.events;
          // console.log("Fetched events data:", eventsData);

          if (eventsData && eventsData.length > 0) {
            const formattedEvents = eventsData.map((event) => ({
              id: event.id,
              img: event.Image.url || null,
              title: event.Topic || null,
              mentorDetails:
                `${event.mentor.Name} (${event.mentor.mentor_designation[0].Company})` ||
                null,
              isUpcoming: checkUpcomingEvents(event.Dates),
              dates: event.Dates || [],
              mentorImg: event.mentor.Profile_Picture?.url || null,
            }));

            // console.log("Fetched slides:", formattedSlides);

            setEvents(formattedEvents);
          }
        })
        .catch((error) => {
          console.error("Error fetching Workshops:", error);
        });
    };

    fetchEvents();
  }, []);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    events && (
      <section
        id="workshops"
        className="w-screen bg-gradient-to-tr from-gray-900 via-orange-900 to-orange-700 text-white py-20"
      >
        <div className="max-w-7xl mx-auto pt-16 pb-8">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center text-white"
            style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
          >
            Online Workshops
          </h1>
          <div className="w-1/4 h-1 mx-auto bg-white rounded-full"></div>
        </div>
        <div className="workshops-embla" ref={emblaRef}>
          <div className="workshops-embla__container">
            {events.map((event) => (
              <div className="workshops-embla__slide" key={event.id}>
                {/* --- THIS IS THE RESPONSIVE VERSION OF YOUR ORIGINAL LAYOUT --- */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full box-border p-6 md:p-12 lg:px-24">
                  <div className="relative flex-shrink-0 w-full max-w-xs md:max-w-none md:w-auto mb-6 md:mb-0 md:mr-8 lg:mr-12">
                    {event.isUpcoming && (
                      <div className="absolute top-4 right-4 md:top-5 md:right-5 md:transform bg-gradient-to-r from-red-600 to-orange-500 text-white text-base font-bold py-2 px-4 md:px-6 rounded-full z-10 animate-pulse">
                        UPCOMING
                      </div>
                    )}
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full md:w-[650px] md:max-w-[40vw] h-auto max-h-[40vh] md:max-h-[80vh] object-cover md:object-contain shadow-2xl rounded-2xl border-2 border-white/10"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold pb-2.5 mb-2 text-white">
                      {event.title}
                      <div className="w-1/3 h-1.5 mt-4 mx-auto md:mx-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    </h2>

                    <div className="mt-4 w-full">
                      <div className="flex flex-col items-center md:items-start space-y-4">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <img
                            src={event.mentorImg}
                            alt={`${event.mentorDetails}'s image`}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white/20 flex-shrink-0"
                          />
                          <h3 className="text-lg md:text-xl font-semibold text-white">
                            <span>Speaker: {event.mentorDetails}</span>
                          </h3>
                        </div>
                        <div className="text-xl md:text-3xl text-white/80 font-medium pt-4">
                          {event.dates
                            .map((date, idx) => {
                              const d = new Date(date);
                              return d.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                            })
                            .join(" & ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

          <div className="workshops-embla__dots">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`workshops-embla__dot ${
                  index === selectedIndex ? "workshops-embla__dot--selected" : ""
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default TimelineSection;
