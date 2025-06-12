import React, { useState, useEffect } from "react";
import axios from "axios";
import MediaMentionCard from "./global_accelerator/MediaMentionCard";
import { API_URL } from "../services/api";

export default function MediaCoverageSection() {
  const [mediaMentions, setMediaMentions] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      axios
        .get(`${API_URL}/home-page?populate=media_coverage&pagination[pageSize]=100`)
        .then((response) => {
          const mediaData = response.data.data.media_coverage;
          // console.error("Fetched HOAHSOSHFKSDHJFKSDJHFKJHDSFKJSDH data:", mediaData);

          if (mediaData && mediaData.length > 0) {
            const formattedMedia = mediaData.map((media) => ({
              id: media.id,
              headline: media.Headline || "No headline available",
              publisher: media.Source || "Unknown Source",
              platform: media.media_category || "Unknown Platform",
              // date: new Date(media.Date) || "Unknown Date",
              date: media.Date || "Unknown Date",
              link: media.URL || "#",
              quote: media.quote || "No quote available",
            }));

            // console.log("Fetched slides:", formattedMedia);

            setMediaMentions(formattedMedia);
          }
        })
        .catch((error) => {
          console.error("Error fetching media data:", error);
        });
    };

    fetchMedia();
  }, []);

  return (
    <div className="pb-16 bg-white px-4 pt-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
          Media Coverage & Recognition
        </span>
      </h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
      <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12">
        SolarX and our startups have been featured in leading publications and
        received prestigious awards.
      </p>

      <div className="grid md:grid-cols-3 gap-8 animate-slide-in-left mx-auto px-4 lg:px-[69px]">
        {mediaMentions.length > 0 ? (
          mediaMentions.map((item, index) => (
            <MediaMentionCard key={index} {...item} />
          ))
        ) : (
          <div className="col-span-2 text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">
              No Media Coverage Available
            </h3>
            <p className="text-gray-500 mt-2">
              Media stories will appear here once available.
            </p>
          </div>
        )}
      </div>

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

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
