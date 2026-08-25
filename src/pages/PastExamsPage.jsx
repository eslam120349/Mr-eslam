import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Download, Video, Search, Filter, Sparkles, Loader2 } from 'lucide-react'
import { YEARS, GOVERNORATES } from '../data/dummyData'
import { fetchPastExamsFromSupabase } from '../lib/supabase'
import SEO from "../components/SEO";

export default function PastExamsPage() {
  const [selectedYearId, setSelectedYearId] = useState('all')
  const [selectedGov, setSelectedGov] = useState('all')
  const [selectedYearNum, setSelectedYearNum] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [examsList, setExamsList] = useState([])

  useEffect(() => {
    async function loadExams() {
      setLoading(true)
      const data = await fetchPastExamsFromSupabase()
      setExamsList(data)
      setLoading(false)
    }
    loadExams()
  }, [])

  const filteredExams = examsList.filter((exam) => {
    const matchGrade = selectedYearId === 'all' || String(exam.yearId) === String(selectedYearId)
    const matchGov = selectedGov === 'all' || exam.governorate === selectedGov
    const matchYearNum = selectedYearNum === 'all' || String(exam.year) === String(selectedYearNum)
    const matchSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchGrade && matchGov && matchYearNum && matchSearch
  })

  return (
    <SEO
  title="امتحانات الرياضيات السابقة | مستر اسلام سعيد"
  description="امتحانات وأسئلة الرياضيات السابقة للتدريب والمراجعة لطلاب البكالوريا المصرية والثانوية العامة مع مستر اسلام سعيد."
  canonical="https://mreslam.cc.cd/exams"
/>
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 font-ibm">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-dodger-900 to-dodger-800 text-white p-8 sm:p-12 shadow-xl border border-dodger-700/40"
      >
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-dodger-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>بنك امتحانات المحافظات والسنوات السابقة الحية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-messiri leading-tight">
            امتحانات السنين السابقة والإجابات النموذجية 📝
          </h1>

          <p className="text-base sm:text-lg text-dodger-100/90 leading-relaxed">
            تدرب على نماذج امتحانات المحافظات الحقيقية المرفوعة بـ Supabase مع حلول وافية بفيديوهات الشرح.
          </p>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700/70 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <Filter className="w-5 h-5 text-dodger-600" />
            <span>تصفية الامتحانات:</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث باسم المحافظة أو السنة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
            />
            <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
              الصف الدراسي
            </label>
            <select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-bold text-gray-800 dark:text-gray-200"
            >
              <option value="all">جميع الصفوف</option>
              {YEARS.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
              المحافظة
            </label>
            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-bold text-gray-800 dark:text-gray-200"
            >
              <option value="all">جميع المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
              سنة الامتحان
            </label>
            <select
              value={selectedYearNum}
              onChange={(e) => setSelectedYearNum(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-bold text-gray-800 dark:text-gray-200"
            >
              <option value="all">جميع السنوات</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-dodger-600 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري جلب الامتحانات من قاعدة البيانات...</span>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-slate-300 dark:border-gray-700 text-gray-500 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <p className="font-bold text-lg">لا توجد امتحانات مضافة في Supabase بعد</p>
          <p className="text-xs text-gray-400">يمكنك إضافة نماذج امتحانات جديدة فوراً من لوحة تحكم الأدمن!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-dodger-50 dark:bg-dodger-900/40 text-dodger-700 dark:text-dodger-300">
                    {exam.governorate}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                    عام {exam.year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {exam.title}
                </h3>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                {exam.pdfUrl && (
                  <a
                    href={exam.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-dodger-600 text-dodger-600 hover:bg-dodger-50 text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الورقة ({exam.pdfSize})</span>
                  </a>
                )}

                {exam.videoSolutionUrl && (
                  <a
                    href={exam.videoSolutionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>مشاهدة فيديو الحل</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
