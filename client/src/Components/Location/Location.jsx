import React from 'react';

const Location = () => {
  const MapMarkerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );

  const DirectionsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39 .39-.39 1.02 0 1.41l9 9c.39 .39 1.02 .39 1.41 0l9-9c.39-.38 .39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      
      {/* Amber Heading */}
      <h1 className="text-lg  font-semibold text-white text-center bg-amber-500 py-2 ">
        Location
      </h1>

      <div className="relative h-96 border-t border-gray-200">
        {/* Google Map */}
        <iframe
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.080153308218!2d89.20322997508822!3d23.09312677912442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff1150d38b4f3f%3A0xb58c9bb9b0e46a3f!2sJashore%20City%20College!5e0!3m2!1sen!2sbd!4v1723212345678"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          title="Jashore City College Map"
        ></iframe>

        {/* Location Info Box */}
        <div className="absolute top-3 left-3 bg-white/90 rounded-lg p-3 shadow max-w-xs">
          <div className="flex items-center">
            <div className="text-red-500 mr-2"><MapMarkerIcon /></div>
            <div>
              <h3 className="m-0 text-sm font-bold text-gray-800">
                Jashore City College
              </h3>
              <p className="m-0 text-xs text-gray-600">
                Jashore Sadar, Jashore, Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Directions Button */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <a
            href="https://www.google.com/maps/dir//Jashore+City+College"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <DirectionsIcon className="mr-2" /> Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default Location;
