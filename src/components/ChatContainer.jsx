
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";

const ChatContainer = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto p-4 glass-effect rounded-lg"
      style={{ maxHeight: "calc(100vh - 300px)" }}
    >
      {messages.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No hay mensajes aún. ¡Comienza la conversación!</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text}
              isAi={msg.isAi}
            />
          ))}
          {isTyping && (
            <div className="p-4 rounded-lg mb-4 flex message-ai">
              <div className="typing-indicator font-medium">
                IA está escribiendo
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </motion.div>
  );
};

export default ChatContainer;
