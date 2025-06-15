import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const PrevButton = ({ enabled, onClick }) => (
  <button
    className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 
               text-white/70 hover:text-white focus:outline-none transition-all duration-300 
               opacity-0 group-hover/carousel:opacity-100 md:block 
               disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous slide"
  >
    <BsChevronLeft
      className="h-10 w-10 md:h-14 md:w-14"
      style={{ strokeWidth: "0.5" }}
    />
  </button>
);

const NextButton = ({ enabled, onClick }) => (
  <button
    className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 
               text-white/70 hover:text-white focus:outline-none transition-all duration-300 
               opacity-0 group-hover/carousel:opacity-100 md:block 
               disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next slide"
  >
    <BsChevronRight
      className="h-10 w-10 md:h-14 md:w-14"
      style={{ strokeWidth: "0.5" }}
    />
  </button>
);

const DotButton = ({ selected, onClick, index }) => (
  <button
    className={`h-1 rounded-sm transition-all duration-500 ease-out focus:outline-none
            ${
              selected
                ? "bg-white w-8 md:w-10 scale-x-110"
                : "bg-white/50 w-6 md:w-8 hover:bg-white/75"
            }`}
    type="button"
    onClick={onClick}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={selected ? "true" : "false"}
  />
);

export default function HeroCarousel() {
  const NAVBAR_HEIGHT = "4rem";
  const AUTOPLAY_DELAY = 7000;
  const AUTOPLAY_RESUME_DELAY = 5000;

  // Carousel configuration
  const autoplayOptions = {
    delay: AUTOPLAY_DELAY,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  // State hooks
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay(autoplayOptions)]
  );
  const [slides, setSlides] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      axios
        .get(
          `${API_URL}/home-page?populate[0]=carousel&populate=carousel.image&pagination[pageSize]=100`
        )
        .then((response) => {
          const carouselData = response.data.data.carousel;
          // console.log("Fetched carousel data:", carouselData);

          if (carouselData && carouselData.length > 0) {
            const formattedSlides = carouselData.map((slide) => ({
              id: slide.id,
              title: slide.title,
              description: slide.subtitle,
              layout: slide.layout || "center",
              imgUrl: slide.image.url || "",
              button1Text: slide.button1_text || null,
              button2Text: slide.button2_text || null,
              button1Url: slide.button1_url || null,
              button2Url: slide.button2_url || null,
            }));

            // console.log("Fetched slides:", formattedSlides);

            setSlides(formattedSlides);
          }
        })
        .catch((error) => {
          // console.error("Error fetching carousel data:", error);
          setSlides([]);
        });
    };

    fetchSlides();
  }, []);

  // Navigation callbacks
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

  // Event handlers
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onInteraction = useCallback(() => {
    if (!emblaApi || !emblaApi.plugins()?.autoplay) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    autoplay.stop();

    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = setTimeout(() => {
      autoplay.play();
    }, AUTOPLAY_RESUME_DELAY);
  }, [emblaApi]);

  // Setup effect
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("pointerDown", onInteraction);
    emblaApi.on("keyDown", onInteraction);

    // Cleanup function
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", onInteraction);
      emblaApi.off("keyDown", onInteraction);
    };
  }, [emblaApi, onSelect, onInteraction]);

  // Preload images
  useEffect(() => {
    slides.slice(0, 2).forEach((slide) => {
      const img = new Image();
      img.src = slide.imgUrl;
    });
  }, []);

  const getContentTransitionClasses = (layout = "center", isActive) => {
    const baseTransition = "transition-all duration-700 ease-out";

    if (!isActive) {
      switch (layout) {
        case "left":
          return `${baseTransition} opacity-0 -translate-x-12`;
        case "right":
          return `${baseTransition} opacity-0 translate-x-12`;
        case "bottom":
          return `${baseTransition} opacity-0 translate-y-12`;
        case "top":
          return `${baseTransition} opacity-0 -translate-y-12`;
        case "center":
          return `${baseTransition} opacity-0 translate-x-0 translate-y-0 scale-90`;
        default:
          return `${baseTransition} opacity-0 scale-90`;
      }
    }

    return `${baseTransition} opacity-100 translate-x-0 translate-y-0 scale-100 delay-300`;
  };

  const getContentPlacementClasses = (layout = "center") => {
    switch (layout) {
      case "top-left":
        return "justify-start items-start";
      case "top-center":
        return "justify-center items-start";
      case "top-right":
        return "justify-end items-start";
      case "center-left":
        return "justify-start items-center";
      case "center":
        return "justify-center items-center";
      case "center-right":
        return "justify-end items-center";
      case "bottom-left":
        return "justify-start items-end";
      case "bottom-center":
        return "justify-center items-end";
      case "bottom-right":
        return "justify-end items-end";
      default:
        return "justify-center items-center text-center";
    }
  };

  // Render component
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden group/carousel"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT})`,
        paddingTop: NAVBAR_HEIGHT,
        minHeight: "650px",
        maxHeight: `calc(90vh - ${NAVBAR_HEIGHT})`,
      }}
      aria-roledescription="carousel"
      aria-label="Hero Highlights"
      onMouseEnter={() => emblaApi?.plugins?.()?.autoplay?.stop()}
      onMouseLeave={() => emblaApi?.plugins?.()?.autoplay?.play()}
    >
      {/* Carousel Viewport */}
      <div className="embla h-full overflow-hidden" ref={emblaRef}>
        {/* Carousel Container */}
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => (
            <div
              className="embla__slide relative h-full min-w-0"
              style={{ flex: "0 0 100%" }}
              key={slide.id}
            >
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                  src={slide.imgUrl}
                  alt={`${slide.title}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>

              {/* Slide Content */}
              <div
                className={`relative z-20 h-full flex p-6 md:p-10 lg:p-12 text-center ${getContentPlacementClasses(
                  slide.layout
                )}`}
              >
                <div
                  className={`w-full max-w-3xl text-white just0fy-center items-center text-center ${getContentTransitionClasses(
                    "center",
                    index === selectedIndex
                  )}`}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-shadow">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl font-medium mb-6 md:mb-8 text-white/90 leading-relaxed max-w-2xl text-center justify-center items-center mx-auto">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center ">
                    {slide.button1Text && (
                      <a
                        href={slide.button1Url}
                        className="bg-white text-lg hover:bg-opacity-90 font-semibold py-3 px-7 rounded-full shadow-xl hover:scale-105 transition-all duration-300 ease-in-out md:text-lg text-orange-600"
                      >
                        {slide.button1Text}
                      </a>
                    )}
                    {slide.button2Text && slide.button2Url && (
                      <a
                        href={slide.button2Url}
                        className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-7 
                        rounded-full shadow-lg hover:scale-105 transition-all duration-300 ease-in-out text-base md:text-lg"
                      >
                        {slide.button2Text}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

      {/* Dot Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center space-x-2 md:space-x-2.5 z-30">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
