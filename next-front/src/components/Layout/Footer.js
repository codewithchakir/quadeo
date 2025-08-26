import Link from "next/link"
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold text-primary-400 mb-4">Quadeo</h3>
              <p className="text-gray-400">
                Connecting adventure seekers with the best activity providers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/activities" className="text-gray-400 hover:text-white transition-colors">Activities</Link></li>
                <li><Link href="#categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@quadeo.com</li>
                <li>+212 6 12 34 56 78</li>
                <li>Marrakech, Morocco</li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  {/* Icon would go here */}
                  FB
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  IG
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  TW
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Quadeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
