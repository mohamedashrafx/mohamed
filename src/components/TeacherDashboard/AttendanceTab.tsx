import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Send,
  AlertCircle,
  BellRing,
  Sparkles,
  Users,
} from 'lucide-react';

export const AttendanceTab: React.FC = () => {
  const { students, attendance, recordAttendance, batchRecordAttendance } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Get current attendance status for each student on selectedDate
  const getStudentStatus = (studentId: string): AttendanceStatus | 'unmarked' => {
    const record = attendance.find((a) => a.studentId === studentId && a.date === selectedDate);
    return record ? record.status : 'unmarked';
  };

  const getStudentNote = (studentId: string): string => {
    const record = attendance.find((a) => a.studentId === studentId && a.date === selectedDate);
    return record?.note || '';
  };

  // Quick mark for one student
  const handleMark = (studentId: string, status: AttendanceStatus, note?: string) => {
    const student = students.find((s) => s.id === studentId);
    recordAttendance(studentId, selectedDate, status, note);

    if (status === 'absent') {
      setLastActionMessage(
        `🚨 تم تسجيل غياب "${student?.name}" وإرسال إشعار فوري لولي أمره: (ابنك تم تسجيل غيابه اليوم)`
      );
    } else if (status === 'late') {
      setLastActionMessage(`⏰ تم تسجيل تأخر "${student?.name}" وتنبيه ولي أمره`);
    } else {
      setLastActionMessage(`✅ تم تسجيل حضور "${student?.name}"`);
    }

    setTimeout(() => {
      setLastActionMessage(null);
    }, 5000);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const records = students.map((s) => ({
      studentId: s.id,
      status: 'present' as AttendanceStatus,
    }));
    batchRecordAttendance(records, selectedDate);
    setLastActionMessage('✅ تم تسجيل جميع الطلاب حاضرين لهذا اليوم بنجاح!');
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  // Filter students
  const filteredStudents = students.filter(
    (s) => s.name.includes(searchQuery) || s.studentNumber.includes(searchQuery)
  );

  // Statistics for selected date
  const dateRecords = attendance.filter((a) => a.date === selectedDate);
  const presentCount = dateRecords.filter((a) => a.status === 'present').length;
  const absentCount = dateRecords.filter((a) => a.status === 'absent').length;
  const lateCount = dateRecords.filter((a) => a.status === 'late').length;
  const excusedCount = dateRecords.filter((a) => a.status === 'excused').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Feedback alert */}
      {lastActionMessage && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-between animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-indigo-600 animate-bounce" />
            <span className="text-sm font-semibold">{lastActionMessage}</span>
          </div>
          <button
            onClick={() => setLastActionMessage(null)}
            className="text-xs text-indigo-700 hover:text-indigo-900 underline font-medium"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold text-slate-700">تاريخ التحضير:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تسجيل حضور الكل</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الطالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Daily Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 font-semibold">حاضر اليوم</span>
            <p className="text-2xl font-black text-emerald-900 mt-1">{presentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-700 font-semibold">غائب (إشعار آلي لولي الأمر)</span>
            <p className="text-2xl font-black text-rose-900 mt-1">{absentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold">متأخر</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{lateCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-700 font-semibold">عذر مقبول</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{excusedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notice box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            💡 كيف يعمل نظام الإشعارات الآلي مع ولي الأمر؟
          </p>
          <p>
            بمجرد النقر على زر <span className="font-bold text-rose-600">"غائب"</span> لأي طالب (مثال: أحمد الشمري)،
            يقوم النظام تلقائياً وبشكل فوري بإرسال تنبيه في حساب ولي الأمر بصيغة:
            <span className="font-semibold text-slate-900"> «🔔 ابنك أحمد تم تسجيل غيابه اليوم»</span>
            دون الحاجة لإجراء يدوي منفصل.
          </p>
        </div>
      </div>

      {/* Students Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>قائمة طلاب الصف الثالث المتوسط - شعبة أ ({filteredStudents.length} طلاب)</span>
          </h3>
          <span className="text-xs text-slate-500">
            تاريخ السجل: {selectedDate}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student) => {
            const status = getStudentStatus(student.id);
            const note = getStudentNote(student.id);

            return (
              <div
                key={student.id}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  status === 'absent'
                    ? 'bg-rose-50/40'
                    : status === 'late'
                    ? 'bg-amber-50/30'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{student.name}</span>
                      {student.name.includes('أحمد') && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          حالة التجربة
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>رقم الطالب: {student.studentNumber}</span>
                      <span>•</span>
                      <span>ولي الأمر: {student.parentName}</span>
                    </div>
                    {note && (
                      <p className="text-xs text-amber-700 mt-1 font-medium bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                        ملاحظة: {note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleMark(student.id, 'present')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      status === 'present'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>حاضر</span>
                  </button>

                  <button
                    onClick={() => handleMark(student.id, 'absent', 'غياب بدون عذر مسبق')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      status === 'absent'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                    title="تسجيل غياب وإرسال إشعار فوري لولي الأمر"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>غائب 🔔</span>
                  </button>

                  <button
                    onClick={() => handleMark(student.id, 'late', 'تأخر عن الحصة الأولى')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      status === 'late'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>متأخر</span>
                  </button>

                  <button
                    onClick={() => handleMark(student.id, 'excused', 'عذر طبي')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      status === 'excused'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>معذور</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
