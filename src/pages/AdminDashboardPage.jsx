import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Sparkles,
  Search,
  Loader2,
  AlertTriangle,
  X,
  Save,
} from 'lucide-react'

import { YEARS, GOVERNORATES } from '../data/dummyData'

import {
  isSupabaseConfigured,
  fetchLessonsFromSupabase,
  createLessonInSupabase,
  updateLessonInSupabase,
  deleteLessonFromSupabase,
  fetchPastExamsFromSupabase,
  createPastExamInSupabase,
  updatePastExamInSupabase,
  deletePastExamFromSupabase,
  fetchStudentsFromSupabase,
  updateStudentInSupabase,
  toggleStudentActiveInSupabase,
} from '../lib/supabase'

import BooksManager from '../components/admin/BooksManager'


// ============================================================
// EMPTY DATA
// ============================================================

const EMPTY_LESSON = {
  title: '',
  yearId: '3',
  semester: 1,
  branch: 'الجبر والإحصاء',
  unit: 'الوحدة الأولى',
  duration: '45 دقيقة',
  videoUrl: '',
  isFree: true,
  summaryPdfName: '',
  description: '',
}

const EMPTY_EXAM = {
  title: '',
  yearId: '3',
  governorate: 'القاهرة',
  yearNum: '2024',
  semester: 1,
  branch: 'الجبر والإحصاء',
  pdfName: '',
  videoSolutionUrl: '',
}


// ============================================================
// PAGE
// ============================================================

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')

  const [configured] = useState(isSupabaseConfigured())

  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [lessonsList, setLessonsList] = useState([])
  const [examsList, setExamsList] = useState([])
  const [studentsList, setStudentsList] = useState([])

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false)
  const [isSubmittingExam, setIsSubmittingExam] = useState(false)
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  // ----------------------------------------------------------
  // FORMS
  // ----------------------------------------------------------

  const [newLesson, setNewLesson] = useState(EMPTY_LESSON)
  const [newExam, setNewExam] = useState(EMPTY_EXAM)

  // ----------------------------------------------------------
  // EDIT MODALS
  // ----------------------------------------------------------

  const [editingLesson, setEditingLesson] = useState(null)
  const [editingExam, setEditingExam] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  const [searchStudent, setSearchStudent] = useState('')


  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const [
        lessons,
        exams,
        students,
      ] = await Promise.all([
        fetchLessonsFromSupabase(),
        fetchPastExamsFromSupabase(),
        fetchStudentsFromSupabase(),
      ])

      setLessonsList(lessons || [])
      setExamsList(exams || [])
      setStudentsList(students || [])
    } catch (err) {
      console.error(err)

      setLoadError(
        'حدث خطأ أثناء تحميل البيانات من قاعدة البيانات.'
      )
    } finally {
      setIsLoading(false)
    }
  }


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    navigate('/')
  }


  // ============================================================
  // LESSONS - CREATE
  // ============================================================

  const handleAddLesson = async (e) => {
    e.preventDefault()

    if (!newLesson.title || !newLesson.videoUrl) {
      alert('يرجى إدخال عنوان الدرس ورابط الفيديو.')
      return
    }

    if (!configured) {
      alert(
        'Supabase غير متصل. تأكد من إعداد متغيرات البيئة.'
      )
      return
    }

    setIsSubmittingLesson(true)

    try {
      await createLessonInSupabase(newLesson)

      await loadAllData()

      alert('تم إضافة الدرس بنجاح ونشره بالمنصة!')

      setNewLesson(EMPTY_LESSON)
    } catch (err) {
      console.error(err)

      alert(
        err?.message ||
        'حدث خطأ أثناء إضافة الدرس.'
      )
    } finally {
      setIsSubmittingLesson(false)
    }
  }


  // ============================================================
  // LESSONS - UPDATE
  // ============================================================

  const handleUpdateLesson = async (e) => {
    e.preventDefault()

    if (
      !editingLesson?.title ||
      !editingLesson?.videoUrl
    ) {
      alert('يرجى إدخال عنوان الدرس ورابط الفيديو.')
      return
    }

    setIsSubmittingLesson(true)

    try {
      await updateLessonInSupabase(
        editingLesson.id,
        editingLesson
      )

      await loadAllData()

      setEditingLesson(null)

      alert('تم تعديل الدرس بنجاح.')
    } catch (err) {
      console.error(err)

      alert(
        err?.message ||
        'حدث خطأ أثناء تعديل الدرس.'
      )
    } finally {
      setIsSubmittingLesson(false)
    }
  }


  // ============================================================
  // LESSONS - DELETE
  // ============================================================

  const handleDeleteLesson = async (id) => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف هذا الدرس؟'
    )

    if (!confirmed) return

    setDeletingId(id)

    try {
      await deleteLessonFromSupabase(id)

      setLessonsList((prev) =>
        prev.filter((lesson) => lesson.id !== id)
      )

      alert('تم حذف الدرس.')
    } catch (err) {
      console.error(err)

      alert('حدث خطأ أثناء حذف الدرس.')
    } finally {
      setDeletingId(null)
    }
  }


  // ============================================================
  // EXAMS - CREATE
  // ============================================================

  const handleAddExam = async (e) => {
    e.preventDefault()

    if (!newExam.title) {
      alert('يرجى إدخال عنوان الامتحان.')
      return
    }

    if (!configured) {
      alert(
        'Supabase غير متصل. تأكد من إعداد متغيرات البيئة.'
      )
      return
    }

    setIsSubmittingExam(true)

    try {
      await createPastExamInSupabase(newExam)

      await loadAllData()

      alert('تم إضافة الامتحان بنجاح!')

      setNewExam(EMPTY_EXAM)
    } catch (err) {
      console.error(err)

      alert(
        err?.message ||
        'حدث خطأ أثناء إضافة الامتحان.'
      )
    } finally {
      setIsSubmittingExam(false)
    }
  }


  // ============================================================
  // EXAMS - UPDATE
  // ============================================================

  const handleUpdateExam = async (e) => {
    e.preventDefault()

    if (!editingExam?.title) {
      alert('يرجى إدخال عنوان الامتحان.')
      return
    }

    setIsSubmittingExam(true)

    try {
      await updatePastExamInSupabase(
        editingExam.id,
        editingExam
      )

      await loadAllData()

      setEditingExam(null)

      alert('تم تعديل الامتحان بنجاح.')
    } catch (err) {
      console.error(err)

      alert(
        err?.message ||
        'حدث خطأ أثناء تعديل الامتحان.'
      )
    } finally {
      setIsSubmittingExam(false)
    }
  }


  // ============================================================
  // EXAMS - DELETE
  // ============================================================

  const handleDeleteExam = async (id) => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف هذا الامتحان؟'
    )

    if (!confirmed) return

    setDeletingId(id)

    try {
      await deletePastExamFromSupabase(id)

      setExamsList((prev) =>
        prev.filter((exam) => exam.id !== id)
      )

      alert('تم حذف الامتحان.')
    } catch (err) {
      console.error(err)

      alert('حدث خطأ أثناء حذف الامتحان.')
    } finally {
      setDeletingId(null)
    }
  }


  // ============================================================
  // STUDENTS
  // ============================================================

  const toggleStudentStatus = async (
    id,
    currentStatus
  ) => {
    try {
      await toggleStudentActiveInSupabase(
        id,
        currentStatus
      )

      setStudentsList((prev) =>
        prev.map((student) =>
          student.id === id
            ? {
              ...student,
              isActive: !currentStatus,
            }
            : student
        )
      )
    } catch (err) {
      console.error(err)

      alert(
        'حدث خطأ أثناء تحديث حالة الطالب.'
      )
    }
  }


  // ============================================================
  // STUDENTS - UPDATE
  // ============================================================

  const handleUpdateStudent = async (e) => {
    e.preventDefault()

    if (
      !editingStudent?.name ||
      !editingStudent?.phone ||
      !editingStudent?.parentPhone
    ) {
      alert(
        'يرجى ملء اسم الطالب ورقمي الهاتف.'
      )

      return
    }

    setIsSubmittingStudent(true)

    try {
      await updateStudentInSupabase(
        editingStudent.id,
        editingStudent
      )

      await loadAllData()

      setEditingStudent(null)

      alert('تم تعديل بيانات الطالب بنجاح.')
    } catch (err) {
      console.error(err)

      alert(
        err?.message ||
        'حدث خطأ أثناء تعديل بيانات الطالب.'
      )
    } finally {
      setIsSubmittingStudent(false)
    }
  }


  // ============================================================
  // FILTER STUDENTS
  // ============================================================

  const filteredStudents = studentsList.filter(
    (student) => {
      const name =
        student.name?.toLowerCase() || ''

      const phone =
        student.phone || ''

      const query =
        searchStudent.toLowerCase()

      return (
        name.includes(query) ||
        phone.includes(searchStudent)
      )
    }
  )


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 font-ibm"
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-dodger-600 to-blue-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            👑
          </div>

          <div>

            <h1 className="text-2xl font-bold font-messiri text-gray-900 dark:text-white">
              لوحة إدارة منصة مستر إسلام
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              إدارة الدروس والكتب والامتحانات والطلاب
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2 hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />

            <span>
              تسجيل الخروج
            </span>
          </button>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {loadError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-bold">

          <AlertTriangle className="w-4 h-4" />

          <span>
            {loadError}
          </span>

        </div>
      )}


      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-2">

        {/* OVERVIEW */}

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'overview'
              ? 'bg-dodger-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-dodger-50'
            }`}
        >
          <Sparkles className="w-4 h-4" />

          <span>
            الإحصائيات العامة
          </span>
        </button>


        {/* LESSONS */}

        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'lessons'
              ? 'bg-dodger-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-dodger-50'
            }`}
        >
          <BookOpen className="w-4 h-4" />

          <span>
            الدروس والفيديوهات ({lessonsList.length})
          </span>
        </button>


        {/* BOOKS */}

        <button
          onClick={() => setActiveTab('books')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'books'
              ? 'bg-dodger-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-dodger-50'
            }`}
        >
          <BookOpen className="w-4 h-4" />

          <span>
            الكتب
          </span>
        </button>


        {/* EXAMS */}

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'exams'
              ? 'bg-dodger-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-dodger-50'
            }`}
        >
          <FileText className="w-4 h-4" />

          <span>
            الامتحانات ({examsList.length})
          </span>
        </button>


        {/* STUDENTS */}

        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'students'
              ? 'bg-dodger-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-dodger-50'
            }`}
        >
          <Users className="w-4 h-4" />

          <span>
            الطلاب ({studentsList.length})
          </span>
        </button>

      </div>


      {/* ======================================================
          LOADING
      ====================================================== */}

      {isLoading ? (

        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">

          <Loader2 className="w-8 h-8 animate-spin text-dodger-600" />

          <span className="text-sm font-bold">
            جاري تحميل البيانات...
          </span>

        </div>

      ) : (

        <>

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          {activeTab === 'overview' && (

            <div className="space-y-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* STUDENTS */}

                <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm space-y-2">

                  <div className="text-xs text-gray-500 font-bold">
                    إجمالي الطلاب
                  </div>

                  <div className="text-3xl font-bold text-dodger-600">
                    {studentsList.length}
                  </div>

                </div>


                {/* LESSONS */}

                <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm space-y-2">

                  <div className="text-xs text-gray-500 font-bold">
                    إجمالي الدروس
                  </div>

                  <div className="text-3xl font-bold text-emerald-600">
                    {lessonsList.length}
                  </div>

                </div>


                {/* EXAMS */}

                <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm space-y-2">

                  <div className="text-xs text-gray-500 font-bold">
                    الامتحانات
                  </div>

                  <div className="text-3xl font-bold text-amber-500">
                    {examsList.length}
                  </div>

                </div>


                {/* ACTIVE */}

                <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm space-y-2">

                  <div className="text-xs text-gray-500 font-bold">
                    الطلاب المفعّلين
                  </div>

                  <div className="text-3xl font-bold text-purple-600">
                    {
                      studentsList.filter(
                        (student) => student.isActive
                      ).length
                    }
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* ==================================================
              BOOKS
          ================================================== */}

          {activeTab === 'books' && (
            <BooksManager />
          )}


          {/* ==================================================
              LESSONS
          ================================================== */}

          {activeTab === 'lessons' && (

            <div className="space-y-8">

              {/* ADD LESSON */}

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">

                <div className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">

                  <Plus className="w-5 h-5 text-dodger-600" />

                  <span>
                    إضافة درس جديد
                  </span>

                </div>


                <form
                  onSubmit={handleAddLesson}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >

                  {/* TITLE */}

                  <div className="sm:col-span-2">

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      عنوان الدرس
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="مثال: حاصل الضرب الديكارتي"
                      value={newLesson.title}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                    />

                  </div>


                  {/* GRADE */}

                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      الصف الدراسي
                    </label>

                    <select
                      value={newLesson.yearId}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          yearId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    >

                      {YEARS.map((year) => (

                        <option
                          key={year.id}
                          value={year.id}
                        >
                          {year.title}
                        </option>

                      ))}

                    </select>

                  </div>


                  {/* BRANCH */}

                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      الفرع
                    </label>

                    <input
                      type="text"
                      required
                      value={newLesson.branch}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          branch: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    />

                  </div>


                  {/* VIDEO */}

                  <div className="sm:col-span-2">

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      رابط الفيديو
                    </label>

                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={newLesson.videoUrl}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          videoUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-mono"
                    />

                  </div>


                  {/* PDF NAME */}

                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      اسم ملخص الدرس
                    </label>

                    <input
                      type="text"
                      placeholder="ملخص.pdf"
                      value={newLesson.summaryPdfName}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          summaryPdfName:
                            e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    />

                  </div>


                  {/* DURATION */}

                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      مدة الدرس
                    </label>

                    <input
                      type="text"
                      placeholder="45 دقيقة"
                      value={newLesson.duration}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    />

                  </div>


                  {/* SUBMIT */}

                  <div className="sm:col-span-2">

                    <button
                      type="submit"
                      disabled={isSubmittingLesson}
                      className="px-6 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 disabled:opacity-60 text-white font-bold text-sm shadow transition flex items-center gap-2"
                    >

                      {isSubmittingLesson && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}

                      <span>
                        {isSubmittingLesson
                          ? 'جاري الحفظ...'
                          : 'حفظ ونشر الدرس'}
                      </span>

                    </button>

                  </div>

                </form>

              </div>


              {/* LESSONS TABLE */}

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-4">

                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  قائمة الدروس
                </h3>

                {lessonsList.length === 0 ? (

                  <p className="text-xs text-gray-500 text-center py-8">
                    لا توجد دروس مضافة بعد.
                  </p>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm text-right">

                      <thead className="bg-slate-100 dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400">

                        <tr>

                          <th className="p-3">
                            عنوان الدرس
                          </th>

                          <th className="p-3">
                            الصف
                          </th>

                          <th className="p-3">
                            الفرع
                          </th>

                          <th className="p-3">
                            الإجراءات
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-gray-700">

                        {lessonsList.map((lesson) => (

                          <tr
                            key={lesson.id}
                            className="hover:bg-slate-50 dark:hover:bg-gray-700/50"
                          >

                            <td className="p-3 font-bold text-gray-900 dark:text-white">
                              {lesson.title}
                            </td>

                            <td className="p-3 text-xs">
                              {
                                YEARS.find(
                                  (year) =>
                                    year.id ===
                                    lesson.yearId
                                )?.title || 'عام'
                              }
                            </td>

                            <td className="p-3 text-xs">
                              {lesson.branch}
                            </td>

                            <td className="p-3">

                              <div className="flex items-center gap-1.5">

                                <button
                                  onClick={() =>
                                    setEditingLesson({
                                      ...lesson,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-dodger-50 text-dodger-600 hover:bg-dodger-100 text-xs flex items-center gap-1"
                                >

                                  <Pencil className="w-4 h-4" />

                                  <span>
                                    تعديل
                                  </span>

                                </button>


                                <button
                                  onClick={() =>
                                    handleDeleteLesson(
                                      lesson.id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    lesson.id
                                  }
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 text-xs flex items-center gap-1"
                                >

                                  {deletingId ===
                                    lesson.id ? (
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

            </div>
          )}


          {/* ==================================================
              EXAMS
          ================================================== */}

          {activeTab === 'exams' && (

            <div className="space-y-8">

              {/* ADD EXAM */}

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">

                <div className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">

                  <Plus className="w-5 h-5 text-amber-500" />

                  <span>
                    إضافة امتحان محافظة جديد
                  </span>

                </div>


                <form
                  onSubmit={handleAddExam}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >

                  <div className="sm:col-span-2">

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      عنوان الامتحان
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="امتحان محافظة القاهرة 2024"
                      value={newExam.title}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      المحافظة
                    </label>

                    <select
                      value={newExam.governorate}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          governorate:
                            e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    >

                      {GOVERNORATES.map(
                        (governorate) => (

                          <option
                            key={governorate}
                            value={governorate}
                          >
                            {governorate}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      سنة الامتحان
                    </label>

                    <input
                      type="text"
                      value={newExam.yearNum}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          yearNum: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                    />

                  </div>


                  <div className="sm:col-span-2">

                    <button
                      type="submit"
                      disabled={isSubmittingExam}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-sm shadow transition flex items-center gap-2"
                    >

                      {isSubmittingExam && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}

                      <span>
                        {isSubmittingExam
                          ? 'جاري الحفظ...'
                          : 'حفظ ونشر الامتحان'}
                      </span>

                    </button>

                  </div>

                </form>

              </div>


              {/* EXAMS TABLE */}

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-4">

                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  قائمة الامتحانات
                </h3>

                {examsList.length === 0 ? (

                  <p className="text-xs text-gray-500 text-center py-8">
                    لا توجد امتحانات مضافة بعد.
                  </p>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm text-right">

                      <thead className="bg-slate-100 dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400">

                        <tr>

                          <th className="p-3">
                            عنوان الامتحان
                          </th>

                          <th className="p-3">
                            المحافظة
                          </th>

                          <th className="p-3">
                            السنة
                          </th>

                          <th className="p-3">
                            الإجراءات
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-gray-700">

                        {examsList.map((exam) => (

                          <tr
                            key={exam.id}
                            className="hover:bg-slate-50 dark:hover:bg-gray-700/50"
                          >

                            <td className="p-3 font-bold text-gray-900 dark:text-white">
                              {exam.title}
                            </td>

                            <td className="p-3 text-xs">
                              {exam.governorate}
                            </td>

                            <td className="p-3 text-xs">
                              {exam.year}
                            </td>

                            <td className="p-3">

                              <div className="flex items-center gap-1.5">

                                <button
                                  onClick={() =>
                                    setEditingExam({
                                      ...exam,
                                      yearNum:
                                        exam.year,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-dodger-50 text-dodger-600 hover:bg-dodger-100 text-xs flex items-center gap-1"
                                >

                                  <Pencil className="w-4 h-4" />

                                  <span>
                                    تعديل
                                  </span>

                                </button>


                                <button
                                  onClick={() =>
                                    handleDeleteExam(
                                      exam.id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    exam.id
                                  }
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 text-xs flex items-center gap-1"
                                >

                                  {deletingId ===
                                    exam.id ? (
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

            </div>
          )}


          {/* ==================================================
              STUDENTS
          ================================================== */}

          {activeTab === 'students' && (

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                <div>

                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    الطلاب المسجلين
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    إدارة حسابات الطلاب وحالاتهم
                  </p>

                </div>


                <div className="relative w-full sm:w-72">

                  <input
                    type="text"
                    placeholder="ابحث باسم الطالب أو الهاتف..."
                    value={searchStudent}
                    onChange={(e) =>
                      setSearchStudent(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 pr-9 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-xs"
                  />

                  <Search className="w-4 h-4 absolute top-2.5 right-3 text-gray-400" />

                </div>

              </div>


              {filteredStudents.length === 0 ? (

                <p className="text-xs text-gray-500 text-center py-8">
                  لا يوجد طلاب مطابقين.
                </p>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full text-sm text-right">

                    <thead className="bg-slate-100 dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400">

                      <tr>

                        <th className="p-3">
                          اسم الطالب
                        </th>

                        <th className="p-3">
                          هاتف الطالب
                        </th>

                        <th className="p-3">
                          هاتف ولي الأمر
                        </th>

                        <th className="p-3">
                          الصف
                        </th>

                        <th className="p-3">
                          المحافظة
                        </th>

                        <th className="p-3">
                          الحالة
                        </th>

                        <th className="p-3">
                          الإجراءات
                        </th>

                      </tr>

                    </thead>


                    <tbody className="divide-y divide-slate-100 dark:divide-gray-700">

                      {filteredStudents.map(
                        (student) => (

                          <tr
                            key={student.id}
                            className="hover:bg-slate-50 dark:hover:bg-gray-700/50"
                          >

                            <td className="p-3 font-bold text-gray-900 dark:text-white">
                              {student.name}
                            </td>

                            <td className="p-3 text-xs" dir="ltr">
                              {student.phone}
                            </td>

                            <td className="p-3 text-xs" dir="ltr">
                              {student.parentPhone}
                            </td>

                            <td className="p-3 text-xs">

                              {
                                YEARS.find(
                                  (year) =>
                                    year.id ===
                                    student.yearId
                                )?.title
                              }

                            </td>

                            <td className="p-3 text-xs">
                              {student.governorate}
                            </td>

                            <td className="p-3 text-xs">

                              {student.isActive ? (

                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                                  مفعل 🟢
                                </span>

                              ) : (

                                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                                  موقوف 🔴
                                </span>

                              )}

                            </td>


                            <td className="p-3">

                              <div className="flex items-center gap-3">

                                <button
                                  onClick={() =>
                                    setEditingStudent({
                                      ...student,
                                    })
                                  }
                                  className="text-xs font-bold text-dodger-600 hover:underline flex items-center gap-1"
                                >

                                  <Pencil className="w-3.5 h-3.5" />

                                  <span>
                                    تعديل
                                  </span>

                                </button>


                                <button
                                  onClick={() =>
                                    toggleStudentStatus(
                                      student.id,
                                      student.isActive
                                    )
                                  }
                                  className="text-xs font-bold text-amber-600 hover:underline"
                                >

                                  {student.isActive
                                    ? 'إيقاف الحساب'
                                    : 'تنشيط الحساب'}

                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>
          )}

        </>
      )}


      {/* ======================================================
          EDIT LESSON MODAL
      ====================================================== */}

      {editingLesson && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">

                <Pencil className="w-5 h-5 text-dodger-600" />

                <span>
                  تعديل الدرس
                </span>

              </h3>

              <button
                onClick={() =>
                  setEditingLesson(null)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            <form
              onSubmit={handleUpdateLesson}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >

              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  عنوان الدرس
                </label>

                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  الصف الدراسي
                </label>

                <select
                  value={editingLesson.yearId}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      yearId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                >

                  {YEARS.map((year) => (

                    <option
                      key={year.id}
                      value={year.id}
                    >
                      {year.title}
                    </option>

                  ))}

                </select>

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  الفرع
                </label>

                <input
                  type="text"
                  required
                  value={editingLesson.branch}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      branch: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رابط الفيديو
                </label>

                <input
                  type="url"
                  required
                  value={editingLesson.videoUrl}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      videoUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-mono"
                />

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  اسم ملخص الدرس
                </label>

                <input
                  type="text"
                  value={
                    editingLesson.summaryPdfName ||
                    ''
                  }
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      summaryPdfName:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  مدة الدرس
                </label>

                <input
                  type="text"
                  value={editingLesson.duration}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      duration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div className="sm:col-span-2 flex gap-3">

                <button
                  type="submit"
                  disabled={isSubmittingLesson}
                  className="flex-1 px-6 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 disabled:opacity-60 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                >

                  {isSubmittingLesson ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  <span>
                    {isSubmittingLesson
                      ? 'جاري الحفظ...'
                      : 'حفظ التعديلات'}
                  </span>

                </button>


                <button
                  type="button"
                  onClick={() =>
                    setEditingLesson(null)
                  }
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm"
                >
                  إلغاء
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ======================================================
          EDIT EXAM MODAL
      ====================================================== */}

      {editingExam && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">

                <Pencil className="w-5 h-5 text-amber-500" />

                <span>
                  تعديل الامتحان
                </span>

              </h3>

              <button
                onClick={() =>
                  setEditingExam(null)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            <form
              onSubmit={handleUpdateExam}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >

              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  عنوان الامتحان
                </label>

                <input
                  type="text"
                  required
                  value={editingExam.title}
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  المحافظة
                </label>

                <select
                  value={editingExam.governorate}
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      governorate:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                >

                  {GOVERNORATES.map(
                    (governorate) => (

                      <option
                        key={governorate}
                        value={governorate}
                      >
                        {governorate}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  سنة الامتحان
                </label>

                <input
                  type="text"
                  value={editingExam.yearNum}
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      yearNum: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رابط فيديو الحل
                </label>

                <input
                  type="url"
                  value={
                    editingExam.videoSolutionUrl ||
                    ''
                  }
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      videoSolutionUrl:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm font-mono"
                />

              </div>


              <div className="sm:col-span-2 flex gap-3">

                <button
                  type="submit"
                  disabled={isSubmittingExam}
                  className="flex-1 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                >

                  {isSubmittingExam ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  <span>
                    {isSubmittingExam
                      ? 'جاري الحفظ...'
                      : 'حفظ التعديلات'}
                  </span>

                </button>


                <button
                  type="button"
                  onClick={() =>
                    setEditingExam(null)
                  }
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm"
                >
                  إلغاء
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ======================================================
          EDIT STUDENT MODAL
      ====================================================== */}

      {editingStudent && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">

                <Pencil className="w-5 h-5 text-dodger-600" />

                <span>
                  تعديل بيانات الطالب
                </span>

              </h3>

              <button
                onClick={() =>
                  setEditingStudent(null)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            <form
              onSubmit={handleUpdateStudent}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >

              {/* NAME */}

              <div className="sm:col-span-2">

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  اسم الطالب
                </label>

                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                />

              </div>


              {/* PHONE */}

              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رقم هاتف الطالب
                </label>

                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={editingStudent.phone}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-right"
                />

              </div>


              {/* PARENT PHONE */}

              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رقم هاتف ولي الأمر
                </label>

                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={editingStudent.parentPhone}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      parentPhone:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm text-right"
                />

              </div>


              {/* YEAR */}

              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  الصف الدراسي
                </label>

                <select
                  value={editingStudent.yearId}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      yearId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                >

                  {YEARS.map((year) => (

                    <option
                      key={year.id}
                      value={year.id}
                    >
                      {year.title}
                    </option>

                  ))}

                </select>

              </div>


              {/* GOVERNORATE */}

              <div>

                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  المحافظة
                </label>

                <select
                  value={
                    editingStudent.governorate
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      governorate:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 text-sm"
                >

                  {GOVERNORATES.map(
                    (governorate) => (

                      <option
                        key={governorate}
                        value={governorate}
                      >
                        {governorate}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* ACTIONS */}

              <div className="sm:col-span-2 flex gap-3">

                <button
                  type="submit"
                  disabled={isSubmittingStudent}
                  className="flex-1 px-6 py-3 rounded-xl bg-dodger-600 hover:bg-dodger-700 disabled:opacity-60 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                >

                  {isSubmittingStudent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  <span>
                    {isSubmittingStudent
                      ? 'جاري الحفظ...'
                      : 'حفظ التعديلات'}
                  </span>

                </button>


                <button
                  type="button"
                  onClick={() =>
                    setEditingStudent(null)
                  }
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm"
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