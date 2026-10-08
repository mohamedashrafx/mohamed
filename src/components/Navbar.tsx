import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  GraduationCap,
  Users,
  UserCheck,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText,
  X,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal, onOpenReportModal }) => {
  const {
    currentRole,
    setCurrentRole,
    selectedStudentId,
    setSelectedStudentId,
    students,
    currentStudent,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToSampleData,
    currentUser,
    logout,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Filter notifications relevant to current role
  const relevantNotifs = notifications.filter((n) => {
    if (currentRole === 'teacher') return n.targetRole === 'teacher';
    if (currentRole === 'parent') return n.targetRole === 'parent' && n.studentId === selectedStudentId;
    if (currentRole === 'student') return n.targetRole === 'student' && n.studentId === selectedStudentId;
    return false;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-slate-900 tracking-tight">رَابِطْ</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  منصة التواصل المدرسي
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                جسر التواصل بين المدرس 👨‍🏫 وولي الأمر 👨‍👩‍👦 والطالب 👨‍🎓
              </p>
            </div>
          </div>

          {/* Role Switcher - Center Bar */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setCurrentRole('teacher')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>المعلم</span>
            </button>

            <button
              onClick={() => setCurrentRole('parent')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentRole === 'parent'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>ولي الأمر</span>
            </button>

            <button
              onClick={() => setCurrentRole('student')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentRole === 'student'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>الطالب</span>
            </button>
          </div>

          {/* Right Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Scenario walkthrough */}
            <button
              onClick={onOpenDemoModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              title="عرض وتجربة سيناريو الإشعارات العملية"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>تجربة السيناريو</span>
            </button>

            {/* Quick Report preview */}
            <button
              onClick={onOpenReportModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="عرض تقرير أداء الطالب والشهادة الرسمية"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>تقرير الطالب</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  unreadNotificationsCount > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="الإشعارات والتنبيهات"
                aria-label="الإشعارات"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-sm">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifDropdown && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">مركز التنبيهات المدرسية</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-100 text-rose-700 font-bold">
                          {unreadNotificationsCount} جديد
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 px-1 py-1">
                    {relevantNotifs.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs">لا توجد إشعارات حالياً</p>
                      </div>
                    ) : (
                      relevantNotifs.slice(0, 7).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markNotificationAsRead(item.id)}
                          className={`p-3 rounded-xl transition-colors cursor-pointer text-right flex gap-3 ${
                            !item.read ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {item.type === 'attendance_absent' && (
                              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                                🔔
                              </div>
                            )}
                            {item.type === 'low_grade' && (
                              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                ⚠️
                              </div>
                            )}
                            {item.type === 'new_homework' && (
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                📚
                              </div>
                            )}
                            {item.type === 'message' && (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                💬
                              </div>
                            )}
                            {item.type === 'new_note' && (
                              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                📝
                              </div>
                            )}
                            {item.type === 'honor' && (
                              <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
                                🌟
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-bold ${
                                  !item.read ? 'text-slate-900' : 'text-slate-700'
                                }`}
                              >
                                {item.title}
                              </span>
                              {!item.read && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(item.timestamp).toLocaleTimeString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl text-center">
                    <p className="text-[11px] text-slate-500">
                      يتم توليد الإشعارات آلياً فور رصد المعلم للغياب أو الدرجة
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (window.confirm('هل تود إعادة تعيين البيانات إلى الحالة النموذجية؟')) {
                  resetToSampleData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="إعادة ضبط البيانات النموذجية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pr-1 border-r border-slate-200">
              {currentUser && (
                <div className="hidden xl:flex items-center gap-2 pl-1 text-right">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-slate-900 block">{currentUser.name}</span>
                    <span className="text-slate-400 text-[10px]">{currentUser.title}</span>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="تسجيل الخروج والعودة لصفحة الدخول"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subheader: Child selector for Parent or Student role */}
        {(currentRole === 'parent' || currentRole === 'student') && (
          <div className="py-2.5 px-3 bg-gradient-to-r from-emerald-50/70 via-indigo-50/40 to-blue-50/70 border-t border-slate-100 rounded-xl mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {currentRole === 'parent' ? '👨‍👩‍👦 الأبناء المسجلون:' : '👨‍🎓 الملف الشخصي للطالب:'}
              </span>
              <div className="flex items-center gap-1.5">
                {students.slice(0, 2).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStudentId === st.id
                        ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200 ring-1 ring-indigo-300'
                        : 'bg-white/60 text-slate-600 hover:bg-white border border-transparent'
                    }`}
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span>{st.name}</span>
                    <span className="text-[10px] text-slate-400">({st.gradeLevel})</span>
                  </button>
                ))}
              </div>
            </div>

            {currentStudent && (
              <div className="text-xs text-slate-500 hidden sm:flex items-center gap-3">
                <span>
                  نسبة الحضور:{' '}
                  <strong
                    className={
                      currentStudent.attendanceRate >= 90
                        ? 'text-emerald-600 font-bold'
                        : 'text-amber-600 font-bold'
                    }
                  >
                    %{currentStudent.attendanceRate}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  المعدل العام:{' '}
                  <strong className="text-indigo-600 font-bold">
                    %{currentStudent.overallAverage}
                  </strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
