// src/components/global_accelerator/MediaHighlightsSection.jsx
import React, { useState, useEffect } from "react";
import MediaMentionCard from "./MediaMentionCard";
import axios from "axios";
import { API_URL } from "../../services/api";
// import { Rss } from "lucide-react";

const MediaHighlightsSection = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMediaMentions = async () => {
      axios
        .get(`${API_URL}/global-accelerator?populate=media_highlights`)
        .then((response) => {
          const mediaData = response.data.data.media_highlights;

          if (mediaData) {
            const formattedMedia = mediaData.map((mention) => ({
              id: mention.id,
              headline: mention.Headline || null,
              publisher: mention.Source || null,
              link: mention.URL || null,
              platform: mention.media_category || null,
              // date: new Date(mention.Date) || null,
              date: mention.Date || null,
              quote: mention.quote || null,
            }));

            console.log("Fetched Media Mentions:", formattedMedia);
            setMedia(formattedMedia);
          }
        })
        .catch((error) => {
          console.error("Error fetching Media data:", error);
        });
    };

    fetchMediaMentions();
  }, []);

  return (
    media && (
      <section
        id="media"
        className="py-16 md:py-20 bg-gradient-to-tr from-gray-900 via-orange-900 to-orange-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-4 text-center text-white"
              style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
            >
              Media Highlights
            </h1>
            <div className="w-1/4 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
            <p className="text-md md:text-lg max-w-2xl mx-auto">
              Highlighting the impact and recognition of the SolarX Global
              Accelerator program in prominent media outlets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {media.map((mention) => (
              <MediaMentionCard key={mention.id} {...mention} />
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default MediaHighlightsSection;
