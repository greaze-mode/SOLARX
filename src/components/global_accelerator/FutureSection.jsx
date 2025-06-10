// src/components/global_accelerator/FutureSection.jsx
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

const FutureSection = () => {
  const [futureData, setFutureData] = useState([]);
  const [lastcarouselImages, setLastCarouselImages] = useState([]);

  useEffect(() => {
    const fetchFutureData = async () => {
      axios
        .get(
          `${API_URL}/global-accelerator?populate[0]=last_section&populate[1]=last_section.Carousel`
        )
        .then((response) => {
          const lastSectionData = response.data.data.last_section;
          // console.log("Fetched events data:", eventsData);

          if (lastSectionData) {
            const formattedLastSection = {
              id: lastSectionData.id,
              title: lastSectionData.Title || "No Heading provided",
              description: lastSectionData.Description || [],
              carousel: lastSectionData.Carousel || [],
            };

            // console.log("Fetched slides:", formattedSlides);

            setFutureData(formattedLastSection);

            const imgs = formattedLastSection.carousel
              .map((item) => {
                return item.url;
              })
              .filter((url) => url !== null);
            // console.log("Fetched future images:", imgs);
            setLastCarouselImages(imgs);
          }
        })
        .catch((error) => {
          console.error("Error fetching events data:", error);
        });
    };

    fetchFutureData();
  }, []);

  return (
    <section className="writeup bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 text-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-4 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Our Future
        </h1>
        <div className="w-1/5 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 px-4 md:px-0">
          <div className="w-full md:w-1/2 md:pr-4">
            <p className="text-lg leading-relaxed text-gray-300 mb-5">
              Looking ahead, the SolarX Challenge under the International Solar
              Alliance (ISA) aims to expand its global footprint by deepening
              engagement with member countries and{" "}
              <strong>fostering regional innovation ecosystems</strong>. Future
              editions of the challenge will emphasize sector-specific solar
              solutions—such as for{" "}
              <strong>
                agriculture, healthcare, and decentralized rural electrification
              </strong>
              —ensuring that solar innovation directly addresses critical
              developmental needs. ISA plans to partner with academic
              institutions, development agencies, and private sector leaders to
              provide a robust support system for innovators, from ideation to
              implementation.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              To further accelerate impact, SolarX will also focus on scaling
              successful solutions through{" "}
              <strong>
                pilot projects, cross-country deployments, and access to green
                finance
              </strong>
              . The challenge will
              <strong>integrate digital tools</strong> to track progress,
              measure impact, and facilitate knowledge-sharing among
              participants. By nurturing a pipeline of solar entrepreneurs and
              enhancing the visibility of
              <strong> clean tech solutions</strong>, ISA envisions SolarX as a
              catalyst in achieving global climate goals and delivering energy
              access to the last mile.
            </p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <ImageCarousel images={lastcarouselImages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
