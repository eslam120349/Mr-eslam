import { motion } from 'framer-motion'
import { Sparkles, BrainCircuit, HeartHandshake, Award } from 'lucide-react'

const FEATURES = [
  {
    title: 'شرح بسيط وممتع',
    desc: 'شرح واضح ومبسط يساعدك تفهم الرياضيات من الأساس وتتعامل مع أصعب المسائل بسهولة وثقة دون تعقيد.',
    icon: BrainCircuit,
    color: 'from-dodger-800 to-dodger-600',
  },
  {
    title: 'متابعة ودعم مستمر',
    desc: 'متابعة مستمرة لمستواك ودعم يساعدك تتخطى أي صعوبة وتطور مستواك في الرياضيات خطوة بخطوة معك طوال العام.',
    icon: HeartHandshake,
    color: 'from-[#47C780] to-emerald-600',
  },
  {
    title: 'تدريبات وامتحانات شاملة',
    desc: 'تدريبات متنوعة واختبارات مستمرة مع حلول امتحانات المحافظات تفاعلياً تضمن لك تحقيق الدرجة النهائية.',
    icon: Award,
    color: 'from-purple-800 to-purple-600',
  },
]

export default function WhyUsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-t from-dodger-500/10 via-transparent to-transparent font-ibm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dodger-100 dark:bg-dodger-900/60 text-dodger-700 dark:text-dodger-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>مميزات المنصة</span>
          </div>
          <h2 className="font-khaled font-bold text-3xl sm:text-5xl text-gray-900 dark:text-white">
            ليه تختار .. <span className="text-dodger-600 dark:text-dodger-300">مستر إسلام؟</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            طريقتنا المبتكرة تضمن تحويل الرياضيات من مادة معقدة إلى تجربة فهم ممتعة وسلسة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl p-8 bg-gradient-to-br ${f.color} text-white shadow-xl overflow-hidden group flex flex-col justify-between min-h-[260px]`}
              >
                {/* Background glow circle */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-bold text-xl sm:text-2xl font-messiri">
                    {f.title}
                  </h3>

                  <p className="text-sm text-white/90 leading-relaxed font-ibm">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
