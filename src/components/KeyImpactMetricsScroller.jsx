const ImpactMetricDisplay = ({label, value}) => (
    <div
        className={`bg-white rounded-xl shadow-xl transition-all duration-300 ease-in-out border border-gray-100 hover:border-orange-600 hover:shadow-2xl hover:scale-105 w-[350px] h-[270px] flex-shrink-0`}
        // Each card has a fixed width and flex-shrink-0
    >
        <div className="flex flex-col h-full w-full">
            <span
                className="text-xl font-semibold text-center text-gray-800 bg-gradient-to-r from-orange-400 to-orange-300 w-full rounded-t-xl px-4 sm:px-6 py-4 sm:py-5 line-clamp-2 h-[80px] flex items-center justify-center"
                title={label}
            >
                {label}
            </span>
            <span
                className="text-xl sm:text-2xl font-semibold text-gray-800 flex-1 flex items-center justify-center text-center px-4">
                {value}
            </span>
            {/* <div className="w-full h-[5px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div> */}
        </div>
    </div>
);

const KeyImpactMetricsScroller = ({metrics, isVisible}) => {
    if (!metrics || metrics.length === 0) {
        if (isVisible) {
            // Render placeholder if section is meant to be visible but no metrics
            return (
                <section className={`w-full opacity-50`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-3">
                                Key Impact Metrics
                            </h2>
                            <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
                                Loading metrics...
                            </p>
                        </div>
                        <div
                            className="w-full h-[280px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-md">
                            Metrics scroller placeholder
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }

    // Duplicate the metrics array to create a seamless loop
    const duplicatedMetrics = [...metrics, ...metrics];
    const animationDuration = Math.min(20, metrics.length * 5); // e.g., 5 items = 25s

    return (
        <section
            className={`w-full transition-opacity duration-700 ease-out`}
            style={{transitionDelay: isVisible ? "0.3s" : "0s"}}
        >
            <div className="metrics-scroller-viewport w-full overflow-hidden relative pb-20">
                <div
                    className="absolute top-0 bottom-0 left-0 w-16 md:w-24 bg-gradient-to-r from-orange-200 via-orange-200/90 to-transparent z-10 pointer-events-none h-full"></div>
                <div
                    className="absolute top-0 bottom-0 right-0 w-16 md:w-24 bg-gradient-to-l from-orange-500 via-orange-500/90 to-transparent z-10 pointer-events-none h-full"></div>
                <div
                    className="continuous-scrolling-track"
                    style={{
                        animationDuration: `${animationDuration}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear',
                    }}
                >
                    {duplicatedMetrics.map((metric, idx) => (
                        <div
                            key={`metric-scroll-${metric.label}-${idx}`}
                            className="px-3 sm:px-4 pt-20"
                        >
                            <ImpactMetricDisplay label={metric.label} value={metric.value}/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyImpactMetricsScroller;
