import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  FileText,
} from 'lucide-react';

export const HomeworkTab: React.FC = () => {
  const { homework, subjects, students, addHomework } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [maxPoints, setMaxPoints] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject || !title.trim()) return;

    addHomework({
      title: title.trim(),
      subjectId: subject.id,
      subjectName: subject.name,
      classroom: 'شعبة أ',
      description: description.trim(),
      dueDate,
      maxPoints: Number(maxPoints),
    });

    setSuccessToast(`📚 تم نشر الواجب وإرسال إشعار فوري لجميع الطلاب وأولياء أمورهم!`);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
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
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>إدارة الواجبات والمهام المدرسية</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            إضافة الواجبات المنزلية ومتابعة نسب تسليم وإنجاز الطلاب
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة واجب جديد</span>
        </button>
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homework.map((hw) => {
          // Calculate submissions count
          const totalAssigned = students.length;
          const completedCount = Object.values(hw.statusMap || {}).filter(
            (st) => st === 'submitted' || st === 'completed'
          ).length;
          const completionPerc = Math.round((completedCount / totalAssigned) * 100);

          return (
            <div
              key={hw.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {hw.subjectName}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>تسليم: {hw.dueDate}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {hw.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                {/* Submission progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">نسبة تسليم الطلاب:</span>
                    <span className="font-bold text-slate-800">
                      {completedCount} من {totalAssigned} طلاب (%{completionPerc})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionPerc}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>الدرجة: {hw.maxPoints} نقاط</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> متاح للطالب وولي الأمر
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📚
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">إضافة واجب مدرسي جديد</h3>
                  <p className="text-xs text-slate-500">
                    سيتم إشعار جميع الطلاب وأولياء أمورهم تلقائياً فور النشر
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

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الواجب
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: حل تمارين الوحدة الثالثة صفحة 55"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الدرجة المستحقة
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تاريخ الاستحقاق (آخر موعد للتسليم)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تفاصيل وتعليمات الواجب
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب التوجيهات أو أرقام المسائل المطلوب من الطالب حلها..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
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
                  نشر الواجب وإشعار الجميع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
