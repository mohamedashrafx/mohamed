import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Subject,
  GradeRecord,
  AttendanceRecord,
  AttendanceStatus,
  Homework,
  StudentNote,
  Message,
  AppNotification,
  UserAccount,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_NOTES,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  DEMO_ACCOUNTS,
} from '../data/initialData';

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  login: (role: Role, customAccount?: UserAccount) => void;
  logout: () => void;

  // Roles & Selection
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeClassroom: string;
  setActiveClassroom: (classroom: string) => void;

  // Data lists
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  homework: Homework[];
  notes: StudentNote[];
  messages: Message[];
  notifications: AppNotification[];

  // Helpers
  currentStudent: Student | undefined;
  unreadNotificationsCount: number;

  // Mutations
  recordAttendance: (studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  batchRecordAttendance: (records: { studentId: string; status: AttendanceStatus; note?: string }[], date: string) => void;
  addGrade: (grade: Omit<GradeRecord, 'id' | 'percentage' | 'isLowGradeWarning'>) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'assignedDate'>) => void;
  toggleHomeworkCompletion: (homeworkId: string, studentId: string) => void;
  addStudentNote: (note: Omit<StudentNote, 'id' | 'date'>) => void;
  sendMessage: (studentId: string, text: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNewStudent: (newStudent: Omit<Student, 'id' | 'overallAverage' | 'attendanceRate'>) => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'rabt_school_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'is_authenticated');
    return saved === 'true';
  });

  // Role & selection
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEY_PREFIX + 'role') as Role) || 'teacher';
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    const defaultAcc = DEMO_ACCOUNTS.find((a) => a.role === currentRole);
    return defaultAcc || DEMO_ACCOUNTS[0];
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'selected_student') || 's1';
  });

  const [activeClassroom, setActiveClassroom] = useState<string>('شعبة أ');

  // Main collections with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'homework');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [notes, setNotes] = useState<StudentNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'selected_student', selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'homework', JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived current student
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Unread notifications for the active role
  const unreadNotificationsCount = notifications.filter((n) => {
    if (n.read) return false;
    if (currentRole === 'teacher') return n.targetRole === 'teacher';
    if (currentRole === 'parent') return n.targetRole === 'parent' && n.studentId === selectedStudentId;
    if (currentRole === 'student') return n.targetRole === 'student' && n.studentId === selectedStudentId;
    return false;
  }).length;

  // Helper to recalculate student statistics (attendance % and average grade)
  const recalculateStudentStats = (studentId: string, updatedGrades: GradeRecord[], updatedAttendance: AttendanceRecord[]) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        // Calculate attendance rate
        const studentAtt = updatedAttendance.filter((a) => a.studentId === studentId);
        let attendanceRate = student.attendanceRate;
        if (studentAtt.length > 0) {
          const presentCount = studentAtt.filter((a) => a.status === 'present' || a.status === 'late').length;
          attendanceRate = Math.round((presentCount / studentAtt.length) * 100);
        }

        // Calculate grades average
        const studentG = updatedGrades.filter((g) => g.studentId === studentId);
        let overallAverage = student.overallAverage;
        if (studentG.length > 0) {
          const totalPerc = studentG.reduce((sum, g) => sum + g.percentage, 0);
          overallAverage = Math.round((totalPerc / studentG.length) * 10) / 10;
        }

        return { ...student, attendanceRate, overallAverage };
      })
    );
  };

  // Record single attendance
  const recordAttendance = (studentId: string, date: string, status: AttendanceStatus, note?: string) => {
    const student = students.find((s) => s.id === studentId);
    const studentName = student ? student.name : 'الطالب';

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      studentId,
      studentName,
      date,
      status,
      note,
      markedBy: 'أ. محمد الأحمدي',
      timestamp: new Date().toISOString(),
    };

    // Filter out existing record for that student & date if any
    const updated = [newRecord, ...attendance.filter((a) => !(a.studentId === studentId && a.date === date))];
    setAttendance(updated);
    recalculateStudentStats(studentId, grades, updated);

    // If marked absent, trigger automated notification for Parent!
    if (status === 'absent') {
      const absentNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        type: 'attendance_absent',
        title: '🔔 إشعار غياب اليوم',
        message: `تم تسجيل غياب ابنك ${studentName} اليوم بتاريخ ${date}. يرجى تقديم العذر الطبي أو التواصل مع إدارة المدرسة.`,
        targetRole: 'parent',
        studentId,
        studentName,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
      };
      setNotifications((prev) => [absentNotif, ...prev]);
    } else if (status === 'late') {
      const lateNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        type: 'attendance_absent',
        title: '⏰ إشعار تأخر صباحي',
        message: `تم تسجيل تأخر ابنك ${studentName} اليوم بتاريخ ${date}${note ? ` (${note})` : ''}.`,
        targetRole: 'parent',
        studentId,
        studentName,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
      };
      setNotifications((prev) => [lateNotif, ...prev]);
    }
  };

  // Batch record attendance (for entire classroom)
  const batchRecordAttendance = (records: { studentId: string; status: AttendanceStatus; note?: string }[], date: string) => {
    const newRecords: AttendanceRecord[] = [];
    const newNotifs: AppNotification[] = [];

    records.forEach((rec) => {
      const student = students.find((s) => s.id === rec.studentId);
      const studentName = student ? student.name : 'الطالب';

      newRecords.push({
        id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        studentId: rec.studentId,
        studentName,
        date,
        status: rec.status,
        note: rec.note,
        markedBy: 'أ. محمد الأحمدي',
        timestamp: new Date().toISOString(),
      });

      if (rec.status === 'absent') {
        newNotifs.push({
          id: 'notif-' + Date.now() + '-' + rec.studentId,
          type: 'attendance_absent',
          title: '🔔 إشعار غياب اليوم',
          message: `ابنك ${studentName} تم تسجيل غيابه اليوم بتاريخ ${date}.`,
          targetRole: 'parent',
          studentId: rec.studentId,
          studentName,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
        });
      }
    });

    const studentIds = new Set(records.map((r) => r.studentId));
    const filteredOld = attendance.filter((a) => !(studentIds.has(a.studentId) && a.date === date));
    const updated = [...newRecords, ...filteredOld];
    setAttendance(updated);

    if (newNotifs.length > 0) {
      setNotifications((prev) => [...newNotifs, ...prev]);
    }

    records.forEach((rec) => {
      recalculateStudentStats(rec.studentId, grades, updated);
    });
  };

  // Add exam/test grade
  const addGrade = (rawGrade: Omit<GradeRecord, 'id' | 'percentage' | 'isLowGradeWarning'>) => {
    const percentage = Math.round((rawGrade.score / rawGrade.maxScore) * 100);
    const isLowGradeWarning = percentage < 60;

    const newGrade: GradeRecord = {
      ...rawGrade,
      id: 'g-' + Date.now(),
      percentage,
      isLowGradeWarning,
    };

    const updated = [newGrade, ...grades];
    setGrades(updated);
    recalculateStudentStats(rawGrade.studentId, updated, attendance);

    // Auto notification to parent
    if (isLowGradeWarning) {
      const lowGradeNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        type: 'low_grade',
        title: '⚠️ تنبيه درجات: يحتاج متابعة',
        message: `حصل ابنك ${rawGrade.studentName} على ${rawGrade.score}/${rawGrade.maxScore} (${percentage}%) في ${rawGrade.examTitle} (${rawGrade.subjectName}) - يُرجى الاطلاع على التفاصيل والمتابعة.`,
        targetRole: 'parent',
        studentId: rawGrade.studentId,
        studentName: rawGrade.studentName,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
      };
      setNotifications((prev) => [lowGradeNotif, ...prev]);
    } else {
      const goodGradeNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        type: percentage >= 90 ? 'honor' : 'low_grade',
        title: percentage >= 90 ? '🌟 تفوق وتميز أكاديمي' : '📊 رصد درجة اختبار جديدة',
        message: `تم رصد درجة ${rawGrade.score}/${rawGrade.maxScore} في ${rawGrade.subjectName} لابنك ${rawGrade.studentName}.`,
        targetRole: 'parent',
        studentId: rawGrade.studentId,
        studentName: rawGrade.studentName,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal',
      };
      setNotifications((prev) => [goodGradeNotif, ...prev]);
    }
  };

  // Add homework
  const addHomework = (hw: Omit<Homework, 'id' | 'assignedDate'>) => {
    const newHw: Homework = {
      ...hw,
      id: 'hw-' + Date.now(),
      assignedDate: new Date().toISOString().split('T')[0],
      statusMap: students.reduce((acc, st) => ({ ...acc, [st.id]: 'pending' }), {}),
    };
    setHomework((prev) => [newHw, ...prev]);

    // Send notification to parents and students
    const parentNotif: AppNotification = {
      id: 'notif-hw-p-' + Date.now(),
      type: 'new_homework',
      title: '📚 واجب مدرسي جديد',
      message: `أضاف المعلم واجباً جديداً: "${hw.title}" لمادة ${hw.subjectName} (تاريخ التسليم: ${hw.dueDate}).`,
      targetRole: 'parent',
      studentId: selectedStudentId,
      studentName: currentStudent?.name || 'الطالب',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
    };

    const studentNotif: AppNotification = {
      id: 'notif-hw-s-' + Date.now(),
      type: 'new_homework',
      title: '📚 واجب مدرسي مطلوب منك',
      message: `لديك واجب جديد في ${hw.subjectName}: "${hw.title}"، موعد التسليم: ${hw.dueDate}.`,
      targetRole: 'student',
      studentId: selectedStudentId,
      studentName: currentStudent?.name || 'الطالب',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
    };

    setNotifications((prev) => [parentNotif, studentNotif, ...prev]);
  };

  // Toggle homework completion for student
  const toggleHomeworkCompletion = (homeworkId: string, studentId: string) => {
    setHomework((prev) =>
      prev.map((hw) => {
        if (hw.id !== homeworkId) return hw;
        const currentStatus = hw.statusMap?.[studentId] || 'pending';
        const newStatus = currentStatus === 'completed' || currentStatus === 'submitted' ? 'pending' : 'submitted';
        return {
          ...hw,
          statusMap: {
            ...hw.statusMap,
            [studentId]: newStatus,
          },
        };
      })
    );
  };

  // Add student note
  const addStudentNote = (note: Omit<StudentNote, 'id' | 'date'>) => {
    const newNote: StudentNote = {
      ...note,
      id: 'note-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [newNote, ...prev]);

    const notif: AppNotification = {
      id: 'notif-note-' + Date.now(),
      type: 'new_note',
      title: note.category === 'positive' ? '🌟 إشادة وتميز من المعلم' : '📝 ملاحظة تربوية من المعلم',
      message: `كتب المعلم ملاحظة جديدة بخصوص ${note.studentName}: "${note.title}"`,
      targetRole: 'parent',
      studentId: note.studentId,
      studentName: note.studentName,
      timestamp: new Date().toISOString(),
      read: false,
      priority: note.isImportant ? 'high' : 'normal',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Send direct message
  const sendMessage = (studentId: string, text: string) => {
    if (!text.trim()) return;
    const student = students.find((s) => s.id === studentId);
    const senderRole = currentRole === 'teacher' ? 'teacher' : 'parent';
    const recipientRole = senderRole === 'teacher' ? 'parent' : 'teacher';
    const senderName =
      senderRole === 'teacher' ? 'أ. محمد الأحمدي (المعلم)' : student ? student.parentName : 'ولي الأمر';

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      senderRole,
      senderName,
      recipientRole,
      studentId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Send notification to recipient
    const notif: AppNotification = {
      id: 'notif-msg-' + Date.now(),
      type: 'message',
      title: `💬 رسالة جديدة من ${senderName}`,
      message: text.length > 60 ? text.substring(0, 60) + '...' : text,
      targetRole: recipientRole,
      studentId,
      studentName: student?.name || 'الطالب',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Notification management
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (
          (currentRole === 'teacher' && n.targetRole === 'teacher') ||
          (currentRole === 'parent' && n.targetRole === 'parent' && n.studentId === selectedStudentId) ||
          (currentRole === 'student' && n.targetRole === 'student' && n.studentId === selectedStudentId)
        ) {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  // Add new student
  const addNewStudent = (newStudent: Omit<Student, 'id' | 'overallAverage' | 'attendanceRate'>) => {
    const student: Student = {
      ...newStudent,
      id: 's-' + Date.now(),
      overallAverage: 85,
      attendanceRate: 100,
    };
    setStudents((prev) => [...prev, student]);
  };

  // Auth methods
  const login = (role: Role, customAccount?: UserAccount) => {
    setCurrentRole(role);
    const targetAccount =
      customAccount || DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    setCurrentUser(targetAccount);
    if (targetAccount.studentId) {
      setSelectedStudentId(targetAccount.studentId);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Reset demo
  const resetToSampleData = () => {
    setStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setHomework(INITIAL_HOMEWORK);
    setNotes(INITIAL_NOTES);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedStudentId('s1');
    setCurrentRole('teacher');
    setCurrentUser(DEMO_ACCOUNTS[0]);
    setIsAuthenticated(true);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        currentRole,
        setCurrentRole,
        selectedStudentId,
        setSelectedStudentId,
        activeClassroom,
        setActiveClassroom,
        students,
        subjects,
        grades,
        attendance,
        homework,
        notes,
        messages,
        notifications,
        currentStudent,
        unreadNotificationsCount,
        recordAttendance,
        batchRecordAttendance,
        addGrade,
        addHomework,
        toggleHomeworkCompletion,
        addStudentNote,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNewStudent,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
