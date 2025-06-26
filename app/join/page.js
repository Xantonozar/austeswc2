'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function JoinPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    yearSemester: '',
    studentId: '',
    bkashId: '',
    reference: ''
  });

  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const router = useRouter();

  const tips = [
    "Reduce plastic usage — small changes help protect aquatic life.",
    "Support local farmers and fair trade to uplift struggling communities.",
    "Save water by fixing leaks and using water-efficient fixtures.",
    "Plant trees in your area — they improve air quality and provide shade.",
    "Volunteer or donate to organizations helping the poor and vulnerable.",
    "Reuse and recycle to minimize waste and conserve resources."
  ];

  const getRandomTipIndex = () => Math.floor(Math.random() * tips.length);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'department' && value !== 'Architecture') {
      if (['5-1', '5-2'].includes(form.yearSemester)) {
        setForm((prev) => ({ ...prev, yearSemester: '' }));
      }
    }
  };

  const handleFocus = (fieldName) => setCurrentField(fieldName);
  const handleBlur = () => setCurrentField(null);

  const renownedDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'gmx.com', 'yandex.com'
  ];

  const isRenownedEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase() || '';
    return renownedDomains.includes(domain);
  };

  const toastSuccess = (message) =>
    toast.custom((t) => (
      <div className={`max-w-md w-full bg-green-600 text-white rounded-lg shadow-lg flex items-center p-4 space-x-3
        ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <CheckCircle2 className="w-6 h-6" />
        <span>{message}</span>
      </div>
    ));

  const toastWarning = (message) =>
    toast.custom((t) => (
      <div className={`max-w-md w-full bg-amber-500 text-white rounded-lg shadow-lg flex items-center p-4 space-x-3
        ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <AlertTriangle className="w-6 h-6" />
        <span>{message}</span>
      </div>
    ));

  // Green pulsing dots for loading
  const LoadingDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.2 * i, ease: "easeInOut" }}
          aria-label="Loading"
        />
      ))}
    </div>
  );

  const validate = () => {
    if (!form.name) {
      toastWarning('Please enter your name');
      return false;
    }
    if (!form.email) {
      toastWarning('Please enter your email');
      return false;
    }

    const austMail = form.email.endsWith('@aust.edu');
    const emailLower = form.email.toLowerCase();
    const yearSem = form.yearSemester;

    if (yearSem === '1-1') {
      if (!austMail && !isRenownedEmail(emailLower)) {
        toastWarning('1-1 students must use @aust.edu or a renowned email like Gmail, Yahoo, Outlook.');
        return false;
      }
    } else {
      if (!austMail) {
        toastWarning('Please use your @aust.edu email.');
        return false;
      }
    }

    if (!form.phone) {
      toastWarning('Please enter your phone number');
      return false;
    }
    if (!/^01\d{9}$/.test(form.phone)) {
      toastWarning('Phone number must start with 01 and be 11 digits');
      return false;
    }
    if (!form.department) {
      toastWarning('Please select your department');
      return false;
    }
    if (!form.yearSemester) {
      toastWarning('Please select your year & semester');
      return false;
    }
    if (["5-1", "5-2"].includes(form.yearSemester) && form.department !== "Architecture") {
      toastWarning('Only Architecture students can select 5-1 or 5-2');
      return false;
    }
    if (!form.studentId) {
      toastWarning('Please enter your student ID');
      return false;
    }
    if (!form.bkashId) {
      toastWarning('Please enter your bKash transaction ID');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setCurrentTipIndex(getRandomTipIndex());
    setLoading(true);
    setShowModal(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      setLoading(false);
      setShowModal(false);

      if (data?.error === 'already_exists') {
        toastWarning('This Student ID is already registered');
        return;
      }
      if (data?.result === 'success') {
        toastSuccess('Submission successful!');
        setTimeout(() => router.push('/congratulations'), 1000);
      } else {
        toastWarning('Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      setShowModal(false);
      toastWarning('Network error');
    }
  };

  const departments = ["CSE", "EEE", "CE", "ME", "IPE", "TE", "Architecture", "BBA"];
  const yearOptions = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2", "5-1", "5-2"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getFieldClass = (field) =>
    `relative transition-all duration-300 ${
      currentField === field ? 'shadow-[inset_8px_0_8px_-4px_#22c55e]' : ''
    }`;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-green-50 to-white relative">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { padding: 0, background: 'transparent' }
        }}
      />

      {/* Modal popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 text-gray-900"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-green-700">🌿 Please Read While You Wait</h2>

            <p className="mb-4 text-green-800 font-medium text-sm leading-relaxed">
              Thank you for your application. While we process it, here is a tip to help support environmental sustainability and social welfare:
            </p>

            <blockquote className="border-l-4 border-green-500 pl-4 italic text-green-900 mb-6">
              "{tips[currentTipIndex]}"
            </blockquote>

            <div className="flex justify-center space-x-4 items-center text-green-700 font-semibold text-base">
              <LoadingDots />
              <span>Submitting your application...</span>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div className="max-w-md mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="bg-white shadow-lg rounded-lg overflow-hidden" variants={itemVariants}>
          <div className="bg-green-600 p-5 text-white">
            <h1 className="text-xl font-bold">🌱 ESWC Membership Form</h1>
            <p className="text-green-100 mt-1">Join our environmental sustainability club</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Full Name */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className={getFieldClass('name')}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                  required
                />
              </div>
            </motion.div>

            {/* Email Address */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className={getFieldClass('email')}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use @aust.edu email. 1-1 students can use renowned emails like Gmail, Yahoo, Outlook.
                </p>
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className={getFieldClass('phone')}>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must start with 01 and be 11 digits</p>
              </div>
            </motion.div>

            {/* Department */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <div className={getFieldClass('department')}>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  onFocus={() => handleFocus('department')}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4 appearance-none"
                  required
                >
                  <option value="">Select your department</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Year & Semester */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Year & Semester</label>
              <div className={getFieldClass('yearSemester')}>
                <select
                  name="yearSemester"
                  value={form.yearSemester}
                  onChange={handleChange}
                  onFocus={() => handleFocus('yearSemester')}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4 appearance-none"
                  required
                >
                  <option value="">Select your year & semester</option>
                  {yearOptions.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={['5-1', '5-2'].includes(opt) && form.department !== 'Architecture'}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">5-1 and 5-2 only for Architecture students</p>
              </div>
            </motion.div>

            {/* Student ID */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <div className={getFieldClass('studentId')}>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  onFocus={() => handleFocus('studentId')}
                  onBlur={handleBlur}
                  placeholder="Enter your student ID"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                  required
                />
              </div>
            </motion.div>

            {/* bKash Transaction ID */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">bKash Transaction ID</label>
              <div className={getFieldClass('bkashId')}>
                <input
                  name="bkashId"
                  value={form.bkashId}
                  onChange={handleChange}
                  onFocus={() => handleFocus('bkashId')}
                  onBlur={handleBlur}
                  placeholder="Enter your bKash transaction ID"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                  required
                />
              </div>
            </motion.div>

            {/* Reference */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
              <div className={getFieldClass('reference')}>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  onFocus={() => handleFocus('reference')}
                  onBlur={handleBlur}
                  placeholder="How did you hear about us?"
                  className="w-full bg-gray-50 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-4"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {loading ? (
                <>
                  <LoadingDots />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes toast-enter {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes toast-leave {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .animate-enter {
          animation: toast-enter 0.3s ease forwards;
        }
        .animate-leave {
          animation: toast-leave 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
