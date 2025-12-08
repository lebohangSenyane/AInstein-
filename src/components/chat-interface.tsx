"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { Paperclip, ArrowUp, Bot, User, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { answerQuestionsWithContext } from "@/ai/flows/answer-questions-with-context";
import { analyzeImage } from "@/ai/flows/analyze-image-flow";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  image?: string; // data URI for images
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollable = scrollAreaRef.current.querySelector("div");
      if (scrollable) {
         scrollable.scrollTo(0, scrollable.scrollHeight);
      }
    }
  }, [messages, isLoading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      ...(imagePreview && { image: imagePreview }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImageFile(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      let response: ChatMessage;
      if (imageFile) {
        const photoDataUri = await fileToDataUri(imageFile);
        const result = await analyzeImage({
          photoDataUri,
          question: input,
        });
        response = { role: "assistant", content: result.answer };
      } else {
        const context = messages
          .slice(-4)
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");
        const result = await answerQuestionsWithContext({
          question: input,
          context: context,
        });
        response = { role: "assistant", content: result.answer };
      }
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-background rounded-xl border">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 md:p-6 space-y-6">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-14rem)]">
                    <Bot className="w-16 h-16 text-primary mb-4 drop-shadow-[0_0_10px_theme(colors.primary)]" />
                    <h2 className="text-2xl font-bold font-headline">Hello! I am AInstein.</h2>
                    <p className="text-muted-foreground">How can I help you study today?</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-4 items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1 drop-shadow-[0_0_5px_theme(colors.primary)]" />}
                <div className={`rounded-xl p-4 max-w-xl shadow-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  {message.image && (
                    <Image
                      src={message.image}
                      alt="User upload"
                      width={300}
                      height={200}
                      className="rounded-lg mb-2"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && <User className="w-8 h-8 text-accent flex-shrink-0 mt-1 drop-shadow-[0_0_5px_theme(colors.accent)]" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 items-start">
                <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1 drop-shadow-[0_0_5px_theme(colors.primary)]" />
                <div className="rounded-xl p-4 bg-card flex items-center shadow-md">
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 md:p-6 bg-background/80 backdrop-blur-sm border-t">
        <form onSubmit={handleSubmit} className="relative">
          {imagePreview && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-card rounded-lg border">
              <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-md"/>
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">X</button>
            </div>
          )}
          <Textarea
            placeholder="Ask about your course, or upload a diagram to get started..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    handleSubmit(e);
                }
            }}
            className="pr-24 py-3 min-h-[52px] resize-none"
          />
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageFile)}>
              <ArrowUp className="w-5 h-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
