"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { textToSpeech } from "@/ai/flows/text-to-speech-accessibility";
import { LoaderCircle, Volume2 } from "lucide-react";

export function AccessibilityTool() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Algenib");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voices = [
    { value: "Algenib", label: "Algenib (Female)" },
    { value: "Elnath", label: "Elnath (Male)" },
    { value: "Polis", label: "Polis (Male)" },
    { value: "Mira", label: "Mira (Female)" },
    { value: "sha-echo", label: "Echo (Male, HD)"},
    { value: "sha-onyx", label: "Onyx (Male, HD)"}
  ];

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert to speech.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setAudioUrl(null);

    try {
      const result = await textToSpeech({ text, voiceName: voice });
      setAudioUrl(result.audioDataUri);
    } catch (err) {
      console.error("Text-to-speech error:", err);
      setError("Failed to generate speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Volume2 className="w-6 h-6 text-primary drop-shadow-[0_0_5px_theme(colors.primary)]"/>
                    Text-to-Speech Converter
                </CardTitle>
                <CardDescription>
                    Convert text into natural-sounding speech for better accessibility.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="text-input">Text to Convert</Label>
                    <Textarea
                        id="text-input"
                        placeholder="Enter your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[200px]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="voice-select">Select Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                        <SelectTrigger id="voice-select">
                            <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                            {voices.map((v) => (
                                <SelectItem key={v.value} value={v.value}>
                                    {v.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleGenerateSpeech} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <LoaderCircle className="animate-spin mr-2" />
                    ) : (
                        <Volume2 className="mr-2" />
                    )}
                    {isLoading ? "Generating..." : "Generate Speech"}
                </Button>
            </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center bg-card/50 border-dashed min-h-[300px]">
            <CardContent className="flex flex-col items-center justify-center text-center p-6 w-full h-full">
            {isLoading && (
                <div className="space-y-4">
                    <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground mt-4">Generating audio, please wait...</p>
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {audioUrl && !isLoading && (
                <div className="space-y-4 w-full">
                    <h3 className="font-semibold text-lg font-headline">Your audio is ready!</h3>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
            {!isLoading && !audioUrl && !error && (
                <div className="space-y-2 text-center">
                    <Volume2 className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground mt-4">Your generated audio will appear here.</p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
