
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";
import { getAIResponse, saveMessages, loadMessages, clearMessages } from "@/services/chatService";

const OPENAI_API_KEY = import.meta.env.VITE_DEEPINFRA_API_KEY;

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!OPENAI_API_KEY) {
      setApiKeyMissing(true);
      toast({
        title: "Configuración Requerida",
        description: "La clave API de DeepInfra no está configurada. Por favor, añádela a tus variables de entorno.",
        variant: "destructive",
        duration: Infinity,
      });
    }
    const savedMessages = loadMessages();
    setMessages(savedMessages);
  }, [toast]);

  const handleSendMessage = async (text) => {
    if (apiKeyMissing) {
      toast({
        title: "Error de Configuración",
        description: "No se puede enviar mensaje. Falta la clave API de DeepInfra.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { text, isAi: false, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);

    setIsTyping(true);
    try {
      const conversationHistory = messages.slice(-10); // Enviar los últimos 10 mensajes como contexto
      const aiResponse = await getAIResponse(text, conversationHistory);
      const aiMessage = { text: aiResponse, isAi: true, timestamp: new Date().toISOString() };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      toast({
        title: "Error de IA",
        description: "No se pudo obtener respuesta de la IA. " + (error.message || ""),
        variant: "destructive",
      });
      console.error("Error al obtener respuesta:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages(clearMessages());
    toast({
      title: "Chat limpiado",
      description: "Se ha borrado el historial de conversación",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden glass-effect p-6 flex flex-col"
        style={{ height: 'calc(100vh - 4rem)', maxHeight: '800px' }}
      >
        <div className="flex justify-between items-start mb-4">
          <ChatHeader />
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearChat}
            className="ml-auto shrink-0"
            title="Limpiar chat"
          >
            <Trash2 size={18} />
          </Button>
        </div>

        {apiKeyMissing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/20 border border-destructive text-destructive-foreground p-3 rounded-md mb-4 flex items-center gap-2"
          >
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">
              La clave API de OpenAI (VITE_OPENAI_API_KEY) no está configurada en tus variables de entorno. La IA no funcionará.
            </p>
          </motion.div>
        )}
        
        <ChatContainer messages={messages} isTyping={isTyping} />
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping || apiKeyMissing} />
      </motion.div>
      <Toaster />
    </div>
  );
}

export default App;
