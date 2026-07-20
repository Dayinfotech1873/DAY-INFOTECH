const fs = require('fs');

const formContent = `
        {/* ================= NEW BIRTH CERTIFICATE ================= */}
        {formType === 'NEW_BIRTH_CERTIFICATE' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                બાળકની વિગતો (Child Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (Child Full Name - Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.childFullNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, childFullNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="દા.ત. પટેલ આર્યન અમિતભાઈ" />
                  {errors.childFullNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.childFullNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (Child Full Name - English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.childFullNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, childFullNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. PATEL ARYAN AMITBHAI" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ તારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={newBirthDetails.dob} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.dob && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ સમય (Birth Time)</label>
                  <input type="time" value={newBirthDetails.birthTime} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, birthTime: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={newBirthDetails.gender} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- જાતિ પસંદ કરો --</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ સ્થળ (Birth Place) <span className="text-rose-500">*</span></label>
                  <select value={newBirthDetails.birthPlace} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, birthPlace: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- સ્થળ પસંદ કરો --</option>
                    <option value="HOME">ઘર (Home)</option>
                    <option value="HOSPITAL">હોસ્પિટલ (Hospital)</option>
                    <option value="SANSTHA">સંસ્થા (Sanstha)</option>
                  </select>
                </div>
                
                {(newBirthDetails.birthPlace === 'HOSPITAL' || newBirthDetails.birthPlace === 'SANSTHA') && (
                  <>
                    <div className="col-span-full md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું નામ (Hospital/Sanstha Name)</label>
                      <input type="text" value={newBirthDetails.hospitalName} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, hospitalName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="col-span-full md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું સરનામું (Hospital/Sanstha Address)</label>
                      <input type="text" value={newBirthDetails.hospitalAddress} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, hospitalAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </>
                )}
                
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ સમયે માતાપિતાનું સરનામું (Address at time of birth)</label>
                  <textarea rows={2} value={newBirthDetails.bornTimeAddress} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, bornTimeAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">માતાપિતાનું કાયમી સરનામું (Permanent Address)</label>
                  <textarea rows={2} value={newBirthDetails.permanentAddress} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, permanentAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                પિતાની વિગતો (Father Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.fatherFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.fatherMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati)</label>
                  <input type="text" value={newBirthDetails.fatherLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English)</label>
                  <input type="text" value={newBirthDetails.fatherFirstNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={newBirthDetails.fatherMiddleNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English)</label>
                  <input type="text" value={newBirthDetails.fatherLastNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number)</label>
                  <input type="text" value={newBirthDetails.fatherAadhar} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherAadhar: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" value={newBirthDetails.fatherMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMobile: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={newBirthDetails.fatherEmail} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                માતાની વિગતો (Mother Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.motherFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.motherMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati)</label>
                  <input type="text" value={newBirthDetails.motherLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English)</label>
                  <input type="text" value={newBirthDetails.motherFirstNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={newBirthDetails.motherMiddleNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English)</label>
                  <input type="text" value={newBirthDetails.motherLastNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number)</label>
                  <input type="text" value={newBirthDetails.motherAadhar} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherAadhar: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" value={newBirthDetails.motherMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMobile: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={newBirthDetails.motherEmail} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                માહિતી આપનારની વિગતો (Informer Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.informerFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.informerMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati)</label>
                  <input type="text" value={newBirthDetails.informerLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળક સાથે સંબંધ (Relationship)</label>
                  <input type="text" value={newBirthDetails.informerRelationship} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father, Mother, Spouse etc" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" value={newBirthDetails.informerMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerMobile: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">સરનામું (Address)</label>
                  <textarea rows={2} value={newBirthDetails.informerAddress} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentUploader label="પિતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.fatherAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, fatherAadharFront: doc})} />
                <DocumentUploader label="પિતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.fatherAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, fatherAadharBack: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.motherAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, motherAadharFront: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.motherAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, motherAadharBack: doc})} />
                <DocumentUploader label="રેશન કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.rationCardFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, rationCardFront: doc})} />
                <DocumentUploader label="રેશન કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.rationCardBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, rationCardBack: doc})} />
                <DocumentUploader label="લગ્ન પ્રમાણપત્ર (Marriage Cert.)" gujaratiLabel="" document={newBirthDocs.marriageCertificate} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, marriageCertificate: doc})} />
                <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.informerAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerAadharFront: doc})} />
                <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.informerAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerAadharBack: doc})} />
                <DocumentUploader label="માહિતી આપનારની સહી (Signature)" gujaratiLabel="" document={newBirthDocs.informerSignature} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerSignature: doc})} />
                {(newBirthDetails.birthPlace === 'HOSPITAL' || newBirthDetails.birthPlace === 'SANSTHA') && (
                  <DocumentUploader label="હોસ્પિટલ/સંસ્થાની પહોંચ" gujaratiLabel="" document={newBirthDocs.hospitalReceipt} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, hospitalReceipt: doc})} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= BIRTH CERTIFICATE CORRECTION ================= */}
        {formType === 'BIRTH_CERTIFICATE_CORRECTION' && (
          <div className="space-y-8">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-800">મહત્વની સૂચના (Important Notice)</p>
                <p className="text-xs text-rose-600 mt-1 font-medium">જન્મ તારીખ / જન્મ વર્ષ 2019 પછીનું હશે તો જ જન્મ પ્રમાણપત્રમાં સુધારો થઈ શકશે.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                બાળકની વિગતો (Child Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.childFullNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, childFullNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (English)</label>
                  <input type="text" value={birthCorrectionDetails.childFullNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, childFullNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ તારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={birthCorrectionDetails.dob} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનો આધાર નંબર (Aadhar)</label>
                  <input type="text" value={birthCorrectionDetails.childAadhar} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, childAadhar: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">નોંધણી નંબર (Registration Number)</label>
                  <input type="text" value={birthCorrectionDetails.registrationNumber} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, registrationNumber: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentUploader label="જૂનું જન્મ પ્રમાણપત્ર" gujaratiLabel="" document={birthCorrectionDocs.oldBirthCertificate} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, oldBirthCertificate: doc})} />
                <DocumentUploader label="પિતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={birthCorrectionDocs.fatherAadharFront} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, fatherAadharFront: doc})} />
                <DocumentUploader label="પિતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={birthCorrectionDocs.fatherAadharBack} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, fatherAadharBack: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={birthCorrectionDocs.motherAadharFront} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, motherAadharFront: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={birthCorrectionDocs.motherAadharBack} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, motherAadharBack: doc})} />
                <DocumentUploader label="માહિતી આપનારની સહી" gujaratiLabel="" document={birthCorrectionDocs.informerSignature} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, informerSignature: doc})} />
              </div>
            </div>
          </div>
        )}

        {/* ================= DEATH CERTIFICATE ================= */}
        {formType === 'DEATH_CERTIFICATE' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                માહિતી આપનારની વિગતો (Informer Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerFirstNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={deathDetails.informerMiddleNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati)</label>
                  <input type="text" value={deathDetails.informerLastNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મૃતક સાથે સંબંધ</label>
                  <input type="text" value={deathDetails.informerRelationship} onChange={(e) => setDeathDetails({ ...deathDetails, informerRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father, Mother, Brother..." />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                મૃતકની વિગતો (Deceased Person Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ તારીખ (Death Date)</label>
                  <input type="date" value={deathDetails.deathDate} onChange={(e) => setDeathDetails({ ...deathDetails, deathDate: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ સમય (Death Time)</label>
                  <input type="time" value={deathDetails.deathTime} onChange={(e) => setDeathDetails({ ...deathDetails, deathTime: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ સ્થળ (Death Place)</label>
                  <select value={deathDetails.deathPlace} onChange={(e) => setDeathDetails({ ...deathDetails, deathPlace: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- સ્થળ પસંદ કરો --</option>
                    <option value="HOME">ઘર (Home)</option>
                    <option value="HOSPITAL">હોસ્પિટલ (Hospital)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ કારણ (Death Reason)</label>
                  <select value={deathDetails.deathReason} onChange={(e) => setDeathDetails({ ...deathDetails, deathReason: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- કારણ પસંદ કરો --</option>
                    <option value="NATURAL">કુદરતી (Natural)</option>
                    <option value="ACCIDENTAL">આકસ્મિક (Accidental)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati)</label>
                  <input type="text" value={deathDetails.deathPersonFirstNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati)</label>
                  <input type="text" value={deathDetails.deathPersonLastNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentUploader label="મૃતકનો ફોટો" gujaratiLabel="" document={deathDocs.deathPersonPhoto} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonPhoto: doc})} />
                <DocumentUploader label="મૃતકનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={deathDocs.deathPersonAadharFront} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonAadharFront: doc})} />
                <DocumentUploader label="મૃતકનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={deathDocs.deathPersonAadharBack} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonAadharBack: doc})} />
                <DocumentUploader label="માહિતી આપનારની સહી" gujaratiLabel="" document={deathDocs.informerSignature} onUpload={(doc) => setDeathDocs({...deathDocs, informerSignature: doc})} />
                {(deathDetails.deathPlace === 'HOSPITAL' || deathDetails.deathPlace === 'OTHER') && (
                  <DocumentUploader label="હોસ્પિટલ/પોલીસ/PM રિપોર્ટ" gujaratiLabel="" document={deathDocs.hospitalReceipt} onUpload={(doc) => setDeathDocs({...deathDocs, hospitalReceipt: doc})} />
                )}
                {deathDetails.deathPlace === 'HOME' && (
                  <DocumentUploader label="સ્મશાન/કબ્રસ્તાનની પહોંચ" gujaratiLabel="" document={deathDocs.crematoriumReceipt} onUpload={(doc) => setDeathDocs({...deathDocs, crematoriumReceipt: doc})} />
                )}
              </div>
            </div>
          </div>
        )}
`;

code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

code = code.replace(
  "{formType === 'OTHER_SERVICE' && (",
  formContent + "\n        {formType === 'OTHER_SERVICE' && ("
);

fs.writeFileSync('src/components/FormRenderer.tsx', code);
