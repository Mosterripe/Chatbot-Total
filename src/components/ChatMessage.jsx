
import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

const ChatMessage = ({ message, isAi }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg mb-4 flex ${
        isAi ? "message-ai" : "message-user"
      }`}
    >
      <Avatar className="mr-3 h-8 w-8">
        {isAi ? (
          <AvatarImage src="" />
        ) : (
          <AvatarImage src="" />
        )}
        <AvatarFallback className={isAi ? "bg-green-600" : "bg-purple-600"}>
          {isAi ? <Bot size={16} /> : <User size={16} />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{isAi ? "IA" : "Tú"}</p>
        <div className="text-sm">{message}</div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
