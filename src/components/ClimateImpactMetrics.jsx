import { useState, useEffect, useRef } from "react";

export default function ClimateImpactMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedValues, setAnimatedValues] = useState({});
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const CARDS_PER_SLIDE = 4;

  // Icons mapping for different metric types
  const getIconByType = (type) => {
    const iconTypes = {
      carbon: (
        <svg
          className="w-8 h-8 text-amber-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      water: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      waste: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      energy: (
        <svg
          className="w-8 h-8 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      social: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      default: (
        <svg
          className="w-8 h-8 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    };

    return iconTypes[type] || iconTypes.default;
  };

  // Color mapping for different types
  const getColorsByType = (type) => {
    const colorTypes = {
      carbon: { bg: "bg-amber-50", border: "border-amber-200" },
      water: { bg: "bg-blue-50", border: "border-blue-200" },
      waste: { bg: "bg-green-50", border: "border-green-200" },
      energy: { bg: "bg-yellow-50", border: "border-yellow-200" },
      social: { bg: "bg-purple-50", border: "border-purple-200" },
      default: { bg: "bg-gray-50", border: "border-gray-200" },
    };

    return colorTypes[type] || colorTypes.default;
  };

  // Fetch impact metrics from Strapi
  useEffect(() => {
    const fetchImpactMetrics = async () => {
      try {
        setLoading(true);

        // Construct the API URL
        const baseUrl = import.meta.env.VITE_API_URL;
        const apiPath = import.meta.env.VITE_CMS_API_PATH || "/api";
        const apiUrl = `${baseUrl}${apiPath}/impact-metrics?populate=*&pagination[pageSize]=100`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        console.log("Impact metrics data from API:", result);

        if (result && result.data && result.data.length > 0) {
          // Process the metrics data
          const processedMetrics = result.data.map((item, index) => {
            // Extract the numeric value if possible
            const valueString = item.value || "";
            const numericMatch = valueString.match(/(\d+(?:\.\d+)?)/);
            const targetValue = numericMatch ? parseFloat(numericMatch[1]) : 0;

            // Determine the metric type based on the category or metric name
            const category = (item.category || "").toLowerCase();
            const metricName = (item.metric || "").toLowerCase();

            let metricType = "default";
            if (
              category.includes("carbon") ||
              metricName.includes("carbon") ||
              metricName.includes("co2")
            ) {
              metricType = "carbon";
            } else if (
              category.includes("water") ||
              metricName.includes("water")
            ) {
              metricType = "water";
            } else if (
              category.includes("waste") ||
              metricName.includes("waste") ||
              metricName.includes("recycl")
            ) {
              metricType = "waste";
            } else if (
              category.includes("energy") ||
              metricName.includes("energy") ||
              metricName.includes("power")
            ) {
              metricType = "energy";
            } else if (
              category.includes("social") ||
              metricName.includes("social") ||
              metricName.includes("people") ||
              metricName.includes("household")
            ) {
              metricType = "social";
            } else if (
              category.includes("renewable") ||
              metricName.includes("renewable")
            ) {
              metricType = "energy";
            }

            // Get the appropriate colors and icon
            const colors = getColorsByType(metricType);
            const icon = getIconByType(metricType);

            return {
              id: `metric-${item.id || index}`,
              icon,
              title: item.metric || "Impact Metric",
              value: item.value || "0",
              targetValue,
              subtitle: item.category || "",
              bgColor: colors.bg,
              borderColor: colors.border,
              delay: `delay-${(index % 4) * 100 + 100}`,
            };
          });

          setMetrics(processedMetrics);

          // Initialize animated values
          const initialValues = {};
          processedMetrics.forEach((metric) => {
            initialValues[metric.id] = 0;
          });
          setAnimatedValues(initialValues);
        } else {
          // If no data found, set empty metrics
          setMetrics([]);
          console.log("No impact metrics found in API");
        }
      } catch (err) {
        console.error("Error fetching impact metrics:", err);
        setError(err.message);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactMetrics();
  }, []);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate counter values
  useEffect(() => {
    if (!isVisible || metrics.length === 0) return;

    const animateValue = (id, target, duration = 2000) => {
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + target * easeOutQuart;

        setAnimatedValues((prev) => ({
          ...prev,
          [id]: current,
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    // Start animations with staggered delays for all metrics
    metrics.forEach((metric, index) => {
      setTimeout(
        () => animateValue(metric.id, metric.targetValue),
        200 + index * 200
      );
    });
  }, [isVisible, metrics]);

  const formatValue = (metric, value) => {
    if (!metric) return "0";

    // If the value is very small or zero, just return the original string value
    if (value < 0.1 && metric.targetValue < 0.1) {
      return metric.value;
    }

    // Extract the numeric part and the unit/text part
    const valueString = metric.value;
    const numericMatch = valueString.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const numericPart = numericMatch ? numericMatch[1] : "";

    // Get the text after the numeric part (units, etc.)
    const unitPart = numericPart
      ? valueString.replace(numericPart, "").trim()
      : valueString;

    // Format the animated value
    let formattedValue;
    if (value >= 1000) {
      formattedValue = Math.floor(value).toLocaleString();
    } else if (value >= 1) {
      formattedValue = value.toFixed(1);
    } else {
      formattedValue = value.toFixed(2);
    }

    return `${formattedValue}${unitPart}`;
  };

  const totalSlides = Math.ceil(metrics.length / CARDS_PER_SLIDE);
  const showSlider = metrics.length > CARDS_PER_SLIDE;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    metrics.length > 0 && (
      <section
        ref={sectionRef}
        className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 left-10 w-80 h-80 bg-green-300 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Renewable Energy & Social Development
              </h2>
              <div className="ml-4 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Measuring our contribution to a sustainable future through
              verifiable impact metrics.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          )}

          {/* Metrics Slider - Only show when data is available */}
          {!loading && !error && metrics.length > 0 && (
            <div className="relative max-w-7xl mx-auto">
              {/* Slider Navigation - Only show if more than 4 cards */}
              {showSlider && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-110"
                    disabled={currentSlide === 0}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-110"
                    disabled={currentSlide === totalSlides - 1}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Cards Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {metrics
                          .slice(
                            slideIndex * CARDS_PER_SLIDE,
                            (slideIndex + 1) * CARDS_PER_SLIDE
                          )
                          .map((metric) => (
                            <div
                              key={metric.id}
                              className={`transform transition-all duration-700 ${
                                metric.delay
                              } ${
                                isVisible
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-8 opacity-0"
                              } group hover:scale-105`}
                            >
                              <div
                                className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-2xl p-6 h-full shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group-hover:border-opacity-60`}
                              >
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-current rounded-full transform translate-x-16 -translate-y-16"></div>
                                </div>

                                {/* Icon */}
                                <div
                                  className={`inline-flex items-center justify-center w-16 h-16 ${metric.bgColor.replace(
                                    "50",
                                    "100"
                                  )} rounded-xl mb-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                                >
                                  {metric.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                                  {metric.title}
                                </h3>

                                {/* Value with animation */}
                                <div className="mb-3">
                                  <div className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    {formatValue(
                                      metric,
                                      animatedValues[metric.id]
                                    )}
                                  </div>
                                </div>

                                {/* Subtitle */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {metric.subtitle}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Indicators - Only show if more than 4 cards */}
              {showSlider && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-blue-500 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-1/4 left-8 w-3 h-3 bg-green-400 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 right-8 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </section>
    )
  );
}
