
const DEEPINFRA_API_KEY = import.meta.env.VITE_DEEPINFRA_API_KEY;

const getAIResponse = async (userMessage, conversationHistory) => {
  if (!DEEPINFRA_API_KEY) {
    console.error("DeepInfra API key no está configurada.");
    return "Lo siento, no puedo conectarme al servicio de IA en este momento. Por favor, asegúrate de que la clave API de DeepInfra esté configurada.";
  }

  const messagesForAPI = [
    { role: "system", content: "Eres un asistente de IA útil y amigable. Responde de manera concisa y útil." },
    ...conversationHistory.map(msg => ({
      role: msg.isAi ? "assistant" : "user",
      content: msg.text
    })),
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPINFRA_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messagesForAPI,
        temperature: 0.7,
        max_tokens: 150,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de la API de OpenAI:", errorData);
      let errorMessage = `Error de la API: ${response.statusText}`;
      if (errorData && errorData.error && errorData.error.message) {
        errorMessage += ` - ${errorData.error.message}`;
      }
      if (response.status === 401) {
        errorMessage = "Error de autenticación con la API de OpenAI. Verifica tu clave API.";
      } else if (response.status === 429) {
        errorMessage = "Has excedido tu cuota de la API de OpenAI o has alcanzado los límites de tasa. Por favor, revisa tu plan y uso.";
      }
      return `Lo siento, hubo un problema al contactar al servicio de IA. ${errorMessage}`;
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("Respuesta inesperada de la API de OpenAI:", data);
      return "Lo siento, recibí una respuesta inesperada del servicio de IA.";
    }
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
    return "Lo siento, no pude conectarme al servicio de IA. Por favor, revisa tu conexión de red o la configuración de la API.";
  }
};

const saveMessages = (messages) => {
  try {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error al guardar mensajes:', error);
  }
};

const loadMessages = () => {
  try {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
    return [];
  }
};

const clearMessages = () => {
  try {
    localStorage.removeItem('chatMessages');
    return [];
  } catch (error) {
    console.error('Error al limpiar mensajes:', error);
    return [];
  }
};

export { getAIResponse, saveMessages, loadMessages, clearMessages };
