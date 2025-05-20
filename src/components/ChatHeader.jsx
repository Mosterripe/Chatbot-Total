
import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const ChatHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 text-center"
    >
      <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-3">
        <Bot size={24} className="text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-2 chat-gradient">Chat con IA</h1>
      <p className="text-muted-foreground">
        Haz cualquier pregunta y obtén respuestas al instante
      </p>
    </motion.div>
  );
};

export default ChatHeader;
