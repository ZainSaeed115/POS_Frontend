import React from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  // Blue color palette
  const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-white'];
  
  // Abstract pattern that works with blue theme
  const abstractPattern = [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 3, 3, 2, 1],
    [1, 2, 3, 0, 3, 2, 1],
    [1, 2, 3, 3, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 1, 1, 1, 1, 1, 0]
  ];

  return (
    <div className='lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8 md:p-12 relative overflow-hidden'>
      {/* Floating animated elements */}
      <div className='absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-100 opacity-30 animate-pulse'></div>
      <div className='absolute bottom-10 left-0 w-32 h-32 rounded-full bg-blue-200 opacity-20 animate-ping'></div>
      
      <div className='max-w-md text-center relative z-10'>
        {/* Abstract pattern grid */}
        <div className='grid grid-cols-7 gap-1 mb-8 mx-auto w-48'>
          {abstractPattern.flat().map((colorIndex, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm ${colors[colorIndex]} ${
                colorIndex === 3 ? 'animate-pulse' : ''
              } transition-all duration-300 hover:scale-110`}
            />
          ))}
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-blue-700">{title}</h2>
        <p className="text-gray-600 text-lg mb-6">{subtitle}</p>
        
        {/* Animated POS elements */}
        <div className='flex justify-center space-x-4 mt-6'>
          <div className='animate-bounce'>
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div className='animate-bounce' style={{ animationDelay: '0.2s' }}>
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div className='animate-bounce' style={{ animationDelay: '0.4s' }}>
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;