'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { DashboardOverview } from '@/components/DashboardOverview';
import { CallSimulator } from '@/components/CallSimulator';
import { TrustedContactsManager } from '@/components/TrustedContactsManager';
import { ClassProfileEditor } from '@/components/ClassProfileEditor';
import { CallSettingsManager } from '@/components/CallSettingsManager';
import { CallHistoryView } from '@/components/CallHistoryView';
import { CustomDomainManager } from '@/components/CustomDomainManager';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { TermsAndConditions } from '@/components/TermsAndConditions';
import { ApprovalModal } from '@/components/ApprovalModal';
import { GnaniVoiceLab } from '@/components/GnaniVoiceLab';
import { MVPVoiceAssistant } from '@/components/MVPVoiceAssistant';
import { TrustedContact, EducatorCategory } from '@/lib/types';
import { X, Plus, MessageCircle } from 'lucide-react';

function MainApp() {
  const {
    currentTeacher,
    addNewTeacher,
    pendingApprovals,
    createPendingApproval,
    approveTransfer,
    declineTransfer,
    triggerApprovalTimeout
  } = useApp();

  const [viewMode, setViewMode] = useState<'landing' | 'app' | 'privacy' | 'terms'>('app');
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Simulator state
  const [simScenario, setSimScenario] = useState<'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d'>('scenario_b');
  const [simContact, setSimContact] = useState<TrustedContact | null>(null);

  // Add Educator modal
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newCategory, setNewCategory] = useState<EducatorCategory>('General Academics');
  const [newCity, setNewCity] = useState('');

  // Handle simulation scenario launch
  const handleLaunchSimulator = (scenario?: string, contact?: TrustedContact) => {
    if (scenario && ['scenario_a', 'scenario_b', 'scenario_c', 'scenario_d'].includes(scenario)) {
      setSimScenario(scenario as any);
    }
    if (contact) {
      setSimContact(contact);
    }
    setViewMode('app');
    setCurrentTab('simulator');
  };

  const handleCreateTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newClassName.trim()) return;

    addNewTeacher(newTeacherName.trim(), newCategory, newClassName.trim());

    setNewTeacherName('');
    setNewClassName('');
    setNewCity('');
    setIsAddTeacherOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0C1420] text-[#132238] dark:text-[#F8FAFC] transition-colors">
      {viewMode === 'app' ? (
        /* Workspace Layout: Left Sidebar + Top Bar + Content Canvas */
        <div className="flex min-h-screen">
          {/* Desktop Left Sidebar (hidden on mobile) */}
          <div className="hidden lg:block shrink-0">
            <AppSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onNavigateHome={() => setViewMode('landing')}
            />
          </div>

          {/* Right Main Canvas */}
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenAddTeacher={() => setIsAddTeacherOpen(true)}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
              {currentTab === 'overview' && (
                <DashboardOverview
                  onNavigateTab={(tab, scenario) => {
                    if (scenario) {
                      handleLaunchSimulator(scenario);
                    } else {
                      setCurrentTab(tab);
                    }
                  }}
                  onOpenApprovalModal={() => {
                    // Handled automatically by pending approvals modal
                  }}
                />
              )}

              {currentTab === 'simulator' && (
                <CallSimulator
                  initialScenario={simScenario}
                  selectedContact={simContact}
                  onRequestApproval={(data) => {
                    createPendingApproval({
                      callerName: data.callerName,
                      callerNumber: data.callerNumber,
                      relationship: data.relationship,
                      purpose: data.purpose
                    });
                  }}
                />
              )}

              {currentTab === 'voicelab' && <GnaniVoiceLab key={currentTeacher.id} />}
              
              {currentTab === 'contacts' && (
                <TrustedContactsManager
                  onTestContactCall={(contact) => {
                    handleLaunchSimulator('scenario_a', contact);
                  }}
                />
              )}

              {currentTab === 'profile' && <ClassProfileEditor />}

              {currentTab === 'settings' && <CallSettingsManager key={currentTeacher.id} />}

              {currentTab === 'history' && <CallHistoryView />}

              {currentTab === 'domain' && <CustomDomainManager />}

              {currentTab === 'mvp' && (
                <MVPVoiceAssistant onExploreDashboard={() => setCurrentTab('overview')} />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* Marketing Landing Page or Privacy/Terms Documents */
        <div className="min-h-screen flex flex-col justify-between">
          <div>
            <Navbar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenAddTeacher={() => setIsAddTeacherOpen(true)}
            />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              {viewMode === 'privacy' && (
                <PrivacyPolicy onBack={() => setViewMode('app')} />
              )}
              {viewMode === 'terms' && (
                <TermsAndConditions onBack={() => setViewMode('app')} />
              )}
              {viewMode === 'landing' && (
                <LandingPage
                  onEnterApp={(tab = 'overview', scenario) => {
                    if (scenario) {
                      handleLaunchSimulator(scenario);
                    } else {
                      setViewMode('app');
                      setCurrentTab(tab);
                    }
                  }}
                  onOpenPrivacy={() => setViewMode('privacy')}
                  onOpenTerms={() => setViewMode('terms')}
                  onOpenDomain={() => {
                    setViewMode('app');
                    setCurrentTab('domain');
                  }}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* 1-Tap Real-time Screening Approval Modal */}
      {pendingApprovals.length > 0 && (
        <ApprovalModal
          approval={pendingApprovals[0]}
          onApprove={(id) => approveTransfer(id)}
          onDecline={(id, reason) => declineTransfer(id, reason)}
          onTimeout={(id) => triggerApprovalTimeout(id)}
          onClose={() => triggerApprovalTimeout(pendingApprovals[0].id)}
        />
      )}

      {/* Add New Educator Profile Modal */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-3xl editorial-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Add New Educator Profile
                </h3>
                <p className="text-xs text-[#64748B]">
                  Provision an isolated tutor or institute workspace in Call to Teach
                </p>
              </div>
              <button
                onClick={() => setIsAddTeacherOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#F2EFE8] dark:hover:bg-[#162338]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacherSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Teacher / Faculty Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arvind Mehta"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Academy / Institute / Tuition Brand
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mehta Physics Academy"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Educator Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                >
                  <option value="Home Tuition">Home Tuition (Personalized Tutoring)</option>
                  <option value="Mathematics Tutor">Mathematics Tutor (Pure, Applied, IIT-JEE)</option>
                  <option value="Science & Physics">Science &amp; Physics (Board, NEET, JEE Foundation)</option>
                  <option value="English & Language">English &amp; Language (Grammar, Literature, IELTS)</option>
                  <option value="Music & Performing Arts">Music &amp; Performing Arts (Classical, Vocal, Instrumental)</option>
                  <option value="Coaching Institute">Coaching Institute / Academy</option>
                  <option value="General Academics">General Academics (Classes 1–10)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nagpur, Pune, Mumbai"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:bg-[#F2EFE8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#1B365D] hover:bg-[#152B4A] transition-colors shadow-xs"
                >
                  Create &amp; Switch Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Educator Support Contact Widget */}
      <aside aria-label="Educator Support" className="fixed bottom-6 right-6 z-30">
        <a
          href={`https://wa.me/919876543210?text=${encodeURIComponent(
            `Hello Call to Teach! I am inquiring about AI call screening for ${currentTeacher.profile.className}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3B7A57] hover:bg-[#2F6145] text-white text-xs font-bold shadow-lg transition-all"
        >
          <MessageCircle className="h-4 w-4 fill-white" />
          <span className="hidden sm:inline">Call to Teach Support</span>
          <span className="sm:hidden">Support</span>
        </a>
      </aside>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
