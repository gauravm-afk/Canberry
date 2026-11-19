import React from 'react';
import { imageConfig } from '../config/imageConfig';

const Footer = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white pt-16 pb-12 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3 Column Grid matching Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12">
          
          {/* Column 1: Logo, Policies & Socials */}
          <div className="md:col-span-4 flex flex-col space-y-6">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={imageConfig.logo.src}
                alt={imageConfig.logo.alt}
                className="h-16 w-auto object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-[#444444] font-sans">
              <a href="#privacy" className="hover:text-[#684017] transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-[#684017] transition-colors">
                Terms of use
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 pt-1 text-stone-700">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#684017] hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#684017] hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#684017] hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.37 9.74V10.13H5.09v8.37h2.74z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Products Links */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h4 className="font-serif font-semibold text-lg text-[#222222]">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-stone-600">
              <li>
                <button
                  onClick={() => scrollToSection('bestsellers')}
                  className="hover:text-[#684017] transition-colors"
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('ice-cream-desserts')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Ice Cream's
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('bestsellers')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Dairy Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('traditional-sweets')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Traditional Sweet's
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('bestsellers')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Pantry Favourites
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('bestsellers')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Refreshing Beverages
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('ice-cream-desserts')}
                  className="hover:text-[#684017] transition-colors"
                >
                  Dessert's
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us info */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h4 className="font-serif font-semibold text-lg text-[#222222]">
              Contact us
            </h4>
            <div className="space-y-3 text-sm font-sans text-stone-600">
              <p>
                <a href="mailto:example@teamwebflow.com" className="hover:text-[#684017] transition-colors">
                  example@teamwebflow.com
                </a>
              </p>
              <p className="leading-relaxed">
                4074 Ebert Summit Suite 375<br />
                Lake Leonardchester
              </p>
              <p>
                <a href="tel:+441236547890" className="hover:text-[#684017] transition-colors">
                  +44 123 654 7890
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright note */}
        <div className="pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 font-sans">
          <p>© {new Date().getFullYear()} Canberry Dairy Farm. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Farm-fresh daily perfection, from our pastures to your family.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
