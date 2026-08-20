import { useEffect, useState } from 'react'
import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Loader2,
    ExternalLink,
    Search,
    AlertTriangle,
} from 'lucide-react'

import {
    fetchBooksFromSupabase,
    createBookInSupabase,
    updateBookInSupabase,
    deleteBookFromSupabase,
} from '../../lib/supabase'

const EMPTY_BOOK = {
    title: '',
    description: '',
    grade: '',
    subject: '',
    coverUrl: '',
    driveId: '',
}

export default function BooksManager() {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [showForm, setShowForm] = useState(false)
    const [editingBook, setEditingBook] = useState(null)

    const [formData, setFormData] = useState(EMPTY_BOOK)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const [search, setSearch] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        loadBooks()
    }, [])

    const loadBooks = async () => {
        setIsLoading(true)
        setError('')

        try {
            const data = await fetchBooksFromSupabase()
            setBooks(data || [])
        } catch (err) {
            console.error(err)
            setError('حدث خطأ أثناء تحميل الكتب.')
        } finally {
            setIsLoading(false)
        }
    }

    // --------------------------------------------------
    // OPEN ADD FORM
    // --------------------------------------------------

    const handleOpenAdd = () => {
        setEditingBook(null)
        setFormData(EMPTY_BOOK)
        setShowForm(true)
    }

    // --------------------------------------------------
    // OPEN EDIT FORM
    // --------------------------------------------------

    const handleOpenEdit = (book) => {
        setEditingBook(book)

        setFormData({
            title: book.title || '',
            description: book.description || '',
            grade: book.grade || '',
            subject: book.subject || '',
            coverUrl: book.cover_url || '',
            driveId: book.drive_id || '',
        })

        setShowForm(true)
    }

    // --------------------------------------------------
    // CLOSE FORM
    // --------------------------------------------------

    const handleCloseForm = () => {
        if (isSubmitting) return

        setShowForm(false)
        setEditingBook(null)
        setFormData(EMPTY_BOOK)
    }

    // --------------------------------------------------
    // CHANGE INPUT
    // --------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // --------------------------------------------------
    // SAVE BOOK
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim()) {
            alert('يرجى إدخال اسم الكتاب.')
            return
        }

        if (!formData.driveId.trim()) {
            alert('يرجى إدخال Google Drive ID للكتاب.')
            return
        }

        setIsSubmitting(true)

        try {
            if (editingBook) {
                await updateBookInSupabase(editingBook.id, formData)
                alert('تم تعديل الكتاب بنجاح ✅')
            } else {
                await createBookInSupabase(formData)
                alert('تم إضافة الكتاب بنجاح ✅')
            }

            await loadBooks()

            handleCloseForm()
        } catch (err) {
            console.error(err)

            alert(
                err?.message ||
                'حدث خطأ أثناء حفظ الكتاب. تأكد من إعداد جدول books في Supabase.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // --------------------------------------------------
    // DELETE BOOK
    // --------------------------------------------------

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'هل أنت متأكد من حذف هذا الكتاب؟\n\nسيتم حذفه من قاعدة البيانات.'
        )

        if (!confirmed) return

        setDeletingId(id)

        try {
            await deleteBookFromSupabase(id)

            setBooks((prev) => prev.filter((book) => book.id !== id))
        } catch (err) {
            console.error(err)
            alert('حدث خطأ أثناء حذف الكتاب.')
        } finally {
            setDeletingId(null)
        }
    }

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredBooks = books.filter((book) => {
        const query = search.toLowerCase()

        return (
            book.title?.toLowerCase().includes(query) ||
            book.subject?.toLowerCase().includes(query) ||
            book.grade?.toLowerCase().includes(query)
        )
    })

    // --------------------------------------------------
    // GOOGLE DRIVE PREVIEW
    // --------------------------------------------------

    const getPreviewUrl = (driveId) => {
        if (!driveId) return '#'

        return `https://drive.google.com/file/d/${driveId}/preview`
    }

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 border border-slate-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-dodger-600" />

                    <span className="text-sm font-bold">
                        جاري تحميل الكتب...
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700 shadow-sm">

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-dodger-50 dark:bg-dodger-950/40 text-dodger-600 dark:text-dodger-400 flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-messiri">
                                إدارة الكتب
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                إضافة وإدارة الكتب التعليمية الخاصة بالطلاب
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={handleOpenAdd}
                        className="px-5 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />

                        <span>
                            إضافة كتاب جديد
                        </span>
                    </button>

                </div>

            </div>

            {/* ======================================================
          ERROR
      ====================================================== */}

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-bold">

                    <AlertTriangle className="w-4 h-4" />

                    <span>
                        {error}
                    </span>

                </div>
            )}

            {/* ======================================================
          SEARCH + STATS
      ====================================================== */}

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>

                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            الكتب الحالية
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            إجمالي الكتب: {books.length}
                        </p>

                    </div>

                    <div className="relative w-full sm:w-72">

                        <input
                            type="text"
                            placeholder="ابحث عن كتاب..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition"
                        />

                        <Search className="w-4 h-4 absolute top-3 right-3 text-gray-400" />

                    </div>

                </div>

            </div>

            {/* ======================================================
          BOOKS TABLE
      ====================================================== */}

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">

                {filteredBooks.length === 0 ? (

                    <div className="py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-gray-900 flex items-center justify-center mb-4">

                            <BookOpen className="w-7 h-7 text-gray-400" />

                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white">
                            لا توجد كتب
                        </h3>

                        <p className="text-xs text-gray-500 mt-2">
                            {search
                                ? 'لا توجد كتب تطابق عملية البحث.'
                                : 'لم تتم إضافة أي كتب حتى الآن.'}
                        </p>

                        {!search && (
                            <button
                                onClick={handleOpenAdd}
                                className="mt-5 px-5 py-2.5 rounded-xl bg-dodger-600 hover:bg-dodger-700 text-white font-bold text-xs transition inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة أول كتاب
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-right">

                            <thead className="bg-slate-100 dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400">

                                <tr>

                                    <th className="p-3">
                                        الكتاب
                                    </th>

                                    <th className="p-3">
                                        الصف
                                    </th>

                                    <th className="p-3">
                                        المادة
                                    </th>

                                    <th className="p-3">
                                        Google Drive
                                    </th>

                                    <th className="p-3">
                                        الإجراءات
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">

                                {filteredBooks.map((book) => (

                                    <tr
                                        key={book.id}
                                        className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition"
                                    >

                                        {/* BOOK */}

                                        <td className="p-3">

                                            <div className="flex items-center gap-3 min-w-[230px]">

                                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-gray-900 flex-shrink-0">

                                                    {book.cover_url ? (

                                                        <img
                                                            src={book.cover_url}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />

                                                    ) : (

                                                        <div className="w-full h-full flex items-center justify-center">

                                                            <BookOpen className="w-5 h-5 text-gray-400" />

                                                        </div>

                                                    )}

                                                </div>

                                                <div className="min-w-0">

                                                    <div className="font-bold text-gray-900 dark:text-white truncate max-w-[260px]">
                                                        {book.title}
                                                    </div>

                                                    {book.description && (

                                                        <div className="text-[11px] text-gray-500 truncate max-w-[260px] mt-1">
                                                            {book.description}
                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        </td>

                                        {/* GRADE */}

                                        <td className="p-3 text-xs">

                                            {book.grade || '—'}

                                        </td>

                                        {/* SUBJECT */}

                                        <td className="p-3 text-xs">

                                            {book.subject || '—'}

                                        </td>

                                        {/* DRIVE */}

                                        <td className="p-3">

                                            {book.drive_id ? (

                                                <a
                                                    href={getPreviewUrl(book.drive_id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dodger-50 dark:bg-dodger-950/40 text-dodger-600 dark:text-dodger-400 hover:bg-dodger-100 dark:hover:bg-dodger-950/70 text-xs font-bold transition"
                                                >

                                                    <ExternalLink className="w-3.5 h-3.5" />

                                                    عرض الكتاب

                                                </a>

                                            ) : (

                                                <span className="text-xs text-gray-400">
                                                    غير متوفر
                                                </span>

                                            )}

                                        </td>

                                        {/* ACTIONS */}

                                        <td className="p-3">

                                            <div className="flex items-center gap-1.5">

                                                <button
                                                    onClick={() => handleOpenEdit(book)}
                                                    className="p-1.5 rounded-lg bg-dodger-50 dark:bg-dodger-950/40 text-dodger-600 dark:text-dodger-400 hover:bg-dodger-100 dark:hover:bg-dodger-950/70 text-xs flex items-center gap-1 transition"
                                                >

                                                    <Pencil className="w-4 h-4" />

                                                    <span>
                                                        تعديل
                                                    </span>

                                                </button>

                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    disabled={deletingId === book.id}
                                                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50 text-xs flex items-center gap-1 transition"
                                                >

                                                    {deletingId === book.id ? (

                                                        <Loader2 className="w-4 h-4 animate-spin" />

                                                    ) : (

                                                        <Trash2 className="w-4 h-4" />

                                                    )}

                                                    <span>
                                                        حذف
                                                    </span>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-dodger-50 dark:bg-dodger-950/40 text-dodger-600 flex items-center justify-center">

                                    {editingBook ? (
                                        <Pencil className="w-5 h-5" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}

                                </div>

                                <div>

                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">

                                        {editingBook
                                            ? 'تعديل الكتاب'
                                            : 'إضافة كتاب جديد'}

                                    </h3>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">

                                        {editingBook
                                            ? 'تعديل بيانات الكتاب الحالي'
                                            : 'أضف بيانات الكتاب ورابط Google Drive'}

                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={handleCloseForm}
                                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition"
                            >

                                <X className="w-5 h-5" />

                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >

                            {/* TITLE */}

                            <div className="sm:col-span-2">

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    اسم الكتاب
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="مثال: كتاب الرياضيات للصف الثالث الثانوي"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition"
                                />

                            </div>

                            {/* GRADE */}

                            <div>

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    الصف الدراسي
                                </label>

                                <input
                                    type="text"
                                    name="grade"
                                    placeholder="مثال: الصف الثالث الثانوي"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition"
                                />

                            </div>

                            {/* SUBJECT */}

                            <div>

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    المادة
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="مثال: الرياضيات"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="sm:col-span-2">

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    وصف الكتاب
                                </label>

                                <textarea
                                    name="description"
                                    rows="3"
                                    placeholder="وصف مختصر للكتاب..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition resize-none"
                                />

                            </div>

                            {/* COVER */}

                            <div className="sm:col-span-2">

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    رابط صورة غلاف الكتاب
                                    <span className="font-normal text-gray-400">
                                        {' '}— اختياري
                                    </span>
                                </label>

                                <input
                                    type="url"
                                    name="coverUrl"
                                    placeholder="https://..."
                                    value={formData.coverUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition font-mono"
                                />

                            </div>

                            {/* DRIVE ID */}

                            <div className="sm:col-span-2">

                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Google Drive File ID
                                </label>

                                <input
                                    type="text"
                                    name="driveId"
                                    required
                                    placeholder="مثال: 1AbCdEfGhIjKlMnOpQrStUvWxYz"
                                    value={formData.driveId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-dodger-500 transition font-mono"
                                />

                                <p className="text-[11px] text-gray-500 mt-2">
                                    من رابط Google Drive:
                                    <span className="font-mono text-dodger-600 dark:text-dodger-400 mx-1">
                                        /file/d/FILE_ID/view
                                    </span>
                                    انسخ الجزء الموجود مكان FILE_ID فقط.
                                </p>

                            </div>

                            {/* ACTIONS */}

                            <div className="sm:col-span-2 flex gap-3 pt-2">

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                                >

                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : editingBook ? (
                                        <Save className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}

                                    <span>
                                        {isSubmitting
                                            ? 'جاري الحفظ...'
                                            : editingBook
                                                ? 'حفظ التعديلات'
                                                : 'إضافة الكتاب'}
                                    </span>

                                </button>

                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 font-bold text-sm transition disabled:opacity-50"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    )
}