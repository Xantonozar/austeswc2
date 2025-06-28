'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Leaf, User, Mail, Phone, BookOpen, Calendar, CreditCard, FileImage, Users } from 'lucide-react';

export default function JoinPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    yearSemester: '',
    studentId: '',
    bkashId: '',
    reference: '',
    imageBase64: '',  // New
    imageName: '',    // Newac
    imageType: '',    // New
    agreeToTerms: false  // New checkbox field
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
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      // Only allow 11 digits, remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      const phoneValue = digitsOnly.slice(0, 11); // Limit to 11 digits
      setForm(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }

    if (name === 'department' && value !== 'Architecture') {
      if (['5-1', '5-2'].includes(form.yearSemester)) {
        setForm(prev => ({ ...prev, yearSemester: '' }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toastWarning('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64String = ev.target.result.split(',')[1];
      setForm(prev => ({
        ...prev,
        imageBase64: base64String,
        imageName: file.name,
        imageType: file.type
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFocus = (field) => setCurrentField(field);
  const handleBlur = () => setCurrentField(null);

  const renownedDomains = [
    'gmail.com','yahoo.com','outlook.com','hotmail.com',
    'icloud.com','aol.com','protonmail.com','mail.com',
    'zoho.com','gmx.com','yandex.com'
  ];
  const isRenownedEmail = (email) => {
    const d = email.split('@')[1]?.toLowerCase() || '';
    return renownedDomains.includes(d);
  };

  const toastSuccess = (msg) =>
    toast.custom(t => (
      <div className={`max-w-md w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl shadow-xl flex items-center p-4 space-x-3 border border-green-400
        ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <CheckCircle2 className="w-6 h-6 text-green-200" />
        <span className="font-medium">{msg}</span>
      </div>
    ));
  const toastWarning = (msg) =>
    toast.custom(t => (
      <div className={`max-w-md w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-xl shadow-xl flex items-center p-4 space-x-3 border border-amber-400
        ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <AlertTriangle className="w-6 h-6 text-amber-200" />
        <span className="font-medium">{msg}</span>
      </div>
    ), { duration: 5000 });

  const LoadingDots = () => (
    <div className="flex space-x-2">
      {[0,1,2].map(i => (
        <motion.span key={i}
          className="w-4 h-4 bg-green-600 rounded-full"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
            y: [0, -6, 0]
          }}
          transition={{ 
            duration: 0.7, 
            repeat: Infinity, 
            repeatDelay: 0.15*i, 
            ease: "easeInOut" 
          }}
          aria-label="Loading"
        />
      ))}
    </div>
  );

  const validate = () => {
    if (!form.imageBase64) {
      toastWarning('Please upload an image');
      return false;
    }
    if (!form.name.trim()) { 
      toastWarning('Please enter your name'); 
      return false; 
    }
    if (!form.email.trim()) { 
      toastWarning('Please enter your email'); 
      return false; 
    }
    const austMail = form.email.toLowerCase().endsWith('@aust.edu');
    const emailLower = form.email.toLowerCase(), ys = form.yearSemester;
    if (ys === '1-1') {
      if (!austMail && !isRenownedEmail(emailLower)) {
        toastWarning('1-1 students need @aust.edu or renowned email'); 
        return false;
      }
    } else if (!austMail) {
      toastWarning('Please use your @aust.edu email'); 
      return false;
    }
    if (!form.phone.trim()) { 
      toastWarning('Please enter your phone'); 
      return false; 
    }
    if (!/^01\d{9}$/.test(form.phone.trim())) {
      toastWarning('Phone must start with 01 and be 11 digits'); 
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
    if (["5-1","5-2"].includes(form.yearSemester) && form.department !== "Architecture") {
      toastWarning('Only Architecture can select 5-1 or 5-2'); 
      return false;
    }
    if (!form.studentId.trim()) { 
      toastWarning('Please enter your student ID'); 
      return false; 
    }
    if (!form.bkashId.trim()) { 
      toastWarning('Please enter your bKash transaction ID'); 
      return false; 
    }
    if (!form.agreeToTerms) {
      toastWarning('Please agree to the club terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Trim all form fields before submission
    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: "'" + form.phone.trim(), // Add single quote to force text format in Google Sheets
      studentId: form.studentId.trim().toUpperCase(), // Normalize student ID to uppercase
      bkashId: form.bkashId.trim(),
      reference: form.reference.trim()
    };
    
    setCurrentTipIndex(getRandomTipIndex());
    setLoading(true);
    setShowModal(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedForm)
      });
      
      const data = await res.json();
      setLoading(false);
      setShowModal(false);

      // Enhanced error handling for duplicate student ID
      if (data?.error === 'already_exists' || data?.message?.includes('already registered') || data?.message?.includes('duplicate')) {
        toastWarning(`Student ID ${trimmedForm.studentId} is already registered. Please contact support if this is an error.`);
        return;
      }
      
      // Handle other potential errors
      if (data?.error) {
        toastWarning(data.message || 'Registration failed. Please try again.');
        return;
      }
      
      if (data?.result === 'success' || data?.success === true) {
        toastSuccess('Registration successful! Welcome to ESWC!');
        setTimeout(() => router.push('/congratulations'), 1500);
      } else {
        toastWarning('Registration failed. Please try again or contact support.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      setShowModal(false);
      toastWarning('Network error. Please check your connection and try again.');
    }
  };

  const departments = ["CSE","EEE","CE","ME","IPE","TE","Architecture","BBA"];
  const yearOptions = ["1-1","1-2","2-1","2-2","3-1","3-2","4-1","4-2","5-1","5-2"];
  const containerVariants = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1}} };
  const itemVariants = { hidden:{y:20,opacity:0}, visible:{y:0,opacity:1,transition:{type:'spring',stiffness:300,damping:24}} };
  const getFieldClass = (f) =>
    `relative transition-all duration-300 ${currentField===f?'shadow-[0_0_8px_rgba(16,185,129,0.2)]':''}`;

  return (
    <div className="min-h-screen p-3 md:p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-green-300 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-teal-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-200 blur-3xl opacity-30"></div>
        <svg className="absolute top-0 right-0 w-full h-full opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#10B981" d="M39.9,-65.7C51.5,-60.5,60.8,-49.9,65.3,-37.8C69.8,-25.7,69.6,-12.8,68.9,-0.4C68.3,12.1,67.2,24.1,62.4,35.2C57.5,46.3,48.9,56.4,38.1,62.5C27.3,68.6,14.3,70.7,1.2,68.9C-11.9,67.1,-24.9,61.4,-36.9,54.3C-48.9,47.2,-59.9,38.7,-67.4,27.1C-74.9,15.5,-78.9,0.8,-76.9,-13C-74.9,-26.8,-66.8,-39.7,-55.8,-45.8C-44.8,-51.9,-30.8,-51.2,-18.8,-56.2C-6.8,-61.2,3.2,-71.9,15.1,-73.8C27,-75.7,40.9,-68.8,51.5,-60.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <Toaster position="top-center" toastOptions={{ duration:4000, style:{padding:0,background:'transparent'} }} />
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div className="bg-green-100/95 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl max-w-lg w-full p-6 text-green-800 border-2 border-green-200 animate-neon-glow"
            initial={{scale:0.9,opacity:0}} 
            animate={{scale:1,opacity:1}} 
            exit={{scale:0.9,opacity:0}}
            transition={{type: 'spring', stiffness: 300, damping: 25}}>
            <div className="flex items-center mb-4">
              <Leaf className="w-7 h-7 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-green-800">Please Read While You Wait</h2>
            </div>
            <p className="mb-4 text-green-700 font-medium text-base leading-relaxed">
              Thank you for your application. While we process it, here is a tip:
            </p>
            <blockquote className="border-l-4 border-green-300 pl-4 italic text-green-800 mb-5 bg-green-50/80 backdrop-blur-sm p-4 rounded-r-lg text-base">
              "{tips[currentTipIndex]}"
            </blockquote>
            <div className="flex justify-center items-center space-x-4 text-green-700 font-medium text-base bg-white p-4 rounded-lg shadow-md">
              <LoadingDots /><span>Submitting your application...</span>
            </div>
          </motion.div>
        </div>
      )}
      <motion.div className="max-w-md mx-auto px-2" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl overflow-hidden border border-emerald-100" variants={itemVariants}>
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="#FFFFFF" d="M42.8,-65.2C54.9,-56.3,63.7,-43.2,69.2,-29.1C74.8,-15,77.2,0.1,73.6,13.5C70,26.9,60.5,38.6,48.7,47.2C36.9,55.8,22.8,61.3,8.3,64.3C-6.2,67.3,-21.1,67.8,-33.6,62.3C-46.1,56.8,-56.2,45.3,-63.4,31.9C-70.6,18.5,-74.9,3.2,-72.5,-11.1C-70.1,-25.4,-61,-38.7,-48.9,-47.6C-36.8,-56.5,-21.7,-61,-6.6,-61.8C8.5,-62.6,30.7,-74.1,42.8,-65.2Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="flex items-center mb-2">
              <Leaf className="w-6 h-6 mr-2 text-white/90" />
              <h1 className="text-xl md:text-2xl font-bold">ESWC Membership Form</h1>
            </div>
            <p className="text-white/80 mt-1 ml-8 text-sm">Join our environmental sustainability club</p>
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-5">
            {/* Full Name */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-emerald-600" />
                Full Name
              </label>
              <div className={getFieldClass('name')}>
                <div className="relative">
                  <input name="name" value={form.name} onChange={handleChange}
                    onFocus={() => handleFocus('name')} onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm"
                    required />
                </div>
              </div>
            </motion.div>

            {/* Profile Photo */}
         

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <Mail className="w-4 h-4 mr-1.5 text-emerald-600" />
                Email Address
              </label>
              <div className={getFieldClass('email')}>
                <div className="relative">
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    onFocus={() => handleFocus('email')} onBlur={handleBlur}
                    placeholder="Enter your email address"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm"
                    required />
                </div>
                <p className="text-xs text-green-700 mt-2  p-2 rounded-lg ">
                  Use @aust.edu email. 1-1 students can use renowned emails like Gmail, Yahoo, Outlook.
                </p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <Phone className="w-4 h-4 mr-1.5 text-emerald-600" />
                Phone Number
              </label>
              <div className={getFieldClass('phone')}>
                <div className="relative">
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    onFocus={() => handleFocus('phone')} onBlur={handleBlur}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm"
                    required />
                </div>
                <p className="text-xs text-green-700 mt-2  p-2 rounded-lg ">
                  Enter your 11-digit phone number (e.g., 01712345678)
                </p>
              </div>
            </motion.div>

            {/* Department */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-emerald-600" />
                Department
              </label>
              <div className={getFieldClass('department')}>
                <div className="relative">
                  <select name="department" value={form.department} onChange={handleChange}
                    onFocus={() => handleFocus('department')} onBlur={handleBlur}
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 appearance-none text-sm cursor-pointer hover:bg-emerald-100"
                    required>
                    <option value="">Select your department</option>
                    {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4 4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Year & Semester */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-emerald-600" />
                Year & Semester
              </label>
              <div className={getFieldClass('yearSemester')}>
                <div className="relative">
                  <select name="yearSemester" value={form.yearSemester} onChange={handleChange}
                    onFocus={() => handleFocus('yearSemester')} onBlur={handleBlur}
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 appearance-none text-sm cursor-pointer hover:bg-emerald-100"
                    required>
                    <option value="">Select Your Year & Semester</option>
                    {yearOptions.map(opt => (
                      <option key={opt} value={opt} disabled={['5-1','5-2'].includes(opt) && form.department !== 'Architecture'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4 4 4-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2  p-2 rounded-lg ">
                  5-1 and 5-2 only for Architecture students
                </p>
              </div>
            </motion.div>

            {/* Student ID */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-emerald-600" />
                Student ID
              </label>
              <div className={getFieldClass('studentId')}>
                <div className="relative">
                  <input name="studentId" value={form.studentId} onChange={handleChange}
                    onFocus={() => handleFocus('studentId')} onBlur={handleBlur}
                    placeholder="Enter your student ID"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm"
                    required />
                </div>
                <p className="text-xs text-green-700 mt-2  p-2 rounded-lg ">
                  Each student ID can only register once
                </p>
              </div>
            </motion.div>

            {/* bKash ID */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <CreditCard className="w-4 h-4 mr-1.5 text-emerald-600" />
                bKash Transaction ID
              </label>
              <div className={getFieldClass('bkashId')}>
                <div className="relative">
                  <input name="bkashId" value={form.bkashId} onChange={handleChange}
                    onFocus={() => handleFocus('bkashId')} onBlur={handleBlur}
                    placeholder="Enter your bKash transaction ID"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm"
                    required />
                </div>
              </div>
            </motion.div>
               <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-base font-medium text-emerald-700 flex items-center">
                <FileImage className="w-5 h-5 mr-2 text-emerald-600" />
                Profile Photo
              </label>
              <div className={getFieldClass('imageBase64')}>
                <div className="relative">
                  <label className="w-full flex flex-col items-center justify-center bg-emerald-50 p-4 rounded-lg border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-all duration-300 cursor-pointer group">
                    {!form.imageName ? (
                      <div className="flex flex-col items-center space-y-2 py-2">
                        <FileImage className="w-8 h-8 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                        <span className="text-sm text-emerald-700">Click to upload your photo</span>
                        <span className="text-xs text-emerald-500">JPG, PNG or GIF (Max 5MB)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3 py-2">
                        {form.imageBase64 && (
                          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-300 shadow-md">
                            <img 
                              src={`data:${form.imageType};base64,${form.imageBase64}`} 
                              alt="Profile Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-emerald-700">{form.imageName}</p>
                            <p className="text-xs text-emerald-500">Click to change</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange}
                      className="hidden" required />
                  </label>
                </div>
              </div>
            </motion.div>
            {/* Reference */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-emerald-700 flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-emerald-600" />
                Reference (Optional)
              </label>
              <div className={getFieldClass('reference')}>
                <div className="relative">
                  <input name="reference" value={form.reference} onChange={handleChange}
                    onFocus={() => handleFocus('reference')} onBlur={handleBlur}
                    placeholder="From whom did you hear about us?"
                    className="w-full bg-emerald-50 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-emerald-100 transition-all duration-300 text-sm" />
                </div>
              </div>
            </motion.div>

            {/* Terms and Conditions Checkbox */}
            <motion.div variants={itemVariants} className="space-y-1">
              <div className={getFieldClass('agreeToTerms')}>
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={form.agreeToTerms}
                      onChange={handleChange}
                      onFocus={() => handleFocus('agreeToTerms')}
                      onBlur={handleBlur}
                      className="w-5 h-5 text-emerald-600 bg-emerald-50 border-emerald-300 rounded focus:ring-emerald-500 focus:ring-2 transition-all duration-300 group-hover:border-emerald-400"
                      required
                    />
                  </div>
                  <div className="text-sm text-emerald-700 leading-relaxed">
                    <span className="font-medium">I agree to the ESWC Club Terms and Conditions</span>
                    <p className="text-xs text-emerald-600 mt-1">
                      By checking this box, I confirm that I understand and agree to participate in environmental sustainability activities, 
                      follow club guidelines, and contribute positively to our community initiatives. I also consent to receive club-related communications.
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 px-5 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-emerald-400 font-medium text-base relative overflow-hidden group"
              whileHover={{ scale: loading ? 1 : 1.01 }} 
              whileTap={{ scale: loading ? 1 : 0.98 }} 
              variants={itemVariants}>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {loading ? (
                <>
                  <LoadingDots />
                  <span className="whitespace-nowrap font-medium">Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span className="whitespace-nowrap font-medium">Submit Application</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes toast-enter {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-leave {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes neon-glow {
          0% { box-shadow: 0 0 5px #10b981, 0 0 10px #10b981; }
          50% { box-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px rgba(16, 185, 129, 0.5); }
          100% { box-shadow: 0 0 5px #10b981, 0 0 10px #10b981; }
        }
        .animate-enter { animation: toast-enter 0.3s ease forwards; }
        .animate-leave { animation: toast-leave 0.3s ease forwards; }
        .animate-neon-glow { animation: neon-glow 2s infinite ease-in-out; }
        
        /* Modern dropdown styling */
        select {
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(240, 255, 244, 0.5));
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        select:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }
        
        /* Improve dropdown options appearance in modern browsers */
        select option {
          padding: 10px;
          background-color: white;
        }
        
        select option:checked {
          background-color: #10b981;
          color: white;
        }
        
        select option:hover {
          background-color: #ecfdf5;
        }
      `}</style>
    </div>
  );
}