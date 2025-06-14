import { Zap, Clock, Sun, CheckCircle, Settings, Package } from "lucide-react"; // Example icons
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// Reusable Embla Navigation Buttons (can be in a separate file)
const PrevButton = ({ enabled, onClick }) => (
  <button
    className="p-2 bg-white/90 hover:bg-white/90 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous Image"
  >
    <ChevronLeft size={20} className="text-orange-600" />
  </button>
);

const NextButton = ({ enabled, onClick }) => (
  <button
    className="p-2 bg-white/90 hover:bg-white/90 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next Image"
  >
    <ChevronRight size={20} className="text-orange-600" />
  </button>
);

// Helper to pick an icon based on highlight title (you can expand this)
const getHighlightIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("efficiency"))
    return <Zap size={18} className="text-orange-600 mr-2" />;
  if (lowerTitle.includes("lifespan") || lowerTitle.includes("durability"))
    return <Clock size={18} className="text-orange-600 mr-2" />;
  if (lowerTitle.includes("scalability"))
    return <Settings size={18} className="text-orange-600 mr-2" />;
  if (lowerTitle.includes("deployment"))
    return <Package size={18} className="text-orange-600 mr-2" />;
  // Add more specific icons as needed
  return <CheckCircle size={18} className="text-orange-600 mr-2" />;
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
          <p
            key={blockIndex}
            className="mb-5"
          >
            {children.map((child, i) => {
              // console.log("Child:", child);
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
            ? "list-decimal pl-5 mb-4"
            : "list-disc pl-5 mb-4";

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

const TechnologyCard = ({ technology, techTags }) => {
  // const strapiBaseUrl = import.meta.env.VITE_API_URL; // Define your Strapi base URL

  // console.warn(technology);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const demonstrationImages = technology.Demonstration || [];
  const demonstrationLink = technology.Link;

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

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
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect); // Re-calculate on re-initialization
  }, [emblaApi, onSelect]);

  return (
    <div className="rounded-xl shadow-md border border-orange-200 p-8 md:py-10 md:px-20 w-full overflow-hidden h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side */}
        <div
          className={`flex flex-col ${
            demonstrationImages.length > 0 ? "h-full" : "h-auto col-span-2"
          }`}
        >
          <div className="flex items-center mb-3">
            {/* <div className="p-2 bg-orange-100 rounded-full mr-3">
              <Sun size={24} className="text-orange-600" />{" "}
            </div> */}
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">
              {technology.Name || "No Name Provided"}
            </h2>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
            {renderRichText(technology.Description)}
          </p>

          {techTags && techTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {techTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {technology.Highlights && technology.Highlights.length > 0 && (
            <div className="space-y-4">
              {technology.Highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="bg-orange-50/70 p-4 rounded-lg border border-orange-200/50"
                >
                  <div className="flex items-center mb-1">
                    {getHighlightIcon(highlight.Title)}
                    <h4 className="text-md sm:text-lg font-semibold text-gray-800">
                      {highlight.Title}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base pl-8">
                    {parseRichText(highlight.Description) ||
                      "No description provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Demonstration Image/Video */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          {demonstrationImages.length > 0 && (
            // --- CASE 1: Render Embla Carousel if images exist ---
            <div className="w-full max-w-md">
              <div className="relative">
                <div
                  className="overflow-hidden rounded-lg shadow-lg border-2 border-orange-200"
                  ref={emblaRef}
                >
                  <div className="flex h-[300px] md:h-[450px]">
                    {demonstrationImages.map((image, index) => (
                      <div
                        className="embla__slide" // Embla slide styling
                        key={image.id || index}
                      >
                        <img
                          src={`${image.url}`}
                          alt={`${technology.Name} demonstration ${index + 1}`}
                          className="relative object-contain w-full h-[300px] md:h-[450px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {demonstrationImages.length > 1 && ( // Show nav only if multiple slides
                  <>
                    <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-3">
                      <PrevButton
                        onClick={scrollPrev}
                        enabled={prevBtnEnabled}
                      />
                      <NextButton
                        onClick={scrollNext}
                        enabled={nextBtnEnabled}
                      />
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                      {scrollSnaps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => scrollTo(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === selectedIndex
                              ? "bg-orange-600 scale-125"
                              : "bg-gray-900/50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyCard;
