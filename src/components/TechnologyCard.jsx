import { Zap, Clock, Sun, CheckCircle, Settings, Package } from "lucide-react"; // Example icons
import { parseRichText } from "../utils/strapiHelper";

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

const TechnologyCard = ({ technology, techTags }) => {
  // const strapiBaseUrl = import.meta.env.VITE_API_URL; // Define your Strapi base URL

  // console.warn(technology);

  const demonstrationImage =
    technology.Demonstration && technology.Demonstration.length > 0
      ? technology.Demonstration[0]
      : null;

  return (
    <div className="rounded-xl shadow-md border border-orange-200 p-8 md:py-10 md:px-20 w-full overflow-hidden h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-orange-100 rounded-full mr-3">
              <Sun size={24} className="text-orange-600" />{" "}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">
              {technology.Name || "No Name Provided"}
            </h2>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
            {parseRichText(technology.Description)}
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
        <div className="flex items-center justify-center md:justify-end w-full h-full">
          {demonstrationImage ? (
            <div className="relative w-full max-w-md h-[300px] md:h-[450px] bg-orange-500 rounded-lg shadow-lg flex items-center justify-center">
              <img
                src={`${demonstrationImage.url}`}
                alt={`${technology.Name} demonstration`}
                height={450}
                className="object-cover w-full h-full rounded-lg border-2 border-orange-200 shadow-md hover:shadow-2xl transition-shadow duration-300"
              />
              {/* <span className="text-3xl sm:text-4xl font-bold text-white opacity-80">
                Image
              </span> */}
            </div>
          ) : technology.Link ? (
            <div className="w-full max-w-md h-[300px] md:h-[450px] bg-orange-500 rounded-lg shadow-lg flex flex-col items-center justify-center text-white p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                Product Demonstration
              </h3>
              <a
                href={
                  technology.Link.startsWith("http")
                    ? technology.Link
                    : `http://${technology.Link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-orange-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-orange-100 transition-colors"
              >
                Watch Video
              </a>
            </div>
          ) : (
            // Placeholder if no image or video link
            <div className="w-full max-w-md h-[300px] md:h-[450px] bg-orange-500 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-white opacity-80">
                {technology.Name.split(" ")[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyCard;
