import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  heroImage = '/images/auth-hero.jpg',
  heroTitle = 'Find Your Perfect Home',
  heroSubtitle = 'Connect directly with homeowners and find your ideal rental property without agents or middlemen.',
  heroContent,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12 justify-center">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 mb-8">{subtitle}</p>}
          
          {children}
        </div>
      </div>
      
      {/* Right side - Hero Image */}
      <div className="hidden md:block w-1/2 bg-blue-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center p-12 text-white">
          {heroContent ? (
            heroContent
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">{heroTitle}</h2>
              <p className="text-xl">{heroSubtitle}</p>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg">No middlemen or agents</p>
                </div>
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg">Direct communication with owners</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg">Verified properties and users</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;