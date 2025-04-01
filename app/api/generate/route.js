export async function POST(req) {
    try {
        const { prompt } = await req.json();
        
        // Validate prompt
        if (!prompt) {
            return Response.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        // Check if API key is available
        if (!process.env.STABLE_DIFFUSION_API_KEY) {
            console.error("Missing Stability AI API key");
            return Response.json(
                { error: "Server configuration error - Missing Stability AI API key" },
                { status: 500 }
            );
        }

        console.log("Generating image with Stability AI:", prompt.substring(0, 50) + "...");
        
        try {
            const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: prompt,
                            weight: 1.0
                        }
                    ],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    samples: 1,
                    steps: 30
                })
            });

            console.log("Stable Diffusion API response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Stable Diffusion API error response:", response.status, errorText);
                
                let errorDetails;
                try {
                    errorDetails = JSON.parse(errorText);
                } catch (e) {
                    errorDetails = { message: errorText };
                }
                
                return Response.json(
                    { 
                        error: "Failed to generate image", 
                        details: errorDetails,
                        status: response.status,
                        statusText: response.statusText
                    },
                    { status: response.status }
                );
            }

            const data = await response.json();
            console.log("Stable Diffusion API response structure:", Object.keys(data));

            // Stability AI v1 API format
            if (data.artifacts && Array.isArray(data.artifacts) && data.artifacts.length > 0) {
                // Convert base64 image data to URL
                const imageBase64 = data.artifacts[0].base64;
                if (imageBase64) {
                    const image = `data:image/png;base64,${imageBase64}`;
                    return Response.json({ image });
                }
            }
            
            // Handle legacy or different API response formats (v2beta/v3)
            if (data.image) {
                return Response.json({ image: data.image });
            }
            
            // If we can't find the image in the expected places, return a fallback
            console.error("Unexpected Stable Diffusion API response format:", data);
            return Response.json(
                { 
                    error: "Invalid response format from image generation API",
                    fallbackImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop"
                },
                { status: 200 }
            );
            
        } catch (apiError) {
            console.error("Error calling Stable Diffusion API:", apiError);
            return Response.json(
                { 
                    error: "API call failed", 
                    message: apiError.message,
                    fallbackImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop"
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("General error in image generation:", error);
        return Response.json(
            { 
                error: "Failed to process image generation request", 
                message: error.message,
                fallbackImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop"
            },
            { status: 500 }
        );
    }
} 