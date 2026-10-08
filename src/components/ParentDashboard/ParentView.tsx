import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CalendarCheck,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Send,
  Phone,
  Printer,
  ChevronDown,
  User,
  Info,
} from 'lucide-react';

interface ParentViewProps {
  onOpenReportModal: () => void;
}

export const ParentView: React.FC<ParentViewProps> = ({ onOpenReportModal }) => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    currentStudent,
    attendance,
    grades,
    homework,
    notes,
    messages,
    notifications,
    sendMessage,
    markNotificationAsRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'grades' | 'attendance' | 'homework' | 'notes' | 'chat' | 'notifications'
  >('overview');

  const [chatInput, setChatInput] = useState('');

  const student = currentStudent || students[0];

  // Specific data for this child
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentNotes = notes.filter((n) => n.studentId === student.id);
  const studentMessages = messages.filter((m) => m.studentId === student.id);
  const studentNotifs = notifications.filter(
    (n) => n.targetRole === 'parent' && n.studentId === student.id
  );

  // Today's attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = studentAttendance.find((a) => a.date === todayStr);

  // Low grades
  const lowGrades = studentGrades.filter((g) => g.isLowGradeWarning);

  // Handling chat send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(student.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Parent Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              👨‍👩‍👦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  أهلاً بك، {student.parentName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/40 text-emerald-200 border border-emerald-400/30">
                  حساب ولي الأمر
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                متابعة الطالب: <strong className="text-white font-bold">{student.name}</strong> •{' '}
                {student.gradeLevel} ({student.classroom})
              </p>
            </div>
          </div>

          {/* Child Switcher & Official Report */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-emerald-200 px-2 font-bold">تبديل الابن:</span>
              {students.slice(0, 2).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedStudentId === st.id
                      ? 'bg-white text-emerald-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {st.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>بطاقة التقرير الرسمي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Status Alert Bar for Today */}
      {todayRecord?.status === 'absent' && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
              🔔
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-900">
                تنبيه غياب: تم تسجيل غياب ابنك {student.name} اليوم!
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                تاريخ الغياب: {todayRecord.date} • {todayRecord.note || 'بدون إشعار مسبق من ولي الأمر'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>إرسال تبرير / عذر للمعلم</span>
          </button>
        </div>
      )}

      {/* Low Grades Warning Alert Bar if any */}
      {lowGrades.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
              ⚠️
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                تنبيه أكاديمي: حصل ابنك على درجات تحتاج إلى متابعة منزلية
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowGrades[0].subjectName}: {lowGrades[0].score}/{lowGrades[0].maxScore} (
                %{lowGrades[0].percentage}) في {lowGrades[0].examTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('grades')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            تفاصيل درجات المادة
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>لوحة المتابعة</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'grades'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>الدرجات والاختبارات</span>
          {lowGrades.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'attendance'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>سجل الحضور والغياب</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'homework'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الواجبات المنزلية</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'notes'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ملاحظات المعلمين</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'notifications'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>التنبيهات الفورية</span>
          {studentNotifs.filter((n) => !n.read).length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
              {studentNotifs.filter((n) => !n.read).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'chat'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>تواصل مع المعلم</span>
        </button>
      </div>

      {/* Tab 1: Parent Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards for Child */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Attendance Rate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">نسبة الحضور التراكمية</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className={`text-3xl font-black ${
                    student.attendanceRate >= 90
                      ? 'text-emerald-600'
                      : student.attendanceRate >= 80
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  %{student.attendanceRate}
                </span>
                <span className="text-xs text-slate-400">
                  {student.attendanceRate >= 90 ? 'ممتاز' : 'يحتاج انضباط'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                حالة اليوم:{' '}
                {todayRecord?.status === 'present' ? (
                  <span className="text-emerald-600 font-bold">✅ حاضر بالمدرسة</span>
                ) : todayRecord?.status === 'absent' ? (
                  <span className="text-rose-600 font-bold">🚨 غائب اليوم</span>
                ) : (
                  <span className="text-amber-600 font-bold">⏰ متأخر</span>
                )}
              </p>
            </div>

            {/* Overall Academic Average */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">المعدل العام التراكمي</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-indigo-600">
                  %{student.overallAverage}
                </span>
                <span className="text-xs text-slate-400">
                  {student.overallAverage >= 90
                    ? 'ممتاز مرتفع'
                    : student.overallAverage >= 80
                    ? 'جيد جداً'
                    : 'جيد'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                تم رصد {studentGrades.length} تقييمات واختبارات
              </p>
            </div>

            {/* Homework Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">الواجبات المستحقة</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">
                  {homework.length}
                </span>
                <span className="text-xs text-slate-400">واجبات حالية</span>
              </div>
              <p className="text-[11px] text-indigo-600 font-bold mt-2">
                راجع موعد تسليم الواجبات
              </p>
            </div>

            {/* Teacher Notes */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">الملاحظات التربوية</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-purple-600">
                  {studentNotes.length}
                </span>
                <span className="text-xs text-slate-400">ملاحظات مسجلة</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                من المعلمين: أ. محمد، أ. فاروق
              </p>
            </div>
          </div>

          {/* Subjects Performance Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>مستوى الطالب في المواد الدراسية 📊</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تحديث فوري للدرجات بناءً على الاختبارات المرصودة من المدرسين
                </p>
              </div>

              <button
                onClick={() => setActiveTab('grades')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                عرض تفاصيل كل اختبار
              </button>
            </div>

            {/* Subject Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentGrades.map((grade) => {
                const isLow = grade.percentage < 60;
                return (
                  <div
                    key={grade.id}
                    className={`p-4 rounded-xl border ${
                      isLow ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {grade.subjectName}
                        </span>
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> يحتاج متابعة مكثفة
                          </span>
                        ) : grade.percentage >= 90 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            🌟 ممتاز
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            جيد جداً
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-sm font-black ${
                          isLow
                            ? 'text-rose-600'
                            : grade.percentage >= 90
                            ? 'text-emerald-600'
                            : 'text-indigo-600'
                        }`}
                      >
                        {grade.score} / {grade.maxScore} (%{grade.percentage})
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow
                            ? 'bg-rose-500'
                            : grade.percentage >= 90
                            ? 'bg-emerald-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, grade.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{grade.examTitle}</span>
                      <span>{grade.date}</span>
                    </div>

                    {grade.teacherFeedback && (
                      <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200/80 mt-1">
                        💬 <strong>توجيه المعلم:</strong> {grade.teacherFeedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Contact & Action Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick message teacher */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>تواصل فوري مع معلم الفصل</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يمكنك الاستفسار عن الواجبات أو تقديم الأعذار الطبية أو طلب نصائح لتحسين مستوى الطالب
                  مباشرة مع أ. محمد الأحمدي.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>فتح المحادثة المباشرة</span>
              </button>
            </div>

            {/* Official Report Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>التقرير الأكاديمي والشهادة الرسمية</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  توليد بطاقة متابعة شاملة للطباعة أو الحفظ كملف، تتضمن جدول الدرجات، نسبة الحضور،
                  وتقييم السلوك والمواظبة.
                </p>
              </div>
              <button
                onClick={onOpenReportModal}
                className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>عرض وطباعة التقرير الشامل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed Grades */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل درجات واختبارات الطالب: {student.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                المعدل العام الحالي: <strong className="text-indigo-600">%{student.overallAverage}</strong>
              </p>
            </div>

            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100"
            >
              طباعة الشهادة الرسمية 📄
            </button>
          </div>

          <div className="space-y-4">
            {studentGrades.map((grade) => {
              const isLow = grade.percentage < 60;
              return (
                <div
                  key={grade.id}
                  className={`p-5 rounded-2xl border ${
                    isLow ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
                  } space-y-3`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">
                          {grade.subjectName}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({grade.examTitle})
                        </span>
                        {isLow && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            ⚠️ يحتاج متابعة
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">تاريخ الرصد: {grade.date}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-2xl font-black text-slate-900">
                        {grade.score} / {grade.maxScore}
                      </span>
                      <span
                        className={`block text-xs font-bold ${
                          isLow ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        النسبة: %{grade.percentage}
                      </span>
                    </div>
                  </div>

                  {grade.teacherFeedback && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                      <strong className="text-slate-900 font-bold">توجيه المعلم لولي الأمر:</strong>{' '}
                      {grade.teacherFeedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل الحضور والغياب للابن: {student.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                نسبة المواظبة: <strong className="text-emerald-600">%{student.attendanceRate}</strong>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 self-start sm:self-auto"
            >
              تقديم عذر للغياب
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {studentAttendance.map((rec) => {
              const isAbsent = rec.status === 'absent';
              const isLate = rec.status === 'late';

              return (
                <div
                  key={rec.id}
                  className={`py-3.5 px-3 flex items-center justify-between rounded-xl transition-colors ${
                    isAbsent ? 'bg-rose-50/50' : isLate ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isAbsent
                          ? 'bg-rose-100 text-rose-600'
                          : isLate
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {isAbsent ? 'غ' : isLate ? 'ت' : 'ح'}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">{rec.date}</span>
                      {rec.note && (
                        <p className="text-xs text-slate-500 mt-0.5">{rec.note}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    {isAbsent ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                        غائب 🔔
                      </span>
                    ) : isLate ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        متأخر
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        حاضر
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Homework */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base">
              الواجبات المدرسية المطلوبة من {student.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              متابعة المهام ومواعيد التسليم لضمان عدم تأخر الطالب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homework.map((hw) => {
              const status = hw.statusMap?.[student.id] || 'pending';
              const isDone = status === 'completed' || status === 'submitted';

              return (
                <div
                  key={hw.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {hw.subjectName}
                      </span>
                      <span className="text-xs text-slate-400">آخر موعد: {hw.dueDate}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">الدرجة: {hw.maxPoints} نقاط</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isDone ? '✓ تم التسليم والإنجاز' : '⏳ قيد الإنجاز'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Notes from Teacher */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            ملاحظات وتوجيهات المعلمين بخصوص {student.name}
          </h3>

          <div className="space-y-3">
            {studentNotes.map((note) => {
              const isPos = note.category === 'positive';
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border ${
                    isPos ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{note.title}</span>
                    <span className="text-[11px] text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    بواسطة: {note.teacherName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: Notifications Center */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">سجل التنبيهات والإشعارات الفورية</h3>
            <span className="text-xs text-slate-400">
              تصلك الإشعارات آلياً فور رصد المدرس للغياب أو الدرجات
            </span>
          </div>

          <div className="space-y-3">
            {studentNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  !notif.read ? 'bg-indigo-50/60 border-indigo-200 shadow-xs' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Chat with Teacher */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[500px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                👨‍🏫
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">أ. محمد الأحمدي</h4>
                <p className="text-xs text-slate-500">
                  معلم الرياضيات ورائد فصل {student.name}
                </p>
              </div>
            </div>

            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              متصل الآن
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20 max-h-[380px]">
            {studentMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs">
                  لا توجد رسائل سابقة. يمكنك إرسال استفسار أو عذر طبي للمعلم مباشرة.
                </p>
              </div>
            ) : (
              studentMessages.map((msg) => {
                const isParent = msg.senderRole === 'parent';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isParent ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isParent
                          ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p className="font-bold text-[10px] mb-1 opacity-80">{msg.senderName}</p>
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] mt-1.5 block ${
                          isParent ? 'text-emerald-200 text-left' : 'text-slate-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Chat suggestions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">رسائل مقترحة:</span>
            {[
              'أستاذ محمد، بخصوص غيابه اليوم كان يشكو من عارض صحي.',
              'شكراً لجهودك، سنقوم بمراجعة درس الرياضيات وحل التمارين معه الليلة.',
              'هل يمكن توضيح الجزئية التي يحتاج فيها إلى تقوية؟',
            ].map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(msg)}
                className="bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 px-2.5 py-1 rounded-lg text-slate-700 whitespace-nowrap transition-colors"
              >
                {msg.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اكتب رسالتك أو عذرك للمعلم هنا..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-200"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
