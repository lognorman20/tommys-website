// Filename: pages/index.js
// This is the main page for your Next.js application.
// Ensure you have Next.js and Tailwind CSS setup in your project.

import Head from 'next/head';
import Image from 'next/image'; // Import Next.js Image component

// You can replace these with actual Font Awesome icons or SVGs if you prefer
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
  // Placeholder data - replace with actual comedian info
  const comedianName = "Thomas Endashaw";
  const tagline = "Finding the humor in the darkness.";
  const bio = `Meet ${comedianName}, a senior at USC studying business, who's
  never far from a snack and somehow always manages to be both well-fed and
  hungry. Born and raised in Seattle, he brought his appetite to LA's comedy
  scene, where he now serves jokes—and devours post-show street tacos—as the
  youngest door guy at the Comedy Store. A follower of Jesus Christ, Thomas
  blends his faith with humor the same way he mixes cuisines: daily and in
  large portions. Mid-punchline, he's probably thinking about his next
  meal, and his friends know that any hangout with him requires at least a 50 piece box of wings.
  If laughter is the best medicine, Thomas proves it works better with fries on
  the side.`;

  const upcomingShows = [
    { date: "May 31, 2025", venue: "Gumbo Gulch", city: "Los Angeles", tickets: "#" },
    { date: "November 15, 2025", venue: "Lasagna Landing", city: "New York City", tickets: "#" },
    { date: "December 5, 2025", venue: "Burger Basin", city: "Seattle", tickets: "#" },
  ];

  return (
    <>
      <Head>
        <title>{comedianName} - Comedian</title>
        <meta name="description" content={`${comedianName} - ${tagline}`} />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure to have a favicon */}
        {/* Using a Google Font that fits the noir style - consider 'Roboto Slab' or 'Merriweather' */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Main container with dark noir theme */}
      <div className="min-h-screen bg-black text-white font-['Roboto_Slab',_serif] flex flex-col">

        {/* Header/Navigation (optional, can be simple) */}
        <header className="py-6 px-4 md:px-8 shadow-md shadow-neutral-700 sticky top-0 bg-black bg-opacity-80 backdrop-blur-md z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider">{comedianName}</h1>
            <nav className="space-x-4">
              <a href="#about" className="hover:text-neutral-300 transition-colors">About</a>
              <a href="#shows" className="hover:text-neutral-300 transition-colors">Shows</a>
              <a href="#contact" className="hover:text-neutral-300 transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section
          id="hero"
          className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4 relative"
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
        <section id="about-me" className="py-16 md:py-24 bg-black px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">About Me</h3>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              {bio}
            </p>
          </div>
        </section>

        {/* Shows Section */}
        <section id="shows" className="py-16 md:py-24 bg-black px-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Catch Me If You Can</h3>
            <div className="space-y-8">
              {upcomingShows.length > 0 ? (
                upcomingShows.map((show, index) => (
                  <div
                    key={index}
                    className="bg-neutral-900 p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center transition-all duration-300 hover:shadow-neutral-600/50 hover:scale-[1.02]"
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
                  No shows currently scheduled. Plotting the next caper...
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section id="gallery" className="py-16 md:py-24 bg-neutral-900 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-white">Photo Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Placeholder for gallery images - replace with actual images */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="overflow-hidden group transition-all duration-300">
                  <Image
                    src={`/${i}.png`}
                    alt={`Gallery image ${i}`}
                    layout="intrinsic"
                    width={1920} // Representative large width for aspect ratio hint
                    height={1080} // Representative large height for aspect ratio hint
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
        <section id="contact" className="py-16 md:py-24 bg-black px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">Connect in the Dark</h3>
            <p className="text-lg text-neutral-400 mb-8">
              Follow my descent into madness or book me for your next clandestine event.
            </p>
            <div className="flex justify-center items-center space-x-6 text-3xl">
              {/* Replace with actual social media links and icons */}
              <SocialIcon href="https://twitter.com/yourcomedian" label="Twitter">
                {/* Placeholder for Twitter Icon (e.g., SVG or Font Awesome) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.42.718-.665 1.554-.665 2.446 0 1.568.803 2.949 1.954 3.713-.748-.023-1.424-.229-2.023-.558v.054c0 2.185 1.555 4.007 3.588 4.422-.375.101-.768.155-1.175.155-.282 0-.553-.028-.819-.077.578 1.793 2.259 3.099 4.243 3.135-1.543 1.209-3.49 1.929-5.605 1.929-.365 0-.725-.021-1.079-.063 1.991 1.279 4.357 2.023 6.897 2.023 8.277 0 12.79-6.859 12.79-12.79l-.008-.583c.881-.633 1.641-1.426 2.243-2.327z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com/yourcomedian" label="Instagram">
                 {/* Placeholder for Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.782-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </SocialIcon>
              <SocialIcon href="mailto:contact@yourcomedian.com" label="Email">
                {/* Placeholder for Email Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center bg-black border-t border-neutral-700">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} {comedianName}. All rights reserved.
            Beware of imitations.
          </p>
        </footer>

      </div>
    </>
  );
}
