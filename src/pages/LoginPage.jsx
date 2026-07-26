import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('يرجى إدخال جميع البيانات المطلوبة')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          setErrorMsg('لازم تفعّل بريدك الإلكتروني الأول قبل ما تسجل الدخول.')
        } else {
          setErrorMsg('حصل خطأ أثناء تسجيل الدخول، حاول تاني.')
        }
        setIsLoading(false)
        return
      }

      if (!data.session) {
        setErrorMsg('حصل خطأ غير متوقع، حاول تاني.')
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setSuccessMsg('تم تسجيل الدخول بنجاح! جاري توجيهك...')

      setTimeout(() => {
        navigate('/')
      }, 1200)
    } catch (err) {
      console.error(err)
      setErrorMsg('حصل خطأ غير متوقع، حاول تاني.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-dodger-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-gray-700/60 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-dodger-600 via-dodger-400 to-[#47C780]" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dodger-50 dark:bg-dodger-900/50 text-dodger-600 dark:text-dodger-300 mb-2 shadow-inner">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-messiri text-gray-900 dark:text-white">
              مرحباً بك مجدداً 👋
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-ibm">
              سجّل دخولك لمتابعة دروسك واختباراتك في الرياضيات
            </p>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-bold text-center"
            >
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {successMsg}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 font-ibm">
            {/* Email input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dodger-500 focus:border-transparent smooth text-right"
                />
                <Mail className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-11 pl-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dodger-500 focus:border-transparent smooth"
                />
                <Lock className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-4 left-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  aria-label="تبديل رؤية كلمة المرور"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-dodger-600 focus:ring-dodger-500"
                />
                <span>تذكرني على هذا الجهاز</span>
              </label>
              <a href="#" className="text-dodger-600 dark:text-dodger-400 hover:underline font-bold text-xs">
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-dodger-700 to-dodger-600 text-white font-bold text-base shadow-lg shadow-dodger-600/30 hover:shadow-xl hover:shadow-dodger-600/40 disabled:opacity-70 transition flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-700 text-center text-sm font-ibm text-gray-600 dark:text-gray-400">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="font-bold text-dodger-600 dark:text-dodger-400 hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}