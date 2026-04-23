"use client"


import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Sprout, Leaf, BrainCircuit, Users, Camera, MessageCircle, CloudSun, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  const features = [
    {
      icon: Camera,
      title: "Disease Detection",
      description: "Upload plant images for instant AI-powered disease identification and treatment recommendations"
    },
    {
      icon: CloudSun,
      title: "Weather-Based Recommendations",
      description: "Get personalized plant suggestions based on your local weather conditions and location"
    },
    {
      icon: BrainCircuit,
      title: "AI Garden Assistant",
      description: "Chat with our intelligent bot that remembers your garden history and provides tailored advice"
    },
    {
      icon: BookOpen,
      title: "Crop Advisory System",
      description: "Access comprehensive treatment plans, growth requirements, and prevention tips for various crops"
    },
    {
      icon: Leaf,
      title: "Plant Care Guidance",
      description: "Expert tips on watering, fertilizing, pruning, and maintaining healthy plants year-round"
    },
    {
      icon: Users,
      title: "Community Knowledge",
      description: "Connect with fellow gardeners, share experiences, and learn from the community"
    }
  ];

  const benefits = [
    "Free forever with no credit card required",
    "AI-powered insights for healthier plants",
    "Mobile-responsive design for on-the-go access",
    "Personalized recommendations based on your location",
    "Growing library of plant care resources",
    "Active community of urban gardeners"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1591188185892-905c344e0364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx1cmJhbiUyMGdhcmRlbmluZyUyMHBsYW50cyUyMGdyb3dpbmclMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3NTM5MTY0MXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Urban gardening background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-transparent to-white"></div>
        </div>

        <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Sprout className="w-12 h-12 text-white" />
              </div>
              <h1 className="p-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                AgroMind
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-6 font-bold"
            >
              Your Complete Urban Gardening Companion
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Harness the power of AI to diagnose plant diseases, get personalized recommendations,
              and connect with a thriving community of urban gardeners
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <Button
                onClick={() => router.push("/signup")}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg rounded-full shadow-lg transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2 text-emerald-600">
            <span className="text-sm font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AgroMind combines cutting-edge AI technology with practical gardening knowledge
              to help you cultivate a thriving urban garden
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How AgroMind Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start your urban gardening journey in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Sign Up Free",
                description: "Create your account in seconds. No credit card required, no commitments.",
                icon: Users
              },
              {
                step: "2",
                title: "Explore Features",
                description: "Upload plant photos, chat with our AI, and browse our comprehensive plant database.",
                icon: MessageCircle
              },
              {
                step: "3",
                title: "Grow & Thrive",
                description: "Follow personalized recommendations and watch your urban garden flourish.",
                icon: Sprout
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6 flex justify-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center shadow-xl">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-emerald-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-emerald-600 font-bold text-lg">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Why Choose AgroMind?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of urban gardeners who are transforming their spaces into
                thriving green havens with the help of AI-powered insights.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-emerald-100 rounded-full p-1 mt-1">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768407313710-9fb5f82c63d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1cmJhbiUyMGdhcmRlbmluZyUyMHBsYW50cyUyMGdyb3dpbmclMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3NTM5MTY0MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Plants growing on windowsill"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-emerald-500 to-green-600 w-32 h-32 rounded-full blur-3xl opacity-30 -z-10"></div>
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-green-500 to-emerald-600 w-40 h-40 rounded-full blur-3xl opacity-20 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Garden?
            </h2>
            <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
              Join AgroMind today and start growing healthier, more vibrant plants
              with the power of AI-driven insights and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/signup")}
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Growing Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="mt-6 text-emerald-100 text-sm">
              No credit card required • Free forever • Join 10,000+ urban gardeners
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AgroMind</span>
            </div>
            <p className="text-center text-sm">
              © 2026 AgroMind. Empowering urban gardeners with AI technology.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="hover:text-emerald-400 transition-colors">About</button>
              <button className="hover:text-emerald-400 transition-colors">Privacy</button>
              <button className="hover:text-emerald-400 transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
