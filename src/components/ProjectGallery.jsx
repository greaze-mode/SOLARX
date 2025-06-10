import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";

// Helper function to extract plain text from Strapi's rich text format
const extractRichTextToString = (richTextArray) => {
  let text = "";
  if (Array.isArray(richTextArray)) {
    richTextArray.forEach((block) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.text) {
            text += child.text + " ";
          }
          // Optional: Handle nested children if your structure is deeper
          if (child.children && Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              if (grandchild.text) {
                text += grandchild.text + " ";
              }
            });
          }
        });
      }
    });
  }
  return text.trim();
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

const ProjectGallery = ({ companyId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSliderControls, setShowSliderControls] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!companyId) {
        setError("Company ID is required to fetch projects.");
        setLoading(false);
        setProjects([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_URL;
        // Fix the populate syntax - using the correct format for Strapi v4
        const apiUrl = `${baseUrl}/api/projects?filters[startup][id][$eq]=${companyId}&populate=*`;
        // console.log("Fetching projects from:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          // console.log("API Error Response:", errorData);

          let errorMessage;
          if (response.status === 404) {
            // Handle 404 errors specifically
            errorMessage = `The requested resource was not found. Company ID ${companyId} may not exist.`;
          } else if (response.status === 400) {
            // Handle 400 errors with more detail
            errorMessage =
              errorData?.error?.message ||
              `Bad request: There may be an issue with the API query parameters.`;
          } else {
            // Generic error handling
            errorMessage =
              errorData?.error?.message ||
              `API request failed: ${response.status} ${response.statusText}`;
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        // console.log("Projects data from API:", result);

        if (result && result.data && result.data.length > 0) {
          const processedProjects = result.data.map((apiProject) => {
            // Ensure we're working with the correct data structure
            const projectData = apiProject.attributes || apiProject;

            // Log the entire project structure to understand the data format
            // console.log("Processing project:", apiProject);

            // Extract overview text safely
            const overviewText =
              extractRichTextToString(projectData.Overview) ||
              projectData.One_Line_Description ||
              "No detailed overview available.";

            // Handle image data safely
            let imageUrl = null;
            let imageAlt = projectData.Name || "Project image";

            // Check for Banner_Image in different possible structures
            const bannerImage = projectData.Banner_Image;

            if (bannerImage) {
              // Get image attributes
              imageUrl = bannerImage.url || null;
              // imageAlt = img.alternativeText || img.name || imageAlt;
            }

            // Log the image data for debugging
            // console.log("Banner Image data:", projectData.Banner_Image);

            // Store the full overview for the popup
            const overview = projectData.Overview || [];
            const documentId = projectData.documentId || "";
            const projectType = projectData.Type || "";

            // Log additional fields for debugging
            // console.log("Project fields:", {
            //   name: projectData.Name,
            //   oneLiner: projectData.One_Line_Description,
            //   documentId,
            //   type: projectType,
            // });

            // Log the overview structure to help with debugging
            // console.log("Project overview structure:", overview);

            return {
              id: apiProject.id,
              name: projectData.Name || `Project ${apiProject.id}`,
              description: overviewText,
              oneLiner: projectData.One_Line_Description || "",
              image: imageUrl ? { url: imageUrl, alt: "" } : null,
              externalUrl: projectData.URL || null, // Main project URL
              // Additional data for the popup
              overview: overview,
              documentId: documentId,
              type: projectType,
              // Store the raw data for debugging and future use
              rawData: apiProject,
            };
          });

          setProjects(processedProjects);
        } else {
          // console.log(`No projects found for companyId: ${companyId}.`);
          // Provide a specific message if no projects, rather than placeholders if not desired
          setProjects([]); // Or set placeholder if required by design
          // setError(`No projects found for this company.`); // Optionally set error for no data
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err.message || "An unknown error occurred while fetching projects."
        );
        setProjects([]); // Clear projects on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [companyId]);

  // Logic to show/hide slider controls based on project count and screen size
  useEffect(() => {
    const updateSliderVisibility = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 768) {
          setShowSliderControls(projects.length > 1);
        } else if (width < 1024) {
          setShowSliderControls(projects.length > 2);
        } else {
          setShowSliderControls(projects.length > 3);
        }
      }
    };

    updateSliderVisibility();
    window.addEventListener("resize", updateSliderVisibility);
    return () => window.removeEventListener("resize", updateSliderVisibility);
  }, [projects.length]);

  // Handle escape key and outside click for popup
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };

    const handleOutsideClick = (e) => {
      // Check if the click is outside the popup content
      if (selectedProject && e.target.classList.contains("fixed")) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedProject]);

  // React Slick settings
  const sliderSettings = {
    dots: true,
    infinite: projects.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // Using custom external arrows
    responsive: [
      {
        breakpoint: 1023, // Medium screens
        settings: {
          slidesToShow: 2,
          infinite: projects.length > 2,
        },
      },
      {
        breakpoint: 767, // Small screens
        settings: {
          slidesToShow: 1,
          infinite: projects.length > 1,
        },
      },
    ],
  };

  // Fallback content if no projects are loaded or available
  const renderFallbackContent = () => {
    if (projects.length === 0 && !error) {
      // No projects, no error
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No Projects Found
          </h3>
          <p className="text-gray-500">
            {companyId
              ? "This company hasn't added any projects to their gallery yet."
              : "Please select a valid company to view its projects."}
          </p>
        </div>
      );
    }
    return null; // Error/loading handled separately
  };

  return (
    projects.length !== 0 && (
      <div className="px-4 sm:px-6 lg:px-[69px] mx-auto py-12 ml-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full">
          <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-1 text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Project Gallery
            </span>
          </h1>
          <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        </div>

        {loading && (
          <div className="flex flex-col justify-start items-start py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-700">Loading projects...</p>
          </div>
        )}

        {error && !loading && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg relative max-w-2xl"
            role="alert"
          >
            <h3 className="text-lg font-semibold mb-2">
              Unable to Load Projects
            </h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && renderFallbackContent()}

        {!loading && !error && projects.length > 0 && (
          <div className="relative">
            {showSliderControls && (
              <>
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-3 sm:-ml-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
                  aria-label="Previous projects"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-3 sm:-mr-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
                  aria-label="Next projects"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div className="-mx-3">
              <Slider ref={sliderRef} {...sliderSettings}>
                {projects.map((project) => (
                  <div key={project.id} className="px-3 h-full">
                    {" "}
                    {/* Padding for gap */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group w-full h-full">
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image.url}
                            alt={project.image.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                            <FileText
                              size={48}
                              className="text-white opacity-50"
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-xl font-bold text-white text-left">
                            {project.name}
                          </h3>
                          {project.oneLiner && (
                            <p className="text-sm text-orange-200 mt-1 truncate text-left">
                              {project.oneLiner}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col text-left">
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow text-left">
                          {project.description}
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
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {/* Style overrides for react-slick and line-clamp */}
        <style jsx global>{`
          .slick-dots {
            bottom: -30px; /* Position dots below the slider */
          }
          .slick-dots li button:before {
            font-size: 10px;
            color: #d1d5db; /* gray-300 */
            opacity: 1;
            transition: all 0.3s ease;
          }
          .slick-dots li.slick-active button:before {
            color: #f97316; /* orange-500 */
            opacity: 1;
            transform: scale(1.5);
          }
          .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>

        {/* Project Details Popup (unchanged) */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-start justify-center overflow-y-auto"
            style={{ paddingTop: "80px", paddingBottom: "40px" }}
          >
            <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full my-4 mx-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-50"
                aria-label="Close popup"
                style={{ boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
              >
                <X size={24} className="text-gray-800" />
              </button>
              <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image.url}
                    alt={selectedProject.image.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <FileText size={64} className="text-white opacity-50" />
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <div className="prose prose-orange max-w-none">
                  <h2 className="text-3xl font-bold mb-8">
                    {selectedProject.name}
                  </h2>
                  {Array.isArray(selectedProject.overview) &&
                  selectedProject.overview.length > 0 ? (
                    renderRichText(selectedProject.overview)
                  ) : (
                    <p className="text-gray-600">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
                {selectedProject.externalUrl && (
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <a
                      href={selectedProject.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Visit Project Website
                      <ExternalLink size={18} className="ml-2" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ProjectGallery;
