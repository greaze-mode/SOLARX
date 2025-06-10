// src/components/global_accelerator/MediaMentionCard.jsx
import { ExternalLink, MessageSquare } from "lucide-react"; // Assuming you use lucide-react

const MediaMentionCard = ({
  id,
  headline,
  publisher,
  platform,
  date,
  link,
  quote,
}) => {
  const truncate = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };
  console.log(date)
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-gray-200 hover:border-orange-400 group"
    >
      <div className="p-5 sm:p-6 flex flex-col justifify-between">
        <p className="text-xs text-gray-500 mb-2">
          <span className="font-semibold text-gray-700">{publisher}</span>
          <span className="mx-1">|</span>
          <span>{platform}</span>
          <span className="mx-1">|</span>
          <span>{date}</span>
          {/* <span>{date.toLocaleDateString()}</span> */}
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3 leading-tight group-hover:text-orange-600 transition-colors">
          {headline}
        </h3>

        {/* Placeholder for the quote */}
        <div className="text-sm text-gray-600 italic border-l-4 border-orange-300 pl-3 py-2 bg-orange-50/50 rounded-r-md">
          <MessageSquare
            size={16}
            className="inline-block mr-2 mb-0.5 text-orange-400"
          />
          "{truncate(quote, 100)}"
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 sm:px-6 sm:py-4 border-t border-gray-100 text-right">
        <span className="text-xs sm:text-sm font-medium text-orange-500 group-hover:text-orange-700 transition-colors inline-flex items-center">
          Read Full Article
          <ExternalLink size={14} className="ml-1.5" />
        </span>
      </div>
    </a>
  );
};

export default MediaMentionCard;
