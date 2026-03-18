import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: "3D Visualization",
      description:
        "Experience your design in immersive 3D with realistic lighting and textures.",
      icon: "◈",
      bgColor: "bg-amber-50",
    },
    {
      title: "Easy Customization",
      description:
        "Personalize every detail with our intuitive design tools and controls.",
      icon: "◈",
      bgColor: "bg-stone-50",
    },
    {
      title: "Share & Collaborate",
      description:
        "Share your designs and get feedback from friends and professionals.",
      icon: "◈",
      bgColor: "bg-warm-50",
    },
  ];

  const testimonials = [
    {
      quote:
        "The most intuitive furniture design platform I've ever used. Transformed my living room completely.",
      author: "Sarah Chen",
      role: "Interior Designer",
    },
    {
      quote:
        "Incredible attention to detail. The 3D visualization feels like walking through a real showroom.",
      author: "Michael Roberts",
      role: "Homeowner",
    },
    {
      quote:
        "Finally, a tool that understands furniture design. The color palettes are perfectly curated.",
      author: "Emma Watson",
      role: "Architect",
    },
  ];

  const handleStartDesigning = () => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // User is logged in, go to designer
      navigate("/designer/new");
    } else {
      // User is not logged in, redirect to login
      navigate("/login", {
        state: {
          from: "/designer/new",
          message: "Please sign in to start designing",
        },
      });
    }
  };

  const handleViewGallery = () => {
    // Anyone can view gallery (if you have one)
    navigate("/gallery");
  };

  const handleStartFreeTrial = () => {
    navigate("/register");
  };

  const handleContactSales = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm uppercase tracking-wider text-amber-700 font-medium mb-4 block">
                Premium Furniture Design
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-stone-900 tracking-tight mb-6">
                Design Your
                <span className="block text-amber-800 font-normal">
                  Perfect Space
                </span>
              </h1>

              <p className="text-xl text-stone-600 mb-10 max-w-2xl leading-relaxed">
                Experience the future of interior design with our intuitive 3D
                room designer. Create, customize, and visualize your dream space
                with premium furniture pieces.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartDesigning}
                  className="px-8 py-4 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors duration-300 font-medium shadow-lg shadow-amber-900/20"
                >
                  Start Designing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewGallery}
                  className="px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-all duration-300 font-medium"
                >
                  View Gallery
                </motion.button>
              </div>

              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-light text-stone-900">500+</p>
                  <p className="text-sm text-stone-500">Furniture Pieces</p>
                </div>
                <div>
                  <p className="text-3xl font-light text-stone-900">50k+</p>
                  <p className="text-sm text-stone-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-light text-stone-900">15+</p>
                  <p className="text-sm text-stone-500">Design Styles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[600px] w-full bg-gradient-to-br from-amber-100 to-stone-100 rounded-2xl overflow-hidden shadow-2xl">
                {/* Decorative furniture silhouette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 relative">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-200/50 rounded-lg transform rotate-12"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-stone-300/50 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-amber-800/20 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white/90 to-transparent">
                  <p className="text-stone-800 font-medium">
                    Premium Collection 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm uppercase tracking-wider text-amber-700 font-medium mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              Designed for the Discerning
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              Experience craftsmanship and innovation in every detail
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div
                  className={`${feature.bgColor} p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300`}
                >
                  <div className="text-4xl text-amber-800 mb-6 font-light">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-warm-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm uppercase tracking-wider text-amber-700 font-medium mb-4 block">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-amber-800 text-4xl mb-4">"</div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-medium text-stone-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-900 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have created their dream
              interiors
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartFreeTrial}
                className="px-8 py-4 bg-white text-amber-900 rounded-lg hover:bg-amber-50 transition-colors duration-300 font-medium shadow-xl"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactSales}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-medium"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
