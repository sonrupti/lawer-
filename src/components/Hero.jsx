"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Scale,
  ShieldCheck,
  Sparkles,
  Database,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute left-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-10 top-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-[140px]" />
    </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">

        {/* Badge */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="flex justify-center"
        >
          <div className="glass-card flex items-center gap-2 rounded-full px-5 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text-muted">
              India's Legal Intelligence Platform
            </span>
          </div>
        </motion.div>

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .15 }}
          className="mx-auto mt-8 max-w-5xl text-center"
        >
          <h1 className="text-5xl font-black tracking-tight text-text md:text-7xl lg:text-8xl leading-[0.95]">

            Find the Right Lawyer

            <span className="block bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-400 bg-clip-text text-transparent mt-3">

              Using Real Court Records

            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-text-muted md:text-xl">
            Search advocates by practice area, case history, judges,
            courts and verified public court data. Discover legal
            specialists using AI-powered legal intelligence.
          </p>
        </motion.div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-white font-semibold shadow-lg transition hover:scale-105 hover:shadow-blue-500/30">

            Explore Lawyers

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

          </button>

          <button className="glass-card rounded-xl px-8 py-4 font-medium text-text transition hover:scale-105">
            Learn More
          </button>
        </motion.div>

        {/* Stats */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .45 }}
          className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4"
        >

          {[
            {
              value: "120K+",
              label: "Cases Indexed",
              icon: Database,
            },
            {
              value: "18K+",
              label: "Advocates",
              icon: Scale,
            },
            {
              value: "35+",
              label: "Practice Areas",
              icon: ShieldCheck,
            },
            {
              value: "100%",
              label: "Public Court Data",
              icon: Sparkles,
            },
          ].map((item) => (
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              key={item.label}
              className="glass-card glass-card-hover rounded-2xl p-6 text-center"
            >
              <item.icon className="mx-auto h-8 w-8 text-primary mb-4" />

              <h3 className="text-3xl font-black text-text">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                {item.label}
              </p>
            </motion.div>
          ))}

        </motion.div>

        {/* Trust Section */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .6 }}
          className="mt-20 flex flex-wrap justify-center gap-6 text-sm text-text-muted"
        >
          <div className="glass-card px-5 py-3 rounded-full">
            ⚖ Odisha High Court
          </div>

          <div className="glass-card px-5 py-3 rounded-full">
            📚 Verified Court Records
          </div>

          <div className="glass-card px-5 py-3 rounded-full">
            🤖 AI Legal Intelligence
          </div>

          <div className="glass-card px-5 py-3 rounded-full">
            🔒 Privacy First
          </div>
        </motion.div>

      </div>
    </section>
  );
}