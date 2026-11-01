'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  UserCheck,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  IndianRupee,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { FeeItem, EducatorCategory } from '@/lib/types';

export const ClassProfileEditor: React.FC = () => {
  const { currentTeacher, updateClassProfile, addFAQ, deleteFAQ } = useApp();
  const profile = currentTeacher.profile;

  const [activeSection, setActiveSection] = useState<'basics' | 'fees' | 'batches' | 'faqs'>('basics');

  // Basics & Teacher State
  const [className, setClassName] = useState(profile.className);
  const [tagline, setTagline] = useState(profile.tagline);
  const [teacherName, setTeacherName] = useState(profile.teacherName);
  const [category, setCategory] = useState(profile.category || 'General Academics');
  const [qualification, setQualification] = useState(profile.qualification);
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [city, setCity] = useState(profile.city);
  const [pincode, setPincode] = useState(profile.pincode);
  const [subjectsStr, setSubjectsStr] = useState(profile.subjects.join(', '));
  const [gradesStr, setGradesStr] = useState(profile.grades.join(', '));
  const [admissionsPolicy, setAdmissionsPolicy] = useState(profile.admissionsPolicy || '');

  // Fees State
  const [fees, setFees] = useState<FeeItem[]>(profile.feeStructure || []);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseFee, setNewCourseFee] = useState('');

  // FAQs State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddFaq, setShowAddFaq] = useState(false);

  // Save State
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSubjects = subjectsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const updatedGrades = gradesStr.split(',').map((g) => g.trim()).filter(Boolean);

    updateClassProfile({
      className,
      tagline,
      teacherName,
      category: category as any,
      qualification,
      experienceYears: Number(experienceYears),
      phone,
      location,
      city,
      pincode,
      subjects: updatedSubjects,
      grades: updatedGrades,
      feeStructure: fees,
      admissionsPolicy
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddFeeItem = () => {
    if (!newCourseName.trim() || !newCourseFee.trim()) return;
    setFees([
      ...fees,
      {
        gradeCategory: newCourseName.trim(),
        amount: newCourseFee.trim(),
        billingCycle: 'per month',
        details: 'Verified tuition schedule'
      }
    ]);
    setNewCourseName('');
    setNewCourseFee('');
  };

  const handleRemoveFeeItem = (index: number) => {
    setFees(fees.filter((_, idx) => idx !== index));
  };

  const handleAddFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>AI Knowledge Base Management</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Teacher Profile &amp; Tuition Structure
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            The AI receptionist strictly answers questions using this verified data. When a caller asks about fees or timings, these exact numbers are provided.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF6F0] text-[#3B7A57] text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved!</span>
            </div>
          )}
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Section Selector Pills */}
      <div className="flex items-center gap-2 p-1 bg-[#F2EFE8] dark:bg-[#162338] rounded-xl overflow-x-auto">
        {[
          { id: 'basics', label: '1. Teacher & Academy Info' },
          { id: 'fees', label: `2. Fee Structure (${fees.length})` },
          { id: 'batches', label: '3. Batches & Timings' },
          { id: 'faqs', label: `4. Verified FAQs (${profile.faqs.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeSection === tab.id
                ? 'bg-white text-[#132238] shadow-2xs dark:bg-[#1B365D] dark:text-white'
                : 'text-[#64748B] hover:text-[#132238] dark:text-[#94A3B8] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: Teacher & Academy Info */}
      {activeSection === 'basics' && (
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="editorial-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC] pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
              Academy Branding &amp; Educator Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Tuition / Academy Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Tagline / Core Philosophy
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Lead Teacher / Faculty Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Discipline Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EducatorCategory)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                >
                  <option value="Home Tuition">Home Tuition (Personalized Tutoring)</option>
                  <option value="Mathematics Tutor">Mathematics Tutor</option>
                  <option value="Science & Physics">Science & Physics</option>
                  <option value="English & Language">English & Language</option>
                  <option value="Music & Performing Arts">Music & Performing Arts</option>
                  <option value="Coaching Institute">Coaching Institute</option>
                  <option value="General Academics">General Academics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Qualifications &amp; Degrees
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Years of Teaching Experience
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>
            </div>
          </div>

          <div className="editorial-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC] pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
              Curriculum, Grades &amp; Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Subjects Taught (comma-separated)
                </label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Grades &amp; Standards (comma-separated)
                </label>
                <input
                  type="text"
                  value={gradesStr}
                  onChange={(e) => setGradesStr(e.target.value)}
                  placeholder="e.g. Class 9, Class 10 Board"
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Classroom Address / Landmark
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SECTION 2: Fee Structure */}
      {activeSection === 'fees' && (
        <div className="space-y-5">
          <div className="editorial-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
              <div>
                <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Verified Tuition Fee Schedule
                </h2>
                <p className="text-xs text-[#64748B]">
                  Call to Teach cites these exact prices when callers inquire about fees.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {fees.map((fee, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
                      {fee.gradeCategory}
                    </span>
                    {fee.details && (
                      <p className="text-[11px] text-[#64748B] mt-0.5">{fee.details}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#3B7A57] dark:text-[#5BA87B] text-sm">
                      {fee.amount} <span className="text-[10px] font-normal text-[#64748B]">{fee.billingCycle}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveFeeItem(idx)}
                      className="p-1 rounded-md text-[#C86D51] hover:bg-[#FDF3F0] transition-colors"
                      title="Remove fee course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Fee Item Inline */}
            <div className="p-4 rounded-xl border border-dashed border-[#C5A880] bg-[#FAF6ED]/50 dark:bg-[#16243A]/50 space-y-3">
              <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                Add New Course Fee
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    placeholder="e.g. Class 10 Board Masterclass"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] px-3 py-2 text-[#132238] dark:text-[#F8FAFC]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="e.g. ₹3,500 per month"
                    value={newCourseFee}
                    onChange={(e) => setNewCourseFee(e.target.value)}
                    className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] px-3 py-2 text-[#132238] dark:text-[#F8FAFC]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddFeeItem}
                    className="w-full h-full py-2 px-3 rounded-xl bg-[#1B365D] hover:bg-[#152B4A] text-white font-bold text-xs shadow-xs"
                  >
                    Add Fee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Batches & Timings */}
      {activeSection === 'batches' && (
        <div className="editorial-card p-6 space-y-4">
          <div className="pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
            <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              Batch Schedule &amp; Timings
            </h2>
            <p className="text-xs text-[#64748B]">
              Active batches shared with parents inquiring about scheduling.
            </p>
          </div>

          <div className="space-y-3">
            {(profile.batches || []).map((t, i) => (
              <div
                key={t.id || i}
                className="p-4 rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#132238] dark:text-[#F8FAFC] text-sm block">
                    {t.name}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Grades: {t.grades} · Days: {t.days}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-[#EDF3FA] text-[#1B365D] dark:bg-[#1A2D4A] dark:text-[#93B4E0] font-bold text-xs">
                    {t.timing}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border border-[#D9D1C2] bg-[#FAF6ED] dark:bg-[#16243A] text-xs text-[#475569] dark:text-[#CBD5E1] flex items-center gap-2">
            <Info className="h-4 w-4 text-[#C5A880] shrink-0" />
            <span>Admission Trial Policy: {profile.admissionsPolicy || '2 free demo classes offered.'}</span>
          </div>
        </div>
      )}

      {/* SECTION 4: Verified FAQs */}
      {activeSection === 'faqs' && (
        <div className="editorial-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
            <div>
              <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Verified FAQ Knowledge Base ({profile.faqs.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Direct questions &amp; answers taught to the AI receptionist.
              </p>
            </div>
            <button
              onClick={() => setShowAddFaq(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#1B365D] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-[#132238] dark:text-[#F8FAFC]">
                  <span>Q: {faq.question}</span>
                  <button
                    onClick={() => deleteFAQ(faq.id)}
                    className="text-[#C86D51] hover:text-[#B85D43]"
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Add FAQ Form Modal/Box */}
          {showAddFaq && (
            <form onSubmit={handleAddFaqSubmit} className="p-4 rounded-xl border border-[#1B365D] bg-[#FAF6ED] dark:bg-[#16243A] space-y-3 text-xs">
              <span className="font-bold text-[#132238] dark:text-[#F8FAFC] block">
                Teach New FAQ
              </span>
              <div>
                <label className="block font-semibold text-[#132238] mb-1">
                  Caller Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Do you provide printed study notes?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] bg-white p-2 text-[#132238]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#132238] mb-1">
                  Verified Answer
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Yes, printed DPPs and formula sheets are included in tuition fees."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] bg-white p-2 text-[#132238] resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#1B365D] text-white text-xs font-bold"
                >
                  Add FAQ
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
