import React from 'react';
import Logo from '../UI/Logo';
import heroLagos from '../../assets/hero-lagos-night.png';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-charcoal-950 text-stone-100">
      <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12 justify-center">
        <div className="mb-10">
          <Logo size="lg" />
        </div>

        <div className="max-w-md w-full mx-auto">
          <h1 className="font-display text-3xl font-bold mb-2 text-stone-50">{title}</h1>
          {subtitle && <p className="text-stone-400 mb-8">{subtitle}</p>}
          <div className="dh-tool">{children}</div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage || heroLagos})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/20" />
        <div className="relative h-full flex flex-col justify-end p-12">
          {heroContent ? (
            heroContent
          ) : (
            <>
              <p className="text-gold-400 text-[11px] tracking-[0.28em] uppercase mb-4">DirectHome</p>
              <h2 className="font-display text-4xl font-bold mb-4">{heroTitle}</h2>
              <p className="text-lg text-stone-300 max-w-md">{heroSubtitle}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
