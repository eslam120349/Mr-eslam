import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { User, Phone, Lock, Eye, EyeOff, GraduationCap, MapPin, Sparkles, UserCheck, ArrowRight } from 'lucide-react'
import { YEARS, GOVERNORATES } from '../data/dummyData'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [selectedYear, setSelectedYear] = useState('3') // default to 3rd prep
  const [governorate, setGovernorate] = useState('القاهرة')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName || !email || !phone || !parentPhone || !password || !confirmPassword) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين')
      return
    }

    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل')
      return
    }

    setIsLoading(true)

    try {
      // 1) Create the real auth account (this is what makes the account real,
      // not the profiles row by itself)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        if (authError.message?.toLowerCase().includes('already registered')) {
          setErrorMsg('الإيميل ده مسجل بحساب بالفعل، جرب تسجل الدخول بدل كده.')
        } else if (authError.code === 'email_address_invalid') {
          setErrorMsg('صيغة الإيميل غير صحيحة، تأكد منه وحاول تاني.')
        } else {
          setErrorMsg('حصل خطأ أثناء إنشاء الحساب، حاول تاني.')
        }
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setErrorMsg('حصل خطأ غير متوقع، حاول تاني.')
        setIsLoading(false)
        return
      }

      // 2) Create the matching profile row — id MUST equal the auth user id,
      // this is what our RLS policy checks
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          full_name: fullName,
          phone,
          parent_phone: parentPhone,
          year_id: selectedYear,
          governorate,
          role: 'student',
        },
      ])

      if (profileError) {
        if (profileError.message?.toLowerCase().includes('duplicate')) {
          setErrorMsg('رقم الهاتف ده مسجل بحساب بالفعل، جرب تسجل الدخول بدل كده.')
        } else {
          setErrorMsg('اتعمل الحساب بس حصل خطأ في حفظ بياناتك، كلم الدعم الفني.')
        }
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setIsSuccess(true)

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch (err) {
        console.log(err)
      }

      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      console.error(err)
      setErrorMsg('حصل خطأ غير متوقع، حاول تاني.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-dodger-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 dark:border-gray-700/60 relative overflow-hidden">
          {/* Top banner accent */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#47C780] via-dodger-500 to-purple-600" />

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#47C780] mb-2 shadow-inner">
              <UserCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-messiri text-gray-900 dark:text-white">
              أنشئ حسابك الجديد 🎓
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-ibm">
              انضم لألاف الطلاب وتفوق في الرياضيات مع مستر إسلام
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-bold text-center"
            >
              {errorMsg}
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-center font-ibm space-y-2"
            >
              <div className="flex items-center justify-center gap-2 font-bold text-lg">
                <Sparkles className="w-6 h-6 text-amber-500 animate-bounce" />
                <span>تم إنشاء الحساب بنجاح!</span>
              </div>
              <p className="text-sm">أهلاً بك يا بطل، جاري توجيهك إلى منصة التعلم الآن...</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 font-ibm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  الاسم بالكامل (ثلاثي أو رباعي)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="أحمد محمد علي"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth"
                  />
                  <User className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
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
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth text-right"
                  />
                  <User className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                </div>
              </div>

              {/* Student Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  رقم هاتف الطالب (واتساب)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth"
                  />
                  <Phone className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                </div>
              </div>

              {/* Parent Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  رقم هاتف ولي الأمر
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01112345678"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth"
                  />
                  <Phone className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                </div>
              </div>

              {/* Grade / Year */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  السنة الدراسية
                </label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth appearance-none"
                  >
                    {YEARS.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.title} ({y.badge})
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="w-5 h-5 absolute top-4 right-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  المحافظة
                </label>
                <div className="relative">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth appearance-none"
                  >
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-5 h-5 absolute top-4 right-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
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
                    className="w-full px-4 py-3.5 pr-11 pl-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth"
                  />
                  <Lock className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-4 left-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="تبديل إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47C780] focus:border-transparent smooth"
                  />
                  <Lock className="w-5 h-5 absolute top-4 right-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#47C780] to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-70 transition flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>إنشاء الحساب والبدء الآن</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer link */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-700 text-center text-sm font-ibm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟{' '}
            <a href="/login" className="font-bold text-[#47C780] hover:underline">
              تسجيل الدخول
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}