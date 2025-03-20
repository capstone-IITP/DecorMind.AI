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

const KitchenCarousel = ({ onSeeMoreClick }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Kitchen transformations data
  const kitchenTransformations = [
    {
      id: 1,
      beforeImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Traditional Kitchen',
      afterTitle: 'Modern Luxury Kitchen'
    },
    {
      id: 2,
      beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Outdated Kitchen',
      afterTitle: 'Scandinavian Kitchen'
    },
    {
      id: 3,
      beforeImage: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?q=80&w=1400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?q=80&w=1400&auto=format&fit=crop',
      beforeTitle: 'Basic Kitchen',
      afterTitle: 'Industrial Kitchen'
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Add custom styles for the carousel
    const style = document.createElement('style');
    style.textContent = `
      .kitchen-carousel .swiper-pagination {
        top: 5px;
        position: relative;
      }
      
      .kitchen-carousel .swiper-pagination-bullet {
        background-color: #22d3ee;
        opacity: 0.5;
      }
      
      .kitchen-carousel .swiper-pagination-bullet-active {
        opacity: 1;
        transform: scale(1.2);
      }
      
      .kitchen-carousel .swiper-button-next,
      .kitchen-carousel .swiper-button-prev {
        color: #22d3ee;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .kitchen-carousel .swiper-button-next:after,
      .kitchen-carousel .swiper-button-prev:after {
        font-size: 18px;
        font-weight: bold;
      }
      
      .kitchen-carousel .swiper-button-disabled {
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
    <div className="kitchen-carousel">
      <div className="text-center mb-12 fade-in">
        <h2 className="text-3xl font-bold text-white mb-4">Kitchen Transformations</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          See how our AI transforms ordinary kitchens into extraordinary culinary spaces. From modern minimalist to cozy traditional designs.
        </p>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        loop={true}
        className="mb-10"
      >
        {kitchenTransformations.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-80 rounded-xl overflow-hidden group">
                <Image
                  src={item.beforeImage}
                  alt={`${item.beforeTitle} Before`}
                  fill
                  priority
                  className="object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">Before</span>
                    <h3 className="text-xl font-bold text-white mt-2">{item.beforeTitle}</h3>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 rounded-xl overflow-hidden group">
                <Image
                  src={item.afterImage}
                  alt={`${item.afterTitle} After`}
                  fill
                  priority
                  className="object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">After</span>
                    <h3 className="text-xl font-bold text-white mt-2">{item.afterTitle}</h3>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="text-center fade-in">
        <Button 
          className="bg-cyan-400 text-slate-800 hover:bg-cyan-500"
          onClick={onSeeMoreClick}
        >
          See More Kitchen Designs
        </Button>
      </div>
    </div>
  );
};

export default KitchenCarousel;