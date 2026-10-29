'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  IndianRupee,
  GraduationCap
} from 'lucide-react';

export const ClassProfileEditor: React.FC = () => {
  const { currentTeacher, updateClassProfile, addFAQ, deleteFAQ } = useApp();
  const profile = currentTeacher.profile;

  const [className, setClassName] = useState(profile.className);
  const [tagline, setTagline] = useState(profile.tagline);
  const [teacherName, setTeacherName] = useState(profile.teacherName);
  const [qualification, setQualification] = useState(profile.qualification);
  const [location, setLocation] = useState(profile.location);
  const [city, setCity] = useState(profile.city);
  const [pincode, setPincode] = useState(profile.pincode);
  const [subjectsStr, setSubjectsStr] = useState(profile.subjects.join(', '));
  const [gradesStr, setGradesStr] = useState(profile.grades.join(', '));

  // Fee items state
  const [fees, setFees] = useState(profile.feeStructure);

  // New FAQ inputs
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddFaq, setShowAddFaq] = useState(false);

  // Save state
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSubjects = subjectsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const updatedGrades = gradesStr.split(',').map((g) => g.trim()).filter(Boolean);

    updateClassProfile({
      className,
      tagline,
      teacherName,
      qualification,
      location,
      city,
      pincode,
      subjects: updatedSubjects,
      grades: updatedGrades,
      feeStructure: fees
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFeeChange = (index: number, field: string, value: string) => {
    const updated = [...fees];
    updated[index] = { ...updated[index], [field]: value };
    setFees(updated);
  };

  const handleAddFeeRow = () => {
    setFees([
      ...fees,
      {
        gradeCategory: 'New Batch Course',
        amount: '₹3,000',
        billingCycle: 'per month',
        details: 'Includes tests and worksheets.'
      }
    ]);
  };

  const handleRemoveFeeRow = (index: number) => {
    setFees(fees.filter((_, idx) => idx !== index));
  };

  const handleCreateFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    addFAQ({
      question: newQuestion.trim(),
      answer: newAnswer.trim()
    });
    setNewQuestion('');
    setNewAnswer('');
    setShowAddFaq(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Class Profile &amp; Verified Knowledge Base
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            CallSetu AI uses this verified information to answer prospective parents during active teaching hours.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="btn-primary flex items-center gap-2 self-start rounded-lg px-4 py-2 text-xs font-bold"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Class Profile</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Class Information Card */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Coaching Identity &amp; Educator Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Institute Name
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                One-Line Tagline / Focus
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Teacher / Educator Name
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Qualification &amp; Background
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subjects Taught (comma separated)
              </label>
              <input
                type="text"
                value={subjectsStr}
                onChange={(e) => setSubjectsStr(e.target.value)}
                placeholder="Physics, Chemistry, Biology, Mathematics"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grades / Standards Catered (comma separated)
              </label>
              <input
                type="text"
                value={gradesStr}
                onChange={(e) => setGradesStr(e.target.value)}
                placeholder="Class 8, Class 9, Class 10 Board, Class 11, Class 12"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Location & Landmark Card */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tuition Center Location &amp; Landmark
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Address &amp; Landmark
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Plot 42, 2nd Floor, Mayur Colony, Near Karve Statue"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure Management */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verified Fee Structure
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddFeeRow}
              className="btn-secondary flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Course Fee</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {fees.map((fee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                    Class / Grade Category
                  </label>
                  <input
                    type="text"
                    value={fee.gradeCategory}
                    onChange={(e) => handleFeeChange(idx, 'gradeCategory', e.target.value)}
                    className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    Fee Amount
                  </label>
                  <input
                    type="text"
                    value={fee.amount}
                    onChange={(e) => handleFeeChange(idx, 'amount', e.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    Cycle
                  </label>
                  <input
                    type="text"
                    value={fee.billingCycle}
                    onChange={(e) => handleFeeChange(idx, 'billingCycle', e.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    Inclusions
                  </label>
                  <input
                    type="text"
                    value={fee.details}
                    onChange={(e) => handleFeeChange(idx, 'details', e.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveFeeRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                    title="Remove fee"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Batches and Timings Card */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Batches &amp; Schedule
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.batches.map((batch) => (
              <div
                key={batch.id}
                className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-1.5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {batch.name}
                  </h4>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {batch.seatsLeft} seats left
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                  <p>Timing: <span className="font-semibold text-indigo-700 dark:text-indigo-400">{batch.timing}</span></p>
                  <p>Target: {batch.grades}</p>
                  <p>Days: {batch.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified FAQs */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-violet-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Verified FAQ Knowledge Base ({profile.faqs.length} entries)
                </h3>
                <p className="text-[11px] text-slate-500">
                  CallSetu uses these exact answers when parents ask questions on the phone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddFaq(!showAddFaq)}
              className="btn-secondary flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Verified Answer</span>
            </button>
          </div>

          {showAddFaq && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-900 dark:bg-indigo-950/40">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">New Verified QA</h4>
              <input
                type="text"
                placeholder="Question (e.g. Do you conduct Sunday mock tests?)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none dark:bg-slate-900 dark:text-white"
              />
              <textarea
                placeholder="Exact Answer (e.g. Yes, every Sunday we conduct 1-hour board pattern tests with answer key discussion.)"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none dark:bg-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="btn-secondary rounded-lg px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateFaq}
                  className="btn-primary rounded-lg px-3 py-1.5 text-xs font-bold"
                >
                  Save Question
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {profile.faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-1 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q: {faq.question}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteFAQ(faq.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-emerald-700">A:</span> {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
