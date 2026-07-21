import React, { useState, useRef } from 'react';
import { 
  User, MapPin, Briefcase, GraduationCap, Camera, Save, Facebook, Instagram, 
  BookOpen, Sparkles, AlertCircle
} from 'lucide-react';
import { updateUserProfile } from '../utils/db';

interface UserProfileCustomizerProps {
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const UserProfileCustomizer: React.FC<UserProfileCustomizerProps> = ({
  currentUser,
  onUpdateUser,
  showToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form States
  const [profilePic, setProfilePic] = useState<string>(currentUser?.profilePic || '');
  const [birthPlace, setBirthPlace] = useState<string>(currentUser?.birthPlace || '');
  const [bio, setBio] = useState<string>(currentUser?.bio || '');
  const [location, setLocation] = useState<string>(currentUser?.location || '');
  const [education, setEducation] = useState<string>(currentUser?.education || '');
  const [occupation, setOccupation] = useState<string>(currentUser?.occupation || '');
  const [facebookUrl, setFacebookUrl] = useState<string>(currentUser?.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState<string>(currentUser?.instagramUrl || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // File upload handler to convert file to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('કૃપા કરીને માત્ર ઇમેજ ફાઇલ જ અપલોડ કરો. (Please upload an image only.)', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('ફાઇલ સાઇઝ ૨MB કરતાં ઓછી હોવી જોઈએ. (File size should be less than 2MB.)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setProfilePic(base64);
        showToast('પ્રોફાઇલ ચિત્ર સફળતાપૂર્વક લોડ થયું છે! (Profile photo loaded successfully!)');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const username = currentUser.username || currentUser.uid?.replace('custom_', '');
      if (!username) {
        throw new Error('યુઝર વિગતો અમાન્ય છે. (Invalid user details.)');
      }

      await updateUserProfile(username, {
        profilePic,
        birthPlace,
        bio,
        location,
        education,
        occupation,
        facebookUrl,
        instagramUrl
      });

      // Update local state and current session
      const updatedUser = {
        ...currentUser,
        profilePic,
        birthPlace,
        bio,
        location,
        education,
        occupation,
        facebookUrl,
        instagramUrl
      };
      
      onUpdateUser(updatedUser);
      showToast('પ્રોફાઇલ વિગતો સફળતાપૂર્વક સેવ કરવામાં આવી છે! (Profile updated successfully!)', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'પ્રોફાઇલ સેવ કરવામાં ભૂલ આવી. (Error saving profile.)', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="user-profile-customizer">
      {/* Visual Banner Header */}
      <div className="relative h-32 md:h-40 flex items-end p-4 md:p-6 overflow-hidden bg-indigo-950">
        {profilePic ? (
          <>
            <img 
              src={profilePic} 
              alt="Banner BG" 
              className="absolute inset-0 w-full h-full object-cover blur-md brightness-50 opacity-80 scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/70 via-indigo-900/40 to-indigo-950/70"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-850"></div>
        )}
        <div className="absolute top-3 right-3 z-10 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase flex items-center gap-1 border border-white/10">
          <Sparkles className="h-3 w-3 text-amber-300 animate-spin" />
          અરજદાર પ્રોફાઇલ કાર્ડ
        </div>
      </div>

      <form onSubmit={handleSave} className="p-4 md:p-6 lg:p-8 -mt-10 relative space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          
          {/* Circular Profile Avatar Upload Stage */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-lg bg-slate-100 overflow-hidden cursor-pointer shrink-0 transition-all duration-300 ${
              dragActive ? 'ring-4 ring-indigo-500 ring-offset-2' : ''
            }`}
          >
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile Pic" 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <User className="h-10 w-10 md:h-12 md:w-12 text-slate-350" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-[10px] font-black text-center p-1 leading-tight">
              <Camera className="h-4.5 w-4.5 mb-1" />
              ફોટો બદલો
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Name & Core Info display */}
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {currentUser?.displayName || 'અરજદાર'}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px] text-slate-500 font-bold">
              <span className="font-mono bg-slate-100 text-indigo-700 px-2 py-0.5 rounded-md font-black">
                @{currentUser?.uid?.replace('custom_', '') || 'username'}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-700 font-black">{currentUser?.mobile}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5 pt-2">
          
          {/* Left Column: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              પ્રોફાઇલ વિગતો (Profile Details)
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  જન્મ સ્થળ (Birth Place)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="દા.ત. જામનગર, ગુજરાત (e.g. Jamnagar, Gujarat)"
                    className="w-full text-xs font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  હાલનું સરનામું / રહેઠાણ (Current Location)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="દા.ત. રાજકોટ, ગુજરાત (e.g. Rajkot, Gujarat)"
                    className="w-full text-xs font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                    અભ્યાસ / લાયકાત (Education)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="દા.ત. B.Com, MBA"
                      className="w-full text-xs font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                    વ્યવસાય (Occupation)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="દા.ત. બિઝનેસ, નોકરી, ખેતી"
                      className="w-full text-xs font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  મારા વિશે / ટૂંકું બાયો (Bio Description)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="તમારા વિશે ટૂંકમાં લખો (આઈડી, હોબીઝ અથવા અન્ય વિગતો...)"
                  className="w-full text-xs font-bold p-3 border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Social Profiles */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              સોશિયલ પ્રોફાઇલ્સ (Social Links)
            </h3>

            <div className="space-y-4 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Facebook પ્રોફાઇલ લિંક
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-600 pointer-events-none">
                    <Facebook className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/your-username"
                    className="w-full text-xs font-mono font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Instagram પ્રોફાઇલ લિંક / આઈડી
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-600 pointer-events-none">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="દા.ત. @bhavesh_day_infotech"
                    className="w-full text-xs font-mono font-bold pl-9 pr-3 py-2 border border-slate-250 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-400 leading-relaxed pt-1">
                નોંધ: આ સોશિયલ મીડિયા વિગતો વૈકલ્પિક છે. ઉમેરવાથી તમારા મિત્રો અને એડમિન સરળતાથી કનેક્ટ થઈ શકશે.
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 disabled:bg-slate-400 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>પ્રોફાઇલ સેવ કરો (Save Profile)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
