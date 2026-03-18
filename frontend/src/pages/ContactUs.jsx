import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
            Get in <span className="text-amber-800 font-normal">Touch</span>
          </h1>
          <p className="text-lg text-stone-500">
            Have a question? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Email Card */}
          <div className="bg-stone-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">Email Us</h3>
            <p className="text-stone-500 text-sm mb-3">We reply within 24 hours</p>
            <a href="mailto:hello@roomcraft.com" className="text-amber-800 text-sm hover:underline">
              hello@roomcraft.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-stone-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">Call Us</h3>
            <p className="text-stone-500 text-sm mb-3">Mon-Fri 9am-6pm</p>
            <a href="tel:+15551234567" className="text-amber-800 text-sm hover:underline">
              +1 (555) 123-4567
            </a>
          </div>

          {/* Visit Card */}
          <div className="bg-stone-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">Visit Us</h3>
            <p className="text-stone-500 text-sm mb-3">Seattle, Washington</p>
            <p className="text-amber-800 text-sm">123 Design District</p>
          </div>
        </div>

        {/* Form and Info */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
            <h2 className="text-2xl font-light text-stone-900 mb-6">Send a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-stone-600 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all text-stone-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-600 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all text-stone-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-600 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all text-stone-900 resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm text-center">
                    Thanks for reaching out! We'll get back to you soon.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Simple Info */}
          <div className="space-y-6">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-3">Studio hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Monday - Friday</span>
                  <span className="text-stone-900">9am - 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Saturday</span>
                  <span className="text-stone-900">10am - 4pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Sunday</span>
                  <span className="text-stone-900">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-3">Quick links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-stone-500 hover:text-amber-800 text-sm transition-colors">
                  About RoomCraft
                </Link>
                <Link to="/faq" className="block text-stone-500 hover:text-amber-800 text-sm transition-colors">
                  Frequently asked questions
                </Link>
                <Link to="/support" className="block text-stone-500 hover:text-amber-800 text-sm transition-colors">
                  Support center
                </Link>
              </div>
            </div>

            <div className="bg-amber-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-medium mb-2">Start designing today</h3>
              <p className="text-amber-100 text-sm mb-4">
                Create your first 3D room design in minutes.
              </p>
              <Link 
                to="/designer" 
                className="inline-block px-4 py-2 bg-white text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
              >
                Open Designer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer Note */}
      <div className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-stone-400 text-center">
            RoomCraft — Design your perfect space with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}