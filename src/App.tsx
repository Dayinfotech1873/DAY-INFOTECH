import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormType, ApplicationEntry, OfflineForm } from './types';
import { Header } from './components/Header';
import { ApplicationTracker } from './components/ApplicationTracker';
import { FormRenderer } from './components/FormRenderer';
import { LogIn, Lock, ArrowLeft, Sparkles, ShieldCheck, User, Phone, Key, UserPlus, Eye, EyeOff, ArrowRight, Shield, Info, FileText, Calendar, Users, FileDown, Download, Plus, Trash2, QrCode, CheckCircle, Monitor, Smartphone, MessageSquare, Folder, Wifi, X, Minimize2, Maximize2, Activity, Clock, LogOut, Palette, Mail } from 'lucide-react';
import { auth, logout, db } from './utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Logo } from './components/Logo';
import { getLoggedInUser, logoutCustomUser, signUpCustomUser, loginCustomUser, createForgotPasswordRequest, getAccountsByMobile, getAccountsByMobileAndDob, isOwner, subscribeToMaintenanceStatus, saveMaintenanceStatus, incrementVisitorCount, subscribeToVisitorCount, updateUserOnlineStatus, setUserOffline, resetAdminPassword, subscribeToOfflineForms, saveOfflineForm, deleteOfflineForm, incrementOfflineFormDownloads, getGreetingsMessage, changeCustomPassword, changeCustomUsername, getCustomUserByUsername } from './utils/db';
import { MaintenanceView } from './components/MaintenanceView';
import { THEMES } from './utils/theme';
import { AboutDayInfotech } from './components/AboutDayInfotech';
import { MessagesView } from './components/MessagesView';
import { OnlineUsersView } from './components/OnlineUsersView';
import { PrivateChatWidget } from './components/PrivateChatWidget';
import { BackgroundSlideshow } from './components/BackgroundSlideshow';
import { OfflineFormsView } from './components/OfflineFormsView';
import { OfflineFormsManager } from './components/OfflineFormsManager';
import { SplashScreen } from './components/SplashScreen';
import { useLanguage, DICTIONARY } from './utils/language';

type AppView = 'TRACKER' | 'FORM' | 'ABOUT' | 'MESSAGES' | 'ONLINE_USERS' | 'OFFLINE_FORMS' | 'DESKTOP_HOME';

// Elegant SVG WhatsApp Icon
const WhatsAppIcon = ({ className = "h-4.5 w-4.5" }: { className?: string }) => (
  <svg className={`${className} fill-current shrink-0`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.014 14.077.99 11.512.99 6.076.99 1.652 5.361 1.648 10.793c-.001 1.632.453 3.22 1.316 4.625l-1.012 3.693 3.791-.989zm13.111-7.853c-.302-.15-1.788-.876-2.065-.976-.277-.1-.479-.15-.68.15-.2.3-.775.976-.95 1.176-.175.2-.351.224-.653.075-1.251-.627-2.072-1.102-2.895-2.51-.217-.371.217-.345.621-1.151.067-.134.034-.253-.017-.354-.05-.1-.479-1.135-.656-1.564-.173-.418-.363-.36-.496-.367-.129-.007-.277-.008-.426-.008-.149 0-.393.056-.598.28-.205.224-.783.764-.783 1.861s.801 2.158.913 2.308c.112.15 1.576 2.384 3.82 3.336 1.309.553 1.956.666 2.656.561.428-.064 1.32-.538 1.506-1.059.186-.52.186-.966.131-1.059-.056-.094-.205-.15-.508-.3z"/>
  </svg>
);

export default function App() {
  const { language, setLanguage, t, isGujarati } = useLanguage();
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('dashboard_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });
  const activeTheme = THEMES[themeId] || THEMES.light;

  const [viewMode, setViewMode] = useState<'DESKTOP' | 'MOBILE'>(() => {
    try {
      return (localStorage.getItem('dashboard_viewmode') as 'DESKTOP' | 'MOBILE') || 'DESKTOP';
    } catch (e) {
      return 'DESKTOP';
    }
  });

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);

  const handleSetViewMode = (mode: 'DESKTOP' | 'MOBILE') => {
    setViewMode(mode);
    try {
      localStorage.setItem('dashboard_viewmode', mode);
    } catch (e) {}
  };

  const [activeView, setActiveView] = useState<AppView>('TRACKER');
  const [activeTrackerTab, setActiveTrackerTab] = useState<'DASHBOARD' | 'APPLICATIONS' | 'USERS' | 'SERVICES' | 'OFFICIAL_WEBSITES' | 'SEND_MESSAGE' | 'APPLY_SERVICE' | 'YOUR_APPLICATIONS' | 'ABOUT_DAY_INFOTECH' | 'WALLET' | undefined>(undefined);
  const [showSplash, setShowSplash] = useState(true);
  const [chatTargetUser, setChatTargetUser] = useState<any>(null);
  const [activeFormType, setActiveFormType] = useState<FormType | null>(null);
  const [editingEntry, setEditingEntry] = useState<ApplicationEntry | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT' | 'ADMIN' | 'ADMIN_FORGOT' | 'OFFLINE_FORMS' | 'CHANGE_PASSWORD' | 'CHANGE_USERNAME'>('LOGIN');
  const [offlineForms, setOfflineForms] = useState<OfflineForm[]>([]);

  // Forgot password inputs
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotDob, setForgotDob] = useState('');
  const [isSendingForgotRequest, setIsSendingForgotRequest] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // Forgot OTP recovery states
  const [forgotStep, setForgotStep] = useState<'MOBILE' | 'OTP' | 'SHOW_CREDENTIALS'>('MOBILE');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [recoveredAccounts, setRecoveredAccounts] = useState<any[]>([]);
  const [otpSmsNotification, setOtpSmsNotification] = useState<string | null>(null);

  // Admin Forgot password inputs
  const [adminForgotDob, setAdminForgotDob] = useState('');
  const [adminForgotAadhar, setAdminForgotAadhar] = useState('');
  const [adminForgotEmail, setAdminForgotEmail] = useState('');
  const [adminForgotMobile, setAdminForgotMobile] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isAdminResetting, setIsAdminResetting] = useState(false);
  const [adminResetSuccessMessage, setAdminResetSuccessMessage] = useState<string | null>(null);

  // Custom login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState<string | null>(null);

  // Custom signup inputs
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupGender, setSignupGender] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminResetPassword, setShowAdminResetPassword] = useState(false);

  // Password Change on Login Screen States
  const [changePasswordUsername, setChangePasswordUsername] = useState('');
  const [changePasswordMobile, setChangePasswordMobile] = useState('');
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [changePasswordDob, setChangePasswordDob] = useState('');
  const [changePasswordCurrent, setChangePasswordCurrent] = useState('');
  const [changePasswordNew, setChangePasswordNew] = useState('');
  const [changePasswordConfirm, setChangePasswordConfirm] = useState('');
  const [changePasswordStep, setChangePasswordStep] = useState<'VERIFY' | 'OTP' | 'NEW'>('VERIFY');
  const [changePasswordOtp, setChangePasswordOtp] = useState('');
  const [enteredChangePasswordOtp, setEnteredChangePasswordOtp] = useState('');
  const [changePasswordOtpNotification, setChangePasswordOtpNotification] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showChangePasswordCurrent, setShowChangePasswordCurrent] = useState(false);
  const [showChangePasswordNew, setShowChangePasswordNew] = useState(false);

  // Username Change on Login Screen States
  const [changeUsernameOld, setChangeUsernameOld] = useState('');
  const [changeUsernameMobile, setChangeUsernameMobile] = useState('');
  const [changeUsernameEmail, setChangeUsernameEmail] = useState('');
  const [changeUsernameDob, setChangeUsernameDob] = useState('');
  const [changeUsernameNew, setChangeUsernameNew] = useState('');
  const [changeUsernameStep, setChangeUsernameStep] = useState<'VERIFY' | 'OTP' | 'NEW'>('VERIFY');
  const [changeUsernameOtp, setChangeUsernameOtp] = useState('');
  const [enteredChangeUsernameOtp, setEnteredChangeUsernameOtp] = useState('');
  const [changeUsernameOtpNotification, setChangeUsernameOtpNotification] = useState<string | null>(null);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const [greetingsMsg, setGreetingsMsg] = useState('');
  const [isGreetingsActive, setIsGreetingsActive] = useState(false);

  useEffect(() => {
    const loadGreetings = async () => {
      try {
        const data = await getGreetingsMessage();
        setGreetingsMsg(data.message || '');
        setIsGreetingsActive(data.active);
      } catch (e) {
        console.error('Error fetching greetings message:', e);
      }
    };
    
    loadGreetings();
    
    // Poll for changes every 5 seconds so the login screen updates dynamically
    const interval = setInterval(loadGreetings, 5000);
    return () => clearInterval(interval);
  }, []);

  const [visitorCount, setVisitorCount] = useState<number>(0);
  useEffect(() => {
    const unsubscribeMaintenance = subscribeToMaintenanceStatus((status) => {
      setIsMaintenanceMode(status);
    });
    return () => unsubscribeMaintenance();
  }, []);


  useEffect(() => {
    try {
      if (!sessionStorage.getItem("hasVisited")) {
        incrementVisitorCount();
        sessionStorage.setItem("hasVisited", "true");
      }
    } catch (e) {}
    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeForms = subscribeToOfflineForms((forms) => {
      setOfflineForms(forms);
    });
    return () => unsubscribeForms();
  }, []);

  useEffect(() => {
    if (currentUser) {
      updateUserOnlineStatus(currentUser);
      const handleBeforeUnload = () => {
        setUserOffline(currentUser);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        setUserOffline(currentUser);
      };
    }
  }, [currentUser]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(getLoggedInUser());
      // Trigger refresh across components when auth state changes
      setRefreshTrigger(prev => prev + 1);
    });
    // Immediately set current user from unified storage helper
    setCurrentUser(getLoggedInUser());
    return () => unsubscribe();
  }, []);

  // Real-time listener for current logged-in user to handle block or delete actions instantly across App views
  useEffect(() => {
    if (!currentUser || isOwner()) return;
    const username = currentUser.username || currentUser.uid?.replace('custom_', '');
    if (!username) return;

    const docRef = doc(db, 'users', username.toLowerCase());
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        // User account was deleted by admin
        logoutCustomUser();
        setCurrentUser(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = snapshot.data();
        if (data && data.isBlocked) {
          // User account was blocked by admin
          logoutCustomUser();
          setCurrentUser(null);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    }, (error) => {
      console.error('Error listening to current user status in App:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);



  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setActiveView('TRACKER');
  };

  // Inactivity Auto-Logout: 5 min for standard users, 10 min for owner/admin
  useEffect(() => {
    if (!currentUser) return;

    let lastActivity = Date.now();
    const userInactivityLimit = 5 * 60 * 1000; // 5 minutes (300,000ms)
    const ownerInactivityLimit = 10 * 60 * 1000; // 10 minutes (600,000ms)

    const resetTimer = () => {
      lastActivity = Date.now();
    };

    // Listen to user interaction events across the page
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    const checkInterval = setInterval(() => {
      const limit = isOwner() ? ownerInactivityLimit : userInactivityLimit;
      if (Date.now() - lastActivity > limit) {
        console.log(`Auto log out due to inactivity (${isOwner() ? 'Owner 10 min' : 'User 5 min'} limit reached).`);
        handleLogout();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(checkInterval);
    };
  }, [currentUser]);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('કૃપા કરીને યુઝરનેમ અને પાસવર્ડ બંને ભરો. (Please enter username and password.)');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const session = await loginCustomUser(loginUsername, loginPassword, authMode === 'ADMIN');
      setCurrentUser(session);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setLoginError(err.message || 'લૉગ ઇન કરવામાં અસમર્થ. (Unable to log in.)');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const rawDob = adminForgotDob.trim();
    const normalizedDob = rawDob.replace(/\//g, '-');
    // Normalize user's birthdate format: supports YYYY-MM-DD or DD-MM-YYYY
    const isDobValid = normalizedDob === '09-04-1996' || normalizedDob === '1996-04-09';
    const isAadharValid = adminForgotAadhar.replace(/\s/g, '').trim() === '358724179377';
    const isEmailValid = adminForgotEmail.trim().toLowerCase() === 'bsporiya9@gmail.com';
    const isMobileValid = adminForgotMobile.replace(/\D/g, '').trim() === '7600361873';

    if (isDobValid && isAadharValid && isEmailValid && isMobileValid) {
      setIsAdminVerified(true);
      setLoginError(null);
    } else {
      const errors = [];
      if (!isDobValid) errors.push("જન્મ તારીખ (Birth Date)");
      if (!isAadharValid) errors.push("આધાર કાર્ડ નંબર (Aadhar No)");
      if (!isEmailValid) errors.push("ઈમેલ (Email)");
      if (!isMobileValid) errors.push("મોબાઈલ નંબર (Mobile No)");
      setLoginError(`માહિતી મેળ ખાતી નથી: ${errors.join(', ')} ખોટા છે. (Verification failed: Invalid fields.)`);
    }
  };

  const handleAdminPasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword.trim()) {
      setLoginError('કૃપા કરીને નવો પાસવર્ડ લખો. (Please enter a new password.)');
      return;
    }
    setIsAdminResetting(true);
    setLoginError(null);
    try {
      await resetAdminPassword(adminNewPassword);
      setAdminResetSuccessMessage('એડમિન પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે! હવે તમે નવા પાસવર્ડ સાથે લોગિન કરી શકો છો. (Admin password successfully reset!)');
      // Clear inputs
      setAdminForgotDob('');
      setAdminForgotAadhar('');
      setAdminForgotEmail('');
      setAdminForgotMobile('');
      setAdminNewPassword('');
    } catch (err: any) {
      setLoginError('પાસવર્ડ બદલવામાં કોઈ સમસ્યા આવી છે. (Failed to reset password.)');
    } finally {
      setIsAdminResetting(false);
    }
  };

  const handleCustomSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupMobile.trim() || !signupEmail.trim() || !signupUsername.trim() || !signupPassword.trim() || !signupDob.trim() || !signupGender.trim()) {
      setLoginError('કૃપા કરીને બધી વિગતો ભરો જેમાં જીમેઇલ આઇડી પણ સામેલ છે. (Please fill in all details, including Gmail address.)');
      return;
    }
    if (signupMobile.trim().length !== 10 || !/^\d+$/.test(signupMobile.trim())) {
      setLoginError('કૃપા કરીને સાચો ૧૦ આંકડાનો મોબાઇલ નંબર લખો. (Please enter a valid 10-digit mobile number.)');
      return;
    }
    if (!signupEmail.trim().includes('@') || !signupEmail.trim().includes('.')) {
      setLoginError('કૃપા કરીને સાચું જીમેઇલ આઇડી લખો. (Please enter a valid Gmail address.)');
      return;
    }

    // Password policy validation: Capital, Small, Special, Number, Min 6, Max 10 digits
    const hasCapital = /[A-Z]/.test(signupPassword);
    const hasSmall = /[a-z]/.test(signupPassword);
    const hasNumber = /[0-9]/.test(signupPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword);
    const isLengthValid = signupPassword.length >= 6 && signupPassword.length <= 10;

    if (!isLengthValid) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડ ૬ થી ૧૦ અક્ષરોનો હોવો જોઈએ. (Password must be 6 to 10 characters long.)' 
        : 'Password must be 6 to 10 characters long (6 to 10 characters).');
      return;
    }
    if (!hasCapital) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક કેપિટલ અક્ષર (A-Z) હોવો જોઈએ. (Password must contain at least one uppercase letter.)' 
        : 'Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!hasSmall) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક સ્મોલ અક્ષર (a-z) હોવો જોઈએ. (Password must contain at least one lowercase letter.)' 
        : 'Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!hasNumber) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક આંકડો (૦-૯) હોવો જોઈએ. (Password must contain at least one number.)' 
        : 'Password must contain at least one number (0-9).');
      return;
    }
    if (!hasSpecial) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક સ્પેશિયલ કેરેક્ટર (!@#$%^&*) હોવો જોઈએ. (Password must contain at least one special character.)' 
        : 'Password must contain at least one special character (e.g. !@#$%^&*).');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    setSignUpSuccessMessage(null);
    try {
      await signUpCustomUser(signupName, signupMobile, signupUsername, signupPassword, signupDob, signupGender, signupEmail);
      
      // Save registration username for automatic login population
      setLoginUsername(signupUsername);
      setLoginPassword('');
      
      // Reset registration fields
      setSignupName('');
      setSignupMobile('');
      setSignupEmail('');
      setSignupDob('');
      setSignupGender('');
      setSignupUsername('');
      setSignupPassword('');
      
      setSignUpSuccessMessage('તમારું એકાઉન્ટ સફળતાપૂર્વક બની ગયું છે! કૃપા કરીને નીચે તમારો પાસવર્ડ લખીને લોગિન કરો. (Your account has been registered successfully! Please enter your password below to log in.)');
      setAuthMode('LOGIN');
    } catch (err: any) {
      setLoginError(err.message || 'નવું એકાઉન્ટ બનાવવામાં ભૂલ આવી છે. (Account registration failed.)');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Verify details for changing password on login screen
  const handleVerifyPasswordChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!changePasswordUsername.trim() || !changePasswordMobile.trim() || !changePasswordEmail.trim() || !changePasswordDob.trim() || !changePasswordCurrent.trim()) {
      setLoginError(language === 'gu' ? 'કૃપા કરીને બધી વિગતો દાખલ કરો. (Please fill in all details.)' : 'Please fill in all details.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const cleanUser = changePasswordUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const userData = await getCustomUserByUsername(cleanUser);
      if (!userData) {
        throw new Error(language === 'gu' ? 'યુઝરનેમ અસ્તિત્વમાં નથી. (Username does not exist.)' : 'Username does not exist.');
      }

      if (
        userData.mobile !== changePasswordMobile.trim() ||
        userData.email !== changePasswordEmail.trim() ||
        userData.dob !== changePasswordDob.trim() ||
        userData.password !== changePasswordCurrent.trim()
      ) {
        throw new Error(language === 'gu' ? 'દાખલ કરેલ વિગતો પ્રોફાઇલ સાથે મેળ ખાતી નથી અથવા વર્તમાન પાસવર્ડ ખોટો છે. (The details entered do not match your profile or current password is incorrect.)' : 'The details entered do not match your profile or current password is incorrect.');
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      setChangePasswordOtp(otpCode);
      setChangePasswordOtpNotification(`[DAY INFOTECH] આપની પાસવર્ડ બદલવાની વિનંતી માટેનો OTP ${otpCode} છે. કોઈની પણ સાથે શેર કરશો નહીં.`);
      setChangePasswordStep('OTP');
    } catch (err: any) {
      setLoginError(err.message || 'માહિતી ચકાસવામાં ભૂલ આવી. (Failed to verify details.)');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyPasswordChangeOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (enteredChangePasswordOtp.trim() !== changePasswordOtp) {
      setLoginError(language === 'gu' ? 'ખોટો OTP! કૃપા કરીને સાચો OTP લખો. (Incorrect OTP!)' : 'Incorrect OTP! Please try again.');
      return;
    }
    setChangePasswordStep('NEW');
    setChangePasswordOtpNotification(null);
  };

  const handlePasswordChangeOnLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (changePasswordNew !== changePasswordConfirm) {
      setLoginError(language === 'gu' ? 'નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી! (Passwords do not match!)' : 'New password and confirm password do not match!');
      return;
    }

    // Password policy validation: Capital, Small, Special, Number, Min 6, Max 10 digits
    const hasCapital = /[A-Z]/.test(changePasswordNew);
    const hasSmall = /[a-z]/.test(changePasswordNew);
    const hasNumber = /[0-9]/.test(changePasswordNew);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(changePasswordNew);
    const isLengthValid = changePasswordNew.length >= 6 && changePasswordNew.length <= 10;

    if (!isLengthValid) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડ ૬ થી ૧૦ અક્ષરોનો હોવો જોઈએ. (Password must be 6 to 10 characters long.)' 
        : 'Password must be 6 to 10 characters long.');
      return;
    }
    if (!hasCapital) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક કેપિટલ અક્ષર (A-Z) હોવો જોઈએ. (Password must contain at least one uppercase letter.)' 
        : 'Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!hasSmall) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક સ્મોલ અક્ષર (a-z) હોવો જોઈએ. (Password must contain at least one lowercase letter.)' 
        : 'Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!hasNumber) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક આંકડો (૦-૯) હોવો જોઈએ. (Password must contain at least one number.)' 
        : 'Password must contain at least one number (0-9).');
      return;
    }
    if (!hasSpecial) {
      setLoginError(language === 'gu' 
        ? 'પાસવર્ડમાં ઓછામાં ઓછો એક સ્પેશિયલ કેરેક્ટર (!@#$%^&*) હોવો જોઈએ. (Password must contain at least one special character.)' 
        : 'Password must contain at least one special character (e.g. !@#$%^&*).');
      return;
    }

    setIsChangingPassword(true);
    try {
      const cleanUser = changePasswordUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      await changeCustomPassword(cleanUser, changePasswordCurrent, changePasswordNew);
      
      setSignUpSuccessMessage(language === 'gu' ? 'પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે! હવે લોગિન કરો. (Password changed successfully!)' : 'Password has been changed successfully! Please log in.');
      setLoginUsername(cleanUser);
      setLoginPassword(changePasswordNew);
      setAuthMode('LOGIN');
      
      // Reset states
      setChangePasswordUsername('');
      setChangePasswordMobile('');
      setChangePasswordEmail('');
      setChangePasswordDob('');
      setChangePasswordCurrent('');
      setChangePasswordNew('');
      setChangePasswordConfirm('');
      setChangePasswordStep('VERIFY');
      setChangePasswordOtp('');
      setEnteredChangePasswordOtp('');
    } catch (err: any) {
      setLoginError(err.message || 'પાસવર્ડ બદલવામાં ભૂલ આવી. (Failed to change password.)');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Verify details for changing username on login screen
  const handleVerifyUsernameChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!changeUsernameOld.trim() || !changeUsernameMobile.trim() || !changeUsernameEmail.trim() || !changeUsernameDob.trim()) {
      setLoginError(language === 'gu' ? 'કૃપા કરીને બધી વિગતો દાખલ કરો. (Please fill in all details.)' : 'Please fill in all details.');
      return;
    }

    setIsChangingUsername(true);
    try {
      const cleanOldUser = changeUsernameOld.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const userData = await getCustomUserByUsername(cleanOldUser);
      if (!userData) {
        throw new Error(language === 'gu' ? 'હાલનું યુઝરનેમ અસ્તિત્વમાં નથી. (Current username does not exist.)' : 'Current username does not exist.');
      }

      if (
        userData.mobile !== changeUsernameMobile.trim() ||
        userData.email !== changeUsernameEmail.trim() ||
        userData.dob !== changeUsernameDob.trim()
      ) {
        throw new Error(language === 'gu' ? 'દાખલ કરેલ વિગતો પ્રોફાઇલ સાથે મેળ ખાતી નથી. (The details entered do not match your profile.)' : 'The details entered do not match your profile.');
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      setChangeUsernameOtp(otpCode);
      setChangeUsernameOtpNotification(`[DAY INFOTECH] આપનું યુઝરનેમ બદલવાની વિનંતી માટેનો OTP ${otpCode} છે. કોઈની પણ સાથે શેર કરશો નહીં.`);
      setChangeUsernameStep('OTP');
    } catch (err: any) {
      setLoginError(err.message || 'માહિતી ચકાસવામાં ભૂલ આવી. (Failed to verify details.)');
    } finally {
      setIsChangingUsername(false);
    }
  };

  const handleVerifyUsernameChangeOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (enteredChangeUsernameOtp.trim() !== changeUsernameOtp) {
      setLoginError(language === 'gu' ? 'ખોટો OTP! કૃપા કરીને સાચો OTP લખો. (Incorrect OTP!)' : 'Incorrect OTP! Please try again.');
      return;
    }
    setChangeUsernameStep('NEW');
    setChangeUsernameOtpNotification(null);
  };

  const handleUsernameChangeOnLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanNewUsername = changeUsernameNew.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanNewUsername) {
      setLoginError(language === 'gu' ? 'કૃપા કરીને સાચું નવું યુઝરનેમ લખો. (Please enter a valid new username.)' : 'Please enter a valid new username.');
      return;
    }

    setIsChangingUsername(true);
    try {
      const cleanOldUser = changeUsernameOld.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      await changeCustomUsername(cleanOldUser, cleanNewUsername);
      
      setSignUpSuccessMessage(language === 'gu' ? `યુઝરનેમ સફળતાપૂર્વક બદલીને "${cleanNewUsername}" કરવામાં આવ્યું છે! હવે લોગિન કરો. (Username changed successfully!)` : `Username has been changed successfully to "${cleanNewUsername}"! Please log in.`);
      setLoginUsername(cleanNewUsername);
      setLoginPassword('');
      setAuthMode('LOGIN');

      // Reset states
      setChangeUsernameOld('');
      setChangeUsernameMobile('');
      setChangeUsernameEmail('');
      setChangeUsernameDob('');
      setChangeUsernameNew('');
      setChangeUsernameStep('VERIFY');
      setChangeUsernameOtp('');
      setEnteredChangeUsernameOtp('');
    } catch (err: any) {
      setLoginError(err.message || 'યુઝરનેમ બદલવામાં ભૂલ આવી. (Failed to change username.)');
    } finally {
      setIsChangingUsername(false);
    }
  };

  const handleEdit = (entry: ApplicationEntry) => {
    setEditingEntry(entry);
    setActiveFormType(entry.formType);
    setActiveView('FORM');
  };

  const handleAddNew = (formType: FormType) => {
    setEditingEntry(null);
    setActiveFormType(formType);
    setActiveView('FORM');
  };

  const handleFormSuccess = () => {
    setEditingEntry(null);
    setActiveFormType(null);
    setActiveView('TRACKER');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setEditingEntry(null);
    setActiveFormType(null);
    setActiveView('TRACKER');
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotMobile.trim()) {
      setLoginError('કૃપા કરીને મોબાઇલ નંબર દાખલ કરો. (Please enter your mobile number.)');
      return;
    }
    if (forgotMobile.trim().length !== 10 || !/^\d+$/.test(forgotMobile.trim())) {
      setLoginError('કૃપા કરીને સાચો ૧૦ આંકડાનો મોબાઇલ નંબર લખો. (Please enter a valid 10-digit mobile number.)');
      return;
    }
    if (!forgotDob.trim()) {
      setLoginError('કૃપા કરીને જન્મ તારીખ દાખલ કરો. (Please enter your date of birth.)');
      return;
    }
    setIsSendingForgotRequest(true);
    setLoginError(null);
    try {
      const accounts = await getAccountsByMobileAndDob(forgotMobile.trim(), forgotDob.trim());
      if (accounts.length === 0) {
        setLoginError('આ મોબાઇલ નંબર અને જન્મ તારીખ સાથે કોઈ મેળ ખાતું એકાઉન્ટ મળ્યું નથી. (No matching account found with this mobile number and date of birth.)');
        setIsSendingForgotRequest(false);
        return;
      }
      
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      setRecoveryOtp(otpCode);
      setRecoveredAccounts(accounts);
      setOtpSmsNotification(`[DAY INFOTECH] આપની એકાઉન્ટ રિકવરી માટેનો OTP ${otpCode} છે. કોઈની પણ સાથે શેર કરશો નહીં.`);
      setForgotStep('OTP');
    } catch (err: any) {
      setLoginError(err.message || 'માહિતી લોડ કરવામાં ભૂલ આવી છે. (Failed to load account information.)');
    } finally {
      setIsSendingForgotRequest(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (userEnteredOtp.trim() === recoveryOtp) {
      setForgotStep('SHOW_CREDENTIALS');
      setOtpSmsNotification(null);
    } else {
      setLoginError('ખોટો OTP દાખલ કર્યો છે. કૃપા કરીને સાચો OTP લખો. (Incorrect OTP. Please enter the correct OTP.)');
    }
  };

  if (showSplash) {
    return (
      <AnimatePresence mode="wait">
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  if (currentUser && isMaintenanceMode && !isOwner()) {
    return <MaintenanceView theme={activeTheme} onLogout={handleLogout} />;
  }

  if (!currentUser) {
    return (
      <>
        {otpSmsNotification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-100 max-w-sm w-full mx-auto px-4"
          >
            <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 leading-snug">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shrink-0">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-widest text-indigo-400 uppercase">💬 SMS RECEIVER</span>
                  <span className="text-[9px] text-slate-400 font-mono">LIVE SIMULATOR</span>
                </div>
                <p className="text-xs font-black text-slate-100 mt-1">{otpSmsNotification}</p>
              </div>
              <button 
                onClick={() => setOtpSmsNotification(null)}
                className="text-slate-400 hover:text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
        <div className={`${activeTheme.bgClass} min-h-screen flex flex-col px-0 md:px-8 relative z-10 pb-safe pt-safe`} style={activeTheme.bgStyle}>
        <div className="max-w-4xl mx-auto w-full space-y-0 md:space-y-8 min-h-screen-safe flex flex-col justify-center py-2 md:py-8 px-2 md:px-0">
          
          {/* Admin Greetings Banner (GIF Style Flashing) */}
          {isGreetingsActive && greetingsMsg && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-4 animate-rainbow-border-flash rounded-2xl md:rounded-3xl p-3 md:p-6 text-center select-none"
            >
              <h2 className="text-xl md:text-3xl font-black tracking-tight animate-rainbow-flash font-sans leading-tight whitespace-pre-wrap">
                {greetingsMsg}
              </h2>
            </motion.div>
          )}

          {/* Main Logo & Brand Card */}
          <div className={`hidden md:block ${activeTheme.cardBg} p-4 rounded-3xl border ${activeTheme.cardBorder} shadow-md text-center space-y-3`}>
            <Logo size={120} showText={false} />
            <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5">
              <p className="text-slate-800 font-extrabold text-sm leading-normal">
                {t("Digital Service Point & Online Form Assistant", "ડિજિટલ સર્વિસ સેન્ટર અને ઓનલાઇન ફોર્મ સહાયક")}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 px-3 py-1 rounded-full border bg-slate-900/40 border-slate-700/50 text-slate-100">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-bold tracking-wide">{t(`Visitors: ${visitorCount}`, `મુલાકાતીઓ (Visitors): ${visitorCount}`)}</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl shadow-xs w-fit mt-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('gu')}
                  className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all cursor-pointer ${
                    language === 'gu'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  ગુજરાતી
                </button>
              </div>
            </div>
          </div>

          {/* Login Gate Action Card */}
          <div className={`${activeTheme.cardBg} rounded-2xl md:rounded-3xl border ${activeTheme.cardBorder} shadow-md overflow-hidden`}>
            
            <div className="p-3 sm:p-6 md:p-8 space-y-3 md:space-y-6">
              
              {/* Mobile-only Compact Header */}
              <div className="md:hidden flex flex-col items-center text-center space-y-1 pb-2 border-b border-slate-100/60">
                <Logo size={70} showText={false} className="mx-auto" />
                <p className="text-slate-850 font-black text-[11px] leading-tight px-1 max-w-[280px]">
                  {t("Digital Service Point & Online Form Assistant", "ડિજિટલ સર્વિસ સેન્ટર અને ઓનલાઇન ફોર્મ સહાયક")}
                </p>
                <div className="flex items-center justify-between w-full pt-1">
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/60 p-0.5 rounded-lg">
                    <button 
                      type="button" 
                      onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
                      className="text-[9px] font-black text-indigo-600 hover:text-indigo-850 px-1.5 py-0.5 transition-all"
                    >
                      {language === 'en' ? 'ગુજરાતી' : 'English'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 font-mono">
                    <Users className="h-3 w-3 text-emerald-500" />
                    <span>V: {visitorCount}</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <h2 className="text-lg md:text-xl font-black text-slate-950 font-sans tracking-wide uppercase">
                  {authMode === 'LOGIN' 
                    ? (language === 'gu' ? 'પોતાના એકાઉન્ટમાં લોગિન કરો' : 'Log In to Your Account') 
                    : authMode === 'SIGNUP'
                    ? (language === 'gu' ? 'નવું એકાઉન્ટ બનાવો' : 'Create New Account')
                    : authMode === 'OFFLINE_FORMS'
                    ? (language === 'gu' ? 'ઓફલાઇન પીડીએફ ફોર્મ્સ' : 'Offline PDF Forms')
                    : authMode === 'ADMIN'
                    ? (language === 'gu' ? 'એડમિન લોગિન કરો' : 'Admin Login')
                    : authMode === 'ADMIN_FORGOT'
                    ? (language === 'gu' ? 'એડમિન પાસવર્ડ રીસેટ' : 'Admin Password Reset')
                    : (language === 'gu' ? 'પાસવર્ડ ભૂલી ગયા છો?' : 'Forgot Password?')}
                </h2>
                <p className="text-xs md:text-sm text-slate-850 leading-relaxed font-extrabold max-w-md mx-auto">
                  {authMode === 'LOGIN'
                    ? t('enter_details', 'auth')
                    : authMode === 'SIGNUP'
                    ? t('signup_subtitle', 'auth')
                    : authMode === 'OFFLINE_FORMS'
                    ? (language === 'gu' ? 'વિવિધ સરકારી અને બિન-સરકારી ફોર્મ અહીંથી સીધા ડાઉનલોડ કરો.' : 'Download various government and non-government forms directly.')
                    : authMode === 'ADMIN'
                    ? (language === 'gu' ? 'એડમિન યુઝરનેમ અને પાસવર્ડ વડે લોગિન કરો.' : 'Enter your admin credentials to log in.')
                    : authMode === 'ADMIN_FORGOT'
                    ? t('admin_forgot_subtitle', 'auth')
                    : t('forgot_subtitle', 'auth')}
                </p>
              </div>

              {loginError && (
                <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold p-3.5 rounded-xl leading-relaxed">
                  {loginError}
                </div>
              )}

              {signUpSuccessMessage && (
                <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-xl leading-relaxed">
                  {signUpSuccessMessage}
                </div>
              )}

              {/* Login/Signup Custom Forms */}
              <AnimatePresence mode="wait">
                {authMode === 'LOGIN' ? (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleCustomLogin}
                    className="space-y-4"
                  >
                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'યુઝરનેમ' : 'Username'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={e => setLoginUsername(e.target.value)}
                          placeholder={language === 'gu' ? 'તમારું યુઝરનેમ લખો' : 'Enter Username'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                          {language === 'gu' ? 'પાસવર્ડ' : 'Password'}
                        </label>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('FORGOT'); setLoginError(null); }}
                          className="text-xs font-black text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        >
                          {language === 'gu' ? 'પાસવર્ડ ભૂલી ગયા છો?' : 'Forgot Password?'}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder={language === 'gu' ? 'તમારો પાસવર્ડ લખો' : 'Enter Password'}
                          className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm rounded-xl border border-indigo-500/20 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{isLoggingIn ? (language === 'gu' ? 'કનેક્ટ થઈ રહ્યું છે...' : 'Connecting...') : (language === 'gu' ? 'સુરક્ષિત લૉગ ઇન કરો' : 'Secure Sign In')}</span>
                    </button>

                    <div className="text-center pt-4 border-t border-slate-100 space-y-3.5 font-sans">
                      <div>
                        <span className="text-xs text-slate-500 font-extrabold">
                          {language === 'gu' ? 'એકાઉન્ટ નથી?: ' : "Don't have an account?: "}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('SIGNUP');
                            setLoginError(null);
                            setSignUpSuccessMessage(null);
                          }}
                          className="text-xs font-black text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                        >
                          {language === 'gu' ? 'નવું રજીસ્ટ્રેશન કરો' : 'Register Now (Sign Up)'}
                        </button>
                      </div>

                      <div className="flex justify-center gap-4 text-xs font-black">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('CHANGE_PASSWORD');
                            setLoginError(null);
                            setSignUpSuccessMessage(null);
                            setChangePasswordStep('VERIFY');
                          }}
                          className="text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Key className="h-3 w-3" />
                          <span>{language === 'gu' ? 'પાસવર્ડ બદલો' : 'Change Password'}</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('CHANGE_USERNAME');
                            setLoginError(null);
                            setSignUpSuccessMessage(null);
                            setChangeUsernameStep('VERIFY');
                          }}
                          className="text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <User className="h-3 w-3" />
                          <span>{language === 'gu' ? 'યુઝરનેમ બદલો' : 'Change Username'}</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-xs font-extrabold">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('OFFLINE_FORMS');
                            setLoginError(null);
                            setSignUpSuccessMessage(null);
                          }}
                          className="text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <FileDown className="h-4 w-4 text-slate-400 hover:text-indigo-600" />
                          <span>{language === 'gu' ? 'ઓફલાઇન ફોર્મ્સ' : 'Offline Forms'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('ADMIN');
                            setLoginError(null);
                            setSignUpSuccessMessage(null);
                          }}
                          className="text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <Shield className="h-4 w-4 text-slate-400 hover:text-indigo-600" />
                          <span>{language === 'gu' ? 'એડમિન લૉગઇન' : 'Admin Login'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.form>
                ) : authMode === 'SIGNUP' ? (
                  <motion.form
                    key="signup-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleCustomSignup}
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'પૂરું નામ (આધાર કાર્ડ મુજબ)' : 'Full Name (As per Aadhar)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={e => setSignupName(e.target.value)}
                          placeholder={language === 'gu' ? 'તમારું પૂરું નામ લખો' : 'Enter your full name'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'મોબાઇલ નંબર' : 'Mobile Number'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={signupMobile}
                          onChange={e => setSignupMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder={language === 'gu' ? '૧૦ અંકનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Gmail / Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'ઇમેઇલ સરનામું' : 'Email Address'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <FileText className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={e => setSignupEmail(e.target.value)}
                          placeholder={language === 'gu' ? 'તમારું ઇમેઇલ સરનામું લખો' : 'Enter email address'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'જન્મ તારીખ' : 'Date of Birth'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-sans">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <input
                          type="date"
                          required
                          value={signupDob}
                          onChange={e => setSignupDob(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'જાતિ' : 'Gender'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Users className="h-4 w-4" />
                        </span>
                        <select
                          required
                          value={signupGender}
                          onChange={e => setSignupGender(e.target.value)}
                          className="w-full pl-10 pr-4.5 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>{language === 'gu' ? 'જાતિ પસંદ કરો' : 'Select Gender'}</option>
                          <option value="MALE">{language === 'gu' ? 'પુરુષ' : 'Male'}</option>
                          <option value="FEMALE">{language === 'gu' ? 'સ્ત્રી' : 'Female'}</option>
                          <option value="OTHER">{language === 'gu' ? 'અન્ય' : 'Other'}</option>
                        </select>
                        <span className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[8px]">▼</span>
                      </div>
                    </div>

                    {/* Set Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'યુઝરનેમ સેટ કરો' : 'Choose Username'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <UserPlus className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={signupUsername}
                          onChange={e => setSignupUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                          placeholder={language === 'gu' ? 'એક અનન્ય યુઝરનેમ પસંદ કરો' : 'Choose a unique username'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Set Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'સુરક્ષિત પાસવર્ડ બનાવો' : 'Choose Secure Password'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={e => setSignupPassword(e.target.value)}
                          placeholder={language === 'gu' ? 'એક સુરક્ષિત પાસવર્ડ બનાવો' : 'Choose a secure password'}
                          className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Live requirements checklist */}
                      <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] leading-relaxed space-y-1 font-sans">
                        <div className="font-extrabold text-slate-700 mb-1">
                          {language === 'gu' ? 'પાસવર્ડની શરતો:' : 'Password Requirements:'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${signupPassword.length >= 6 && signupPassword.length <= 10 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={signupPassword.length >= 6 && signupPassword.length <= 10 ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                            {language === 'gu' ? '૬ થી ૧૦ અક્ષરો (6 to 10 characters)' : '6 to 10 characters'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(signupPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[A-Z]/.test(signupPassword) ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                            {language === 'gu' ? 'ઓછામાં ઓછો એક કેપિટલ અક્ષર (A-Z)' : 'At least one uppercase letter (A-Z)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(signupPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[a-z]/.test(signupPassword) ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                            {language === 'gu' ? 'ઓછામાં ઓછો એક સ્મોલ અક્ષર (a-z)' : 'At least one lowercase letter (a-z)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(signupPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[0-9]/.test(signupPassword) ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                            {language === 'gu' ? 'ઓછામાં ઓછો એક આંકડો (0-9)' : 'At least one number (0-9)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword) ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                            {language === 'gu' ? 'ઓછામાં ઓછો એક સ્પેશિયલ કેરેક્ટર (!@#$%^&*)' : 'At least one special character (!@#$%^&*)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl border border-emerald-500/20 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>{isLoggingIn ? (language === 'gu' ? 'એકાઉન્ટ બની રહ્યું છે...' : 'Registering...') : (language === 'gu' ? 'એકાઉન્ટ બનાવો' : 'Register Account')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setLoginError(null);
                        setSignUpSuccessMessage(null);
                      }}
                      className="w-full text-center py-2.5 text-xs font-black text-slate-650 hover:text-slate-800 cursor-pointer border border-slate-200 hover:bg-slate-50 rounded-xl transition-all mt-2.5"
                    >
                      {language === 'gu' ? '← પાછા લોગિન પર જાઓ' : '← Back to Log In'}
                    </button>
                  </motion.form>
                ) : authMode === 'ADMIN' ? (
                  <motion.form
                    key="admin-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleCustomLogin}
                    className="space-y-4"
                  >
                    {/* Admin Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                        {language === 'gu' ? 'એડમિન યુઝરનેમ' : 'Admin Username'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={e => setLoginUsername(e.target.value)}
                          placeholder={language === 'gu' ? 'એડમિન યુઝરનેમ લખો' : 'Enter Admin Username'}
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Admin Password */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                          {language === 'gu' ? 'એડમિન પાસવર્ડ' : 'Admin Password'}
                        </label>
                        <button
                          type="button"
                          onClick={() => { 
                            setAuthMode('ADMIN_FORGOT'); 
                            setLoginError(null); 
                            setIsAdminVerified(false);
                            setAdminResetSuccessMessage(null);
                          }}
                          className="text-xs font-black text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        >
                          {language === 'gu' ? 'પાસવર્ડ ભૂલી ગયા છો?' : 'Forgot Password?'}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showAdminPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder={language === 'gu' ? 'એડમિન પાસવર્ડ લખો' : 'Enter Admin Password'}
                          className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm rounded-xl border border-indigo-500/20 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>{isLoggingIn ? (language === 'gu' ? 'લૉગઇન થઈ રહ્યું છે...' : 'Logging In...') : (language === 'gu' ? 'એડમિન તરીકે લોગિન કરો' : 'Admin Sign In')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setLoginError(null);
                        setSignUpSuccessMessage(null);
                      }}
                      className="w-full text-center py-2.5 text-xs font-black text-slate-650 hover:text-slate-800 cursor-pointer border border-slate-200 hover:bg-slate-50 rounded-xl transition-all mt-2.5"
                    >
                      {language === 'gu' ? '← પાછા લોગિન પર જાઓ' : '← Back to Login'}
                    </button>
                  </motion.form>
                ) : authMode === 'ADMIN_FORGOT' ? (
                  <motion.form
                    key="admin-forgot-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={isAdminVerified ? handleAdminPasswordResetSubmit : handleAdminVerification}
                    className="space-y-4 font-sans"
                  >
                    {adminResetSuccessMessage ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black p-4 rounded-xl leading-relaxed space-y-3">
                        <p>{adminResetSuccessMessage}</p>
                        <button
                          type="button"
                          onClick={() => { 
                            setAuthMode('ADMIN'); 
                            setAdminResetSuccessMessage(null); 
                            setIsAdminVerified(false);
                            setLoginUsername('');
                            setLoginPassword('');
                          }}
                          className="text-xs font-black underline text-emerald-950 hover:text-emerald-900 block cursor-pointer"
                        >
                          {language === 'gu' ? 'પાછા એડમિન લોગિન સ્ક્રીન પર જાઓ' : 'Go to Admin Log In'}
                        </button>
                      </div>
                    ) : !isAdminVerified ? (
                      <>
                        {/* Birth Date */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'જન્મ તારીખ' : 'Birth Date'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={adminForgotDob}
                              onChange={e => setAdminForgotDob(e.target.value)}
                              placeholder={language === 'gu' ? 'જન્મ તારીખ લખો (દા.ત. 09-04-1996)' : 'Enter Birth Date (e.g. 09-04-1996)'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Aadhar Card */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'આધાર કાર્ડ નંબર' : 'Aadhar Card Number'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <FileText className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              maxLength={12}
                              value={adminForgotAadhar}
                              onChange={e => setAdminForgotAadhar(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૧૨ આંકડાનો આધાર કાર્ડ નંબર લખો' : 'Enter 12-digit Aadhar Number'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'ઇમેઇલ સરનામું' : 'Email Address'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Users className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              required
                              value={adminForgotEmail}
                              onChange={e => setAdminForgotEmail(e.target.value)}
                              placeholder={language === 'gu' ? 'તમારો જીમેઇલ લખો' : 'Enter Gmail Address'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'મોબાઇલ નંબર' : 'Mobile Number'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Phone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={adminForgotMobile}
                              onChange={e => setAdminForgotMobile(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૧૦ અંકનો મોબાઇલ નંબર લખો' : 'Enter 10-digit Mobile Number'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm rounded-xl border border-indigo-500/20 shadow-md transition-all cursor-pointer"
                          >
                            <Shield className="h-4 w-4" />
                            <span>{language === 'gu' ? 'માહિતી ચકાસો' : 'Verify Identity'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setAuthMode('ADMIN'); setLoginError(null); }}
                            className="w-full text-center py-2 text-sm font-black text-slate-650 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? 'રદ કરો' : 'Cancel'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* New Password Reset section */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'નવો એડમિન પાસવર્ડ સેટ કરો' : 'Set New Admin Password'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Lock className="h-4 w-4" />
                            </span>
                            <input
                              type={showAdminResetPassword ? 'text' : 'password'}
                              required
                              value={adminNewPassword}
                              onChange={e => setAdminNewPassword(e.target.value)}
                              placeholder={language === 'gu' ? 'નવો એડમિન પાસવર્ડ લખો' : 'Enter new admin password'}
                              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminResetPassword(!showAdminResetPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              {showAdminResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isAdminResetting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl border border-emerald-500/20 shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            <span>{isAdminResetting ? (language === 'gu' ? 'બદલાઈ રહ્યો છે...' : 'Resetting...') : (language === 'gu' ? 'પાસવર્ડ સફળતાપૂર્વક બદલો' : 'Save New Password')}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setIsAdminVerified(false); setLoginError(null); }}
                            className="w-full text-center py-2 text-sm font-black text-slate-650 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.form>
                ) : authMode === 'OFFLINE_FORMS' ? (
                  <motion.div
                    key="offline-forms-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setLoginError(null);
                        setSignUpSuccessMessage(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-750 cursor-pointer hover:underline mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{language === 'gu' ? 'પાછા લોગિન સ્ક્રીન પર જાઓ' : 'Back to Login'}</span>
                    </button>
                    <OfflineFormsView forms={offlineForms} theme={activeTheme} />
                  </motion.div>
                ) : authMode === 'CHANGE_PASSWORD' ? (
                  <motion.div
                    key="change-password-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setLoginError(null);
                        setSignUpSuccessMessage(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-755 cursor-pointer hover:underline mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{language === 'gu' ? 'પાછા લોગિન સ્ક્રીન પર જાઓ' : 'Back to Login'}</span>
                    </button>

                    <h3 className="text-sm font-black text-slate-800 border-b pb-2 mb-4">
                      {language === 'gu' ? '🔒 પાસવર્ડ બદલો (Change Password)' : '🔒 Change Password'}
                    </h3>

                    {changePasswordStep === 'VERIFY' && (
                      <form onSubmit={handleVerifyPasswordChangeRequest} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'યુઝરનેમ' : 'Username'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={changePasswordUsername}
                              onChange={e => setChangePasswordUsername(e.target.value)}
                              placeholder={language === 'gu' ? 'તમારું યુઝરનેમ લખો' : 'Enter Username'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'મોબાઇલ નંબર' : 'Mobile Number'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Phone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={changePasswordMobile}
                              onChange={e => setChangePasswordMobile(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૧૦ અંકનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'ઇમેઇલ સરનામું' : 'Email Address'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Mail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              required
                              value={changePasswordEmail}
                              onChange={e => setChangePasswordEmail(e.target.value)}
                              placeholder={language === 'gu' ? 'તમારો જીમેઇલ લખો' : 'Enter Gmail Address'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'જન્મ તારીખ' : 'Birth Date'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <input
                              type="date"
                              required
                              value={changePasswordDob}
                              onChange={e => setChangePasswordDob(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Current Password */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'વર્તમાન પાસવર્ડ' : 'Current Password'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Lock className="h-4 w-4" />
                            </span>
                            <input
                              type={showChangePasswordCurrent ? 'text' : 'password'}
                              required
                              value={changePasswordCurrent}
                              onChange={e => setChangePasswordCurrent(e.target.value)}
                              placeholder={language === 'gu' ? 'વર્તમાન પાસવર્ડ લખો' : 'Enter Current Password'}
                              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowChangePasswordCurrent(!showChangePasswordCurrent)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              {showChangePasswordCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <span>{isChangingPassword ? (language === 'gu' ? 'ચકાસણી ચાલુ છે...' : 'Verifying...') : (language === 'gu' ? 'વિગતો ચકાસો અને ઓટીપી મેળવો' : 'Verify & Send OTP')}</span>
                        </button>
                      </form>
                    )}

                    {changePasswordStep === 'OTP' && (
                      <form onSubmit={handleVerifyPasswordChangeOtp} className="space-y-4">
                        {changePasswordOtpNotification && (
                          <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl leading-relaxed space-y-1">
                            <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">📩 OTP મોકલવામાં આવ્યો છે (OTP Sent)</p>
                            <p className="text-xs text-slate-700 font-bold">
                              {changePasswordOtpNotification}
                            </p>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'વન ટાઇમ પાસવર્ડ (OTP)' : 'Enter One Time Password (OTP)'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Key className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={enteredChangePasswordOtp}
                              onChange={e => setEnteredChangePasswordOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="XXXX"
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono tracking-widest text-center text-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            <span>{language === 'gu' ? 'ઓટીપી ચકાસો' : 'Verify OTP'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setChangePasswordStep('VERIFY');
                              setLoginError(null);
                            }}
                            className="w-full text-center py-2 text-sm font-black text-slate-600 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
                          </button>
                        </div>
                      </form>
                    )}

                    {changePasswordStep === 'NEW' && (
                      <form onSubmit={handlePasswordChangeOnLoginSubmit} className="space-y-4">
                        {/* New Password */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'નવો પાસવર્ડ' : 'New Password'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Lock className="h-4 w-4" />
                            </span>
                            <input
                              type={showChangePasswordNew ? 'text' : 'password'}
                              required
                              value={changePasswordNew}
                              onChange={e => setChangePasswordNew(e.target.value)}
                              placeholder={language === 'gu' ? '૬ થી ૧૦ અક્ષરનો પાસવર્ડ (કેપિટલ, સ્મોલ, નંબર, સ્પેશિયલ)' : '6-10 chars (Capital, Small, Number, Special)'}
                              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowChangePasswordNew(!showChangePasswordNew)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              {showChangePasswordNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'નવા પાસવર્ડની પુષ્ટિ કરો' : 'Confirm New Password'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Lock className="h-4 w-4" />
                            </span>
                            <input
                              type="password"
                              required
                              value={changePasswordConfirm}
                              onChange={e => setChangePasswordConfirm(e.target.value)}
                              placeholder={language === 'gu' ? 'નવો પાસવર્ડ ફરી લખો' : 'Re-enter New Password'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Password Policy Hint */}
                        <div className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-xl leading-relaxed space-y-1 font-sans">
                          <p className="font-extrabold text-slate-700">{language === 'gu' ? 'પાસવર્ડ પોલિસી (Password Policy):' : 'Password Policy:'}</p>
                          <p>• {language === 'gu' ? 'લંબાઈ ૬ થી ૧૦ અક્ષર વચ્ચે હોવી જોઈએ.' : 'Length must be between 6 and 10 characters.'}</p>
                          <p>• {language === 'gu' ? 'ઓછામાં ઓછો ૧ કેપિટલ અક્ષર (A-Z) હોવો જોઈએ.' : 'At least 1 Capital letter (A-Z).'}</p>
                          <p>• {language === 'gu' ? 'ઓછામાં ઓછો ૧ સ્મોલ અક્ષર (a-z) હોવો જોઈએ.' : 'At least 1 Small letter (a-z).'}</p>
                          <p>• {language === 'gu' ? 'ઓછામાં ઓછો ૧ નંબર (0-9) હોવો જોઈએ.' : 'At least 1 Number (0-9).'}</p>
                          <p>• {language === 'gu' ? 'ઓછામાં ઓછો ૧ સ્પેશિયલ કેરેક્ટર (!@#$%^&*) હોવો જોઈએ.' : 'At least 1 Special character (!@#$%^&*).'}</p>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <span>{isChangingPassword ? (language === 'gu' ? 'સેવ થઈ રહ્યું છે...' : 'Saving...') : (language === 'gu' ? 'પાસવર્ડ સફળતાપૂર્વક અપડેટ કરો' : 'Update Password Successfully')}</span>
                        </button>
                      </form>
                    )}
                  </motion.div>
                ) : authMode === 'CHANGE_USERNAME' ? (
                  <motion.div
                    key="change-username-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setLoginError(null);
                        setSignUpSuccessMessage(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-755 cursor-pointer hover:underline mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{language === 'gu' ? 'પાછા લોગિન સ્ક્રીન પર જાઓ' : 'Back to Login'}</span>
                    </button>

                    <h3 className="text-sm font-black text-slate-800 border-b pb-2 mb-4">
                      {language === 'gu' ? '👤 યુઝરનેમ બદલો (Change Username)' : '👤 Change Username'}
                    </h3>

                    {changeUsernameStep === 'VERIFY' && (
                      <form onSubmit={handleVerifyUsernameChangeRequest} className="space-y-4">
                        {/* Current Username */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'હાલનું યુઝરનેમ' : 'Current Username'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={changeUsernameOld}
                              onChange={e => setChangeUsernameOld(e.target.value)}
                              placeholder={language === 'gu' ? 'હાલનું યુઝરનેમ લખો' : 'Enter Current Username'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'મોબાઇલ નંબર' : 'Mobile Number'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Phone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={changeUsernameMobile}
                              onChange={e => setChangeUsernameMobile(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૧૦ અંકનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'ઇમેઇલ સરનામું' : 'Email Address'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Mail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              required
                              value={changeUsernameEmail}
                              onChange={e => setChangeUsernameEmail(e.target.value)}
                              placeholder={language === 'gu' ? 'તમારો જીમેઇલ લખો' : 'Enter Gmail Address'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'જન્મ તારીખ' : 'Birth Date'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <input
                              type="date"
                              required
                              value={changeUsernameDob}
                              onChange={e => setChangeUsernameDob(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingUsername}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <span>{isChangingUsername ? (language === 'gu' ? 'ચકાસણી ચાલુ છે...' : 'Verifying...') : (language === 'gu' ? 'વિગતો ચકાસો અને ઓટીપી મેળવો' : 'Verify & Send OTP')}</span>
                        </button>
                      </form>
                    )}

                    {changeUsernameStep === 'OTP' && (
                      <form onSubmit={handleVerifyUsernameChangeOtp} className="space-y-4">
                        {changeUsernameOtpNotification && (
                          <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl leading-relaxed space-y-1">
                            <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">📩 OTP મોકલવામાં આવ્યો છે (OTP Sent)</p>
                            <p className="text-xs text-slate-700 font-bold">
                              {changeUsernameOtpNotification}
                            </p>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'વન ટાઇમ પાસવર્ડ (OTP)' : 'Enter One Time Password (OTP)'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Key className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={enteredChangeUsernameOtp}
                              onChange={e => setEnteredChangeUsernameOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="XXXX"
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono tracking-widest text-center text-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            <span>{language === 'gu' ? 'ઓટીપી ચકાસો' : 'Verify OTP'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setChangeUsernameStep('VERIFY');
                              setLoginError(null);
                            }}
                            className="w-full text-center py-2 text-sm font-black text-slate-650 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
                          </button>
                        </div>
                      </form>
                    )}

                    {changeUsernameStep === 'NEW' && (
                      <form onSubmit={handleUsernameChangeOnLoginSubmit} className="space-y-4">
                        {/* New Username */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'નવું યુઝરનેમ' : 'New Username'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={changeUsernameNew}
                              onChange={e => setChangeUsernameNew(e.target.value)}
                              placeholder={language === 'gu' ? 'નવું યુઝરનેમ લખો' : 'Enter New Username'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingUsername}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <span>{isChangingUsername ? (language === 'gu' ? 'અપડેટ થઈ રહ્યું છે...' : 'Updating...') : (language === 'gu' ? 'યુઝરનેમ સફળતાપૂર્વક બદલો' : 'Update Username Successfully')}</span>
                        </button>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="forgot-step-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    {forgotStep === 'MOBILE' && (
                      <form onSubmit={handleForgotRequest} className="space-y-4">
                        {/* Registered Mobile Number */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'રજીસ્ટર્ડ મોબાઇલ નંબર' : 'Registered Mobile Number'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Phone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={forgotMobile}
                              onChange={e => setForgotMobile(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૧૦ અંકનો મોબાઇલ નંબર લખો' : 'Enter 10-digit mobile number'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'જન્મ તારીખ' : 'Date of Birth'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <input
                              type="date"
                              required
                              value={forgotDob}
                              onChange={e => setForgotDob(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="submit"
                            disabled={isSendingForgotRequest}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm rounded-xl border border-indigo-500/20 shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            <span>{isSendingForgotRequest ? (language === 'gu' ? 'વેરીફાઈ કરી રહ્યા છીએ...' : 'Verifying...') : (language === 'gu' ? 'OTP મેળવો' : 'Request OTP')}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setAuthMode('LOGIN'); setLoginError(null); setForgotMobile(''); setForgotDob(''); }}
                            className="w-full text-center py-2 text-sm font-black text-slate-650 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? 'રદ કરો' : 'Cancel'}
                          </button>
                        </div>
                      </form>
                    )}

                    {forgotStep === 'OTP' && (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl leading-relaxed space-y-1">
                          <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">📩 OTP મોકલવામાં આવ્યો છે (OTP Sent)</p>
                          <p className="text-xs text-slate-700 font-bold">
                            {language === 'gu' 
                              ? `અમે આપના મોબાઇલ નંબર ${forgotMobile} પર વેરિફિકેશન OTP મોકલ્યો છે.`
                              : `We have sent a verification OTP to your registered mobile number ${forgotMobile}.`}
                          </p>
                        </div>

                        {/* OTP Input */}
                        <div className="space-y-1.5">
                          <label className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide block">
                            {language === 'gu' ? 'વન ટાઇમ પાસવર્ડ (OTP)' : 'Enter One Time Password (OTP)'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                              <Key className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={userEnteredOtp}
                              onChange={e => setUserEnteredOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder={language === 'gu' ? '૪ આંકડાનો OTP લખો' : 'Enter 4-digit OTP'}
                              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-black text-slate-950 placeholder-slate-500 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-hidden transition-all font-mono tracking-widest text-center text-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl border border-emerald-500/20 shadow-md transition-all cursor-pointer"
                          >
                            <span>{language === 'gu' ? 'ઓટીપી ચકાસો' : 'Verify OTP'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { 
                              setForgotStep('MOBILE'); 
                              setLoginError(null); 
                              setUserEnteredOtp(''); 
                              setOtpSmsNotification(null);
                            }}
                            className="w-full text-center py-2 text-sm font-black text-slate-650 hover:text-slate-800 cursor-pointer"
                          >
                            {language === 'gu' ? '← પાછા જાઓ' : '← Go Back'}
                          </button>
                        </div>
                      </form>
                    )}

                    {forgotStep === 'SHOW_CREDENTIALS' && (
                      <div className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl leading-relaxed text-center">
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">🎉 વેરિફિકેશન સફળ (Verification Successful)</p>
                          <p className="text-xs text-slate-800 font-bold mt-1">
                            {language === 'gu'
                              ? 'નીચે દર્શાવેલ વિગતોનો ઉપયોગ કરીને લોગિન કરો:'
                              : 'Log in using the registered credentials displayed below:'}
                          </p>
                        </div>

                        {/* Accounts List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {recoveredAccounts.map((account, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
                              <span className="absolute top-2.5 right-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                ACCOUNT {index + 1}
                              </span>
                              
                              <div>
                                <span className="text-[9px] font-black text-slate-500 uppercase block">નામ (Name)</span>
                                <span className="text-xs font-black text-slate-800">{account.name}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-200/60">
                                <div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase block">યુઝરનેમ (Username)</span>
                                  <span className="text-xs font-mono font-black text-indigo-600">@{account.username}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase block">પાસવર્ડ (Password)</span>
                                  <span className="text-xs font-mono font-black text-slate-800">{account.password}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('LOGIN');
                            setForgotStep('MOBILE');
                            setForgotMobile('');
                            setUserEnteredOtp('');
                            setRecoveredAccounts([]);
                            setLoginError(null);
                          }}
                          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md text-center"
                        >
                          {language === 'gu' ? 'લોગિન સ્ક્રીન પર જાઓ' : 'Go to Login'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Direct WhatsApp Support */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[11px] text-slate-400 font-bold">
                  {language === 'gu' ? 'કોઈ પ્રશ્ન કે સમસ્યા હોય તો સીધો સંપર્ક કરો:' : 'Need help? Chat with us directly:'}
                </p>
                <a
                  href="https://wa.me/917600361873"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer w-full"
                >
                  <WhatsAppIcon />
                  <span>{language === 'gu' ? 'WhatsApp ચેટ કરો (7600361873)' : 'WhatsApp Chat (7600361873)'}</span>
                </a>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  100% સુરક્ષિત (100% Secure)
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  સરળ ઉપયોગ (Easy to Use)
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Simple Footer */}
        <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 font-sans space-y-1 mt-10 pb-6">
          <p>© 2026 DAY INFOTECH - Digital Point.</p>
          <p className="text-[9px] text-slate-500">
            તમામ વિગતો અને અપલોડ કરેલા દસ્તાવેજો ક્લાઉડ સ્ટોરેજ સાથે લિંક થાય છે.
          </p>
        </footer>
      </div>
      </>
    );
  }

  return (
    <>
      <div className={activeTheme.bgClass} style={activeTheme.bgStyle}>
      
      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/917600361873"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Support"
        className="no-print fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/20"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>

      {/* Regular Responsive Dashboard Layout */}
      <div className="w-full flex flex-col z-10 no-print font-sans relative">
        <div className="w-full max-w-full mx-auto flex-1 flex flex-col gap-1.5 md:gap-3 px-1 md:px-6 py-0.5 md:py-2">
          
          {/* Header */}
          <Header 
            refreshTrigger={refreshTrigger} 
            themeId={themeId} 
            setThemeId={setThemeId} 
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
            onLogout={handleLogout}
            activeView={activeView} 
            visitorCount={visitorCount}
            setActiveView={setActiveView}
          />

          {/* Main Views Container */}
          <main className="flex-1 min-h-0 px-2 md:px-0">
            <AnimatePresence mode="wait">
              {activeView === 'TRACKER' && (
                <motion.div
                  key="tracker"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <ApplicationTracker
                    onEdit={handleEdit}
                    onAddNew={handleAddNew}
                    refreshTrigger={refreshTrigger}
                    themeId={themeId}
                    activeTrackerTab={activeTrackerTab}
                  />
                </motion.div>
              )}

              {activeView === 'ABOUT' && (
                <AboutDayInfotech />
              )}

              {activeView === 'FORM' && activeFormType && (
                <motion.div
                  key={`form_${activeFormType}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <FormRenderer
                    formType={activeFormType}
                    editingEntry={editingEntry}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                  />
                </motion.div>
              )}

              {activeView === 'ONLINE_USERS' && isOwner() && (
                <motion.div
                  key="online_users"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <OnlineUsersView currentUser={currentUser} theme={activeTheme} onMessageUser={(user) => { setChatTargetUser(user); setActiveView("MESSAGES"); }} />
                </motion.div>
              )}

              {activeView === 'MESSAGES' && isOwner() && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <MessagesView currentUser={currentUser} theme={activeTheme} targetUser={chatTargetUser} />
                </motion.div>
              )}

              {activeView === 'OFFLINE_FORMS' && isOwner() && (
                <motion.div
                  key="offline_forms"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <OfflineFormsManager forms={offlineForms} theme={activeTheme} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="no-print border-t border-slate-200/50 pt-2 pb-1 text-center text-[10px] md:text-xs text-slate-400 font-sans space-y-0.5 md:space-y-1.5">
            <p className="font-extrabold tracking-wider uppercase text-slate-500 text-[9px] md:text-xs">
              POWERED BY DAY INFOTECH PORTAL ENGINE
            </p>
            <p className="hidden md:block">© 2026 DAY INFOTECH - ડિજિટલ પોઇન્ટ (Digital Point Gujarat Portal).</p>
            <p className="md:hidden">© 2026 DAY INFOTECH</p>
            <p className="text-[9px] md:text-[10px] text-slate-500 max-w-md mx-auto leading-normal">
              {language === 'gu' 
                ? 'અરજીઓ ફાયરસ્ટોર (Firestore) સાથે સુરક્ષિત રીતે સિંક થાય છે.'
                : 'Applications are securely synchronized with Google Cloud Firestore.'}
            </p>
          </footer>

        </div>
      </div>
      
      <PrivateChatWidget currentUser={currentUser} theme={activeTheme} />

    </div>
    </>
  );
}
