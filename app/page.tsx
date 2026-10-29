'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ClassProfileEditor } from '@/components/ClassProfileEditor';
import { TrustedContactsManager } from '@/components/TrustedContactsManager';
import { CallSettingsManager } from '@/components/CallSettingsManager';
import { CallSimulator } from '@/components/CallSimulator';
import { CallHistoryView } from '@/components/CallHistoryView';
import { ApprovalModal } from '@/components/ApprovalModal';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { TermsAndConditions } from '@/components/TermsAndConditions';
import { CustomDomainManager } from '@/components/CustomDomainManager';
import { MessageCircle } from 'lucide-react';
import { CallLogItem, PendingApproval, TrustedContact } from '@/lib/types';

function MainApp() {
  const { currentTeacher, approveTransfer, declineTransfer, triggerApprovalTimeout, clearPendingApproval, createPendingApproval } = useApp();

  const [viewMode, setViewMode] = useState<'landing' | 'app' | 'privacy' | 'terms'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [activeScenarioForSimulator, setActiveScenarioForSimulator] = useState<'scenario_a' | 'scenario_b' | 'scenario_c' | null>('scenario_b');
  const [selectedContactForSimulator, setSelectedContactForSimulator] = useState<TrustedContact | null>(null);
  const [selectedCallDetail, setSelectedCallDetail] = useState<CallLogItem | null>(null);

  // Active approval modal currently showing
  const [activeApproval, setActiveApproval] = useState<PendingApproval | null>(null);

  // Trigger scenario simulator from any screen
  const launchScenario = (scenario: 'scenario_a' | 'scenario_b' | 'scenario_c' = 'scenario_b') => {
    setActiveScenarioForSimulator(scenario);
    setViewMode('app');
    setCurrentTab('simulator');
  };

  const handleTestContactCall = (contact: TrustedContact) => {
    setSelectedContactForSimulator(contact);
    setActiveScenarioForSimulator('scenario_a');
    setViewMode('app');
    setCurrentTab('simulator');
  };

  const handleRequestApproval = (data: {
    callerName: string;
    callerNumber: string;
    relationship?: string;
    purpose: string;
    onResult: (status: 'approved' | 'declined' | 'timed_out') => void;
  }) => {
    const approval = createPendingApproval({
      callId: `call_${Date.now()}`,
      callerName: data.callerName,
      callerNumber: data.callerNumber,
      relationship: data.relationship,
      purpose: data.purpose,
      urgency: 'normal',
      timestamp: 'Just now'
    });
    setActiveApproval(approval);

    (approval as any)._onResult = data.onResult;
  };

  const handleApprove = (id: string) => {
    approveTransfer(id);
    if (activeApproval && (activeApproval as any)._onResult) {
      (activeApproval as any)._onResult('approved');
    }
  };

  const handleDecline = (id: string) => {
    declineTransfer(id);
    if (activeApproval && (activeApproval as any)._onResult) {
      (activeApproval as any)._onResult('declined');
    }
  };

  const handleTimeout = (id: string) => {
    triggerApprovalTimeout(id);
    if (activeApproval && (activeApproval as any)._onResult) {
      (activeApproval as any)._onResult('timed_out');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          openSimulator={() => launchScenario('scenario_b')}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* View Routing */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {viewMode === 'privacy' ? (
            <PrivacyPolicy onBack={() => setViewMode('landing')} />
          ) : viewMode === 'terms' ? (
            <TermsAndConditions onBack={() => setViewMode('landing')} />
          ) : viewMode === 'landing' ? (
            <LandingPage
              onEnterApp={(tab = 'overview') => {
                setViewMode('app');
                setCurrentTab(tab);
              }}
              onLaunchSimulation={(scenario = 'scenario_b') => launchScenario(scenario)}
              onOpenPrivacy={() => setViewMode('privacy')}
              onOpenTerms={() => setViewMode('terms')}
              onOpenDomain={() => {
                setViewMode('app');
                setCurrentTab('domain');
              }}
            />
          ) : (
            <div>
              {currentTab === 'overview' && (
                <DashboardOverview
                  onOpenSimulator={(scenario = 'scenario_b') => launchScenario(scenario)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onViewCallDetails={(call) => {
                    setSelectedCallDetail(call);
                    setCurrentTab('history');
                  }}
                />
              )}

              {currentTab === 'simulator' && (
                <CallSimulator
                  initialScenario={activeScenarioForSimulator}
                  selectedContact={selectedContactForSimulator}
                  onRequestApproval={handleRequestApproval}
                  onCallLogged={(_call) => {
                    // Call committed to history
                  }}
                />
              )}

              {currentTab === 'contacts' && (
                <TrustedContactsManager onTestContactCall={handleTestContactCall} />
              )}

              {currentTab === 'profile' && <ClassProfileEditor />}

              {currentTab === 'settings' && <CallSettingsManager />}

              {currentTab === 'domain' && <CustomDomainManager />}

              {currentTab === 'history' && (
                <CallHistoryView
                  selectedCallForModal={selectedCallDetail}
                  onClearSelectedCall={() => setSelectedCallDetail(null)}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating 1-Tap Screen Approval Modal */}
      {activeApproval && (
        <ApprovalModal
          approval={activeApproval}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onTimeout={handleTimeout}
          onClose={() => {
            clearPendingApproval(activeApproval.id);
            setActiveApproval(null);
          }}
        />
      )}

      {/* Structured WhatsApp Chat Button (Clean rectangular/square-radius geometry, no pill) */}
      <aside aria-label="Support chat" className="fixed bottom-5 right-5 z-40">
        <a
          href={`https://wa.me/919822098765?text=${encodeURIComponent(
            `Namaste ${currentTeacher.profile.teacherName}! I am interested in admission details and demo classes at ${currentTeacher.profile.className}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition"
        >
          <MessageCircle className="h-4 w-4 text-white" />
          <span className="hidden sm:inline">WhatsApp Inquiries</span>
          <span className="sm:hidden">WhatsApp</span>
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
