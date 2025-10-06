// src/components/Footer.jsx
import React from 'react';
import { Lock, CreditCard, ArrowRight, TrendingUp, Calendar, Zap, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const eventGridVariants = { /* ... */ };

const transactions = [
    { id: 1, event: "Tech Summit", amount: "₹4,500", user: "User A***31" },
    { id: 2, event: "Classical Concert", amount: "₹1,200", user: "User B***88" },
    { id: 3, event: "Food Festival", amount: "₹500", user: "User C***02" },
    { id: 4, event: "Photography Workshop", amount: "₹2,500", user: "User D***45" },
];

const TransactionTicker = () => (
    <div className="h-24 overflow-hidden relative">
        <motion.div
            className="absolute top-0 left-0 w-full"
            animate={{ y: ['0%', '-100%'] }}
            transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "linear" 
            }}
        >
            {[...transactions, ...transactions].map((tx, index) => (
                <div key={index} className="flex justify-between items-center py-1.5 text-sm">
                    <div className="flex items-center text-green-400">
                        <Zap className="w-3 h-3 mr-2 fill-green-400" />
                        <span className="font-semibold">{tx.amount}</span>
                    </div>
                    <span className="text-gray-400">{tx.user} booked {tx.event}</span>
                </div>
            ))}
        </motion.div>
    </div>
);

const Footer = () => {
  return (
        <footer className="bg-purple-900 text-white p-4 text-center">

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <div className="p-6 bg-purple-900/30 rounded-2xl shadow-xl border border-purple-700/50">
                    <div className="flex items-center mb-4">
                        <Lock className="w-8 h-8 text-yellow-400 mr-3 flex-shrink-0" />
                        <h2 className="text-xl font-bold text-white">Fast & Secure Payments</h2>
                    </div>
                    <p className="text-purple-300 text-sm mb-4">
                        Book your tickets with confidence. We process thousands of transactions daily with bank-grade encryption.
                    </p>
                    
                    <TransactionTicker />
                    
                    <a
                        href="/security-policy" 
                        className="mt-4 flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-300 hover:bg-yellow-300 text-sm"
                    >
                        <CreditCard className="w-4 h-4" />
                        View Security Policy
                    </a>
                </div>

                <div className="p-6 bg-gray-900/50 rounded-2xl shadow-xl border border-gray-700/50">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="w-8 h-8 text-cyan-400 mr-3 flex-shrink-0" />
                        <h2 className="text-xl font-bold text-white">Daily Updates & Insights</h2>
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start text-gray-300">
                            <Calendar className="w-4 h-4 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                            Get instant notifications on **newly added events** and schedule changes.
                        </li>
                        <li className="flex items-start text-gray-300">
                            <MessageCircle className="w-4 h-4 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                            Read **daily community posts** and pre-event buzz directly on your dashboard.
                        </li>
                        <li className="flex items-start text-gray-300">
                            <Zap className="w-4 h-4 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                            Track **live ticket availability** with real-time countdowns.
                        </li>
                    </ul>
                </div>

                <div className="p-6 bg-gray-900/50 rounded-2xl shadow-xl border border-gray-700/50">
                    <div className="flex items-center mb-4">
                        <Calendar className="w-8 h-8 text-red-400 mr-3 flex-shrink-0" />
                        <h2 className="text-xl font-bold text-white">All Events Info in One Place</h2>
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start text-gray-300">
                            <ArrowRight className="w-4 h-4 text-red-400 mt-1 mr-3 flex-shrink-0" />
                            **Unified Calendar View** for all upcoming, past, and featured events.
                        </li>
                        <li className="flex items-start text-gray-300">
                            <ArrowRight className="w-4 h-4 text-red-400 mt-1 mr-3 flex-shrink-0" />
                            **Instant Filtering** by location, category, and price range.
                        </li>
                        <li className="flex items-start text-gray-300">
                            <ArrowRight className="w-4 h-4 text-red-400 mt-1 mr-3 flex-shrink-0" />
                            Access to **Past Event Highlights** (using the new tabs feature).
                        </li>
                    </ul>
                </div>
            </motion.section>
      &copy; 2025 Smart Event Booking System
    </footer>
  );
};

export default Footer;