"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { liveTutor } from "@/ai/flows/live-tutor";
import { LoaderCircle, Mic, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ConversationMessage = {
  role: "user" | "assistant";
  text: string;
};

export function LiveTutor() {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap microphone to start session");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setTranscript(finalTranscript + interimTranscript);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
             recognitionRef.current.start();
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setStatus("Error with microphone. Please check permissions.");
          setIsListening(false);
        };
      } else {
        setStatus("Speech recognition not supported in this browser.");
      }
    }
  }, [isListening]);
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [conversation]);


  const startConversation = () => {
    if (recognitionRef.current) {
      setConversation([]);
      setTranscript("");
      setIsListening(true);
      setStatus("Listening...");
      recognitionRef.current.start();
    }
  };

  const processAndRespond = async () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (!transcript.trim()) {
        setStatus("Tap microphone to start session");
        return;
      };

      const userMessage: ConversationMessage = { role: "user", text: transcript };
      setConversation(prev => [...prev, userMessage]);
      setIsLoading(true);
      setStatus("AInstein is thinking...");
      
      try {
        const context = conversation.map(m => `${m.role}: ${m.text}`).join('\n');
        const result = await liveTutor({ question: transcript, context });
        const assistantMessage: ConversationMessage = { role: "assistant", text: result.answer };
        setConversation(prev => [...prev, assistantMessage]);

        const audio = new Audio(result.audioDataUri);
        audioRef.current = audio;
        audio.play().catch(e => console.error("Audio play failed", e));
        
        audio.onended = () => {
          if (!isListening) {
            setStatus("Tap microphone to ask a follow up question");
          }
        };

      } catch (error) {
        console.error("Live Tutor error:", error);
        setStatus("Sorry, I had trouble responding. Please try again.");
        const errorMessage: ConversationMessage = { role: "assistant", text: "I couldn't process that. Could you repeat?" };
        setConversation(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setTranscript("");
      }
  };


  return (
    <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-2xl text-center shadow-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
                    Live Tutor
                    <Sparkles className="w-6 h-6 text-primary drop-shadow-[0_0_5px_theme(colors.primary)]"/>
                </CardTitle>
                <CardDescription>Real-time voice interaction powered by Gemini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
                <button 
                  onClick={isListening ? processAndRespond : startConversation}
                  className={cn(
                      "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
                      isListening ? "bg-primary/20 shadow-lg scale-105" : "bg-card border-2",
                      isLoading && "cursor-not-allowed"
                  )}
                  disabled={isLoading}
                >
                    <Mic className="w-16 h-16 text-primary" />
                    {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                </button>

                <p className="text-muted-foreground min-h-[20px]">
                    {isLoading || isListening ? transcript || status : status}
                </p>

                {!isListening && conversation.length === 0 && (
                  <Button onClick={startConversation} disabled={isLoading}>
                      <Mic className="mr-2"/>
                      Start Conversation
                  </Button>
                )}
            </CardContent>
        </Card>
        {conversation.length > 0 && (
            <div className="w-full p-4 border-t mt-4 max-h-60 overflow-y-auto">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex gap-3 my-3 text-left ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <Bot className="w-7 h-7 text-primary flex-shrink-0" />}
                        <p className={`rounded-lg px-4 py-2 max-w-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                            {msg.text}
                        </p>
                        {msg.role === 'user' && <User className="w-7 h-7 text-accent flex-shrink-0" />}
                    </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 my-3 text-left justify-start">
                    <Bot className="w-7 h-7 text-primary flex-shrink-0" />
                    <div className="rounded-lg px-4 py-2 bg-card"><LoaderCircle className="w-5 h-5 animate-spin" /></div>
                  </div>
                )}
            </div>
        )}
    </div>
  );
}
