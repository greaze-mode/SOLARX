// src/components/global_accelerator/ImageCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Reusable DotButton component for Embla
const DotButton = ({ selected, onClick, index }) => (
  <button
    className={`carousel-dot ${selected ? "active" : ""}`} // Use classes from your timeline.css
    type="button"
    onClick={onClick}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={selected ? "true" : "false"}
  />
);

const ImageCarousel = ({
  images,
  scrollDelay = 3500,
  autoplay = true,
  loop = true,
}) => {
  const autoplayOptions = {
    delay: scrollDelay,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };
  const emblaPlugins = autoplay ? [Autoplay(autoplayOptions)] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: "start" },
    emblaPlugins
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // Call on init
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect); // Re-calculate on re-initialization

    // Optional: If you want to manually control autoplay pause/resume outside of stopOnMouseEnter
    // This is usually handled well by the plugin itself.
    // const handleMouseEnter = () => emblaApi.plugins().autoplay?.stop();
    // const handleMouseLeave = () => emblaApi.plugins().autoplay?.play();
    // const viewportNode = emblaApi.viewportNode();
    // if (viewportNode) {
    //   viewportNode.addEventListener('mouseenter', handleMouseEnter);
    //   viewportNode.addEventListener('mouseleave', handleMouseLeave);
    //   return () => {
    //     viewportNode.removeEventListener('mouseenter', handleMouseEnter);
    //     viewportNode.removeEventListener('mouseleave', handleMouseLeave);
    //   };
    // }
  }, [emblaApi, onSelect]);

  // Preload first few images (optional, but good for performance)
  useEffect(() => {
    if (images && images.length > 0) {
      images.slice(0, 2).map((image) => {
        const img = new Image();
        img.src = image;
      });
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container bg-gray-700 flex items-center justify-center text-white h-[400px]">
        {" "}
        {/* Ensure fixed height */}
        No images available
      </div>
    );
  }

  return (
    <div className="carousel-container">
      {" "}
      {/* Ensure this class provides relative positioning for dots */}
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((image, index) => (
            <div
              className="embla__slide relative h-full min-w-0" // Standard Embla slide classes
              style={{ flex: "0 0 100%" }} // Make each slide take full width of viewport
              key={image.id || index} // Use a unique id if available, else index
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover" // Use absolute for bg-like effect
                loading={index < 2 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Dots Navigation */}
      {images.length > 1 && ( // Only show dots if more than one image
        <div className="carousel-dots">
          {/* Styles from timeline.css */}
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
