"use client";

import React, { useState, useEffect, useRef } from 'react';

// Define the video data directly in this component
const shortFormVideos = [
  { id: "1", title: "Funny Clip 1", src: "/clips/SnapInsta.to_AQPz6JqWf_Ed-gwzxc9k0KEN1NJcHutZw7Q4HE8NRh7ql87wn06EpKAoWqQsYqOE6glNg8Xn9a3GRuDJnxhLAUujFvPxf5h0OUkQics.mp4"},
  { id: "2", title: "Hilarious Moment", src: "/clips/SnapInsta.to_AQP_vBEFxrl1GIiaBOKiHUuhh4S0itYx6h34dqoYTqnipjdWCpkN_SHRHLlgNYZy9VjJez7AmBeuTZPbSRfeXeGGCzRodsR9s6o0so0.mp4" },
  { id: "3", title: "Standup Bit", src: "/clips/SnapInsta.to_AQPAsUvRKrDMpxx24B6hO3YKk1iTvggPu4wFRoUQ8KtdVG5-bkOayNa0HyO0WJWndl3wHQhVtapI-BzJF_ba80tGjUpwhlTb_8KCcSk.mp4" },
  { id: "5", title: "Joke of the Day", src: "/clips/SnapInsta.to_AQMe4ITnuPOmsXRZE4xMaRZyVj8G-b2ysBqZoTnQFvIG4V0RKHDh-aqWUFQrVulZgXhBbRmwVs2fiJMKzxbMRzgevbG2BhIJelm_MkY.mp4" },
  { id: "6", title: "Joke of the Day", src: "/clips/SnapInsta.to_AQM3ouCg25fOsLoUSxP3irFKX9VXjXkBZEv4Ur3SAnvcuEzylSMzjsOMv48t4BiiqSWV5jWWLNYMJHi1OBwkxYAiJWb4b202FTmATSY.mp4" },
  { id: "4", title: "Another Reel", src: "/clips/SnapInsta.to_AQP-T5uunFE11-0NBg5QZz7xsbVbGPHmsiIDVfLyUN3EQgWnGBAgaFCR4mOzg-w5I8BId3yMlmv6iT5iPwVLLT31kuQJu69K3lPDbt0.mp4" },
];

const ClipsSection = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const clipsScrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = clipsScrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollLeft > 0) {
        setShowScrollHint(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="clips" className="py-8 md:py-12 bg-black px-4">
      <div className="container mx-auto max-w-full">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-white">Clips</h3>
        <div className="relative">
          <div
            ref={clipsScrollContainerRef}
            className="flex overflow-x-auto space-x-3 md:space-x-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {shortFormVideos.map((video) => (
              <div key={video.id} className="flex-none w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[500px] rounded-lg shadow-lg overflow-hidden snap-start">
                <video
                  src={video.src}
                  poster={video.src + "#t=0.5"}
                  width="100%"
                  height="100%"
                  controls
                  controlsList="nofullscreen nodownload"
                  className="object-contain w-full h-full bg-black"
                  preload="none"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
          
          {/* Desktop scroll hint */}
          {shortFormVideos.length > 0 && showScrollHint && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex items-center bg-black bg-opacity-60 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-neutral-300 text-sm mr-2">Scroll</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-300 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          )}

          {/* Mobile swipe hint */}
          {shortFormVideos.length > 0 && showScrollHint && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex lg:hidden items-center bg-black bg-opacity-60 px-3 py-2 rounded-full backdrop-blur-sm">
              <span className="text-neutral-300 text-xs mr-2">Swipe</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-neutral-300 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          )}
        </div>
        
        {shortFormVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500 text-base md:text-lg">
              No short clips right now, probably busy eating.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClipsSection; 