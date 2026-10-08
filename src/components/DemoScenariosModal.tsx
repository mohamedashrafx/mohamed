import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Users,
  GraduationCap,
} from 'lucide-react';

interface DemoScenariosModalProps {
  onClose: () => void;
  onOpenReportModal: () => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  onClose,
  onOpenReportModal,
}) => {
  const { setCurrentRole, setSelectedStudentId, recordAttendance, addGrade, login } = useApp();

  const handleRunAbsentScenario = () => {
    // 1. Ensure student is Ahmed
    setSelectedStudentId('s1');
    // 2. Mark Ahmed absent today
    const todayStr = new Date().toISOString().split('T')[0];
    recordAttendance('s1', todayStr, 'absent', 'غياب بدون عذر مسبق من ولي الأمر');
    // 3. Switch to Parent role so user immediately sees the notification and alert!
    login('parent');
    onClose();
  };

  const handleRunLowGradeScenario = () => {
    setSelectedStudentId('s1');
    const todayStr = new Date().toISOString().split('T')[0];
    addGrade({
      studentId: 's1',
      studentName: 'أحمد خالد الشمري',
      subjectId: 'sub-math',
      subjectName: 'الرياضيات',
      examTitle: 'اختبار الجبر الشهري (تجريبي)',
      score: 8,
      maxScore: 20,
      date: todayStr,
      examType: 'quiz',
      teacherFeedback: 'حصل على 8/20 ويحتاج مراجعة وحل تمارين إضافية بالمنزل.',
    });
    login('parent');
    onClose();
  };

  const handleOpenParentDirectly = () => {
    login('parent');
    onClose();
  };

  const handleOpenTeacherDirectly = () => {
    login('teacher');
    onClose();
  };

  const handleOpenStudentDirectly = () => {
    login('student');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs">
              ⚡
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                دليل تجربة السيناريوهات العملية (حسب فكرة المشروع)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                انقر على أي سيناريو لاختباره فورياً وملاحظة كيف تترابط البيانات بين الأطراف الثلاثة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Cards */}
        <div className="space-y-4">
          {/* Scenario 1: Absent */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-sm text-rose-950">
                  المعلم يسجل غياب أحمد ⬅️ إشعار فوري لولي الأمر
                </h4>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                يقوم النظام برصد غياب أحمد اليوم وتوليد إشعار فوري في حساب والده:
                <br />
                <strong className="text-slate-900 bg-white/70 px-2 py-0.5 rounded text-[11px]">
                  «🔔 ابنك أحمد تم تسجيل غيابه اليوم»
                </strong>
              </p>
            </div>

            <button
              onClick={handleRunAbsentScenario}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>تشغيل السيناريو الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scenario 2: 8/20 Low Grade */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-sm text-amber-950">
                  المعلم يرصد 8/20 في الرياضيات ⬅️ تنبيه انخفاض مستوى
                </h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                درجة 8/20 (40%) تصنّف كأقل من 60% وتطلق تنبيهاً لولي الأمر:
                <br />
                <strong className="text-slate-900 bg-white/70 px-2 py-0.5 rounded text-[11px]">
                  «⚠️ تنبيه درجات: حصل أحمد على 8/20 ويحتاج متابعة»
                </strong>
              </p>
            </div>

            <button
              onClick={handleRunLowGradeScenario}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>تشغيل سيناريو 8/20</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scenario 3: Report & Charts */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-sm text-indigo-950">
                  تقرير أداء الطالب الشامل والشهادة الرسمية 📊
                </h4>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                استعراض بطاقة الأداء المدرسية القابلة للطباعة وتتضمن:
                <br />
                <span className="font-semibold text-slate-800 text-[11px]">
                  نسبة الحضور 90% • الرياضيات 85% • العربية 70% • العلوم 92%
                </span>
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>عرض التقرير الرسمي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Direct Role Switchers */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500 font-bold">الانتقال المباشر للحسابات:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTeacherDirectly}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              حساب المعلم 👨‍🏫
            </button>
            <button
              onClick={handleOpenParentDirectly}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              حساب ولي الأمر 👨‍👩‍👦
            </button>
            <button
              onClick={handleOpenStudentDirectly}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              حساب الطالب 👨‍🎓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
