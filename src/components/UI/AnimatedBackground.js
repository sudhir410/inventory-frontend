import React from 'react';

const AnimatedBackground = ({ variant = 'login', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'register':
        return {
          primaryOpacity: 'opacity-35',
          secondaryOpacity: 'opacity-25',
          particleOpacity: 'opacity-40'
        };
      default:
        return {
          primaryOpacity: 'opacity-40',
          secondaryOpacity: 'opacity-30',
          particleOpacity: 'opacity-35'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large floating geometric shapes with glow effects */}
      <div className={`absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full ${styles.primaryOpacity} animate-float-slow glow-primary`}></div>
      <div className={`absolute top-1/4 -left-20 w-60 h-60 bg-gradient-to-tr from-blue-200 to-purple-200 ${styles.secondaryOpacity} animate-float-medium glow-blue`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-bl from-green-200 to-blue-200 ${styles.secondaryOpacity} animate-float-fast glow-primary`}></div>
      <div className={`absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 ${styles.secondaryOpacity} animate-float-slow-reverse glow-purple`}></div>

      {/* Medium floating shapes with subtle glow */}
      <div className={`absolute top-1/6 right-1/6 w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 ${styles.secondaryOpacity} animate-float-medium glow-primary`}></div>
      <div className={`absolute bottom-1/6 left-1/6 w-28 h-28 bg-gradient-to-tr from-teal-200 to-cyan-200 ${styles.secondaryOpacity} animate-float-slow glow-blue`}></div>

      {/* Small decorative elements with glow */}
      <div className={`absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-bl from-indigo-200 to-purple-200 ${styles.secondaryOpacity} animate-float-fast glow-purple`}></div>
      <div className={`absolute bottom-1/3 left-1/2 w-12 h-12 bg-gradient-to-r from-rose-200 to-pink-200 ${styles.secondaryOpacity} animate-float-medium glow-primary`}></div>

      {/* Animated grid pattern with subtle dots */}
      <div className="absolute inset-0 opacity-4">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Mesh background effect */}
      <div className="absolute inset-0 bg-mesh opacity-20"></div>

      {/* Wave pattern */}
      <div className="absolute inset-0 bg-waves opacity-10"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-white/15 to-blue-50/25"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-purple-50/15 via-transparent to-cyan-50/20"></div>

      {/* Animated particles with different sizes */}
      <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full ${styles.particleOpacity} animate-particle-1`}></div>
      <div className={`absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full ${styles.particleOpacity} animate-particle-2`}></div>
      <div className={`absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full ${styles.particleOpacity} animate-particle-3`}></div>
      <div className={`absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full ${styles.particleOpacity} animate-particle-1`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute top-1/6 right-1/2 w-0.5 h-0.5 bg-yellow-400 rounded-full ${styles.particleOpacity} animate-particle-2`} style={{ animationDelay: '4s' }}></div>

      {/* Additional floating elements */}
      <div className="absolute top-2/3 right-1/5 w-20 h-20 border-2 border-primary-200 rounded-lg opacity-8 animate-float-medium" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-2/3 left-1/5 w-18 h-18 border-2 border-blue-200 rounded-lg opacity-6 animate-float-slow-reverse" style={{ animationDelay: '1s' }}></div>

      {/* Hexagon shapes */}
      <div className="absolute top-1/5 left-1/5 w-14 h-14 bg-gradient-to-br from-emerald-200 to-teal-200 opacity-7 animate-float-fast" style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        animationDelay: '5s'
      }}></div>

      <div className="absolute bottom-1/5 right-1/5 w-16 h-16 bg-gradient-to-tr from-violet-200 to-purple-200 opacity-5 animate-float-slow" style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        animationDelay: '2s'
      }}></div>
    </div>
  );
};

export default AnimatedBackground;
