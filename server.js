import OpenAI from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load API key from .env file

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use environment variable
});

// Mock design images for fallback when API limit is reached
const mockDesignImages = {
    living: {
        modern: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
        scandinavian: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
        industrial: "https://images.unsplash.com/photo-1505912628658-bfcb1aaff931",
        bohemian: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
        minimalist: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
        traditional: "https://images.unsplash.com/photo-1600566752355-35792bedcfea"
    },
    bedroom: {
        modern: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
        scandinavian: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2",
        industrial: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        bohemian: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54",
        minimalist: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        traditional: "https://images.unsplash.com/photo-1616593969747-4797dc75033e"
    },
    kitchen: {
        modern: "https://images.unsplash.com/photo-1600607687644-c7f34b5063cf",
        scandinavian: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c",
        industrial: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf",
        bohemian: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
        minimalist: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
        traditional: "https://images.unsplash.com/photo-1556912173-3bb406ef7e8d"
    },
    bathroom: {
        modern: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
        scandinavian: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
        industrial: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab",
        bohemian: "https://images.unsplash.com/photo-1580229080435-1c7e2ce835c1",
        minimalist: "https://images.unsplash.com/photo-1629079447777-1e605162dc8d",
        traditional: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9"
    },
    office: {
        modern: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
        scandinavian: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9",
        industrial: "https://images.unsplash.com/photo-1572025442646-866d16c84a54",
        bohemian: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9",
        minimalist: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
        traditional: "https://images.unsplash.com/photo-1572025442646-866d16c84a54"
    },
    dining: {
        modern: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
        scandinavian: "https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79",
        industrial: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6",
        bohemian: "https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79",
        minimalist: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6",
        traditional: "https://images.unsplash.com/photo-1617806118233-18e1de247200"
    }
};

app.post("/generate", async (req, res) => {
    try {
        const { style, type, budget } = req.body;

        // Generate a unique prompt based on user input
        const prompt = `A ${style} style ${type} interior design with a budget of ${budget}. Unique variation: ${Date.now()}`;

        // Try to call OpenAI's DALL·E API
        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            });
            
            res.json({ imageUrl: response.data[0].url });
        } catch (apiError) {
            // If API limit is reached, use mock images instead
            if (apiError.code === 'billing_hard_limit_reached') {
                console.log("OpenAI API billing limit reached. Using fallback images.");
                
                // Convert type to key in our mockDesignImages object
                const roomType = type.toLowerCase().includes('living') ? 'living' : 
                                type.toLowerCase().includes('bedroom') ? 'bedroom' : 
                                type.toLowerCase().includes('kitchen') ? 'kitchen' : 
                                type.toLowerCase().includes('bathroom') ? 'bathroom' : 
                                type.toLowerCase().includes('office') ? 'office' : 
                                type.toLowerCase().includes('dining') ? 'dining' : 'living';
                
                // Convert style to key in our mockDesignImages object
                const designStyle = style.toLowerCase().includes('modern') ? 'modern' : 
                                    style.toLowerCase().includes('scandinavian') ? 'scandinavian' : 
                                    style.toLowerCase().includes('industrial') ? 'industrial' : 
                                    style.toLowerCase().includes('bohemian') ? 'bohemian' : 
                                    style.toLowerCase().includes('minimalist') ? 'minimalist' : 
                                    style.toLowerCase().includes('traditional') ? 'traditional' : 'modern';
                
                // Get the fallback image URL
                const fallbackImageUrl = mockDesignImages[roomType][designStyle];
                
                // Return the fallback image with a note
                return res.json({ 
                    imageUrl: fallbackImageUrl,
                    isFallback: true,
                    message: "Using sample design due to API limit. This is a temporary fallback image."
                });
            } else {
                // For other API errors, rethrow to be caught by the outer catch block
                throw apiError;
            }
        }
    } catch (error) {
        console.error("Error generating image:", error);
        
        // Check for specific OpenAI API errors
        if (error.code === 'billing_hard_limit_reached') {
            return res.status(402).json({ 
                error: "OpenAI API billing limit reached. Please check your API key or billing settings.",
                code: error.code 
            });
        }
        
        res.status(500).json({ error: "Failed to generate image", details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});