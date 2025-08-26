'use client';

import { useState } from 'react';
import Link from "next/link"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Quadeo
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-primary-600 transition-colors">
                Activities
              </Link>
              <Link href="#categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                Categories
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Contact
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link 
                href="/auth/register?type=owner"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-200"
              >
                List Your Activity
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-700 opacity-100 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-6 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link href="/activities" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Activities
                </Link>
                <Link href="#categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Categories
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
                <Link 
                  href="/auth/register?type=owner"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-200 text-center"
                >
                  List Your Activity
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
  )
}
