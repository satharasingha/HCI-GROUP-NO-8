import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  const teamMembers = [
    {
      name: "Alexander Chen",
      role: "Founder & Creative Director",
      bio: "20+ years in furniture design, passionate about creating spaces that inspire.",
      image: "AC",
      expertise: ["Interior Architecture", "Sustainable Design"]
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Design",
      bio: "Award-winning designer with a keen eye for blending traditional and modern aesthetics.",
      image: "MR",
      expertise: ["Furniture Design", "Color Theory"]
    },
    {
      name: "James Whitmore",
      role: "Technical Director",
      bio: "Pioneer in 3D visualization technology, making design accessible to everyone.",
      image: "JW",
      expertise: ["3D Modeling", "AR/VR Integration"]
    },
    {
      name: "Sophie Anderson",
      role: "Customer Experience Lead",
      bio: "Dedicated to making every client's design journey seamless and enjoyable.",
      image: "SA",
      expertise: ["Client Relations", "Project Management"]
    }
  ];

  const values = [
    {
      title: "Craftsmanship",
      description: "Every design reflects our commitment to quality and attention to detail.",
      icon: "⚒️"
    },
    {
      title: "Innovation",
      description: "Blending traditional techniques with cutting-edge technology.",
      icon: "💡"
    },
    {
      title: "Sustainability",
      description: "Eco-conscious materials and practices for a better tomorrow.",
      icon: "🌱"
    },
    {
      title: "Personalization",
      description: "Your space should be as unique as you are.",
      icon: "✨"
    }
  ];

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "50k+", label: "Happy Clients" },
    { value: "500+", label: "Design Awards" },
    { value: "100+", label: "Expert Designers" }
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-sm uppercase tracking-wider text-amber-700 font-medium mb-4 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-light text-stone-900 tracking-tight mb-6">
              Crafting Spaces That
              <span className="block text-amber-800 font-normal">Tell Your Story</span>
            </h1>
            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              Since 2010, Concept Store has been at the forefront of furniture design innovation, 
              helping thousands transform their houses into homes they love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-light text-amber-800 mb-2">{stat.value}</p>
                <p className="text-sm text-stone-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm uppercase tracking-wider text-amber-700 font-medium mb-4 block">
                    Our Journey
                  </span>
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
                From Vision to Reality
              </h2>
              <div className="space-y-4 text-stone-600">
                <p className="leading-relaxed">
                  What started as a small showroom in downtown Seattle has grown into a global 
                  platform for furniture design enthusiasts. Our journey has been shaped by a 
                  simple belief: great design should be accessible to everyone.
                </p>
                <p className="leading-relaxed">
                  Today, we combine decades of craftsmanship expertise with cutting-edge 3D 
                  technology to give you unprecedented control over your living spaces. Every 
                  piece in our collection is curated with care, ensuring quality and style 
                  that stands the test of time.
                </p>
                <p className="leading-relaxed">
                  We don't just sell furniture – we help you create environments where memories 
                  are made, conversations flow, and life happens beautifully.
                </p>
              </div>
              
              <div className="mt-8 flex gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-800 font-medium text-sm">
                      {teamMembers[i-1].image}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-stone-500">
                  <span className="font-medium text-stone-900">50+ experts</span> ready to help
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[500px] w-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-200/50 rounded-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-96 bg-gradient-to-br from-amber-100 to-stone-100 rounded-3xl shadow-2xl flex items-center justify-center">
                  <span className="text-8xl opacity-30">🪑</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              Principles that guide every design decision we make
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-3">{value.title}</h3>
                <p className="text-stone-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet The Team
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              The Minds Behind the Magic
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              Passionate experts dedicated to bringing your vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-amber-100 to-stone-100 rounded-2xl p-8 mb-4 text-center group-hover:shadow-xl transition-shadow duration-300">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-700 to-stone-700 rounded-full flex items-center justify-center text-white text-3xl font-light mb-4">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 mb-1">{member.name}</h3>
                  <p className="text-amber-700 text-sm mb-3">{member.role}</p>
                  <p className="text-stone-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((exp, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-stone-600">
                        {exp}
                      </span>
                    ))}
                  </div>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
              Let's create something beautiful together. Our team is here to bring your vision to life.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-amber-900 rounded-lg hover:bg-amber-50 transition-colors duration-300 font-medium shadow-xl"
              >
                Get in Touch
              </Link>
              <Link
                to="/designer"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-medium"
              >
                Start Designing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}