'use client';

import React, { useState } from 'react';
import { Globe, CheckCircle2, Copy, Check, RefreshCw } from 'lucide-react';

export const CustomDomainManager: React.FC = () => {
  const [customDomain, setCustomDomain] = useState('callsetu.bhavaniscience.in');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const dnsRecords = [
    {
      type: 'CNAME',
      name: 'callsetu',
      value: 'cname.talktoteach.in',
      ttl: '3600',
      status: 'Active'
    },
    {
      type: 'TXT',
      name: '_talktoteach-verify',
      value: 'tt-verify-94a872bfb442',
      ttl: '3600',
      status: 'Verified'
    },
    {
      type: 'A',
      name: '@',
      value: '76.76.21.21',
      ttl: '3600',
      status: 'Optional Apex'
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
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Custom Domain Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal mt-0.5">
            Connect your institute&apos;s own branded domain name to host your public admissions portal and tutor profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
            Domain Status: {isConnected ? 'Connected & Secured' : 'Pending DNS'}
          </span>
        </div>
      </div>

      {/* Domain Input Card */}
      <div className="pro-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Globe className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Target Domain Name
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. calls.myscienceclasses.in or myinstitute.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="btn-primary flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Checking DNS...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Verify &amp; Apply DNS</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-xs sm:text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 dark:text-emerald-200">Active Custom Domain:</p>
            <p className="text-xs sm:text-sm mt-0.5 font-medium text-emerald-900 dark:text-emerald-300">
              https://{customDomain} is mapped and routing with auto-renewing TLS/SSL certificates.
            </p>
          </div>
        </div>
      </div>

      {/* DNS Records Table */}
      <div className="pro-card rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              DNS Configuration Records
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
              Add these records in your domain registrar (GoDaddy, Namecheap, Cloudflare, or BigRock):
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:text-slate-300 dark:border-slate-800">
                <th className="py-2.5 px-3 font-bold">Type</th>
                <th className="py-2.5 px-3 font-bold">Host / Name</th>
                <th className="py-2.5 px-3 font-bold">Target Value</th>
                <th className="py-2.5 px-3 font-bold">TTL</th>
                <th className="py-2.5 px-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
              {dnsRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">{r.type}</td>
                  <td className="py-3 px-3 font-mono font-semibold">{r.name}</td>
                  <td className="py-3 px-3 font-mono truncate max-w-xs">{r.value}</td>
                  <td className="py-3 px-3 tabular-nums">{r.ttl}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleCopy(r.value, `rec_${i}`)}
                      className="btn-secondary inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold"
                    >
                      {copiedKey === `rec_${i}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
