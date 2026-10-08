/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/Auth/LoginPage';
import { TeacherView } from './components/TeacherDashboard/TeacherView';
import { ParentView } from './components/ParentDashboard/ParentView';
import { StudentView } from './components/StudentDashboard/StudentView';
import { PrintableReportCard } from './components/Reports/PrintableReportCard';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import {
  GraduationCap,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  BellRing,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole, selectedStudentId, isAuthenticated } = useApp();

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStudentId, setReportStudentId] = useState(selectedStudentId);

  const handleOpenReportForStudent = (studentId: string) => {
    setReportStudentId(studentId);
    setShowReportModal(true);
  };

  const handleOpenReportModal = () => {
    setReportStudentId(selectedStudentId);
    setShowReportModal(true);
  };

  // If user is not logged in, render the Login Page!
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onOpenDemoScenarios={() => setShowDemoModal(true)} />

        {showDemoModal && (
          <DemoScenariosModal
            onClose={() => setShowDemoModal(false)}
            onOpenReportModal={handleOpenReportModal}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenDemoModal={() => setShowDemoModal(true)}
        onOpenReportModal={handleOpenReportModal}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentRole === 'teacher' && (
          <TeacherView
            onOpenReportForStudent={handleOpenReportForStudent}
            onOpenDemoModal={() => setShowDemoModal(true)}
          />
        )}

        {currentRole === 'parent' && (
          <ParentView onOpenReportModal={handleOpenReportModal} />
        )}

        {currentRole === 'student' && (
          <StudentView onOpenReportModal={handleOpenReportModal} />
        )}
      </main>

      {/* Official Printable Report Card Modal */}
      {showReportModal && (
        <PrintableReportCard
          studentId={reportStudentId}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Interactive Demo Scenarios Guided Modal */}
      {showDemoModal && (
        <DemoScenariosModal
          onClose={() => setShowDemoModal(false)}
          onOpenReportModal={handleOpenReportModal}
        />
      )}

      {/* Platform Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ر
            </div>
            <span className="font-bold text-slate-800">
              منصة رَابِطْ - شراكة متكاملة بين المدرسة والأسرة
            </span>
          </div>

          <p className="flex items-center gap-1">
            <span>تحديث فوري لبيانات الحضور والدرجات والواجبات والملاحظات</span>
          </p>

          <div className="flex items-center gap-3 font-semibold text-slate-600">
            <button
              onClick={() => setShowDemoModal(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              دليل التجربة
            </button>
            <span>•</span>
            <button
              onClick={handleOpenReportModal}
              className="hover:text-indigo-600 transition-colors"
            >
              التقرير الأكاديمي
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
