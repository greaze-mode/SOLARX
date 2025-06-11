import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api.js";

const truncate = (string, length, end = "...") => {
  return string.length < length ? string : string.substring(0, length) + end;
};

const renderPreviewText = (richTextArray) => {
  if (!Array.isArray(richTextArray) || richTextArray.length === 0) {
    return <p className="text-gray-600">No content available.</p>;
  }
  return richTextArray.map((block, blockIndex) => {
    const { type, level, children, format } = block;
    return children.map((child, i) => child.text);
  });
};

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

export const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      axios
        .get(
          `${API_URL}/home-page?populate[0]=events_gallery&populate[1]=events_gallery.carousel`
        )
        .then((response) => {
          const eventsData = response.data.data.events_gallery;
          // console.log("Fetched events data:", eventsData);

          if (eventsData && eventsData.length > 0) {
            const formattedEvents = eventsData.map((event) => ({
              id: event.id,
              title: event.title || "Untitled Event",
              date: event.date || "No date provided",
              description: event.description || [],
              imgSrc: event.carousel || [],
            }));

            // console.log("Fetched slides:", formattedSlides);

            setEvents(formattedEvents);
          }
        })
        .catch((error) => {
          console.error("Error fetching events data:", error);
        });
    };

    fetchEvents();
  }, []);

  const getResponsiveItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
    }
    return 3;
  };

  const [effectiveItemsPerView, setEffectiveItemsPerView] = useState(
    getResponsiveItemsPerView()
  );

  useEffect(() => {
    const handleResize = () => {
      setEffectiveItemsPerView(getResponsiveItemsPerView());
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (selectedProject?.imgSrc?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === selectedProject.imgSrc.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedProject]);

  const totalItems = events.length;
  const showSlider = totalItems > effectiveItemsPerView;

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const maxIndex = Math.max(0, totalItems - effectiveItemsPerView);

  const visibleProjects = events.slice(
    currentIndex,
    currentIndex + effectiveItemsPerView
  );

  const goToNextImage = () => {
    if (selectedProject?.imgSrc) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.imgSrc.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPreviousImage = () => {
    if (selectedProject?.imgSrc) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.imgSrc.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="w-full px-[69px] py-12" id="events">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
          Event Gallery
        </span>
      </h1>
      <div className="w-28 h-1.5 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-10 md:mb-16"></div>

      <div className="relative">
        {showSlider && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 -ml-3 sm:-ml-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
              }`}
              aria-label="Previous projects"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 -mr-3 sm:-mr-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 ${
                currentIndex >= maxIndex
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
              }`}
              aria-label="Next projects"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start ${
            effectiveItemsPerView === 2 ? "lg:grid-cols-2" : ""
          } ${
            effectiveItemsPerView === 1 ? "md:grid-cols-1 lg:grid-cols-1" : ""
          }`}
        >
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group w-full"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                {project.imgSrc ? (
                  <img
                    src={project.imgSrc[0].url}
                    alt={`${project.title} image`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <FileText size={48} className="text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white text-left">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col text-left">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow text-left">
                  {renderPreviewText(project.description)}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200 text-left">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline transition-colors duration-200 group/link"
                  >
                    Learn More
                    <ExternalLink
                      size={16}
                      className="ml-1.5 transform transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showSlider && totalItems > effectiveItemsPerView && (
          <div className="flex justify-start mt-8 space-x-2">
            {Array.from({
              length: totalItems - effectiveItemsPerView + 1,
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 ${
                  index === currentIndex
                    ? "bg-orange-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to project set ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Project Details Popup */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-start justify-center overflow-y-auto"
          style={{ paddingTop: "40px", paddingBottom: "40px" }}
        >
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full my-4 mx-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-50"
              aria-label="Close popup"
              style={{ boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
            >
              <X size={24} className="text-gray-800" />
            </button>

            {/* Project image header with carousel */}
            <div className="relative w-full h-[32rem] overflow-hidden">
              {selectedProject.imgSrc ? (
                <>
                  <div className="relative w-full h-full">
                    {selectedProject.imgSrc.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`${selectedProject.title} image ${index + 1}`}
                        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  {selectedProject.imgSrc.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} className="text-gray-800" />
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} className="text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Image indicators */}
                  {selectedProject.imgSrc.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {selectedProject.imgSrc.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white scale-125"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <FileText size={64} className="text-white opacity-50" />
                </div>
              )}
            </div>

            <h2 className="text-3xl px-6 sm:px-8 pt-4 font-bold text-black">
              {selectedProject.title}
            </h2>

            <p className="text-gray-600 px-6 sm:px-8">
              Dates: {selectedProject.date}
            </p>

            {/* Project content */}
            <div className="p-6 sm:p-8">
              <div className="prose prose-orange max-w-none">
                {renderRichText(selectedProject.description)}
              </div>
            </div>

            <div className="py-1.5 bg-amber-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};
