import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, FileText, CheckCircle, Clock, Edit3, Trash2, Eye, Printer, ArrowLeft, 
  Download, Upload, Inbox, Award, Check, UserCheck, CreditCard, Sprout, Landmark, X, AlertTriangle, LogIn, Heart, Shield, HelpCircle, Briefcase, Gift, Settings, User,
  Globe, ExternalLink, Users, XCircle, Megaphone, Info, Image, Facebook, Instagram, Percent, QrCode, RefreshCw, Sparkles
} from 'lucide-react';
import { AboutDayInfotech } from './AboutDayInfotech';
import { UserProfileCustomizer } from './UserProfileCustomizer';
import { useLanguage } from '../utils/language';
import { 
  ApplicationEntry, 
  FormType, 
  PanCardDetails, 
  PanCardDocs, 
  VoterIdDetails, 
  VoterIdDocs,
  EShramDetails,
  EShramDocs,
  FarmerSubsidyDetails,
  FarmerSubsidyDocs,
  ManavKalyanDetails,
  ManavKalyanDocs,
  KuvarBaiMameruDetails,
  KuvarBaiMameruDocs
} from '../types';
import { 
  getAllApplications, 
  deleteApplication, 
  isOwner, 
  saveApplication, 
  getLoggedInUser,
  logoutCustomUser,
  getAllCustomUsers,
  getForgotPasswordRequests,
  subscribeToAllCustomUsers,
  subscribeToForgotPasswordRequests,
  updateForgotPasswordRequestStatus,
  deleteForgotPasswordRequest,
  getServiceStatuses,
  saveServiceStatuses,
  subscribeToServiceStatuses,
  getServicePrices,
  saveServicePrices,
  subscribeToServicePrices,
  subscribeToServiceDiscounts,
  saveServiceDiscounts,
  ServiceDiscounts,
  getOwnerMessage,
  saveOwnerMessage,
  getOwnerAnnouncement,
  saveOwnerAnnouncement,
  getGreetingsMessage,
  saveGreetingsMessage,
  getWallet,
  getWalletTransactions,
  updateWalletBalance,
  createWalletTransaction,
  updateUserProfile,
  toggleBlockUser,
  deleteCustomUser,
  getApkConfig,
  saveApkConfig,
  subscribeToApkConfig
} from '../utils/db';
import { WalletDashboard } from './WalletDashboard';
import { THEMES } from '../utils/theme';
import { SERVICE_PRICES, SERVICE_DISCOUNTS } from './FormRenderer';
import { Wallet as WalletIcon } from 'lucide-react';
import { auth, loginWithGoogle, db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Logo } from './Logo';

export const ALL_SERVICES_LIST: { 
  type: FormType; 
  labelGu: string; 
  labelEn: string; 
  icon: any; 
  colorClass: string; 
  bgClass: string; 
}[] = [
    { 
    type: 'PAN_CARD', 
    labelGu: 'પેન કાર્ડ અરજી', 
    labelEn: 'New PAN Card', 
    icon: CreditCard, 
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100', 
    bgClass: 'bg-indigo-600 hover:bg-indigo-700' 
  },
  {
    type: 'PAN_CARD_CORRECTION',
    labelGu: 'પેન કાર્ડ સુધારો',
    labelEn: 'PAN Card Correction',
    icon: CreditCard,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'MINOR_PAN_CARD',
    labelGu: 'સગીર પેન કાર્ડ',
    labelEn: 'Minor PAN Card',
    icon: CreditCard,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
    { 
    type: 'VOTER_ID', 
    labelGu: 'મતદાર આઈડી અરજી', 
    labelEn: 'New Voter ID', 
    icon: UserCheck, 
    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100', 
    bgClass: 'bg-emerald-600 hover:bg-emerald-700' 
  },
  {
    type: 'VOTER_ID_CORRECTION',
    labelGu: 'મતદાર આઈડી સુધારો',
    labelEn: 'Voter ID Correction',
    icon: UserCheck,
    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
    bgClass: 'bg-emerald-600 hover:bg-emerald-700'
  },
  { 
    type: 'E_SHRAM', 
    labelGu: 'ઈ-શ્રમ કાર્ડ અરજી', 
    labelEn: 'New E-Shram Card', 
    icon: Landmark, 
    colorClass: 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100', 
    bgClass: 'bg-amber-600 hover:bg-amber-700' 
  },
  { 
    type: 'FARMER_SUBSIDY', 
    labelGu: 'ખેડૂત સબસિડી અરજી', 
    labelEn: 'New Farmer Subsidy', 
    icon: Sprout, 
    colorClass: 'text-lime-700 border-lime-200 bg-lime-50 hover:bg-lime-100', 
    bgClass: 'bg-lime-700 hover:bg-lime-800' 
  },
  { 
    type: 'CAST_CERTIFICATE', 
    labelGu: 'જાતિ પ્રમાણપત્ર અરજી', 
    labelEn: 'New Caste Certificate', 
    icon: Award, 
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100', 
    bgClass: 'bg-purple-600 hover:bg-purple-700' 
  },
  { 
    type: 'INCOME_CERTIFICATE', 
    labelGu: 'આવક પ્રમાણપત્ર અરજી', 
    labelEn: 'New Income Certificate', 
    icon: FileText, 
    colorClass: 'text-fuchsia-600 border-fuchsia-200 bg-fuchsia-50 hover:bg-fuchsia-100', 
    bgClass: 'bg-fuchsia-600 hover:bg-fuchsia-700' 
  },
  { 
    type: 'AYUSHYMAN_CARD', 
    labelGu: 'આયુષ્માન ભારત કાર્ડ', 
    labelEn: 'New Ayushman Card', 
    icon: Heart, 
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100', 
    bgClass: 'bg-rose-600 hover:bg-rose-700' 
  },
  { 
    type: 'AABHA_CARD', 
    labelGu: 'આભા હેલ્થ કાર્ડ અરજી', 
    labelEn: 'New ABHA Card', 
    icon: Shield, 
    colorClass: 'text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100', 
    bgClass: 'bg-teal-600 hover:bg-teal-700' 
  },
  { 
    type: 'UDHYAM_AADHAR', 
    labelGu: 'ઉદ્યમ આધાર (MSME)', 
    labelEn: 'New Udhyam MSME', 
    icon: Briefcase, 
    colorClass: 'text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100', 
    bgClass: 'bg-orange-600 hover:bg-orange-700' 
  },
  { 
    type: 'MANAV_KALYAN', 
    labelGu: 'માનવ કલ્યાણ યોજના', 
    labelEn: 'Manav Kalyan Yojna', 
    icon: Gift, 
    colorClass: 'text-cyan-600 border-cyan-200 bg-cyan-50 hover:bg-cyan-100', 
    bgClass: 'bg-cyan-600 hover:bg-cyan-700' 
  },
  {
    type: 'NEW_BIRTH_CERTIFICATE',
    labelGu: 'નવું જન્મ પ્રમાણપત્ર',
    labelEn: 'New Birth Certificate',
    icon: FileText,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'BIRTH_CERTIFICATE_CORRECTION',
    labelGu: 'જન્મ પ્રમાણપત્ર સુધારો',
    labelEn: 'Birth Certificate Correction',
    icon: FileText,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'DEATH_CERTIFICATE',
    labelGu: 'મરણ પ્રમાણપત્ર',
    labelEn: 'Death Certificate',
    icon: FileText,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100',
    bgClass: 'bg-rose-600 hover:bg-rose-700'
  },,
  {
    type: 'KUVAR_BAI_MAMERU', 
    labelGu: 'કુંવરબાઈ મામેરું યોજના', 
    labelEn: 'Kuvar Bai Mameru', 
    icon: Heart, 
    colorClass: 'text-pink-600 border-pink-200 bg-pink-50 hover:bg-pink-100', 
    bgClass: 'bg-pink-600 hover:bg-pink-700' 
  },
  { 
    type: 'OTHER_SERVICE', 
    labelGu: 'અન્ય સેવાઓ પૂછપરછ', 
    labelEn: 'Other Services Enquiry', 
    icon: HelpCircle, 
    colorClass: 'text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100', 
    bgClass: 'bg-slate-600 hover:bg-slate-700' 
  },
  {
    type: 'RATION_CARD_ADD_NAME',
    labelGu: 'રેશન કાર્ડ નામ ઉમેરવું (Add Name)',
    labelEn: 'Ration Card Add Name',
    icon: FileText,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'RATION_CARD_REMOVE_NAME',
    labelGu: 'રેશન કાર્ડ નામ કમી કરવું (Remove Name)',
    labelEn: 'Ration Card Remove Name',
    icon: FileText,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100',
    bgClass: 'bg-rose-600 hover:bg-rose-700'
  },
  {
    type: 'RATION_CARD_CORRECTION',
    labelGu: 'રેશન કાર્ડ સુધારો (Correction)',
    labelEn: 'Ration Card Correction',
    icon: FileText,
    colorClass: 'text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100',
    bgClass: 'bg-teal-600 hover:bg-teal-700'
  }
];

export const OFFICIAL_WEBSITES: {
  nameGu: string;
  nameEn: string;
  url: string;
  icon: any;
  color: string;
  bg: string;
}[] = [
  { nameGu: '૧. પેન કાર્ડ (PAN Card)', nameEn: 'PAN Card Official Website', url: 'https://www.onlineservices.proteantech.in/paam/endUserRegisterContact.html', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
  { nameGu: '૨. મતદાર આઈડી (Voter ID)', nameEn: 'Voter ID Official Website', url: 'https://voters.eci.gov.in/', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { nameGu: '૩. ઈ-શ્રમ કાર્ડ (E-shram Card)', nameEn: 'E-shram Card Official Website', url: 'https://eshram.gov.in/indexmain', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  { nameGu: '૪. ખેડૂત સબસીડી (Khedut Subsidy)', nameEn: 'Khedut Portal Gujarat', url: 'https://ikhedut.gujarat.gov.in/site/login', icon: Sprout, color: 'text-lime-700', bg: 'bg-lime-50 border-lime-100' },
  { nameGu: '૫. જાતિ પ્રમાણપત્ર (Cast Certificate)', nameEn: 'Digital Gujarat Portal', url: 'https://www.digitalgujarat.gov.in/loginapp/CitizenLogin.aspx', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  { nameGu: '૬. આવક પ્રમાણપત્ર (Income Certificate)', nameEn: 'Digital Gujarat Portal', url: 'https://www.digitalgujarat.gov.in/loginapp/CitizenLogin.aspx', icon: FileText, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 border-fuchsia-100' },
  { nameGu: '૭. આયુષ્માન કાર્ડ (Aayushyman Card)', nameEn: 'PM-JAY Beneficiary Portal', url: 'https://beneficiary.nha.gov.in/', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  { nameGu: '૮. આભા કાર્ડ (Aabha Card)', nameEn: 'ABHA Health Card Dashboard', url: 'https://dashboard.abdm.gov.in/abdm/', icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
  { nameGu: '૯. ઉદ્યમ આધાર (Udyam Aadhar)', nameEn: 'Udyam MSME Registration', url: 'https://udyamregistration.gov.in/default.aspx', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
  { nameGu: '૧૦. માનવ કલ્યાણ (Manav Kalyan)', nameEn: 'E-Kutir Gujarat', url: 'https://e-kutir.gujarat.gov.in/', icon: Gift, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
    { nameGu: '૧૧. કુંવરબાઈ મામેરું (Kuvarbai Mameru)', nameEn: 'E-Samaj Kalyan Portal', url: 'https://esamajkalyan.gujarat.gov.in/index.aspx?ServiceID=duJMDyg6dmO007n6aojWGQ==', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
  { nameGu: '૧૨. માનવ ગરિમા યોજના (Manav Garima Yojna)', nameEn: 'E-Samaj Kalyan Portal', url: 'https://esamajkalyan.gujarat.gov.in/index.aspx?ServiceID=duJMDyg6dmO007n6aojWGQ==', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
  { nameGu: '૧૩. 7/12-8A (AnyRoR)', nameEn: 'AnyRoR Gujarat', url: 'https://anyror.gujarat.gov.in/home.aspx', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { nameGu: '૧૪. જમીન અરજી (Land Application)', nameEn: 'IORA Gujarat', url: 'https://iora.gujarat.gov.in/', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  { nameGu: '૧૫. ખેડૂત નોંધણી (Farmer Registration)', nameEn: 'Farmer Registry Gujarat', url: 'https://gjfr.agristack.gov.in/farmer-registry-gj/#/pages/home/addFarmerRegistrySelf', icon: Sprout, color: 'text-lime-600', bg: 'bg-lime-50 border-lime-100' },
  { nameGu: '૧૬. પીએમ કિસાન સન્માન નિધિ (PM Kisan Sanman Nidhi)', nameEn: 'PM Kisan Portal', url: 'https://pmkisan.gov.in/', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  { nameGu: '૧૭. જન્મ અને મરણ પ્રમાણપત્ર (Birth and Death Certificate)', nameEn: 'CRS ORGI', url: 'https://dc.crsorgi.gov.in/', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' }
];

function safeFormatLocalDate(dateVal: any, locale: string = 'en-GB'): string {
  if (!dateVal) return '-';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString(locale);
  } catch (e) {
    return String(dateVal);
  }
}

interface ApplicationTrackerProps {
  onEdit: (entry: ApplicationEntry) => void;
  onAddNew: (type: FormType) => void;
  refreshTrigger: number;
  themeId: string;
  activeTrackerTab?: 'DASHBOARD' | 'APPLICATIONS' | 'USERS' | 'SERVICES' | 'OFFICIAL_WEBSITES' | 'SEND_MESSAGE' | 'APPLY_SERVICE' | 'YOUR_APPLICATIONS' | 'ABOUT_DAY_INFOTECH' | 'WALLET' | 'PROFILE' | 'APK_SETTINGS';
  onUpdateUser?: (updatedUser: any) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  onEdit,
  onAddNew,
  refreshTrigger,
  themeId,
  activeTrackerTab,
  onUpdateUser,
}) => {
  const { language } = useLanguage();
  const [applications, setApplications] = useState<ApplicationEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formFilter, setFormFilter] = useState<'ALL' | FormType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'COMPLETED' | 'CORRECTION_REQUIRED' | 'APPROVED' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [viewingEntry, setViewingEntry] = useState<ApplicationEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [ownerFeedbackText, setOwnerFeedbackText] = useState('');
  const [ownerRejectionReason, setOwnerRejectionReason] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(getLoggedInUser());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [printMode, setPrintMode] = useState<'FULL' | 'BILL'>('FULL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        loadApplications(),
        loadAnnouncement(),
        loadGreetings(),
        loadWalletStats(),
        loadApkConfigData()
      ]);
      showToast(language === 'gu' ? 'ડેટા સફળતાપૂર્વક અપડેટ થયો!' : 'Data updated successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast(language === 'gu' ? 'અપડેટ કરવામાં ભૂલ આવી!' : 'Failed to update!', 'error');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    }
  };

  // Service toggling state
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, boolean>>({
    PAN_CARD: true,
    PAN_CARD_CORRECTION: true,
    MINOR_PAN_CARD: true,
    VOTER_ID: true,
    VOTER_ID_CORRECTION: true,
    E_SHRAM: true,
    FARMER_SUBSIDY: true,
    CAST_CERTIFICATE: true,
    INCOME_CERTIFICATE: true,
    AYUSHYMAN_CARD: true,
    AABHA_CARD: true,
    UDHYAM_AADHAR: true,
    MANAV_KALYAN: true,
    KUVAR_BAI_MAMERU: true,
    OTHER_SERVICE: true,
    RATION_CARD_ADD_NAME: true,
    RATION_CARD_REMOVE_NAME: true,
    RATION_CARD_CORRECTION: true,
  });
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [pricesState, setPricesState] = useState<Record<string, number>>({ ...SERVICE_PRICES });
  const [discountsState, setDiscountsState] = useState<ServiceDiscounts>({ ...SERVICE_DISCOUNTS });

  // Owner/Applicant dashboard tab and data state
  const [activeTab, setActiveTabInternal] = useState<
    'DASHBOARD' | 'APPLICATIONS' | 'USERS' | 'SERVICES' | 'OFFICIAL_WEBSITES' | 'SEND_MESSAGE' | 'APPLY_SERVICE' | 'YOUR_APPLICATIONS' | 'ABOUT_DAY_INFOTECH' | 'WALLET' | 'PROFILE' | 'APK_SETTINGS'
  >('DASHBOARD');
  const [tabHistory, setTabHistory] = useState<typeof activeTab[]>([]);

  const setActiveTab = (newTab: typeof activeTab | ((prev: typeof activeTab) => typeof activeTab)) => {
    setActiveTabInternal((prev) => {
      const resolvedTab = typeof newTab === 'function' ? newTab(prev) : newTab;
      if (resolvedTab !== prev) {
        setTabHistory(h => {
          if (h.length > 0 && h[h.length - 1] === prev) {
            return h;
          }
          return [...h, prev];
        });
      }
      return resolvedTab;
    });
  };

  const handleBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTabInternal(prevTab);
    } else {
      setActiveTabInternal('DASHBOARD');
    }
  };

  useEffect(() => {
    if (activeTrackerTab) {
      setActiveTab(activeTrackerTab);
    }
  }, [activeTrackerTab]);


  const [customUsers, setCustomUsers] = useState<any[]>([]);
  const [forgotRequests, setForgotRequests] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Wallet stats state
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pendingWalletActionsCount, setPendingWalletActionsCount] = useState<number>(0);

  const loadWalletStats = async () => {
    try {
      const user = getLoggedInUser();
      if (user) {
        const w = await getWallet(user.uid);
        setWalletBalance(w.balance);
      }
      if (isOwner()) {
        const txs = await getWalletTransactions();
        const pending = txs.filter(t => t.status === 'PENDING' && (t.type === 'DEPOSIT_REQUEST' || t.type === 'REFUND_REQUEST')).length;
        setPendingWalletActionsCount(pending);
      }
    } catch (e) {
      console.error('Error loading wallet stats:', e);
    }
  };

  // Announcement / Owner Note states
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementPhoto, setAnnouncementPhoto] = useState<string | undefined>(undefined);
  const [ownerNoteInput, setOwnerNoteInput] = useState('');
  const [ownerPhotoInput, setOwnerPhotoInput] = useState<string | undefined>(undefined);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isViewingFullImage, setIsViewingFullImage] = useState(false);

  // Greetings Message states (Login Screen banner)
  const [greetingsMsg, setGreetingsMsg] = useState('');
  const [isGreetingsActive, setIsGreetingsActive] = useState(false);
  const [greetingsInput, setGreetingsInput] = useState('');
  const [isSavingGreetings, setIsSavingGreetings] = useState(false);

  // APK update states
  const CURRENT_APK_VERSION = "1.0.0";
  const [apkConfig, setApkConfig] = useState<{ version: string; downloadUrl: string; fileName?: string; updatedAt?: string } | null>(null);
  const [apkVersionInput, setApkVersionInput] = useState('');
  const [apkUrlInput, setApkUrlInput] = useState('');
  const [apkFileInput, setApkFileInput] = useState<string | null>(null);
  const [apkFileNameInput, setApkFileNameInput] = useState('');
  const [isSavingApk, setIsSavingApk] = useState(false);
  const [isUploadingApk, setIsUploadingApk] = useState(false);

  const safeGetLocalStorage = (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('LocalStorage is blocked or unavailable:', e);
    }
    return null;
  };

  const safeSetLocalStorage = (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('LocalStorage is blocked or unavailable:', e);
    }
  };

  const isApkClient = () => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('platform') === 'apk' || params.get('apk') === 'true') {
      return true;
    }
    if (safeGetLocalStorage('is_apk_client') === 'true') {
      return true;
    }
    if ((window as any).isApk === true || (window as any).isApkClient === true) {
      return true;
    }
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('wv') || ua.includes('webview') || ua.includes('crosswalk') || ua.includes('apk_app')) {
      return true;
    }
    return false;
  };

  const isOutdatedApk = () => {
    if (!isApkClient()) return false;
    if (!apkConfig?.version) return false;
    return apkConfig.version !== CURRENT_APK_VERSION;
  };

  const downloadApkFile = () => {
    if (!apkConfig || !apkConfig.downloadUrl) {
      showToast(language === 'gu' ? 'ડાઉનલોડ લિંક ઉપલબ્ધ નથી!' : 'Download link not available!', 'error');
      return;
    }
    
    let url = apkConfig.downloadUrl;
    if (url.startsWith('/uploads/')) {
      url = window.location.origin + url;
    } else if (url.includes('/uploads/')) {
      const idx = url.indexOf('/uploads/');
      const relativePath = url.substring(idx);
      url = window.location.origin + relativePath;
    } else if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('0.0.0.0')) {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      url = `${window.location.origin}/uploads/${lastPart}`;
    }

    if (url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = apkConfig.fileName || 'day_infotech.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(language === 'gu' ? 'ડાઉનલોડ શરૂ થઈ રહ્યું છે...' : 'Downloading starting...', 'success');
    } else {
      window.open(url, '_blank');
      showToast(language === 'gu' ? 'ડાઉનલોડ પેજ ખુલી રહ્યું છે...' : 'Opening download page...', 'success');
    }
  };

  const loadApkConfigData = async () => {
    try {
      const data = await getApkConfig();
      if (data) {
        setApkConfig(data);
        setApkVersionInput(data.version || '');
        setApkUrlInput(data.downloadUrl || '');
        setApkFileNameInput(data.fileName || '');
        setApkFileInput(data.downloadUrl?.startsWith('data:') ? data.downloadUrl : null);
      }
    } catch (e) {
      console.error('Error loading APK config:', e);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const loadAnnouncement = async () => {
    try {
      const data = await getOwnerAnnouncement();
      setAnnouncementMsg(data.message || '');
      setAnnouncementPhoto(data.photo);
      setOwnerNoteInput(data.message || '');
      setOwnerPhotoInput(data.photo);
    } catch (e) {
      console.error('Error loading announcement:', e);
    }
  };

  const loadGreetings = async () => {
    try {
      const data = await getGreetingsMessage();
      setGreetingsMsg(data.message || '');
      setIsGreetingsActive(data.active);
      setGreetingsInput(data.message || '');
    } catch (e) {
      console.error('Error loading greetings:', e);
    }
  };

  useEffect(() => {
    setCurrentUser(getLoggedInUser());
  }, [refreshTrigger]);

  useEffect(() => {
    if (viewingEntry) {
      setOwnerFeedbackText(viewingEntry.adminFeedback || '');
      setOwnerRejectionReason(viewingEntry.rejectionReason || '');
    } else {
      setOwnerFeedbackText('');
      setOwnerRejectionReason('');
    }
    setShowApproveConfirm(false);
  }, [viewingEntry]);

  // Real-time subscription to service statuses
  useEffect(() => {
    const unsubscribe = subscribeToServiceStatuses((statuses) => {
      setServiceStatuses(statuses);
    });
    return () => unsubscribe();
  }, []);

  // Real-time subscription to service prices and discounts
  useEffect(() => {
    const unsubPrices = subscribeToServicePrices((prices) => {
      setPricesState(prices);
      Object.assign(SERVICE_PRICES, prices);
    });
    
    const unsubDiscounts = subscribeToServiceDiscounts((discounts) => {
      setDiscountsState(discounts);
      Object.assign(SERVICE_DISCOUNTS, discounts);
    });

    return () => {
      unsubPrices();
      unsubDiscounts();
    };
  }, []);

  // Real-time subscription to APK update settings
  useEffect(() => {
    const unsubApk = subscribeToApkConfig((config) => {
      if (config) {
        setApkConfig(config);
        setApkVersionInput(config.version || '');
        setApkUrlInput(config.downloadUrl || '');
        setApkFileNameInput(config.fileName || '');
        setApkFileInput(config.downloadUrl?.startsWith('data:') ? config.downloadUrl : null);
      }
    });
    return () => unsubApk();
  }, []);

  // Real-time subscription to custom users and password requests for owner
  useEffect(() => {
    if (!isOwner()) return;
    const unsubUsers = subscribeToAllCustomUsers((users) => {
      setCustomUsers(users);
    });
    const unsubRequests = subscribeToForgotPasswordRequests((requests) => {
      setForgotRequests(requests);
    });
    return () => {
      unsubUsers();
      unsubRequests();
    };
  }, []);

  // Real-time listener for current logged-in user to handle block or delete actions instantly
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
        if (onUpdateUser) {
          onUpdateUser(null);
        }
        showToast('તમારું એકાઉન્ટ એડમિન દ્વારા ડિલીટ કરવામાં આવ્યું છે. (Your account has been deleted by admin.)', 'error');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = snapshot.data();
        if (data && data.isBlocked) {
          // User account was blocked by admin
          logoutCustomUser();
          setCurrentUser(null);
          if (onUpdateUser) {
            onUpdateUser(null);
          }
          showToast('તમારું એકાઉન્ટ એડમિન દ્વારા કામચલાઉ ધોરણે બ્લોક કરવામાં આવ્યું છે. (Your account has been temporarily blocked by admin.)', 'error');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    }, (error) => {
      console.error('Error listening to current user status:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const loadCustomUsersAndRequests = async () => {
    // Handled in real-time by subscriptions above
  };

  useEffect(() => {
    loadApplications();
    loadAnnouncement();
    loadGreetings();
    loadWalletStats();
    if (isOwner()) {
      loadCustomUsersAndRequests();
    }
  }, [refreshTrigger]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data);
      if (isOwner()) {
        await loadCustomUsersAndRequests();
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      setShowDeleteConfirm(null);
      loadApplications();
      showToast('અરજી સફળતાપૂર્વક દૂર કરવામાં આવી છે. (Application deleted successfully.)');
    } catch (e) {
      console.error(e);
      showToast('ભૂલ આવી છે. અરજી દૂર કરવામાં મુશ્કેલી પડી. (An error occurred while deleting.)', 'error');
    }
  };

  const getApplicantName = (entry: ApplicationEntry) => {
    const d = entry.details as any;
    if (entry.formType === 'KUVAR_BAI_MAMERU') {
      const first = d.kanyaFirstName || '';
      const middle = d.kanyaMiddleName ? ` ${d.kanyaMiddleName}` : '';
      const last = d.kanyaLastName ? ` ${d.kanyaLastName}` : '';
      return `${first}${middle}${last}`.trim() || 'અનામી અરજદાર (Unnamed Applicant)';
    }
    const first = d.firstName || '';
    const middle = d.middleName ? ` ${d.middleName}` : '';
    const last = d.lastName ? ` ${d.lastName}` : '';
    return `${first}${middle}${last}`.trim() || 'અનામી અરજદાર (Unnamed Applicant)';
  };

  const getFormName = (type: FormType) => {
    if (language === 'gu') {
      if (type === 'PAN_CARD') return 'પેન કાર્ડ અરજી';
      if (type === 'PAN_CARD_CORRECTION') return 'પેન કાર્ડ સુધારો';
      if (type === 'MINOR_PAN_CARD') return 'સગીર પેન કાર્ડ';
      if (type === 'VOTER_ID') return 'મતદાર આઇડી અરજી';
      if (type === 'VOTER_ID_CORRECTION') return 'મતદાર આઇડી સુધારો';
      if (type === 'E_SHRAM') return 'ઈ-શ્રમ કાર્ડ અરજી';
      if (type === 'FARMER_SUBSIDY') return 'ખેડૂત સબસિડી અરજી';
      if (type === 'CAST_CERTIFICATE') return 'જાતિ પ્રમાણપત્ર અરજી';
      if (type === 'INCOME_CERTIFICATE') return 'આવક પ્રમાણપત્ર અરજી';
      if (type === 'AYUSHYMAN_CARD') return 'આયુષ્માન ભારત કાર્ડ';
      if (type === 'AABHA_CARD') return 'આભા હેલ્થ કાર્ડ અરજી';
      if (type === 'MANAV_KALYAN') return 'માનવ કલ્યાણ યોજના';
      if (type === 'KUVAR_BAI_MAMERU') return 'કુંવરબાઈ મામેરું યોજના';
      if (type === 'UDHYAM_AADHAR') return 'ઉદ્યમ આધાર (MSME)';
      if (type === 'OTHER_SERVICE') return 'અન્ય સેવાઓ પૂછપરછ';
      if (type === 'RATION_CARD_ADD_NAME') return 'રેશન કાર્ડ નામ ઉમેરવું';
      if (type === 'RATION_CARD_REMOVE_NAME') return 'રેશન કાર્ડ નામ કમી કરવું';
      if (type === 'RATION_CARD_CORRECTION') return 'રેશન કાર્ડ સુધારો';
    } else {
      if (type === 'PAN_CARD') return 'New PAN Card';
      if (type === 'PAN_CARD_CORRECTION') return 'PAN Card Correction';
      if (type === 'MINOR_PAN_CARD') return 'Minor PAN Card';
      if (type === 'VOTER_ID') return 'New Voter ID';
      if (type === 'VOTER_ID_CORRECTION') return 'Voter ID Correction';
      if (type === 'E_SHRAM') return 'New E-Shram Card';
      if (type === 'FARMER_SUBSIDY') return 'New Farmer Subsidy';
      if (type === 'CAST_CERTIFICATE') return 'New Caste Certificate';
      if (type === 'INCOME_CERTIFICATE') return 'New Income Certificate';
      if (type === 'AYUSHYMAN_CARD') return 'New Ayushman Card';
      if (type === 'AABHA_CARD') return 'New ABHA Card';
      if (type === 'MANAV_KALYAN') return 'Manav Kalyan Yojna';
      if (type === 'KUVAR_BAI_MAMERU') return 'Kuvar Bai Mameru';
      if (type === 'UDHYAM_AADHAR') return 'New Udhyam MSME';
      if (type === 'OTHER_SERVICE') return 'Other Services Enquiry';
      if (type === 'RATION_CARD_ADD_NAME') return 'Ration Card Add Name';
      if (type === 'RATION_CARD_REMOVE_NAME') return 'Ration Card Remove Name';
      if (type === 'RATION_CARD_CORRECTION') return 'Ration Card Correction';
    }
    return type;
  };

  const getApplicantNotificationWhatsAppUrl = (entry: ApplicationEntry) => {
    const serviceLabel = getFormName(entry.formType);
    const applicantName = getApplicantName(entry);
    const details: any = entry.details || {};
    let mobile = details.mobile || details.kanyaMobile || details.khedutMobile || details.applicantMobile || details.phone || '';
    
    mobile = mobile.replace(/\D/g, '');
    if (mobile.length === 10) {
      mobile = '91' + mobile;
    }
    
    let text = '';
    if (entry.status === 'DRAFT') {
      text = `*નમસ્તે ${applicantName},*\n\n` +
        `આપની *${serviceLabel}* માટેની અરજી હજુ *ડ્રાફ્ટ (અધૂરી)* સેવ થયેલી છે. કૃપા કરીને આ અરજીમાં બાકી વિગતો ભરી અને જરૂરી દસ્તાવેજો અપલોડ કરી ફાઇનલ સબમિટ (Final Submit) કરવા વિનંતી છે જેથી અમે આગળની પ્રક્રિયા શરૂ કરી શકીએ.\n\n` +
        `*અરજી ID (App ID):* ${entry.id}\n\n` +
        `જો ફોર્મ ભરવામાં કે દસ્તાવેજ અપલોડ કરવામાં કોઈ મુશ્કેલી હોય તો ડે ઇન્ફોટેક નો સંપર્ક કરવા વિનંતી છે.\n\n` +
        `*DAY INFOTECH - ડિજિટલ પોઇન્ટ* 💻🌐`;
    } else {
      text = `*નમસ્તે ${applicantName},*\n\n` +
        `આપની *${serviceLabel}* માટેની અરજી સફળતાપૂર્વક અમને મળી ગઈ છે. સેવાનો ઉપયોગ કરવા બદલ ખુબ ખુબ આભાર! 🙏✨\n\n` +
        `*અરજી ID (App ID):* ${entry.id}\n\n` +
        `અમે ટૂંક સમયમાં આપની અરજી પર પ્રક્રિયા કરીશું અને કોઈ પણ પ્રશ્ન હશે તો આપનો સંપર્ક કરીશું.\n\n` +
        `*DAY INFOTECH - ડિજિટલ પોઇન્ટ* 💻🌐`;
    }
      
    return `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(text)}`;
  };

  const getStatusPill = (status: 'DRAFT' | 'COMPLETED' | 'CORRECTION_REQUIRED' | 'APPROVED' | 'REJECTED') => {
    if (status === 'DRAFT') {
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="h-3.5 w-3.5 mr-1" /> {language === 'gu' ? 'ડ્રાફ્ટ' : 'Draft'}
        </span>
      );
    }
    if (status === 'CORRECTION_REQUIRED') {
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-rose-600" /> {language === 'gu' ? 'ભૂલ સુધારો જરૂરી છે' : 'Correction Required'}
        </span>
      );
    }
    if (status === 'APPROVED') {
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          <Award className="h-3.5 w-3.5 mr-1 text-sky-600" /> {language === 'gu' ? 'મંજૂર થયેલ' : 'Approved'}
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3.5 w-3.5 mr-1 text-rose-600" /> {language === 'gu' ? 'નામંજૂર થયેલ' : 'Rejected'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="h-3.5 w-3.5 mr-1" /> {language === 'gu' ? 'પૂર્ણ થયેલ' : 'Completed'}
      </span>
    );
  };

  const countUploadedDocs = (entry: ApplicationEntry): number => {
    const docs = entry.documents;
    let count = 0;
    if (entry.formType === 'PAN_CARD') {
      const d = docs as PanCardDocs;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.birthProofType === 'BIRTH_CERTIFICATE' && d.birthProofDoc) count++;
      if (d.birthProofType === 'VOTER_ID') {
        if (d.voterIdFront) count++;
        if (d.voterIdBack) count++;
      }
      if (d.signature) count++;
      if (d.passportPhoto) count++;
    } else if (entry.formType === 'VOTER_ID') {
      const d = docs as VoterIdDocs;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.birthProofDoc) count++;
      if (d.relativeEpicCardFront) count++;
      if (d.relativeEpicCardBack) count++;
      if (d.passportPhoto) count++;
    } else if (entry.formType === 'E_SHRAM') {
      const d = docs as EShramDocs;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.bankPassbook) count++;
      if (d.passportPhoto) count++;
      if (d.panCard) count++;
    } else if (entry.formType === 'FARMER_SUBSIDY') {
      const d = docs as FarmerSubsidyDocs;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.landDoc) count++;
      if (d.bankPassbook) count++;
      if (d.casteCertificate) count++;
    } else if (entry.formType === 'CAST_CERTIFICATE') {
      const d = docs as any;
      if (d.rationCard) count++;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.passportPhoto) count++;
      if (d.schoolLeaving) count++;
      if (d.fatherSchoolLeaving) count++;
    } else if (entry.formType === 'INCOME_CERTIFICATE') {
      const d = docs as any;
      if (d.passportPhoto) count++;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.electricityBill) count++;
      if (d.rationCardFront) count++;
      if (d.rationCardBack) count++;
      if (d.otherDoc) count++;
    } else if (entry.formType === 'AYUSHYMAN_CARD') {
      const d = docs as any;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.rationCard) count++;
      if (d.passportPhoto) count++;
    } else if (entry.formType === 'AABHA_CARD') {
      const d = docs as any;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.passportPhoto) count++;
    } else if (entry.formType === 'UDHYAM_AADHAR') {
      const d = docs as any;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.panCard) count++;
      if (d.bankPassbook) count++;
    } else if (entry.formType === 'MANAV_KALYAN') {
      const d = docs as ManavKalyanDocs;
      if (d.aadharCardFront) count++;
      if (d.aadharCardBack) count++;
      if (d.eshramCardFront) count++;
      if (d.eshramCardBack) count++;
      if (d.rationCardFront) count++;
      if (d.rationCardBack) count++;
      if (d.casteCertificate) count++;
      if (d.incomeCertificate) count++;
      if (d.signature) count++;
      if (d.passportPhoto) count++;
      if (d.selfDeclaration) count++;
    } else if (entry.formType === 'KUVAR_BAI_MAMERU') {
      const d = docs as KuvarBaiMameruDocs;
      if (d.kanyaPassportPhoto) count++;
      if (d.yuvakPassportPhoto) count++;
      if (d.kanyaAadharCardFront) count++;
      if (d.kanyaAadharCardBack) count++;
      if (d.yuvakAadharCardFront) count++;
      if (d.yuvakAadharCardBack) count++;
      if (d.kanyaPitaAadharCardFront) count++;
      if (d.kanyaPitaAadharCardBack) count++;
      if (d.yuvakPitaAadharCardFront) count++;
      if (d.yuvakPitaAadharCardBack) count++;
      if (d.kanyaSchoolLeaving) count++;
      if (d.casteCertificate) count++;
      if (d.kanyaPitaIncomeCertificate) count++;
      if (d.kanyaBankPassbook) count++;
      if (d.marriageCertificate) count++;
      if (d.selfDeclaration) count++;
    } else if (entry.formType === 'OTHER_SERVICE') {
      const d = docs as any;
      if (d.supportingDoc) count++;
    }
    return count;
  };

  const maxDocsCount = (entry: ApplicationEntry): number => {
    const type = entry.formType;
    if (type === 'PAN_CARD') {
      const d = entry.documents as PanCardDocs;
      if (d && d.birthProofType === 'VOTER_ID') return 6;
      return 5;
    }
    if (type === 'VOTER_ID') return 6;
    if (type === 'E_SHRAM') return 5; // PAN optional
    if (type === 'FARMER_SUBSIDY') return 5; // Caste optional
    if (type === 'CAST_CERTIFICATE') return 6;
    if (type === 'INCOME_CERTIFICATE') return 7; // otherDoc optional
    if (type === 'AYUSHYMAN_CARD') return 4;
    if (type === 'AABHA_CARD') return 3;
    if (type === 'UDHYAM_AADHAR') return 4;
    if (type === 'MANAV_KALYAN') return 11;
    if (type === 'KUVAR_BAI_MAMERU') return 16;
    if (type === 'OTHER_SERVICE') return 1;
    return 5;
  };

  const handlePrint = (mode: 'FULL' | 'BILL' = 'FULL') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredApplications = applications.filter(app => {
    const name = getApplicantName(app).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Search fields
    let matchesSearch = name.includes(query) || app.id.toLowerCase().includes(query);
    if (app.details.mobile && String(app.details.mobile).includes(query)) {
      matchesSearch = true;
    }
    if (app.details.email && app.details.email.toLowerCase().includes(query)) {
      matchesSearch = true;
    }

    // Form Filter
    const matchesForm = formFilter === 'ALL' || app.formType === formFilter;

    // Status Filter
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesForm && matchesStatus;
  });

  const correctionApplications = applications.filter(app => app.status === 'CORRECTION_REQUIRED');

  return (
    <div className="space-y-4 pb-2">
      
      {/* Correction Required Notice for Applicants */}
      {!isOwner() && correctionApplications.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex items-start gap-3.5 text-rose-950 shadow-xs animate-pulse">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-700 mt-0.5 shrink-0">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-sm font-black text-rose-900 font-sans">
              ⚠️ તમારી અરજીમાં સુધારો કરવો જરૂરી છે!
            </p>
            <p className="text-xs text-rose-700 font-medium leading-relaxed">
              કેટલીક અરજીઓમાં એડમિન દ્વારા ભૂલો સુધારવા માટે જણાવવામાં આવ્યું છે. કૃપા કરીને નીચે લાલ બોર્ડરવાળી અરજીઓ તપાસો અને સૂચનાઓ મુજબ સુધારો કરો.
            </p>
          </div>
        </div>
      )}

      {/* Owner Broadcast Message Card for Applicants & Guests */}
      {!isOwner() && (announcementMsg || announcementPhoto) && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 flex items-start gap-4 text-indigo-950 shadow-sm relative overflow-hidden">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0 mt-0.5">
            <Megaphone className="h-6 w-6 text-indigo-650" />
          </div>
          <div className="space-y-3 flex-1 z-10 w-full min-w-0">
            <p className="text-sm font-black text-indigo-900 font-sans flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              મહત્વપૂર્ણ સૂચનાઓ / અપડેટ્સ (Admin Message)
            </p>
            {announcementMsg && (
              <div className="text-xs text-indigo-850 font-medium leading-relaxed whitespace-pre-wrap font-sans">
                {announcementMsg}
              </div>
            )}
            {announcementPhoto && (
              <div className="mt-2 relative group max-w-sm">
                <div className="overflow-hidden rounded-xl border border-indigo-200 shadow-xs max-h-72 flex items-center bg-white cursor-zoom-in group-hover:brightness-95 transition-all">
                  <img 
                    src={announcementPhoto} 
                    alt="Broadcast Poster" 
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-72 object-contain mx-auto"
                    onClick={() => setIsViewingFullImage(true)}
                  />
                </div>
                <p className="text-[10px] text-indigo-600 font-bold mt-1 font-sans flex items-center gap-1">
                  🔍 ફોટો મોટો કરવા માટે તેના પર ક્લિક કરો (Click to view full image)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentUser ? (
        <div className="space-y-4">
          {!isOwner() && (
            <>
              {/* Aadhar Mobile Link News Ticker */}
              <div className="bg-white border-2 border-rose-500 rounded-2xl shadow-md overflow-hidden flex items-stretch">
                {/* News Header Label - Styled like dynamic news board */}
                <div className="bg-rose-600 px-3 md:px-5 py-3 flex items-center gap-2 text-white shrink-0 relative z-10 shadow-[4px_0_10px_rgba(225,29,72,0.3)]">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
                  </span>
                  <span className="text-xs md:text-sm font-black tracking-wider uppercase font-sans whitespace-nowrap">
                    {language === 'gu' ? 'લાઈવ સમાચાર 🔴' : 'LIVE UPDATE 🔴'}
                  </span>
                </div>

                {/* News Scrolling Content Container */}
                <div className="flex-1 overflow-hidden bg-amber-50 flex items-center relative py-3 group">
                  <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
                    {/* First copy */}
                    <span className="text-sm md:text-base font-black text-rose-850 flex items-center gap-2.5">
                      {language === 'gu' ? (
                        <>
                          <span className="text-rose-600 font-extrabold font-sans">★</span>
                          તમામ અરજદારોએ ખાસ ધ્યાન આપવું કે સરકારી યોજનાઓ અને ઓનલાઈન સેવાઓનો લાભ લેવા માટે તમારા <strong className="text-rose-600 underline decoration-2">આધાર કાર્ડ સાથે સક્રિય મોબાઈલ નંબર લિંક હોવો ફરજિયાત છે</strong>. જો આધાર કાર્ડમાં મોબાઈલ નંબર લિંક નહીં હોય તો ઓનલાઈન વેરિફિકેશન માટે ઓટીપી (OTP) મેળવવામાં મુશ્કેલી થશે અને તમારી અરજી રદ થઈ શકે છે. જો લિંક ન હોય તો વહેલી તકે નજીકના આધાર કેન્દ્ર પર જઈને લિંક કરાવી લેશો.
                        </>
                      ) : (
                        <>
                          <span className="text-rose-600 font-extrabold font-sans">★</span>
                          It is mandatory for all applicants to <strong className="text-rose-600 underline decoration-2">link an active mobile number with your Aadhaar Card</strong> to avail government schemes and online services. Without this, OTP verification will fail and your application may get rejected. Please visit your nearest Aadhaar center to link it immediately.
                        </>
                      )}
                    </span>

                    {/* Second copy for seamless scroll loop */}
                    <span className="text-sm md:text-base font-black text-rose-850 flex items-center gap-2.5">
                      {language === 'gu' ? (
                        <>
                          <span className="text-rose-600 font-extrabold font-sans">★</span>
                          તમામ અરજદારોએ ખાસ ધ્યાન આપવું કે સરકારી યોજનાઓ અને ઓનલાઈન સેવાઓનો લાભ લેવા માટે તમારા <strong className="text-rose-600 underline decoration-2">આધાર કાર્ડ સાથે સક્રિય મોબાઈલ નંબર લિંક હોવો ફરજિયાત છે</strong>. જો આધાર કાર્ડમાં મોબાઈલ નંબર લિંક નહીં હોય તો ઓનલાઈન વેરિફિકેશન માટે ઓટીપી (OTP) મેળવવામાં મુશ્કેલી થશે અને તમારી અરજી રદ થઈ શકે છે. જો લિંક ન હોય તો વહેલી તકે નજીકના આધાર કેન્દ્ર પર જઈને લિંક કરાવી લેશો.
                        </>
                      ) : (
                        <>
                          <span className="text-rose-600 font-extrabold font-sans">★</span>
                          It is mandatory for all applicants to <strong className="text-rose-600 underline decoration-2">link an active mobile number with your Aadhaar Card</strong> to avail government schemes and online services. Without this, OTP verification will fail and your application may get rejected. Please visit your nearest Aadhaar center to link it immediately.
                        </>
                      )}
                    </span>
                  </div>

                  {/* Gentle hover prompt to pause */}
                  <div className="absolute right-2 bottom-0.5 text-[8px] md:text-[9px] text-slate-400 font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 px-1 rounded border pointer-events-none">
                    {language === 'gu' ? 'સ્થિર કરવા માટે માઉસ ઉપર રાખશો' : 'Hover to Pause'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl relative group">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative p-6 md:p-10 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-full flex items-center justify-center shadow-inner border border-slate-100">
              <Logo size={120} />
            </div>
            
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {language === 'gu' ? 'અરજદાર લોગિન' : 'Applicant Login'}
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                {language === 'gu' 
                  ? 'તમારા ફોર્મને કાયમ સુરક્ષિત રાખવા, પેમેન્ટ ટ્રેક કરવા અને દસ્તાવેજો ડાઉનલોડ કરવા માટે લોગિન કરો.' 
                  : 'Login to keep your forms safe forever, track payments, and download your processed documents.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl py-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <Shield className="h-5 w-5 text-indigo-600 mx-auto" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Secure Data</p>
                <p className="text-[10px] text-slate-500 font-medium">Your documents are safe with cloud storage.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <Clock className="h-5 w-5 text-amber-600 mx-auto" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Live Tracking</p>
                <p className="text-[10px] text-slate-500 font-medium">Track your application status in real-time.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Easy Process</p>
                <p className="text-[10px] text-slate-500 font-medium">Simple 3-step process to get your services.</p>
              </div>
            </div>

            {isApkClient() && isOutdatedApk() && (
              <div className="w-full max-w-3xl p-4 bg-amber-50 border border-amber-200 rounded-3xl text-left space-y-3 animate-pulse shadow-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-amber-900 leading-tight border-b border-amber-200/50 pb-1 flex items-center gap-1.5">
                      {language === 'gu' ? 'એપ્લિકેશનનું નવું વર્ઝન ઉપલબ્ધ છે!' : 'New Application Update Available!'}
                    </h4>
                    <p className="text-xs font-semibold text-amber-700 leading-relaxed mt-1">
                      {language === 'gu' 
                        ? `એપ્લિકેશનનું નવું વર્ઝન (v${apkConfig?.version}) ઉપલબ્ધ થયું છે. શ્રેષ્ઠ કામગીરી અને નવી સુવિધાઓ માટે કૃપા કરીને નવું વર્ઝન ડાઉનલોડ કરીને ઇન્સ્ટોલ કરો.` 
                        : `A newer version (v${apkConfig?.version}) of the application is available. Please download and update to the latest version for better performance and security.`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadApkFile}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{language === 'gu' ? 'નવું વર્ઝન અપડેટ કરો' : 'Update New Version'}</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
              <button
                onClick={async () => {
                  try {
                    await loginWithGoogle();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full sm:w-auto px-10 py-4 bg-indigo-950 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10 group/btn"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{language === 'gu' ? 'Google સાથે લોગિન કરો' : 'Login with Google'}</span>
              </button>
            </div>
            
            <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-tight">
              {language === 'gu' ? 'કોઈ પાસવર્ડ યાદ રાખવાની જરૂર નથી. ફક્ત તમારા Google એકાઉન્ટનો ઉપયોગ કરો.' : 'No need to remember passwords. Just use your Google account.'}
            </p>

            {!isApkClient() && (
              <div className="w-full max-w-3xl pt-2">
                <button
                  type="button"
                  onClick={downloadApkFile}
                  className="w-full py-3.5 border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-600 hover:text-white text-indigo-700 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Download className="h-4.5 w-4.5 text-indigo-600 group-hover:text-white shrink-0 transition-transform group-hover:translate-y-0.5" />
                  <span>{language === 'gu' ? `એન્ડ્રોઇડ એપ ડાઉનલોડ કરો (Download APK v${apkConfig?.version || '1.0.0'})` : `Download Android App (APK v${apkConfig?.version || '1.0.0'})`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owner Dashboard - Quick Access Grid Cards */}
      {isOwner() && activeTab === 'DASHBOARD' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 mb-4">
          {/* Card 1: All Applications */}
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'APPLICATIONS'
                ? 'bg-indigo-50/90 backdrop-blur-md border-indigo-600 ring-4 ring-indigo-500/15 shadow-md shadow-indigo-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'APPLICATIONS'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100'
              }`}>
                <FileText className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              <div className="flex items-center gap-1">
                {activeTab === 'APPLICATIONS' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                )}
                <span className={`text-[9px] md:text-xs font-black px-2 py-0.5 rounded-full font-mono border ${
                  activeTab === 'APPLICATIONS'
                    ? 'bg-indigo-600/10 border-indigo-200 text-indigo-700'
                    : 'bg-slate-100 border-slate-200/60 text-slate-600'
                }`}>
                  {applications.length}
                </span>
              </div>
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-indigo-900 transition-colors">
                બધી અરજીઓ
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                All Applications
              </p>
            </div>
          </button>

          {/* Card 2: Registered Users & Requests */}
          <button
            onClick={() => setActiveTab('USERS')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'USERS'
                ? 'bg-emerald-50/90 backdrop-blur-md border-emerald-600 ring-4 ring-emerald-500/15 shadow-md shadow-emerald-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'USERS'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100'
              }`}>
                <UserCheck className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              
              {forgotRequests.filter(r => r.status === 'pending').length > 0 ? (
                <span className="min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center px-1 animate-bounce shadow-md shadow-rose-500/30">
                  {forgotRequests.filter(r => r.status === 'pending').length}
                </span>
              ) : (
                activeTab === 'USERS' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-650 animate-ping"></span>
                )
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-emerald-900 transition-colors">
                યુઝર્સ અને વિનંતીઓ
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                Users & Requests
              </p>
            </div>
          </button>

          {/* Card 3: Wallet System (Owner Action Portal) */}
          <button
            onClick={() => setActiveTab('WALLET')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'WALLET'
                ? 'bg-amber-50/90 backdrop-blur-md border-amber-500 ring-4 ring-amber-500/15 shadow-md shadow-amber-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'WALLET'
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-amber-600 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-100'
              }`}>
                <WalletIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              {pendingWalletActionsCount > 0 ? (
                <span className="min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center px-1 animate-pulse shadow-md shadow-rose-500/30 font-sans">
                  {pendingWalletActionsCount}
                </span>
              ) : (
                activeTab === 'WALLET' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-550 animate-ping"></span>
                )
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-amber-900 transition-colors">
                વોલેટ મેનેજમેન્ટ
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                Wallet Ledger
              </p>
            </div>
          </button>

          {/* Card 4: Manage Services */}
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'SERVICES'
                ? 'bg-amber-50/90 backdrop-blur-md border-amber-600 ring-4 ring-amber-500/15 shadow-md shadow-amber-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'SERVICES'
                  ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-650/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100'
              }`}>
                <Settings className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              {activeTab === 'SERVICES' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-650 animate-ping"></span>
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-amber-900 transition-colors">
                સેવાઓનું સંચાલન
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                Manage Services
              </p>
            </div>
          </button>

          {/* Card 5: Official Websites */}
          <button
            onClick={() => setActiveTab('OFFICIAL_WEBSITES')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'OFFICIAL_WEBSITES'
                ? 'bg-purple-50/90 backdrop-blur-md border-purple-600 ring-4 ring-purple-500/15 shadow-md shadow-purple-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-purple-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'OFFICIAL_WEBSITES'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-100'
              }`}>
                <Globe className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              {activeTab === 'OFFICIAL_WEBSITES' && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-650 animate-ping"></span>
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-purple-900 transition-colors">
                અધિકૃત વેબસાઇટ્સ
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                Official Websites
              </p>
            </div>
          </button>

          {/* Card 6: Send Message / Broadcast Note */}
          <button
            onClick={() => setActiveTab('SEND_MESSAGE')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'SEND_MESSAGE'
                ? 'bg-rose-50/90 backdrop-blur-md border-rose-600 ring-4 ring-rose-500/15 shadow-md shadow-rose-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-rose-450 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'SEND_MESSAGE'
                  ? 'bg-rose-600 border-rose-650 text-white shadow-md shadow-rose-600/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:border-rose-100'
              }`}>
                <Megaphone className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              {activeTab === 'SEND_MESSAGE' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-650 animate-ping"></span>
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-rose-900 transition-colors">
                સંદેશો મોકલો
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                Send Message
              </p>
            </div>
          </button>

          {/* Card 7: APK Release Management */}
          <button
            onClick={() => setActiveTab('APK_SETTINGS')}
            className={`p-3 md:p-3.5 rounded-2xl border text-left flex flex-col justify-between h-25 md:h-27 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
              activeTab === 'APK_SETTINGS'
                ? 'bg-indigo-50/90 backdrop-blur-md border-indigo-600 ring-4 ring-indigo-500/15 shadow-md shadow-indigo-500/10 -translate-y-0.5'
                : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start justify-between w-full">
              <div className={`p-1.5 md:p-2 rounded-xl border transition-all duration-300 ${
                activeTab === 'APK_SETTINGS'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100'
              }`}>
                <Download className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              </div>
              {activeTab === 'APK_SETTINGS' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-650 animate-ping"></span>
              )}
            </div>
            <div className="mt-1.5">
              <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-indigo-900 transition-colors">
                APK મેનેજમેન્ટ
              </h4>
              <p className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5 leading-none">
                APK Settings
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Applicant Dashboard - Quick Access Grid Cards */}
      {!isOwner() && activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Quick Actions Header with Refresh Button */}
          <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                {language === 'gu' ? 'મુખ્ય ડેશબોર્ડ અને ક્વિક એક્સેસ' : 'Main Dashboard & Quick Access'}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">
                {language === 'gu' ? 'તમારી અરજીઓ અને ખાતાની માહિતી અહીં ઉપલબ્ધ છે' : 'Your applications and account details are available here'}
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
                isRefreshing
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-700 hover:bg-slate-50 active:scale-95'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{language === 'gu' ? 'રિફ્રેશ (Refresh)' : 'Refresh'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Card 1: Apply for Services */}
            <button
              onClick={() => setActiveTab('APPLY_SERVICE')}
              className={`p-4 md:p-5 rounded-3xl border text-left flex flex-col justify-between h-32 md:h-36 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                activeTab === 'APPLY_SERVICE'
                  ? 'bg-indigo-50/90 backdrop-blur-md border-indigo-600 ring-4 ring-indigo-500/15 shadow-md shadow-indigo-500/10 -translate-y-1'
                  : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 shadow-sm'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 md:p-3 rounded-2xl border transition-all duration-300 ${
                  activeTab === 'APPLY_SERVICE'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-650/20 scale-110'
                    : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100'
                }`}>
                  <FileText className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
                </div>
                {activeTab === 'APPLY_SERVICE' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-650 animate-ping"></span>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-[13px] md:text-[15px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-indigo-900 transition-colors">
                  સેવાઓ માટે અરજી
                </h4>
                <p className="text-[10px] font-extrabold text-slate-400 font-mono mt-1 leading-none uppercase tracking-wider">
                  Apply Now
                </p>
              </div>
            </button>

            {/* Card 2: Your Applications */}
            <button
              onClick={() => setActiveTab('YOUR_APPLICATIONS')}
              className={`p-4 md:p-5 rounded-3xl border text-left flex flex-col justify-between h-32 md:h-36 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                activeTab === 'YOUR_APPLICATIONS'
                  ? 'bg-emerald-50/90 backdrop-blur-md border-emerald-600 ring-4 ring-emerald-500/15 shadow-md shadow-emerald-500/10 -translate-y-1'
                  : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 shadow-sm'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 md:p-3 rounded-2xl border transition-all duration-300 ${
                  activeTab === 'YOUR_APPLICATIONS'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-650/20 scale-110'
                    : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100'
                }`}>
                  <Inbox className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'YOUR_APPLICATIONS' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-650 animate-ping"></span>
                  )}
                  {applications.length > 0 && (
                    <span className={`text-[10px] md:text-xs font-black px-2.5 py-1 rounded-full font-mono border ${
                      activeTab === 'YOUR_APPLICATIONS'
                        ? 'bg-emerald-600/20 border-emerald-300 text-emerald-950'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-700 shadow-xs'
                    }`}>
                      {applications.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-[13px] md:text-[15px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-emerald-900 transition-colors">
                  તમારી અરજીઓ
                </h4>
                <p className="text-[10px] font-extrabold text-slate-400 font-mono mt-1 leading-none uppercase tracking-wider">
                  History
                </p>
              </div>
            </button>

            {/* Card 3: Wallet System (Applicant Balance Portal) */}
            <button
              onClick={() => setActiveTab('WALLET')}
              className={`p-4 md:p-5 rounded-3xl border text-left flex flex-col justify-between h-32 md:h-36 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                activeTab === 'WALLET'
                  ? 'bg-amber-50/90 backdrop-blur-md border-amber-500 ring-4 ring-amber-500/15 shadow-md shadow-amber-500/10 -translate-y-1'
                  : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 shadow-sm'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 md:p-3 rounded-2xl border transition-all duration-300 ${
                  activeTab === 'WALLET'
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-110'
                    : 'bg-slate-50 border-slate-200 text-amber-600 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-100'
                }`}>
                  <WalletIcon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'WALLET' && (
                    <span className="w-2 h-2 rounded-full bg-amber-550 animate-ping"></span>
                  )}
                  <span className="text-[10px] md:text-xs font-black font-mono px-2.5 py-1 bg-amber-100 border border-amber-200 text-amber-850 rounded-lg shadow-xs">
                    ₹{walletBalance}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-[13px] md:text-[15px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-amber-900 transition-colors">
                  વોલેટ / એડ મની
                </h4>
                <p className="text-[10px] font-extrabold text-slate-400 font-mono mt-1 leading-none uppercase tracking-wider">
                  Wallet
                </p>
              </div>
            </button>

            {/* Card 4: About Day Infotech */}
            <button
              onClick={() => setActiveTab('ABOUT_DAY_INFOTECH')}
              className={`p-4 md:p-5 rounded-3xl border text-left flex flex-col justify-between h-32 md:h-36 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                activeTab === 'ABOUT_DAY_INFOTECH'
                  ? 'bg-amber-50/90 backdrop-blur-md border-amber-600 ring-4 ring-amber-500/15 shadow-md shadow-amber-500/10 -translate-y-1'
                  : 'bg-white/95 backdrop-blur-md border-slate-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 shadow-sm'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 md:p-3 rounded-2xl border transition-all duration-300 ${
                  activeTab === 'ABOUT_DAY_INFOTECH'
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-650/20 scale-110'
                    : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100'
                }`}>
                  <Info className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
                </div>
                {activeTab === 'ABOUT_DAY_INFOTECH' && (
                  <span className="w-2 h-2 rounded-full bg-amber-650 animate-ping"></span>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-[13px] md:text-[15px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-amber-900 transition-colors">
                  ડે ઇન્ફોટેક વિશે
                </h4>
                <p className="text-[10px] font-extrabold text-slate-400 font-mono mt-1 leading-none uppercase tracking-wider">
                  Contact
                </p>
              </div>
            </button>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                {language === 'gu' ? 'તાજેતરની પ્રવૃત્તિ' : 'Recent Activity'}
              </h3>
              <button 
                onClick={() => setActiveTab('YOUR_APPLICATIONS')}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'gu' ? 'બધું જુઓ' : 'View All'}
              </button>
            </div>
            
            <div className="divide-y divide-slate-50">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl border ${
                        app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{getFormName(app.formType)}</p>
                        <p className="text-[10px] text-slate-500 font-bold font-mono">ID: {app.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusPill(app.status)}
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-xs text-slate-400 font-bold">
                    {language === 'gu' ? 'હજુ સુધી કોઈ પ્રવૃત્તિ નથી' : 'No recent activity yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'DASHBOARD' && (
        <div className="flex items-center justify-start pb-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/95 hover:bg-slate-50 text-indigo-650 font-black text-xs rounded-xl shadow-xs transition-all border border-slate-200 hover:border-indigo-300 cursor-pointer group"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-indigo-600 transition-transform group-hover:-translate-x-0.5" />
            <span>
              {tabHistory.length > 0 && tabHistory[tabHistory.length - 1] !== 'DASHBOARD'
                ? language === 'gu' ? '← પાછા જાઓ (Go Back)' : '← Go Back'
                : language === 'gu' ? '← પાછા ડેશબોર્ડ પર જાઓ (Back to Dashboard)' : '← Back to Dashboard'}
            </span>
          </button>
        </div>
      )}

      {activeTab === 'APPLICATIONS' || activeTab === 'YOUR_APPLICATIONS' ? (
        <>
          {/* Search and Filters Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4.5 space-y-3">
        
        {(isOwner() || applications.length > 0) && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col md:flex-row gap-3.5 items-center justify-between">
              {/* Search Box */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="નામ, આઈડી અથવા મોબાઈલથી શોધો... (Search by Name, ID, Mobile)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-10 pr-4 py-1.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 transition-all"
                />
              </div>

              {/* Form Type Filter */}
              <div className="flex items-center gap-1.5 text-xs w-full md:w-auto">
                <span className="text-slate-500 font-bold shrink-0">સેવા (Service):</span>
                <select
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 outline-hidden cursor-pointer hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all flex-1 md:flex-initial"
                >
                  <option value="ALL">બધી સેવાઓ (All Services)</option>
                  <option value="PAN_CARD">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="E_SHRAM">E-Shram Card</option>
                  <option value="FARMER_SUBSIDY">Farmer Subsidy</option>
                  <option value="CAST_CERTIFICATE">Cast Certificate</option>
                  <option value="INCOME_CERTIFICATE">Income Certificate</option>
                  <option value="AYUSHYMAN_CARD">Ayushman Card</option>
                  <option value="AABHA_CARD">Abha Health Card</option>
                  <option value="UDHYAM_AADHAR">Udhyam Aadhar</option>
                  <option value="MANAV_KALYAN">Manav Kalyan Yojna</option>
                  <option value="KUVAR_BAI_MAMERU">Kuvar Bai Mameru</option>
                  <option value="OTHER_SERVICE">Other Services</option>
                </select>
              </div>
            </div>

            {/* Status Filter Row */}
            <div className="flex flex-wrap gap-1.5 items-center border-t border-slate-100 pt-2">
              <span className="text-xs text-slate-500 font-bold mr-1 shrink-0">સ્થિતિ (Status):</span>
              {[
                { id: 'ALL', label: 'બધી (All)', count: applications.length },
                { id: 'DRAFT', label: 'ડ્રાફ્ટ (Draft)', count: applications.filter(a => a.status === 'DRAFT').length },
                { id: 'COMPLETED', label: 'સબમિટ (Submitted)', count: applications.filter(a => a.status === 'COMPLETED').length },
                { id: 'CORRECTION_REQUIRED', label: 'સુધારણા બાકી (Correction)', count: applications.filter(a => a.status === 'CORRECTION_REQUIRED').length },
                { id: 'APPROVED', label: 'મંજૂર (Approved)', count: applications.filter(a => a.status === 'APPROVED').length },
                { id: 'REJECTED', label: 'નામંજૂર (Rejected)', count: applications.filter(a => a.status === 'REJECTED').length },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                    statusFilter === st.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    statusFilter === st.id
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}



      </div>

      {/* Applications List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="animate-spin inline-block h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3" />
          <p className="text-sm text-slate-500">લોડ થઈ રહ્યું છે, કૃપા કરીને રાહ જુઓ...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
          <p className="text-sm font-black text-slate-700">કોઈ અરજીઓ ઉપલબ્ધ નથી</p>
          <p className="text-xs text-slate-400 mt-1">No applications found matching the active filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredApplications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                
                 {/* Details Left */}
                 <div className="space-y-1 flex-1">
                   <div className="flex flex-wrap items-center gap-2">
                     <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                       ID: {app.id}
                     </span>
                     
                     <span className={`${isOwner() ? 'hidden' : ''} text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                       app.formType === 'PAN_CARD' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                       app.formType === 'VOTER_ID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                       app.formType === 'E_SHRAM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                       app.formType === 'FARMER_SUBSIDY' ? 'bg-lime-50 text-lime-800 border-lime-200' :
                       app.formType === 'CAST_CERTIFICATE' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                       app.formType === 'INCOME_CERTIFICATE' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' :
                       app.formType === 'AYUSHYMAN_CARD' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                       app.formType === 'AABHA_CARD' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                       'bg-slate-50 text-slate-700 border-slate-200'
                     }`}>
                       {getFormName(app.formType)}
                     </span>

                     {!isOwner() && getStatusPill(app.status)}
                   </div>

                   <h3 className="text-base font-bold text-slate-800 font-display group-hover:text-indigo-900 transition-colors">
                     {getApplicantName(app)}
                   </h3>

                   <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                     <span className="flex items-center gap-1">
                       મોબાઇલ: <span className="font-semibold text-slate-700">{app.details.mobile || 'નથી ભરી'}</span>
                     </span>

                     <span className="inline-flex items-center text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                       દસ્તાવેજો: {countUploadedDocs(app)} / {maxDocsCount(app)} અપલોડ કરેલ
                     </span>
                   </div>

                   {app.status === 'CORRECTION_REQUIRED' && app.adminFeedback && (
                     <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 text-xs font-sans mt-2 space-y-1.5 shadow-2xs max-w-2xl">
                       <p className="font-bold flex items-center gap-1 text-rose-700 text-[11px]">
                         <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                         <span>⚠️ એડમિનનો સંદેશ: ફોર્મમાં ભૂલ છે! (Admin's Message: Form has mistakes!)</span>
                       </p>
                       <p className="bg-white/70 px-2.5 py-2 rounded border border-rose-100/50 font-medium text-rose-700 leading-relaxed text-xs">
                         "{app.adminFeedback}"
                       </p>
                       <p className="text-[10px] text-rose-500 font-medium">
                         * કૃપા કરીને બાજુમાં આપેલ <strong>'સુધારો (Edit)'</strong> બટન પર ક્લિક કરીને ભૂલ સુધારી ફરી સબમિટ કરો.
                       </p>
                     </div>
                   )}

                   {app.status === 'REJECTED' && app.rejectionReason && (
                     <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-800 text-xs font-sans mt-2 space-y-1.5 shadow-2xs max-w-2xl">
                       <p className="font-bold flex items-center gap-1 text-red-700 text-[11px]">
                         <XCircle className="h-3.5 w-3.5 text-red-650 shrink-0" />
                         <span>⚠️ અરજી નામંજૂર કરેલ છે! (Application Rejected!)</span>
                       </p>
                       <p className="bg-white/70 px-2.5 py-2 rounded border border-red-100/50 font-medium text-red-700 leading-relaxed text-xs">
                         "{app.rejectionReason}"
                       </p>
                       <p className="text-[10px] text-red-500 font-medium">
                         * કૃપા કરીને નામંજૂર થવાનું કારણ તપાસો. વધુ માહિતી માટે એડમિનનો સંપર્ક કરો.
                       </p>
                     </div>
                   )}
                 </div>

                {/* Actions Right */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-50/60 p-2 rounded-xl border border-slate-200/50 md:bg-transparent md:p-0 md:border-none">
                  
                  {/* View Details */}
                  <button
                    onClick={() => setViewingEntry(app)}
                    className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    title="અરજી અને દસ્તાવેજો જુઓ"
                  >
                    <Eye className="h-4 w-4" /> <span>વિગતો / પ્રિન્ટ (View)</span>
                  </button>

                  {/* Notify Applicant via WhatsApp */}
                  {isOwner() && (
                    <button
                      onClick={() => {
                        const url = getApplicantNotificationWhatsAppUrl(app);
                        window.open(url, '_blank');
                      }}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      title="અરજદારને વોટ્સએપ પર અરજી મળ્યાનો આભાર મેસેજ મોકલો"
                    >
                      <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                      </svg>
                      <span>ગ્રાહકને મોકલો (Notify)</span>
                    </button>
                  )}

                  {/* Edit */}
                  {(isOwner() || app.allowApplicantEdit || app.status === 'DRAFT') ? (
                    <button
                      onClick={() => onEdit(app)}
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      title="અરજીમાં સુધારો કરો"
                    >
                      <Edit3 className="h-4 w-4" /> <span>સુધારો (Edit)</span>
                    </button>
                  ) : (
                    <div 
                      className="p-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 select-none cursor-not-allowed" 
                      title="સુધારવા માટે એડમિનની પરવાનગી જરૂરી છે"
                    >
                      <span className="text-[10px]">🔒 સુધારો લોક છે</span>
                    </div>
                  )}

                  {/* Owner Permission Toggle */}
                  {isOwner() && (
                    <button
                      onClick={async () => {
                        try {
                          const updated: ApplicationEntry = {
                            ...app,
                            allowApplicantEdit: !app.allowApplicantEdit,
                            updatedAt: new Date().toISOString()
                          };
                          await saveApplication(updated);
                          loadApplications();
                          showToast(app.allowApplicantEdit ? 'સુધારા મંજૂરી રદ કરી છે! (Edit permission revoked!)' : 'અરજદારને સુધારા માટે મંજૂરી આપી છે! (Edit permission allowed!)');
                        } catch (e) {
                          console.error(e);
                          showToast('ભૂલ આવી છે.', 'error');
                        }
                      }}
                      className={`p-2 border rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                        app.allowApplicantEdit
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200/80'
                      }`}
                      title={app.allowApplicantEdit ? "અરજદારનો સુધારો બંધ કરો (Lock Edit for Applicant)" : "અરજદારને સુધારો ચાલુ કરવા મંજૂરી આપો (Unlock Edit for Applicant)"}
                    >
                      {app.allowApplicantEdit ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> <span>સુધારો ચાલુ (Edit Allowed)</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5" /> <span>સુધારો બંધ (Edit Locked)</span>
                        </>
                      )}
                    </button>
                  )}

                   {/* Delete Trigger */}
                  {showDeleteConfirm === app.id ? (
                    <div className="flex items-center space-x-1.5 bg-red-50 border border-red-200 p-1 rounded-xl">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        હા, દૂર કરો
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-semibold cursor-pointer"
                      >
                        ના
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(app.id)}
                      className="p-2 bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl transition-all cursor-pointer"
                      title="અરજી રદ/દૂર કરો"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
        </>
      ) : activeTab === 'USERS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Password recovery requests */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping"></span>
                  પાસવર્ડ રિકવરી વિનંતીઓ (Recovery Requests)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {forgotRequests.filter(r => r.status === 'pending').length} બાકી (Pending)
                </span>
              </div>

              {forgotRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Inbox className="h-8 w-8 mx-auto opacity-40" />
                  <p className="text-xs font-bold">કોઈ નવી વિનંતીઓ નથી. (No requests found)</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                  {forgotRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        req.status === 'pending'
                          ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                          : 'bg-slate-50/50 border-slate-100 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black font-mono text-slate-400">
                            REQ ID: {req.id}
                          </p>
                          <p className="text-xs font-black text-slate-800 flex items-center gap-1">
                            <span className="text-slate-400">મોબાઈલ:</span>
                            <span className="font-mono text-slate-900 font-black">{req.mobile}</span>
                          </p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {req.status === 'pending' ? 'બાકી (Pending)' : 'ઉકેલાયેલ (Resolved)'}
                        </span>
                      </div>

                      {/* Matched Users Section */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200/80 space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          મળેલા રજીસ્ટર્ડ એકાઉન્ટ (Linked Accounts found):
                        </p>
                        
                        {req.userMatches && req.userMatches.length > 0 ? (
                          req.userMatches.map((m: any, idx: number) => {
                            const waMsg = encodeURIComponent(
                              `નમસ્તે ${m.name},\n\nDAY INFOTECH પોર્ટલ માટે તમારા લોગિન આઈડી અને પાસવર્ડ નીચે મુજબ છે:\n\nયુઝરનેમ (Username): ${m.username}\nપાસવર્ડ (Password): ${m.password}\n\nતમે આ વિગતો વડે લોગિન કરી શકો છો.`
                            );
                            const waUrl = `https://wa.me/91${req.mobile}?text=${waMsg}`;

                            return (
                              <div key={idx} className="text-xs space-y-1.5 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                                <div className="grid grid-cols-2 gap-1 bg-slate-50 p-2 rounded-md font-medium text-slate-700">
                                  <div><span className="text-slate-400">નામ:</span> <strong className="text-slate-900">{m.name}</strong></div>
                                  <div><span className="text-slate-400">યુઝર:</span> <strong className="text-indigo-700">{m.username}</strong></div>
                                  <div className="col-span-2"><span className="text-slate-400">પાસવર્ડ:</span> <strong className="text-emerald-700 font-mono font-bold">{m.password}</strong></div>
                                </div>
                                
                                {req.status === 'pending' && (
                                  <div className="flex gap-1.5 pt-1">
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black shadow-xs transition-colors"
                                    >
                                      <span>WhatsApp મોકલો</span>
                                    </a>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`Username: ${m.username}, Password: ${m.password}`);
                                        showToast('યુઝરનેમ અને પાસવર્ડ કોપી થયા છે!');
                                      }}
                                      className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                                    >
                                      <span>કોપી</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-[10px] text-rose-600 font-bold italic py-1">
                            આ મોબાઇલ નંબર પર કોઈ પણ અરજદારે રજીસ્ટ્રેશન કર્યું નથી!
                          </p>
                        )}
                      </div>

                      {/* Request Footer Actions */}
                      <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100">
                        {req.status === 'pending' && (
                          <button
                            onClick={async () => {
                              await updateForgotPasswordRequestStatus(req.id, 'resolved');
                              await loadCustomUsersAndRequests();
                              showToast('વિનંતી સફળતાપૂર્વક ઉકેલાયેલ તરીકે માર્ક કરવામાં આવી છે!');
                            }}
                            className="inline-flex items-center text-[10px] font-black px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                          >
                            Resolve (ઉકેલો)
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (window.confirm('શું તમે આ વિનંતી ડિલીટ કરવા માંગો છો?')) {
                              await deleteForgotPasswordRequest(req.id);
                              await loadCustomUsersAndRequests();
                              showToast('વિનંતી ડિલીટ કરવામાં આવી છે.');
                            }
                          }}
                          className="inline-flex items-center text-[10px] font-black px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors cursor-pointer"
                        >
                          Delete (ડિલીટ)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: All Registered Users list */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                  બધા રજીસ્ટર્ડ અરજદારો (All Registered Users)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start">
                  કુલ યુઝર્સ: {customUsers.length}
                </span>
              </div>

              {/* Users search box */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="અરજદારનું નામ, યુઝરનેમ અથવા મોબાઇલ નંબર શોધો..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full text-xs font-bold pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-all"
                />
              </div>

              {customUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-xs font-bold">હજુ સુધી કોઈ અરજદારે રજીસ્ટ્રેશન કર્યું નથી.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {customUsers
                    .filter((u) => {
                      const q = userSearchQuery.toLowerCase();
                      return (
                        (u.name || "").toLowerCase().includes(q) ||
                        (u.username || "").toLowerCase().includes(q) ||
                        String(u.mobile || "").includes(q)
                      );
                    })
                    .map((u, idx) => {
                      const waMsg = encodeURIComponent(
                        `નમસ્તે ${u.name},\n\nDAY INFOTECH પોર્ટલ માટે તમારા લોગિન આઈડી અને પાસવર્ડ નીચે મુજબ છે:\n\nયુઝરનેમ (Username): ${u.username}\nપાસવર્ડ (Password): ${u.password}\n\nતમે આ વિગતો વડે લોગિન કરી શકો છો.`
                      );
                      const waUrl = `https://wa.me/91${u.mobile}?text=${waMsg}`;

                      return (
                        <div 
                          key={idx} 
                          className={`p-4 border rounded-2xl transition-all flex flex-col gap-3.5 ${
                            u.isBlocked 
                              ? 'bg-rose-50/40 border-rose-200/80 shadow-xs animate-pulse-subtle' 
                              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Avatar Display */}
                            <div className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                              {u.profilePic ? (
                                <img src={u.profilePic} alt={u.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-sm">
                                  {u.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black text-slate-800 leading-none">{u.name}</p>
                                {u.isBlocked && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 rounded">
                                    કામચલાઉ બ્લોક (Blocked)
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
                                <span>યુઝરનેમ: <strong className="text-indigo-600 font-bold">{u.username}</strong></span>
                                <span>પાસવર્ડ: <strong className="text-emerald-700 font-bold font-mono">{u.password}</strong></span>
                                <span>મોબાઇલ: <strong className="text-slate-800 font-mono">{u.mobile}</strong></span>
                                {u.dob && typeof u.dob === 'string' && (
                                  <span>જન્મ તારીખ: <strong className="text-slate-800 font-mono">{u.dob.split('-').reverse().join('/')}</strong></span>
                                )}
                                {u.gender && (
                                  <span>જાતિ: <strong className="text-slate-800 font-bold">{u.gender === 'MALE' ? 'પુરુષ' : u.gender === 'FEMALE' ? 'સ્ત્રી' : 'અન્ય'}</strong></span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Customizable Profile Social Card */}
                          {(u.birthPlace || u.bio || u.location || u.education || u.occupation || u.facebookUrl || u.instagramUrl) && (
                            <div className="bg-white/85 rounded-xl p-3 border border-slate-200/80 space-y-2 text-[11px] font-medium text-slate-600 shadow-2xs">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                અરજદાર પ્રોફાઇલ વિગતો (Applicant Profile Info):
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                {u.birthPlace && (
                                  <div>🎂 <span className="text-slate-400">જન્મ સ્થળ:</span> <strong className="text-slate-800">{u.birthPlace}</strong></div>
                                )}
                                {u.location && (
                                  <div>📍 <span className="text-slate-400">રહેઠાણ:</span> <strong className="text-slate-800">{u.location}</strong></div>
                                )}
                                {u.education && (
                                  <div>🎓 <span className="text-slate-400">લાયકાત:</span> <strong className="text-slate-800">{u.education}</strong></div>
                                )}
                                {u.occupation && (
                                  <div>💼 <span className="text-slate-400">વ્યવસાય:</span> <strong className="text-slate-800">{u.occupation}</strong></div>
                                )}
                              </div>

                              {u.bio && (
                                <div className="border-t border-slate-100 pt-2 text-slate-500 italic">
                                  " {u.bio} "
                                </div>
                              )}

                              {(u.facebookUrl || u.instagramUrl) && (
                                <div className="flex items-center gap-3 border-t border-slate-100 pt-2">
                                  {u.facebookUrl && (
                                    <a 
                                      href={u.facebookUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="inline-flex items-center gap-1 text-blue-650 hover:underline text-[10px] font-black"
                                    >
                                      <Facebook className="h-3.5 w-3.5" /> Facebook
                                    </a>
                                  )}
                                  {u.instagramUrl && (
                                    <a 
                                      href={u.instagramUrl.startsWith('http') ? u.instagramUrl : `https://instagram.com/${u.instagramUrl.replace('@', '')}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="inline-flex items-center gap-1 text-pink-650 hover:underline text-[10px] font-black"
                                    >
                                      <Instagram className="h-3.5 w-3.5" /> Instagram ({u.instagramUrl})
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer Info & Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100/80">
                            {u.createdAt ? (
                              <p className="text-[9px] text-slate-400">
                                રજીસ્ટ્રેશન તારીખ: {(() => {
                                  try {
                                    return new Date(u.createdAt).toLocaleString('gu-IN');
                                  } catch (e) {
                                    try {
                                      return new Date(u.createdAt).toLocaleString();
                                    } catch (err) {
                                      return String(u.createdAt);
                                    }
                                  }
                                })()}
                              </p>
                            ) : (
                              <div></div>
                            )}

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black transition-colors"
                              >
                                <span>WhatsApp</span>
                              </a>
                              
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`Username: ${u.username}, Password: ${u.password}`);
                                  showToast('લોગિન વિગતો સફળતાપૂર્વક કોપી થઈ!');
                                }}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                              >
                                કોપી
                              </button>

                              {/* Toggle block status */}
                              <button
                                onClick={async () => {
                                  const targetStatus = !u.isBlocked;
                                  const confirmMsg = targetStatus 
                                    ? `શું તમે ખરેખર "${u.name}" ને કામચલાઉ બ્લોક કરવા માંગો છો? બ્લોક કરેલ અરજદાર પોર્ટલમાં લોગીન નહિ કરી શકે.`
                                    : `શું તમે ખરેખર "${u.name}" ને અનબ્લોક કરવા માંગો છો?`;
                                  if (window.confirm(confirmMsg)) {
                                    try {
                                      await toggleBlockUser(u.username, targetStatus);
                                      await loadCustomUsersAndRequests();
                                      showToast(targetStatus ? 'અરજદારને બ્લોક કરવામાં આવ્યા છે.' : 'અરજદારને અનબ્લોક કરવામાં આવ્યા છે.', 'success');
                                    } catch (e: any) {
                                      showToast(e.message || 'Error updating block status', 'error');
                                    }
                                  }
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                                  u.isBlocked
                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                              >
                                {u.isBlocked ? 'અનબ્લોક' : 'બ્લોક'}
                              </button>

                              {/* Delete permanently */}
                              <button
                                onClick={async () => {
                                  const confirmMsg = `કાયમી નિકાલ (⚠️ ડિલીટ): શું તમે અરજદાર "${u.name}" ને કાયમ માટે ડિલીટ કરવા માંગો છો?\nઆ કર્યા પછી તેમનું રજીસ્ટર્ડ યુઝરનેમ "${u.username}" તરત જ બીજા લોકો માટે ઉપલબ્ધ થઈ જશે.`;
                                  if (window.confirm(confirmMsg)) {
                                    try {
                                      await deleteCustomUser(u.id || u.username);
                                      await loadCustomUsersAndRequests();
                                      showToast('અરજદાર સફળતાપૂર્વક ડિલીટ થયા છે અને યુઝરનેમ રી-યુઝ માટે ઉપલબ્ધ છે!', 'success');
                                    } catch (e: any) {
                                      showToast(e.message || 'Error deleting user', 'error');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                              >
                                ડિલીટ
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

        </div>
      ) : activeTab === 'SERVICES' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 md:p-5 shadow-sm space-y-4">
          {/* Service status management tab */}
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              સેવાઓનું ચાલુ/બંધ સંચાલન (Manage Forms ON/OFF Status)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              અહીંથી બધી સેવાઓ (Forms) લિસ્ટ થયેલી છે. જે સેવા તમે <strong>OFF (બંધ)</strong> કરશો, તે અરજદાર તેના ડેશબોર્ડ પરથી નવું ફોર્મ સબમિટ નહીં કરી શકે, અને ત્યાં <strong>"હાલ પૂરતી આ સેવા બંધ છે"</strong> નો લાલ અક્ષરે મેસેજ બતાવશે.
            </p>
          </div>

          {/* Discounts & Promos Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4 shadow-2xs">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-emerald-600" />
                ગ્રાહકો માટે ડિસ્કાઉન્ટ વ્યવસ્થા (Manage Wallet & UPI Discounts)
              </h3>
              <p className="text-[11px] text-indigo-750 font-bold mt-1">
                વોલેટ અથવા ઓનલાઇન UPI વડે પેમેન્ટ કરવા બદલ ગ્રાહકને મળતું આકર્ષક ડિસ્કાઉન્ટ અહીં સેટ કરો.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs space-y-2">
                <span className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                  <WalletIcon className="h-3.5 w-3.5 text-amber-500" />
                  વોલેટ ડિસ્કાઉન્ટ (Wallet Payment Discount %)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountsState.walletDiscount}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setDiscountsState(prev => ({ ...prev, walletDiscount: val }));
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                  જો ₹૧૦૦ નું ફોર્મ હોય અને વોલેટ ડિસ્કાઉન્ટ {discountsState.walletDiscount}% હોય તો ગ્રાહક પાસેથી માત્ર <strong>₹{100 - discountsState.walletDiscount}</strong> વોલેટ બેલેન્સ કપાશે.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs space-y-2">
                <span className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                  <QrCode className="h-3.5 w-3.5 text-indigo-600" />
                  ઓનલાઇન UPI ડિસ્કાઉન્ટ (UPI Payment Discount %)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountsState.upiDiscount}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setDiscountsState(prev => ({ ...prev, upiDiscount: val }));
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                  જો ₹૧૦૦ નું ફોર્મ હોય અને ઓનલાઇન UPI ડિસ્કાઉન્ટ {discountsState.upiDiscount}% હોય તો ગ્રાહકને સ્કેન કરવા માટે માત્ર <strong>₹{100 - discountsState.upiDiscount}</strong> નો જ QR કોડ જનરેટ થશે.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={async () => {
                  try {
                    await saveServiceDiscounts(discountsState);
                    showToast('વોલેટ અને UPI ઓનલાઇન ડિસ્કાઉન્ટ સક્સેસફુલ અપડેટ કરવામાં આવ્યા છે!', 'success');
                  } catch (err) {
                    showToast('ડિસ્કાઉન્ટ સેવ કરવામાં ભૂલ થઈ.', 'error');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                ડિસ્કાઉન્ટ સેવ કરો (Save Discount %)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {ALL_SERVICES_LIST.map((srv) => {
              const isEnabled = serviceStatuses[srv.type] !== false; // defaults to true
              const IconComp = srv.icon;

              return (
                <div 
                  key={srv.type}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-3 ${
                    isEnabled 
                      ? 'bg-slate-50/40 border-slate-200 hover:border-slate-300' 
                      : 'bg-rose-50/20 border-rose-100/70 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${
                        isEnabled 
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                          : 'bg-rose-50 border-rose-100 text-rose-500'
                      }`}>
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-none">{srv.labelGu}</p>
                        <p className="text-[10px] font-bold text-slate-400 font-mono mt-1 leading-none">{srv.labelEn}</p>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        if (isSavingServices) return;
                        const nextStatuses = { ...serviceStatuses, [srv.type]: !isEnabled };
                        setServiceStatuses(nextStatuses);
                        setIsSavingServices(true);
                        try {
                          await saveServiceStatuses(nextStatuses);
                          showToast(`"${srv.labelGu}" ની સ્થિતિ સફળતાપૂર્વક અપડેટ કરી!`);
                        } catch (e) {
                          console.error(e);
                          showToast('સ્થિતિ અપડેટ કરવામાં કંઈક ભૂલ થઈ.', 'error');
                        } finally {
                          setIsSavingServices(false);
                        }
                      }}
                      disabled={isSavingServices}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Price Setting Box */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80 gap-2">
                    <span className="text-[11px] font-black text-slate-500">સેવા ફી (₹ Service Fee)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-400">₹</span>
                      <input 
                        type="number" 
                        value={pricesState[srv.type] !== undefined ? pricesState[srv.type] : (SERVICE_PRICES[srv.type as FormType] || 0)}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setPricesState(prev => ({ ...prev, [srv.type]: val }));
                        }}
                        className="w-16 px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono font-bold text-right focus:outline-hidden bg-white"
                      />
                      <button
                        onClick={async () => {
                          const pVal = pricesState[srv.type] !== undefined ? pricesState[srv.type] : (SERVICE_PRICES[srv.type as FormType] || 0);
                          const nextPrices = { ...pricesState, [srv.type]: pVal };
                          try {
                            await saveServicePrices(nextPrices);
                            Object.assign(SERVICE_PRICES, nextPrices);
                            showToast(`"${srv.labelGu}" ની ફી ₹${pVal} તરીકે અપડેટ કરવામાં આવી!`, 'success');
                          } catch (e) {
                            showToast('કિંમત સેવ કરવામાં ભૂલ થઈ.', 'error');
                          }
                        }}
                        className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[9px] font-black cursor-pointer transition-all"
                      >
                        સેવ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'SEND_MESSAGE' ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-3.5 md:p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-amber-500" />
              ગ્રાહકોને નોટપેડ દ્વારા સંદેશો મોકલો (Broadcast Note to Customers)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              અહીં લખેલો સંદેશો અને ફોટો બધા અરજદાર (Customer) ના ડેશબોર્ડના ચોથા બોક્સ **"મહત્વપૂર્ણ સૂચનાઓ / અપડેટ્સ (Admin Message)"** માં લાઈવ દેખાશે. તમે કોઈ નવી સેવાની જાહેરાત અથવા સામાન્ય સૂચનાઓ અહી લખીને સેવ કરી શકો છો.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <span>સંદેશો લખો (Write Note/Message) :</span>
              </label>
              <textarea
                value={ownerNoteInput}
                onChange={(e) => setOwnerNoteInput(e.target.value)}
                placeholder="નમસ્તે ગ્રાહકો, નવી સેવાઓ અથવા ખાસ જાણકારી અહી ટાઈપ કરો..."
                className="w-full h-32 text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Broadcast Photo Section */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <span>બ્રોડકાસ્ટ ફોટો / પોસ્ટર ઉમેરો (Add Broadcast Photo/Poster) - વૈકલ્પિક (Optional):</span>
              </label>
              
              {photoError && (
                <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}

              {ownerPhotoInput ? (
                <div className="relative border border-amber-200 rounded-2xl p-4 bg-amber-50/25 max-w-sm">
                  <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs max-h-56 flex items-center bg-white">
                    <img 
                      src={ownerPhotoInput} 
                      alt="Uploaded Broadcast Poster" 
                      className="max-w-full max-h-56 object-contain mx-auto"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerPhotoInput(undefined);
                      setPhotoError(null);
                    }}
                    className="absolute -top-2.5 -right-2.5 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 cursor-pointer shadow-md transition-all active:scale-90"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-[10px] text-emerald-700 font-bold mt-2 font-sans flex items-center gap-1">
                    <Check className="h-3 w-3" /> ફોટો સફળતાપૂર્વક લોડ થયેલ છે.
                  </p>
                </div>
              ) : (
                <div 
                  onClick={() => document.getElementById('broadcast-photo-input')?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-amber-50/5 transition-all duration-300 group max-w-sm"
                >
                  <input 
                    id="broadcast-photo-input"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        setPhotoError('કૃપા કરીને ફક્ત ઈમેજ ફાઈલ (JPG, PNG, WEBP) પસંદ કરો.');
                        return;
                      }
                      if (file.size > 800 * 1024) {
                        setPhotoError('ફાઈલનું કદ ઘણું મોટું છે. કૃપા કરીને 800 KB થી નાની ફાઈલ પસંદ કરો.');
                        return;
                      }
                      setPhotoError(null);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setOwnerPhotoInput(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 group-hover:text-amber-600 group-hover:border-amber-200 transition-all shadow-xs">
                      <Image className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">
                        ક્લિક કરો અથવા ફોટો ફાઇલ પસંદ કરો
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        PNG, JPG, JPEG, WEBP (મહત્તમ કદ: 800 KB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setOwnerNoteInput('');
                  setOwnerPhotoInput(undefined);
                  setPhotoError(null);
                }}
                className="px-4 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95"
              >
                સાફ કરો (Clear)
              </button>
              <button
                onClick={async () => {
                  setIsSavingAnnouncement(true);
                  try {
                    await saveOwnerAnnouncement(ownerNoteInput, ownerPhotoInput);
                    setAnnouncementMsg(ownerNoteInput);
                    setAnnouncementPhoto(ownerPhotoInput);
                    showToast('સંદેશો અને ફોટો સફળતાપૂર્વક અપડેટ અને સેવ કરવામાં આવ્યો છે!', 'success');
                  } catch (e) {
                    console.error(e);
                    showToast('બ્રોડકાસ્ટ સેવ કરવામાં કોઈ ભૂલ આવી.', 'error');
                  } finally {
                    setIsSavingAnnouncement(false);
                  }
                }}
                disabled={isSavingAnnouncement}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black text-xs rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-amber-600/10"
              >
                {isSavingAnnouncement ? (
                  <div className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>સેવ કરો અને મોકલો (Save & Broadcast)</span>
              </button>
            </div>
          </div>
        </div>

          {/* Card 2: Greetings Message for Login Screen */}
          <div className="bg-white rounded-3xl border border-slate-200 p-3.5 md:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
                <Gift className="h-5 w-5 text-indigo-600 animate-pulse" />
                લોગિન સ્ક્રીન ગ્રીટિંગ્સ મેસેજ (Login Screen Greetings Message)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                અહીં લખેલો ગ્રીટિંગ્સ મેસેજ સીધો લોગિન સ્ક્રીન પર મોટો, બોલ્ડ અને આકર્ષક રેન્ડમ કલર્સમાં GIF સ્ટાઇલમાં લાઈવ ચમકતો દેખાશે. તમે કોઈ તહેવારની શુભેચ્છા, ઓફર, અથવા કોઈ ખાસ જાહેરાત અહી લખી શકો છો.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                  <span>ગ્રીટિંગ્સ સંદેશો લખો (Write Greetings Message) :</span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">GIF સ્ટાઇલમાં રેન્ડમ કલર્સ</span>
                </label>
                <textarea
                  value={greetingsInput}
                  onChange={(e) => setGreetingsInput(e.target.value)}
                  placeholder="કોઈ ખાસ ઓફર, તહેવારની હાર્દિક શુભેચ્છાઓ, અથવા નવું અપડેટ અહીં લખો..."
                  className="w-full h-24 text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800">મેસેજ ચાલુ/બંધ (Enable / Disable)</p>
                  <p className="text-[10px] text-slate-500 font-bold">લોગિન સ્ક્રીન પર આ ગ્રીટિંગ્સ સંદેશો બતાવવો કે નહીં તે સેટ કરો.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGreetingsActive(!isGreetingsActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isGreetingsActive ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isGreetingsActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setGreetingsInput('');
                }}
                className="px-4 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95"
              >
                સાફ કરો (Clear)
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsSavingGreetings(true);
                  try {
                    await saveGreetingsMessage(greetingsInput, isGreetingsActive);
                    setGreetingsMsg(greetingsInput);
                    showToast('ગ્રીટિંગ્સ સંદેશો સફળતાપૂર્વક અપડેટ અને સેવ કરવામાં આવ્યો છે!', 'success');
                  } catch (e) {
                    console.error(e);
                    showToast('ગ્રીટિંગ્સ સેવ કરવામાં કોઈ ભૂલ આવી.', 'error');
                  } finally {
                    setIsSavingGreetings(false);
                  }
                }}
                disabled={isSavingGreetings}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
              >
                {isSavingGreetings ? (
                  <div className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>સેવ કરો (Save Greetings)</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'OFFICIAL_WEBSITES' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 md:p-5 shadow-sm space-y-4">
          {/* Official Websites tab */}
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              અધિકૃત સરકારી વેબસાઇટ્સ (Official Government Websites)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              અહીંથી બધી સેવાઓની સત્તાવાર સરકારી વેબસાઇટ્સની સીધી લિંક્સ આપેલ છે. સેવાના નામ પર ક્લિક કરવાથી તમે સીધા જ તે સેવાની અધિકૃત વેબસાઇટ પર પહોંચી જશો.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {OFFICIAL_WEBSITES.map((site, idx) => {
              const IconComp = site.icon;
              return (
                <a
                  key={idx}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-indigo-50/20 hover:border-indigo-200 transition-all flex items-center justify-between gap-2.5 group cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-xl border ${site.bg} ${site.color} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                        {site.nameGu}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 font-mono leading-none">
                        {site.nameEn}
                      </p>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'APPLY_SERVICE' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-3.5 md:p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-sm md:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-650 animate-pulse"></span>
              નવી અરજી કરવા માટે સેવા પસંદ કરો (Select Service to Apply)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              કૃપા કરીને નીચે આપેલ સૂચિમાંથી જે સેવા માટે અરજી કરવી હોય તે સેવા પસંદ કરીને <strong>"+ અરજી કરો"</strong> બટન પર ક્લિક કરો.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
            {ALL_SERVICES_LIST.map((srv) => {
              const isEnabled = serviceStatuses[srv.type] !== false; // defaults to true
              const IconComp = srv.icon;

              return (
                <div 
                  key={srv.type}
                  className={`p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all flex flex-col justify-between gap-1.5 md:gap-2.5 h-full ${
                    isEnabled 
                      ? 'bg-slate-50/30 hover:bg-slate-50/70 border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm' 
                      : 'bg-rose-50/10 border-rose-100/50 opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-1.5 md:gap-2.5">
                    <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl shrink-0 ${
                      isEnabled 
                        ? 'bg-slate-100 text-slate-700' 
                        : 'bg-rose-50 text-rose-400'
                    }`}>
                      <IconComp className="h-3.5 w-3.5 md:h-4.5 md:w-4.5" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-black text-slate-855 leading-tight line-clamp-2">{srv.labelGu}</p>
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 font-mono leading-none truncate">{srv.labelEn}</p>
                      {isEnabled && (
                        <div className="flex flex-col gap-0.5 mt-1 text-left">
                          <p className="text-[9px] md:text-[11px] font-extrabold text-slate-700">ફી: <span className="font-sans font-black text-slate-900">₹{SERVICE_PRICES[srv.type]}</span></p>
                          <div className="text-[8px] md:text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100/75 rounded-md px-1 py-0.5 inline-flex items-center gap-0.5 w-max">
                            <span>વોલેટ:</span>
                            <span className="font-sans font-black">₹{Math.round(SERVICE_PRICES[srv.type] * (100 - discountsState.walletDiscount) / 100)}</span>
                          </div>
                          {discountsState.upiDiscount > 0 && (
                            <div className="text-[8px] md:text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/75 rounded-md px-1 py-0.5 inline-flex items-center gap-0.5 w-max">
                              <span>UPI:</span>
                              <span className="font-sans font-black">₹{Math.round(SERVICE_PRICES[srv.type] * (100 - discountsState.upiDiscount) / 100)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 md:mt-2">
                    {isEnabled ? (
                      <button
                        onClick={() => onAddNew(srv.type)}
                        className={`w-full inline-flex items-center justify-center text-[10px] md:text-[11px] font-black py-1.5 md:py-2 rounded-lg md:rounded-xl text-white shadow-xs transition-all cursor-pointer ${srv.bgClass}`}
                      >
                        + અરજી કરો
                      </button>
                    ) : (
                      <div className="bg-rose-50 border border-rose-100 rounded-lg p-1 text-center">
                        <p className="text-[9px] md:text-[11px] font-black text-rose-600 leading-tight">
                          બંધ છે
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'ABOUT_DAY_INFOTECH' ? (
        <AboutDayInfotech />
      ) : activeTab === 'WALLET' ? (
        <WalletDashboard 
          themeId={themeId} 
          refreshTrigger={refreshTrigger} 
          onRefreshStats={loadWalletStats}
        />
      ) : activeTab === 'PROFILE' && !isOwner() ? (
        <UserProfileCustomizer 
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            if (onUpdateUser) {
              onUpdateUser(updated);
            }
          }}
          showToast={(msg, type) => showToast(msg, type || 'success')}
        />
      ) : activeTab === 'APK_SETTINGS' && isOwner() ? (
        <div className="space-y-6 max-w-4xl mx-auto" id="apk-settings-panel">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                  <Download className="h-5.5 w-5.5 text-indigo-600" />
                  APK ડાઉનલોડ અને વર્ઝન મેનેજમેન્ટ (APK Release & Update Settings)
                </h2>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                અહીંથી તમે એપ્લિકેશનનું લેટેસ્ટ વર્ઝન, ડાઉનલોડ લિંક અથવા સીધું APK અપલોડ કરી શકો છો. ગ્રાહકોને તેમની લૉગિન સ્ક્રીન પર અપડેટ ડાઉનલોડ કરવા માટેનો મેસેજ અને બટન આપોઆપ દેખાશે.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Form: Edit Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                    <span>૧. નવું વર્ઝન કોડ (Latest Version, e.g., 1.0.1) :</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={apkVersionInput}
                    onChange={(e) => setApkVersionInput(e.target.value)}
                    placeholder="વર્ઝન લખો (દા.ત. 1.0.1)"
                    className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 transition-all font-mono"
                  />
                  <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    ચાલુ APK વર્ઝન <strong>{CURRENT_APK_VERSION}</strong> છે. જો તમે અહીં તેનાથી અલગ વર્ઝન (દા.ત. 1.0.1) નાખશો, તો જ APK યુઝર્સને લોગીન સ્ક્રીન પર અપડેટ મેસેજ દેખાશે.
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                    <span>૨. ડાઉનલોડ લિંક (Direct Download Link) :</span>
                  </label>
                  <input
                    type="url"
                    value={apkUrlInput}
                    onChange={(e) => {
                      setApkUrlInput(e.target.value);
                      if (e.target.value) {
                        setApkFileInput(null);
                        setApkFileNameInput('');
                      }
                    }}
                    placeholder="દા.ત. Google Drive, Mediafire અથવા અન્ય ડાઉનલોડ લિંક પેસ્ટ કરો"
                    className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-700">
                      <span>અથવા સીધું APK ફાઇલ અપલોડ કરો (Direct APK Upload) :</span>
                    </label>
                    {apkFileInput && (
                      <button 
                        type="button"
                        onClick={() => {
                          setApkFileInput(null);
                          setApkFileNameInput('');
                        }}
                        className="text-[10px] text-rose-600 font-black hover:underline"
                      >
                        ફાઇલ હટાવો
                      </button>
                    )}
                  </div>
                  
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 transition-all bg-slate-50/30 flex flex-col items-center justify-center space-y-1.5 text-center group cursor-pointer">
                    <input
                      type="file"
                      accept=".apk"
                      disabled={isUploadingApk}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 15 * 1024 * 1024) {
                            showToast(language === 'gu' ? 'તમે ૧૫ MB થી મોટી ફાઇલ પસંદ કરી છે!' : 'You selected a file larger than 15MB!', 'error');
                            return;
                          }
                          setApkFileNameInput(file.name);
                          setIsUploadingApk(true);
                          
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const result = event.target?.result as string;
                              const response = await fetch('/api/upload-apk', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  fileData: result,
                                  fileName: file.name
                                })
                              });
                              
                              if (!response.ok) {
                                throw new Error('Upload failed');
                              }
                              
                              const data = await response.json();
                              if (data.success && data.downloadUrl) {
                                setApkFileInput(data.downloadUrl);
                                setApkUrlInput(data.downloadUrl);
                                setApkFileNameInput(data.fileName);
                                showToast(language === 'gu' ? 'APK ફાઇલ સર્વર પર સફળતાપૂર્વક અપલોડ થઈ ગઈ!' : 'APK file uploaded to server successfully!', 'success');
                              } else {
                                throw new Error('Upload returned unsuccessful status');
                              }
                            } catch (err) {
                              console.error('APK upload error:', err);
                              showToast(language === 'gu' ? 'APK અપલોડ કરવામાં ભૂલ આવી! કૃપા કરીને ફરીથી પ્રયાસ કરો.' : 'Failed to upload APK! Please try again.', 'error');
                            } finally {
                              setIsUploadingApk(false);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {isUploadingApk ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                        <div className="text-xs font-black text-indigo-700 animate-pulse">
                          {language === 'gu' ? 'સર્વર પર અપલોડ થઈ રહ્યું છે... (કૃપા કરીને રાહ જુઓ)' : 'Uploading to server... (Please wait)'}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <div className="text-xs font-black text-slate-700">
                          {apkFileNameInput ? apkFileNameInput : (language === 'gu' ? 'APK ફાઇલ પસંદ કરો અથવા ડ્રેગ કરો' : 'Select or Drag APK file')}
                        </div>
                        <div className="text-[9px] text-slate-400 font-bold font-mono">
                          મહત્તમ ફાઇલ સાઇઝ મર્યાદા: ૧૫ MB (ઝડપી અપલોડ માટે ઑપ્ટિમાઇઝ કરેલ)
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={async () => {
                      if (!apkVersionInput.trim()) {
                        showToast(language === 'gu' ? 'કૃપા કરીને વર્ઝન કોડ લખો!' : 'Please enter version code!', 'error');
                        return;
                      }
                      if (!apkUrlInput.trim()) {
                        showToast(language === 'gu' ? 'કૃપા કરીને ડાઉનલોડ લિંક અથવા APK ફાઇલ આપો!' : 'Please provide download link or APK file!', 'error');
                        return;
                      }

                      setIsSavingApk(true);
                      try {
                        await saveApkConfig({
                          version: apkVersionInput.trim(),
                          downloadUrl: apkUrlInput.trim(),
                          fileName: apkFileNameInput || 'GujaratForm_Update.apk'
                        });
                        await loadApkConfigData();
                        showToast(language === 'gu' ? 'APK અપડેટ સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવી!' : 'APK update settings saved successfully!', 'success');
                      } catch (err) {
                        console.error(err);
                        showToast(language === 'gu' ? 'સાચવવામાં નિષ્ફળતા મળી!' : 'Failed to save settings!', 'error');
                      } finally {
                        setIsSavingApk(false);
                      }
                    }}
                    disabled={isSavingApk}
                    className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                  >
                    {isSavingApk ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>સેવ થઈ રહ્યું છે...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>અપડેટ સાચવો (Save Settings)</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('DASHBOARD')}
                    className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                  >
                    પાછા જાઓ
                  </button>
                </div>
              </div>

              {/* Right: Preview & Simulation Dashboard */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="border-b border-slate-200/60 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                    લાઈવ પ્રિવ્યુ અને ટેસ્ટીંગ સિમ્યુલેટર
                  </h3>
                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 border border-emerald-100 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                    યુઝર કઈ ડિવાઇસ અથવા પ્લેટફોર્મ પરથી ખોલે છે તેના આધારે લોગીન સ્ક્રીન કેવી દેખાશે તેનું અહીં ટેસ્ટીંગ કરો:
                  </div>

                  {/* Simulator Toggles */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-200/50 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        safeSetLocalStorage('is_apk_client', 'false');
                        // simple state retrigger by calling loading again
                        loadApkConfigData();
                        showToast(language === 'gu' ? 'વેબ એપ્લિકેશન મોડ સેટ થયો!' : 'Web App mode simulated!', 'success');
                      }}
                      className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                        safeGetLocalStorage('is_apk_client') !== 'true'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-slate-600 hover:text-indigo-950'
                      }`}
                    >
                      Web App (બ્રાઉઝર મોડ)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        safeSetLocalStorage('is_apk_client', 'true');
                        loadApkConfigData();
                        showToast(language === 'gu' ? 'APK એપ્લિકેશન મોડ સેટ થયો!' : 'APK Client mode simulated!', 'success');
                      }}
                      className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                        safeGetLocalStorage('is_apk_client') === 'true'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-slate-600 hover:text-indigo-950'
                      }`}
                    >
                      APK Client (મોબાઇલ એપ મોડ)
                    </button>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="border border-slate-200 rounded-2xl bg-white p-4 shadow-inner space-y-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                      Login Screen Interface Preview
                    </div>

                    {safeGetLocalStorage('is_apk_client') === 'true' ? (
                      apkVersionInput && apkVersionInput !== CURRENT_APK_VERSION ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-fade-in">
                          <div className="flex gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-[11px] font-black text-amber-900 leading-tight">
                                એપ્લિકેશન અપડેટ ઉપલબ્ધ છે! (v{apkVersionInput})
                              </h4>
                              <p className="text-[10px] font-medium text-amber-700 leading-normal mt-0.5">
                                એપ્લિકેશનનું નવું વર્ઝન (v{apkVersionInput}) ઉપલબ્ધ છે. વધુ સારા અનુભવ માટે કૃપા કરીને નીચેના બટનથી નવું વર્ઝન ડાઉનલોડ કરો.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={downloadApkFile}
                            className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download className="h-3 w-3" />
                            નવું વર્ઝન અપડેટ કરો
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                          <p className="text-[11px] font-black text-slate-700">એપ્લિકેશન સંપૂર્ણ અપડેટ છે (v{CURRENT_APK_VERSION})</p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">APK પ્લેટફોર્મ પર કોઈ ડાઉનલોડ બટન દેખાશે નહીં.</p>
                        </div>
                      )
                    ) : (
                      <div className="space-y-2.5">
                        <div className="p-2 bg-slate-50 border border-slate-150 rounded-lg text-center text-[10px] font-semibold text-slate-600">
                          બ્રાઉઝરમાં ગ્રાહકોને ગુગલ લોગીનની નીચે આ બટન કાયમ દેખાશે:
                        </div>
                        <button
                          type="button"
                          onClick={downloadApkFile}
                          className="w-full py-3 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer group"
                        >
                          <Download className="h-4 w-4 text-indigo-600 group-hover:text-white shrink-0 transition-transform group-hover:translate-y-0.5" />
                          <span>એન્ડ્રોઇડ એપ ડાઉનલોડ કરો (Download APK v{apkVersionInput || '1.0.0'})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}


      {/* ================= VIEW & PRINT MODAL ================= */}
      <AnimatePresence>
        {viewingEntry && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-4 md:p-10 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden relative"
            >
              
              {/* Modal Banner */}
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                    ID: {viewingEntry.id}
                  </span>
                  <h2 className="text-lg font-bold font-display mt-1">
                    અરજી વિગતો અને પહોંચ (Application Slip)
                  </h2>
                </div>
                <button
                  onClick={() => setViewingEntry(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Printable Receipt Workspace */}
              <div className="p-6 md:p-8 space-y-8 max-h-[70vh] overflow-y-auto" id="print-receipt-content">
                
                {(() => {
                  const matchedUser = viewingEntry.userId ? customUsers.find(u => u.uid === viewingEntry.userId || u.username === viewingEntry.userId.replace('custom_', '')) : null;
                  if (!isOwner() || !matchedUser) return null;
                  return (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50/55 border border-indigo-100 rounded-2xl p-4 shadow-xs no-print mb-6">
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2.5 mb-3">
                        <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                        <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                          અરજદારની પ્રોફાઇલ (Applicant Profile)
                        </h3>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Profile Pic */}
                        <div className="h-14 w-14 rounded-full border-2 border-white shadow-sm bg-indigo-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {matchedUser.profilePic ? (
                            <img src={matchedUser.profilePic} alt={matchedUser.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-indigo-700 font-black text-lg">
                              {matchedUser.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        
                        {/* Details Grid */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-sm font-black text-slate-800">{matchedUser.name || 'અનામી અરજદાર'}</span>
                            <span className="text-[10px] font-bold font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">@{matchedUser.username}</span>
                            {matchedUser.mobile && (
                              <span className="text-xs font-mono text-indigo-600 font-bold">{matchedUser.mobile}</span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-[11px] font-medium text-slate-600 pt-0.5">
                            {matchedUser.occupation && (
                              <div>💼 <span className="text-slate-400">વ્યવસાય:</span> <strong className="text-slate-800">{matchedUser.occupation}</strong></div>
                            )}
                            {matchedUser.location && (
                              <div>📍 <span className="text-slate-400">રહેઠાણ:</span> <strong className="text-slate-800">{matchedUser.location}</strong></div>
                            )}
                            {matchedUser.education && (
                              <div>🎓 <span className="text-slate-400">લાયકાત:</span> <strong className="text-slate-800">{matchedUser.education}</strong></div>
                            )}
                            {matchedUser.birthPlace && (
                              <div>🎂 <span className="text-slate-400">જન્મ સ્થળ:</span> <strong className="text-slate-800">{matchedUser.birthPlace}</strong></div>
                            )}
                          </div>
                          
                          {matchedUser.bio && (
                            <div className="text-[11px] text-slate-500 italic border-t border-indigo-100/50 pt-1.5 mt-1">
                              " {matchedUser.bio} "
                            </div>
                          )}
                          
                          {(matchedUser.facebookUrl || matchedUser.instagramUrl) && (
                            <div className="flex items-center gap-4 pt-1">
                              {matchedUser.facebookUrl && (
                                <a href={matchedUser.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-650 hover:underline text-[10px] font-bold">
                                  <Facebook className="h-3.5 w-3.5" /> Facebook
                                </a>
                              )}
                              {matchedUser.instagramUrl && (
                                <a href={matchedUser.instagramUrl.startsWith('http') ? matchedUser.instagramUrl : `https://instagram.com/${matchedUser.instagramUrl.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pink-650 hover:underline text-[10px] font-bold">
                                  <Instagram className="h-3.5 w-3.5" /> Instagram ({matchedUser.instagramUrl})
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {viewingEntry.status === 'DRAFT' && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-amber-950 shadow-xs flex items-start gap-3 no-print">
                    <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                      <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-sm font-black text-amber-900 font-sans">
                        આ અરજી હજુ ડ્રાફ્ટ (અપૂર્ણ) સ્થિતિમાં છે! (This application is still in Draft status!)
                      </p>
                      <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                        અરજદારે હજુ સુધી આ અરજી ફાઇનલ સબમિટ (Final Submit) કરી નથી. તેથી આ વિગતો અને અપલોડ કરેલા દસ્તાવેજો અધૂરા હોઈ શકે છે.
                      </p>
                      {isOwner() && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const url = getApplicantNotificationWhatsAppUrl(viewingEntry);
                              window.open(url, '_blank');
                            }}
                            className="inline-flex px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                              <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                            </svg>
                            <span>અરજી પૂર્ણ કરવા વોટ્સએપ મોકલો (Notify to Complete Draft)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {viewingEntry.status === 'REJECTED' && viewingEntry.rejectionReason && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-950 shadow-xs flex items-start gap-3 no-print">
                    <div className="p-1.5 bg-red-100 rounded-lg text-red-700 shrink-0">
                      <XCircle className="h-5 w-5 text-red-650" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-red-900 font-sans">
                        અરજી નામંજૂર કરેલ છે! (Application Rejected!)
                      </p>
                      <p className="bg-white/80 px-3 py-2 rounded-lg border border-red-200 text-xs font-bold text-red-700 leading-relaxed">
                        "{viewingEntry.rejectionReason}"
                      </p>
                      <p className="text-[10px] text-red-500 font-medium">
                        * જો કોઈ વિગતો અથવા દસ્તાવેજોમાં સુધારો કરવો હોય, તો તમે તમારી અરજીને સુધારીને ફરીથી સબમિટ કરી શકો છો અથવા એડમિનનો સંપર્ક કરો.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Print Sheet Header */}
                <div className="border-4 border-double border-slate-900 p-5 rounded-2xl relative bg-white">
                  
                  {/* Government Stamp watermark visual */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award className="h-96 w-96 text-slate-900" />
                  </div>

                  <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                    <p className="text-xs font-bold tracking-widest text-slate-600 font-sans">
                      જિલ્લા સેવાસદન, ગુજરાત સરકાર (DISTRICT SEVASADAN, GOVT. OF GUJARAT)
                    </p>
                    <h1 className="text-xl md:text-2xl font-black font-display text-slate-900 tracking-tight uppercase">
                      DAY INFOTECH FORM SERVICES
                    </h1>
                    <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-500 font-sans pt-1">
                      <span>તારીખ (Date): {safeFormatLocalDate(viewingEntry.updatedAt)}</span>
                      <span>•</span>
                      <span>સ્થિતિ (Status): <strong className="text-slate-800">{viewingEntry.status}</strong></span>
                    </div>
                  </div>

                  {/* Top Photo section and Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-5">
                    
                    {/* Passport Photo Frame if exists */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-slate-300 border-dashed rounded-lg p-2 bg-slate-50 h-44 w-36 mx-auto">
                      {viewingEntry.documents.passportPhoto ? (
                        <img 
                          src={viewingEntry.documents.passportPhoto.dataUrl} 
                          alt="Passport Photo" 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover rounded shadow-xs" 
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center font-bold">પાસપોર્ટ સાઇઝ ફોટો અહિયાં ચોંટાડો<br/>(Passport Photo)</span>
                      )}
                    </div>

                    {/* Metadata summary */}
                    <div className="md:col-span-3 space-y-4">
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-bold">અરજીનો પ્રકાર (Form Type)</p>
                          <p className="text-sm font-black text-slate-900 mt-0.5">{getFormName(viewingEntry.formType)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold">અરજી આઈડી (Application ID)</p>
                          <p className="text-sm font-black font-mono text-slate-900 mt-0.5">{viewingEntry.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-bold">અરજદારનું નામ (Applicant Name)</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{getApplicantName(viewingEntry)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold">મોબાઇલ નંબર (Mobile No)</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{viewingEntry.details.mobile || '-'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
                        <div>
                          <p className="text-slate-400 font-bold">જન્મ તારીખ (Date of Birth)</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                            {safeFormatLocalDate(viewingEntry.details.dob)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold">ઇમેઇલ એડ્રેસ (Email Address)</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 font-sans">{viewingEntry.details.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold">જાતિ (Gender)</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 font-sans">
                            {viewingEntry.details.gender === 'MALE' ? 'MALE (પુરુષ)' : viewingEntry.details.gender === 'FEMALE' ? 'FEMALE (સ્ત્રી)' : viewingEntry.details.gender === 'OTHER' ? 'OTHER (અન્ય)' : '-'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Section 2: Detailed Parameters based on form type */}
                  <div className="border-t border-slate-300 mt-6 pt-4">
                    <h3 className="text-xs font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded font-sans uppercase tracking-wider mb-3">
                      અરજી પત્રકની વિગતવાર માહિતી (Detailed Application Data)
                    </h3>

                    {viewingEntry.formType === 'PAN_CARD' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાનું પ્રથમ નામ (Father First Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as PanCardDetails).fatherFirstName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાનું મધ્યમ નામ (Father Middle Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as PanCardDetails).fatherMiddleName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાની અટક (Father Last Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as PanCardDetails).fatherLastName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જન્મ પુરાવાનો પ્રકાર (Birth Proof Type):</span>
                          <span className="font-bold text-indigo-700 font-sans">
                            {(viewingEntry.documents as PanCardDocs).birthProofType === 'BIRTH_CERTIFICATE' ? 'જન્મ પ્રમાણપત્ર' : 'મતદાર આઈડી'}
                          </span>
                        </div>
                      </div>
                    )}

                    
                    {viewingEntry.formType === 'PAN_CARD_CORRECTION' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જૂનો પેન કાર્ડ નંબર (Old PAN Card No):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).oldPanCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સુધારાની વિગતો (Correction Details):</span>
                          <span className="font-bold text-slate-900 uppercase">{((viewingEntry.details as any).correctionDetails || []).join(', ') || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જન્મ પુરાવાનો પ્રકાર (Birth Proof Type):</span>
                          <span className="font-bold text-indigo-700 font-sans">
                            {(viewingEntry.documents as any).birthProofType === 'BIRTH_CERTIFICATE' ? 'જન્મ પ્રમાણપત્ર' : 'મતદાર આઈડી'}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'MINOR_PAN_CARD' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પ્રતિનિધિ (Representative):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).representative || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પ્રતિનિધિનું નામ (Rep. Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{((viewingEntry.details as any).repFirstName || '') + ' ' + ((viewingEntry.details as any).repLastName || '')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પ્રતિનિધિ હોદ્દો (Rep. Designation):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).repDesignation || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પ્રતિનિધિનો દસ્તાવેજ (Rep. Doc Type):</span>
                          <span className="font-bold text-indigo-700 font-sans">
                            {(viewingEntry.documents as any).repDocType === 'AADHAR_CARD' ? 'આધાર કાર્ડ' : 'પેન કાર્ડ'}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'VOTER_ID_CORRECTION' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જૂનો ચૂંટણી કાર્ડ નંબર (Old Epic No):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).oldEpicCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સુધારાની વિગતો (Correction Details):</span>
                          <span className="font-bold text-slate-900 uppercase">{((viewingEntry.details as any).correctionDetails || []).join(', ') || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનો પ્રકાર (Relative Type):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).relativeType || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનું નામ (Relative Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{((viewingEntry.details as any).relativeFirstName || '') + ' ' + ((viewingEntry.details as any).relativeLastName || '')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનો ચૂંટણી કાર્ડ નંબર (Relative Epic No):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).relativeEpicCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જન્મ પુરાવાનો પ્રકાર (Birth Proof Type):</span>
                          <span className="font-bold text-indigo-700 font-sans">
                            {(viewingEntry.documents as any).birthProofType === 'BIRTH_CERTIFICATE' ? 'જન્મ પ્રમાણપત્ર' : 'શાળા છોડ્યાનું પ્રમાણપત્ર'}
                          </span>
                        </div>
                      </div>
                    )}

                    
                            {viewingEntry.formType === 'PAN_CARD_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).signature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'MINOR_PAN_CARD' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repSignature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repPanCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'VOTER_ID_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).addressProof ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}

                              {viewingEntry.formType === 'VOTER_ID' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સગાં સંબંધીનો પ્રકાર (Relative Type):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as VoterIdDetails).relativeType || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનું પ્રથમ નામ (Relative First Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as VoterIdDetails).fatherFirstName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનું મધ્યમ નામ (Relative Middle Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as VoterIdDetails).fatherMiddleName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીની અટક (Relative Last Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as VoterIdDetails).fatherLastName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">સંબંધીનો EPIC નંબર (Relative EPIC Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as VoterIdDetails).relativeEpicNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જન્મ પુરાવાનો પ્રકાર (Birth Proof Type):</span>
                          <span className="font-bold text-indigo-700 font-sans">
                            {(viewingEntry.documents as VoterIdDocs).birthProofType === 'BIRTH_CERTIFICATE' ? 'જન્મ પ્રમાણપત્ર' : 'શાળા છોડ્યાનું પ્રમાણપત્ર'}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'E_SHRAM' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">બેંક ખાતા નંબર (Account Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as EShramDetails).bankAccountNum || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">બેંક IFSC કોડ (IFSC Code):</span>
                          <span className="font-bold text-slate-900 font-mono uppercase">{(viewingEntry.details as EShramDetails).bankIfsc || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ખાતાધારકનું નામ (Account Holder Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as EShramDetails).bankHolderName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">વ્યવસાય/કામની વિગતો (Occupation):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as EShramDetails).occupation || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'FARMER_SUBSIDY' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ગામનું નામ (Village Name):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as FarmerSubsidyDetails).villageName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">તાલુકો / પેટા-જિલ્લો (Sub-District):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as FarmerSubsidyDetails).subDistrict || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જિલ્લો (District):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as FarmerSubsidyDetails).district || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ખાતા નંબર / સર્વે નંબર (Survey Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as FarmerSubsidyDetails).surveyNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પસંદ કરેલ સબસિડી યોજના (Subsidy Scheme):</span>
                          <span className="font-bold text-lime-700 bg-lime-50 px-2 py-0.5 rounded">{(viewingEntry.details as FarmerSubsidyDetails).subsidyScheme || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">બેંક ખાતા નંબર (Account Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as FarmerSubsidyDetails).bankAccountNum || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">બેંક IFSC કોડ:</span>
                          <span className="font-bold text-slate-900 font-mono uppercase">{(viewingEntry.details as FarmerSubsidyDetails).bankIfsc || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'CAST_CERTIFICATE' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">પ્રમાણપત્ર મેળવવાનો હેતુ (Purpose):</span>
                          <span className="font-bold text-slate-950 font-sans">{(viewingEntry.details as any).purpose || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાનું પ્રથમ નામ (Father First Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).fatherFirstName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાનું મધ્યમ નામ (Father Middle Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).fatherMiddleName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાની અટક (Father Last Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).fatherLastName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જ્ઞાતિ / વર્ગ (Caste Category):</span>
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-sans uppercase">{(viewingEntry.details as any).caste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પેટા જ્ઞાતિ (Sub Caste):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as any).subCaste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાની જ્ઞાતિ (Father Caste):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).fatherCaste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાની પેટા જ્ઞાતિ (Father Sub Caste):</span>
                          <span className="font-bold text-slate-900">{(viewingEntry.details as any).fatherSubCaste || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'INCOME_CERTIFICATE' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">પ્રમાણપત્ર મેળવવાનો હેતુ (Purpose):</span>
                          <span className="font-bold text-slate-950 font-sans">{(viewingEntry.details as any).purpose || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">રેશનકાર્ડ નંબર (Ration Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).rationCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">રેશનકાર્ડ મેમ્બર આઈડી (Member ID):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).rationCardMemberId || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'AYUSHYMAN_CARD' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">રેશનકાર્ડ નંબર (Ration Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).rationCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">આધાર કાર્ડ નંબર (Aadhar Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).aadharCardNumber || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'AABHA_CARD' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">આધાર કાર્ડ નંબર (Aadhar Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).aadharCardNumber || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'UDHYAM_AADHAR' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">વ્યવસાયનું નામ (Business Name):</span>
                          <span className="font-bold text-slate-950 font-sans uppercase">{(viewingEntry.details as any).businessName || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">વ્યવસાયની શ્રેણી (Business Category):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as any).businessCategory === 'SERVICE' ? 'SERVICE (સેવા)' : 'TRADING (વેપાર)'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">આધાર કાર્ડ નંબર (Aadhar Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).aadharCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પાનકાર્ડ નંબર (PAN Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono uppercase">{(viewingEntry.details as any).panCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">બેંક ખાતા નંબર (Bank Account Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as any).bankAccountNum || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">બેંક IFSC કોડ (Bank IFSC Code):</span>
                          <span className="font-bold text-slate-900 font-mono uppercase">{(viewingEntry.details as any).bankIfsc || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">ખાતાધારકનું નામ (Account Holder Name):</span>
                          <span className="font-bold text-slate-900 uppercase">{(viewingEntry.details as any).bankHolderName || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'OTHER_SERVICE' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100 col-span-1 md:col-span-2">
                          <span className="text-slate-500 font-medium">પસંદ કરેલ સેવાનું નામ (Required Service Name):</span>
                          <span className="font-bold text-slate-950 font-sans">{(viewingEntry.details as any).serviceName || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'MANAV_KALYAN' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">જાતિ / જ્ઞાતિ (Caste):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as ManavKalyanDetails).caste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યોજના / સાધન સહાય (Scheme/Kit):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as ManavKalyanDetails).scheme || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">આધાર કાર્ડ નંબર (Aadhaar Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as ManavKalyanDetails).aadharCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">રેશનકાર્ડ નંબર (Ration Card Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as ManavKalyanDetails).rationCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">રેશનકાર્ડ સભ્ય ID (Ration Card Member ID):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as ManavKalyanDetails).rationCardMemberId || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ઈ-શ્રમ કાર્ડ નંબર (e-Shram Number):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as ManavKalyanDetails).eshramCardNumber || '-'}</span>
                        </div>
                      </div>
                    )}

                    {viewingEntry.formType === 'KUVAR_BAI_MAMERU' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યાનું નામ (Kanya Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પતિનું નામ (Husband Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaPatiFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaPatiMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaPatiLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યાના પિતાનું નામ (Father Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaPitaFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaPitaMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaPitaLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યાના માતાનું નામ (Mother Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaMataFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaMataMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).kanyaMataLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યાની જન્મતારીખ (Kanya DOB):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaDob || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યાની જાતિ / જ્ઞાતિ (Caste):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaCaste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">પિતાની વાર્ષિક આવક (Father's Annual Income):</span>
                          <span className="font-bold text-slate-950 font-sans">₹ {(viewingEntry.details as KuvarBaiMameruDetails).kanyaPitaIncome || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવકની જન્મતારીખ (Yuvak DOB):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakDob || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવકના પિતાનું નામ (Yuvak Father Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakPitaFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).yuvakPitaMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).yuvakPitaLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવકની માતાનું નામ (Yuvak Mother Name):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakMataFirstName} {(viewingEntry.details as KuvarBaiMameruDetails).yuvakMataMiddleName} {(viewingEntry.details as KuvarBaiMameruDetails).yuvakMataLastName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યા રેશનકાર્ડ નંબર (Kanya Ration Card):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaRationCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવક રેશનકાર્ડ નંબર (Yuvak Ration Card):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakRationCardNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">કન્યા પિતા આધાર (Kanya Father Aadhaar):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).kanyaPitaAadharNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવક પિતા આધાર (Yuvak Father Aadhaar):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakPitaAadharNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">યુવકની જાતિ / જ્ઞાતિ (Yuvak Caste):</span>
                          <span className="font-bold text-slate-950">{(viewingEntry.details as KuvarBaiMameruDetails).yuvakCaste || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">લગ્ન તારીખ (Marriage Date):</span>
                          <span className="font-bold text-slate-900 font-mono">{(viewingEntry.details as KuvarBaiMameruDetails).marriageDate || '-'}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Section 3: Attachment Checklist Checkmark Box */}
                  <div className="border-t border-slate-300 mt-6 pt-4">
                    <h3 className="text-xs font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded font-sans uppercase tracking-wider mb-2">
                      અપલોડ કરેલ દસ્તાવેજોની ચકાસણી (Attached Document Checklist)
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
                      
                      {/* Aadhaar Card Front Check */}
                      <div className="flex items-center space-x-2">
                        <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                          {viewingEntry.documents.aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                        </div>
                        <span className="text-slate-700">આધાર કાર્ડ Front</span>
                      </div>

                      {/* Aadhaar Card Back Check */}
                      <div className="flex items-center space-x-2">
                        <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                          {viewingEntry.documents.aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                        </div>
                        <span className="text-slate-700">આધાર કાર્ડ Back</span>
                      </div>

                      {/* Photo check for all except farmer & MSME */}
                      {viewingEntry.formType !== 'FARMER_SUBSIDY' && viewingEntry.formType !== 'UDHYAM_AADHAR' && (
                        <div className="flex items-center space-x-2">
                          <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                            {viewingEntry.documents.passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                          </div>
                          <span className="text-slate-700">પાસપોર્ટ ફોટો (Passport Photo)</span>
                        </div>
                      )}

                      {/* PAN Card Details specific checks */}
                      {viewingEntry.formType === 'PAN_CARD' && (
                        <>
                          {(viewingEntry.documents as PanCardDocs).birthProofType === 'BIRTH_CERTIFICATE' ? (
                            <div className="flex items-center space-x-2">
                              <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                                {(viewingEntry.documents as PanCardDocs).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </div>
                              <span className="text-slate-700">જન્મ પ્રમાણપત્ર (Birth Certificate)</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2">
                                <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                                  {(viewingEntry.documents as PanCardDocs).voterIdFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                </div>
                                <span className="text-slate-700">મતદાર આઈડી કાર્ડ આગળ (Voter ID Front)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                                  {(viewingEntry.documents as PanCardDocs).voterIdBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                </div>
                                <span className="text-slate-700">મતદાર આઈડી કાર્ડ પાછળ (Voter ID Back)</span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as PanCardDocs).signature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">અરજદારની સહી (Signature)</span>
                          </div>
                        </>
                      )}

                      {/* Voter ID specific checks */}
                      
                            {viewingEntry.formType === 'PAN_CARD_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).signature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'MINOR_PAN_CARD' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repSignature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repPanCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'VOTER_ID_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).addressProof ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}

                              {viewingEntry.formType === 'VOTER_ID' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as VoterIdDocs).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">જન્મ તારીખ પુરાવો (Birth Proof)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as VoterIdDocs).relativeEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">સંબંધી EPIC Front</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as VoterIdDocs).relativeEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">સંબંધી EPIC Back</span>
                          </div>
                        </>
                      )}

                      {/* E Shram Card checks */}
                      {viewingEntry.formType === 'E_SHRAM' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as EShramDocs).bankPassbook ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">બેંક પાસબુક (Bank Passbook)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as EShramDocs).panCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">પેન કાર્ડ - વૈકલ્પિક (PAN Card - Opt)</span>
                          </div>
                        </>
                      )}

                      {/* Farmer Subsidy Scheme checks */}
                      {viewingEntry.formType === 'FARMER_SUBSIDY' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as FarmerSubsidyDocs).landDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">જમીનના નકશા 7/12-8A (7/12 Land Doc)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as FarmerSubsidyDocs).bankPassbook ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">બેંક પાસબુક (Bank Passbook)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as FarmerSubsidyDocs).casteCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">જાતિ પ્રમાણપત્ર - વૈકલ્પિક (Caste Cert - Opt)</span>
                          </div>
                        </>
                      )}

                      {/* Cast Certificate checks */}
                      {viewingEntry.formType === 'CAST_CERTIFICATE' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).rationCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">રેશનકાર્ડ (Ration Card)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).schoolLeaving ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">શાળા છોડ્યાનું પ્રમાણપત્ર (L.C.)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).fatherSchoolLeaving ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">પિતાનું L.C. પ્રમાણપત્ર (Father L.C.)</span>
                          </div>
                        </>
                      )}

                      {/* Income Certificate checks */}
                      {viewingEntry.formType === 'INCOME_CERTIFICATE' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).electricityBill ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">લાઇટ બિલ (Electricity Bill)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).rationCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">રેશનકાર્ડ આગળ (Ration Card Front)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).rationCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">રેશનકાર્ડ પાછળ (Ration Card Back)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).otherDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">અન્ય પુરાવો (Other Doc)</span>
                          </div>
                        </>
                      )}

                      {/* Ayushman Card checks */}
                      {viewingEntry.formType === 'AYUSHYMAN_CARD' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).rationCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">રેશનકાર્ડ (Ration Card)</span>
                          </div>
                        </>
                      )}

                      {/* Udhyam Aadhar checks */}
                      {viewingEntry.formType === 'UDHYAM_AADHAR' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).panCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">પાનકાર્ડ (PAN Card)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).bankPassbook ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">બેંક પાસબુક / ચેક</span>
                          </div>
                        </>
                      )}

                      {/* Other Services checks */}
                      {viewingEntry.formType === 'OTHER_SERVICE' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as any).supportingDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">સહાયક પુરાવો (Supporting Doc)</span>
                          </div>
                        </>
                      )}

                      {/* Kuvar Bai Mameru checks */}
                      {viewingEntry.formType === 'KUVAR_BAI_MAMERU' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).kanyaPassportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">કન્યા ફોટો (Bride Photo)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).yuvakPassportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">યુવક ફોટો (Groom Photo)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).kanyaAadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">કન્યા આધાર (Bride Aadhaar)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).yuvakAadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">યુવક આધાર (Groom Aadhaar)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).kanyaSchoolLeaving ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">કન્યા શાળા પ્રમાણપત્ર (Bride L.C.)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).kanyaPitaIncomeCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">પિતાનું આવક પ્રમાણપત્ર (Father Income)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).kanyaBankPassbook ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">કન્યા બેંક પાસબુક (Bride Passbook)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).marriageCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">લગ્નનું પ્રમાણપત્ર (Marriage Cert)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-4.5 w-4.5 border border-slate-400 bg-slate-50 rounded flex items-center justify-center text-emerald-600">
                              {(viewingEntry.documents as KuvarBaiMameruDocs).selfDeclaration ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                            </div>
                            <span className="text-slate-700">સ્વ-ઘોષણાપત્ર (Self Declaration)</span>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  {/* Section 3: Payment Details Section */}
                  <div className="border-t border-slate-300 mt-6 pt-4">
                    <h3 className="text-xs font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded font-sans uppercase tracking-wider mb-3">
                      ચુકવણીની વિગત (Payment Details Summary)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100 sm:border-none">
                        <span className="text-slate-500 font-medium">ફી રકમ (Fees Amount):</span>
                        <span className="font-bold text-slate-950 font-sans">
                          ₹ {viewingEntry.paymentAmount !== undefined ? viewingEntry.paymentAmount : '0'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100 sm:border-none">
                        <span className="text-slate-500 font-medium">ચુકવણી મોડ (Payment Mode):</span>
                        <span className="font-bold text-indigo-700">
                          {viewingEntry.paymentMode === 'CASH' ? 'CASH (રોકડ)' :
                           viewingEntry.paymentMode === 'ONLINE' ? 'ONLINE (ઓનલાઇન)' :
                           viewingEntry.paymentMode === 'FREE' ? 'FREE (મફત)' : 'FREE / CASH / ONLINE'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100 sm:border-none">
                        <span className="text-slate-500 font-medium">ચુકવણી સ્થિતિ (Payment Status):</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED'
                            ? 'ચૂકવેલ (PAID)'
                            : 'બાકી (PENDING)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp / Sign section */}
                  <div className="mt-12 flex justify-between items-end text-[11px] text-slate-500 font-sans px-2">
                    <div className="text-center">
                      <p className="border-b border-slate-400 w-36 mb-1 mx-auto"></p>
                      <p>અرજદારની સહી / અંગૂઠો</p>
                      <p>(Applicant's Signature)</p>
                    </div>
                    <div className="text-center">
                      <div className="border border-slate-300 h-16 w-32 rounded bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 mb-1 mx-auto">સિક્કો (Official Stamp)</div>
                      <p>અધિકારીની સહી / પહોંચ આપનાર</p>
                    </div>
                  </div>

                </div>

                {/* Section 4: Full-Size Image Previewers for user audit */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    અપલોડ કરેલ દસ્તાવેજોના પ્રીવ્યૂ (Attached Documents Preview)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Map through all non-null documents */}
                    {Object.entries(viewingEntry.documents).map(([key, doc]) => {
                      if (!doc || key === 'birthProofType') return null;
                      const d = doc as any;
                      const isImg = d.fileType?.startsWith('image/');
                      
                      // Convert internal CamelCase key to friendly readable English/Gujarati title
                      let label = key;
                      if (key === 'aadharCardFront') label = 'આધાર કાર્ડ - આગળનો ભાગ (Aadhaar Card Front)';
                      else if (key === 'aadharCardBack') label = 'આધાર કાર્ડ - પાછળનો ભાગ (Aadhaar Card Back)';
                      else if (key === 'birthProofDoc') label = 'જન્મ તારીખ પુરાવો (Birth Proof)';
                      else if (key === 'signature') label = 'અરજદારની સહી (Signature)';
                      else if (key === 'passportPhoto') label = 'પાસપોર્ટ ફોટો (Passport Photo)';
                      else if (key === 'relativeEpicCardFront') label = 'સંબંધીનું વોટર આઈડી - આગળનો ભાગ (Relative EPIC Front)';
                      else if (key === 'relativeEpicCardBack') label = 'સંબંધીનું વોટર આઈડી - પાછળનો ભાગ (Relative EPIC Back)';
                      else if (key === 'bankPassbook') label = 'બેંક પાસબુક (Bank Passbook)';
                      else if (key === 'panCard') label = 'પેન કાર્ડ - વૈકલ્પિક (PAN Card)';
                      else if (key === 'landDoc') label = 'જમીન દસ્તાવેજ 7/12-8A (7/12 Land Doc)';
                      else if (key === 'casteCertificate') label = 'જાતિ પ્રમાણપત્ર - વૈકલ્પિક (Caste Cert)';
                      else if (key === 'marriageCertificate') label = 'લગ્નનું પ્રમાણપત્ર (Marriage Certificate)';
                      else if (key === 'kanyaPassportPhoto') label = 'કન્યાનો પાસપોર્ટ સાઇઝ ફોટો (Bride Passport Photo)';
                      else if (key === 'yuvakPassportPhoto') label = 'યુવકનો પાસપોર્ટ સાઇઝ ફોટો (Groom Passport Photo)';
                      else if (key === 'kanyaAadharCardFront') label = 'કન્યાનું આધાર કાર્ડ - આગળ (Bride Aadhaar Front)';
                      else if (key === 'kanyaAadharCardBack') label = 'કન્યાનું આધાર કાર્ડ - પાછળ (Bride Aadhaar Back)';
                      else if (key === 'yuvakAadharCardFront') label = 'યુવકનું આધાર કાર્ડ - આગળ (Groom Aadhaar Front)';
                      else if (key === 'yuvakAadharCardBack') label = 'યુવકનું આધાર કાર્ડ - પાછળ (Groom Aadhaar Back)';
                      else if (key === 'kanyaPitaAadharCardFront') label = 'કન્યાના પિતાનું આધાર કાર્ડ - આગળ (Bride Father Aadhaar Front)';
                      else if (key === 'kanyaPitaAadharCardBack') label = 'કન્યાના પિતાનું આધાર કાર્ડ - પાછળ (Bride Father Aadhaar Back)';
                      else if (key === 'yuvakPitaAadharCardFront') label = 'યુવકના પિતાનું આધાર કાર્ડ - આગળ (Groom Father Aadhaar Front)';
                      else if (key === 'yuvakPitaAadharCardBack') label = 'યુવકના પિતાનું આધાર કાર્ડ - પાછળ (Groom Father Aadhaar Back)';
                      else if (key === 'kanyaSchoolLeaving') label = 'કન્યાનું શાળા છોડ્યાનું પ્રમાણપત્ર (Bride L.C.)';
                      else if (key === 'kanyaPitaIncomeCertificate') label = 'કન્યાના પિતાનું આવક પ્રમાણપત્ર (Bride Father Income Cert)';
                      else if (key === 'kanyaBankPassbook') label = 'કન્યાના નામની બેંક પાસબુક (Bride Bank Passbook)';
                      else if (key === 'selfDeclaration') label = 'સ્વ-ઘોષણાપત્ર (Self Declaration)';

                      return (
                        <div key={key} className="border border-slate-200 rounded-2xl p-3 bg-slate-50 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700 font-display">
                              {label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{d.fileSize}</span>
                          </div>

                          {isImg ? (
                            <img 
                              src={d.dataUrl} 
                              alt={d.fileName} 
                              referrerPolicy="no-referrer"
                              className="w-full h-40 object-contain rounded-lg border border-slate-200 bg-white" 
                            />
                          ) : (
                            <div className="h-40 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400">
                              <FileText className="h-10 w-10 text-slate-400 mb-1" />
                              <span className="text-xs truncate max-w-[180px] font-sans px-2">{d.fileName}</span>
                            </div>
                          )}

                          <a 
                            href={d.dataUrl} 
                            download={d.fileName}
                            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg border border-indigo-100/50 transition-all cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" /> દસ્તાવેજ ડાઉનલોડ કરો
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Owner Feedback & Control Panel */}
              {isOwner() && (
                <div className="bg-slate-50 p-5 border-t border-slate-200 no-print space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <Award className="h-4.5 w-4.5 text-indigo-600" /> એડમિન નિયંત્રણ પેનલ (Admin Control Panel)
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span>વર્તમાન સ્થિતિ (Current Status):</span>
                      {getStatusPill(viewingEntry.status)}
                    </div>
                  </div>

                  {viewingEntry.status === 'DRAFT' ? (
                    <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs text-center space-y-4 w-full">
                      <p className="text-sm font-black text-amber-800 flex items-center justify-center gap-1.5 font-sans">
                        <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
                        <span>ડ્રાફ્ટ અરજી નોટિસ (Draft Application Notice)</span>
                      </p>
                      <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
                        આ એક ડ્રાફ્ટ (અધૂરી) અરજી છે. અરજદારે હજુ સુધી આ અરજી ફાઇનલ સબમિટ (Final Submit) કરેલ નથી, તેથી આ તબક્કે તેને મંજૂર કે નામંજૂર કરી શકાય નહીં અથવા કોઈ ચુકવણી વ્યવસ્થાપન કરી શકાય નહીં. અરજદાર પોતાના અકાઉન્ટમાંથી આ અરજીને ગમે ત્યારે પૂર્ણ કરીને ફાઇનલ સબમિટ કરી શકે છે.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const url = getApplicantNotificationWhatsAppUrl(viewingEntry);
                          window.open(url, '_blank');
                        }}
                        className="mx-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md"
                      >
                        <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                        </svg>
                        <span>વોટ્સએપ દ્વારા અરજદારને અરજી પૂર્ણ કરવા જણાવો (Notify to Complete Draft)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Approve Action */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">અરજી મંજૂર કરો (Approve Application)</p>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1">
                          જો બધી વિગતો અને અપલોડ કરેલ દસ્તાવેજો સાચા હોય તો અરજીને મંજૂર તરીકે ચિહ્નિત કરો.
                        </p>
                      </div>
                      {showApproveConfirm ? (
                        <div className="flex flex-col items-stretch space-y-2 mt-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          <p className="text-[11px] font-bold text-amber-700 text-center flex items-center justify-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>ખરેખર મંજૂર કરવી છે? (Are you sure?)</span>
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const updatedEntry: ApplicationEntry = { 
                                    ...viewingEntry, 
                                    status: 'APPROVED', 
                                    adminFeedback: undefined, 
                                    updatedAt: new Date().toISOString() 
                                  };
                                  await saveApplication(updatedEntry);
                                  setViewingEntry(updatedEntry);
                                  loadApplications();
                                  showToast('અરજી સફળતાપૂર્વક મંજૂર કરવામાં આવી છે! (Application approved successfully!)');
                                } catch (e) {
                                  console.error(e);
                                  showToast('ભૂલ આવી છે. (An error occurred.)', 'error');
                                } finally {
                                  setShowApproveConfirm(false);
                                }
                              }}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              હા, મંજૂર કરો
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowApproveConfirm(false)}
                              className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              ના (Cancel)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowApproveConfirm(true)}
                          disabled={viewingEntry.status === 'APPROVED'}
                          className={`w-full py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-3 ${
                            viewingEntry.status === 'APPROVED' 
                              ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>{viewingEntry.status === 'APPROVED' ? 'અરજી મંજૂર કરેલ છે (Already Approved)' : 'અરજી મંજૂર કરો (Approve Application)'}</span>
                        </button>
                      )}
                    </div>

                    {/* Correction Action */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-rose-800">ભૂલ સુધારવાની માહિતી મોકલો (Request Correction)</p>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1">
                          જો ફોર્મ અથવા દસ્તાવેજમાં કોઈ ભૂલ હોય, તો નીચે ભૂલ લખો અને સબમિટ કરો. અરજદાર તેને જોઈ અને સુધારી શકશે.
                        </p>
                      </div>
                      
                      <div className="space-y-1.5 mt-2">
                        <textarea
                          placeholder="દા.ત. આધાર કાર્ડ પાછળનો ભાગ ઝાંખો દેખાય છે, ફરીથી નવો ફોટો અપલોડ કરો..."
                          value={ownerFeedbackText}
                          onChange={(e) => setOwnerFeedbackText(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/15 focus:border-rose-400 min-h-[65px]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!ownerFeedbackText.trim()) {
                            showToast('કૃપા કરીને ભૂલની વિગત ટાઈપ કરો (Please write correction details first)', 'error');
                            return;
                          }
                          try {
                            const updatedEntry: ApplicationEntry = { 
                              ...viewingEntry, 
                              status: 'CORRECTION_REQUIRED', 
                              adminFeedback: ownerFeedbackText,
                              updatedAt: new Date().toISOString() 
                            };
                            await saveApplication(updatedEntry);
                            setViewingEntry(updatedEntry);
                            loadApplications();
                            showToast('ભૂલનો સંદેશ સફળતાપૂર્વક મોકલવામાં આવ્યો છે! (Correction request sent successfully!)');
                          } catch (e) {
                            console.error(e);
                            showToast('ભૂલ આવી છે. (An error occurred.)', 'error');
                          }
                        }}
                        className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>ભૂલ સબમિટ કરો (Mark Correction Required)</span>
                      </button>
                    </div>

                    {/* Reject Action */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-800">અરજી નામંજૂર કરો (Reject Application)</p>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1">
                          જો અરજી નામંજૂર કરવી હોય, તો નીચે તેનું સ્પષ્ટ કારણ લખો જેથી અરજદાર તે જોઈ શકે.
                        </p>
                      </div>
                      
                      <div className="space-y-1.5 mt-2">
                        <textarea
                          placeholder="દા.ત. તમારા બધા દસ્તાવેજો અધૂરા છે અથવા આ સેવા માટે તમે પાત્ર નથી..."
                          value={ownerRejectionReason}
                          onChange={(e) => setOwnerRejectionReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/15 focus:border-red-400 min-h-[65px]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!ownerRejectionReason.trim()) {
                            showToast('કૃપા કરીને નામંજૂર થવાનું કારણ ટાઈપ કરો (Please write rejection reason first)', 'error');
                            return;
                          }
                          try {
                            const isWalletPay = viewingEntry.paymentMode === 'WALLET' && (viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED');
                            const refundAmt = viewingEntry.paymentAmount || 0;
                            const shouldDoWalletRefund = isWalletPay && refundAmt > 0 && !viewingEntry.isWalletRefunded;

                            const updatedEntry: ApplicationEntry = { 
                              ...viewingEntry, 
                              status: 'REJECTED', 
                              rejectionReason: ownerRejectionReason,
                              updatedAt: new Date().toISOString(),
                              isWalletRefunded: shouldDoWalletRefund ? true : viewingEntry.isWalletRefunded
                            };

                            await saveApplication(updatedEntry);

                            if (shouldDoWalletRefund) {
                              const targetUserId = viewingEntry.userId || 'guest_user';
                              const details: any = viewingEntry.details || {};
                              const nameVal = details.firstName || details.applicantName || details.kanyaFirstName || details.khedutFirstName || 'અરજદાર';
                              const mobileVal = details.mobile || details.applicantMobile || details.kanyaMobile || details.khedutMobile || '';
                              
                              // Deduct/Add back to wallet
                              await updateWalletBalance(targetUserId, refundAmt);
                              
                              // Create wallet transaction
                              await createWalletTransaction({
                                userId: targetUserId,
                                userName: nameVal,
                                userMobile: mobileVal,
                                amount: refundAmt,
                                type: 'DEPOSIT_REQUEST', // Appears positive in ledger
                                status: 'COMPLETED',
                                paymentMethod: 'REFUND',
                                referenceId: 'REFUND_' + viewingEntry.id,
                                notes: `અરજી નામંજૂર થતાં સેવા ફી વોલેટ રિફંડ (Wallet refund for rejected application: ${viewingEntry.id})`
                              });
                              showToast(`અરજી નામંજૂર થઈ છે અને ચૂકવેલ ફી ₹${refundAmt} અરજદારના વોલેટમાં પરત જમા (રીફંડ) કરવામાં આવી છે! (Application rejected and ₹${refundAmt} refunded back to wallet!)`);
                            } else {
                              showToast('અરજી સફળતાપૂર્વક નામંજૂર કરવામાં આવી છે. (Application rejected successfully.)');
                            }

                            setViewingEntry(updatedEntry);
                            loadApplications();
                          } catch (e) {
                            console.error(e);
                            showToast('ભૂલ આવી છે. (An error occurred.)', 'error');
                          }
                        }}
                        className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>અરજી નામંજૂર કરો (Mark as Rejected)</span>
                      </button>
                    </div>

                    {/* Payment Status Administration */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 md:col-span-3 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-800">ચુકવણી વહીવટ (Payment Status Management)</p>
                          <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                            અરજદારની ફી ચુકવણીની સ્થિતિ બદલો (રોકડ/ઓનલાઇન કન્ફર્મેશન માટે).
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span>ચુકવણી મોડ:</span>
                          <span className="font-bold text-indigo-700">
                            {viewingEntry.paymentMode === 'CASH' ? 'CASH (રોકડ)' :
                             viewingEntry.paymentMode === 'ONLINE' ? 'ONLINE (ઓનલાઇન)' :
                             viewingEntry.paymentMode === 'FREE' ? 'FREE (મફત)' : 'રોકડ / ઓનલાઇન'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const updatedEntry: ApplicationEntry = {
                                ...viewingEntry,
                                paymentStatus: 'PAID',
                                updatedAt: new Date().toISOString()
                              };
                              await saveApplication(updatedEntry);
                              setViewingEntry(updatedEntry);
                              loadApplications();
                              showToast('ચુકવણીની સ્થિતિ "સફળ/ચૂકવેલ (PAID)" તરીકે સેટ કરવામાં આવી છે! (Payment status updated to PAID!)');
                            } catch (e) {
                              console.error(e);
                              showToast('ભૂલ આવી છે.', 'error');
                            }
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-500 border border-emerald-200 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md'
                          }`}
                          disabled={viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED'}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>ચૂકવેલ તરીકે ચિહ્નિત કરો (Mark as PAID)</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const updatedEntry: ApplicationEntry = {
                                ...viewingEntry,
                                paymentStatus: 'PENDING',
                                updatedAt: new Date().toISOString()
                              };
                              await saveApplication(updatedEntry);
                              setViewingEntry(updatedEntry);
                              loadApplications();
                              showToast('ચુકવણીની સ્થિતિ "બાકી (PENDING)" તરીકે સેટ કરવામાં આવી છે! (Payment status updated to PENDING!)');
                            } catch (e) {
                              console.error(e);
                              showToast('ભૂલ આવી છે.', 'error');
                            }
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            viewingEntry.paymentStatus === 'PENDING' || !viewingEntry.paymentStatus
                              ? 'bg-amber-50 text-amber-500 border border-amber-200 cursor-not-allowed'
                              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs hover:shadow-md'
                          }`}
                          disabled={viewingEntry.paymentStatus === 'PENDING' || !viewingEntry.paymentStatus}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>બાકી તરીકે ચિહ્નિત કરો (Mark as PENDING)</span>
                        </button>

                        {viewingEntry.paymentMode === 'WALLET' && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (viewingEntry.isWalletRefunded) {
                                showToast('આ પેમેન્ટ પહેલેથી જ રીફંડ કરવામાં આવ્યું છે. (Already refunded.)', 'error');
                                return;
                              }
                              const refundAmt = viewingEntry.paymentAmount || 0;
                              if (refundAmt <= 0) {
                                showToast('રીફંડ કરવા માટેની રકમ અમાન્ય છે. (Invalid refund amount.)', 'error');
                                return;
                              }
                              try {
                                const targetUserId = viewingEntry.userId || 'guest_user';
                                const details: any = viewingEntry.details || {};
                                const nameVal = details.firstName || details.applicantName || details.kanyaFirstName || details.khedutFirstName || 'અરજદાર';
                                const mobileVal = details.mobile || details.applicantMobile || details.kanyaMobile || details.khedutMobile || '';

                                // Add back to wallet balance
                                await updateWalletBalance(targetUserId, refundAmt);

                                // Create transaction
                                await createWalletTransaction({
                                  userId: targetUserId,
                                  userName: nameVal,
                                  userMobile: mobileVal,
                                  amount: refundAmt,
                                  type: 'DEPOSIT_REQUEST',
                                  status: 'COMPLETED',
                                  paymentMethod: 'REFUND',
                                  referenceId: 'REFUND_MANUAL_' + viewingEntry.id,
                                  notes: `સેવા ફી વોલેટ મેન્યુઅલ રિફંડ (Manual wallet refund for application fee: ${viewingEntry.id})`
                                });

                                const updatedEntry: ApplicationEntry = {
                                  ...viewingEntry,
                                  isWalletRefunded: true,
                                  updatedAt: new Date().toISOString()
                                };
                                await saveApplication(updatedEntry);
                                setViewingEntry(updatedEntry);
                                loadApplications();
                                showToast(`સફળતાપૂર્વક ₹${refundAmt} અરજદારના વોલેટમાં પરત (રીફંડ) કરવામાં આવ્યા છે! (Successfully manually refunded ₹${refundAmt}!)`);
                              } catch (e) {
                                console.error(e);
                                showToast('રીફંડ કરવામાં ભૂલ આવી છે.', 'error');
                              }
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              viewingEntry.isWalletRefunded
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                            disabled={viewingEntry.isWalletRefunded}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{viewingEntry.isWalletRefunded ? 'પહેલેથી જ રીફંડ કરેલ (Refunded)' : 'મેન્યુઅલ વોલેટ રિફંડ કરો (Manual Wallet Refund)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* Action bar */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
                <span className="text-xs text-slate-500 font-sans text-center sm:text-left font-semibold">
                  * પ્રિન્ટ કરવા માટે સંબંધિત બટન દબાવો (Select appropriate button to print)
                </span>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setViewingEntry(null)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-semibold text-xs transition-colors cursor-pointer flex-1 sm:flex-initial"
                  >
                    બંધ કરો (Close)
                  </button>
                  <button
                    onClick={() => handlePrint('BILL')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                  >
                    <Printer className="h-4 w-4 text-emerald-100" /> બિલ પહોંચ પ્રિન્ટ (Print Bill Slip)
                  </button>
                  <button
                    onClick={() => handlePrint('FULL')}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                  >
                    <Printer className="h-4 w-4" /> પૂર્ણ અરજી પ્રિન્ટ (Print Full Application)
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden printable block - styled for paper layout */}
      {viewingEntry && (
        <div className="hidden print-only p-8 bg-white text-black min-h-screen">
          {printMode === 'FULL' ? (
            <div className="border-4 border-double border-black p-6 rounded-lg relative">
            
            <div className="text-center space-y-1.5 border-b-2 border-black pb-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-700">
                જિલ્લા સેવાસદન, ગુજરાત સરકાર (DISTRICT SEVASADAN, GOVT. OF GUJARAT)
              </p>
              <h1 className="text-xl font-bold font-sans tracking-tight uppercase">
                DAY INFOTECH FORM SEVA PORTAL
              </h1>
              <div className="text-[10px] text-slate-600 pt-0.5">
                તારીખ (Date): {safeFormatLocalDate(viewingEntry.updatedAt)} &nbsp;|&nbsp; અરજી ID: {viewingEntry.id} &nbsp;|&nbsp; સ્થિતિ (Status): {viewingEntry.status}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 pt-5">
              <div className="col-span-1 flex items-center justify-center border-2 border-slate-400 border-dashed rounded p-1 h-36 w-28 text-center bg-slate-50">
                {viewingEntry.documents.passportPhoto ? (
                  <img src={viewingEntry.documents.passportPhoto.dataUrl} alt="Passport Photo" className="h-full w-full object-cover rounded" />
                ) : (
                  <span className="text-[8px] text-slate-500">પાસપોર્ટ ફોટો<br/>(Passport Photo)</span>
                )}
              </div>

              <div className="col-span-3 space-y-3 text-[11px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-slate-600 block">અરજીનો પ્રકાર (Form Type):</strong>
                    <span className="text-xs font-bold">{getFormName(viewingEntry.formType)}</span>
                  </div>
                  <div>
                    <strong className="text-slate-600 block">મોબાઇલ નંબર (Mobile No):</strong>
                    <span className="text-xs font-bold">{viewingEntry.details.mobile || '-'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-slate-600 block">અરજદારનું નામ (Applicant Name):</strong>
                    <span className="text-xs font-bold uppercase">{getApplicantName(viewingEntry)}</span>
                  </div>
                  <div>
                    <strong className="text-slate-600 block">ઇમેઇલ એડ્રેસ (Email Address):</strong>
                    <span className="text-xs font-bold">{viewingEntry.details.email || '-'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-slate-600 block">જન્મ તારીખ (Date of Birth):</strong>
                    <span className="text-xs font-bold">{safeFormatLocalDate(viewingEntry.details.dob)}</span>
                  </div>
                  <div>
                    <strong className="text-slate-600 block">જાતિ (Gender):</strong>
                    <span className="text-xs font-bold">
                      {viewingEntry.details.gender === 'MALE' ? 'MALE (પુરુષ)' : viewingEntry.details.gender === 'FEMALE' ? 'FEMALE (સ્ત્રી)' : viewingEntry.details.gender === 'OTHER' ? 'OTHER (અન્ય)' : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-400 mt-6 pt-4">
              <h3 className="text-[10px] font-bold bg-slate-100 py-1 px-2 rounded uppercase tracking-wider mb-2">
                અરજી પત્રકની વિગતવાર માહિતી (Detailed Application Data)
              </h3>

              {viewingEntry.formType === 'PAN_CARD' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">પિતાનું નામ (Father Name):</span>
                    <span className="font-bold uppercase">
                      {`${(viewingEntry.details as PanCardDetails).fatherFirstName || ''} ${(viewingEntry.details as PanCardDetails).fatherMiddleName || ''} ${(viewingEntry.details as PanCardDetails).fatherLastName || ''}`.trim() || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                    <span className="text-slate-500">જન્મ પુરાવાનો પ્રકાર (Birth Proof):</span>
                    <span className="font-bold">{(viewingEntry.documents as PanCardDocs).birthProofType === 'BIRTH_CERTIFICATE' ? 'જન્મ પ્રમાણપત્ર' : 'મતદાર આઈડી'}</span>
                  </div>
                </div>
              )}

              
                            {viewingEntry.formType === 'PAN_CARD_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).signature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'MINOR_PAN_CARD' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repSignature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repPanCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'VOTER_ID_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).addressProof ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}

                              {viewingEntry.formType === 'VOTER_ID' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">સંબંધ પ્રકાર (Relation Type):</span>
                    <span className="font-bold">{(viewingEntry.details as VoterIdDetails).relativeType || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">સંબંધીનું નામ (Relative Name):</span>
                    <span className="font-bold uppercase">
                      {`${(viewingEntry.details as VoterIdDetails).fatherFirstName || ''} ${(viewingEntry.details as VoterIdDetails).fatherMiddleName || ''} ${(viewingEntry.details as VoterIdDetails).fatherLastName || ''}`.trim() || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">સંબંધીનો EPIC નંબર (Relative Voter ID):</span>
                    <span className="font-bold">{(viewingEntry.details as VoterIdDetails).relativeEpicNumber || '-'}</span>
                  </div>
                </div>
              )}

              {viewingEntry.formType === 'E_SHRAM' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">બેંક ખાતા નંબર (Bank A/C):</span>
                    <span className="font-bold font-mono">{(viewingEntry.details as EShramDetails).bankAccountNum || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">IFSC કોડ (IFSC):</span>
                    <span className="font-bold font-mono">{(viewingEntry.details as EShramDetails).bankIfsc || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">ખાતાધારકનું નામ (Holder Name):</span>
                    <span className="font-bold">{(viewingEntry.details as EShramDetails).bankHolderName || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">વ્યવસાય (Occupation):</span>
                    <span className="font-bold">{(viewingEntry.details as EShramDetails).occupation || '-'}</span>
                  </div>
                </div>
              )}

              {viewingEntry.formType === 'FARMER_SUBSIDY' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">જમીનની વિગત (Village/Survey):</span>
                    <span className="font-bold">
                      {`${(viewingEntry.details as FarmerSubsidyDetails).villageName || ''} - ${(viewingEntry.details as FarmerSubsidyDetails).surveyNumber || ''}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">સબસિડી પ્રકાર (Scheme):</span>
                    <span className="font-bold">{(viewingEntry.details as FarmerSubsidyDetails).subsidyScheme || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">બેંક વિગત:</span>
                    <span className="font-bold">
                      {`${(viewingEntry.details as FarmerSubsidyDetails).bankHolderName || ''} (${(viewingEntry.details as FarmerSubsidyDetails).bankAccountNum || ''})`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">તાલુકો અને જિલ્લો (Sub-Dist/Dist):</span>
                    <span className="font-bold">
                      {`${(viewingEntry.details as FarmerSubsidyDetails).subDistrict || ''} / ${(viewingEntry.details as FarmerSubsidyDetails).district || ''}`}
                    </span>
                  </div>
                </div>
              )}

              {viewingEntry.formType === 'UDHYAM_AADHAR' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">વ્યવસાયનું નામ (Business Name):</span>
                    <span className="font-bold uppercase">{(viewingEntry.details as any).businessName || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">શ્રેણી (Category):</span>
                    <span className="font-bold">{(viewingEntry.details as any).businessCategory === 'SERVICE' ? 'SERVICE (સેવા)' : 'TRADING (વેપાર)'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 font-mono">
                    <span className="text-slate-500">આધાર નંબર (Aadhar No):</span>
                    <span className="font-bold">{(viewingEntry.details as any).aadharCardNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 font-mono uppercase">
                    <span className="text-slate-500">પાનકાર્ડ નંબર (PAN No):</span>
                    <span className="font-bold">{(viewingEntry.details as any).panCardNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 font-mono">
                    <span className="text-slate-500">ખાતા નંબર (Account No):</span>
                    <span className="font-bold">{(viewingEntry.details as any).bankAccountNum || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 font-mono uppercase">
                    <span className="text-slate-500">IFSC કોડ (IFSC):</span>
                    <span className="font-bold">{(viewingEntry.details as any).bankIfsc || '-'}</span>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-slate-400 mt-6 pt-4">
              <h3 className="text-[10px] font-bold bg-slate-100 py-1 px-2 rounded uppercase tracking-wider mb-2">
                અપલોડ કરેલ દસ્તાવેજોની યાદી (Attached Documents)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                    {viewingEntry.documents.aadharCardFront ? '✓' : ''}
                  </div>
                  <span>આધાર કાર્ડ Front</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                    {viewingEntry.documents.aadharCardBack ? '✓' : ''}
                  </div>
                  <span>આધાર કાર્ડ Back</span>
                </div>
                {viewingEntry.formType !== 'FARMER_SUBSIDY' && viewingEntry.formType !== 'UDHYAM_AADHAR' && (
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                      {viewingEntry.documents.passportPhoto ? '✓' : ''}
                    </div>
                    <span>પાસપોર્ટ ફોટો</span>
                  </div>
                )}
                {viewingEntry.formType === 'PAN_CARD' && (
                  <>
                    {(viewingEntry.documents as PanCardDocs).birthProofType === 'BIRTH_CERTIFICATE' ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                          {(viewingEntry.documents as PanCardDocs).birthProofDoc ? '✓' : ''}
                        </div>
                        <span>જન્મ પ્રમાણપત્ર</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                            {(viewingEntry.documents as PanCardDocs).voterIdFront ? '✓' : ''}
                          </div>
                          <span>મતદાર આઈડી Front</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                            {(viewingEntry.documents as PanCardDocs).voterIdBack ? '✓' : ''}
                          </div>
                          <span>મતદાર આઈડી Back</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as PanCardDocs).signature ? '✓' : ''}
                      </div>
                      <span>સહી (Signature)</span>
                    </div>
                  </>
                )}
                
                            {viewingEntry.formType === 'PAN_CARD_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).signature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).voterIdBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'MINOR_PAN_CARD' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthCertificate ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repSignature ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repAadharBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).repPanCard ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}
                            {viewingEntry.formType === 'VOTER_ID_CORRECTION' && (
                              <>
                                {(viewingEntry.documents as any).aadharCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).aadharCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).passportPhoto ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).oldEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardFront ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).relativeEpicCardBack ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).addressProof ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                                {(viewingEntry.documents as any).birthProofDoc ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                              </>
                            )}

                              {viewingEntry.formType === 'VOTER_ID' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as VoterIdDocs).birthProofDoc ? '✓' : ''}
                      </div>
                      <span>જન્મ તારીખ પુરાવો</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as VoterIdDocs).relativeEpicCardFront ? '✓' : ''}
                      </div>
                      <span>સંબંધી EPIC Front</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as VoterIdDocs).relativeEpicCardBack ? '✓' : ''}
                      </div>
                      <span>સંબંધી EPIC Back</span>
                    </div>
                  </>
                )}
                {viewingEntry.formType === 'E_SHRAM' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as EShramDocs).bankPassbook ? '✓' : ''}
                      </div>
                      <span>બેંક પાસબુક</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as EShramDocs).panCard ? '✓' : ''}
                      </div>
                      <span>પેન કાર્ડ (વૈકલ્પિક)</span>
                    </div>
                  </>
                )}
                {viewingEntry.formType === 'FARMER_SUBSIDY' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as FarmerSubsidyDocs).landDoc ? '✓' : ''}
                      </div>
                      <span>7/12 જમીન નકશો</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as FarmerSubsidyDocs).bankPassbook ? '✓' : ''}
                      </div>
                      <span>બેંક પાસબુક</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as FarmerSubsidyDocs).casteCertificate ? '✓' : ''}
                      </div>
                      <span>જાતિ પ્રમાણપત્ર (વૈકલ્પિક)</span>
                    </div>
                  </>
                )}
                {viewingEntry.formType === 'UDHYAM_AADHAR' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as any).panCard ? '✓' : ''}
                      </div>
                      <span>પાનકાર્ડ (PAN)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-black bg-white flex items-center justify-center font-bold">
                        {(viewingEntry.documents as any).bankPassbook ? '✓' : ''}
                      </div>
                      <span>બેંક પાસબુક / ચેક</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 3: Printed Payment Info */}
            <div className="border-t border-black mt-6 pt-4">
              <h3 className="text-[10px] font-bold bg-slate-100 py-1 px-2 rounded uppercase tracking-wider mb-2">
                ચુકવણીની વિગત (Payment Details)
              </h3>
              <div className="grid grid-cols-3 gap-4 text-[11px] font-sans">
                <div>
                  <span className="text-slate-500">ફી રકમ (Fees):</span> &nbsp;
                  <strong className="text-black">₹ {viewingEntry.paymentAmount !== undefined ? viewingEntry.paymentAmount : '0'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">ચુકવણી મોડ (Mode):</span> &nbsp;
                  <strong className="text-indigo-900 uppercase">
                    {viewingEntry.paymentMode === 'CASH' ? 'CASH (રોકડ)' :
                     viewingEntry.paymentMode === 'ONLINE' ? 'ONLINE (ઓનલાઇન)' :
                     viewingEntry.paymentMode === 'FREE' ? 'FREE (મફત)' : 'CASH / ONLINE'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">સ્થિતિ (Status):</span> &nbsp;
                  <strong className="text-black uppercase">
                    {viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED' ? 'ચૂકવેલ (PAID)' : 'બાકી (PENDING)'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-14 flex justify-between items-end text-[10px] text-slate-600 px-4">
              <div className="text-center">
                <p className="border-b border-black w-28 mb-1 mx-auto"></p>
                <p>અરજદારની સહી / અંગૂઠો</p>
              </div>
              <div className="text-center">
                <div className="border border-slate-500 h-10 w-24 rounded bg-slate-50 flex items-center justify-center text-[8px] text-slate-500 mb-1 mx-auto">સિક્કો (Official Stamp)</div>
                <p>અધિકારીની સહી / પહોંચ આપનાર</p>
              </div>
            </div>

          </div>
          ) : (
            <div className="border-4 border-double border-black p-6 max-w-md mx-auto rounded-lg relative bg-white text-black space-y-4">
              <div className="text-center space-y-1 border-b-2 border-black pb-3">
                <p className="text-[9px] font-bold tracking-widest text-slate-800 uppercase">
                  ડિજિટલ સર્વિસ પોઇન્ટ (DIGITAL SERVICE POINT)
                </p>
                <h1 className="text-base font-black tracking-tight">
                  DAY INFOTECH - DIGITAL POINT
                </h1>
                <p className="text-[9px] font-semibold text-slate-700">
                  મોબાઇલ: 7600361873 | bsporiya9@gmail.com
                </p>
                <div className="text-[9px] text-slate-600 pt-1 flex justify-between font-mono px-2 border-t border-slate-100 mt-1">
                  <span>તારીખ (Date): {safeFormatLocalDate(viewingEntry.updatedAt)}</span>
                  <span>રસીદ નં (ID): {viewingEntry.id}</span>
                </div>
              </div>

              <div className="text-center bg-slate-100 py-1.5 rounded border border-slate-300">
                <h2 className="text-xs font-black tracking-wider text-slate-900">
                  ચુકવણી પહોંચ અને બિલ રસીદ (PAYMENT RECEIPT & BILL)
                </h2>
              </div>

              {/* Details table style */}
              <div className="space-y-2.5 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                  <span className="text-slate-600">અરજદારનું નામ (Applicant):</span>
                  <span className="font-extrabold uppercase text-slate-950">{getApplicantName(viewingEntry)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                  <span className="text-slate-600">મોબાઇલ નંબર (Mobile No):</span>
                  <span className="font-bold font-mono text-slate-950">{viewingEntry.details.mobile || '-'}</span>
                </div>
                {viewingEntry.details.email && (
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                    <span className="text-slate-600">ઇમેઇલ (Email):</span>
                    <span className="font-medium font-mono text-slate-950">{viewingEntry.details.email}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                  <span className="text-slate-600">સેવાનો પ્રકાર (Service Type):</span>
                  <span className="font-extrabold text-slate-950">{getFormName(viewingEntry.formType)}</span>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-bold text-slate-700">સેવા ચાર્જ (Service Fee):</span>
                  <span className="font-extrabold text-sm font-mono text-slate-900">₹ {viewingEntry.paymentAmount !== undefined ? viewingEntry.paymentAmount : '0'}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-bold text-slate-700">ચુકવણી મોડ (Payment Mode):</span>
                  <span className="font-extrabold text-indigo-900 uppercase">
                    {viewingEntry.paymentMode === 'CASH' ? 'CASH (રોકડ)' :
                     viewingEntry.paymentMode === 'ONLINE' ? 'ONLINE (ઓનલાઇન)' :
                     viewingEntry.paymentMode === 'FREE' ? 'FREE (મફત)' : 'CASH / ONLINE'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-t border-slate-300 pt-2">
                  <span className="font-bold text-slate-700">ચુકવણી સ્થિતિ (Payment Status):</span>
                  <span className={`font-black px-2.5 py-0.5 rounded text-[10px] uppercase border ${
                    viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {viewingEntry.paymentStatus === 'PAID' || viewingEntry.paymentStatus === 'COMPLETED' ? 'ચૂકવેલ (PAID / SUCCESS)' : 'બાકી (PENDING)'}
                  </span>
                </div>
              </div>

              {/* Bottom footer stamp & sign */}
              <div className="pt-10 flex justify-between items-end text-[10px] text-slate-600">
                <div className="text-center">
                  <p className="border-b border-black w-24 mb-1 mx-auto"></p>
                  <p className="text-[9px]">અરજદારની સહી</p>
                </div>
                <div className="text-center">
                  <div className="border border-dashed border-slate-400 h-10 w-24 rounded bg-slate-50 flex items-center justify-center text-[8px] text-slate-500 mb-1 mx-auto">
                    સિક્કો / Stamp
                  </div>
                  <p className="text-[9px] font-bold">પહોંચ આપનાર સહી</p>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-[9px] text-slate-500 leading-normal font-medium">
                  * આ બિલ કોમ્પ્યુટર જનરેટેડ હોવાથી સહીની જરૂર નથી. <br/>
                  * મુલાકાત બદલ આભાર! ડિજિટલ પોઇન્ટ ગુજરાત પોર્ટલ.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full screen Image Lightbox */}
      <AnimatePresence>
        {isViewingFullImage && (announcementPhoto || ownerPhotoInput) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-[99999] flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setIsViewingFullImage(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsViewingFullImage(false)}
                className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all cursor-pointer border border-white/20 active:scale-95"
              >
                <X className="h-6 w-6" />
              </button>
              <img 
                src={announcementPhoto || ownerPhotoInput} 
                alt="Full screen Broadcast Poster" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              {announcementMsg && (
                <div className="mt-4 bg-white/10 backdrop-blur-md text-white py-3 px-6 rounded-2xl text-sm font-semibold max-w-2xl text-center leading-relaxed font-sans border border-white/10">
                  {announcementMsg}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Toast Message */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] transition-all duration-300">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 max-w-sm ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100' 
              : 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 animate-bounce" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 animate-pulse" />
            )}
            <p className="text-xs font-semibold leading-normal font-sans">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
};
