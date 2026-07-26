import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Play, Download, Search, Filter, Sparkles, Video, Loader2 } from 'lucide-react'
import { YEARS } from '../data/dummyData'
import { fetchLessonsFromSupabase, fetchPastExamsFromSupabase } from '../lib/supabase'

export default function YearDetailPage() {
  const { yearId } = useParams()
  const yearData = YEARS.find((y) => y.id === (yearId || '3')) || YEARS[2]

  const [activeTab, setActiveTab] = useState('lessons') // 'lessons' | 'exams'
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const [lessonsList, setLessonsList] = useState([])
  const [examsList, setExamsList] = useState([])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [lessons, exams] = await Promise.all([
        fetchLessonsFromSupabase(),
        fetchPastExamsFromSupabase(),
      ])
      setLessonsList(lessons)
      setExamsList(exams)
      setLoading(false)
    }
    loadData()
  }, [yearId])

  // Filter lessons for this year
  const yearLessons = lessonsList.filter((l) => String(l.yearId) === String(yearData.id))
  const filteredLessons = yearLessons.filter((l) => {
    const matchesSemester = selectedSemester === 'all' || Number(l.semester) === Number(selectedSemester)
    const matchesBranch = selectedBranch === 'all' || l.branch === selectedBranch
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSemester && matchesBranch && matchesSearch
  })

  // Filter exams for this year
  const yearExams = examsList.filter((e) => String(e.yearId) === String(yearData.id))
  const filteredExams = yearExams.filter((e) => {
    const matchesSemester = selectedSemester === 'all' || Number(e.semester) === Number(selectedSemester)
    const matchesBranch = selectedBranch === 'all' || e.branch === selectedBranch
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSemester && matchesBranch && matchesSearch
  })

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 font-ibm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-dodger-600 dark:hover:text-dodger-400">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-bold">{yearData.title}</span>
      </div>

      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dodger-900 via-dodger-800 to-dodger-700 text-white p-8 sm:p-12 shadow-xl border border-dodger-600/30"
      >
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-dodger-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{yearData.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-messiri leading-tight">
            {yearData.title}
          </h1>

          <p className="text-base sm:text-lg text-dodger-100/90 leading-relaxed">
            {yearData.desc}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-dodger-300" />
              <span>{yearLessons.length} درس مسجل بالقواعد الحية</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>{yearExams.length} امتحان سنين سابقة</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-4">
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 ${activeTab === 'lessons'
                ? 'bg-dodger-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-dodger-600'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>دروس المنهج ({yearLessons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 ${activeTab === 'exams'
                ? 'bg-dodger-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-dodger-600'
                }`}
            >
              <FileText className="w-5 h-5" />
              <span>امتحانات المحافظات ({yearExams.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="ابحث عن درس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
            <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-dodger-600 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري تحميل الدروس</span>
        </div>
      ) : activeTab === 'lessons' ? (
        <div className="space-y-6">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-slate-300 dark:border-gray-700 text-gray-500 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
              <p className="font-bold text-lg">لا توجد دروس مضافة لهذا الصف</p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700/80 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-dodger-50 dark:bg-dodger-900/50 text-dodger-700 dark:text-dodger-300">
                        {lesson.branch}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2">{lesson.description}</p>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={`/lessons/${lesson.id}`}
                      className="w-full py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>مشاهدة الدرس والتمارين</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExams.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-slate-300 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="font-bold text-lg">لا توجد امتحانات سابقة مضافة لهذا الصف بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {exam.governorate} ({exam.year})
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exam.title}</h3>
                  </div>

                  <div className="pt-6 flex items-center gap-3">
                    {exam.pdfUrl && (
                      <a
                        href={exam.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-4 rounded-xl border border-dodger-600 text-dodger-600 text-xs font-bold flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل الورقة</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
