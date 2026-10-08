import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceTab } from './AttendanceTab';
import { GradesTab } from './GradesTab';
import { HomeworkTab } from './HomeworkTab';
import { NotesTab } from './NotesTab';
import { MessagesTab } from './MessagesTab';
import { StudentsListTab } from './StudentsListTab';
import {
  CalendarCheck,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowLeft,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface TeacherViewProps {
  onOpenReportForStudent: (studentId: string) => void;
  onOpenDemoModal: () => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  onOpenReportForStudent,
  onOpenDemoModal,
}) => {
  const { students, attendance, grades, homework, messages, notifications, setSelectedStudentId } =
    useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'grades' | 'homework' | 'notes' | 'messages' | 'students'
  >('overview');

  // Quick stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.filter((a) => a.date === todayStr);
  const todayAbsent = todayAtt.filter((a) => a.status === 'absent').length;
  const lowGradesCount = grades.filter((g) => g.isLowGradeWarning).length;
  const unreadMsgsCount = messages.filter((m) => m.recipientRole === 'teacher' && !m.read).length;

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  أ. محمد الأحمدي
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  معلم الرياضيات ورائد الفصل
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                الصف الثالث المتوسط • شعبة أ • مدرسة النبراس الأهلية
              </p>
            </div>
          </div>

          {/* Quick Guided Demo Callout */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDemoModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>تجربة السيناريو السريع (أحمد)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>نظرة عامة</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>تسجيل الحضور والغياب</span>
          {todayAbsent > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'grades'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>درجات الامتحانات</span>
          {lowGradesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px]">
              {lowGradesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الواجبات المدرسية</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'notes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>الملاحظات والسلوك</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'messages'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>رسائل أولياء الأمور</span>
          {unreadMsgsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
              {unreadMsgsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>قائمة الطلاب ({students.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Quick KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>غياب اليوم</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  🔔
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{todayAbsent} طلاب</p>
              <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                تم إشعار أولياء أمورهم آلياً
              </p>
            </div>

            <div
              onClick={() => setActiveTab('grades')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>تنبيهات انخفاض الدرجات</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  ⚠️
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{lowGradesCount} حالات</p>
              <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                درجات أقل من 60% تستدعي المتابعة
              </p>
            </div>

            <div
              onClick={() => setActiveTab('homework')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>الواجبات النشطة</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📚
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{homework.length} واجبات</p>
              <p className="text-[11px] text-indigo-600 mt-1 font-semibold">
                تسليمات جارية من الطلاب
              </p>
            </div>

            <div
              onClick={() => setActiveTab('students')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>إجمالي الطلاب</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  👥
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{students.length} طلاب</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                جميع أولياء الأمور متصلون
              </p>
            </div>
          </div>

          {/* Practical Prompt Demonstration Highlights */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-base text-slate-900">
                  الحالة العملية الموضحة في فكرة المشروع
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                طالب التجربة: أحمد الشمري
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                  <span>🔔 مثال 1: رصد الغياب الآلي</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  سجل المعلم أن <strong>أحمد غاب اليوم</strong> ⬅️ النظام فوراً يرسل إشعاراً لوالد
                  أحمد: <br />
                  <span className="text-slate-900 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                    «ابنك أحمد تم تسجيل غيابه اليوم»
                  </span>
                </p>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-1"
                >
                  <span>فتح شاشة تحضير الطلاب</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
                  <span>⚠️ مثال 2: رصد الدرجة المنخفضة</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  سجل المعلم أن <strong>أحمد جاب 8/20 في اختبار الرياضيات</strong> ⬅️ ولي الأمر يشوف
                  الدرجة مع تنبيه واضح: <br />
                  <span className="text-slate-900 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                    «الطالب محتاج متابعة في الجبر والمعادلات»
                  </span>
                </p>
                <button
                  onClick={() => setActiveTab('grades')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-1"
                >
                  <span>رصد أو استعراض الدرجات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('attendance')}
              className="p-5 rounded-2xl bg-white border border-slate-200 text-right hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                📅
              </div>
              <h4 className="font-bold text-slate-900 text-sm">تسجيل حضور وغياب اليوم</h4>
              <p className="text-xs text-slate-500 mt-1">
                تحضير بنقرة واحدة وإشعار أولياء أمور الغائبين فوراً
              </p>
            </button>

            <button
              onClick={() => setActiveTab('grades')}
              className="p-5 rounded-2xl bg-white border border-slate-200 text-right hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                📊
              </div>
              <h4 className="font-bold text-slate-900 text-sm">رصد درجات الاختبارات</h4>
              <p className="text-xs text-slate-500 mt-1">
                إدخال النتائج مع كشف تلقائي للطلاب المحتاجين للدعم
              </p>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className="p-5 rounded-2xl bg-white border border-slate-200 text-right hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                💬
              </div>
              <h4 className="font-bold text-slate-900 text-sm">محادثات أولياء الأمور</h4>
              <p className="text-xs text-slate-500 mt-1">
                تواصل مباشر واستقبال الأعذار ومتابعة المستوى
              </p>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && <AttendanceTab />}
      {activeTab === 'grades' && <GradesTab />}
      {activeTab === 'homework' && <HomeworkTab />}
      {activeTab === 'notes' && <NotesTab />}
      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'students' && (
        <StudentsListTab onOpenReportForStudent={onOpenReportForStudent} />
      )}
    </div>
  );
};
