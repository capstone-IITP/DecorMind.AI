"use client";

import React, { useRef, useState } from "react";

const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="py-12 bg-black text-white text-center">
            <h2 className="text-2xl font-semibold mb-6">
                See DecorMind in action with our step-by-step tutorial video
            </h2>

            <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <video
                    ref={videoRef}
                    className="w-full h-auto object-cover"
                    src="/videos/tutorial-video.mp4"
                    poster="/images/cover-page.jpg"
                    controls
                    muted={isMuted}
                    controlsList="nodownload"
                    playsInline
                />
            </div>

            <button
                onClick={toggleMute}
                className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
            >
                {isMuted ? "Unmute" : "Mute"}
            </button>
        </section>
    );
};

export default VideoSection;