import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';

export const MessagesTab: React.FC = () => {
  const { students, messages, sendMessage } = useApp();

  const [activeStudentId, setActiveStudentId] = useState<string>('s1'); // default to Ahmed's parent
  const [inputText, setInputText] = useState('');

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // Filter messages for active student
  const threadMessages = messages.filter((m) => m.studentId === activeStudentId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeStudentId, inputText);
    setInputText('');
  };

  const quickTeacherReplies = [
    'السلام عليكم، نود إحاطتكم علماً بأهمية مراجعة درس الجبر اليوم لتعويض الفاقد.',
    'شكراً لتعاونكم واهتمامكم الكريم بمتابعة الواجبات.',
    'تم استلام العذر الطبي وسيتم تعديل حالة الغياب إلى معذور.',
    'يسعدني إبلاغكم بأن مستوى الطالب شهد تحسناً ملموساً هذا الأسبوع 👏.',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      {/* Parents Contacts Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-200 bg-slate-50/70 p-4 flex flex-col">
        <div className="mb-3">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>محادثات أولياء الأمور</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            تواصل مباشر مع ولي أمر كل طالب
          </span>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1">
          {students.map((student) => {
            const lastMsg = messages
              .filter((m) => m.studentId === student.id)
              .slice(-1)[0];
            const isSelected = student.id === activeStudentId;

            return (
              <button
                key={student.id}
                onClick={() => setActiveStudentId(student.id)}
                className={`w-full p-3 rounded-xl text-right transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-white text-indigo-900 shadow-xs border border-indigo-200 ring-1 ring-indigo-200 font-bold'
                    : 'hover:bg-slate-200/50 text-slate-700'
                }`}
              >
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{student.parentName}</span>
                    <span className="text-[10px] text-slate-400">
                      {student.name.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : 'انقر لبدء المحادثة'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
          <div className="flex items-center gap-3">
            <img
              src={activeStudent?.avatar}
              alt={activeStudent?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-100"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{activeStudent?.parentName}</h4>
              <p className="text-xs text-slate-500">
                ولي أمر الطالب: {activeStudent?.name} ({activeStudent?.gradeLevel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Phone className="w-3 h-3 text-emerald-600" />
              {activeStudent?.parentPhone}
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20 max-h-[380px]">
          {threadMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">لا توجد رسائل سابقة. يمكنك إرسال رسالة الآن لولي الأمر.</p>
            </div>
          ) : (
            threadMessages.map((msg) => {
              const isTeacher = msg.senderRole === 'teacher';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isTeacher
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="font-bold text-[10px] mb-1 opacity-80">{msg.senderName}</p>
                    <p>{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1.5 flex items-center gap-1 ${
                        isTeacher ? 'text-indigo-200 justify-end' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isTeacher && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">ردود سريعة:</span>
          {quickTeacherReplies.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(qr)}
              className="bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-2.5 py-1 rounded-lg text-slate-700 whitespace-nowrap transition-colors"
            >
              {qr.slice(0, 30)}...
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`اكتب رسالة إلى ${activeStudent?.parentName}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-200"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
