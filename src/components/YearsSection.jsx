import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { YEARS } from '../data/dummyData'
import { BookOpen, ArrowLeft, Sparkles, GraduationCap } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'كل المراحل' },
  { id: 'prep', label: 'المرحلة الإعدادية' },
  { id: 'sec', label: 'المرحلة الثانوية' },
]

export default function YearsSection() {
  const [tab, setTab] = useState('all')
  const shown = tab === 'all' ? YEARS : YEARS.filter((y) => y.stage === tab)

  return (
    <section className="space-y-12 py-16 relative" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto font-ibm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dodger-100 dark:bg-dodger-900/60 text-dodger-700 dark:text-dodger-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>الصفوف والمراحل الدراسية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-messiri text-gray-900 dark:text-white">
            اختر سنتك الدراسية وابدأ التعلم 📚
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            تصفح مناهج الرياضيات المخصصة لصفك الدراسي، الدروس المرتّبة، واختبارات السنوات السابقة.
          </p>
        </div>

        {/* Tabs Filter */}
        <div className="flex font-ibm justify-center" role="tablist">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-800 p-2 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-6 py-2.5 text-sm md:text-base font-bold transition ${
                  tab === t.id
                    ? 'bg-dodger-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-dodger-50 dark:hover:bg-gray-700 hover:text-dodger-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Years Cards Grid */}
        <div className="grid font-ibm grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="wait">
            {shown.map((y) => (
              <motion.div
                key={y.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className="group h-full"
              >
                <Link to={`/years/${y.id}`} className="block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-dodger-400">
                    <div className={`h-2 w-full ${y.bar}`} />

                    <div className="relative overflow-hidden h-44 bg-gradient-to-br from-dodger-100 to-dodger-200 dark:from-dodger-950 dark:to-dodger-900 flex items-center justify-center p-6 text-center">
                      <span className="font-khaled text-4xl text-dodger-800 dark:text-dodger-200 group-hover:scale-110 transition duration-300">
                        {y.title}
                      </span>

                      <span className="absolute top-4 start-4 rounded-full bg-white/90 dark:bg-gray-900/90 px-3.5 py-1 text-xs font-bold text-dodger-700 dark:text-dodger-300 shadow-sm">
                        {y.badge}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {y.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {y.branches.map((b) => (
                          <span
                            key={b}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                        <span className="text-sm font-bold text-dodger-600 dark:text-dodger-400 group-hover:underline">
                          استكشف الدروس والامتحانات
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dodger-50 dark:bg-dodger-900/50 text-dodger-600 dark:text-dodger-300 group-hover:bg-dodger-600 group-hover:text-white transition">
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
