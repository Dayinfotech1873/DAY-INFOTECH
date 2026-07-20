import React, { useState, useEffect } from 'react';
import { Award, Clock, FileText, CheckCircle, Save, LogIn, LogOut, UserCheck, Palette, ShieldAlert, MessageSquare, Users, Smartphone, Monitor, Globe, Key, User, Mail, Phone, Calendar } from 'lucide-react';
import { getAllApplications, isOwner, getLoggedInUser, getMaintenanceStatus, saveMaintenanceStatus, subscribeToMaintenanceStatus, changeCustomUsername, changeCustomPassword, getCustomUserByUsername, updateUserProfile } from '../utils/db';
import { auth, loginWithGoogle, logout } from '../utils/firebase';
import { Logo } from './Logo';
import { THEMES } from '../utils/theme';
import { useLanguage } from '../utils/language';

interface HeaderProps {
  refreshTrigger: number;
  themeId: string;
  setThemeId: (id: string) => void;
  currentUser: any;
  onLogout: () => void;
  activeView: string;
  visitorCount: number;
  setActiveView: (view: any) => void;
  onUpdateUser?: (updated: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ refreshTrigger, themeId, setThemeId, currentUser, onLogout, activeView, setActiveView, visitorCount, onUpdateUser }) => {
  const { language, setLanguage, t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    drafts: 0,
  });
  const [time, setTime] = useState(new Date());
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // Compact Inline My Profile Customizer States
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(currentUser?.profilePic || '');
  const [birthPlace, setBirthPlace] = useState(currentUser?.birthPlace || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [education, setEducation] = useState(currentUser?.education || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [facebookUrl, setFacebookUrl] = useState(currentUser?.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(currentUser?.instagramUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfilePic(currentUser.profilePic || '');
      setBirthPlace(currentUser.birthPlace || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setEducation(currentUser.education || '');
      setOccupation(currentUser.occupation || '');
      setFacebookUrl(currentUser.facebookUrl || '');
      setInstagramUrl(currentUser.instagramUrl || '');
    }
  }, [currentUser]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleHeaderProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setProfileMsg({ text: 'કૃપા કરીને માત્ર ઇમેજ ફાઇલ જ અપલોડ કરો.', isError: true });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setProfileMsg({ text: 'ફાઇલ સાઇઝ ૨MB કરતાં ઓછી હોવી જોઈએ.', isError: true });
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (base64) {
          setProfilePic(base64);
          setProfileMsg({ text: 'ફોટો સફળતાપૂર્વક લોડ થયો છે!', isError: false });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);
    try {
      const username = currentUser.username || currentUser.uid?.replace('custom_', '');
      if (!username) {
        throw new Error('અમાન્ય યુઝર વિગતો.');
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
      
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setProfileMsg({ text: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ ગઈ!', isError: false });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setProfileMsg({ text: err.message || 'સેવ કરવામાં ભૂલ આવી.', isError: true });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Profile/Account change states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'PASSWORD' | 'USERNAME'>('PASSWORD');
  
  // Verification security inputs
  const [verificationMobile, setVerificationMobile] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationDob, setVerificationDob] = useState('');
  
  // Steps for change password flow: 'VERIFY' | 'OTP' | 'NEW'
  const [passwordStep, setPasswordStep] = useState<'VERIFY' | 'OTP' | 'NEW'>('VERIFY');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [enteredPasswordOtp, setEnteredPasswordOtp] = useState('');
  const [passwordOtpNotification, setPasswordOtpNotification] = useState<string | null>(null);

  // Steps for change username flow: 'VERIFY' | 'OTP' | 'NEW'
  const [usernameStep, setUsernameStep] = useState<'VERIFY' | 'OTP' | 'NEW'>('VERIFY');
  const [usernameOtp, setUsernameOtp] = useState('');
  const [enteredUsernameOtp, setEnteredUsernameOtp] = useState('');
  const [usernameOtpNotification, setUsernameOtpNotification] = useState<string | null>(null);
  
  // Password inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Username inputs
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const resetVerificationStates = () => {
    setVerificationMobile('');
    setVerificationEmail('');
    setVerificationDob('');
    setPasswordStep('VERIFY');
    setPasswordOtp('');
    setEnteredPasswordOtp('');
    setPasswordOtpNotification(null);
    setUsernameStep('VERIFY');
    setUsernameOtp('');
    setEnteredUsernameOtp('');
    setUsernameOtpNotification(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setNewUsername('');
    setPasswordError(null);
    setPasswordSuccess(null);
    setUsernameError(null);
    setUsernameSuccess(null);
  };

  const handleVerifyPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (!verificationMobile.trim() || !verificationEmail.trim() || !verificationDob.trim() || !currentPassword.trim()) {
      setPasswordError(language === 'gu' ? 'કૃપા કરીને બધી વિગતો દાખલ કરો. (Please fill in all details.)' : 'Please fill in all details.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const username = currentUser.uid.replace('custom_', '');
      const userData = await getCustomUserByUsername(username);
      if (!userData) {
        throw new Error('વપરાશકર્તા વિગતો મેળવી શકાઈ નથી. (User details could not be loaded.)');
      }

      if (
        userData.mobile !== verificationMobile.trim() ||
        userData.email !== verificationEmail.trim() ||
        userData.dob !== verificationDob.trim() ||
        userData.password !== currentPassword.trim()
      ) {
        throw new Error('દાખલ કરેલ વિગતો પ્રોફાઇલ સાથે મેળ ખાતી નથી અથવા પાસવર્ડ ખોટો છે. (The details entered do not match your profile or password is incorrect.)');
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      setPasswordOtp(otpCode);
      setPasswordOtpNotification(`[DAY INFOTECH] આપની પાસવર્ડ બદલવાની વિનંતી માટેનો OTP ${otpCode} છે. કોઈની પણ સાથે શેર કરશો નહીં.`);
      setPasswordStep('OTP');
    } catch (err: any) {
      setPasswordError(err.message || 'માહિતી લોડ કરવામાં ભૂલ આવી. (Failed to verify details.)');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleVerifyPasswordOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (enteredPasswordOtp.trim() !== passwordOtp) {
      setPasswordError(language === 'gu' ? 'ખોટો OTP! કૃપા કરીને સાચો OTP લખો. (Incorrect OTP!)' : 'Incorrect OTP! Please try again.');
      return;
    }
    setPasswordStep('NEW');
    setPasswordOtpNotification(null);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError(language === 'gu' ? 'નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી! (Passwords do not match!)' : 'New password and confirm password do not match!');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError(language === 'gu' ? 'પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ. (Password must be at least 4 characters.)' : 'Password must be at least 4 characters.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const username = currentUser.uid.replace('custom_', '');
      await changeCustomPassword(username, currentPassword, newPassword);
      setPasswordSuccess(language === 'gu' ? 'પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે! (Password changed successfully!)' : 'Password has been changed successfully!');
      setTimeout(() => {
        resetVerificationStates();
        setIsProfileModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'પાસવર્ડ બદલવામાં ભૂલ આવી. (Failed to change password.)');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleVerifyUsernameRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);
    
    if (!verificationMobile.trim() || !verificationEmail.trim() || !verificationDob.trim()) {
      setUsernameError(language === 'gu' ? 'કૃપા કરીને બધી વિગતો દાખલ કરો. (Please fill in all details.)' : 'Please fill in all details.');
      return;
    }

    setIsSavingUsername(true);
    try {
      const username = currentUser.uid.replace('custom_', '');
      const userData = await getCustomUserByUsername(username);
      if (!userData) {
        throw new Error('વપરાશકર્તા વિગતો મેળવી શકાઈ નથી. (User details could not be loaded.)');
      }

      if (
        userData.mobile !== verificationMobile.trim() ||
        userData.email !== verificationEmail.trim() ||
        userData.dob !== verificationDob.trim()
      ) {
        throw new Error('દાખલ કરેલ વિગતો પ્રોફાઇલ સાથે મેળ ખાતી નથી. (The details entered do not match your profile.)');
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      setUsernameOtp(otpCode);
      setUsernameOtpNotification(`[DAY INFOTECH] આપનું યુઝરનેમ બદલવાની વિનંતી માટેનો OTP ${otpCode} છે. કોઈની પણ સાથે શેર કરશો નહીં.`);
      setUsernameStep('OTP');
    } catch (err: any) {
      setUsernameError(err.message || 'માહિતી લોડ કરવામાં ભૂલ આવી. (Failed to verify details.)');
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleVerifyUsernameOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    if (enteredUsernameOtp.trim() !== usernameOtp) {
      setUsernameError(language === 'gu' ? 'ખોટો OTP! કૃપા કરીને સાચો OTP લખો. (Incorrect OTP!)' : 'Incorrect OTP! Please try again.');
      return;
    }
    setUsernameStep('NEW');
    setUsernameOtpNotification(null);
  };

  const handleUsernameChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);

    const cleanUsername = newUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanUsername) {
      setUsernameError(language === 'gu' ? 'કૃપા કરીને સાચું નવું યુઝરનેમ લખો. (Please enter a valid new username.)' : 'Please enter a valid new username.');
      return;
    }

    setIsSavingUsername(true);
    try {
      const oldUsername = currentUser.uid.replace('custom_', '');
      await changeCustomUsername(oldUsername, cleanUsername);
      setUsernameSuccess(language === 'gu' ? `યુઝરનેમ સફળતાપૂર્વક બદલીને "${cleanUsername}" કરવામાં આવ્યું છે! પેજ રીલોડ થઈ રહ્યું છે... (Username changed successfully to "${cleanUsername}"! Reloading...)` : `Username has been changed successfully to "${cleanUsername}"! Reloading...`);
      setNewUsername('');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setUsernameError(err.message || 'યુઝરનેમ બદલવામાં ભૂલ આવી. (Failed to change username.)');
    } finally {
      setIsSavingUsername(false);
    }
  };

  useEffect(() => {
    // Clock updates
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (isOwner()) {
      unsubscribe = subscribeToMaintenanceStatus((status) => {
        setIsMaintenanceMode(status);
      });
    }
    return () => unsubscribe();
  }, [currentUser]);

  const handleToggleMaintenance = async () => {
    if (isTogglingMaintenance) return;
    setIsTogglingMaintenance(true);
    try {
      const newStatus = !isMaintenanceMode;
      await saveMaintenanceStatus(newStatus);
      // Local state is updated by the subscription
    } catch (e) {
      console.error('Failed to toggle maintenance mode', e);
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAllApplications();
      const completed = data.filter(d => d.status === 'COMPLETED').length;
      const drafts = data.filter(d => d.status === 'DRAFT').length;
      setStats({
        total: data.length,
        completed,
        drafts,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return date.toTimeString().split(' ')[0] || '';
    }
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('gu-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      try {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (err) {
        return date.toDateString();
      }
    }
  };

  const activeTheme = THEMES[themeId] || THEMES.light;

  return (
    <header className="space-y-1.5 md:space-y-2.5 no-print">
      {/* Top Brand Bar */}
      <div className={activeTheme.brandBarClass}>
        
        <div className="flex items-center space-x-2">
          <Logo size={36} showText={false} className="bg-white p-0.5 rounded-lg shadow-xs shrink-0" />
          <div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-[8px] md:text-[9px] font-black text-orange-300 tracking-wider font-sans uppercase">digital point</span>
              <span className="text-[8px] text-white/40">|</span>
              <div className="flex items-center gap-0.5 text-[8px] md:text-[9px] text-emerald-300 font-bold bg-slate-950/40 px-1 py-0.2 rounded-xs border border-emerald-500/10">
                <Users className="h-2.5 w-2.5 text-emerald-400" />
                <span>{t('visitors', 'common')}: {visitorCount}</span>
              </div>
            </div>
            <h1 className="text-base md:text-lg font-black font-display tracking-tight uppercase text-white leading-none mt-0.5">
              DAY INFOTECH
            </h1>
            <p className={`${activeTheme.brandSubtext} text-[10px] leading-tight font-medium opacity-90 mt-0.5`}>{t('brand_subtitle', 'common')}</p>
          </div>
        </div>

        {/* Live system clock */}
        <div className={`mt-1 sm:mt-0 flex flex-col items-start sm:items-end font-sans text-[11px] ${activeTheme.brandSubtext} space-y-0.5`}>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center space-x-1 text-yellow-400 font-bold font-mono text-[11px]">
              <Clock className="h-3 w-3 animate-spin-slow" />
              <span>{formatTime(time)}</span>
            </div>
            <span className="text-[9px] font-mono opacity-80">{formatDate(time)}</span>
          </div>
          
          {/* Theme & Language Selectors container */}
          <div className="flex flex-wrap items-center justify-end gap-1 mt-0.5">
            {/* Theme Selector Pill */}
            <div className="flex items-center gap-1 bg-black/30 px-1 py-0.5 rounded border border-white/10 text-[9px]">
              <Palette className="h-3 w-3 text-white" />
              <select
                value={themeId}
                onChange={(e) => {
                  setThemeId(e.target.value);
                  try {
                    localStorage.setItem('dashboard_theme', e.target.value);
                  } catch (err) {}
                }}
                className="bg-transparent border-none text-white text-[9px] font-bold outline-hidden cursor-pointer"
              >
                {Object.values(THEMES).map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white text-[9px]">
                    {t.name.split(' (')[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector Pill */}
            <div className="flex items-center gap-1 bg-black/30 px-1 py-0.5 rounded border border-white/10 text-[9px]">
              <Globe className="h-3 w-3 text-white" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none text-white text-[9px] font-bold outline-hidden cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">EN</option>
                <option value="gu" className="bg-slate-900 text-white">ગુજરાતી</option>
              </select>
            </div>
          </div>
          
          <div className={`pt-1.5 border-t ${activeTheme.brandBarBorder} w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5`}>
            {currentUser ? (
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                {/* Left side: Profile Info */}
                <div className="flex items-center gap-2">
                  {!isOwner() && (
                    currentUser.profilePic ? (
                      <img 
                        src={currentUser.profilePic} 
                        alt="Profile" 
                        className="h-7 w-7 rounded-full border border-indigo-400 object-cover shrink-0 select-none" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div 
                        className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 select-none"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-extrabold text-xs leading-none">{currentUser.displayName || currentUser.email}</span>
                      <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded uppercase tracking-wider">
                        {isOwner() ? t('role_admin', 'dashboard') : t('role_user', 'dashboard')}
                      </span>
                    </div>
                    {currentUser.mobile && <span className="text-[9px] text-slate-300 font-bold mt-0.5">{t('mobile', 'common')}: {currentUser.mobile}</span>}
                  </div>
                </div>

                {/* Right side: Action Pill Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 no-print">
                  {isOwner() ? (
                    <>
                      <button
                        onClick={() => setActiveView('TRACKER')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                          activeView === 'TRACKER'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-102'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle className="h-3 w-3 shrink-0 text-amber-600" />
                        <span>{t('tracker', 'nav')}</span>
                      </button>
                      
                      <button
                        onClick={() => setActiveView('MESSAGES')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                          activeView === 'MESSAGES'
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold scale-102'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <MessageSquare className="h-3 w-3 shrink-0 text-indigo-600" />
                        <span>{t('chats', 'nav')}</span>
                      </button>

                      <button
                        onClick={() => setActiveView("ONLINE_USERS")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                          activeView === "ONLINE_USERS"
                            ? "bg-blue-600 text-white border-blue-500 font-bold scale-102"
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <UserCheck className="h-3 w-3 shrink-0 text-blue-600" />
                        <span>{t('online_users', 'nav')}</span>
                      </button>

                      <button
                        onClick={() => setActiveView('OFFLINE_FORMS')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                          activeView === 'OFFLINE_FORMS'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-102'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="h-3 w-3 shrink-0 text-amber-600" />
                        <span>{t('offline_forms', 'nav')}</span>
                      </button>
                    </>
                  ) : null}

                  {currentUser && currentUser.isCustom && (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-300 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-[10px] font-black text-indigo-700 transition-all cursor-pointer shadow-xs"
                    >
                      <UserCheck className="h-3 w-3 shrink-0 text-indigo-600" />
                      <span>{language === 'gu' ? 'પ્રોફાઇલ સેટિંગ્સ' : 'Profile Settings'}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white text-[10px] font-black text-rose-700 transition-all cursor-pointer shadow-xs"
                  >
                    <LogOut className="h-3 w-3 shrink-0 text-rose-600" />
                    <span>{t('logout', 'common')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row gap-2 justify-start sm:justify-end items-stretch sm:items-center">
                {/* 1. Applicant Login */}
                <div className={`flex items-center gap-1.5 ${activeTheme.badgeBg} p-1 px-2 rounded-lg border ${activeTheme.badgeBorder} text-[10px]`}>
                  <span className="font-extrabold text-white shrink-0">{language === 'gu' ? 'અરજદારો માટે :' : 'Applicants :'}</span>
                  <button
                    onClick={async () => {
                      try {
                        await loginWithGoogle();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex items-center justify-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded border border-emerald-500 shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="h-3 w-3" /> {language === 'gu' ? 'અરજદાર લોગિન' : 'Login'}
                  </button>
                </div>

                {/* 2. Admin Login */}
                <div className={`flex items-center gap-1.5 ${activeTheme.badgeBg} p-1 px-2 rounded-lg border ${activeTheme.badgeBorder} text-[10px]`}>
                  <span className="font-extrabold text-white shrink-0">{language === 'gu' ? 'એડમિન માટે :' : 'Admin :'}</span>
                  <button
                    onClick={async () => {
                      try {
                        await loginWithGoogle();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex items-center justify-center gap-1 px-2 py-0.5 bg-indigo-800 hover:bg-indigo-750 text-indigo-100 font-bold text-[10px] rounded border border-indigo-600 shadow-xs transition-all cursor-pointer"
                  >
                    <UserCheck className="h-3 w-3" /> {language === 'gu' ? 'એડમિન લોગિન' : 'Admin Login'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Statistics Cards Grid (Bento Grid Style) - Shown only for owner/admin */}
      {currentUser && isOwner() && (
        <div className="w-full flex justify-start">
          
          {/* Card 4: Maintenance Mode Toggle or Status */}
          <div className={`${activeTheme.cardBg} rounded-2xl p-5 border ${isMaintenanceMode ? 'border-rose-400/50 bg-rose-50/50' : activeTheme.cardBorder} shadow-xs flex items-center space-x-4 hover:border-slate-300 transition-all w-full max-w-sm`}>
            <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${isMaintenanceMode ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              <ShieldAlert className={`h-6 w-6 ${isMaintenanceMode ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className={`text-[10px] font-bold ${isMaintenanceMode ? 'text-rose-600' : activeTheme.statsLabelText} uppercase tracking-wider font-sans`}>
                મેન્ટેનન્સ મોડ (Maintenance)
              </p>
              {isOwner() ? (
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={handleToggleMaintenance}
                    disabled={isTogglingMaintenance}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${isMaintenanceMode ? 'bg-rose-500' : 'bg-slate-300'} cursor-pointer disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className={`text-[11px] font-black ${isMaintenanceMode ? 'text-rose-600' : 'text-slate-500'}`}>
                    {isMaintenanceMode ? 'ચાલુ (ON)' : 'બંધ (OFF)'}
                  </span>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isMaintenanceMode ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                  <span className={`text-[10px] font-black ${isMaintenanceMode ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isMaintenanceMode ? 'જાળવણી ચાલુ છે (ON)' : 'સેવાઓ સક્રિય છે (OFF)'}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Profile/Account Settings Modal */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl max-w-md w-full overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-black uppercase tracking-wide">
                  {language === 'gu' ? 'પ્રોફાઇલ અને સુરક્ષા સેટિંગ્સ' : 'Profile & Security Settings'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  resetVerificationStates();
                }}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => { resetVerificationStates(); setProfileTab('PASSWORD'); }}
                className={`flex-1 py-3 text-center text-xs font-black transition-all border-b-2 cursor-pointer ${
                  profileTab === 'PASSWORD'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                {language === 'gu' ? 'પાસવર્ડ બદલો (Change Password)' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => { resetVerificationStates(); setProfileTab('USERNAME'); }}
                className={`flex-1 py-3 text-center text-xs font-black transition-all border-b-2 cursor-pointer ${
                  profileTab === 'USERNAME'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                {language === 'gu' ? 'યુઝરનેમ બદલો (Change Username)' : 'Change Username'}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              
              {profileTab === 'PASSWORD' ? (
                <div>
                  {passwordError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl leading-relaxed mb-4">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl leading-relaxed mb-4">
                      {passwordSuccess}
                    </div>
                  )}

                  {passwordStep === 'VERIFY' && (
                    <form onSubmit={handleVerifyPasswordRequest} className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mb-2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase">પગલું ૧: સિક્યુરિટી વેરિફિકેશન (Step 1: Security Verification)</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">પાસવર્ડ બદલવા માટે તમારી રજિસ્ટર્ડ વિગતો દાખલ કરો.</p>
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'મોબાઇલ નંબર (Mobile Number)' : 'Mobile Number'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Phone className="h-4 w-4" />
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={verificationMobile}
                            onChange={e => setVerificationMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'ઇમેઇલ એડ્રેસ (Email Address)' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="email"
                            required
                            value={verificationEmail}
                            onChange={e => setVerificationEmail(e.target.value)}
                            placeholder={language === 'gu' ? 'તમારું ઇમેઇલ એડ્રેસ લખો' : 'Enter registered email'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'જન્મ તારીખ (Date of Birth)' : 'Date of Birth'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <input
                            type="date"
                            required
                            value={verificationDob}
                            onChange={e => setVerificationDob(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Current Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'હાલનો પાસવર્ડ (Current Password)' : 'Current Password'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder={language === 'gu' ? 'તમારો ચાલુ પાસવર્ડ લખો' : 'Enter current password'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingPassword ? (language === 'gu' ? 'ચકાસણી ચાલુ છે...' : 'Verifying...') : (language === 'gu' ? 'વિગતો ચકાસો અને OTP મેળવો' : 'Verify Details & Get OTP')}
                      </button>
                    </form>
                  )}

                  {passwordStep === 'OTP' && (
                    <form onSubmit={handleVerifyPasswordOtp} className="space-y-4">
                      {passwordOtpNotification && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold p-3.5 rounded-xl leading-relaxed space-y-1">
                          <p className="uppercase tracking-wider">📩 OTP મોકલવામાં આવ્યો છે (OTP Sent):</p>
                          <p className="font-mono text-xs text-indigo-700 bg-white p-2 rounded-lg border border-amber-200/50">{passwordOtpNotification}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'OTP કોડ લખો (Enter OTP Code)' : 'Enter OTP Code'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={enteredPasswordOtp}
                            onChange={e => setEnteredPasswordOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder={language === 'gu' ? '૪ આંકડાનો OTP કોડ લખો' : 'Enter 4-digit OTP code'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all text-center tracking-widest text-lg"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        {language === 'gu' ? 'OTP સબમિટ કરો' : 'Submit OTP'}
                      </button>
                    </form>
                  )}

                  {passwordStep === 'NEW' && (
                    <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-2">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase">પગલું ૩: નવો પાસવર્ડ (Step 3: New Password)</p>
                        <p className="text-[11px] font-medium text-slate-600 mt-0.5">તમારો નવો પાસવર્ડ સેટ કરો.</p>
                      </div>

                      {/* New Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'નવો પાસવર્ડ (New Password)' : 'New Password'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder={language === 'gu' ? 'ઓછામાં ઓછા ૪ આંકડા' : 'Minimum 4 characters'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'નવો પાસવર્ડ ફરીથી લખો (Confirm New Password)' : 'Confirm New Password'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="password"
                            required
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                            placeholder={language === 'gu' ? 'નવો પાસવર્ડ ફરીથી લખો' : 'Repeat new password'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingPassword ? (language === 'gu' ? 'બદલાઈ રહ્યો છે...' : 'Saving...') : (language === 'gu' ? 'પાસવર્ડ અપડેટ કરો' : 'Update Password')}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div>
                  {usernameError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl leading-relaxed mb-4">
                      {usernameError}
                    </div>
                  )}
                  {usernameSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl leading-relaxed mb-4">
                      {usernameSuccess}
                    </div>
                  )}

                  {usernameStep === 'VERIFY' && (
                    <form onSubmit={handleVerifyUsernameRequest} className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mb-2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase">પગલું ૧: સિક્યુરિટી વેરિફિકેશન (Step 1: Security Verification)</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">યુઝરનેમ બદલવા માટે તમારી રજિસ્ટર્ડ વિગતો દાખલ કરો.</p>
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'મોબાઇલ નંબર (Mobile Number)' : 'Mobile Number'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Phone className="h-4 w-4" />
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={verificationMobile}
                            onChange={e => setVerificationMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'ઇમેઇલ એડ્રેસ (Email Address)' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="email"
                            required
                            value={verificationEmail}
                            onChange={e => setVerificationEmail(e.target.value)}
                            placeholder={language === 'gu' ? 'તમારું ઇમેઇલ એડ્રેસ લખો' : 'Enter registered email'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'જન્મ તારીખ (Date of Birth)' : 'Date of Birth'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <input
                            type="date"
                            required
                            value={verificationDob}
                            onChange={e => setVerificationDob(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingUsername}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingUsername ? (language === 'gu' ? 'ચકાસણી ચાલુ છે...' : 'Verifying...') : (language === 'gu' ? 'વિગતો ચકાસો અને OTP મેળવો' : 'Verify Details & Get OTP')}
                      </button>
                    </form>
                  )}

                  {usernameStep === 'OTP' && (
                    <form onSubmit={handleVerifyUsernameOtp} className="space-y-4">
                      {usernameOtpNotification && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold p-3.5 rounded-xl leading-relaxed space-y-1">
                          <p className="uppercase tracking-wider">📩 OTP મોકલવામાં આવ્યો છે (OTP Sent):</p>
                          <p className="font-mono text-xs text-indigo-700 bg-white p-2 rounded-lg border border-amber-200/50">{usernameOtpNotification}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'OTP કોડ લખો (Enter OTP Code)' : 'Enter OTP Code'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={enteredUsernameOtp}
                            onChange={e => setEnteredUsernameOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder={language === 'gu' ? '૪ આંકડાનો OTP કોડ લખો' : 'Enter 4-digit OTP code'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all text-center tracking-widest text-lg"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        {language === 'gu' ? 'OTP સબમિટ કરો' : 'Submit OTP'}
                      </button>
                    </form>
                  )}

                  {usernameStep === 'NEW' && (
                    <form onSubmit={handleUsernameChangeSubmit} className="space-y-4">
                      {/* Current Username info */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-black text-slate-500 uppercase block">હાલનું યુઝરનેમ (Current Username)</span>
                        <span className="text-sm font-black text-slate-800 block mt-0.5">@{currentUser.uid.replace('custom_', '')}</span>
                      </div>

                      {/* New Username input */}
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                          {language === 'gu' ? 'નવું યુઝરનેમ (New Username)' : 'New Username'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <User className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                            placeholder={language === 'gu' ? 'નવું યુઝરનેમ લખો (ફક્ત અક્ષરો અને આંકડા)' : 'Enter new username (alphanumeric)'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-950 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      {/* Info Notice about Cooldown */}
                      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl leading-relaxed space-y-1 font-sans">
                        <p className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">⚠️ મહત્વપૂર્ણ ચેતવણી (Important Warning):</p>
                        <p className="text-[11px] font-bold text-slate-700">
                          {language === 'gu' 
                            ? 'એકવાર યુઝરનેમ બદલાયા પછી તમે તેને આગામી ૯ો દિવસ સુધી ફરીથી બદલી શકશો નહીં.'
                            : 'Once you change your username, you will not be able to change it again for the next 90 days.'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingUsername}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingUsername ? (language === 'gu' ? 'બદલાઈ રહ્યું છે...' : 'Saving...') : (language === 'gu' ? 'યુઝરનેમ અપડેટ કરો' : 'Update Username')}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
};
