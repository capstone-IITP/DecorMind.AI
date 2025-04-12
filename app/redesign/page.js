'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { useRouter } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import UpgradeModal from "../../components/UpgradeModal";
import Image from 'next/image';

// Plans for credit system
const plans = {
  free: 2,      // Free plan users ke liye max 2 images
  premium: 10,  // Premium users ke liye max 10 images
  pro: Infinity // Pro users ke liye unlimited images
};

const styleOptions = [
  { id: 'modern', name: 'Modern', description: 'Clean lines, minimal decoration, and neutral colors' },
  { id: 'scandinavian', name: 'Scandinavian', description: 'Light colors, natural materials, and functional design' },
  { id: 'industrial', name: 'Industrial', description: 'Raw materials, exposed elements, and utilitarian objects' },
  { id: 'bohemian', name: 'Bohemian', description: 'Eclectic, colorful, and artistic with global influences' },
  { id: 'minimalist', name: 'Minimalist', description: 'Extreme simplicity, clean lines, and monochromatic palette' },
  { id: 'traditional', name: 'Traditional', description: 'Classic design with rich colors and ornate details' },
];

const roomTypes = [
  { id: 'living', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'office', name: 'Home Office' },
  { id: 'dining', name: 'Dining Room' },
];

// Setup IndexedDB for favorites storage
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }
    
    const request = indexedDB.open("DesignFavoritesDB", 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening IndexedDB");
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};

// Save favorites to IndexedDB
const saveFavoritesToIndexedDB = async (favorites) => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(["favorites"], "readwrite");
    const store = transaction.objectStore("favorites");
    
    // Clear existing data
    store.clear();
    
    // Add each favorite as separate record
    favorites.forEach(favorite => {
      store.add(favorite);
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(true);
      };
      
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error saving to IndexedDB:", error);
    return false;
  }
};

// Get favorites from IndexedDB
const getFavoritesFromIndexedDB = async () => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(["favorites"], "readonly");
    const store = transaction.objectStore("favorites");
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error("Get request error:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error getting from IndexedDB:", error);
    return [];
  }
};

// Check if design is in favorites
const checkIsFavorite = async (roomType, style) => {
  try {
    const favorites = await getFavoritesFromIndexedDB();
    return favorites.some(fav => 
      fav.roomType === roomType && 
      fav.style === style
    );
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export default function Redesign() {
  const router = useRouter();
  const { event } = useGoogleAnalytics();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [roomImage, setRoomImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [budget, setBudget] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteSuccess, setFavoriteSuccess] = useState(false);
  
  // Credit system states
  const [usedCredits, setUsedCredits] = useState(0);
  const [userPlan, setUserPlan] = useState("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);

  // Load user credits and plan from storage
  useEffect(() => {
    const storedCredits = parseInt(localStorage.getItem("usedCredits")) || 0;
    const storedPlan = localStorage.getItem("userPlan") || "free";
    setUsedCredits(storedCredits);
    setUserPlan(storedPlan);
    setRemainingCredits(plans[storedPlan] - storedCredits);
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Track file upload event
      event({
        action: 'room_image_upload',
        category: 'redesign',
        label: file.type
      });

      // Move to next step automatically
      setStep(2);
    }
  };

  // Handle style selection
  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);

    // Track style selection event
    event({
      action: 'style_selected',
      category: 'redesign',
      label: styleId
    });

    // Move to next step automatically
    setStep(3);
  };

  // Handle room type selection
  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);

    // Track room type selection event
    event({
      action: 'room_type_selected',
      category: 'redesign',
      label: roomId
    });

    // Move to next step automatically
    setStep(4);
  };

  // Handle budget selection
  const handleBudgetSelect = (budgetLevel) => {
    setBudget(budgetLevel);

    // Track budget selection event
    event({
      action: 'budget_selected',
      category: 'redesign',
      label: budgetLevel
    });

    // Move to next step automatically
    setStep(5);
  };

  // Handle design generation with credit check
  const handleGenerateDesign = async () => {
    if (!roomImage || !selectedStyle || !selectedRoom || !budget) {
      return;
    }

    // Check if user has enough credits
    if (usedCredits >= plans[userPlan]) {
      // Show upgrade modal instead of directly navigating to pricing page
      setShowUpgradeModal(true);
      
      // Track upgrade needed event
      event({
        action: 'credits_exceeded',
        category: 'redesign',
        label: userPlan
      });
      
      return;
    }

    setIsGenerating(true);

    // Track generation start event
    event({
      action: 'design_generation_started',
      category: 'redesign',
      label: `${selectedRoom}_${selectedStyle}_${budget}`
    });
    
    try {
      // Get the style name and room type name for a better prompt
      const styleName = styleOptions.find(style => style.id === selectedStyle)?.name || selectedStyle;
      const roomTypeName = roomTypes.find(room => room.id === selectedRoom)?.name || selectedRoom;

      // Create a descriptive prompt for the image generation
      const prompt = `Generate a ${styleName.toLowerCase()} style ${roomTypeName.toLowerCase()} with a ${budget} budget. The room should have appropriate furniture, decor, and lighting for the style and room type.`;

      // Make API call to the server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error("Request timed out. The image generation server may be busy. Please try again.");
      }, 30000); // 30 second timeout - image generation can take time
      
      console.log("Generating design with prompt:", prompt);
      
      // API call
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        }),
        signal: controller.signal
      })
      .catch(fetchError => {
        console.error("Fetch error:", fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          
          // API might return fallback image even with error
          if (errorData.fallbackImage) {
            const generatedDesignData = {
              imageUrl: errorData.fallbackImage,
              isFallback: true,
              fallbackMessage: `${errorData.error}: ${errorData.message || 'Using fallback image instead'}`,
              suggestions: [
                `Replace furniture with ${styleName.toLowerCase()} pieces that fit your ${budget} budget`,
                `Add ${styleName.toLowerCase()} decorative elements to enhance the space`,
                `Consider a color palette typical of ${styleName.toLowerCase()} design`,
                `Rearrange the layout to optimize flow and functionality`,
                `Add lighting fixtures that complement the ${styleName.toLowerCase()} style`
              ]
            };
            setGeneratedDesign(generatedDesignData);
            return; // Exit early since we've set the design
          }
          
          if (response.status === 402 && errorData.code === 'billing_hard_limit_reached') {
            throw new Error('Stability AI API billing limit reached. Please try again later or contact support.');
          }
          throw new Error(`${errorData.error || 'Server error'}: ${errorData.message || `Status ${response.status}`}`);
        } catch (jsonError) {
          // If we can't parse the error as JSON, it might be a network error or HTML response
          if (jsonError.message.includes('JSON')) {
            console.error("Failed to parse error response as JSON:", jsonError);
          }
          
          if (response.status === 404) {
            throw new Error(`API endpoint not found. Please ensure your STABLE_DIFFUSION_API_KEY is set in .env.local file.`);
          } else {
            throw new Error(`Failed to connect to the API: ${response.status} ${response.statusText}`);
          }
        }
      }

      const data = await response.json();

      // Create design object with the generated image URL and suggestions
      const generatedDesignData = {
        imageUrl: data.image || data.fallbackImage, // Handle both direct image or fallback
        isFallback: data.error || data.fallbackImage ? true : false,
        fallbackMessage: data.error ? `${data.error}: ${data.message || ''}` : data.message || null,
        suggestions: [
          `Replace furniture with ${styleName.toLowerCase()} pieces that fit your ${budget} budget`,
          `Add ${styleName.toLowerCase()} decorative elements to enhance the space`,
          `Consider a color palette typical of ${styleName.toLowerCase()} design`,
          `Rearrange the layout to optimize flow and functionality`,
          `Add lighting fixtures that complement the ${styleName.toLowerCase()} style`
        ]
      };
      
      // If using fallback image, log this information
      if (data.isFallback) {
        console.log("Using fallback image due to API limit:", data.message);
      }

      setGeneratedDesign(generatedDesignData);

      // ✅ Update used credits after successful generation
      const newCredits = usedCredits + 1;
      setUsedCredits(newCredits);
      localStorage.setItem("usedCredits", newCredits);
      setRemainingCredits(plans[userPlan] - newCredits);

      // Track successful generation
      event({
        action: 'design_generation_completed',
        category: 'redesign',
        label: `${selectedRoom}_${selectedStyle}_${budget}`
      });
    } catch (error) {
      console.error('Error generating design:', error);
      
      // Fallback to sample design if API call fails
      const styleName = styleOptions.find(style => style.id === selectedStyle)?.name || selectedStyle;
      const roomTypeName = roomTypes.find(room => room.id === selectedRoom)?.name || selectedRoom;
      
      // Create a fallback image URL based on room type
      let fallbackImageUrl;
      switch(selectedRoom) {
        case 'living':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop';
          break;
        case 'kitchen':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop';
          break;
        case 'bedroom':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1400&auto=format&fit=crop';
          break;
        case 'bathroom':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1400&auto=format&fit=crop';
          break;
        case 'office':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1400&auto=format&fit=crop';
          break;
        case 'dining':
          fallbackImageUrl = 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?q=80&w=1400&auto=format&fit=crop';
          break;
        default:
          fallbackImageUrl = 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop';
      }
      
      // Set fallback design with error message
      setGeneratedDesign({
        error: true,
        errorMessage: error.message || 'Failed to generate design',
        imageUrl: fallbackImageUrl,
        isFallback: true,
        fallbackMessage: `Using a sample ${roomTypeName.toLowerCase()} image while we fix our design API. ${error.message}`,
        suggestions: [
          `Replace furniture with ${styleName.toLowerCase()} pieces that fit your ${budget} budget`,
          `Add ${styleName.toLowerCase()} decorative elements to enhance the space`,
          `Consider a color palette typical of ${styleName.toLowerCase()} design`,
          `Rearrange the layout to optimize flow and functionality`,
          `Add lighting fixtures that complement the ${styleName.toLowerCase()} style`
        ]
      });

      // Track error
      event({
        action: 'design_generation_error',
        category: 'redesign',
        label: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle download of generated design
  const handleDownloadDesign = async () => {
    if (!generatedDesign?.imageUrl) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Track download event
      event({
        action: 'design_downloaded',
        category: 'redesign',
        label: `${selectedRoom}_${selectedStyle}_${budget}`
      });

      // Create a temporary anchor element
      const link = document.createElement('a');

      // Set the download attribute with a filename
      const fileName = `${roomTypes.find(room => room.id === selectedRoom)?.name || 'Room'}_${styleOptions.find(style => style.id === selectedStyle)?.name || 'Design'}.jpg`;
      link.download = fileName;

      // Fetch the image and convert to blob
      const response = await fetch(generatedDesign.imageUrl);
      const blob = await response.blob();

      // Create a local URL for the image blob
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      // Append to body, click to trigger download, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);

      // Reset download success message after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error downloading design:', error);
      setDownloadError('Failed to download design. Please try again.');

      // Track download error
      event({
        action: 'design_download_error',
        category: 'redesign',
        label: error.message
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset the form and start over
  const handleStartOver = () => {
    setStep(1);
    setRoomImage(null);
    setPreviewUrl(null);
    setSelectedStyle(null);
    setSelectedRoom(null);
    setBudget('medium');
    setGeneratedDesign(null);

    // Track start over event
    event({
      action: 'redesign_start_over',
      category: 'redesign',
      label: 'user_initiated'
    });
  };

  // Handle adding design to favorites
  const handleAddToFavorites = async (e) => {
    e.stopPropagation();

    // Toggle favorite status
    setIsFavorite(!isFavorite);

    // Track favorite event
    event({
      action: isFavorite ? 'design_removed_from_favorites' : 'design_added_to_favorites',
      category: 'redesign',
      label: `${selectedRoom}_${selectedStyle}_${budget}`
    });

    // Show success message
    setFavoriteSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setFavoriteSuccess(false);
    }, 3000);

    try {
      // Get current favorites from IndexedDB
      const favorites = await getFavoritesFromIndexedDB();
      
      if (!isFavorite) {
        // Create a minimal object to save space
        const imageUrl = generatedDesign?.imageUrl;
        let thumbnailUrl = imageUrl;
        
        // If the URL contains a high-resolution image, use a smaller version
        if (imageUrl && imageUrl.includes('unsplash.com')) {
          thumbnailUrl = imageUrl.replace(/w=\d+/, 'w=200').replace(/q=\d+/, 'q=60');
        }
        
        const newFavorite = {
          id: Date.now(),
          thumbnailUrl: thumbnailUrl,
          roomType: roomTypes.find(room => room.id === selectedRoom)?.name || 'Room',
          style: styleOptions.find(style => style.id === selectedStyle)?.name || 'Style',
          date: new Date().toISOString()
        };

        // Add the new favorite to the beginning
        favorites.unshift(newFavorite);
        
        // No limit on the number of favorites
        // Allow unlimited favorites storage
      } else {
        // Find and remove from favorites
        const roomTypeName = roomTypes.find(room => room.id === selectedRoom)?.name || 'Room';
        const styleName = styleOptions.find(style => style.id === selectedStyle)?.name || 'Style';
        
        const index = favorites.findIndex(fav => 
          fav.roomType === roomTypeName && 
          fav.style === styleName
        );

        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }
      
      // Save to IndexedDB
      await saveFavoritesToIndexedDB(favorites);
      
      // Also update localStorage reference with minimal data for compatibility
      try {
        // Just store IDs and dates in localStorage for compatibility
        const minimalFavorites = favorites.map(fav => ({
          id: fav.id,
          roomType: fav.roomType,
          style: fav.style,
          date: fav.date
        }));
        localStorage.setItem('favoriteDesigns', JSON.stringify(minimalFavorites));
      } catch (storageError) {
        console.warn("Could not update localStorage reference:", storageError);
      }
      
    } catch (error) {
      console.error("Error handling favorites:", error);
    }
  };

  // Update useEffect to check if design is in favorites using IndexedDB
  React.useEffect(() => {
    if (generatedDesign && selectedRoom && selectedStyle) {
      const roomTypeName = roomTypes.find(room => room.id === selectedRoom)?.name || 'Room';
      const styleName = styleOptions.find(style => style.id === selectedStyle)?.name || 'Style';
      
      checkIsFavorite(roomTypeName, styleName)
        .then(result => setIsFavorite(result))
        .catch(error => console.error("Error checking favorite status:", error));
    }
  }, [generatedDesign, selectedRoom, selectedStyle]);

  // Render step 1: Upload room image
  const renderStep1 = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">Upload Your Room Photo</h2>
      <p className="text-zinc-400 mb-6">Take a photo of the room you want to redesign. Make sure the photo is clear and shows the entire space.</p>

      <div
        className="border-2 border-dashed border-zinc-700 hover:border-[#22d3ee] rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.add('border-[#22d3ee]', 'shadow-[0_0_15px_rgba(34,211,238,0.3)]');
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.add('border-[#22d3ee]', 'shadow-[0_0_15px_rgba(34,211,238,0.3)]');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('border-[#22d3ee]', 'shadow-[0_0_15px_rgba(34,211,238,0.3)]');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('border-[#22d3ee]', 'shadow-[0_0_15px_rgba(34,211,238,0.3)]');
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            setRoomImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            // Track file upload event
            event({
              action: 'room_image_upload',
              category: 'redesign',
              label: file.type
            });
            // Move to next step automatically
            setStep(2);
          }
        }}
      >
        {previewUrl ? (
          <div className="relative">
            <div className="relative h-64 w-full">
              <Image 
                src={previewUrl} 
                alt="Room preview" 
                className="rounded-lg" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button
              className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setRoomImage(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-zinc-300 font-medium">Drag & drop your photo here</p>
            <p className="text-zinc-500 text-sm mt-1">or click to browse</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (roomImage) {
              setStep(2);
              event({
                action: 'upload_photo_complete',
                category: 'redesign',
                label: 'photo_uploaded'
              });
            }
          }}
          disabled={!roomImage}
          className={`${roomImage
            ? 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90'
            : 'bg-zinc-700 cursor-not-allowed'
            } text-white transition-all duration-300`}
        >
          Next: Choose Style
        </Button>
      </div>
    </div>
  );

  // Render step 2: Select design style
  const renderStep2 = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">Choose Your Design Style</h2>
      <p className="text-zinc-400 mb-6">Select a design style that matches your taste and preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styleOptions.map((style) => (
          <div
            key={style.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedStyle === style.id
              ? 'border-[#22d3ee] bg-[#1e3a5c]/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'border-zinc-800 hover:border-[#22d3ee]/50 bg-zinc-900/50'
              }`}
            onClick={() => handleStyleSelect(style.id)}
          >
            <h3 className="text-lg font-medium mb-1">{style.name}</h3>
            <p className="text-zinc-400 text-sm">{style.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setStep(1)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (selectedStyle) {
              setStep(3);
              event({
                action: 'style_selected',
                category: 'redesign',
                label: selectedStyle
              });
            }
          }}
          disabled={!selectedStyle}
          className={`${selectedStyle
            ? 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90'
            : 'bg-zinc-700 cursor-not-allowed'
            } text-white transition-all duration-300`}
        >
          Next: Room Type
        </Button>
      </div>
    </div>
  );

  // Render step 3: Select room type
  const renderStep3 = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">Select Your Room Type</h2>
      <p className="text-zinc-400 mb-6">Tell us which room you're redesigning for tailored suggestions.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedRoom === room.id
              ? 'border-[#22d3ee] bg-[#1e3a5c]/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'border-zinc-800 hover:border-[#22d3ee]/50 bg-zinc-900/50'
              }`}
            onClick={() => handleRoomSelect(room.id)}
          >
            <h3 className="text-lg font-medium mb-1">{room.name}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setStep(2)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (selectedRoom) {
              setStep(4);
              event({
                action: 'room_type_selected',
                category: 'redesign',
                label: selectedRoom
              });
            }
          }}
          disabled={!selectedRoom}
          className={`${selectedRoom
            ? 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90'
            : 'bg-zinc-700 cursor-not-allowed'
            } text-white transition-all duration-300`}
        >
          Next: Set Budget
        </Button>
      </div>
    </div>
  );

  // Render step 4: Select budget
  const renderStep4 = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">Set Your Budget</h2>
      <p className="text-zinc-400 mb-6">Define your budget to get recommendations within your price range.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${budget === 'low'
            ? 'border-[#22d3ee] bg-[#1e3a5c]/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
            : 'border-zinc-800 hover:border-[#22d3ee]/50 bg-zinc-900/50'
            }`}
          onClick={() => handleBudgetSelect('low')}
        >
          <h3 className="text-lg font-medium mb-1">Budget-Friendly</h3>
          <p className="text-zinc-400 text-sm">Affordable options and DIY solutions</p>
        </div>

        <div
          className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${budget === 'medium'
            ? 'border-[#22d3ee] bg-[#1e3a5c]/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
            : 'border-zinc-800 hover:border-[#22d3ee]/50 bg-zinc-900/50'
            }`}
          onClick={() => handleBudgetSelect('medium')}
        >
          <h3 className="text-lg font-medium mb-1">Mid-Range</h3>
          <p className="text-zinc-400 text-sm">Quality items with reasonable prices</p>
        </div>

        <div
          className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${budget === 'high'
            ? 'border-[#22d3ee] bg-[#1e3a5c]/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
            : 'border-zinc-800 hover:border-[#22d3ee]/50 bg-zinc-900/50'
            }`}
          onClick={() => handleBudgetSelect('high')}
        >
          <h3 className="text-lg font-medium mb-1">Premium</h3>
          <p className="text-zinc-400 text-sm">High-end products and luxury brands</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setStep(3)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (selectedRoom && selectedStyle && budget) {
              setStep(5);
              event({
                action: 'budget_selected',
                category: 'redesign',
                label: budget
              });
            }
          }}
          disabled={!selectedRoom || !selectedStyle || !budget}
          className={`${selectedRoom && selectedStyle && budget
            ? 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90'
            : 'bg-zinc-700 cursor-not-allowed'
            } text-white transition-all duration-300`}
        >
          Next: Review and Generate
        </Button>
      </div>
    </div>
  );

  // Render step 5: Review and generate
  const renderStep5 = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
        {generatedDesign ? 'Design Generated' : 'Review and Generate'}
      </h2>
      <p className="text-zinc-400 mb-6">
        {generatedDesign
          ? 'Your design has been successfully generated. You can view it below.'
          : 'Review your choices and generate your personalized design.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
          <h3 className="text-lg font-medium mb-4 text-white">Your Selections</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500 mb-1">Room Photo</p>
              {previewUrl && (
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image 
                    src={previewUrl} 
                    alt="Room preview" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Design Style</p>
              <p className="text-zinc-300">
                {styleOptions.find(style => style.id === selectedStyle)?.name || 'Not selected'}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Room Type</p>
              <p className="text-zinc-300">
                {roomTypes.find(room => room.id === selectedRoom)?.name || 'Not selected'}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Budget</p>
              <p className="text-zinc-300">
                {budget === 'low' ? 'Budget-Friendly' :
                  budget === 'medium' ? 'Mid-Range' :
                    budget === 'high' ? 'Premium' : 'Not selected'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700 flex flex-col">
          <h3 className="text-lg font-medium mb-4 text-white">
            {generatedDesign ? 'Design Status' : 'Generate Your Design'}
          </h3>
          <p className="text-zinc-400 mb-6 flex-grow">
            {generatedDesign
              ? 'Your design has been successfully generated based on your preferences. You can view it below.'
              : 'Our AI will analyze your photo and preferences to create a personalized redesign of your space.'}
          </p>

          <button
            onClick={handleGenerateDesign}
            disabled={isGenerating || generatedDesign}
            className={`w-full py-6 text-lg ${generatedDesign
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90'
              } text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating your design...
              </div>
            ) : generatedDesign ? (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done
              </div>
            ) : (
              <>Generate My Design</>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setStep(4)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Back
        </Button>

        {generatedDesign && (
          <Button
            onClick={() => {
              // Scroll to results
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }}
            className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90 text-white transition-all duration-300"
          >
            View Results
          </Button>
        )}
      </div>
    </div>
  );

  // Modify render results to show credit info
  const renderResults = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80]">Your redesigned room</h2>
        <div className="flex items-center gap-4">
          <div className="text-zinc-400 text-sm">
            <span className="mr-2">Plan: <span className="text-white font-medium uppercase">{userPlan}</span></span>
            <span>Credits: <span className="text-white font-medium">{remainingCredits}</span> remaining</span>
          </div>
          <button
            onClick={handleStartOver}
            className="text-zinc-400 hover:text-[#22d3ee] transition-colors text-sm flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start over
          </button>
        </div>
      </div>

      {/* Show upgrade prompt if user is running low on credits */}
      {remainingCredits === 0 && (
        <div className="bg-amber-900/30 text-amber-200 p-4 rounded-lg mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">You've used all your credits!</p>
            <p className="text-sm">Upgrade your plan to create more designs.</p>
          </div>
          <Button
            onClick={() => router.push('/pricing')}
            className="ml-auto bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-300"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="relative cursor-pointer" onClick={() => handleOpenImage(generatedDesign?.imageUrl)}>
              <div className="relative w-full h-96">
                <Image
                  src={generatedDesign?.imageUrl}
                  alt="Redesigned room"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">
                      {roomTypes.find(room => room.id === selectedRoom)?.name || 'Kitchen'} Design
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {styleOptions.find(style => style.id === selectedStyle)?.name || 'Scandinavian'} Style
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDesign();
                      }}
                      disabled={isDownloading}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors duration-300"
                      title="Download design"
                    >
                      {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={handleAddToFavorites}
                      className={`${isFavorite
                        ? 'bg-pink-600 hover:bg-pink-700'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                        } text-white p-2 rounded-full transition-colors duration-300`}
                      title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              {downloadSuccess && (
                <div className="bg-green-900/30 text-green-200 p-3 rounded-lg mb-4 text-sm flex items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Design downloaded successfully!
                </div>
              )}
              
              {generatedDesign?.isFallback && (
                <div className="bg-amber-900/30 text-amber-200 p-3 rounded-lg mb-4 text-sm flex items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {generatedDesign.fallbackMessage || "Using sample design due to API limit. This is a temporary fallback image."}
                </div>
              )}

              {favoriteSuccess && (
                <div className="bg-pink-900/30 text-pink-200 p-3 rounded-lg mb-4 text-sm flex items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {isFavorite ? 'Added to favorites!' : 'Removed from favorites'}
                </div>
              )}

              {downloadError && (
                <div className="bg-red-900/30 text-red-200 p-3 rounded-lg mb-4 text-sm w-full">
                  {downloadError}
                </div>
              )}

              <button
                onClick={() => router.push('/favorites')}
                className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 transition-all rounded-md shadow-md flex items-center gap-2 px-4 py-2 font-medium text-sm"
              >
                View all my designs
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] mb-3">Design suggestions</h3>
            <ul className="space-y-3">
              {(generatedDesign?.suggestions ?? []).map((suggestion, index) => (
                <li key={index} className="flex items-start bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <span className="text-[#22d3ee] mr-2 mt-0.5">•</span>
                  <span className="text-zinc-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#1e3a5c]/30 via-[#22d3ee]/30 to-[#4ade80]/30 rounded-xl p-6 border border-[#22d3ee]/30 shadow-lg">
            <h3 className="text-lg font-medium text-white mb-2">Want more designs?</h3>
            <p className="text-zinc-400 mb-4">
              Upgrade to our premium plan to get unlimited designs, higher quality renders, and more style options.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="w-full bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all rounded-md shadow-md py-2 font-medium text-sm"
            >
              View pricing plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add a function to handle opening the image in a new page
  const handleOpenImage = (imageUrl) => {
    if (imageUrl) {
      // Create a temporary window to display the image
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Room Design Preview</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 0; 
                  background-color: #000;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img { 
                  max-width: 100%; 
                  max-height: 100vh;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="Room Design" />
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        // Fallback if popup is blocked
        window.location.href = imageUrl;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${showUpgradeModal ? 'blur-sm filter brightness-50' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            AI Room Redesign
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Transform your space with AI-powered interior design recommendations tailored to your style and budget.
          </p>

          {/* Add credit information display */}
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">Plan:</span>
              <span className="text-white font-medium uppercase">{userPlan}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">Remaining Credits:</span>
              <span className="text-white font-medium">{remainingCredits}</span>
            </div>
            <button
              onClick={() => router.push('/favorites')}
              className="text-[#22d3ee] hover:text-white transition-colors duration-300 flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              View My Favorites
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {!generatedDesign && (
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-400">Design Journey: {step}/5 Complete</span>
              <span className="text-sm font-medium text-zinc-400">{Math.round((step / 5) * 100)}% towards your new space</span>
            </div>

            {/* Design Journey Map - A unique alternative to steps */}
            <div className="relative bg-zinc-900/80 rounded-xl p-4 md:p-6 border border-zinc-800 shadow-xl backdrop-blur-sm overflow-hidden">
              {/* Simple background */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black/30"></div>

              {/* Journey path - simplified version */}
              <div className="relative flex items-center justify-between z-10 py-6 px-2 md:px-6">
                {/* Glowing path line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2" style={{ zIndex: 0 }}></div>
                <div
                  className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(step / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #1e3a5c, #22d3ee, #4ade80)',
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.7)',
                    zIndex: 1
                  }}
                ></div>

                {/* Journey points */}
                {[
                  { id: 1, name: 'Capture', icon: 'camera' },
                  { id: 2, name: 'Inspire', icon: 'palette' },
                  { id: 3, name: 'Identify', icon: 'home' },
                  { id: 4, name: 'Plan', icon: 'cash' },
                  { id: 5, name: 'Create', icon: 'sparkles' }
                ].map((point) => (
                  <div
                    key={point.id}
                    className={`relative flex flex-col items-center z-20 transition-all duration-500 ${point.id < step ? 'cursor-pointer' : ''
                      }`}
                    onClick={() => {
                      if (point.id < step) {
                        setStep(point.id);
                        event({
                          action: 'journey_navigation',
                          category: 'redesign',
                          label: `back_to_${point.name.toLowerCase()}`
                        });
                      }
                    }}
                  >
                    {/* Point connector */}
                    <div
                      className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 
                        ${step === point.id
                          ? 'bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white scale-110 shadow-lg'
                          : step > point.id
                            ? 'bg-gradient-to-r from-[#1e3a5c]/80 via-[#22d3ee]/80 to-[#4ade80]/80 text-white'
                            : 'bg-zinc-800 text-zinc-500'}`}
                    >
                      {/* Icons for each journey point */}
                      {step <= point.id && (
                        <>
                          {point.icon === 'camera' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {point.icon === 'palette' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                          )}
                          {point.icon === 'home' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          )}
                          {point.icon === 'cash' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {point.icon === 'sparkles' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          )}
                        </>
                      )}

                      {/* Completion indicator */}
                      {step > point.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* Point label */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs md:text-sm font-medium transition-colors duration-300 px-2 py-1 rounded-md bg-zinc-900/80 ${step === point.id
                          ? 'text-[#22d3ee]'
                          : step > point.id
                            ? 'text-zinc-300'
                            : 'text-zinc-500'
                          }`}
                      >
                        {point.name}
                      </span>
                    </div>

                    {/* Hover tooltip */}
                    <div className={`absolute bottom-full mb-2 bg-zinc-800 text-xs text-white rounded px-2 py-1 transition-opacity duration-300 pointer-events-none
                      ${step === point.id || (point.id < step && point.id !== 1) ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                      {point.id === 1 ? 'Upload your room photo' :
                        point.id === 2 ? 'Choose your design style' :
                          point.id === 3 ? 'Select room type' :
                            point.id === 4 ? 'Set your budget' : 'Review and generate'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add credit warning before generation if user has only 1 credit left */}
        {step === 5 && !generatedDesign && remainingCredits === 1 && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-amber-900/30 text-amber-200 p-4 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">This is your last credit for the {userPlan} plan</p>
                <p className="text-sm">Consider upgrading for more design credits!</p>
              </div>
              <Button
                onClick={() => router.push('/pricing')}
                className="ml-auto bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-300"
              >
                View Plans
              </Button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {generatedDesign && renderResults()}
        </div>
      </div>

      {/* Add the UpgradeModal here */}
      <UpgradeModal 
        show={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={userPlan} 
      />

      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}