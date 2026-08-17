import React from 'react';
import Logo from '../UI/Logo';
import courtyard from '../../assets/hero-courtyard-day.png';

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
  heroImage,
  heroTitle = 'Plan with real numbers.',
  heroSubtitle = 'Construction and rent tools for Nigeria — then a marketplace with no agents.',
  heroContent,
}) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,28rem)_1fr] xl:grid-cols-[minmax(0,34rem)_1fr] bg-paper-100 text-ink-950">
      <div className="relative flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
        <div className="paper-grain" />
        <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2 text-ink-950">{title}</h1>
          {subtitle && <p className="text-ink-600 mb-8">{subtitle}</p>}
          <div className="dh-tool">{children}</div>
        </div>
      </div>

      <div className="relative hidden md:block min-h-[40vh] lg:min-h-screen overflow-hidden">
        <img
          src={heroImage || courtyard}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-paper-100/95 border-t border-paper-200 px-6 py-6 lg:px-10 lg:py-8">
          {heroContent ? (
            heroContent
          ) : (
            <>
              <p className="text-courtyard-700 text-[11px] tracking-[0.28em] uppercase mb-2">DirectHome</p>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-2 text-ink-950">{heroTitle}</h2>
              <p className="text-ink-600 max-w-lg">{heroSubtitle}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
