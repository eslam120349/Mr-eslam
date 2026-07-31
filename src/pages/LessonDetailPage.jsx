import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Play, Download, CheckCircle, HelpCircle, MessageSquare, Send, Sparkles, ShieldAlert, Loader2 } from 'lucide-react'
import { fetchLessonByIdFromSupabase, supabase } from '../lib/supabase'
import ProtectedVideoPlayer from '../components/ProtectedVideoPlayer'

export default function LessonDetailPage() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [studentInfo, setStudentInfo] = useState({ name: 'طالب المنصة', phone: '01xxxxxxxxx' })

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({})
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Comments state
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    async function loadLessonAndUser() {
      setLoading(true)
      const data = await fetchLessonByIdFromSupabase(lessonId)
      setLesson(data)

      // Get logged in student profile for watermark protection
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setStudentInfo({
              name: profile.full_name || session.user.email,
              phone: profile.phone || 'طالب مفعّل',
            })
          } else {
            setStudentInfo({
              name: session.user.email || 'طالب المنصة',
              phone: '01xxxxxxxxx',
            })
          }
        }
      } catch (err) {
        console.log('Error fetching user info for watermark:', err)
      }

      setLoading(false)
    }
    loadLessonAndUser()
  }, [lessonId])

  const handleOptionSelect = (qId, optionIdx) => {
    if (isQuizSubmitted) return
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  const handleQuizSubmit = (e) => {
    e.preventDefault()
    if (!lesson?.quiz || lesson.quiz.length === 0) return

    let correctCount = 0
    lesson.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1
      }
    })

    setScore(correctCount)
    setIsQuizSubmitted(true)

    if (correctCount / lesson.quiz.length >= 0.6) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setComments([
      { id: Date.now(), name: 'الطالب (أنت)', time: 'الآن', text: newComment },
      ...comments,
    ])
    setNewComment('')
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 font-ibm text-dodger-600 font-bold">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span>جاري جلب تفاصيل الدرس من Supabase...</span>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 font-ibm text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">عذراً، الدرس غير موجود أو تم حذفه</h2>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-dodger-600 text-white font-bold text-sm">
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 max-w-6xl mx-auto space-y-10 font-ibm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-dodger-600">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-bold">{lesson.title}</span>
      </div>

      {/* Main Video Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-dodger-100 dark:bg-dodger-900/60 text-dodger-700 dark:text-dodger-300">
              {lesson.branch}
            </span>
            <span className="text-xs text-gray-500 font-bold">{lesson.unit}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-messiri text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
        </div>

        {/* Video Player Wrapper (Protected Custom HTML5 Player - No iframe) */}
        <ProtectedVideoPlayer
          videoUrl={lesson.videoUrl}
          title={lesson.title}
          studentInfo={studentInfo}
        />

        {/* Lesson Description & Material Downloads */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700/70 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">عن هذا الدرس</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {lesson.description || 'لا يوجد وصف إضافي لهذا الدرس.'}
            </p>
          </div>

          {lesson.summaryPdfUrl && (
            <div className="w-full md:w-auto">
              <a
                href={lesson.summaryPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#47C780] hover:from-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <Download className="w-5 h-5" />
                <span>تحميل ملخص الدرس (PDF)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Quiz section */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-gray-700/70 shadow-md space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-gray-700 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-dodger-600" />
                <h2 className="text-xl sm:text-2xl font-bold font-messiri text-gray-900 dark:text-white">
                  اختبر فهمك بعد المشاهدة
                </h2>
              </div>
            </div>

            {isQuizSubmitted && (
              <div className="px-5 py-2.5 rounded-2xl bg-dodger-50 dark:bg-dodger-900/50 border border-dodger-200 text-dodger-700 font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>النتيجة: {score} من {lesson.quiz.length}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleQuizSubmit} className="space-y-8">
            {lesson.quiz.map((q, qIndex) => (
              <div
                key={q.id || qIndex}
                className="space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700/60"
              >
                <div className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-dodger-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <span>{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">
                  {q.options.map((opt, optIdx) => {
                    const isThisOptionSelected = userAnswers[q.id || qIndex] === optIdx
                    let btnStyle = 'border-slate-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'

                    if (isQuizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      } else if (isThisOptionSelected) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-800 font-bold'
                      }
                    } else if (isThisOptionSelected) {
                      btnStyle = 'border-dodger-600 bg-dodger-50 text-dodger-800 font-bold'
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isQuizSubmitted}
                        onClick={() => handleOptionSelect(q.id || qIndex, optIdx)}
                        className={`p-3.5 rounded-xl border text-right text-sm smooth flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-dodger-600 hover:bg-dodger-700 text-white font-bold text-sm shadow transition"
            >
              تأكيد وتقييم النتيجة 🎯
            </button>
          </form>
        </motion.div>
      )}

      {/* Discussion */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700/70 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-700 pb-4">
          <MessageSquare className="w-6 h-6 text-dodger-600" />
          <h3 className="text-xl font-bold font-messiri text-gray-900 dark:text-white">
            مناقشات وأسئلة الطلاب
          </h3>
        </div>

        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            placeholder="اكتب سؤالك أو استفسارك لمستر إسلام..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-dodger-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white font-bold text-sm flex items-center gap-2 shrink-0 transition"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-4 pt-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-900/40 border border-slate-100 dark:border-gray-700/50 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>{c.name}</span>
                <span className="text-gray-400 font-normal">{c.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
