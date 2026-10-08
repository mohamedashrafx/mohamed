import React from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  Smile,
  Clock,
  Printer,
  Star,
  Zap,
} from 'lucide-react';

interface StudentViewProps {
  onOpenReportModal: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ onOpenReportModal }) => {
  const { currentStudent, grades, homework, attendance, notes, toggleHomeworkCompletion } = useApp();

  const student = currentStudent || {
    id: 's1',
    name: 'أحمد خالد الشمري',
    gradeLevel: 'الصف الثالث المتوسط',
    classroom: 'شعبة أ',
    attendanceRate: 88,
    overallAverage: 78.5,
  };

  const myGrades = grades.filter((g) => g.studentId === student.id);
  const myAttendance = attendance.filter((a) => a.studentId === student.id);
  const myNotes = notes.filter((n) => n.studentId === student.id);

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Student Hero Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              👨‍🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  أهلاً بك يا بطل، {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/40 text-blue-200 border border-blue-400/30">
                  حساب الطالب
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                {student.gradeLevel} • {student.classroom} • اجتهد اليوم لتحقق طموحاتك! 🚀
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={triggerCelebrate}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>احتفل بإنجازاتي 🎊</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>شهادتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">معدلي التراكمي</span>
          <div className="text-3xl font-black text-blue-600 mt-2">%{student.overallAverage}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">استمر في التميز!</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">نسبة حضوري</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">%{student.attendanceRate}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">انضباط رائع</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">الواجبات المنجزة</span>
          <div className="text-3xl font-black text-indigo-600 mt-2">
            {
              homework.filter(
                (h) => h.statusMap?.[student.id] === 'submitted' || h.statusMap?.[student.id] === 'completed'
              ).length
            }{' '}
            / {homework.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">سلّم واجباتك بالموعد</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">أوسمة التفوق</span>
          <div className="text-3xl font-black text-amber-500 mt-2">4 أوسمة ⭐</div>
          <span className="text-[11px] text-slate-400 mt-1 block">طالب متميز</span>
        </div>
      </div>

      {/* Main Grid: Homeworks & Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Homework Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>واجباتي المدرسية المطلوبة 📚</span>
            </h3>
            <span className="text-xs text-slate-400">انقر لتحديد ما تم حله</span>
          </div>

          <div className="space-y-3">
            {homework.map((hw) => {
              const status = hw.statusMap?.[student.id] || 'pending';
              const isCompleted = status === 'completed' || status === 'submitted';

              return (
                <div
                  key={hw.id}
                  onClick={() => toggleHomeworkCompletion(hw.id, student.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{hw.title}</span>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        {hw.subjectName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{hw.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> تسليم: {hw.dueDate}
                      </span>
                      <span
                        className={`font-bold ${
                          isCompleted ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {isCompleted ? '✓ تم الحل' : '⏳ مطلوب للحل'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Grades & Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>سجل درجاتي وإنجازاتي 🎯</span>
            </h3>
            <span className="text-xs text-slate-400">تابع مستواك في كل مادة</span>
          </div>

          <div className="space-y-3">
            {myGrades.map((grade) => {
              const isLow = grade.percentage < 60;
              return (
                <div
                  key={grade.id}
                  className={`p-3.5 rounded-xl border ${
                    isLow ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{grade.subjectName}</span>
                      <span className="text-[11px] text-slate-500 mr-1.5 font-medium">
                        • {grade.examTitle}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-black ${
                        isLow ? 'text-rose-600' : 'text-indigo-600'
                      }`}
                    >
                      {grade.score} / {grade.maxScore} (%{grade.percentage})
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isLow
                          ? 'bg-rose-500'
                          : grade.percentage >= 85
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, grade.percentage)}%` }}
                    />
                  </div>

                  {grade.teacherFeedback && (
                    <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg">
                      💡 <strong>نصيحة المعلم لك:</strong> {grade.teacherFeedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Teachers Praise & Guidance Wall */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>لوحة تشجيع وملاحظات المعلمين الموجهة إليك 🌟</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900">{note.title}</span>
                <span className="text-[10px] text-amber-700">{note.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>
              <span className="text-[11px] text-slate-500 block pt-1">
                من المعلم: {note.teacherName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
