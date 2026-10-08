import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  X,
  Award,
  CheckCircle2,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface PrintableReportCardProps {
  studentId: string;
  onClose: () => void;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  studentId,
  onClose,
}) => {
  const { students, grades, attendance, notes } = useApp();

  const student = students.find((s) => s.id === studentId) || students[0];
  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentNotes = notes.filter((n) => n.studentId === student.id);

  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'absent').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'late').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-300 overflow-hidden my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">
              تقرير أداء الطالب الرسمي القابل للطباعة والتصدير
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-6 print:space-y-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-6 flex items-center justify-between">
            <div className="space-y-1 text-right text-xs text-slate-800">
              <p className="font-bold text-sm text-slate-900">المملكة العربية السعودية</p>
              <p>وزارة التعليم</p>
              <p className="font-bold">مدرسة النبراس الأهلية النموذجية</p>
              <p className="text-slate-500 text-[11px]">نظام المتابعة والتواصل المدرسي (رابط)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-indigo-700">
                رَابِطْ
              </div>
              <h2 className="font-black text-base sm:text-lg text-slate-900 mt-2">
                بطاقة تقرير الأداء والمتابعة الأكاديمية
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                الفصل الدراسي الأول • العام 1448هـ / 2026م
              </span>
            </div>

            <div className="space-y-1 text-left text-xs text-slate-700 font-mono">
              <p>التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
              <p>الرقم: REP-2026-{student.studentNumber}</p>
              <div className="pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  معتمد رسمياً
                </span>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">اسم الطالب:</span>
              <strong className="text-sm font-bold text-slate-900">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">المرحلة والصف:</span>
              <strong className="text-sm font-bold text-slate-900">
                {student.gradeLevel} ({student.classroom})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">رقم الطالب:</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">
                {student.studentNumber}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">ولي الأمر:</span>
              <strong className="text-sm font-bold text-slate-900">{student.parentName}</strong>
            </div>
          </div>

          {/* Key Summary Indicators (The exact report highlights from the prompt!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Attendance Rate */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center">
              <span className="text-xs text-indigo-700 font-bold block">نسبة الحضور</span>
              <span className="text-3xl font-black text-indigo-900 mt-1 block">
                %{student.attendanceRate}
              </span>
              <span className="text-[11px] text-indigo-600 mt-1 block">
                حاضر: {presentDays} | غائب: {absentDays} | متأخر: {lateDays}
              </span>
            </div>

            {/* Overall GPA */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-700 font-bold block">المعدل العام التراكمي</span>
              <span className="text-3xl font-black text-emerald-900 mt-1 block">
                %{student.overallAverage}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                التقدير العام:{' '}
                {student.overallAverage >= 90
                  ? 'ممتاز مرتفع 🌟'
                  : student.overallAverage >= 80
                  ? 'جيد جداً'
                  : 'جيد'}
              </span>
            </div>

            {/* Behavioral Score */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
              <span className="text-xs text-amber-700 font-bold block">السلوك والمواظبة</span>
              <span className="text-3xl font-black text-amber-900 mt-1 block">100 / 100</span>
              <span className="text-[11px] text-amber-600 mt-1 block">سلوك منضبط ومثالي</span>
            </div>

            {/* Assignments Completed */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center">
              <span className="text-xs text-purple-700 font-bold block">إنجاز الواجبات</span>
              <span className="text-3xl font-black text-purple-900 mt-1 block">95%</span>
              <span className="text-[11px] text-purple-600 mt-1 block">متابع للأنشطة الصفية</span>
            </div>
          </div>

          {/* Subjects Grades Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>جدول نتائج المواد الدراسية والاختبارات 📊</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">المادة الدراسية</th>
                    <th className="p-3">عنوان الاختبار</th>
                    <th className="p-3">درجة الطالب</th>
                    <th className="p-3">الدرجة العظمى</th>
                    <th className="p-3">النسبة المئوية</th>
                    <th className="p-3">التقدير والمستوى</th>
                    <th className="p-3">توجيه المعلم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map((g) => {
                    const isLow = g.percentage < 60;
                    return (
                      <tr key={g.id} className={isLow ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 font-bold text-slate-900">{g.subjectName}</td>
                        <td className="p-3 text-slate-600">{g.examTitle}</td>
                        <td className="p-3 font-extrabold text-slate-900">{g.score}</td>
                        <td className="p-3 text-slate-500">{g.maxScore}</td>
                        <td className="p-3 font-bold">
                          <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                            %{g.percentage}
                          </span>
                        </td>
                        <td className="p-3">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              ⚠️ يحتاج متابعة
                            </span>
                          ) : g.percentage >= 90 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ممتاز
                            </span>
                          ) : g.percentage >= 80 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              جيد جداً
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              جيد
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] max-w-xs">
                          {g.teacherFeedback || 'مستوى طيب ومرضي'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher & School Recommendations */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">توصية رائد الفصل والتوجيه الطلابي:</h4>
            <p className="text-slate-700 leading-relaxed">
              الطالب يتميز بالأخلاق العالية والحرص على المشاركة الصفية. يوصى بالتركيز على مراجعة
              المسائل الحسابية في مادة الرياضيات وحل التمارين المنزلية أولاً بأول لرفع المستوى في
              الاختبار النهائي القادم، مع استمرار الدعم الأسري المشكور.
            </p>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-700 border-t border-slate-200">
            <div>
              <p className="font-bold text-slate-900">رائد الفصل ومسؤول المتابعة</p>
              <p className="text-slate-500 mt-1">أ. محمد الأحمدي</p>
              <div className="mt-6 font-mono text-[11px] text-slate-400">التوقيع: .....................</div>
            </div>

            <div>
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center text-[10px] text-indigo-700 font-bold rotate-12">
                ختم المدرسة المعتمد
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900">توقيع واطلاع ولي الأمر</p>
              <p className="text-slate-500 mt-1">{student.parentName}</p>
              <div className="mt-6 font-mono text-[11px] text-slate-400">التوقيع: .....................</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
