const fs = require('fs');
let c = fs.readFileSync('app/apply/page.js', 'utf8');

// 1. Add skillHelp to state and update role
c = c.replace(/role: "Batch Ambassador",/, 'role: "Junior Executive",\n        skillHelp: "",');

// 2. Remove semester limitations in handleChange
c = c.replace(/if \(name === 'department' && value !== 'Architecture' && \['5-1', '5-2'\].includes\(next.semester\)\) {\s*next.semester = '1-1';\s*}/g, '');

// 3. Update handleSubmit to require photo
c = c.replace(/if \(imageFile\) {/, 'if (!imageFile) {\n                toast.error("Please upload a photo.", { id: "img-upload" });\n                setLoading(false);\n                return;\n            }\n            if (imageFile) {');

// 4. Semester dropdown UI
c = c.replace(/const isDisabled = !\['1-1', '1-2'\].includes\(opt\);\s*return <option key={opt} value={opt} disabled={isDisabled}>{opt}<\/option>;/g, 'return <option key={opt} value={opt}>{opt}</option>;');

// 5. Role dropdown UI
const roleHtml = `<label className="block text-sm font-bold text-slate-700 mb-2">Role Applying For *</label>
                                <select 
                                    name="role" required
                                    value={formData.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 font-semibold"
                                >
                                    <option value="Batch Ambassador">Batch Ambassador</option>
                                    <option value="Junior Executive">Junior Executive</option>
                                    <option value="Sub Executive" disabled>Sub Executive (Closed)</option>
                                </select>`;
const newRoleHtml = `<label className="block text-sm font-bold text-slate-700 mb-2">Role Applying For *</label>
                                <select 
                                    name="role" required
                                    value={formData.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 font-semibold"
                                >
                                    <option value="Junior Executive">Junior Executive</option>
                                    <option value="Sub Executive" disabled>Sub Executive (Closed)</option>
                                </select>`;
c = c.replace(roleHtml, newRoleHtml);

// 6. Photo upload UI title
c = c.replace(/Your Photo \(Optional\)/g, 'Your Photo *');

// 7. Add skillHelp textarea
const motivationBlock = `<motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Why do you want to apply? *</label>
                                <textarea 
                                    name="motivation" required rows="4"
                                    value={formData.motivation} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Tell us about your motivation..."
                                ></textarea>
                            </motion.div>`;

const skillHelpBlock = `
                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">How will your skill help in your preferred team? *</label>
                                <textarea 
                                    name="skillHelp" required rows="4"
                                    value={formData.skillHelp} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Explain how your skills will be beneficial..."
                                ></textarea>
                            </motion.div>`;

c = c.replace(motivationBlock, motivationBlock + skillHelpBlock);

fs.writeFileSync('app/apply/page.js', c);
