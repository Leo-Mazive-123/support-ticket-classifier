'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link'; // Fix Link error
import { motion } from 'framer-motion'; // Ensure framer-motion is installed
import { Bot, ShieldCheck, Zap, Users2, Cpu, HelpCircle, SendHorizonal } from 'lucide-react'; // Ensure lucide-react is installed



export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />

      {/* Hero Section */}
<section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-24 px-6 text-center mt-20">
  <motion.h1
    className="text-4xl md:text-6xl font-extrabold mb-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    About Our Support Ticket System
  </motion.h1>
  <motion.p
    className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    Fast, intelligent, and reliable support ticket management for organizations of all sizes.
    Track, submit, and resolve issues efficiently with our automatic classification system.
  </motion.p>
</section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid gap-10 md:grid-cols-3 text-center">
        {[
          { title: 'User-Friendly', desc: 'Simple and intuitive interface for submitting and tracking tickets.', icon: <Bot className="mx-auto mb-4 h-10 w-10 text-blue-600" /> },
          { title: 'Fast Response', desc: 'Tickets are automatically routed to the correct department for quick resolution.', icon: <Zap className="mx-auto mb-4 h-10 w-10 text-blue-600" /> },
          { title: 'Smart Solutions', desc: 'AI-powered system predicts the right department to handle your issue efficiently.', icon: <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-blue-600" /> },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="bg-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* How it Works */}
      <section className="bg-blue-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid gap-10 md:grid-cols-4 max-w-6xl mx-auto text-center">
          {[
            { step: 'Describe your issue', icon: <HelpCircle className="mx-auto h-10 w-10 text-blue-600" /> },
            { step: 'AI analyzes content', icon: <Cpu className="mx-auto h-10 w-10 text-blue-600" /> },
            { step: 'Department predicted', icon: <Users2 className="mx-auto h-10 w-10 text-blue-600" /> },
            { step: 'Ticket sent instantly', icon: <SendHorizonal className="mx-auto h-10 w-10 text-blue-600" /> },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-2xl font-bold text-blue-600 mb-4">{step.icon}</div>
              <p className="font-medium">{step.step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { name: 'Cova M.', feedback: 'This tool saved our IT team hours every week! Absolutely magical how accurate the predictions are.' },
            { name: 'Nyasha Z.', feedback: 'Simple, fast, and incredibly effective. Our employees get help way faster now. Love it!' },
            { name: 'James M.', feedback: 'I was skeptical at first, but this system nailed it. The accuracy is shocking — in a good way!' },
          ].map((testi, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="italic text-gray-700 mb-4">&ldquo;{testi.feedback}&rdquo;</p>
              <p className="font-semibold text-blue-800">— {testi.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Ready to get help faster?
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/submit">
            <button className="bg-white text-blue-800 px-8 py-4 rounded-full font-semibold hover:bg-blue-100 transition">
              Submit Your Ticket
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
