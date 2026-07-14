const fs = require('fs');
let c = fs.readFileSync('app_apply_page_old.txt', 'utf8');

c = c.replace(/convinceStrategy: ""/, 'teamPreferences: ["", "", ""],\n        skillHelp: ""');
c = c.replace(/role: "Batch Ambassador"/, 'role: "Junior Executive"');

c = c.replace(/if \(name === 'department' && value !== 'Architecture' && \['5-1', '5-2'\].includes\(next.semester\)\) \{\s*next.semester = '1-1';\s*\}/g, '');

c = c.replace(/if \(imageFile\) \{/g, 'if (!imageFile) {\n                toast.error("Please upload a photo.", { id: "img-upload" });\n                setLoading(false);\n                return;\n            }\n            if (imageFile) {');

c = c.replace(/body: JSON.stringify\(\{ ...formData, imageUrl \}\)/g, 'body: JSON.stringify({ ...formData, teamPreferences: formData.teamPreferences.filter(t => t.trim() !== ""), imageUrl })');

const roleHtml = `<label className="block text-sm font-bold text-slate-700 mb-2">Role Applying For *</label>
                                <select 
                                    name="role" required
                                    value={formData.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 font-semibold"
                                >
                                    <option value="Batch Ambassador">Batch Ambassador</option>
                                    <option value="Junior Executive" disabled>Junior Executive (Closed)</option>
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

c = c.replace(/const isDisabled = !\['1-1', '1-2'\].includes\(opt\);\s*return <option key=\{opt\} value=\{opt\} disabled=\{isDisabled\}>\{opt\}<\/option>;/g, 'return <option key={opt} value={opt}>{opt}</option>;');

c = c.replace(/isOtherClubAmbassador/g, 'isOtherClubExecutive');
c = c.replace(/Ambassador of Any Other Club\?/g, 'Executive of Any Other Club?');

// Find the convince strategy block using exact indexing
const startIdx = c.indexOf('<label className="block text-sm font-bold text-slate-700 mb-2">How will you convince others to join? *</label>');
const blockStart = c.lastIndexOf('<motion.div', startIdx);
const blockEnd = c.indexOf('</motion.div>', startIdx) + 13;

const newBlocks = `<label className="block text-sm font-bold text-slate-700 mb-2">How will your skill help in your preferred team? *</label>
                                <textarea 
                                    name="skillHelp" required rows="4"
                                    value={formData.skillHelp} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Explain how your skills will be beneficial..."
                                ></textarea>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select 3 to 7 Teams (in order of preference) *</label>
                                <div>
                                    {formData.teamPreferences.map((pref, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <span className="font-bold py-3 text-slate-500">#{index + 1}</span>
                                            <select
                                                value={pref}
                                                onChange={(e) => {
                                                    const newPrefs = [...formData.teamPreferences];
                                                    newPrefs[index] = e.target.value;
                                                    setFormData({ ...formData, teamPreferences: newPrefs });
                                                }}
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                required={index < 3}
                                            >
                                                <option value="">-- Select Team --</option>
                                                {["Event Management", "Logistics", "Research & Development", "Public Relationship", "Content Writing", "Graphics", "Web Development"].filter(t => !formData.teamPreferences.includes(t) || t === pref).map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            {index >= 3 && (
                                                <button
                                                    type="button"
                                                    className="text-red-500 font-bold px-2"
                                                    onClick={() => {
                                                        const newPrefs = [...formData.teamPreferences];
                                                        newPrefs.splice(index, 1);
                                                        setFormData({ ...formData, teamPreferences: newPrefs });
                                                    }}
                                                >
                                                    X
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {formData.teamPreferences.length < 7 && (
                                        <button
                                            type="button"
                                            className="text-sm text-emerald-600 font-bold mt-2"
                                            onClick={() => setFormData({ ...formData, teamPreferences: [...formData.teamPreferences, ""] })}
                                        >
                                            + Add Another Preference
                                        </button>
                                    )}
                                </div>
                            </motion.div>`;

c = c.substring(0, blockStart + 120) + newBlocks + c.substring(blockEnd);

c = c.replace('Why do you want to apply? *', 'How will you impact in this club? *');
c = c.replace(/Your Photo \(Optional\)/g, 'Your Photo *');

fs.writeFileSync('app/apply/page.js', c);
