import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, BookOpen, Award, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-[88vh] relative overflow-hidden flex items-center">
      {/* Soft background ambient gradient */}
      <div className="bg-gradient-to-b from-dodger-800/10 via-dodger-500/5 to-transparent h-full w-full absolute inset-0 -z-10" />

      <div className="px-4 sm:px-10 max-w-7xl mx-auto w-full py-12 md:py-20 font-fs">
        <div className="flex md:flex-row flex-col items-center justify-between gap-12 lg:gap-16">
          {/* Left Column: Copy & Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="md:w-1/2 w-full space-y-6 text-center md:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dodger-100 dark:bg-dodger-900/60 border border-dodger-200 dark:border-dodger-700 text-dodger-800 dark:text-dodger-200 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>منصة الرياضيات الأولى للمرحلتين الإعدادية والثانوية</span>
            </div>

            <h1 className="font-khaled text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              تعلم الرياضيات بذكاء مع{' '}
              <span className="text-dodger-600 dark:text-dodger-300 block sm:inline">
                مستر إسلام
              </span>
            </h1>

            <div className="space-y-3 font-ibm text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
              <p>
                معايا مش هتحفظ قوانين وخطوات وبس… هتتعلم إزاي تفهم الرياضيات، تفكر بطريقة صح، وتحل أي مسألة بثقة في الامتحان.
              </p>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                شرح مبسط لكل درس، كويزات تفاعلية فورية، وامتحانات سنوات سابقة محلولة بالفيديو.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 font-ibm">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-dodger-700 to-dodger-600 hover:from-dodger-800 hover:to-dodger-700 text-white font-bold text-base shadow-lg shadow-dodger-600/30 hover:shadow-xl hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <span>ابدأ رحلتك الآن</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Link>

              <a
                href="#courses"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-gray-700 hover:border-dodger-500 text-gray-800 dark:text-gray-200 font-bold text-base hover:bg-dodger-50 dark:hover:bg-dodger-900/30 transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-dodger-600" />
                <span>استعرض الكورسات</span>
              </a>
            </div>

          </motion.div>

          {/* Right Column: Hero Image with Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 w-full flex items-center justify-center relative"
          >
            <div className="relative max-w-md w-full aspect-square">
              {/* Outer glowing rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-dodger-500 to-[#47C780] opacity-20 blur-2xl animate-pulse" />

              {/* Main Avatar Card */}
              <div className="relative w-full h-full rounded-full p-3 bg-gradient-to-tr from-dodger-700 via-dodger-500 to-[#47C780] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800">
                  <img
                    src="/MRV1.png"
                    alt="مستر اسلام - مدرس رياضيات"
                    className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                    draggable="false"
                  />
                </div>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-gray-700 flex items-center gap-3 font-ibm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">خبرة أكثر من</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">3 سنوات تدريس</div>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-gray-700 flex items-center gap-3 font-ibm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-[#47C780] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">أكبر منصة رياضيات</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">شرح + امتحانات</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
