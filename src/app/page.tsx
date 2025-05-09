"use client";

import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import React from 'react';
import ClipsSection from '../components/ClipsSection';

const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neutral-300 hover:text-white transition-colors duration-300 mx-2"
  >
    {children}
  </a>
);

export default function HomePage() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [upcomingShows, setUpcomingShows] = React.useState<Array<{ date: string; venue: string; city: string; tickets: string }>>([]);

  const comedianName = "Thomas Endashaw";
  const tagline = "Finding the humor in the darkness.";
  const bio = `Meet ${comedianName.split(' ')[0]}, a senior at the University of Southern California majoring in Business of Cinematic Arts, who's
  never far from a snack and somehow always manages to be both well-fed and
  hungry. Born and raised in Seattle, he brought his appetite to LA's comedy
  scene, where he now serves jokes—and devours post-show street tacos—as the
  youngest door guy at the Comedy Store. A follower of Jesus Christ, Thomas
  blends his faith with humor the same way he mixes cuisines: daily and in
  large portions. Mid-punchline, he's probably thinking about his next
  meal, and his friends know that any hangout with him requires at least a 50 piece box of wings.
  If laughter is the best medicine, Thomas proves it works better with fries on
  the side.`;

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
        const headers = lines[0].split(',').map(h => h.trim());
        console.log("CSV Headers:", headers);

        const showsData = lines.slice(1).map(line => {
          const parts = line.split(',');
          // Explicitly define the type for showEntry to match upcomingShows state
          const showEntry: { date: string; venue: string; city: string; tickets: string } = {
            date: '',
            venue: '',
            city: '',
            tickets: ''
          };

          if (headers.length === 4) { // Proceed only if we have the 4 expected headers
            if (parts.length === 5) { 
              // Assumes 5 parts means the 'date' field (headers[0]) had a comma
              // e.g., "May 31, 2025" became "May 31" and " 2025"
              showEntry.date = (parts[0] + ',' + parts[1]).trim().replace(/^"|"$/g, '');
              showEntry.venue = parts[2]?.trim().replace(/^"|"$/g, '') ?? '';
              showEntry.city = parts[3]?.trim().replace(/^"|"$/g, '') ?? '';
              showEntry.tickets = parts[4]?.trim().replace(/^"|"$/g, '') ?? '';
            } else if (parts.length === 4) {
              // Assumes 4 parts means a standard row, date has no comma
              showEntry.date = parts[0]?.trim().replace(/^"|"$/g, '') ?? '';
              showEntry.venue = parts[1]?.trim().replace(/^"|"$/g, '') ?? '';
              showEntry.city = parts[2]?.trim().replace(/^"|"$/g, '') ?? '';
              showEntry.tickets = parts[3]?.trim().replace(/^"|"$/g, '') ?? '';
            } else {
              // Unexpected number of parts for a line
              console.warn(`Skipping CSV line with unexpected structure: "${line}". Expected 4 or 5 parts, got ${parts.length}.`);
              return null; // Mark for filtering
            }
          } else {
            console.warn(`CSV does not have the expected 4 headers. Found: ${headers.join(', ')}`);
            return null; // Mark for filtering
          }
          return showEntry;
        }).filter((show): show is { date: string; venue: string; city: string; tickets: string } => show !== null && (!!show.date || !!show.venue || !!show.city)); 

        console.log("Parsed shows data:", showsData);
        setUpcomingShows(showsData);
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

  return (
    <>
      <Head>
        <title>{comedianName} - Comedian</title>
        <meta name="description" content={`${comedianName} - ${tagline}`} />
        <link rel="icon" href="/logo.png" type="image/png" />
        {/* Using a Google Font that fits the noir style - consider 'Roboto Slab' or 'Merriweather' */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Main container with dark noir theme */}
      <div className="min-h-screen bg-black text-white font-['Roboto_Slab',_serif] flex flex-col">

        {/* Header/Navigation (optional, can be simple) */}
        <header className="py-6 px-4 md:px-8 sticky top-0 bg-black z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider">{comedianName}</h1>
            <nav className="space-x-4">
              <a href="#about-me" className="hover:text-neutral-300 transition-colors">About</a>
              <a href="#shows" className="hover:text-neutral-300 transition-colors">Shows</a>
              <a href="#contact" className="hover:text-neutral-300 transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section
          id="hero"
          className="flex-grow flex flex-col items-center justify-center text-center pt-10 pb-20 px-4 relative"
          style={{
            // Optional: Add a very subtle noise texture or a desaturated city skyline for a more noir feel
            // backgroundImage: "url('/path-to-subtle-noise-texture.png')",
          }}
        >
          <div className="absolute inset-0 z-0 opacity-30"> {/* Image container */}
            <Image
              src="/hero.png" // Placeholder image path
              alt="Thomas Endashaw"
              layout="fill"
              objectFit="cover"
              objectPosition="center 12%"
              className="pointer-events-none" // Prevents image from interfering with text selection
            />
          </div>
          <div className="max-w-3xl relative z-10"> {/* Content container, ensure it's above the image */}
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight shadow-lg text-white">
              {comedianName}
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 italic">
              {tagline}
            </p>
            <a
              href="#shows"
              className="bg-white hover:bg-neutral-200 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Upcoming Shows
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about-me" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">About Me</h3>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              {bio}
            </p>
          </div>
        </section>

        {/* Clips Section - replaced with the new component */}
        <ClipsSection />

        {/* Shows Section */}
        <section id="shows" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Catch Me If You Can</h3>
            <div className="space-y-4">
              {upcomingShows.length > 0 ? (
                upcomingShows.map((show, index) => (
                  <div
                    key={index}
                    className="bg-black p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center transition-all duration-300"
                  >
                    <div>
                      <p className="text-xl font-semibold text-white">{show.date}</p>
                      <p className="text-lg text-neutral-300">{show.venue}</p>
                      <p className="text-md text-neutral-400">{show.city}</p>
                    </div>
                    <a
                      href={show.tickets}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 bg-white hover:bg-neutral-200 text-black font-bold py-2 px-6 rounded-md transition-colors duration-300 shadow-sm hover:shadow-md"
                    >
                      Tickets
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutral-500 text-lg">
                  No shows currently scheduled. Plotting the next play...
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section id="gallery" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="overflow-hidden group transition-all duration-300 cursor-pointer" onClick={() => openModal(`/${i}.png`)}>
                  <Image
                    src={`/${i}.png`}
                    alt={`Gallery image ${i}`}
                    layout="intrinsic"
                    width={1920}
                    height={1080}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <p className="text-neutral-400 mt-8 text-lg">
              More snapshots from the abyss coming soon...
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-12 bg-black px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Connect with Me</h3>
            <p className="text-lg text-neutral-400 mb-4">
              Keep up with me as I continue on 600 pound journey.
            </p>
            <div className="flex justify-center items-center space-x-6 text-3xl">
              {/* Replace with actual social media links and icons */}
              <SocialIcon href="https://www.instagram.com/thomasendashaw/" label="Instagram">
                 {/* Placeholder for Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.782-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </SocialIcon>
              <SocialIcon href="mailto:thomasendashaw@gmail.com" label="Email">
                {/* Placeholder for Email Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 text-center bg-black border-t border-neutral-700">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} {comedianName}. All rights reserved.
            Beware of imitations.
          </p>
        </footer>

        {/* Modal for Full Image View */}
        {isModalOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100]"
            onClick={closeModal}
          >
            <div 
              className="relative flex justify-center items-center max-w-[80vw] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Enlarged gallery image"
                width={1920}
                height={1080}
                objectFit="contain"
                className="rounded-md"
              />
              <button
                onClick={closeModal}
                className="absolute top-1 right-1 md:top-2 md:right-2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none"
                aria-label="Close image view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
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
