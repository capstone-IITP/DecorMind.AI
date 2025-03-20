'use client';

import React from 'react';
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useGoogleAnalytics from '../_hooks/useGoogleAnalytics';
import { useUser } from '@clerk/nextjs';

export default function KitchenDesigns() {
    const router = useRouter();
    const { event } = useGoogleAnalytics();
    const { isSignedIn } = useUser();

    // Track page view when component mounts
    React.useEffect(() => {
        event({
            action: 'page_view',
            category: 'kitchen_designs',
            label: 'kitchen_designs_page'
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

    // Kitchen design examples data
    const kitchenDesigns = [
        {
            id: 1,
            title: 'Modern Minimalist Kitchen',
            description: 'Clean lines, minimal decoration, and neutral colors create a sleek cooking space.',
            style: 'Modern',
            imageUrl: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Scandinavian Kitchen',
            description: 'Light colors, natural materials, and functional design for a bright, airy feel.',
            style: 'Scandinavian',
            imageUrl: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Industrial Kitchen',
            description: 'Raw materials, exposed elements, and utilitarian objects for an urban loft feel.',
            style: 'Industrial',
            imageUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 4,
            title: 'Traditional Elegant Kitchen',
            description: 'Classic design with rich colors and ornate details for a timeless appeal.',
            style: 'Traditional',
            imageUrl: 'https://images.unsplash.com/photo-1571843439991-dd2b8e051966?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 5,
            title: 'Bohemian Kitchen',
            description: 'Eclectic, colorful, and artistic with global influences for a vibrant cooking space.',
            style: 'Bohemian',
            imageUrl: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?q=80&w=1400&auto=format&fit=crop'
        },
        {
            id: 6,
            title: 'Minimalist Kitchen',
            description: 'Extreme simplicity, clean lines, and monochromatic palette for a serene environment.',
            style: 'Minimalist',
            imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1400&auto=format&fit=crop',
            beforeImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1400&auto=format&fit=crop'
        }
    ];

    // Handle redesign button click
    const handleRedesignClick = () => {
        event({
            action: 'redesign_click',
            category: 'kitchen_designs',
            label: 'kitchen_redesign_button'
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

            {/* Main content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
                        Kitchen Design Gallery
                    </h1>

                    <Button
                        onClick={handleRedesignClick}
                        className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-black font-bold hover:opacity-90 transition-all duration-300"
                    >
                        Redesign Your Kitchen
                    </Button>
                </div>

                <p className="text-zinc-400 max-w-3xl mb-8">
                    Explore our collection of AI-generated kitchen designs. From modern minimalist to traditional elegant,
                    find inspiration for your next kitchen renovation. Click on any design to see the before and after transformation.
                </p>

                {/* Kitchen designs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {kitchenDesigns.map((design) => (
                        <div key={design.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50">
                            <div className="relative h-64 overflow-hidden group">
                                <Image
                                    src={design.beforeImageUrl}
                                    alt={`${design.title} Before`}
                                    fill
                                    priority
                                    className="object-cover brightness-110 contrast-105 transition-opacity duration-500 group-hover:opacity-0"
                                />
                                <Image
                                    src={design.imageUrl}
                                    alt={`${design.title} After`}
                                    fill
                                    priority
                                    className="object-cover brightness-110 contrast-105 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                />
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="bg-cyan-400 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {design.style}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white text-sm">Hover to see transformation</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-bold text-white mb-2">{design.title}</h3>
                                <p className="text-zinc-400 text-sm mb-4">{design.description}</p>

                                <div className="flex justify-between">
                                    <Button
                                        onClick={() => {
                                            event({
                                                action: 'view_design_details',
                                                category: 'kitchen_designs',
                                                label: design.title
                                            });
                                            // In a real app, this would navigate to a detailed view
                                            window.open(design.imageUrl, '_blank');
                                        }}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300 text-sm"
                                    >
                                        View Details
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            event({
                                                action: 'try_this_style',
                                                category: 'kitchen_designs',
                                                label: design.style
                                            });
                                            // Check if user is signed in, redirect to sign-in page if not
                                            if (isSignedIn) {
                                                router.push('/redesign');
                                            } else {
                                                router.push('/sign-in');
                                            }
                                        }}
                                        className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 transition-all duration-300 text-sm"
                                    >
                                        Try This Style
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center shadow-xl mb-12">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
                        Ready to Transform Your Kitchen?
                    </h2>
                    <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                        Upload a photo of your current kitchen and let our AI create a stunning new design based on your preferences.
                    </p>
                    <Button
                        onClick={handleRedesignClick}
                        className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all duration-300"
                    >
                        Start Your Kitchen Redesign
                    </Button>
                </div>

                {/* Design process section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">Our Kitchen Design Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-center">
                            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">1</div>
                            <h3 className="text-lg font-bold mb-2 text-white">Upload Your Kitchen</h3>
                            <p className="text-zinc-400 text-sm">Take a photo of your current kitchen or upload an existing one.</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-center">
                            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">2</div>
                            <h3 className="text-lg font-bold mb-2 text-white">Choose Your Style</h3>
                            <p className="text-zinc-400 text-sm">Select from modern, traditional, industrial, or other kitchen styles.</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-center">
                            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-slate-800 font-bold mx-auto mb-4">3</div>
                            <h3 className="text-lg font-bold mb-2 text-white">Get Your Design</h3>
                            <p className="text-zinc-400 text-sm">Receive your AI-generated kitchen design in less than a minute.</p>
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