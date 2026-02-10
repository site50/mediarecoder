import React,{ useState,useRef } from 'react'
import './App.css'
import { useSocket } from "./useSocket";



type Message = {
  original: string;
  translated: string;
};

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const socket = useSocket((data) => {
    setMessages((prev) => [...prev, data]);
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = () => {
      // 👇 вместо реального STT просто имитируем текст
      socket.send({
        text: "Пример произнесенного предложения",
      });
    };

    mediaRecorder.start(3000); // каждые 3 секунды
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎤 Voice Translator (Demo)</h2>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "⏹ Stop recording" : "▶️ Start recording"}
      </button>

      <ul style={{ marginTop: 20 }}>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.original}</strong>
            <br />
            <em>{msg.translated}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
