import { useState, useEffect } from "react";
import { fetchMentors, getMediaUrl } from "../services/api";

export default function MentorCarousel({ darkMode = false, companyId }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchMentors(companyId);
        const founders = response.data[0].founders || [];

        console.log(founders)

        if (response && response.data) {
          const processedMentors = founders.map((founder) => {
            const mentorData = {
              id: founder.id,
              name: founder.Name || "",
              title: founder.Designation || "",
              description: founder.Short_Description[0].children[0].text || "",
              image: founder.Profile_Picture
                ? getMediaUrl(founder.Profile_Picture)
                : `https://placehold.co/400x400/orange/white?text=${encodeURIComponent(
                    founder.name || "Mentor"
                  )}`,
            };
            return mentorData;
          });

          setMentors(processedMentors);

          if (processedMentors.length > 0) {
            setActiveIndex(processedMentors[0].id);
          }
        } else {
          console.error("No mentor data received from API");
          setMentors([]);
        }
      } catch (error) {
        console.error("Error fetching mentors data:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const [activePosition, setActivePosition] = useState(0);

  useEffect(() => {
    if (mentors.length > 0) {
      const activeMentorPosition = mentors.findIndex(
        (mentor) => mentor.id === activeIndex
      );

      if (activeMentorPosition !== -1) {
        setActivePosition(activeMentorPosition);
      } else {
        setActivePosition(0);
      }
    }
  }, [activeIndex, mentors]);

  const getCardClasses = (mentorId) => {
    const baseClasses =
      "absolute transition-all duration-700 transform w-64 md:w-80 filter";

    if (mentorId === activeIndex) {
      return `${baseClasses} scale-100 z-30 opacity-100 blur-none`;
    }

    if (mentors.length === 0) return baseClasses;

    const mentorPosition = mentors.findIndex((m) => m.id === mentorId);
    if (mentorPosition === -1) return `${baseClasses} opacity-0`;

    const totalMentors = mentors.length;

    const nextPosition = (activePosition + 1) % totalMentors;
    const prevPosition =
      activePosition === 0 ? totalMentors - 1 : activePosition - 1;

    if (mentorPosition === prevPosition) {
      return `${baseClasses} scale-75 -translate-x-32 md:-translate-x-64 z-20 opacity-70 blur-sm`;
    }

    if (mentorPosition === nextPosition) {
      return `${baseClasses} scale-75 translate-x-32 md:translate-x-64 z-10 opacity-70 blur-sm`;
    }

    return `${baseClasses} opacity-0`;
  };

  return (
    <section
      id="founders"
      className={`py-16 relative overflow-hidden h-[80%] ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container px-[69px]">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Meet our Founders
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="flex flex-wrap justify-center gap-6">
                {mentors.length > 0 ? (
                  mentors.map((mentor) => (
                    <div key={mentor.id} className="w-64 md:w-80 ">
                      <div
                        className={`bg-gradient-to-b rounded-xl overflow-hidden shadow-2xl h-full ${
                          darkMode
                            ? "from-black to-gray-800 border border-orange-500/20"
                            : "from-white to-orange-50 border border-orange-200"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
                        </div>
                        <div className="p-6">
                          <h3
                            className={`text-xl font-bold mb-1 ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {mentor.name}
                          </h3>
                          <p className="text-orange-500 font-medium mb-3">
                            {mentor.title}
                          </p>
                          <div className="max-h-48 overflow-y-auto mb-4">
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {mentor.description}
                            </p>
                          </div>
                          <div className="flex space-x-3"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p
                      className={`text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      No mentors found. Please add mentors in the Strapi admin
                      panel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
