import React, {useState, useEffect} from "react";

export default function PressFeaturesSection({companyId}) {
    const [mediaCoverage, setMediaCoverage] = useState([]);
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!companyId) {
                setError("Company ID is required to fetch press features.");
                setLoading(false);
                setMediaCoverage([]);
                setAwards([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const baseUrl = import.meta.env.VITE_API_URL;
                const apiUrl = `${baseUrl}/api/startups?filters[id][$eq]=${companyId}&populate=Media`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    const errorMessage =
                        errorData?.error?.message ||
                        `API request failed: ${response.status} ${response.statusText}`;
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log("API Response for startup media:", result);

                if (result && result.data && result.data.length > 0) {
                    const startupData = result.data[0];
                    const mediaItemsFromApi = startupData.Media;

                    if (mediaItemsFromApi && mediaItemsFromApi.length > 0) {
                        const processedMediaItems = [];
                        const processedAwardItems = [];

                        mediaItemsFromApi.forEach((apiItem) => {
                            const source = apiItem.Source || "Media Source";
                            const title = apiItem.Headline || "Article Headline"; // Was item.title
                            const date = apiItem.Date || "";
                            const link = apiItem.URL || "";

                            const initials = source.substring(0, 2).toUpperCase();

                            const processedItem = {
                                id: apiItem.id,
                                source,
                                title,
                                description: "", // New API structure for Media doesn't have a separate description field
                                date,
                                link,
                                initials,
                            };

                            // Heuristic to determine if it's an award
                            const isAward =
                                title &&
                                (title.toLowerCase().includes("award") ||
                                    title.toLowerCase().includes("honor") ||
                                    title.toLowerCase().includes("recognition") ||
                                    title.toLowerCase().includes("prize"));

                            if (isAward) {
                                processedAwardItems.push({
                                    ...processedItem,
                                    organization: source, // Use source as organization for awards
                                    awardTitle: title, // Use headline as award title
                                });
                            } else {
                                processedMediaItems.push(processedItem);
                            }
                        });

                        setMediaCoverage(processedMediaItems);
                        setAwards(processedAwardItems);
                        console.log(
                            "Processed media coverage items:",
                            processedMediaItems.length
                        );
                        console.log("Processed award items:", processedAwardItems.length);
                    } else {
                        console.log("No Media items found for this startup.");
                        setMediaCoverage([]);
                        setAwards([]);
                    }
                } else {
                    console.log(`No startup data found for companyId: ${companyId}.`);
                    setError(
                        `Startup with ID ${companyId} not found or has no media information.`
                    );
                    setMediaCoverage([]);
                    setAwards([]);
                }
            } catch (err) {
                console.error("Error fetching press features data:", err);
                setError(err.message || "An unknown error occurred.");
                setMediaCoverage([]);
                setAwards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]); // Re-fetch if companyId changes

    return (
        <div className="w-full px-[69px] py-16 bg-white">
            {/* Header */}
            <div
                className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full">
                <div
                    className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h1 className="text-4xl md:text-5xl font-bold mb-1">
            <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">Media Coverage</span>
                </h1>
                <div
                    className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>


            {/* Loading State */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-700">Loading features...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-2xl mx-auto"
                    role="alert"
                >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Content - Only show when data is loaded and no error */}
            {!loading &&
                !error &&
                (mediaCoverage.length > 0 || awards.length > 0) && (
                    <div>
                        {/* Content Sections */}
                        <div
                            className={`${
                                awards.length > 0 && mediaCoverage.length > 0
                                    ? "grid md:grid-cols-2 gap-x-16 gap-y-8"
                                    : ""
                            } px-2.5`}
                        >
                            {/* Media Coverage Section */}
                            {mediaCoverage.length > 0 && (
                                <div className="animate-slide-in-left">
                                    <div
                                        className={`grid ${
                                            awards.length === 0 ? "md:grid-cols-2 gap-8" : "gap-6"
                                        }`}
                                    >
                                        {mediaCoverage.map((article, index) => (
                                            <div
                                                key={article.id}
                                                className={`flex items-start space-x-4 group bg-gradient-to-br from-white to-orange-50 shadow-xl hover:scale-102 transition-all duration-300 ease-in-out p-6 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 animation-delay-${
                                                    (index % 4) * 150
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110">
                                                        {article.initials}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-sm text-orange-600 mb-2 font-medium flex items-center">
                                                        {article.source}
                                                        {article.date && (
                                                            <>
                                                                <span
                                                                    className="mx-2 w-1 h-1 bg-orange-400 rounded-full inline-block"></span>
                                                                {new Date(article.date).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                                                        {article.title}
                                                    </h3>
                                                    {/* Description is not available in new API for Media, so this part is removed or kept empty.
                        {article.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                            {article.description}
                          </p>
                        )} */}
                                                    {article.link && (
                                                        <a
                                                            href={article.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-2 hover:underline"
                                                        >
                                                            Read Article
                                                            <svg
                                                                className="ml-1 w-4 h-4 group-hover:animate-bounce-sm"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Awards & Recognition Section */}
                            {awards.length > 0 && (
                                <div className="animate-slide-in-right">
                                    <div className="grid gap-6">
                                        {awards.map((award, index) => (
                                            <div
                                                key={award.id}
                                                className={`flex items-start space-x-4 group bg-gradient-to-br from-white to-orange-50 shadow-xl hover:scale-102 transition-all duration-300 ease-in-out p-6 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 animation-delay-${
                                                    (index % 4) * 150 + 100
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:rotate-12">
                                                        <svg
                                                            className="w-6 h-6 text-white group-hover:animate-pulse-slow"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-sm text-orange-600 mb-2 font-medium flex items-center">
                                                        {award.organization}
                                                        {award.date && (
                                                            <>
                                                                <span
                                                                    className="mx-2 w-1 h-1 bg-orange-400 rounded-full inline-block"></span>
                                                                {new Date(award.date).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                                                        {award.awardTitle || award.title}
                                                    </h3>
                                                    {/* Description is not available in new API for Media */}
                                                    {award.link && (
                                                        <a
                                                            href={award.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-2 hover:underline"
                                                        >
                                                            Learn More
                                                            <svg
                                                                className="ml-1 w-4 h-4 group-hover:animate-bounce-sm"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* Empty State when no data and no error */}
            {!loading &&
                !error &&
                mediaCoverage.length === 0 &&
                awards.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
                        <svg
                            className="w-16 h-16 text-gray-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1-5h.01"
                            ></path>
                        </svg>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No Features Yet
                        </h3>
                        <p className="text-gray-500">
                            Media mentions and awards will be showcased here as they come.
                        </p>
                    </div>
                )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes bounceSm {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(3px);
                    }
                }

                @keyframes pulseSlow {
                    0%,
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }

                .animate-fade-in-delay {
                    animation: fadeIn 0.8s ease-out 0.2s backwards;
                }

                /* Use backwards to apply start state immediately */
                .animate-slide-in-left {
                    animation: slideInLeft 0.8s ease-out 0.4s backwards;
                }

                .animate-slide-in-right {
                    animation: slideInRight 0.8s ease-out 0.6s backwards;
                }

                .animation-delay-0 {
                    animation-delay: 0s !important;
                }

                /* Ensure this can override if needed */
                .animation-delay-100 {
                    animation-delay: 0.1s !important;
                }

                .animation-delay-150 {
                    animation-delay: 0.15s !important;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s !important;
                }

                .animation-delay-250 {
                    animation-delay: 0.25s !important;
                }

                .animation-delay-300 {
                    animation-delay: 0.3s !important;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s !important;
                }

                .animation-delay-450 {
                    animation-delay: 0.45s !important;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s !important;
                }

                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }

                .group:hover .group-hover\\:animate-bounce-sm {
                    animation: bounceSm 0.5s ease-in-out;
                }

                .group:hover .group-hover\\:animate-pulse-slow {
                    animation: pulseSlow 1.5s infinite ease-in-out;
                }

                /* Ensure animation delay classes apply if slideInLeft/Right has 'backwards' */
                .animate-slide-in-left.animation-delay-150,
                .animate-slide-in-right.animation-delay-150 {
                    animation: slideInLeft 0.8s ease-out 0.15s backwards; /* or slideInRight */
                }

                /* Add similar for other delays if needed, or adjust base animation delay */
            `}</style>
        </div>
    );
}
