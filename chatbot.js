import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

const { createElement: h } = React;

function XoomChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! 👋 I'm the Xoom Media virtual assistant. I'm here to help you learn about our digital services. What brings you here today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "What services do you offer?",
    "I need a website",
    "SEO services",
    "Pricing information",
  ];

  const getBotResponse = async (userMessage) => {
    try {
      // Replace with your actual n8n webhook URL
      const webhookUrl = "https://nuvaleoai.app.n8n.cloud/webhook/xoom-chatbot";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      return (
        data.response ||
        data.message ||
        "I'm having trouble connecting right now. Please try again!"
      );
    } catch (error) {
      console.error("Error calling webhook:", error);
      return "I'm having trouble connecting right now. You can reach us directly at info@xoommedia.co.uk";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    const messageText = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const responseText = await getBotResponse(messageText);
      const botResponse = {
        type: "bot",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        type: "bot",
        text: "I'm having trouble connecting. Please reach us at info@xoommedia.co.uk",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  return h(
    "div",
    { className: "fixed bottom-6 right-6 z-50" },
    !isOpen &&
      h(
        "button",
        {
          onClick: () => setIsOpen(true),
          className:
            "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 group",
        },
        h(MessageCircle, {
          className: "w-7 h-7 group-hover:rotate-12 transition-transform",
        }),
        h(
          "span",
          {
            className:
              "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse",
          },
          "1"
        )
      ),

    isOpen &&
      h(
        "div",
        {
          className:
            "bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border border-gray-200",
        },
        // Header
        h(
          "div",
          {
            className:
              "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between",
          },
          h(
            "div",
            { className: "flex items-center gap-3" },
            h(
              "div",
              {
                className:
                  "w-10 h-10 bg-white rounded-full flex items-center justify-center",
              },
              h(MessageCircle, { className: "w-6 h-6 text-purple-600" })
            ),
            h(
              "div",
              null,
              h("h3", { className: "font-bold text-lg" }, "Xoom Media"),
              h(
                "p",
                { className: "text-xs text-purple-100" },
                "Always here to help"
              )
            )
          ),
          h(
            "button",
            {
              onClick: () => setIsOpen(false),
              className: "hover:bg-white/20 rounded-lg p-1 transition",
            },
            h(X, { className: "w-5 h-5" })
          )
        ),

        // Messages
        h(
          "div",
          {
            className: "flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4",
          },
          messages.map((msg, idx) =>
            h(
              "div",
              {
                key: idx,
                className: `flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`,
              },
              h(
                "div",
                {
                  className: `max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-md border border-gray-200"
                  }`,
                },
                h("p", { className: "text-sm whitespace-pre-line" }, msg.text),
                h(
                  "span",
                  {
                    className: `text-xs mt-1 block ${
                      msg.type === "user" ? "text-purple-100" : "text-gray-400"
                    }`,
                  },
                  msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
              )
            )
          ),

          isTyping &&
            h(
              "div",
              { className: "flex justify-start" },
              h(
                "div",
                {
                  className:
                    "bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-4 py-3",
                },
                h(
                  "div",
                  { className: "flex gap-1" },
                  h("span", {
                    className:
                      "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "0s" },
                  }),
                  h("span", {
                    className:
                      "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "0.2s" },
                  }),
                  h("span", {
                    className:
                      "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "0.4s" },
                  })
                )
              )
            ),
          h("div", { ref: messagesEndRef })
        ),

        // Quick Replies
        messages.length === 1 &&
          h(
            "div",
            {
              className: "px-4 py-2 bg-white border-t border-gray-200",
            },
            h(
              "p",
              { className: "text-xs text-gray-500 mb-2" },
              "Quick replies:"
            ),
            h(
              "div",
              { className: "flex flex-wrap gap-2" },
              quickReplies.map((reply, idx) =>
                h(
                  "button",
                  {
                    key: idx,
                    onClick: () => handleQuickReply(reply),
                    className:
                      "text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 transition border border-purple-200",
                  },
                  reply
                )
              )
            )
          ),

        // Input
        h(
          "div",
          {
            className: "p-4 bg-white border-t border-gray-200",
          },
          h(
            "div",
            { className: "flex gap-2" },
            h("input", {
              type: "text",
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyPress: (e) => e.key === "Enter" && handleSend(),
              placeholder: "Type your message...",
              className:
                "flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 transition",
            }),
            h(
              "button",
              {
                onClick: handleSend,
                disabled: !input.trim(),
                className:
                  "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
              },
              h(Send, { className: "w-5 h-5" })
            )
          ),
          h(
            "p",
            {
              className: "text-xs text-gray-400 mt-2 text-center",
            },
            "Powered by AI • Demo for Xoom Media"
          )
        )
      )
  );
}

ReactDOM.render(h(XoomChatbot), document.getElementById("root"));
