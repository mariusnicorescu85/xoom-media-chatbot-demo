const { useState, useRef, useEffect } = React;
const { createElement: h } = React;

// SVG Icons as components
const MessageCircle = ({ className }) =>
  h(
    "svg",
    {
      className,
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    h("path", {
      d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    })
  );

const X = ({ className }) =>
  h(
    "svg",
    {
      className,
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    h("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    h("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  );

const Send = ({ className }) =>
  h(
    "svg",
    {
      className,
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
    h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
  );

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
      // IMPORTANT: Replace with your actual n8n webhook URL
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
    { className: "fixed bottom-6 right-6 z-50", style: { zIndex: 9999 } },
    !isOpen
      ? h(
          "button",
          {
            onClick: () => setIsOpen(true),
            className:
              "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 group",
            style: {
              background:
                "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
            },
          },
          h(MessageCircle, {
            className: "w-7 h-7 group-hover:rotate-12 transition-transform",
          }),
          h(
            "span",
            {
              className:
                "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse",
              style: { top: "-8px", right: "-8px" },
            },
            "1"
          )
        )
      : null,

    isOpen
      ? h(
          "div",
          {
            className:
              "bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border border-gray-200",
            style: { width: "384px", height: "600px" },
          },
          // Header
          h(
            "div",
            {
              className:
                "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between",
              style: {
                background:
                  "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
              },
            },
            h(
              "div",
              {
                className: "flex items-center gap-3",
                style: { display: "flex", alignItems: "center", gap: "12px" },
              },
              h(
                "div",
                {
                  className:
                    "w-10 h-10 bg-white rounded-full flex items-center justify-center",
                  style: {
                    width: "40px",
                    height: "40px",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                h(MessageCircle, {
                  className: "w-6 h-6 text-purple-600",
                  style: { color: "rgb(102, 126, 234)" },
                })
              ),
              h(
                "div",
                null,
                h(
                  "h3",
                  {
                    className: "font-bold text-lg",
                    style: { fontWeight: "bold", fontSize: "18px", margin: 0 },
                  },
                  "Xoom Media"
                ),
                h(
                  "p",
                  {
                    className: "text-xs text-purple-100",
                    style: { fontSize: "12px", opacity: 0.9, margin: 0 },
                  },
                  "Always here to help"
                )
              )
            ),
            h(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "hover:bg-white/20 rounded-lg p-1 transition",
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "white",
                },
              },
              h(X, { className: "w-5 h-5" })
            )
          ),

          // Messages
          h(
            "div",
            {
              className: "flex-1 overflow-y-auto p-4 bg-gray-50",
              style: {
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                background: "#f9fafb",
              },
            },
            ...messages.map((msg, idx) =>
              h(
                "div",
                {
                  key: idx,
                  className: `flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`,
                  style: {
                    display: "flex",
                    justifyContent:
                      msg.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "16px",
                  },
                },
                h(
                  "div",
                  {
                    className: `max-w-[80%] rounded-2xl px-4 py-2`,
                    style: {
                      maxWidth: "80%",
                      borderRadius: "16px",
                      padding: "8px 16px",
                      background:
                        msg.type === "user"
                          ? "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)"
                          : "white",
                      color: msg.type === "user" ? "white" : "#1f2937",
                      boxShadow:
                        msg.type === "bot"
                          ? "0 2px 8px rgba(0,0,0,0.1)"
                          : "none",
                      border: msg.type === "bot" ? "1px solid #e5e7eb" : "none",
                    },
                  },
                  h(
                    "p",
                    {
                      className: "text-sm whitespace-pre-line",
                      style: {
                        fontSize: "14px",
                        whiteSpace: "pre-line",
                        margin: 0,
                      },
                    },
                    msg.text
                  ),
                  h(
                    "span",
                    {
                      className: `text-xs mt-1 block`,
                      style: {
                        fontSize: "11px",
                        marginTop: "4px",
                        display: "block",
                        opacity: msg.type === "user" ? 0.8 : 0.6,
                      },
                    },
                    msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  )
                )
              )
            ),

            isTyping
              ? h(
                  "div",
                  {
                    className: "flex justify-start",
                    style: { display: "flex", justifyContent: "flex-start" },
                  },
                  h(
                    "div",
                    {
                      className:
                        "bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-4 py-3",
                      style: {
                        background: "white",
                        padding: "12px 16px",
                        borderRadius: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #e5e7eb",
                      },
                    },
                    h(
                      "div",
                      {
                        className: "flex gap-1",
                        style: { display: "flex", gap: "4px" },
                      },
                      h("span", {
                        className:
                          "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                        style: {
                          width: "8px",
                          height: "8px",
                          background: "#9ca3af",
                          borderRadius: "50%",
                          animation: "bounce 1.4s infinite ease-in-out",
                          animationDelay: "0s",
                        },
                      }),
                      h("span", {
                        className:
                          "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                        style: {
                          width: "8px",
                          height: "8px",
                          background: "#9ca3af",
                          borderRadius: "50%",
                          animation: "bounce 1.4s infinite ease-in-out",
                          animationDelay: "0.2s",
                        },
                      }),
                      h("span", {
                        className:
                          "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                        style: {
                          width: "8px",
                          height: "8px",
                          background: "#9ca3af",
                          borderRadius: "50%",
                          animation: "bounce 1.4s infinite ease-in-out",
                          animationDelay: "0.4s",
                        },
                      })
                    )
                  )
                )
              : null,
            h("div", { ref: messagesEndRef })
          ),

          // Quick Replies
          messages.length === 1
            ? h(
                "div",
                {
                  className: "px-4 py-2 bg-white border-t border-gray-200",
                  style: {
                    padding: "8px 16px",
                    background: "white",
                    borderTop: "1px solid #e5e7eb",
                  },
                },
                h(
                  "p",
                  {
                    className: "text-xs text-gray-500 mb-2",
                    style: {
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    },
                  },
                  "Quick replies:"
                ),
                h(
                  "div",
                  {
                    className: "flex flex-wrap gap-2",
                    style: { display: "flex", flexWrap: "wrap", gap: "8px" },
                  },
                  ...quickReplies.map((reply, idx) =>
                    h(
                      "button",
                      {
                        key: idx,
                        onClick: () => handleQuickReply(reply),
                        className:
                          "text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 transition border border-purple-200",
                        style: {
                          fontSize: "12px",
                          background: "#faf5ff",
                          color: "#7c3aed",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          border: "1px solid #ddd6fe",
                          cursor: "pointer",
                        },
                      },
                      reply
                    )
                  )
                )
              )
            : null,

          // Input
          h(
            "div",
            {
              className: "p-4 bg-white border-t border-gray-200",
              style: {
                padding: "16px",
                background: "white",
                borderTop: "1px solid #e5e7eb",
              },
            },
            h(
              "div",
              {
                className: "flex gap-2",
                style: { display: "flex", gap: "8px" },
              },
              h("input", {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyPress: (e) => e.key === "Enter" && handleSend(),
                placeholder: "Type your message...",
                className:
                  "flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 transition",
                style: {
                  flex: 1,
                  border: "1px solid #d1d5db",
                  borderRadius: "24px",
                  padding: "8px 16px",
                  outline: "none",
                },
              }),
              h(
                "button",
                {
                  onClick: handleSend,
                  disabled: !input.trim(),
                  className:
                    "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
                  style: {
                    background: input.trim()
                      ? "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)"
                      : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    opacity: input.trim() ? 1 : 0.5,
                  },
                },
                h(Send, { className: "w-5 h-5" })
              )
            ),
            h(
              "p",
              {
                className: "text-xs text-gray-400 mt-2 text-center",
                style: {
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: "8px",
                  textAlign: "center",
                },
              },
              "Powered by AI • Demo for Xoom Media"
            )
          )
        )
      : null
  );
}

ReactDOM.render(h(XoomChatbot), document.getElementById("root"));
