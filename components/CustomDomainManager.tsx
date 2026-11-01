'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Globe,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Info,
  Server,
  AlertCircle
} from 'lucide-react';

export const CustomDomainManager: React.FC = () => {
  const { currentTeacher } = useApp();
  const slug = currentTeacher.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const defaultPublicUrl = `calltoteach.in/t/${slug}`;
  const [customDomain, setCustomDomain] = useState(`${slug}classes.in`);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Never show unconnected as connected by default!
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const dnsRecords = [
    {
      type: 'CNAME',
      name: 'www',
      value: 'cname.calltoteach.in',
      ttl: '3600',
      status: isConnected ? 'Active' : 'Pending DNS'
    },
    {
      type: 'TXT',
      name: '_calltoteach-verify',
      value: `ctt-verify-${slug}-8923a`,
      ttl: '3600',
      status: isConnected ? 'Verified' : 'Pending Validation'
    },
    {
      type: 'A',
      name: '@',
      value: '76.76.21.21',
      ttl: '3600',
      status: isConnected ? 'Routed' : 'Pending Pointing'
    }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsConnected(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Globe className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>Public Web Identity</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Domain &amp; Public Link Management
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            Every teacher profile gets a fast, free public inquiry portal under Call to Teach, or you can point your own custom `.in` / `.com` academy domain.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="shrink-0">
          <div className="rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] px-4 py-2 flex items-center gap-2 shadow-2xs text-xs font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected ? 'bg-[#3B7A57]' : 'bg-[#C86D51]'
              }`}
            />
            <span className="text-[#132238] dark:text-[#F8FAFC]">
              {isConnected ? 'Custom Domain: Active' : 'Default Subdomain Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Default URL Card + Custom Domain Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Included Default Public Address (5 cols) */}
        <div className="lg:col-span-5 editorial-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B365D] uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-[#3B7A57]" />
              <span>Free Included Web Link</span>
            </div>
            <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
              Instant Public Profile URL
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your parents and students can review fee structures, trial policies, and book demo classes at your official link anytime:
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#132238] dark:text-[#F8FAFC] truncate">
                https://{defaultPublicUrl}
              </span>
              <button
                onClick={() => handleCopy(`https://${defaultPublicUrl}`, 'default_url')}
                className="p-1.5 rounded-lg hover:bg-white text-[#1B365D] shrink-0"
                title="Copy public address"
              >
                {copiedKey === 'default_url' ? <Check className="h-4 w-4 text-[#3B7A57]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#D9D1C2] bg-[#FAF6ED] dark:bg-[#16243A] text-xs text-[#475569] dark:text-[#CBD5E1] flex items-center gap-2">
            <Info className="h-4 w-4 text-[#C5A880] shrink-0" />
            <span>Always active and encrypted with automatic SSL.</span>
          </div>
        </div>

        {/* Right Column: Custom Domain Management (7 cols) */}
        <div className="lg:col-span-7 editorial-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Connect Your Custom Academy Domain
              </h3>
              <p className="text-xs text-[#64748B]">
                Point your own domain (e.g. www.vermascience.in)
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isConnected
                  ? 'bg-[#EDF6F0] text-[#3B7A57]'
                  : 'bg-[#FDF3F0] text-[#C86D51]'
              }`}
            >
              {isConnected ? 'Connected & Verified' : 'DNS Connection Pending'}
            </span>
          </div>

          {/* Domain Input & Verification Trigger */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => {
                setCustomDomain(e.target.value);
                setIsConnected(false); // reset connection if changed
              }}
              placeholder="e.g. yourclass.in"
              className="flex-1 rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-xs text-[#132238] dark:text-[#F8FAFC] font-mono focus:outline-none focus:border-[#1B365D]"
            />
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              {isVerifying && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isVerifying ? 'Verifying...' : 'Verify DNS Records'}</span>
            </button>
          </div>

          {/* DNS Records Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Required DNS Configuration:
            </span>
            <div className="rounded-xl border border-[#EAE5D9] dark:border-[#22334A] overflow-hidden text-xs">
              <div className="bg-[#FAF6ED] dark:bg-[#16243A] px-4 py-2 font-bold text-[#132238] dark:text-[#F8FAFC] grid grid-cols-12 text-[11px]">
                <span className="col-span-2">Type</span>
                <span className="col-span-3">Host</span>
                <span className="col-span-5">Points To / Value</span>
                <span className="col-span-2 text-right">Status</span>
              </div>
              <div className="divide-y divide-[#F0ECE3] dark:divide-[#1E2E44]">
                {dnsRecords.map((rec, i) => (
                  <div key={i} className="px-4 py-2.5 grid grid-cols-12 items-center text-[11px] font-mono">
                    <span className="col-span-2 font-bold text-[#1B365D] dark:text-[#93B4E0]">{rec.type}</span>
                    <span className="col-span-3 text-[#132238] dark:text-[#F8FAFC]">{rec.name}</span>
                    <div className="col-span-5 flex items-center justify-between pr-2 text-[#475569] dark:text-[#CBD5E1] truncate">
                      <span className="truncate">{rec.value}</span>
                      <button
                        onClick={() => handleCopy(rec.value, `dns_${i}`)}
                        className="p-1 hover:text-[#132238] ml-1"
                        title="Copy record value"
                      >
                        {copiedKey === `dns_${i}` ? <Check className="h-3 w-3 text-[#3B7A57]" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <span
                      className={`col-span-2 text-right font-sans font-bold text-[10px] ${
                        isConnected ? 'text-[#3B7A57]' : 'text-[#C86D51]'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
