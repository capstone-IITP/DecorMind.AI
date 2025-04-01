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

const RoomTransformationsCarousel = ({ onSeeMoreClick }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeRoomType, setActiveRoomType] = useState('kitchen');
  
  // Room transformations data
  const roomTransformations = {
    kitchen: [
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
    ],
    livingRoom: [
      {
        id: 1,
        beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Traditional Living Room',
        afterTitle: 'Modern Living Room'
      },
      {
        id: 2,
        beforeImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Outdated Living Room',
        afterTitle: 'Scandinavian Living Room'
      },
      {
        id: 3,
        beforeImage: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Basic Living Room',
        afterTitle: 'Industrial Living Room'
      }
    ],
    bedroom: [
      {
        id: 1,
        beforeImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Traditional Bedroom',
        afterTitle: 'Modern Bedroom'
      },
      {
        id: 2,
        beforeImage: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Outdated Bedroom',
        afterTitle: 'Scandinavian Bedroom'
      },
      {
        id: 3,
        beforeImage: 'https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Basic Bedroom',
        afterTitle: 'Minimalist Bedroom'
      }
    ],
    bathroom: [
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
        afterImage: '/images/luxury-bathroom.jpg',
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
    ],
    homeOffice: [
      {
        id: 1,
        beforeImage: 'https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Traditional Home Office',
        afterTitle: 'Modern Home Office'
      },
      {
        id: 2,
        beforeImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Cluttered Home Office',
        afterTitle: 'Scandinavian Home Office'
      },
      {
        id: 3,
        beforeImage: 'https://images.unsplash.com/photo-1542330952-bffc55e812b2?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Basic Home Office',
        afterTitle: 'Industrial Home Office'
      }
    ],
    diningRoom: [
      {
        id: 1,
        beforeImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Traditional Dining Room',
        afterTitle: 'Modern Dining Room'
      },
      {
        id: 2,
        beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Outdated Dining Room',
        afterTitle: 'Scandinavian Dining Room'
      },
      {
        id: 3,
        beforeImage: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1400&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1400&auto=format&fit=crop',
        beforeTitle: 'Basic Dining Room',
        afterTitle: 'Industrial Dining Room'
      }
    ]
  };

  // Room type tabs
  const roomTypes = [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'livingRoom', label: 'Living Room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'homeOffice', label: 'Home Office' },
    { id: 'diningRoom', label: 'Dining Room' }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Add custom styles for the carousel
    const style = document.createElement('style');
    style.textContent = `
      .room-carousel .swiper-pagination {
        top: 5px;
        position: relative;
      }
      
      .room-carousel .swiper-pagination-bullet {
        background-color: #22d3ee;
        opacity: 0.5;
      }
      
      .room-carousel .swiper-pagination-bullet-active {
        opacity: 1;
        transform: scale(1.2);
      }
      
      .room-carousel .swiper-button-next,
      .room-carousel .swiper-button-prev {
        color: #22d3ee;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .room-carousel .swiper-button-next:after,
      .room-carousel .swiper-button-prev:after {
        font-size: 18px;
        font-weight: bold;
      }
      
      .room-carousel .swiper-button-disabled {
        opacity: 0.3;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .slide-in {
        animation: slideIn 0.4s ease-out forwards;
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .scale-in {
        animation: scaleIn 0.5s ease-out forwards;
      }
      
      .room-content-transition {
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      }
      
      .room-content-enter {
        opacity: 0;
        transform: translateY(10px);
      }
      
      .room-content-enter-active {
        opacity: 1;
        transform: translateY(0);
      }

      .room-type-tab {
        transition: all 0.3s ease;
        position: relative;
      }

      .room-type-tab::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #22d3ee;
        transition: width 0.3s ease;
      }

      .room-type-tab.active {
        color: #22d3ee;
      }

      .room-type-tab.active::after {
        width: 100%;
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

  // Get the title based on active room type
  const getRoomTypeTitle = () => {
    const roomType = roomTypes.find(type => type.id === activeRoomType);
    return roomType ? roomType.label : 'Room';
  };

  // Get description based on active room type
  const getRoomTypeDescription = () => {
    switch(activeRoomType) {
      case 'kitchen':
        return 'See how our AI transforms ordinary kitchens into extraordinary culinary spaces. From modern minimalist to cozy traditional designs.';
      case 'livingRoom':
        return 'Transform your living room into a stylish and comfortable space. From contemporary to traditional, see how AI can reimagine your living area.';
      case 'bedroom':
        return 'Create the perfect bedroom retreat with our AI designer. From serene minimalist to luxurious comfort, see stunning bedroom transformations.';
      case 'bathroom':
        return 'Upgrade your bathroom with stunning AI-generated designs. From spa-like retreats to modern functional spaces, see the possibilities.';
      case 'homeOffice':
        return 'Convert any space into a productive home office with our AI designer. From modern to industrial styles, see how to create the perfect work environment.';
      case 'diningRoom':
        return 'Reimagine your dining area with our AI designer. From elegant formal spaces to cozy breakfast nooks, see beautiful dining room transformations.';
      default:
        return 'See how our AI transforms ordinary spaces into extraordinary rooms with personalized designs.';
    }
  };

  // Get button text based on active room type
  const getButtonText = () => {
    return `See More ${getRoomTypeTitle()} Designs`;
  };

  return (
    <div className="room-carousel">
      <div className="text-center mb-12 fade-in scale-in">
        <h2 className="text-3xl font-bold text-white mb-4">{getRoomTypeTitle()} Transformations</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          {getRoomTypeDescription()}
        </p>
      </div>

      {/* Room type tabs */}
      <div className="flex justify-center gap-6 mb-8">
        {roomTypes.map((type) => (
          <button
            key={type.id}
            className={`room-type-tab px-2 py-1 text-lg font-medium ${activeRoomType === type.id ? 'active text-cyan-400' : 'text-white'}`}
            onClick={() => {
              // Add animation class to the content when switching room types
              const contentElement = document.querySelector('.room-content');
              if (contentElement) {
                contentElement.classList.remove('scale-in');
                contentElement.classList.remove('slide-in');
                // Force a reflow to restart the animation
                void contentElement.offsetWidth;
                contentElement.classList.add('scale-in');
                contentElement.classList.add('slide-in');
              }
              setActiveRoomType(type.id);
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      
      <div className="room-content scale-in slide-in">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="mb-10"
          key={activeRoomType} // Force re-render when room type changes
          effect="fade" // Add fade effect for smoother transitions
          fadeEffect={{ crossFade: true }}
        >
        {roomTransformations[activeRoomType].map((item) => (
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
      
      </div>
      
      <div className="text-center fade-in">
        <Button 
          className="bg-cyan-400 text-slate-800 hover:bg-cyan-500"
          onClick={() => onSeeMoreClick(activeRoomType)}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default RoomTransformationsCarousel;