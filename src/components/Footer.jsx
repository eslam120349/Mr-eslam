import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send, ArrowUpRight, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Custom SVG Icons for Youtube, Telegram, Facebook to guarantee valid rendering
function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TelegramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.752-.169.706-.433.943-.684.966-.547.05-1.077-.384-1.606-.731-.828-.543-1.295-.881-2.098-1.41-.928-.612-.326-.949.203-1.499.138-.144 2.535-2.325 2.582-2.525.006-.025.01-.119-.045-.168-.055-.049-.136-.032-.195-.019-.083.018-1.408.895-3.974 2.628-.376.258-.716.386-1.021.379-.336-.008-.983-.191-1.464-.347-.59-.192-1.058-.294-1.017-.621.021-.171.258-.346.71-.525 2.784-1.213 4.641-2.013 5.571-2.4 2.648-1.1 3.199-1.292 3.557-1.298.079-.001.255.018.37.112.097.079.124.186.136.262.01.066.021.218.012.338z" />
    </svg>
  )
}

const SOCIALS = [
  { icon: YoutubeIcon, name: 'يوتيوب', href: 'https://www.youtube.com/channel/UCZmQMG4vx3xncQogurpyCDw' },
  { icon: FacebookIcon, name: 'فيسبوك', href: 'https://www.facebook.com/profile.php?id=61567028243039' },
]

export default function Footer() {
  // رابط لوحة الأدمن يظهر بس لو فيه session حقيقي والـ role بتاعه admin فعلاً
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminAccess()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAdminAccess()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const checkAdminAccess = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setIsAdmin(false)
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    setIsAdmin(!error && profile?.role === 'admin')
  }

  return (
    <footer className="py-12 bg-dodger-950 text-white font-ibm relative overflow-hidden border-t border-dodger-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* Col 1: Brand info */}
          <div className="space-y-4 text-center md:text-right">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white text-dodger-900 flex items-center justify-center font-khaled text-2xl font-bold">
                إ
              </div>
              <div>
                <span className="font-messiri font-bold text-xl block text-white">
                  مستر إسلام | مدرس رياضيات
                </span>
                <span className="text-xs text-dodger-300">طريقك للتفوق في الرياضيات</span>
              </div>
            </Link>
            <p className="text-xs text-dodger-200 leading-relaxed max-w-sm">
              منصة تعليمية متخصصة لشرح منهج الرياضيات للمرحلتين الإعدادية والثانوية بأحدث الوسائل التفاعلية.
            </p>
          </div>

          {/* Col 2: Social media */}
          <div className="space-y-3 text-center">
            <p className="text-xs font-bold text-dodger-300">تابعنا على وسائل التواصل الاجتماعي:</p>
            <div className="flex gap-4 justify-center">
              {SOCIALS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-2xl bg-dodger-900 hover:bg-dodger-700 border border-dodger-800 flex items-center justify-center text-dodger-200 hover:text-white transition shadow-sm"
                    aria-label={s.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Col 3: CTA */}
          <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-end">
            <h3 className="font-messiri font-bold text-lg text-white">
              جاهز تبدأ رحلتك في الرياضيات؟
            </h3>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[#47C780] hover:bg-[#3db372] text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <span>سجّل حسابك الآن مجاناً</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="h-px bg-dodger-900 w-full" />

        {/* Bottom credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-dodger-300 gap-4">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة مستر إسلام للرياضيات</p>

          {isAdmin && (
            <Link to="/admin" className="text-dodger-400 hover:text-white font-bold transition flex items-center gap-1">
              <span>👑 لوحة الأدمن والتحكم</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}