import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, Send } from "lucide-react"; // Thêm icon

// Thêm style cho bảng chat
const tableStyle = `
  .chat-table-wrapper {
    overflow-x: auto;
    max-width: 100%;
  }
  .chat-table-wrapper table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
    font-size: 0.95rem;
    background: #f9fafb;
  }
  .chat-table-wrapper th, .chat-table-wrapper td {
    border: 1px solid #e5e7eb;
    padding: 6px 10px;
    text-align: left;
    white-space: nowrap;
  }
  .chat-table-wrapper th {
    background: #f1f5f9;
    font-weight: 600;
  }
`;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  React.useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server Error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply || "Không có phản hồi từ chatbot." },
      ]);
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Lỗi: Không thể lấy phản hồi từ máy chủ." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-10 mt-10">
      {/* Inject custom table style */}
      <style>{tableStyle}</style>
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-0">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b bg-white rounded-t-2xl">
          <Bot className="text-blue-500" />
          <span className="font-bold text-lg text-blue-700">
            ChatBot Hỗ trợ
          </span>
        </div>
        <CardContent className="p-4 flex flex-col gap-4 bg-white rounded-b-2xl">
          <div
            className="h-[600px] overflow-y-auto space-y-3 p-2"
            id="chat-box"
            style={{ minHeight: "400px", maxHeight: "600px" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "bot" && (
                  <div className="mr-2 flex-shrink-0">
                    <Bot className="w-7 h-7 text-blue-400 bg-blue-100 rounded-full p-1" />
                  </div>
                )}
                {/* Nếu là bot và có bảng HTML thì bọc overflow-x-auto và style riêng */}
                {msg.role === "bot" && msg.content.includes("<table") ? (
                  <div className="chat-table-wrapper">
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-2 text-base max-w-[75%] shadow
                    ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm border"
                    }
                  `}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                )}
                {msg.role === "user" && (
                  <div className="ml-2 flex-shrink-0">
                    <User className="w-7 h-7 text-gray-400 bg-gray-200 rounded-full p-1" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Bot className="w-5 h-5" /> Đang phản hồi...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 w-full mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoFocus
              className="flex-1 rounded-full bg-gray-50 border-gray-200"
              disabled={loading}
              id="user-input"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full px-4 py-2 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
