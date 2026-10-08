import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { DEMO_ACCOUNTS } from '../../data/initialData';
import {
  GraduationCap,
  Users,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  BellRing,
} from 'lucide-react';

interface LoginPageProps {
  onOpenDemoScenarios?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenDemoScenarios }) => {
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<Role>('teacher');
  const [username, setUsername] = useState('teacher@school.edu.sa');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sync default credentials when switching role tab
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (acc) {
      setUsername(acc.email || acc.username);
      setPassword('12345678');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = (role: Role) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl text-white tracking-tight">رَابِطْ</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                بوابة الدخول الموحد
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              المنصة المدرسية المتكاملة للتواصل بين المدرس 👨‍🏫 وولي الأمر 👨‍👩‍👦 والطالب 👨‍🎓
            </p>
          </div>
        </div>

        {onOpenDemoScenarios && (
          <button
            onClick={onOpenDemoScenarios}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 transition-all backdrop-blur-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>تجربة السيناريوهات المباشرة</span>
          </button>
        )}
      </header>

      {/* Main Login Card Container */}
      <main className="max-w-5xl w-full mx-auto my-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Welcome Info & Features Highlights */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/10">
              <ShieldCheck className="w-4 h-4" /> نظام آمن وموثوق لمدارس المستقبل
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              تابع ابنك لحظة بلحظة، وكن شريكاً في تفوقه الأكاديمي.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              منصة تواصل تفاعلية توفر تحديثاً فورياً للحضور والغياب، إشعارات انخفاض الدرجات،
              الواجبات اليومية، والتواصل المباشر مع المعلمين.
            </p>
          </div>

          {/* Core Highlights List */}
          <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-start gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                🔔
              </div>
              <div>
                <strong className="text-white block font-bold">إشعارات غياب وتأخر فورية:</strong>
                إشعار فوري لولي الأمر فور تحضير المعلم: «ابنك تم تسجيل غيابه اليوم».
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                ⚠️
              </div>
              <div>
                <strong className="text-white block font-bold">رصد درجات وتنبيهات المستوى:</strong>
                تنبيه الأسرة فوراً عند حصول الطالب على درجة أقل من 60% للمتابعة المنزلية.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                📊
              </div>
              <div>
                <strong className="text-white block font-bold">تقارير أداء وشهادات رسمية:</strong>
                تقرير بياني بنسب الحضور والدرجات قابل للطباعة المعتمدة بضغطة زر.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Interactive Login Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80">
          {/* Role Portal Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-600 mb-2.5">
              اختر بوابة الدخول الخاصة بك:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('teacher')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'teacher'
                    ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>بوابة المعلم</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('parent')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'parent'
                    ? 'bg-white text-emerald-700 shadow-md ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>بوابة ولي الأمر</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'student'
                    ? 'bg-white text-blue-700 shadow-md ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>بوابة الطالب</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {selectedRole === 'teacher'
                  ? 'البريد الإلكتروني أو اسم المستخدم'
                  : selectedRole === 'parent'
                  ? 'رقم الهوية أو رقم الجوال أو البريد'
                  : 'الرقم الأكاديمي أو اسم المستخدم'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedRole === 'teacher'
                      ? 'teacher@school.edu.sa'
                      : selectedRole === 'parent'
                      ? '0501234567'
                      : '2024-301'
                  }
                  required
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">كلمة المرور</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-600">تذكر بيانات تسجيل الدخول</span>
              </label>

              <span className="text-[11px] text-slate-400 font-medium">اتصال آمن ومشفّر 🔒</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'teacher'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  : selectedRole === 'parent'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    الدخول إلى حساب{' '}
                    {selectedRole === 'teacher'
                      ? 'المعلم'
                      : selectedRole === 'parent'
                      ? 'ولي الأمر'
                      : 'الطالب'}
                  </span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo 1-Click Access Area */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>الدخول السريع التجريبي (بنقرة واحدة بدون كلمة مرور):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher')}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-900 text-xs font-bold transition-all text-right flex items-center justify-between"
              >
                <div>
                  <span className="block font-black text-xs">أ. محمد الأحمدي</span>
                  <span className="text-[10px] text-indigo-600">المعلم ورائد الفصل</span>
                </div>
                <span className="text-base">👨‍🏫</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-900 text-xs font-bold transition-all text-right flex items-center justify-between"
              >
                <div>
                  <span className="block font-black text-xs">خالد الشمري</span>
                  <span className="text-[10px] text-emerald-600">ولي أمر أحمد وسارة</span>
                </div>
                <span className="text-base">👨‍👩‍👦</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-900 text-xs font-bold transition-all text-right flex items-center justify-between"
              >
                <div>
                  <span className="block font-black text-xs">أحمد الشمري</span>
                  <span className="text-[10px] text-blue-600">طالب الصف الثالث</span>
                </div>
                <span className="text-base">👨‍🎓</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">استعادة كلمة المرور</h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-slate-900">تم إرسال رابط إعادة التعيين</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تم إرسال رمز التحقق وكلمة المرور المؤقتة عبر رسالة نصية (SMS) والبريد الإلكتروني
                  المسجل.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSuccess(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-600 leading-relaxed">
                  أدخل رقم الهوية أو البريد الإلكتروني المسجل في المدرسة لتلقي رمز الدخول المؤقت:
                </p>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="مثال: 0501234567 أو parent@school.edu.sa"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200"
                  >
                    إرسال الرمز
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 border-t border-white/10 z-10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>جميع الحقوق محفوظة © منصة رَابِطْ للتواصل المدرسي والشراكة الأسرية 2026</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-200 cursor-pointer">سياسة الخصوصية</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">الدعم الفني للمدرسة</span>
        </div>
      </footer>
    </div>
  );
};
