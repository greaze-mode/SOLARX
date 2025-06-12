// src/components/global_accelerator/HeroSectionGA.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../services/api";
import ImageCarousel from "./ImageCarousel"; // Import the new carousel

// Image paths should be relative to the public folder or imported

const renderRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray) || richTextArray.length === 0) {
    return <p className="text-gray-600">No content available.</p>;
  }

  return richTextArray.map((block, blockIndex) => {
    const { type, level, children, format } = block;

    // Handle different block types
    switch (type) {
      case "heading":
        const HeadingTag = `h${level}`;
        return (
          <HeadingTag
            key={blockIndex}
            className={`font-bold text-gray-800 mb-3 mt-4 ${
              level === 1 ? "text-2xl" : "text-xl"
            }`}
          >
            {children.map((child, i) => child.text)}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p key={blockIndex} className="text-gray-600 mb-4">
            {children.map((child, i) => {
              console.log("Child:", child);
              if (child.bold === true) {
                return <span className="font-bold">{child.text}</span>;
              } else if (child.italic === true) {
                return <span className="italic">{child.text}</span>;
              } else if (child.underline === true) {
                return <span className="underline">{child.text}</span>;
              }
              return child.text;
            })}
          </p>
        );

      case "list":
        const ListTag = format === "ordered" ? "ol" : "ul";
        const listClass =
          format === "ordered"
            ? "list-decimal pl-5 mb-4 text-gray-600"
            : "list-disc pl-5 mb-4 text-gray-600";

        return (
          <ListTag key={blockIndex} className={listClass}>
            {children.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {item.children.map((child, i) => child.text)}
              </li>
            ))}
          </ListTag>
        );

      default:
        return (
          <p key={blockIndex} className="text-gray-600 mb-4">
            {children?.map((child, i) => child.text) || ""}
          </p>
        );
    }
  });
};

const HeroSectionGA = () => {
  // Get navbar height (approximate or from context/prop if dynamic)
  // For now, let's assume a fixed height or ensure Navbar is not overlapping due to page structure.
  // The main page wrapper should handle padding for the fixed navbar.
  const navbarHeight = "4.5rem"; // Example: 'h-20' or 80px. Adjust this!

  const [heroData, setHeroData] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchHeroData = async () => {
      axios
        .get(
          `${API_URL}/global-accelerator?populate[0]=main_section&populate[1]=main_section.Carousel&pagination[pageSize]=100`
        )
        .then((response) => {
          const mainSectionData = response.data.data.main_section;
          // console.log("Fetched events data:", eventsData);

          if (mainSectionData) {
            const formattedMainSection = {
              id: mainSectionData.id,
              title: mainSectionData.Title || "No Heading provided",
              description: mainSectionData.Description || [],
              carousel: mainSectionData.Carousel || [],
            };

            // console.log("Fetched slides:", formattedSlides);

            setHeroData(formattedMainSection);

            const images = formattedMainSection.carousel
              .map((item) => {
                return item.url;
              })
              .filter((url) => url !== null);
            // console.log("Fetched images:", images);
            setCarouselImages(images);
          }
        })
        .catch((error) => {
          console.error("Error fetching events data:", error);
        });
    };

    fetchHeroData();
  }, []);

  return (
    <section
      className="bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 text-white py-20 md:py-24"
      style={{ paddingTop: `calc(${navbarHeight} + 3rem)` }} // Adding navbar height + some extra padding
    >
      <div className="max-w-7xl mx-auto pt-16">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Global Accelerator Program
        </h1>
        <div className="w-1/4 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 pt-10 px-8 md:px-0">
          <div className="w-full md:w-1/2 md:pr-4">
            <p className="text-lg leading-relaxed text-gray-300 mb-5">
              The <strong>SolarX Global Accelerator Program</strong>,
              spearheaded by the
              <strong> International Solar Alliance (ISA)</strong>, has emerged
              as a transformative platform for nurturing early-stage solar
              startups across its member nations. Through a dynamic blend of
              workshops, webinars, and mentoring sessions, the program aims to{" "}
              <strong>empower entrepreneurs with the tools</strong> and insights
              necessary to drive innovation in the solar energy sector. By
              fostering scalable and replicable business models, SolarX
              contributes significantly to accelerating the{" "}
              <strong>global transition towards clean energy</strong>.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              A notable highlight of the program is the SolarX Startup
              Challenge, which has garnered substantial participation from the
              <strong> Asia-Pacific region</strong>. In its 2024 edition, the
              challenge recognized
              <strong>
                {" "}
                30 promising startups—20 from the broader APAC region and 10
                from India—each awarded a cash grant of USD 15,000
              </strong>
              . Beyond financial support, these startups benefit from a{" "}
              <strong>comprehensive acceleration program</strong>, including
              mentorship from seasoned professionals, investor connections, and
              market access initiatives. Such engagements underscore ISA's
              commitment to fostering a{" "}
              <strong>robust startup ecosystem</strong>, addressing energy
              access disparities, and promoting{" "}
              <strong>sustainable development</strong> across its member
              countries.
            </p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <ImageCarousel images={carouselImages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionGA;
