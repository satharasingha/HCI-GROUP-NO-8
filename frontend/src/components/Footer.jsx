import React from "react";
import { 
  Instagram, 
  Mail, 
  Twitter, 
  Facebook
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="RoomCraft" 
                className="w-8 h-8 object-contain"
              />
              <h2 className="text-xl font-light text-stone-900">
                Room<span className="text-amber-800 font-normal">Craft</span>
              </h2>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Design your perfect space with confidence using our intuitive 3D furniture designer.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "3D Engine", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4">Company</h3>
            <ul className="space-y-2">
              {["About Us", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4">Connect</h3>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-9 h-9 bg-stone-100 hover:bg-amber-100 rounded-lg flex items-center justify-center text-stone-600 hover:text-amber-700 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-stone-100 hover:bg-amber-100 rounded-lg flex items-center justify-center text-stone-600 hover:text-amber-700 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-stone-100 hover:bg-amber-100 rounded-lg flex items-center justify-center text-stone-600 hover:text-amber-700 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-stone-100 hover:bg-amber-100 rounded-lg flex items-center justify-center text-stone-600 hover:text-amber-700 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Simple Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-stone-500 mb-2">Stay updated with new features</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
                <button className="px-3 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">
              © {currentYear} RoomCraft. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-xs text-stone-400">
              <a href="#" className="hover:text-amber-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-amber-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-amber-700 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}