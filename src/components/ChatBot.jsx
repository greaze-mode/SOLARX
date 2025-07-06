import React, { useState, useRef, useEffect, useCallback } from "react";
import { API_URL } from "../services/api";
import { X, Send, Sun, Mic } from "lucide-react"; // Imported Mic
import Markdown from "react-markdown";
import axios from "axios";

const SESSION_ID_KEY = "chatbot_session_id";

// New component for rendering the startup card inside a chat message
const StartupMessageCard = ({ startup, url }) => {
  // Handle case where startup data couldn't be loaded
  if (!startup || startup.error) {
    return (
      <div className="p-3 text-sm text-red-200">
        Could not load startup information.
      </div>
    );
  }

  const { Name, Company_Logo, HQ_Location_Name } = startup;

  return (
    <div className="flex flex-col items-center p-3">
      {/* Logo */}
      <img
        src={Company_Logo.url}
        alt={`${Name} Logo`}
        className="w-28 h-28 mb-3 rounded-md bg-white p-1 object-contain"
      />

      <p className="font-bold text-gray-900 text-center text-base">{Name}</p>
      <div className="flex items-center text-sm text-gray-600 mt-1 mb-4">
        {/* <Globe className="w-3 h-3 mr-1.5 flex-shrink-0" /> */}
        <span>{HQ_Location_Name || "Location not specified"}</span>
      </div>

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-white text-orange-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-orange-100 transition-colors text-center"
      >
        View Startup Profile
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
      type: "text",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showInitialTooltip, setShowInitialTooltip] = useState(true); // State for the initial tooltip
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null); // Ref for the speech recognition instance

  const sessionIdRef = useRef(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_ID_KEY);
    if (savedSessionId) {
      sessionIdRef.current = savedSessionId;
      // console.log("Existing session found:", savedSessionId);
    }
    // else {
    // console.log(
    //   "No existing session found. A new one will be created on the first message.",
    // );
    // }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      const userMessage = {
        id: Date.now(),
        text: text.trim(),
        isBot: false,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const requestPayload = {
          query: userMessage.text,
          session_id: sessionIdRef.current, // Will be null if no session has started
        };

        const res = await axios.post(
          import.meta.env.VITE_CHATBOT_URL,
          requestPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = res.data;

        if (data.session_id && !sessionIdRef.current) {
          sessionIdRef.current = data.session_id;
          localStorage.setItem(SESSION_ID_KEY, data.session_id);
          // console.log("New session started and saved:", data.session_id);
        }

        const newBotMessages = [];

        if (data.response) {
          newBotMessages.push({
            id: Date.now() + 1,
            text: data.response,
            isBot: true,
            timestamp: new Date(),
            type: "text",
          });
        }

        if (data.startupURL) {
          try {
            const urlParts = data.startupURL.split("/");
            const startupId = urlParts[urlParts.length - 1];
            const apiUrl = `${API_URL}/startups/${startupId}?populate=Company_Logo`;
            const startupRes = await axios.get(apiUrl);

            newBotMessages.push({
              id: Date.now() + 2,
              isBot: true,
              timestamp: new Date(),
              type: "startup",
              payload: {
                startup: startupRes.data.data,
                url: data.startupURL,
              },
            });
          } catch (fetchError) {
            console.error("Failed to fetch startup data:", fetchError);
            newBotMessages.push({
              id: Date.now() + 2,
              text: "I found a startup but had trouble loading its details.",
              isBot: true,
              timestamp: new Date(),
              type: "text",
            });
          }
        }

        if (newBotMessages.length === 0) {
          newBotMessages.push({
            id: Date.now() + 1,
            text: "I'm sorry, I couldn't process your request.",
            isBot: true,
            timestamp: new Date(),
            type: "text",
          });
        }

        setMessages((prev) => [...prev, ...newBotMessages]);
      } catch (error) {
        console.error("Chat API error:", error);
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          isBot: true,
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setTimeout(() => scrollToBottom(), 100);
      }
    },
    [isLoading], // Dependency for useCallback
  );

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      submitMessage(transcript); // Send the transcript
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [submitMessage]); // Add submitMessage as a dependency

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    submitMessage(inputMessage);
    setInputMessage(""); // Clear input after sending
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowInitialTooltip(false); // Hide tooltip forever after first click
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 sm:mx-0 sm:right-6 w-full sm:w-1/3 h-5/6 bg-white rounded-2xl shadow-2xl border border-orange-200 z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="w-8 h-8" />
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
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] text-base rounded-2xl ${
                    message.isBot
                      ? "bg-orange-200 text-gray-900"
                      : "bg-gray-100 text-gray-800"
                  } ${
                    message.type === "startup"
                      ? "w-2/5 p-0 overflow-hidden"
                      : "p-3"
                  }`}
                >
                  {message.type === "startup" ? (
                    <StartupMessageCard
                      startup={message.payload.startup}
                      url={message.payload.url}
                    />
                  ) : (
                    <Markdown>{message.text}</Markdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
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

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type or press mic to talk..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="pr-4 pl-3.5 py-2 bg-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button and Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          {/* Tooltip Cloud */}
          {showInitialTooltip && (
            <div className="absolute bottom-full right-0 mb-3 w-max bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
              Hi! Tap to chat with the Assistant
              {/* Triangle Pointer */}
              <div className="absolute right-0 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
            </div>
          )}
          {/* Floating Button */}
          <button
            onClick={handleOpenChat}
            className="w-14 h-14 border-2 border-orange-300 bg-gray-200 text-orange-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center hover:scale-110"
          >
            <Sun className="w-8 h-8" absoluteStrokeWidth={false} />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatBot;
