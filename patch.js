const fs = require('fs');
let c = fs.readFileSync('app_apply_page_old.txt', 'utf8');

c = c.replace(/convinceStrategy: ""/g, 'teamPreferences: ["", "", ""]');
c = c.replace(/convinceStrategy/g, 'teamPreferences');
c = c.replace('<option value="Junior Executive" disabled>Junior Executive (Closed)</option>', '<option value="Junior Executive">Junior Executive</option>');
c = c.replace('<label className="block text-sm font-bold text-slate-700 mb-2">How will you convince others to join? *</label>', '<label className="block text-sm font-bold text-slate-700 mb-2">Select 3 to 7 Teams (in order of preference) *</label>');

const textareaReplacement = `<div>
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
</div>`;

c = c.replace(/<textarea\s+name="teamPreferences".*?<\/textarea>/s, textareaReplacement);

fs.writeFileSync('app/apply/page.js', c);
