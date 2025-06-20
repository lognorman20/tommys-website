"use client";

import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import ClipsSection from '../components/ClipsSection';
import { getBio } from '../data/bio';

const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neutral-300 hover:text-white transition-colors duration-300 p-2 hover:bg-neutral-800 rounded-lg"
  >
    {children}
  </a>
);

export default function HomePage() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [upcomingShows, setUpcomingShows] = React.useState<Array<{ date: string; time: string; venue: string; city: string; tickets: string }>>([]);
  const [bio, setBio] = React.useState<string>('');

  const comedianName = "Thomas Endashaw";
  const tagline = "Stand-Up Comedian, Writer, Actor";

  React.useEffect(() => {
    const loadBio = async () => {
      const bioText = await getBio();
      setBio(bioText);
    };
    loadBio();
  }, []);

  // Helper function to properly parse CSV lines that may contain quoted fields with commas
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        // Handle escaped quotes (double quotes)
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    
    // Remove surrounding quotes from fields
    return result.map(field => field.replace(/^"|"$/g, ''));
  };

  React.useEffect(() => {
    const fetchShows = async () => {
      const csvUrl = process.env.NEXT_PUBLIC_GSHEET_CSV_URL;
      
      if (!csvUrl) {
        console.error("ERROR: NEXT_PUBLIC_GSHEET_CSV_URL environment variable is not set.");
        setUpcomingShows([]);
        return;
      }

      try {
        console.log("Fetching shows from:", csvUrl);
        const response = await fetch(csvUrl);
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log("Raw CSV text:\n", csvText);
        const lines = csvText.trim().split('\n');
        console.log("Split lines:", lines);

        if (lines.length < 2) { // Needs at least a header and one data line
          console.log("Not enough lines in CSV to process (header + data).");
          setUpcomingShows([]);
          return;
        }
        
        const headers = parseCsvLine(lines[0]);
        console.log("CSV Headers:", headers);

        const showsData = lines.slice(1).map((line, index) => {
          if (line.trim() === '') {
            console.log(`Skipping empty line ${index + 2}`);
            return null;
          }
          
          const parts = parseCsvLine(line);
          console.log(`Line ${index + 2} parsed into ${parts.length} parts:`, parts);
          
          // Explicitly define the type for showEntry to match upcomingShows state
          const showEntry: { date: string; time: string; venue: string; city: string; tickets: string } = {
            date: '',
            time: '',
            venue: '',
            city: '',
            tickets: ''
          };

          if (parts.length >= 5) {
            showEntry.date = parts[0] || '';
            showEntry.time = parts[1] || '';
            showEntry.venue = parts[2] || '';
            showEntry.city = parts[3] || '';
            showEntry.tickets = parts[4] || '';
            
            console.log(`Parsed show entry:`, showEntry);
            return showEntry;
          } else {
            console.warn(`Skipping CSV line with insufficient data: "${line}". Expected at least 5 parts, got ${parts.length}.`);
            return null;
          }
        }).filter((show): show is { date: string; time: string; venue: string; city: string; tickets: string } => 
          show !== null && (!!show.date || !!show.time || !!show.venue || !!show.city)
        ); 

        console.log("Final parsed shows data:", showsData);
        
        // Filter out past dates and sort by date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        const filteredAndSortedShows = showsData
          .filter(show => {
            if (!show.date) return false;
            
            // Try to parse the date - handle various date formats
            const showDate = new Date(show.date);
            
            // If parsing failed, try other common formats
            if (isNaN(showDate.getTime())) {
              // Try MM/DD/YYYY format
              const parts = show.date.split('/');
              if (parts.length === 3) {
                const [month, day, year] = parts;
                const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return parsedDate >= currentDate;
              }
              
              // Try DD/MM/YYYY format
              if (parts.length === 3) {
                const [day, month, year] = parts;
                const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return parsedDate >= currentDate;
              }
              
              // If all parsing attempts fail, keep the show (better to show than hide)
              console.warn(`Could not parse date: ${show.date}`);
              return true;
            }
            
            return showDate >= currentDate;
          })
          .sort((a, b) => {
            // Sort by date (earliest first)
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            // Handle parsing failures by treating them as far future dates
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;
            
            return dateA.getTime() - dateB.getTime();
          });
        
        console.log("Filtered and sorted shows:", filteredAndSortedShows);
        setUpcomingShows(filteredAndSortedShows);
      } catch (error) {
        console.error("Failed to fetch or parse shows:", error);
        setUpcomingShows([]); // Set to empty or handle error appropriately
      }
    };

    fetchShows();
  }, []);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Head>
        <title>{comedianName} - Comedian</title>
        <meta name="description" content={`${comedianName} - ${tagline}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" type="image/png" />
        {/* Using a Google Font that fits the noir style - consider 'Roboto Slab' or 'Merriweather' */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Main container with dark noir theme */}
      <div className="min-h-screen bg-black text-white font-['Roboto_Slab',_serif] flex flex-col">

        {/* Header/Navigation with mobile menu */}
        <header className="py-4 md:py-6 px-4 md:px-8 sticky top-0 bg-black z-50 border-b border-neutral-800">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider">{comedianName}</h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#about-me" className="hover:text-neutral-300 transition-colors text-lg">About</a>
              <a href="#shows" className="hover:text-neutral-300 transition-colors text-lg">Shows</a>
              <a href="#contact" className="hover:text-neutral-300 transition-colors text-lg">Contact</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-neutral-800 pt-4">
              <div className="flex flex-col space-y-3">
                <a 
                  href="#about-me" 
                  className="hover:text-neutral-300 transition-colors text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#shows" 
                  className="hover:text-neutral-300 transition-colors text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shows
                </a>
                <a 
                  href="#contact" 
                  className="hover:text-neutral-300 transition-colors text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </nav>
          )}
        </header>

        {/* Hero Section */}
        <section
          id="hero"
          className="flex-grow flex flex-col items-center justify-center text-center pt-8 md:pt-10 pb-12 md:pb-20 px-4 relative min-h-[70vh] md:min-h-[80vh]"
        >
          <div className="absolute inset-0 z-0 opacity-20 md:opacity-30"> {/* Image container */}
            <Image
              src="/hero.png"
              alt="Thomas Endashaw"
              layout="fill"
              objectFit="cover"
              objectPosition="center 12%"
              className="pointer-events-none"
            />
          </div>
          <div className="max-w-4xl relative z-10 px-4"> {/* Content container, ensure it's above the image */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight shadow-lg text-white">
              {comedianName}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-6 md:mb-8 italic max-w-2xl mx-auto">
              {tagline}
            </p>
            <a
              href="#shows"
              className="bg-white hover:bg-neutral-200 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 inline-block"
            >
              Upcoming Shows
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about-me" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white text-center">About</h3>
            
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-stretch">
              {/* About Text */}
              <div className="w-full lg:w-2/3 flex order-2 lg:order-1">
                <div className="space-y-4 md:space-y-6 text-base md:text-lg lg:text-xl text-neutral-400 leading-relaxed text-left flex flex-col justify-center">
                  {bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* About Image */}
              <div className="w-full lg:w-1/3 flex-shrink-0 order-1 lg:order-2">
                <div className="h-64 md:h-80 lg:h-full relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src="/about.jpeg"
                    alt="Thomas Endashaw"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center top"
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clips Section - replaced with the new component */}
        <ClipsSection />

        {/* Shows Section */}
        <section id="shows" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-white">Upcoming Shows</h3>
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start">
              <div className="w-full lg:w-1/3 lg:sticky top-24">
                <div className="max-w-sm mx-auto lg:max-w-none">
                  <Image
                    src="/upcoming_shows.jpg"
                    alt="Thomas Endashaw upcoming shows"
                    layout="responsive"
                    width={2}
                    height={3}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="w-full lg:w-2/3">
                <div className="space-y-4">
                  {upcomingShows.length > 0 ? (
                    upcomingShows.map((show, index) => (
                      <div
                        key={index}
                        className="bg-neutral-900 p-4 md:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 hover:bg-neutral-800"
                      >
                        <div className="mb-3 sm:mb-0 flex-grow">
                          <p className="text-lg md:text-xl font-semibold text-white">{show.date}</p>
                          <p className="text-base md:text-lg text-neutral-300">{show.time}</p>
                          <p className="text-base md:text-lg text-neutral-300">{show.venue}</p>
                          <p className="text-sm md:text-base text-neutral-400">{show.city}</p>
                        </div>
                        <a
                          href={show.tickets}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-neutral-200 text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 w-full sm:w-auto text-center"
                        >
                          Tickets
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-500 text-base md:text-lg">
                        No shows currently scheduled. Plotting the next play...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section id="gallery" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className="overflow-hidden group transition-all duration-300 cursor-pointer rounded-lg hover:shadow-xl" 
                  onClick={() => openModal(`/${i}.png`)}
                >
                  <Image
                    src={`/${i}.png`}
                    alt={`Gallery image ${i}`}
                    layout="intrinsic"
                    width={1920}
                    height={1080}
                    className="group-hover:scale-110 transition-transform duration-300 w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">Connect with Me</h3>
            <p className="text-base md:text-lg text-neutral-400 mb-6 md:mb-8">
              Keep up with me as I continue on my journey.
            </p>
            <div className="flex justify-center items-center space-x-4 md:space-x-6">
              {/* Replace with actual social media links and icons */}
              <SocialIcon href="https://www.instagram.com/thomasendashaw/" label="Instagram">
                 {/* Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.782-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="mailto:thomasendashaw@gmail.com" label="Email">
                {/* Email Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 md:py-6 text-center bg-black border-t border-neutral-700">
          <p className="text-neutral-500 text-sm md:text-base px-4">
            &copy; {new Date().getFullYear()} {comedianName}. All rights reserved.
            Beware of imitations.
          </p>
        </footer>

        {/* Modal for Full Image View */}
        {isModalOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[100] p-4"
            onClick={closeModal}
          >
            <div 
              className="relative flex justify-center items-center max-w-[95vw] max-h-[95vh] md:max-w-[85vw] md:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Enlarged gallery image"
                width={1920}
                height={1080}
                objectFit="contain"
                className="rounded-md max-w-full max-h-full"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 md:top-4 md:right-4 text-white bg-black bg-opacity-70 p-2 md:p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Close image view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
