import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../services/api";
import MentorCard from "./MentorCard";
// import { mentorsData } from "./mentorData";

const MentorsSection = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      axios
        .get(
          `${API_URL}/global-accelerator?populate[0]=meet_the_mentors&populate[1]=meet_the_mentors.Profile_Picture&populate[2]=meet_the_mentors.mentor_designation`
        )
        .then((response) => {
          const mentorsData = response.data.data.meet_the_mentors;

          if (mentorsData) {
            const formattedMentors = mentorsData.map((mentor) => ({
              imgSrc: mentor.Profile_Picture?.url || null,
              name: mentor.Name || null,
              title:
                mentor.mentor_designation
                  .map(
                    (designation) =>
                      `${designation.Designation}, ${designation.Company}`
                  )
                  .join("; ") || null,
              bio: mentor.Description || null,
            }));

            // console.log("Fetched Media Mentions:", formattedMedia);
            setMentors(formattedMentors);
          }
        })
        .catch((error) => {
          console.error("Error fetching Mentors data:", error);
        });
    };

    fetchMentors();
  }, []);
  return (
    <section
      id="mentors"
      className="investor-profiles-section bg-gradient-to-tl from-orange-700 via-orange-900 to-gray-900 text-white py-24 md:py-32"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[69px]">
        <h2
          className="text-4xl md:text-6xl font-bold mb-12 md:mb-4 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Meet the Mentors
        </h2>
        <div className="w-1/4 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
        <div className="relative">
          <div className="investor-carousel-wrapper w-full overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex space-x-4 lg:space-x-6 py-2">
              {mentors.map((mentor, index) => (
                <MentorCard key={index} {...mentor} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default MentorsSection;
