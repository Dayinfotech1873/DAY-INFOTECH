import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfflineForm } from '../types';
import { saveOfflineForm, deleteOfflineForm } from '../utils/db';
import { Plus, Trash2, FileText, Download, ShieldCheck, HelpCircle, DollarSign } from 'lucide-react';

interface OfflineFormsManagerProps {
  forms: OfflineForm[];
  theme: any;
}

export function OfflineFormsManager({ forms, theme }: OfflineFormsManagerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('કૃપા કરીને ફક્ત PDF ફાઇલ જ અપલોડ કરો. (Please upload only PDF files.)');
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert('ફાઇલનું કદ ૧.૫ MB થી ઓછું હોવું જોઈએ. (File size must be less than 1.5 MB.)');
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPdfDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setSaveError('કૃપા કરીને ફોર્મનું નામ લખો.');
      return;
    }

    if (!editingFormId && !pdfDataUrl) {
      setSaveError('કૃપા કરીને ફોર્મ પીડીએફ (PDF) ફાઇલ અપલોડ કરો.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const finalPrice = isPaid ? Number(price) || 0 : 0;
      
      const formPayload: Partial<OfflineForm> = {
        title,
        description,
        price: finalPrice,
      };

      if (pdfDataUrl) {
        formPayload.pdfDataUrl = pdfDataUrl;
        formPayload.pdfName = pdfName;
      }

      if (editingFormId) {
        formPayload.id = editingFormId;
      }

      await saveOfflineForm(formPayload);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Reset form fields
      setTitle('');
      setDescription('');
      setIsPaid(false);
      setPrice('0');
      setPdfFile(null);
      setPdfDataUrl('');
      setPdfName('');
      setEditingFormId(null);
    } catch (err: any) {
      console.error('Error saving form:', err);
      setSaveError(err.message || 'ફોર્મ સાચવવામાં ભૂલ આવી.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (form: OfflineForm) => {
    setEditingFormId(form.id);
    setTitle(form.title);
    setDescription(form.description);
    setIsPaid(form.price > 0);
    setPrice(String(form.price));
    setPdfName(form.pdfName || '');
    setPdfDataUrl(''); // Don't prefill PDF base64 unless they want to replace it
  };

  const handleDelete = async (formId: string) => {
    if (confirm('શું તમે ખરેખર આ ફોર્મ કાઢી નાખવા માંગો છો?')) {
      try {
        await deleteOfflineForm(formId);
      } catch (err) {
        console.error('Error deleting form:', err);
        alert('ફોર્મ કાઢી નાખવામાં ભૂલ આવી.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Upload/Edit Form Column */}
      <div className={`${theme.cardBg} lg:col-span-5 p-6 rounded-3xl border ${theme.cardBorder} shadow-md space-y-4`}>
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-black text-slate-900 uppercase">
            {editingFormId ? 'ફોર્મ અપડેટ કરો (Edit Form)' : 'નવું ફોર્મ અપલોડ કરો (Add Form)'}
          </h2>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
            <span>✓ ફોર્મ સફળતાપૂર્વક સાચવવામાં આવ્યું છે!</span>
          </div>
        )}

        {saveError && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">ફોર્મનું નામ (Gujarati/English Title)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="દા.ત. નવું આવક પ્રમાણપત્ર ફોર્મ"
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.inputText} ${theme.focusRing} outline-hidden`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">ફોર્મ વિશે ટૂંકી માહિતી (Description)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="દા.ત. ડિજિટલ ગુજરાત પોર્ટલ માટેનું આવક ફોર્મ પીડીએફ"
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.inputText} ${theme.focusRing} outline-hidden resize-none`}
            />
          </div>

          {/* Price setting */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="isPaid" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                આ ફોર્મ પેઇડ (Paid) છે?
              </label>
            </div>

            {isPaid && (
              <div className="space-y-1.5 pl-6.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">ફોર્મનો ચાર્જ (Price in Rupees)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    required={isPaid}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="દા.ત. 10"
                    className={`w-full pl-7 pr-4 py-2 rounded-xl text-xs font-bold border transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.inputText} ${theme.focusRing} outline-hidden`}
                  />
                </div>
                <p className="text-[9px] text-amber-700/85 font-semibold">
                  * ચૂકવણી માટે bsporiya9@okaxis યુપીઆઈ આઈડી (UPI ID) નો ઉપયોગ થશે.
                </p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
              પીડીએફ ફાઇલ (PDF File - Max 1.5MB)
            </label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors bg-white/10">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <span className="text-[11px] font-bold text-slate-600 block">
                {pdfName ? pdfName : 'ક્લીક કરો અથવા PDF અહિયાં ડ્રોપ કરો'}
              </span>
              <span className="text-[9px] text-slate-400 font-bold mt-1 block">
                {editingFormId && !pdfFile ? '(ફક્ત નવી ફાઇલ બદલવા માટે જ અપલોડ કરો)' : 'પીડીએફ ફોર્મેટ (PDF only)'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 ${theme.primaryBtn} hover:opacity-90 active:scale-98 text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50`}
            >
              <span>{isSaving ? 'સાચવી રહ્યું છે...' : editingFormId ? 'અપડેટ કરો' : 'ફોર્મ ઉમેરો'}</span>
            </button>
            {editingFormId && (
              <button
                type="button"
                onClick={() => {
                  setEditingFormId(null);
                  setTitle('');
                  setDescription('');
                  setIsPaid(false);
                  setPrice('0');
                  setPdfFile(null);
                  setPdfDataUrl('');
                  setPdfName('');
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer border border-slate-300/50"
              >
                રદ કરો
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Uploaded Forms List Column */}
      <div className={`${theme.cardBg} lg:col-span-7 p-6 rounded-3xl border ${theme.cardBorder} shadow-md space-y-4`}>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <h2 className="text-sm font-black text-slate-900 uppercase">
            તમામ અપલોડ કરેલ ફોર્મ ({forms.length})
          </h2>
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Realtime Download Tracking
          </span>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">હજુ સુધી કોઈ ઓફલાઇન ફોર્મ ઉમેરેલ નથી.</p>
            <p className="text-[10px] text-slate-400 mt-1">ઉમેરવા માટે ડાબી બાજુનું ફોર્મ ભરો.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {forms.map((form) => (
              <div
                key={form.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white/30 hover:bg-white/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {form.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      form.price === 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {form.price === 0 ? 'મફત (Free)' : `₹${form.price}`}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold bg-white/40 border border-white/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Download className="h-2.5 w-2.5" />
                      <span>{form.downloadCount || 0} ડાઉનલોડ્સ (Downloads)</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleEdit(form)}
                    className="flex-1 sm:flex-none text-[10px] font-black px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl cursor-pointer"
                  >
                    સુધારો
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-xl cursor-pointer"
                    title="કાઢી નાખો"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
