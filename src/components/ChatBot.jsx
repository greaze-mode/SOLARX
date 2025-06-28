import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "../services/api";
import { MessageCircle, X, Send, Bot, Building, Globe } from "lucide-react";
import Markdown from "react-markdown";
import axios from "axios";

const StartupCard = ({ startup, url }) => {
  // Don't render if there's no startup data
  if (!startup) {
    return null;
  }

  // Display an error message if the data fetch failed
  if (startup.error) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
          role="alert"
        >
          {startup.error}
        </div>
      </div>
    );
  }

  const { Name, Company_Logo, HQ_Location_Name, Description } = startup;

  // Safely extract the description text from the API's rich text format
  const descriptionText =
    Description?.[0]?.children?.[0]?.text || "No description available.";

  // Truncate the description to keep the card compact
  const shortDescription =
    descriptionText.length > 100
      ? descriptionText.substring(0, 100) + "..."
      : descriptionText;

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-3 border border-gray-200"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
            <img src={Company_Logo.url} alt={`${Name} Logo`} />
          </div>

          {/* Startup Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-base font-bold text-gray-800 truncate"
              title={Name}
            >
              {Name}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Globe className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>{HQ_Location_Name || "Region not specified"}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 leading-snug">
              {shortDescription}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help you. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startupData, setStartupData] = useState(null);
  const [startupRedirectURL, setStartupRedirectURL] = useState(null);
  const [isFetchingStartup, setIsFetchingStartup] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchStartupData = async () => {
      if (!startupRedirectURL) {
        setStartupData(null);
        return;
      }
      setIsFetchingStartup(true);
      setStartupData(null);

      try {
        const urlParts = startupRedirectURL.split("/");
        const startupId = urlParts[urlParts.length - 1];

        // Construct the API endpoint from your prompt
        const apiUrl = `${API_URL}/startups/${startupId}?populate=Company_Logo`;
        const response = await axios.get(apiUrl);

        setStartupData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch startup data:", error);
        setStartupData({ error: "Could not load startup information." });
      } finally {
        setIsFetchingStartup(false);
        // Scroll to bottom again after card loads/fails to ensure it's visible
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    fetchStartupData();
    console.log("Fetched AAAAAA", startupData);
  }, [startupRedirectURL]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setStartupRedirectURL(null);

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_CHATBOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request.",
        isBot: true,
        timestamp: new Date(),
      };
      if (data.startupURL) {
        setStartupRedirectURL(data.startupURL);
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-orange-200 z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8" />
              <div className={"pl-2"}>
                <h3 className="font-semibold">ISA Assistant</h3>
                <p className="text-[10px] text-orange-200">
                  powered by AI.Rawat
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-orange-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.isBot
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <Markdown>{message.text}</Markdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isFetchingStartup && (
            <div className="p-4 border-t border-gray-200 text-center">
              <div className="flex justify-center items-center space-x-2 text-gray-500 text-sm">
                <span>Loading startup info...</span>
              </div>
            </div>
          )}
          {!isFetchingStartup && startupData && (
            <StartupCard startup={startupData} url={startupRedirectURL} />
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  if (startupRedirectURL) setStartupRedirectURL(null);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center hover:scale-110"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ChatBot;
