import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function BookReader() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data, error } = await supabase
                    .from("books")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) {
                    console.error("Error fetching book:", error);
                    setError("لم يتم العثور على الكتاب");
                    return;
                }

                setBook(data);
            } catch (err) {
                console.error(err);
                setError("حدث خطأ أثناء تحميل الكتاب");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    /* =========================
       Loading
    ========================= */
    if (loading) {
        return (
            <div
                dir="rtl"
                className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dodger-100 dark:bg-dodger-900/40">
                        <Loader2
                            className="h-7 w-7 animate-spin text-dodger-600 dark:text-dodger-400"
                        />
                    </div>

                    <p className="font-ibm text-sm font-bold text-gray-500 dark:text-gray-400">
                        جاري تحميل الكتاب...
                    </p>
                </div>
            </div>
        );
    }

    /* =========================
       Error
    ========================= */
    if (error || !book) {
        return (
            <div
                dir="rtl"
                className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4"
            >
                <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-xl">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
                        <BookOpen className="h-8 w-8 text-red-500" />
                    </div>

                    <h1 className="font-messiri text-xl font-bold text-gray-900 dark:text-white">
                        الكتاب غير متاح
                    </h1>

                    <p className="mt-2 font-ibm text-sm text-gray-500 dark:text-gray-400">
                        {error || "لم يتم العثور على الكتاب المطلوب"}
                    </p>

                    <Link
                        to="/books"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-dodger-600 px-5 py-3 font-ibm text-sm font-bold text-white shadow-lg shadow-dodger-600/20 transition hover:bg-dodger-700"
                    >
                        <ArrowRight className="h-4 w-4" />
                        العودة إلى الكتب
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-slate-50 dark:bg-gray-950"
        >
            {/* =========================
                Header
            ========================= */}
            <header className="sticky top-2 z-40 mx-3 rounded-2xl border border-dodger-200/60 dark:border-dodger-800/50 bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-md">

                <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

                    {/* Back */}
                    <Link
                        to="/books"
                        className="group flex shrink-0 items-center gap-2 rounded-xl bg-dodger-50 dark:bg-dodger-900/30 px-3 py-2.5 font-ibm text-sm font-bold text-dodger-700 dark:text-dodger-300 transition hover:bg-dodger-100 dark:hover:bg-dodger-900/50"
                    >
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

                        <span className="hidden sm:inline">
                            العودة للكتب
                        </span>
                    </Link>

                    {/* Book title */}
                    <div className="min-w-0 flex-1 text-center">

                        <div className="flex items-center justify-center gap-2">
                            <BookOpen className="hidden h-5 w-5 shrink-0 text-dodger-600 sm:block" />

                            <h1 className="truncate font-messiri text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                                {book.title}
                            </h1>
                        </div>

                        {book.subject && (
                            <p className="mt-0.5 truncate font-ibm text-xs text-gray-500 dark:text-gray-400">
                                {book.subject}
                            </p>
                        )}
                    </div>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dodger-600 text-white font-khaled text-lg shadow-md transition hover:scale-105"
                    >
                        إ
                    </Link>
                </div>
            </header>

            {/* =========================
                Reader
            ========================= */}
            <main className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6">

                {/* Info bar */}
                <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dodger-100 dark:bg-dodger-900/40">
                            <BookOpen className="h-5 w-5 text-dodger-600 dark:text-dodger-400" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-ibm text-sm font-bold text-gray-900 dark:text-white">
                                {book.title}
                            </p>

                            {book.grade && (
                                <p className="truncate font-ibm text-xs text-gray-500 dark:text-gray-400">
                                    {book.grade}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:block shrink-0 rounded-lg bg-dodger-50 dark:bg-dodger-900/30 px-3 py-1.5">
                        <span className="font-ibm text-xs font-bold text-dodger-700 dark:text-dodger-300">
                            قراءة الكتاب
                        </span>
                    </div>
                </div>

                {/* PDF Container */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">

                    <div className="bg-dodger-600 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-white" />

                            <span className="font-ibm text-sm font-bold text-white">
                                {book.title}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2">

                        <iframe
                            src={`https://drive.google.com/file/d/${book.drive_id}/preview`}
                            title={book.title}
                            className="h-[calc(100vh-180px)] min-h-[600px] w-full rounded-2xl border-0 bg-white"
                            allow="autoplay"
                        />

                    </div>
                </div>

            </main>
        </div>
    );
}