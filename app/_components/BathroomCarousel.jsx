'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BathroomCarousel = ({ onSeeMoreClick }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Bathroom transformations data
  const bathroomTransformations = [
    {
      id: 1,
      beforeImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Traditional Bathroom',
      afterTitle: 'Modern Bathroom'
    },
    {
      id: 2,
      beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1400&auto=format&fit=crop',
      afterImage: '/images/Luxury-Bathroom.jpg',
      beforeTitle: 'Outdated Bathroom',
      afterTitle: 'Luxury Bathroom'
    },
    {
      id: 3,
      beforeImage: 'https://images.unsplash.com/photo-1564540583246-934409427776?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Basic Bathroom',
      afterTitle: 'Minimalist Bathroom'
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Add custom styles for the carousel
    const style = document.createElement('style');
    style.textContent = `
      .bathroom-carousel .swiper-pagination {
        top: 5px;
        position: relative;
      }
      
      .bathroom-carousel .swiper-pagination-bullet {
        background-color: #22d3ee;
        opacity: 0.5;
      }
      
      .bathroom-carousel .swiper-pagination-bullet-active {
        opacity: 1;
        transform: scale(1.2);
      }
      
      .bathroom-carousel .swiper-button-next,
      .bathroom-carousel .swiper-button-prev {
        color: #22d3ee;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .bathroom-carousel .swiper-button-next:after,
      .bathroom-carousel .swiper-button-prev:after {
        font-size: 18px;
        font-weight: bold;
      }
      
      .bathroom-carousel .swiper-button-disabled {
        opacity: 0.3;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bathroom-carousel w-full max-w-5xl mx-auto mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block w-auto">
          Bathroom Transformations
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          See the dramatic before and after results of our AI-powered bathroom redesigns
        </p>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="rounded-xl overflow-hidden border border-zinc-700/50"
      >
        {bathroomTransformations.map((transformation) => (
          <SwiperSlide key={transformation.id}>
            <div className="grid grid-cols-2 h-[500px] relative">
              <div className="relative">
                <Image 
                  src={transformation.beforeImage} 
                  alt={transformation.beforeTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                  <h3 className="text-lg font-bold">{transformation.beforeTitle}</h3>
                  <p className="text-sm text-zinc-300">Before</p>
                </div>
              </div>
              <div className="relative">
                <Image 
                  src={transformation.afterImage} 
                  alt={transformation.afterTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-cyan-400/90 text-slate-800 px-4 py-2 rounded-lg">
                  <h3 className="text-lg font-bold">{transformation.afterTitle}</h3>
                  <p className="text-sm">After</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="flex justify-center mt-8 gap-4">
        <Button
          className="bg-cyan-400 text-slate-800 hover:bg-cyan-500"
          onClick={() => router.push('/redesign')}
        >
          Redesign My Bathroom
        </Button>
        
        {onSeeMoreClick && (
          <Button
            className="bg-zinc-700 hover:bg-zinc-600 text-white"
            onClick={onSeeMoreClick}
          >
            See More Designs
          </Button>
        )}
      </div>
    </div>
  );
};

export default BathroomCarousel;