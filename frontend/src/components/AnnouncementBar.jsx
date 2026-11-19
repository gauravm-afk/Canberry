import React from 'react';

const AnnouncementBar = () => {
  const announcements = [
    'Little Taste of Tradition in Every Bite',
    'Your Everyday Dairy & Sweet Cravings, Sorted',
    'Your Everyday Dairy & Sweet Cravings, Sorted',
    'Freshness Delivered to Your Doorstep',
  ];

  return (
    <div className="bg-[#684017] text-[#FFF98D] text-xs md:text-sm py-2.5 overflow-hidden border-b border-[#54320F] select-none">
      <div className="max-w-7xl mx-auto px-4 hidden lg:flex items-center justify-between font-sans tracking-wide">
        {announcements.map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="font-medium whitespace-nowrap">{text}</span>
            {idx < announcements.length - 1 && (
              <span className="text-[#A7763E] px-2 font-bold opacity-60">|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Marquee ticker on mobile and tablet */}
      <div className="lg:hidden flex overflow-hidden whitespace-nowrap relative">
        <div className="animate-ticker flex space-x-6">
          {[...announcements, ...announcements].map((text, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <span className="font-medium text-xs tracking-wide">{text}</span>
              <span className="text-[#A7763E] opacity-60 font-bold">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
