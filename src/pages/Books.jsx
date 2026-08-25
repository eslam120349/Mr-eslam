import { useEffect, useState } from 'react'
import SEO from "../components/SEO";
import { Link } from 'react-router-dom'
import {
    BookOpen,
    ArrowLeft,
    Search,
    Library,
    Sparkles,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Books() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            setError('')

            const { data, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching books:', error)
                setError('حدث خطأ أثناء تحميل الكتب')
            } else {
                setBooks(data || [])
            }

            setLoading(false)
        }

        fetchBooks()
    }, [])

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredBooks = books.filter((book) => {
        const query = search.trim().toLowerCase()

        if (!query) return true

        return (
            book.title?.toLowerCase().includes(query) ||
            book.subject?.toLowerCase().includes(query) ||
            book.grade?.toLowerCase().includes(query)
        )
    })

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <section className="min-h-[70vh] px-4 sm:px-6 py-12 font-ibm">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col items-center justify-center py-24">

                        <div className="w-16 h-16 rounded-2xl bg-dodger-50 dark:bg-dodger-900/30 flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-dodger-600 animate-pulse" />
                        </div>

                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            جاري تحميل الكتب...
                        </p>

                    </div>

                </div>
            </section>
        )
    }

    // --------------------------------------------------
    // ERROR
    // --------------------------------------------------

    if (error) {
        return (
            <section className="min-h-[70vh] px-4 sm:px-6 py-12 font-ibm">
                <div className="max-w-7xl mx-auto">

                    <div className="rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-10 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
                            تعذر تحميل الكتب
                        </h2>

                        <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">
                            {error}
                        </p>

                    </div>

                </div>
            </section>
        )
    }

    return (

        <section className="min-h-screen px-4 sm:px-6 py-10 sm:py-14 font-ibm">
        <SEO
  title="كتب الرياضيات | مستر اسلام سعيد"
  description="كتب ومذكرات الرياضيات Math للمراجعة والتأسيس والاستعداد للامتحانات مع مستر اسلام سعيد."
  canonical="https://mreslam.cc.cd/books"
/>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* =====================================================
            HEADER
        ====================================================== */}

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dodger-700 to-dodger-900 text-white p-7 sm:p-10 shadow-xl">

                    {/* Decorative circles */}

                    <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

                    <div className="absolute -bottom-32 right-10 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

                    <div className="relative z-10">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            <div>

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-dodger-100 text-xs font-bold mb-4">

                                    <Library className="w-4 h-4" />

                                    <span>
                                        مكتبة المنصة
                                    </span>

                                </div>

                                <h1 className="font-messiri text-3xl sm:text-4xl font-bold">
                                    الكتب والمذكرات
                                </h1>

                                <p className="mt-3 text-sm sm:text-base text-dodger-100 max-w-2xl leading-7">
                                    تصفح الكتب والمذكرات التعليمية المتاحة
                                    على منصة مستر إسلام واستفد منها في دراستك.
                                </p>

                            </div>

                            <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white/10 border border-white/10 items-center justify-center shrink-0">

                                <BookOpen className="w-10 h-10 text-white" />

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================================
            SEARCH
        ====================================================== */}

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">

                    <div>

                        <h2 className="font-messiri text-xl font-bold text-gray-900 dark:text-white">
                            مكتبة الكتب
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {books.length} كتاب متاح
                        </p>

                    </div>

                    <div className="relative w-full sm:w-80">

                        <input
                            type="text"
                            placeholder="ابحث عن كتاب..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 focus:ring-2 focus:ring-dodger-500/10 transition"
                        />

                        <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />

                    </div>

                </div>

                {/* =====================================================
            BOOKS
        ====================================================== */}

                {filteredBooks.length === 0 ? (

                    <div className="rounded-3xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-sm">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-dodger-50 dark:bg-dodger-900/30 flex items-center justify-center mb-4">

                            <BookOpen className="w-8 h-8 text-dodger-500" />

                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {search
                                ? 'لا توجد نتائج'
                                : 'لا توجد كتب متاحة حاليًا'}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {search
                                ? 'جرب البحث باستخدام اسم كتاب مختلف.'
                                : 'سيتم إضافة الكتب والمذكرات قريبًا.'}
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {filteredBooks.map((book) => (

                            <div
                                key={book.id}
                                className="group overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >

                                {/* =================================================
                    COVER
                ================================================== */}

                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-gray-900">

                                    {book.cover_url ? (

                                        <img
                                            src={book.cover_url}
                                            alt={book.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                    ) : (

                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-dodger-50 to-slate-100 dark:from-dodger-950/40 dark:to-gray-900">

                                            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">

                                                <BookOpen
                                                    size={40}
                                                    className="text-dodger-500"
                                                />

                                            </div>

                                            <span className="mt-4 text-xs font-bold text-gray-400">
                                                لا توجد صورة للكتاب
                                            </span>

                                        </div>

                                    )}

                                    {/* Grade Badge */}

                                    {book.grade && (

                                        <div className="absolute top-3 right-3">

                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-dodger-700 dark:text-dodger-300 text-[11px] font-bold shadow-lg">

                                                {book.grade}

                                            </span>

                                        </div>

                                    )}

                                </div>

                                {/* =================================================
                    CONTENT
                ================================================== */}

                                <div className="p-5">

                                    {book.subject && (

                                        <div className="flex items-center gap-1.5 text-dodger-600 dark:text-dodger-400 text-xs font-bold">

                                            <Sparkles className="w-3.5 h-3.5" />

                                            <span>
                                                {book.subject}
                                            </span>

                                        </div>

                                    )}

                                    <h2 className="mt-2 font-messiri text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-7">

                                        {book.title}

                                    </h2>

                                    {book.description && (

                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-6">

                                            {book.description}

                                        </p>

                                    )}

                                    {/* Read Button */}

                                    <Link
                                        to={`/books/${book.id}`}
                                        className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white px-4 py-3 text-sm font-bold shadow-sm hover:shadow-md transition"
                                    >

                                        <BookOpen className="w-4 h-4" />

                                        <span>
                                            قراءة الكتاب
                                        </span>

                                        <ArrowLeft className="w-4 h-4 mr-auto" />

                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>
    )
}