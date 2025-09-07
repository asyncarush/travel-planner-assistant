import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MapPin,
  Clock,
  User,
  Bot,
  Plane,
  Menu,
  RefreshCw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "👋 Hello! I'm your travel planning assistant. Tell me about your dream destination, travel dates, budget, and preferences, and I'll create a personalized itinerary for you!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const streamResponseFromAPI = async (userMessage) => {
    setIsStreaming(true);
    setStreamingMessage("");
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/agent/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6);
                if (jsonStr === "[DONE]") break;

                const parsed = JSON.parse(jsonStr);
                if (parsed.content) {
                  fullResponse += parsed.content;
                  setStreamingMessage(fullResponse);
                }
              } else if (line.startsWith("{")) {
                const parsed = JSON.parse(line);
                if (parsed.content) {
                  fullResponse += parsed.content;
                  setStreamingMessage(fullResponse);
                } else if (parsed.message) {
                  fullResponse += parsed.message;
                  setStreamingMessage(fullResponse);
                }
              } else if (line.trim()) {
                fullResponse += line;
                setStreamingMessage(fullResponse);
              }
            } catch (parseError) {
              if (line.trim()) {
                fullResponse += line;
                setStreamingMessage(fullResponse);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (fullResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "assistant",
            content: fullResponse,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setError(error.message);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "assistant",
          content: `❌ Sorry, I encountered an error: ${error.message}\n\nPlease make sure your backend server is running on http://localhost:8000`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");

    await streamResponseFromAPI(currentMessage);
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

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "assistant",
        content:
          "👋 Hello! I'm your travel planning assistant. Tell me about your dream destination, travel dates, budget, and preferences, and I'll create a personalized itinerary for you!",
        timestamp: new Date(),
      },
    ]);
    setStreamingMessage("");
    setIsStreaming(false);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Travel Planning Assistant
                </h1>
                <p className="text-sm text-gray-500">
                  Your AI-powered travel companion
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-80 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Travel Assistant
              </h2>
              <p className="text-sm text-gray-500">Plan your perfect trip</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quick Start
              </h3>
              {[
                "Weekend getaway",
                "Family vacation",
                "Adventure trip",
                "Luxury escape",
              ].map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setInputMessage(`Plan a ${option.toLowerCase()}`)
                  }
                  className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  {option}
                </button>
              ))}

              <button
                onClick={clearChat}
                className="w-full flex items-center justify-center px-4 py-3 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`flex-1 max-w-[85%] ${
                      message.type === "user" ? "order-first" : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white shadow-sm border border-gray-200"
                      }`}
                    >
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            em: ({ node, ...props }) => (
                              <span className="font-semibold" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div
                      className={`text-xs text-gray-400 mt-1 ${
                        message.type === "user" ? "text-right" : ""
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="bg-gray-600 p-2 rounded-full flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming Message */}
              {isStreaming && (
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <div className="rounded-2xl px-4 py-3 bg-white shadow-sm border border-gray-200">
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            em: ({ node, ...props }) => (
                              <span className="font-semibold" {...props} />
                            ),
                          }}
                        >
                          {streamingMessage}
                        </ReactMarkdown>
                        <span className="animate-pulse text-blue-500 ml-1">
                          ▌
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-blue-500">
                          Generating plan...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tell me about your dream destination, dates, budget, and preferences..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    rows="1"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                    disabled={isStreaming}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    Enter ↵
                  </div>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Plan a 7-day trip to Mumbai from Lucknow",
                  "I want to explore mountains in India, So please plan trip for me from gorakhpur to any place, trip should for 1 week",
                  "from Gorakhpur, plan me a 4 day tour to historical and spiritual place in India",
                  "Romantic getaway for anniversary",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 whitespace-nowrap border border-gray-200 hover:border-gray-300"
                    disabled={isStreaming}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Connection Status */}
              {error && (
                <div className="mt-3 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
                  <div className="mr-2">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>Connection error: {error}</span>
                </div>
              )}
            </div>
          </div>
          ̉̉
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
