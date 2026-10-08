import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const GradesTab: React.FC = () => {
  const { students, subjects, grades, addGrade } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State for Add Grade
  const [formStudentId, setFormStudentId] = useState<string>(students[0]?.id || '');
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '');
  const [formExamTitle, setFormExamTitle] = useState<string>('اختبار قصير 2');
  const [formScore, setFormScore] = useState<number>(8);
  const [formMaxScore, setFormMaxScore] = useState<number>(20);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formFeedback, setFormFeedback] = useState<string>('');

  const handleQuickAhmedScenario = () => {
    // Fills form with the prompt example: Ahmed, Math, 8/20!
    const ahmed = students.find((s) => s.id === 's1');
    if (ahmed) setFormStudentId('s1');
    setFormSubjectId('sub-math');
    setFormExamTitle('اختبار الرياضيات الشهري (المعادلات الخطية)');
    setFormScore(8);
    setFormMaxScore(20);
    setFormFeedback('الطالب تسرع في الإجابات ويحتاج متابعة مكثفة في المنزل لتعويض الفاقد التعليمي.');
    setShowAddModal(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === formStudentId);
    const subject = subjects.find((s) => s.id === formSubjectId);
    if (!student || !subject) return;

    addGrade({
      studentId: student.id,
      studentName: student.name,
      subjectId: subject.id,
      subjectName: subject.name,
      examTitle: formExamTitle,
      score: Number(formScore),
      maxScore: Number(formMaxScore),
      date: formDate,
      examType: 'quiz',
      teacherFeedback: formFeedback.trim() || undefined,
    });

    const perc = Math.round((Number(formScore) / Number(formMaxScore)) * 100);
    if (perc < 60) {
      setSuccessToast(
        `⚠️ تم رصد درجة ${formScore}/${formMaxScore} (${perc}%) وإرسال تنبيه آلي فوري لولي أمر الطالب ${student.name} لمتابعته!`
      );
    } else {
      setSuccessToast(
        `✅ تم رصد درجة ${formScore}/${formMaxScore} (${perc}%) بنجاح وإشعار ولي الأمر بالنتيجة.`
      );
    }

    setShowAddModal(false);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Filtered grades list
  const filteredGrades = grades.filter((g) => {
    if (selectedSubjectId !== 'all' && g.subjectId !== selectedSubjectId) return false;
    if (selectedStudentFilter !== 'all' && g.studentId !== selectedStudentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast notification */}
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

      {/* Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>سجل الدرجات والاختبارات المدرسية</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            إدخال درجات الطلاب ومتابعة تقدمهم مع إرسال إشعارات فورية لأولياء الأمور
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleQuickAhmedScenario}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
            title="تجربة رصد درجة 8/20 لأحمد المذكورة في فكرة المشروع"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>تجربة سيناريو 8/20 لأحمد</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>رصد درجة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">تصفية حسب المادة:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="all">جميع المواد</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">تصفية حسب الطالب:</span>
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="all">جميع الطلاب</option>
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 mr-auto">
          إجمالي النتائج المسجلة: {filteredGrades.length}
        </span>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-4">المادة</th>
                <th className="py-3 px-4">عنوان الاختبار / التقييم</th>
                <th className="py-3 px-4">الدرجة</th>
                <th className="py-3 px-4">النسبة والتقييم</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">ملاحظة المعلم لولي الأمر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.map((grade) => {
                const isLow = grade.percentage < 60;
                return (
                  <tr
                    key={grade.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isLow ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{grade.studentName}</span>
                        {isLow && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 inline-flex items-center gap-0.5"
                            title="تم إرسال إشعار فوري لولي الأمر بالمتابعة"
                          >
                            <AlertTriangle className="w-3 h-3" /> يحتاج متابعة
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {grade.subjectName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{grade.examTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-sm text-slate-900">
                        {grade.score}
                      </span>
                      <span className="text-slate-400 font-medium"> / {grade.maxScore}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
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
                        <span
                          className={`font-bold ${
                            isLow
                              ? 'text-rose-600'
                              : grade.percentage >= 85
                              ? 'text-emerald-600'
                              : 'text-indigo-600'
                          }`}
                        >
                          %{grade.percentage}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{grade.date}</td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600">
                      {grade.teacherFeedback || (
                        <span className="text-slate-300 italic">لا توجد ملاحظة</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">رصد درجة اختبار جديدة</h3>
                  <p className="text-xs text-slate-500">
                    إذا كانت الدرجة أقل من 60% سيتم إرسال إشعار تنبيه آلي فوري لولي الأمر
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

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطالب</label>
                  <select
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.studentNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة</label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الاختبار أو التقييم
                </label>
                <input
                  type="text"
                  value={formExamTitle}
                  onChange={(e) => setFormExamTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    درجة الطالب
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={formMaxScore}
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الدرجة العظمى
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Calculated indicator */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span>النسبة المئوية المحسوبة:</span>
                <span
                  className={`font-extrabold text-sm ${
                    Math.round((formScore / formMaxScore) * 100) < 60
                      ? 'text-rose-600'
                      : 'text-emerald-600'
                  }`}
                >
                  %{Math.round((formScore / formMaxScore) * 100)}
                  {Math.round((formScore / formMaxScore) * 100) < 60 && ' (تنبيه انخفاض مستوى ⚠️)'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظة المعلم وتوجيهاته لولي الأمر (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={formFeedback}
                  onChange={(e) => setFormFeedback(e.target.value)}
                  placeholder="مثال: الطالب يحتاج مراجعة وحل تمارين إضافية في المنزل..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
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
                  حفظ ورصد النتيجة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
