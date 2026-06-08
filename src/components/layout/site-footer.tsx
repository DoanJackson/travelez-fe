import Link from "next/link"
import { Facebook, Youtube, Twitter, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left: Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/help"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right: Social Icons and Copyright */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-600">
              TravelEZ © 2026. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

