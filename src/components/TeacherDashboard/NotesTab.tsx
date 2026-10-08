import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Bookmark,
  Calendar,
  Send,
} from 'lucide-react';

export const NotesTab: React.FC = () => {
  const { students, notes, addStudentNote } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<'academic' | 'behavioral' | 'positive' | 'needs_improvement'>('academic');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const quickTemplates = [
    {
      cat: 'positive' as const,
      t: 'مشاركة نموذجية وتفاعل لافت 🌟',
      c: 'أظهر الطالب اليوم تفاعلاً استثنائياً في الحصة وساهم في مساعدة زملائه بحل المسائل المعقدة.',
    },
    {
      cat: 'academic' as const,
      t: 'تراجع في حل الواجبات المدرسية',
      c: 'لوحظ عدم إتمام الواجبات بدقة خلال هذا الأسبوع، نأمل التفضل بمتابعته في المنزل.',
    },
    {
      cat: 'behavioral' as const,
      t: 'نسيان الأدوات المدرسية',
      c: 'تكرر نسيان الأدوات الهندسية والكتاب المدرسي، نرجو التنبيه على الطالب بترتيب حقيبته مساءً.',
    },
    {
      cat: 'needs_improvement' as const,
      t: 'تشتت انتباه أثناء شرح المعلم',
      c: 'يحتاج الطالب إلى تعزيز التركيز داخل الفصل وعدم الانشغال بالأحاديث الجانبية.',
    },
  ];

  const handleApplyTemplate = (tpl: typeof quickTemplates[0]) => {
    setCategory(tpl.cat);
    setTitle(tpl.t);
    setContent(tpl.c);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === studentId);
    if (!student || !title.trim() || !content.trim()) return;

    addStudentNote({
      studentId: student.id,
      studentName: student.name,
      category,
      title: title.trim(),
      content: content.trim(),
      teacherName: 'أ. محمد الأحمدي (معلم الرياضيات)',
      isImportant,
    });

    setSuccessToast(`📝 تم حفظ الملاحظة وإرسال إشعار فوري لولي أمر الطالب ${student.name}!`);
    setShowAddModal(false);
    setTitle('');
    setContent('');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-indigo-700 underline font-medium"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>الملاحظات السلوكية والتربوية</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            توثيق الملاحظات الأكاديمية والسلوكية لتصل فوراً إلى ولي الأمر وتظهر في تقرير الطالب
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>كتابة ملاحظة جديدة</span>
        </button>
      </div>

      {/* Notes Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => {
          const isPos = note.category === 'positive';
          const isBeh = note.category === 'behavioral';
          const isImp = note.isImportant;

          return (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border transition-all ${
                isPos
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isImp
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-white border-slate-200'
              } shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPos
                          ? 'bg-emerald-100 text-emerald-800'
                          : isBeh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {isPos
                        ? '🌟 إشادة وتميز'
                        : isBeh
                        ? '⚠️ سلوكية'
                        : note.category === 'needs_improvement'
                        ? '💡 يحتاج تحسين'
                        : '📚 أكاديمية'}
                    </span>
                    {note.isImportant && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        تنبيه عاجل
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">{note.date}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <strong className="text-sm font-bold text-slate-900">{note.studentName}</strong>
                  <span className="text-xs text-slate-400">• {note.title}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-3 rounded-xl border border-slate-100">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>المعلم: {note.teacherName}</span>
                <span className="text-emerald-600 font-semibold">✓ تم الإرسال لولي الأمر</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">إضافة ملاحظة على الطالب</h3>
                  <p className="text-xs text-slate-500">
                    ستظهر لولي الأمر في إشعاراته وفي بطاقة تقرير الأداء
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Template Pills */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                قوالب جاهزة سريعة:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-right text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    {tpl.t}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطالب</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تصنيف الملاحظة
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as 'academic' | 'behavioral' | 'positive' | 'needs_improvement')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="academic">أكاديمية (تحصيل دراسي)</option>
                    <option value="behavioral">سلوكية (انضباط ومواظبة)</option>
                    <option value="positive">إشادة وتميز وتفوق 🌟</option>
                    <option value="needs_improvement">يحتاج متابعة وتحسين</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الملاحظة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تميز في التفاعل، أو نسيان أدوات"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص الملاحظة والتوجيه لولي الأمر
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب التوجيه التربوي الذي ترغب في إيصاله للأسرة..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="impCheck"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="impCheck" className="text-xs font-semibold text-slate-700">
                  تحديد كتنبيه عاجل يتطلب اهتماماً سريعاً
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all"
                >
                  إرسال الملاحظة لولي الأمر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
