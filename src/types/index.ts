export type Role = 'teacher' | 'parent' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  gradeLevel: string; // e.g. "الصف الثالث المتوسط"
  classroom: string; // e.g. "شعبة أ"
  studentNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  overallAverage: number; // e.g. 84.5%
  attendanceRate: number; // e.g. 91%
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  markedBy: string;
  timestamp: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  teacherName: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  examTitle: string; // e.g. "اختبار شهر أكتوبر" أو "اختبار قصير 1"
  score: number; // e.g. 8
  maxScore: number; // e.g. 20
  percentage: number; // calculated e.g. 40
  date: string;
  examType: 'quiz' | 'midterm' | 'final' | 'homework_test' | 'project';
  teacherFeedback?: string;
  isLowGradeWarning?: boolean; // true if < 60%
}

export interface Homework {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classroom: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  assignedDate: string;
  statusMap?: Record<string, 'pending' | 'submitted' | 'late' | 'completed'>; // studentId -> status
}

export interface StudentNote {
  id: string;
  studentId: string;
  studentName: string;
  category: 'academic' | 'behavioral' | 'positive' | 'needs_improvement';
  title: string;
  content: string;
  date: string;
  teacherName: string;
  isImportant?: boolean;
}

export interface Message {
  id: string;
  senderRole: 'teacher' | 'parent';
  senderName: string;
  recipientRole: 'teacher' | 'parent';
  studentId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType = 'attendance_absent' | 'low_grade' | 'new_homework' | 'new_note' | 'message' | 'honor';

export interface UserAccount {
  id: string;
  name: string;
  role: Role;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  title: string;
  studentId?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  targetRole: Role;
  studentId: string;
  studentName: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority?: 'high' | 'medium' | 'normal';
}
