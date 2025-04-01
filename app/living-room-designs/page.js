'use client';

import React from 'react';
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { useUser } from '@clerk/nextjs';

export default function LivingRoomDesigns() {
    const router = useRouter();
    const { event } = useGoogleAnalytics();
    const { isSignedIn } = useUser();

    // Track page view when component mounts
    React.useEffect(() => {
        event({
            action: 'page_view',
            category: 'living_room_designs',
            label: 'living_room_designs_page'
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .highlight-section {
                animation: highlightSection 1.5s ease-out;
            }
            
            .section-fade-in {
                animation: fadeIn 0.8s ease-out forwards;
            }
            
            .heading-highlight {
                background: linear-gradient(90deg, rgba(30, 58, 92, 0.1), rgba(34, 211, 238, 0.2), rgba(74, 222, 128, 0.1));
                background-size: 200% 100%;
                animation: gradientMove 2s ease infinite;
                border-radius: 4px;
            }
            
            .icon-pulse {
                animation: pulse 1.5s ease-out;
            }
            
            @keyframes highlightSection {
                0% { background-color: rgba(34, 211, 238, 0.05); }
                100% { background-color: transparent; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }, [event]);

    // Function to add animations to a section
    const animateSection = (section) => {
        if (!section) return;

        // Add highlight animation to the section
        section.classList.add("highlight-section");

        // Add fade-in animation to section elements
        const sectionElements = section.querySelectorAll('h2, h3, h4, p, .grid, .flex');
        sectionElements.forEach((element, index) => {
            // Stagger the animations
            setTimeout(() => {
                element.classList.add('section-fade-in');

                // Remove the animation class after it completes
                setTimeout(() => {
                    element.classList.remove('section-fade-in');
                }, 800);
            }, index * 100); // Stagger by 100ms
        });

        // Add special highlight to headings
        const headings = section.querySelectorAll('h2, h3');
        headings.forEach((heading, index) => {
            setTimeout(() => {
                heading.classList.add('heading-highlight');

                // Remove the animation class after some time
                setTimeout(() => {
                    heading.classList.remove('heading-highlight');
                }, 2000);
            }, 300 + (index * 150)); // Stagger with delay
        });

        // Add pulse animation to icons
        const icons = section.querySelectorAll('.w-10, .w-12, svg');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.classList.add('icon-pulse');

                // Remove the animation class after it completes
                setTimeout(() => {
                    icon.classList.remove('icon-pulse');
                }, 1500);
            }, 500 + (index * 200)); // Stagger with delay
        });

        // Remove the highlight animation after some time
        setTimeout(() => {
            section.classList.remove("highlight-section");
        }, 1500);
    };

    // Living room design examples data
    const livingRoomDesigns = [
        {
            id: 1,
            title: 'Modern Living Room',
            description: 'Clean lines, minimal decoration, and neutral colors create an elegant living space.',
            style: 'Modern',
            imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Scandinavian Living Room',
            description: 'Light colors, natural materials, and functional design for a bright, airy living space.',
            style: 'Scandinavian',
            imageUrl: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Industrial Living Room',
            description: 'Raw materials, exposed elements, and utilitarian objects for an urban loft feel.',
            style: 'Industrial',
            imageUrl: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 4,
            title: 'Traditional Living Room',
            description: 'Classic design with rich colors and ornate details for a timeless appeal.',
            style: 'Traditional',
            imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 5,
            title: 'Bohemian Living Room',
            description: 'Eclectic, colorful, and artistic with global influences for a vibrant living space.',
            style: 'Bohemian',
            imageUrl: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 6,
            title: 'Minimalist Living Room',
            description: 'Extreme simplicity, clean lines, and monochromatic palette for a serene environment.',
            style: 'Minimalist',
            imageUrl: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=1400&auto=format&fit=crop'
        }
    ];

    // Handle redesign button click
    const handleRedesignClick = () => {
        event({
            action: 'redesign_click',
            category: 'living_room_designs',
            label: 'living_room_redesign_button'
        });

        // Check if user is signed in, redirect to sign-in page if not
        if (isSignedIn) {
            router.push('/redesign');
        } else {
            router.push('/sign-in');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            {/* Header with navigation */}
            <div className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl">
                <div
                    className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push('/')}
                >
                    <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
                </div>
                <div className="flex items-center">
                    <nav className="flex gap-6">
                        <Link href="/" className="text-white hover:text-cyan-400 transition-colors relative group">
                            Home
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/#features"
                            className="text-white hover:text-cyan-400 transition-colors relative group"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/');
                                setTimeout(() => {
                                    const featuresSection = document.getElementById('features');
                                    if (featuresSection) {
                                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                                        // Add animation to the section after scrolling
                                        setTimeout(() => {
                                            animateSection(featuresSection);
                                        }, 1000); // Wait for the scroll to complete
                                    }
                                }, 300); // Small delay to ensure navigation completes
                            }}
                        >
                            Features
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-white hover:text-cyan-400 transition-colors relative group"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/');
                                setTimeout(() => {
                                    const featuresSection = document.getElementById('how-it-works');
                                    if (featuresSection) {
                                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                                        // Add animation to the section after scrolling
                                        setTimeout(() => {
                                            animateSection(featuresSection);
                                        }, 1000); // Wait for the scroll to complete
                                    }
                                }, 300); // Small delay to ensure navigation completes
                            }}
                        >
                            How it Works
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/#gallery"
                            className="text-white hover:text-cyan-400 transition-colors relative group"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/');
                                setTimeout(() => {
                                    const featuresSection = document.getElementById('gallery');
                                    if (featuresSection) {
                                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                                        // Add animation to the section after scrolling
                                        setTimeout(() => {
                                            animateSection(featuresSection);
                                        }, 1000); // Wait for the scroll to complete
                                    }
                                }, 300); // Small delay to ensure navigation completes
                            }}
                        >
                            Gallery
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/#contact"
                            className="text-white hover:text-cyan-400 transition-colors relative group"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/');
                                setTimeout(() => {
                                    const featuresSection = document.getElementById('contact');
                                    if (featuresSection) {
                                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                                        // Add animation to the section after scrolling
                                        setTimeout(() => {
                                            animateSection(featuresSection);
                                        }, 1000); // Wait for the scroll to complete
                                    }
                                }, 500); // Increased delay to ensure navigation completes
                            }}
                        >
                            Contact Us
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Hero section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block w-auto">
                        Living Room Design Inspiration
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto ">
                        Explore our collection of stunning living room designs to inspire your next home transformation.
                    </p>
                </div>

                {/* Design examples grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {livingRoomDesigns.map((design) => (
                        <div
                            key={design.id}
                            className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
                            onMouseEnter={(e) => animateSection(e.currentTarget)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={design.imageUrl}
                                    alt={design.title}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {design.style}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{design.title}</h3>
                                <p className="text-zinc-400 mb-4">{design.description}</p>
                                <div className="flex justify-between items-center">
                                    <Button
                                        className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90 text-white"
                                        onClick={handleRedesignClick}
                                    >
                                        Redesign My Room
                                    </Button>
                                    <button
                                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                        onClick={() => {
                                            event({
                                                action: 'view_before_after',
                                                category: 'living_room_designs',
                                                label: design.title
                                            });
                                        }}
                                    >
                                        <span>Before/After</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-8 md:p-12 border border-zinc-700/50 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your living room?</h2>
                            <p className="text-zinc-400 mb-6">
                                Upload a photo of your current living room and our AI will redesign it in minutes. Choose from various styles and see the transformation instantly.
                            </p>
                            <Button
                                className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90"
                                onClick={handleRedesignClick}
                            >
                                Redesign My Living Room
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop"
                                        alt="Before"
                                        fill
                                        className="object-cover rounded-l-xl"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm">
                                        Before
                                    </div>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1400&auto=format&fit=crop"
                                        alt="After"
                                        fill
                                        className="object-cover rounded-r-xl"
                                    />
                                    <div className="absolute bottom-3 right-3 bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm">
                                        After
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Design tips */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-16 text-center">Living Room Design Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Furniture Arrangement</h3>
                            <p className="text-zinc-400">
                                Create conversation areas by arranging seating to face each other. Leave enough space for traffic flow and consider the focal point of the room.
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Color Palette</h3>
                            <p className="text-zinc-400">
                                Choose a color scheme that reflects your style. Use the 60-30-10 rule: 60% dominant color, 30% secondary color, and 10% accent color.
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lighting Layers</h3>
                            <p className="text-zinc-400">
                                Incorporate ambient, task, and accent lighting. Use a mix of ceiling fixtures, floor lamps, table lamps, and wall sconces for a well-lit space.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ section */}
                <div className="mb-16 container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-16 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">How does the living room redesign process work?</h3>
                            <p className="text-zinc-400">
                                Simply upload a photo of your current living room, select your preferred style and budget, and our AI will generate a redesigned version of your space within minutes.
                            </p>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">Can I get furniture recommendations for my redesign?</h3>
                            <p className="text-zinc-400">
                                Yes! After generating your redesign, you'll receive a list of furniture and decor recommendations that match the new design, along with estimated prices.
                            </p>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">How accurate are the redesigns?</h3>
                            <p className="text-zinc-400">
                                Our AI creates realistic visualizations based on your current space. While the redesigns are highly accurate in terms of spatial awareness and style, some minor details may vary in the final implementation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold mr-2">DM</div>
                            <span className="text-white font-medium">DecorMind</span>
                        </div>
                        <div className="text-zinc-500 text-sm">
                            © {new Date().getFullYear()} DecorMind. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}