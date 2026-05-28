// ===========================================
// Testimonials — Social Proof Section
// ===========================================

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Content Creator',
    company: 'YouTube',
    quote:
      'SonicScript cut my transcription time by 90%. I used to spend hours transcribing podcast episodes — now it takes minutes.',
    avatar: '👩‍💻',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Product Manager',
    company: 'TechFlow',
    quote:
      'The real-time transcription is incredible. During meetings, I just let it run and have perfect notes by the end. Game changer.',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Journalist',
    company: 'The Wire',
    quote:
      'Beautiful UI, fast transcription, and the history feature means I never lose an interview transcript again. Love it.',
    avatar: '👩‍🎓',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-sonic-pink mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by{' '}
            <span className="gradient-text">creators</span>
          </h2>
          <p className="text-sonic-text-dim text-base sm:text-lg max-w-xl mx-auto">
            See what people are saying about SonicScript.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="glass-card p-6 sm:p-8 group"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-sonic-text leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-sonic-border flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-sonic-text">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-sonic-text-dim">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
