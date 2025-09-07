import React, { useState, useRef, useEffect } from "react";
import { Send, MapPin, Clock, User, Bot, Plane } from "lucide-react";

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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const simulateStreamingResponse = async (userMessage) => {
    // This simulates your backend streaming response
    // Replace this with your actual API call
    const sampleResponse = `Here's a personalized travel plan for your query: "${userMessage}"\n\n🗓️ **Day 1-2: Arrival & City Exploration**\n- Check into your hotel in the city center\n- Visit the main cultural attractions\n- Explore local markets and try authentic cuisine\n- Evening stroll through historic districts\n\n🏛️ **Day 3-4: Historical Sites**\n- Guided tour of ancient monuments\n- Museum visits with expert commentary\n- Photography session at scenic viewpoints\n- Traditional cultural show in the evening\n\n🌊 **Day 5-6: Nature & Adventure**\n- Day trip to nearby natural attractions\n- Hiking or outdoor activities\n- Local wildlife spotting\n- Sunset viewing at popular locations\n\n💰 **Budget Breakdown:**\n- Accommodation: $400-600\n- Transportation: $200-300\n- Activities: $300-400\n- Food: $250-350\n- Total estimated: $1150-1650\n\n📝 **Travel Tips:**\n- Best time to visit: April-October\n- Currency exchange tips\n- Local customs to be aware of\n- Recommended apps for navigation\n\nWould you like me to adjust anything in this itinerary?`;

    setIsStreaming(true);
    setStreamingMessage("");

    // Simulate streaming by adding characters gradually
    for (let i = 0; i < sampleResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setStreamingMessage((prev) => prev + sampleResponse[i]);
    }

    // Add the complete message to messages array
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "assistant",
        content: sampleResponse,
        timestamp: new Date(),
      },
    ]);

    setIsStreaming(false);
    setStreamingMessage("");
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
    setInputMessage("");

    // Here you would call your actual backend API
    // For now, we'll simulate streaming
    await simulateStreamingResponse(inputMessage);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Travel Planning Assistant
              </h1>
              <p className="text-sm text-gray-500">
                Your AI-powered travel companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "justify-end" : ""
              }`}
            >
              {message.type === "assistant" && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-3xl ${
                  message.type === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white ml-12"
                      : "bg-white shadow-md border border-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
                <div
                  className={`text-xs text-gray-400 mt-1 px-2 ${
                    message.type === "user" ? "text-right" : ""
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.type === "user" && (
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming Message */}
          {isStreaming && (
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-3xl">
                <div className="rounded-2xl px-4 py-3 bg-white shadow-md border border-gray-100">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {streamingMessage}
                    <span className="animate-pulse text-blue-500">▋</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 px-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-blue-500">Generating plan...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your dream destination, dates, budget, and preferences..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                Press Enter to send
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isStreaming}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Plan a 7-day trip to Japan",
              "Beach vacation under $2000",
              "European backpacking adventure",
              "Romantic getaway for anniversary",
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors duration-200"
                disabled={isStreaming}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
