import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Nếu muốn gắn style custom thêm, có thể tạo file chat.css và import ở đây

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when new message
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
      console.log("❌ Lỗi khi gửi tin nhắn:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Lỗi: Không thể lấy phản hồi từ máy chủ." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-4 flex flex-col gap-4">
          <div
            className="h-96 overflow-y-auto space-y-2 border rounded-xl bg-background p-3 chat-box"
            id="chat-box"
            style={{ minHeight: "300px", maxHeight: "400px" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-xl px-3 py-2 text-base max-w-[90%] whitespace-pre-wrap
                  ${
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground shadow"
                      : "mr-auto bg-accent text-accent-foreground border"
                  }`}
              >
                {/* Nếu là bot và có bảng HTML thì bọc overflow-x-auto */}
                {msg.role === "bot" && msg.content.includes("<table") ? (
                  <div className="overflow-x-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                      className="prose max-w-none min-w-[600px]"
                    />
                  </div>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-accent px-3 py-2 rounded-xl text-accent-foreground border shadow">
                Đang phản hồi...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
              className="flex-1"
              disabled={loading}
              id="user-input"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Gửi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
