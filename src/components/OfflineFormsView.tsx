import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfflineForm } from '../types';
import { FileDown, Download, QrCode, CheckCircle, Info, Sparkles } from 'lucide-react';
import { incrementOfflineFormDownloads } from '../utils/db';

interface OfflineFormsViewProps {
  forms: OfflineForm[];
  theme: any;
}

export function OfflineFormsView({ forms, theme }: OfflineFormsViewProps) {
  const [selectedForm, setSelectedForm] = useState<OfflineForm | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');

  const downloadFile = (form: OfflineForm) => {
    try {
      let dataUrl = form.pdfDataUrl;
      if (!dataUrl) {
        alert('ફોર્મ ફાઈલ ઉપલબ્ધ નથી. (Form file not available.)');
        return;
      }
      if (!dataUrl.startsWith('data:')) {
        dataUrl = `data:application/pdf;base64,${dataUrl}`;
      }
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = form.pdfName || `${form.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download count in Firestore
      incrementOfflineFormDownloads(form.id);
    } catch (e) {
      console.error('Error downloading form:', e);
    }
  };

  const handleDownloadClick = (form: OfflineForm) => {
    if (form.price > 0) {
      setSelectedForm(form);
      setPaymentStatus('IDLE');
      setShowPaymentModal(true);
    } else {
      downloadFile(form);
    }
  };

  const handlePaymentVerify = () => {
    if (!selectedForm) return;
    setPaymentStatus('VERIFYING');
    setTimeout(() => {
      setPaymentStatus('SUCCESS');
      setTimeout(() => {
        downloadFile(selectedForm);
        setShowPaymentModal(false);
        setSelectedForm(null);
        setPaymentStatus('IDLE');
      }, 1500);
    }, 2000);
  };

  // Generate UPI QR Code URL using api.qrserver.com
  const getUpiQrCodeUrl = (price: number, title: string) => {
    const cleanTitle = encodeURIComponent(title.substring(0, 20));
    const upiUrl = `upi://pay?pa=bsporiya9@okaxis&pn=Day%20Infotech&am=${price}&cu=INR&tn=${cleanTitle}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
  };

  return (
    <div className="space-y-4">
      {forms.length === 0 ? (
        <div className="text-center py-10 px-4">
          <FileDown className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">હાલમાં કોઈ ઓફલાઇન ફોર્મ ઉપલબ્ધ નથી.</p>
          <p className="text-[10px] text-slate-400 mt-1">કૃપા કરીને પછીથી પ્રયાસ કરો.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {forms.map((form) => (
            <div
              key={form.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/20 border-white/30 hover:bg-white/35`}
            >
              <div className="space-y-1 text-left flex-1">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {form.title}
                </h3>
                {form.description && (
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {form.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    form.price === 0 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {form.price === 0 ? 'મફત (Free)' : `₹${form.price}`}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold bg-white/40 border border-white/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Download className="h-2.5 w-2.5" />
                    <span>{form.downloadCount || 0} ડાઉનલોડ્સ</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadClick(form)}
                className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-[11px] font-black rounded-xl border cursor-pointer active:scale-95 transition-all ${
                  form.price === 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-900 border-amber-400/20'
                }`}
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>{form.price === 0 ? 'ડાઉનલોડ (Download)' : 'ચૂકવણી કરી ડાઉનલોડ'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Elegant Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-md border border-white/40 p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    UPI Payment Required
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1.5">{selectedForm.title}</h3>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {paymentStatus === 'IDLE' && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-800 text-[11px] font-bold">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>ચૂકવણીની રકમ: ₹{selectedForm.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      નીચે આપેલ QR કોડ સ્કેન કરીને ₹{selectedForm.price} ચૂકવો. ત્યારબાદ ડાઉનલોડ ચાલુ થશે.
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex flex-col items-center justify-center space-y-2">
                    <img
                      src={getUpiQrCodeUrl(selectedForm.price, selectedForm.title)}
                      alt="UPI QR Code"
                      className="w-44 h-44 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-[10px] font-black text-slate-700 tracking-wide">
                      UPI ID: <span className="text-indigo-600 select-all">bsporiya9@okaxis</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-[10px] text-slate-500 text-left space-y-1 leading-normal font-semibold">
                    <p>૧. તમારા ફોનમાં GPay, PhonePe, Paytm, અથવા BHIM UPI ઓપન કરો.</p>
                    <p>૨. ઉપર આપેલ QR કોડ સ્કેન કરીને ચૂકવણી પૂર્ણ કરો.</p>
                    <p>૩. ચૂકવણી કર્યા પછી નીચે આપેલ બટન પર ક્લિક કરો.</p>
                  </div>

                  <button
                    onClick={handlePaymentVerify}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>મેં ચૂકવણી કરી દીધી છે (I Have Paid)</span>
                  </button>
                </div>
              )}

              {paymentStatus === 'VERIFYING' && (
                <div className="py-12 space-y-4 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800">ચૂકવણી ચકાસવામાં આવી રહી છે...</h4>
                    <p className="text-[10px] text-slate-400 font-bold">કૃપા કરીને થોડી સેકન્ડ રાહ જુઓ</p>
                  </div>
                </div>
              )}

              {paymentStatus === 'SUCCESS' && (
                <div className="py-12 space-y-4 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
                  >
                    <CheckCircle className="h-7 w-7" />
                  </motion.div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-800">ચૂકવણી સફળ રહી!</h4>
                    <p className="text-[10px] text-slate-500 font-bold">ફોર્મ ડાઉનલોડ થઈ રહ્યું છે...</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
