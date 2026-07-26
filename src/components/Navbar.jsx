import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, LogIn, LogOut, UserPlus, FileText, Home, User, BookOpen, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { YEARS } from '../data/dummyData'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  // نقرأ تفضيل الدارك مود المحفوظ من localStorage أول ما الكومبوننت يتحمل
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    // لو مفيش تفضيل محفوظ، نستخدم إعدادات نظام التشغيل كقيمة افتراضية
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [session, setSession] = useState(null)
  const [userName, setUserName] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  const [lessonsMenuOpen, setLessonsMenuOpen] = useState(false)
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false)
  const lessonsMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false)
    setLessonsMenuOpen(false)
    setMobileLessonsOpen(false)
  }, [location.pathname])

  // Close desktop lessons dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (lessonsMenuRef.current && !lessonsMenuRef.current.contains(e.target)) {
        setLessonsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Track the real Supabase auth session, and fetch the display name from profiles
  useEffect(() => {
    const loadSession = async (currentSession) => {
      setSession(currentSession)
      if (currentSession) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentSession.user.id)
          .single()
        setUserName(profile?.full_name || currentSession.user.email)
      } else {
        setUserName('')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadSession(session)
      setCheckingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path
  const isYearActive = location.pathname.startsWith('/years/')

  return (
    <nav className="navbar z-50 sticky top-2 smooth bg-dodger-800 text-white mx-3 rounded-2xl shadow-xl border border-dodger-700/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        <div className="relative flex items-center justify-between h-full flex-row-reverse">
          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition"
              aria-expanded={open}
              aria-label="القائمة"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Dark mode toggle - mobile */}
          <button
            onClick={() => setDark((v) => !v)}
            className="md:hidden inline-flex items-center p-2 rounded-xl bg-dodger-700/80 text-dodger-100 hover:bg-dodger-700 transition"
            aria-label="تبديل الوضع الليلي"
          >
            {dark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-dodger-200" />}
          </button>

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6 justify-center md:justify-end flex-1 h-full">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-2xl bg-white/95 text-dodger-800 flex items-center justify-center font-khaled text-xl shadow-md group-hover:scale-105 transition">
                إ
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-messiri font-bold text-lg leading-tight text-white">
                  مستر إسلام
                </span>
                <span className="text-xs text-dodger-200 font-ibm">خبير مادة الرياضيات</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 mr-6 font-ibm text-sm font-bold">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${isActive('/')
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-dodger-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </Link>

              {/* Lessons dropdown by year */}
              <div className="relative" ref={lessonsMenuRef}>
                <button
                  onClick={() => setLessonsMenuOpen((v) => !v)}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${isYearActive
                    ? 'bg-white/15 text-white shadow-inner'
                    : 'text-dodger-100 hover:bg-white/10 hover:text-white'
                    }`}
                  aria-expanded={lessonsMenuOpen}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>الدروس</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${lessonsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {lessonsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 p-2 text-gray-900 dark:text-white z-50 max-h-80 overflow-y-auto"
                    >
                      {YEARS.map((y) => (
                        <Link
                          key={y.id}
                          to={`/years/${y.id}`}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-dodger-50 dark:hover:bg-gray-700 transition"
                        >
                          <span>{y.title}</span>
                          {y.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-dodger-100 dark:bg-dodger-900/50 text-dodger-700 dark:text-dodger-300">
                              {y.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/exams"
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${isActive('/exams')
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-dodger-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>امتحانات السنين السابقة</span>
              </Link>
            </div>
          </div>

          {/* Right side buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDark((v) => !v)}
              className="py-2 px-3 rounded-xl bg-dodger-700/80 hover:bg-dodger-700 text-dodger-100 text-xs font-bold flex items-center gap-1.5 transition"
              aria-label="تبديل الوضع الليلي"
            >
              {dark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-dodger-200" />
                  <span>ليلي</span>
                </>
              )}
            </button>

            {checkingSession ? null : session ? (
              <>
                <div className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-dodger-700/80 text-dodger-100 max-w-[160px]">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="truncate">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border bg-dodger-700 border-dodger-600 hover:bg-white hover:text-dodger-800 shadow transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إنشاء حساب</span>
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#47C780] hover:bg-[#3eb673] text-white shadow transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dodger-700/60 px-4 pt-3 pb-5 flex flex-col gap-2 font-ibm"
          >
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>

            {/* Lessons expandable section - mobile */}
            <div>
              <button
                onClick={() => setMobileLessonsOpen((v) => !v)}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between gap-2"
                aria-expanded={mobileLessonsOpen}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>الدروس</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLessonsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {mobileLessonsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pr-6 flex flex-col gap-1 mt-1 overflow-hidden"
                  >
                    {YEARS.map((y) => (
                      <Link
                        key={y.id}
                        to={`/years/${y.id}`}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-dodger-100 hover:bg-white/10 hover:text-white transition"
                      >
                        {y.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/exams"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>امتحانات السنين السابقة</span>
            </Link>

            <div className="pt-2 border-t border-dodger-700/40 flex flex-col gap-2">
              {checkingSession ? null : session ? (
                <>
                  <div className="px-4 py-2.5 rounded-xl text-sm font-bold text-center bg-dodger-700/80 text-dodger-100 flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">{userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-center bg-red-500 text-white flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-center bg-dodger-700 text-white flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-center bg-[#47C780] text-white flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}