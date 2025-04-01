"use client";

import { useState } from "react";
import Image from "next/image";

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    setError("");
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      
      setGeneratedImage(data.image);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate AI Image</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2 font-medium">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Describe the image you want to generate..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isGenerating}
          className={`px-4 py-2 rounded-md text-white ${
            isGenerating 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <p>Generating your image. This may take a moment...</p>
          </div>
        </div>
      )}
      
      {generatedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
            <div className="relative w-full aspect-square">
              <Image 
                src={generatedImage} 
                alt="Generated image from Stable Diffusion"
                fill
                className="object-contain rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => window.open(generatedImage, "_blank")}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                Open in New Tab
              </button>
              <a 
                href={generatedImage}
                download="generated-image.png"
                className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-md text-sm"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 