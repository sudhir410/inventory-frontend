import React from 'react';

const HardwareBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-medium"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow-reverse"></div>

      {/* Hardware Icons - Scattered across the screen */}
      
      {/* Top Section */}
      {/* Screw 1 */}
      <div className="absolute top-20 left-20 opacity-5 animate-float-slow" style={{ animationDelay: '0s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600">
          <circle cx="12" cy="12" r="8" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="16" strokeWidth="1.5"/>
          <line x1="8" y1="12" x2="16" y2="12" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Gear 1 - Spinning */}
      <div className="absolute top-32 right-32 opacity-5 animate-spin-gear" style={{ animationDelay: '0s' }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-400">
          <circle cx="12" cy="12" r="3" strokeWidth="1"/>
          <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12" strokeWidth="1"/>
          <circle cx="12" cy="12" r="7" strokeWidth="1"/>
        </svg>
      </div>

      {/* Bolt 1 - Wiggling */}
      <div className="absolute top-40 left-1/3 opacity-6 animate-wiggle-bolt" style={{ animationDelay: '0s' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-400">
          <path d="M12 2L8 8h8l-4 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="14" width="6" height="8" rx="1" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Middle Section */}
      {/* Wrench 1 - Swinging */}
      <div className="absolute top-1/2 left-10 opacity-5 animate-swing-wrench" style={{ animationDelay: '0s' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Nut 1 - Bouncing */}
      <div className="absolute top-1/3 left-1/2 opacity-5 animate-nut-bounce" style={{ animationDelay: '0s' }}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Hammer 1 - Swinging */}
      <div className="absolute top-2/3 right-20 opacity-4 animate-hammer-swing" style={{ animationDelay: '0s' }}>
        <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-500">
          <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3L12 9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.64 6.36a2.83 2.83 0 0 0-4 0l-.87.87 4 4 .87-.87a2.83 2.83 0 0 0 0-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Bottom Section */}
      {/* Screw 2 - Tightening */}
      <div className="absolute bottom-40 right-1/4 opacity-6 animate-screw-tighten" style={{ animationDelay: '1s' }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600">
          <circle cx="12" cy="12" r="8" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="16" strokeWidth="1.5"/>
          <line x1="8" y1="12" x2="16" y2="12" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Gear 2 - Spinning Reverse */}
      <div className="absolute bottom-20 left-1/4 opacity-5 animate-spin-gear-reverse" style={{ animationDelay: '0s' }}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-300">
          <circle cx="12" cy="12" r="3" strokeWidth="1"/>
          <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12" strokeWidth="1"/>
          <circle cx="12" cy="12" r="7" strokeWidth="1"/>
        </svg>
      </div>

      {/* Bolt 2 */}
      <div className="absolute bottom-1/3 right-1/3 opacity-5 animate-float-slow-reverse" style={{ animationDelay: '2s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
          <path d="M12 2L8 8h8l-4 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="14" width="6" height="8" rx="1" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Right Side */}
      {/* Wrench 2 */}
      <div className="absolute top-1/4 right-10 opacity-4 animate-float-fast" style={{ animationDelay: '4s' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Drill bit - Drilling */}
      <div className="absolute top-1/2 right-1/4 opacity-5 animate-drill-spin" style={{ animationDelay: '0s' }}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-400">
          <rect x="3" y="8" width="18" height="8" rx="1" strokeWidth="1.5"/>
          <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1"/>
          <line x1="8" y1="8" x2="8" y2="16" strokeWidth="1"/>
          <line x1="13" y1="8" x2="13" y2="16" strokeWidth="1"/>
          <line x1="18" y1="8" x2="18" y2="16" strokeWidth="1"/>
        </svg>
      </div>

      {/* Left Side */}
      {/* Nut 2 - Bouncing */}
      <div className="absolute bottom-1/2 left-16 opacity-6 animate-nut-bounce" style={{ animationDelay: '2s' }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-400">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Ruler */}
      <div className="absolute top-3/4 left-1/3 opacity-4 animate-float-fast" style={{ animationDelay: '3s' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
          <rect x="3" y="8" width="18" height="8" rx="1" strokeWidth="1.5"/>
          <line x1="6" y1="8" x2="6" y2="11" strokeWidth="1"/>
          <line x1="9" y1="8" x2="9" y2="11" strokeWidth="1"/>
          <line x1="12" y1="8" x2="12" y2="11" strokeWidth="1"/>
          <line x1="15" y1="8" x2="15" y2="11" strokeWidth="1"/>
          <line x1="18" y1="8" x2="18" y2="11" strokeWidth="1"/>
        </svg>
      </div>

      {/* Additional Hardware Items with Loading Animations */}
      
      {/* Fan 1 - Spinning */}
      <div className="absolute top-20 left-1/2 opacity-4 animate-fan-spin" style={{ animationDelay: '0s' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-500">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M12 2C12 2 14 6 12 10C10 6 12 2 12 2Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M22 12C22 12 18 14 14 12C18 10 22 12 22 12Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M12 22C12 22 10 18 12 14C14 18 12 22 12 22Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M2 12C2 12 6 10 10 12C6 14 2 12 2 12Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
        </svg>
      </div>

      {/* Paint Box 1 - Dripping */}
      <div className="absolute top-1/4 right-1/3 opacity-5 animate-paint-drip" style={{ animationDelay: '0.5s' }}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-400">
          <rect x="4" y="6" width="16" height="14" rx="2" strokeWidth="1.5"/>
          <line x1="4" y1="10" x2="20" y2="10" strokeWidth="1.5"/>
          <rect x="10" y="2" width="4" height="4" rx="1" strokeWidth="1.5"/>
          <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="14" r="1.5" fill="currentColor"/>
          <line x1="12" y1="20" x2="12" y2="22" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Paint Brush 1 - Painting */}
      <div className="absolute bottom-1/3 left-1/4 opacity-5 animate-paintbrush-stroke" style={{ animationDelay: '1s' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-400">
          <path d="M3 20l4-4m0 0l14-14 4 4-14 14-4-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 16l-3 3" strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="14" y="2" width="6" height="3" rx="1" strokeWidth="1"/>
        </svg>
      </div>

      {/* Fan 2 - Spinning Reverse */}
      <div className="absolute bottom-1/4 right-1/5 opacity-4 animate-fan-spin" style={{ animationDelay: '2s' }}>
        <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M12 2C12 2 14 6 12 10C10 6 12 2 12 2Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M22 12C22 12 18 14 14 12C18 10 22 12 22 12Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M12 22C12 22 10 18 12 14C14 18 12 22 12 22Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
          <path d="M2 12C2 12 6 10 10 12C6 14 2 12 2 12Z" strokeWidth="1" fill="currentColor" opacity="0.6"/>
        </svg>
      </div>

      {/* Paint Can - Dripping */}
      <div className="absolute top-1/2 left-1/4 opacity-5 animate-paint-drip" style={{ animationDelay: '1.5s' }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
          <path d="M6 8h12v12H6V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 8c0-1.5 1-3 3-3h6c2 0 3 1.5 3 3" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9" y1="8" x2="9" y2="5" strokeWidth="1.5"/>
          <line x1="15" y1="8" x2="15" y2="5" strokeWidth="1.5"/>
          <line x1="12" y1="20" x2="12" y2="22" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Small screws with new animations */}
      <div className="absolute top-1/4 left-3/4 opacity-6 animate-screw-tighten" style={{ animationDelay: '2s' }}>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
          <circle cx="12" cy="12" r="6" strokeWidth="1.5"/>
          <line x1="12" y1="9" x2="12" y2="15" strokeWidth="1.5"/>
          <line x1="9" y1="12" x2="15" y2="12" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Toolbox */}
      <div className="absolute bottom-1/3 right-1/4 opacity-4 animate-float-slow" style={{ animationDelay: '3s' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600">
          <rect x="3" y="10" width="18" height="8" rx="1" strokeWidth="1.5"/>
          <path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" strokeWidth="1.5"/>
          <line x1="3" y1="14" x2="21" y2="14" strokeWidth="1"/>
          <rect x="8" y="12" width="3" height="2" rx="0.5" strokeWidth="1"/>
          <rect x="13" y="12" width="3" height="2" rx="0.5" strokeWidth="1"/>
        </svg>
      </div>

      {/* Measuring Tape */}
      <div className="absolute top-3/4 right-1/3 opacity-5 animate-float-medium" style={{ animationDelay: '2.5s' }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-yellow-500">
          <circle cx="12" cy="12" r="8" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="2" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-waves opacity-30"></div>
      
      {/* Gradient overlay to ensure content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/60"></div>
    </div>
  );
};

export default HardwareBackground;

