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
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block w-auto">
                        Kitchen Design Inspiration
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Explore our collection of AI-generated kitchen designs. From modern minimalist to traditional elegant,
                        find inspiration for your next kitchen renovation.
                    </p>
                </div>

                {/* Kitchen designs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {kitchenDesigns.map((design) => (
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
                                        Redesign My Kitchen
                                    </Button>
                                    <button
                                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                        onClick={() => {
                                            event({
                                                action: 'view_before_after',
                                                category: 'kitchen_designs',
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

                {/* Before/After CTA section */}
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-8 md:p-12 border border-zinc-700/50 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your Kitchen?</h2>
                            <p className="text-zinc-400 mb-6">
                                Upload a photo of your current Kitchen and our AI will redesign it in minutes. Choose from various styles and see the transformation instantly.
                            </p>
                            <Button
                                className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] hover:opacity-90"
                                onClick={handleRedesignClick}
                            >
                                Redesign My Kitchen
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <Image
                                        src="/images/kitchen_room.jpg"
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
                                        src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop"
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

                {/* Kitchen Design Tips */}
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-16 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block mx-auto">
                        Kitchen Design Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Work Triangle Efficiency</h3>
                            <p className="text-zinc-400">
                                Position your sink, stove, and refrigerator in a triangle layout with 4-9 feet between each. This creates an efficient workflow for cooking and meal preparation while minimizing unnecessary movement.
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Smart Storage Solutions</h3>
                            <p className="text-zinc-400">
                                Maximize cabinet space with pull-out shelves, drawer dividers, and vertical storage. Use wall-mounted racks and magnetic strips for utensils. Consider a kitchen island with built-in storage for additional functionality.
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-[#22d3ee]/50 transition-all duration-300">
                            <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Layered Lighting</h3>
                            <p className="text-zinc-400">
                                Implement a three-tier lighting system: ambient lighting for overall illumination, task lighting for work areas like countertops, and accent lighting to highlight design features. Under-cabinet lights are essential for food preparation areas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ section */}
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold text-white mb-16 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text px-2 py-2 inline-block mx-auto">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">How does the kitchen redesign process work?</h3>
                            <p className="text-zinc-400">
                                Simply upload a photo of your current kitchen, select your preferred style and budget, and our AI will generate a redesigned version of your space within minutes.
                            </p>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">What kitchen layouts work best for small spaces?</h3>
                            <p className="text-zinc-400">
                                For small kitchens, galley, L-shaped, or single-wall layouts maximize efficiency. Our AI considers your space dimensions and suggests the most functional layout for your specific kitchen size.
                            </p>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700/30">
                            <h3 className="text-xl font-bold text-white mb-2">Can I get appliance and material recommendations?</h3>
                            <p className="text-zinc-400">
                                Yes! After generating your redesign, you'll receive a list of recommended appliances, cabinetry, countertop materials, and fixtures that match your selected style and budget.
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