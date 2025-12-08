"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { analyzeImage } from "@/ai/flows/analyze-image-flow";
import { LoaderCircle, Upload, Image as ImageIcon, Sparkles } from "lucide-react";

export function VisionLab() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size cannot exceed 5MB.");
        return;
      }
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null);
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

  const handleAnalyzeImage = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysis(null);

    try {
      const photoDataUri = await fileToDataUri(imageFile);
      const result = await analyzeImage({ photoDataUri, question: 'Describe this image in detail.' });
      setAnalysis(result.answer);
    } catch (err) {
      console.error("Image analysis error:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary drop-shadow-[0_0_5px_theme(colors.primary)]" />
            Visual Input
          </CardTitle>
          <CardDescription>
            Upload diagrams, math problems, or textbook pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors aspect-video"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Image preview"
                width={400}
                height={225}
                className="max-h-full max-w-full rounded-md object-contain"
              />
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="font-semibold">Click to upload image</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG up to 5MB
                </p>
              </div>
            )}
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/jpeg,image/png"
          />
          <Button onClick={handleAnalyzeImage} disabled={isLoading || !imageFile} className="w-full">
            {isLoading ? (
                <LoaderCircle className="animate-spin mr-2" />
            ) : (
                <Sparkles className="mr-2" />
            )}
            {isLoading ? "Analyzing..." : "Analyze Image"}
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary drop-shadow-[0_0_5px_theme(colors.primary)]"/>
                AI Analysis
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6">
          {isLoading && (
            <div className="space-y-4">
              <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground mt-4">
                Analyzing your image...
              </p>
            </div>
          )}
          {analysis && !isLoading && (
            <div className="text-left w-full h-full overflow-y-auto">
                 <p className="whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
          {!isLoading && !analysis && (
            <div className="space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                Upload an image to start.
              </p>
               <p className="text-sm text-muted-foreground/80">
                I can explain diagrams, solve math, and more!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
