import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Calendar, Phone, Mail, FileText, ArrowRight, Save, CheckCircle, 
  RefreshCw, Award, ArrowLeft, Landmark, Sprout, CreditCard, AlertTriangle, HelpCircle,
  UserCheck, X, Wallet, QrCode, Plus, PlusCircle, Edit3, Globe, Users,
  IdCard, Vote, UserPlus, UserMinus, FileEdit, Utensils, Baby
} from 'lucide-react';
import { 
  FormType, 
  PanCardDetails, 
  PanCardDocs,
  PanCardCorrectionDetails,
  PanCardCorrectionDocs,
  MinorPanCardDetails,
  MinorPanCardDocs,
  VoterIdCorrectionDetails,
  VoterIdCorrectionDocs, 
  VoterIdDetails, 
  VoterIdDocs, 
  EShramDetails,
  EShramDocs,
  FarmerSubsidyDetails,
  FarmerSubsidyDocs,
  CastCertificateDetails,
  CastCertificateDocs,
  IncomeCertificateDetails,
  IncomeCertificateDocs,
  AyushmanCardDetails,
  AyushmanCardDocs,
  AabhaCardDetails,
  AabhaCardDocs,
  OtherServiceDetails,
  OtherServiceDocs,
  UdhyamAadharDetails,
  UdhyamAadharDocs,
  ManavKalyanDetails,
  ManavKalyanDocs,
  KuvarBaiMameruDetails,
  KuvarBaiMameruDocs,
  NewBirthCertificateDetails,
  NewBirthCertificateDocs,
  BirthCertificateCorrectionDetails,
  BirthCertificateCorrectionDocs,
  DeathCertificateDetails,
  DeathCertificateDocs,
  RationCardAddNameDetails,
  RationCardAddNameDocs,
  RationCardRemoveNameDetails,
  RationCardRemoveNameDocs,
  RationCardCorrectionDetails,
  RationCardCorrectionDocs,
  PassportDetails,
  PassportDocs,
  ApplicationEntry, 
  DocumentUpload 
} from '../types';
import { DocumentUploader } from './DocumentUploader';

import { 
  initialPanDetails, 
  initialPanDocs,
  initialPanCorrectionDetails,
  initialPanCorrectionDocs,
  initialMinorPanDetails,
  initialMinorPanDocs,
  initialVoterCorrectionDetails,
  initialVoterCorrectionDocs, 
  initialVoterDetails, 
  initialVoterDocs,
  initialEShramDetails,
  initialEShramDocs,
  initialFarmerDetails,
  initialFarmerDocs,
  initialCastDetails,
  initialCastDocs,
  initialIncomeDetails,
  initialIncomeDocs,
  initialAyushmanDetails,
  initialAyushmanDocs,
  initialAabhaDetails,
  initialAabhaDocs,
  initialOtherDetails,
  initialOtherDocs,
  initialUdhyamDetails,
  initialUdhyamDocs,
  initialManavDetails,
  initialManavDocs,
  initialKuvarDetails,
  initialKuvarDocs,
  initialNewBirthCertificateDetails,
  initialNewBirthCertificateDocs,
  initialBirthCertificateCorrectionDetails,
  initialBirthCertificateCorrectionDocs,
  initialDeathCertificateDetails,
  initialDeathCertificateDocs,
  initialRationCardAddNameDetails,
  initialRationCardAddNameDocs,
  initialRationCardRemoveNameDetails,
  initialRationCardRemoveNameDocs,
  initialRationCardCorrectionDetails,
  initialRationCardCorrectionDocs,
  initialPassportDetails,
  initialPassportDocs
} from '../utils/formDefaults';
import { saveApplication, getServiceStatuses, isOwner, getWallet, updateWalletBalance, createWalletTransaction, getLoggedInUser, getServicePrices, subscribeToServicePrices, subscribeToServiceDiscounts, ServiceDiscounts } from '../utils/db';
import { Wallet as WalletType } from '../types';

interface FormRendererProps {
  formType: FormType;
  editingEntry?: ApplicationEntry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export let SERVICE_PRICES: Record<FormType, number> = {
  PAN_CARD: 270,
  PAN_CARD_CORRECTION: 300,
  MINOR_PAN_CARD: 300,
  VOTER_ID: 100,
  VOTER_ID_CORRECTION: 200,
  E_SHRAM: 100,
  AYUSHYMAN_CARD: 80,
  AABHA_CARD: 80,
  FARMER_SUBSIDY: 100,
  INCOME_CERTIFICATE: 150,
  CAST_CERTIFICATE: 150,
  UDHYAM_AADHAR: 300,
  MANAV_KALYAN: 80,
  KUVAR_BAI_MAMERU: 100,
  NEW_BIRTH_CERTIFICATE: 150,
  BIRTH_CERTIFICATE_CORRECTION: 150,
  DEATH_CERTIFICATE: 180,
  OTHER_SERVICE: 0,
  RATION_CARD_ADD_NAME: 500,
  RATION_CARD_REMOVE_NAME: 400,
  RATION_CARD_CORRECTION: 0,
  PASSPORT: 1500,
};

export let SERVICE_DISCOUNTS = {
  walletDiscount: 10,
  upiDiscount: 0,
};

export const FormRenderer: React.FC<FormRendererProps> = ({
  formType: initialFormType,
  editingEntry = null,
  onSuccess,
  onCancel,
}) => {
  const [formType, setFormType] = useState<FormType>(initialFormType);

  useEffect(() => {
    if (editingEntry) {
      setFormType(editingEntry.formType);
    } else {
      setFormType(initialFormType);
    }
  }, [initialFormType, editingEntry]);

  // States for all Form fields
  const [panDetails, setPanDetails] = useState<PanCardDetails>({ ...initialPanDetails });
  const [panDocs, setPanDocs] = useState<PanCardDocs>({ ...initialPanDocs });

  const [panCorrectionDetails, setPanCorrectionDetails] = useState<PanCardCorrectionDetails>({ ...initialPanCorrectionDetails });
  const [panCorrectionDocs, setPanCorrectionDocs] = useState<PanCardCorrectionDocs>({ ...initialPanCorrectionDocs });

  const [minorPanDetails, setMinorPanDetails] = useState<MinorPanCardDetails>({ ...initialMinorPanDetails });
  const [minorPanDocs, setMinorPanDocs] = useState<MinorPanCardDocs>({ ...initialMinorPanDocs });

  const [voterCorrectionDetails, setVoterCorrectionDetails] = useState<VoterIdCorrectionDetails>({ ...initialVoterCorrectionDetails });
  const [voterCorrectionDocs, setVoterCorrectionDocs] = useState<VoterIdCorrectionDocs>({ ...initialVoterCorrectionDocs });


  const [voterDetails, setVoterDetails] = useState<VoterIdDetails>({ ...initialVoterDetails });
  const [voterDocs, setVoterDocs] = useState<VoterIdDocs>({ ...initialVoterDocs });

  const [eshramDetails, setEshramDetails] = useState<EShramDetails>({ ...initialEShramDetails });
  const [eshramDocs, setEshramDocs] = useState<EShramDocs>({ ...initialEShramDocs });

  const [farmerDetails, setFarmerDetails] = useState<FarmerSubsidyDetails>({ ...initialFarmerDetails });
  const [farmerDocs, setFarmerDocs] = useState<FarmerSubsidyDocs>({ ...initialFarmerDocs });

  const [castDetails, setCastDetails] = useState<CastCertificateDetails>({ ...initialCastDetails });
  const [castDocs, setCastDocs] = useState<CastCertificateDocs>({ ...initialCastDocs });

  const [incomeDetails, setIncomeDetails] = useState<IncomeCertificateDetails>({ ...initialIncomeDetails });
  const [incomeDocs, setIncomeDocs] = useState<IncomeCertificateDocs>({ ...initialIncomeDocs });

  const [ayushmanDetails, setAyushmanDetails] = useState<AyushmanCardDetails>({ ...initialAyushmanDetails });
  const [ayushmanDocs, setAyushmanDocs] = useState<AyushmanCardDocs>({ ...initialAyushmanDocs });

  const [aabhaDetails, setAabhaDetails] = useState<AabhaCardDetails>({ ...initialAabhaDetails });
  const [aabhaDocs, setAabhaDocs] = useState<AabhaCardDocs>({ ...initialAabhaDocs });

  const [otherDetails, setOtherDetails] = useState<OtherServiceDetails>({ ...initialOtherDetails });

  const [newBirthDetails, setNewBirthDetails] = useState<NewBirthCertificateDetails>({ ...initialNewBirthCertificateDetails });
  const [newBirthDocs, setNewBirthDocs] = useState<NewBirthCertificateDocs>({ ...initialNewBirthCertificateDocs });
  const [birthCorrectionDetails, setBirthCorrectionDetails] = useState<BirthCertificateCorrectionDetails>({ ...initialBirthCertificateCorrectionDetails });
  const [birthCorrectionDocs, setBirthCorrectionDocs] = useState<BirthCertificateCorrectionDocs>({ ...initialBirthCertificateCorrectionDocs });
  const [deathDetails, setDeathDetails] = useState<DeathCertificateDetails>({ ...initialDeathCertificateDetails });
  const [deathDocs, setDeathDocs] = useState<DeathCertificateDocs>({ ...initialDeathCertificateDocs });

  const [otherDocs, setOtherDocs] = useState<OtherServiceDocs>({ ...initialOtherDocs });

  const [udhyamDetails, setUdhyamDetails] = useState<UdhyamAadharDetails>({ ...initialUdhyamDetails });
  const [udhyamDocs, setUdhyamDocs] = useState<UdhyamAadharDocs>({ ...initialUdhyamDocs });

  const [manavDetails, setManavDetails] = useState<ManavKalyanDetails>({ ...initialManavDetails });
  const [manavDocs, setManavDocs] = useState<ManavKalyanDocs>({ ...initialManavDocs });

  const [kuvarDetails, setKuvarDetails] = useState<KuvarBaiMameruDetails>({ ...initialKuvarDetails });
  const [kuvarDocs, setKuvarDocs] = useState<KuvarBaiMameruDocs>({ ...initialKuvarDocs });

  const [rationCardAddDetails, setRationCardAddDetails] = useState<RationCardAddNameDetails>({ ...initialRationCardAddNameDetails });
  const [rationCardAddDocs, setRationCardAddDocs] = useState<RationCardAddNameDocs>({ ...initialRationCardAddNameDocs });

  const [rationCardRemoveDetails, setRationCardRemoveDetails] = useState<RationCardRemoveNameDetails>({ ...initialRationCardRemoveNameDetails });
  const [rationCardRemoveDocs, setRationCardRemoveDocs] = useState<RationCardRemoveNameDocs>({ ...initialRationCardRemoveNameDocs });

  const [rationCardCorrectionDetails, setRationCardCorrectionDetails] = useState<RationCardCorrectionDetails>({ ...initialRationCardCorrectionDetails });
  const [rationCardCorrectionDocs, setRationCardCorrectionDocs] = useState<RationCardCorrectionDocs>({ ...initialRationCardCorrectionDocs });

  const [passportDetails, setPassportDetails] = useState<PassportDetails>({ ...initialPassportDetails });
  const [passportDocs, setPassportDocs] = useState<PassportDocs>({ ...initialPassportDocs });

  const handlePassportDetailsChange = (field: keyof PassportDetails, value: any) => {
    setPassportDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isServiceClosed, setIsServiceClosed] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<ApplicationEntry | null>(null);

  const getServiceLabel = (type: FormType): string => {
    switch (type) {
            case 'PAN_CARD': return 'PAN CARD (પાન કાર્ડ)';
      case 'PAN_CARD_CORRECTION': return 'PAN CARD CORRECTION (પેન કાર્ડ સુધારો)';
      case 'MINOR_PAN_CARD': return 'MINOR PAN CARD (સગીર પેન કાર્ડ)';
      case 'VOTER_ID_CORRECTION': return 'VOTER ID CORRECTION (મતદાર આઈડી સુધારો)';
      case 'VOTER_ID': return 'VOTER ID CARD (મતદાર ઓળખપત્ર)';
      case 'E_SHRAM': return 'E-SHRAM CARD (ઈ-શ્રમ કાર્ડ)';
      case 'FARMER_SUBSIDY': return 'FARMER SUBSIDY (ખેડૂત સબસિડી)';
      case 'CAST_CERTIFICATE': return 'CAST CERTIFICATE (જાતિ પ્રમાણપત્ર)';
      case 'INCOME_CERTIFICATE': return 'INCOME CERTIFICATE (આવક પ્રમાણપત્ર)';
      case 'AYUSHYMAN_CARD': return 'AYUSHYMAN BHARAT (આયુષ્માન કાર્ડ)';
      case 'AABHA_CARD': return 'ABHA HEALTH CARD (આભા હેલ્થ કાર્ડ)';
      case 'UDHYAM_AADHAR': return 'UDHYAM AADHAR (MSME) (ઉદ્યમ આધાર)';
      case 'MANAV_KALYAN': return 'MANAV KALYAN YOJNA (માનવ કલ્યાણ યોજના)';
      case 'KUVAR_BAI_MAMERU': return 'KUVAR BAI MAMERU YOJANA (કુંવરબાઈ મામેરું યોજના)';
      case 'OTHER_SERVICE': return 'OTHER SERVICE (અન્ય સરકારી સેવાઓ)';
      case 'RATION_CARD_ADD_NAME': return 'RATION CARD ADD NAME (રેશન કાર્ડ નામ ઉમેરવું)';
      case 'RATION_CARD_REMOVE_NAME': return 'RATION CARD REMOVE NAME (રેશન કાર્ડ નામ કમી કરવું)';
      case 'RATION_CARD_CORRECTION': return 'RATION CARD CORRECTION (રેશન કાર્ડ સુધારો)';
      case 'PASSPORT': return 'PASSPORT SERVICE (પાસપોર્ટ સેવા)';
      default: return String(type);
    }
  };

  const getApplicantName = (type: FormType, details: any): string => {
    if (!details) return '';
    if (type === 'KUVAR_BAI_MAMERU') {
      return `${details.kanyaFirstName || ''} ${details.kanyaMiddleName || ''} ${details.kanyaLastName || ''}`.trim();
    }
    if (type === 'NEW_BIRTH_CERTIFICATE' || type === 'BIRTH_CERTIFICATE_CORRECTION') {
      return (details.childFullNameGu || details.childFullNameEn || '').trim();
    }
    if (type === 'DEATH_CERTIFICATE') {
      return `${details.informerFirstNameGu || ''} ${details.informerMiddleNameGu || ''} ${details.informerLastNameGu || ''}`.trim();
    }
    return `${details.firstName || ''} ${details.middleName || ''} ${details.lastName || ''}`.trim();
  };

  const getWhatsAppUrl = (entry: ApplicationEntry) => {
    const serviceLabel = getServiceLabel(entry.formType);
    const applicantName = getApplicantName(entry.formType, entry.details);
    const details: any = entry.details || {};
    const mobile = details.mobile || details.kanyaMobile || details.khedutMobile || details.applicantMobile || details.phone || '-';
    const aadhar = details.aadharNumber || details.kanyaPitaAadharNumber || '-';
    
    const text = `*નવી ઓનલાઇન અરજી આવી છે! (New Application Received!)* 📄✨\n\n` +
      `*અરજી ID:* ${entry.id}\n` +
      `*સેવાનો પ્રકાર (Service Type):* ${serviceLabel}\n` +
      `*અરજદારનું નામ (Applicant Name):* ${applicantName}\n` +
      `*મોબાઈલ નંબર (Mobile):* ${mobile}\n` +
      `*આધાર નંબર (Aadhaar):* ${aadhar}\n` +
      `*ચુકવણી સ્થિતિ (Payment):* ${entry.paymentStatus === 'PAID' ? 'PAID (ઓનલાઇન ચૂકવેલ)' : entry.paymentMode === 'CASH' ? 'CASH (રોકડેથી ચૂકવશે)' : 'FREE / PENDING'}\n\n` +
      `તમારી ઓફિશ્યલ પેનલ પર લોગઈન કરીને આ અરજી ચકાસી શકો છો.\n` +
      `*DAY INFOTECH - ડિજિટલ પોઇન્ટ* 💻🌐`;
      
    return `https://api.whatsapp.com/send?phone=917600361873&text=${encodeURIComponent(text)}`;
  };

  const getApplicantNotificationWhatsAppUrl = (entry: ApplicationEntry) => {
    const serviceLabel = getServiceLabel(entry.formType);
    const applicantName = getApplicantName(entry.formType, entry.details);
    const details: any = entry.details || {};
    let mobile = details.mobile || details.kanyaMobile || details.khedutMobile || details.applicantMobile || details.phone || '';
    
    mobile = mobile.replace(/\D/g, '');
    if (mobile.length === 10) {
      mobile = '91' + mobile;
    }
    
    const text = `*નમસ્તે ${applicantName},*\n\n` +
      `આપની *${serviceLabel}* માટેની અરજી સફળતાપૂર્વક અમને મળી ગઈ છે. સેવાનો ઉપયોગ કરવા બદલ ખુબ ખુબ આભાર! 🙏✨\n\n` +
      `*અરજી ID (App ID):* ${entry.id}\n\n` +
      `અમે ટૂંક સમયમાં આપની અરજી પર પ્રક્રિયા કરીશું અને કોઈ પણ પ્રશ્ન હશે તો આપનો સંપર્ક કરીશું.\n\n` +
      `*DAY INFOTECH - ડિજિટલ પોઇન્ટ* 💻🌐`;
      
    return `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(text)}`;
  };

  const getApplicantNotificationSMSUrl = (entry: ApplicationEntry) => {
    const serviceLabel = getServiceLabel(entry.formType);
    const applicantName = getApplicantName(entry.formType, entry.details);
    const details: any = entry.details || {};
    let mobile = details.mobile || details.kanyaMobile || details.khedutMobile || details.applicantMobile || details.phone || '';
    
    mobile = mobile.replace(/\D/g, '');
    if (mobile.length === 10) {
      mobile = '91' + mobile;
    }
    
    const text = `Namaste ${applicantName}, tamari ${serviceLabel} mate ni arji safltapurvak prapt thay chhe. Seva no upyog karva badal khub khub aabhar! App ID: ${entry.id}. - DAY INFOTECH`;
    
    return `sms:${mobile}?body=${encodeURIComponent(text)}`;
  };

  // Check if service is disabled by owner in database
  useEffect(() => {
    const checkServiceStatus = async () => {
      if (!editingEntry) {
        try {
          const statuses = await getServiceStatuses();
          if (statuses[formType] === false) {
            setIsServiceClosed(true);
          }
        } catch (e) {
          console.error('Error checking service status:', e);
        }
      }
    };
    checkServiceStatus();
  }, [formType, editingEntry]);

  // Dynamic prices state
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({ ...SERVICE_PRICES });
  const [currentDiscounts, setCurrentDiscounts] = useState<ServiceDiscounts>({ ...SERVICE_DISCOUNTS });

  useEffect(() => {
    const unsubscribePrices = subscribeToServicePrices((prices) => {
      setCurrentPrices(prices);
      Object.assign(SERVICE_PRICES, prices);
    });

    const unsubscribeDiscounts = subscribeToServiceDiscounts((discounts) => {
      setCurrentDiscounts(discounts);
      Object.assign(SERVICE_DISCOUNTS, discounts);
    });

    return () => {
      unsubscribePrices();
      unsubscribeDiscounts();
    };
  }, []);

  // Payment states
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'CASH' | 'ONLINE' | 'WALLET' | null>(null);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);

  // Inline Wallet Topup states
  const [showInlineTopup, setShowInlineTopup] = useState(false);
  const [inlineAmount, setInlineAmount] = useState('100');
  const [inlineUtr, setInlineUtr] = useState('');
  const [inlineStep, setInlineStep] = useState<'AMOUNT' | 'QR' | 'SUCCESS'>('AMOUNT');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);

  const walletPrice = Math.round(SERVICE_PRICES[formType] * (100 - currentDiscounts.walletDiscount) / 100);
  const upiPrice = Math.round(SERVICE_PRICES[formType] * (100 - currentDiscounts.upiDiscount) / 100);
  const finalPrice = selectedPaymentMode === 'WALLET' ? walletPrice : (selectedPaymentMode === 'ONLINE' ? upiPrice : SERVICE_PRICES[formType]);
  const [inlineSuccessTx, setInlineSuccessTx] = useState<any | null>(null);

  // Fetch user wallet when payment step is shown
  useEffect(() => {
    if (showPaymentStep) {
      const loadUserWallet = async () => {
        setLoadingWallet(true);
        try {
          const user = getLoggedInUser();
          const userId = user?.uid || 'guest_user';
          const userWallet = await getWallet(userId);
          setWallet(userWallet);
        } catch (e) {
          console.error('Error loading wallet:', e);
        } finally {
          setLoadingWallet(false);
        }
      };
      loadUserWallet();
    }
  }, [showPaymentStep]);

  const handleInlineTopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setIsInlineSubmitting(true);

    try {
      const amt = parseFloat(inlineAmount);
      if (isNaN(amt) || amt < 100) {
        setInlineError('લઘુત્તમ રકમ ₹100 હોવી જોઈએ! (Minimum ₹100 required)');
        setIsInlineSubmitting(false);
        return;
      }

      if (!inlineUtr || inlineUtr.length < 10) {
        setInlineError('મહેરબાની કરીને સાચો ૧૨-આંકડાનો UTR નંબર દાખલ કરો! (Valid UTR required)');
        setIsInlineSubmitting(false);
        return;
      }

      const user = getLoggedInUser();
      const userId = user?.uid || 'guest_user';
      const userName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
      const userMobile = user?.mobile || '';

      const tx = await createWalletTransaction({
        userId,
        userName,
        userMobile,
        amount: amt,
        type: 'DEPOSIT_REQUEST',
        referenceId: inlineUtr,
        status: 'PENDING',
        paymentMethod: 'UPI_QR',
        notes: `ફોર્મ સબમિટ કરતી વખતે કરેલ વોલેટ રિચાર્જ વિનંતી (Wallet recharge request during form submission)`
      });

      setInlineSuccessTx(tx);
      setInlineStep('SUCCESS');
      
      // Reload wallet balance to show it
      const updatedWallet = await getWallet(userId);
      setWallet(updatedWallet);
    } catch (err: any) {
      console.error(err);
      setInlineError(err.message || 'વિનંતી સબમિટ કરવામાં કોઈ ભૂલ આવી છે. ફરી પ્રયાસ કરો.');
    } finally {
      setIsInlineSubmitting(false);
    }
  };

  // Load editing entry if provided
  useEffect(() => {
    if (editingEntry) {
            if (editingEntry.formType === 'PAN_CARD') {
        setPanDetails(editingEntry.details as PanCardDetails);
        setPanDocs(editingEntry.documents as PanCardDocs);
      } else if (editingEntry.formType === 'PAN_CARD_CORRECTION') {
        setPanCorrectionDetails(editingEntry.details as PanCardCorrectionDetails);
        setPanCorrectionDocs(editingEntry.documents as PanCardCorrectionDocs);
      } else if (editingEntry.formType === 'MINOR_PAN_CARD') {
        setMinorPanDetails(editingEntry.details as MinorPanCardDetails);
        setMinorPanDocs(editingEntry.documents as MinorPanCardDocs);
      } else if (editingEntry.formType === 'VOTER_ID_CORRECTION') {
        setVoterCorrectionDetails(editingEntry.details as VoterIdCorrectionDetails);
        setVoterCorrectionDocs(editingEntry.documents as VoterIdCorrectionDocs);
      } else if (editingEntry.formType === 'VOTER_ID') {
        setVoterDetails(editingEntry.details as VoterIdDetails);
        setVoterDocs(editingEntry.documents as VoterIdDocs);
      } else if (editingEntry.formType === 'E_SHRAM') {
        setEshramDetails(editingEntry.details as EShramDetails);
        setEshramDocs(editingEntry.documents as EShramDocs);
      } else if (editingEntry.formType === 'FARMER_SUBSIDY') {
        setFarmerDetails(editingEntry.details as FarmerSubsidyDetails);
        setFarmerDocs(editingEntry.documents as FarmerSubsidyDocs);
      } else if (editingEntry.formType === 'CAST_CERTIFICATE') {
        setCastDetails(editingEntry.details as CastCertificateDetails);
        setCastDocs(editingEntry.documents as CastCertificateDocs);
      } else if (editingEntry.formType === 'INCOME_CERTIFICATE') {
        setIncomeDetails(editingEntry.details as IncomeCertificateDetails);
        setIncomeDocs(editingEntry.documents as IncomeCertificateDocs);
      } else if (editingEntry.formType === 'AYUSHYMAN_CARD') {
        setAyushmanDetails(editingEntry.details as AyushmanCardDetails);
        setAyushmanDocs(editingEntry.documents as AyushmanCardDocs);
      } else if (editingEntry.formType === 'AABHA_CARD') {
        setAabhaDetails(editingEntry.details as AabhaCardDetails);
        setAabhaDocs(editingEntry.documents as AabhaCardDocs);
      
      } else if (editingEntry.formType === 'NEW_BIRTH_CERTIFICATE') {
        setNewBirthDetails(editingEntry.details as NewBirthCertificateDetails);
        setNewBirthDocs(editingEntry.documents as NewBirthCertificateDocs);
      } else if (editingEntry.formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        setBirthCorrectionDetails(editingEntry.details as BirthCertificateCorrectionDetails);
        setBirthCorrectionDocs(editingEntry.documents as BirthCertificateCorrectionDocs);
      } else if (editingEntry.formType === 'DEATH_CERTIFICATE') {
        setDeathDetails(editingEntry.details as DeathCertificateDetails);
        setDeathDocs(editingEntry.documents as DeathCertificateDocs);
} else if (editingEntry.formType === 'OTHER_SERVICE') {
        setOtherDetails(editingEntry.details as OtherServiceDetails);
        setOtherDocs(editingEntry.documents as OtherServiceDocs);
      } else if (editingEntry.formType === 'UDHYAM_AADHAR') {
        setUdhyamDetails(editingEntry.details as UdhyamAadharDetails);
        setUdhyamDocs(editingEntry.documents as UdhyamAadharDocs);
      } else if (editingEntry.formType === 'MANAV_KALYAN') {
        setManavDetails(editingEntry.details as ManavKalyanDetails);
        setManavDocs(editingEntry.documents as ManavKalyanDocs);
      } else if (editingEntry.formType === 'KUVAR_BAI_MAMERU') {
        setKuvarDetails(editingEntry.details as KuvarBaiMameruDetails);
        setKuvarDocs(editingEntry.documents as KuvarBaiMameruDocs);
      } else if (editingEntry.formType === 'RATION_CARD_ADD_NAME') {
        setRationCardAddDetails(editingEntry.details as RationCardAddNameDetails);
        setRationCardAddDocs(editingEntry.documents as RationCardAddNameDocs);
      } else if (editingEntry.formType === 'RATION_CARD_REMOVE_NAME') {
        setRationCardRemoveDetails(editingEntry.details as RationCardRemoveNameDetails);
        setRationCardRemoveDocs(editingEntry.documents as RationCardRemoveNameDocs);
      } else if (editingEntry.formType === 'RATION_CARD_CORRECTION') {
        setRationCardCorrectionDetails(editingEntry.details as RationCardCorrectionDetails);
        setRationCardCorrectionDocs(editingEntry.documents as RationCardCorrectionDocs);
      } else if (editingEntry.formType === 'PASSPORT') {
        setPassportDetails(editingEntry.details as PassportDetails);
        setPassportDocs(editingEntry.documents as PassportDocs);
      }
    } else {
      // Reset to defaults
      setPassportDetails({ ...initialPassportDetails });
      setPassportDocs({ ...initialPassportDocs });
      setPanDetails({ ...initialPanDetails });
      setPanDocs({ ...initialPanDocs });
      setPanCorrectionDetails({ ...initialPanCorrectionDetails });
      setPanCorrectionDocs({ ...initialPanCorrectionDocs });
      setMinorPanDetails({ ...initialMinorPanDetails });
      setMinorPanDocs({ ...initialMinorPanDocs });
      setVoterCorrectionDetails({ ...initialVoterCorrectionDetails });
      setVoterCorrectionDocs({ ...initialVoterCorrectionDocs });
      setVoterDetails({ ...initialVoterDetails });
      setVoterDocs({ ...initialVoterDocs });
      setEshramDetails({ ...initialEShramDetails });
      setEshramDocs({ ...initialEShramDocs });
      setFarmerDetails({ ...initialFarmerDetails });
      setFarmerDocs({ ...initialFarmerDocs });
      setCastDetails({ ...initialCastDetails });
      setCastDocs({ ...initialCastDocs });
      setIncomeDetails({ ...initialIncomeDetails });
      setIncomeDocs({ ...initialIncomeDocs });
      setAyushmanDetails({ ...initialAyushmanDetails });
      setAyushmanDocs({ ...initialAyushmanDocs });
      setAabhaDetails({ ...initialAabhaDetails });
      setAabhaDocs({ ...initialAabhaDocs });
      setOtherDetails({ ...initialOtherDetails });

      setNewBirthDetails({ ...initialNewBirthCertificateDetails });
      setNewBirthDocs({ ...initialNewBirthCertificateDocs });
      setBirthCorrectionDetails({ ...initialBirthCertificateCorrectionDetails });
      setBirthCorrectionDocs({ ...initialBirthCertificateCorrectionDocs });
      setDeathDetails({ ...initialDeathCertificateDetails });
      setDeathDocs({ ...initialDeathCertificateDocs });

      setOtherDocs({ ...initialOtherDocs });
      setUdhyamDetails({ ...initialUdhyamDetails });
      setUdhyamDocs({ ...initialUdhyamDocs });
      setManavDetails({ ...initialManavDetails });
      setManavDocs({ ...initialManavDocs });
      setKuvarDetails({ ...initialKuvarDetails });
      setKuvarDocs({ ...initialKuvarDocs });

      setRationCardAddDetails({ ...initialRationCardAddNameDetails });
      setRationCardAddDocs({ ...initialRationCardAddNameDocs });
      setRationCardRemoveDetails({ ...initialRationCardRemoveNameDetails });
      setRationCardRemoveDocs({ ...initialRationCardRemoveNameDocs });
      setRationCardCorrectionDetails({ ...initialRationCardCorrectionDetails });
      setRationCardCorrectionDocs({ ...initialRationCardCorrectionDocs });
    }
    setErrors({});
  }, [editingEntry, formType]);

  // Handle Input Changes with Errors removal
  const handlePanDetailsChange = (key: keyof PanCardDetails, value: string) => {
    setPanDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleVoterDetailsChange = (key: keyof VoterIdDetails, value: string) => {
    setVoterDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleEshramDetailsChange = (key: keyof EShramDetails, value: string) => {
    setEshramDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleFarmerDetailsChange = (key: keyof FarmerSubsidyDetails, value: string) => {
    setFarmerDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleCastDetailsChange = (key: keyof CastCertificateDetails, value: string) => {
    setCastDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleIncomeDetailsChange = (key: keyof IncomeCertificateDetails, value: string) => {
    setIncomeDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleAyushmanDetailsChange = (key: keyof AyushmanCardDetails, value: string) => {
    setAyushmanDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleAabhaDetailsChange = (key: keyof AabhaCardDetails, value: string) => {
    setAabhaDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleOtherDetailsChange = (key: keyof OtherServiceDetails, value: string) => {
    setOtherDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleUdhyamDetailsChange = (key: keyof UdhyamAadharDetails, value: string) => {
    setUdhyamDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleManavDetailsChange = (key: keyof ManavKalyanDetails, value: string) => {
    setManavDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleKuvarDetailsChange = (key: keyof KuvarBaiMameruDetails, value: string) => {
    setKuvarDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleRationCardAddDetailsChange = (key: keyof RationCardAddNameDetails, value: string) => {
    setRationCardAddDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleRationCardRemoveDetailsChange = (key: keyof RationCardRemoveNameDetails, value: string) => {
    setRationCardRemoveDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const handleRationCardCorrectionDetailsChange = (key: keyof RationCardCorrectionDetails, value: string) => {
    setRationCardCorrectionDetails(prev => ({ ...prev, [key]: value }));
    removeError(key);
  };

  const removeError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Form Validations (English and Gujarati explanations)
  const validateForm = (isDraft: boolean = false): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!isDraft) {
      if (formType === 'PAN_CARD') {
        if (!panDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે (First name is required)';
        if (!panDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે (Last name is required)';
        if (!panDetails.fatherFirstName.trim()) newErrors.fatherFirstName = 'પિતાનું પ્રથમ નામ જરૂરી છે';
        if (!panDetails.fatherLastName.trim()) newErrors.fatherLastName = 'પિતાની અટક જરૂરી છે';
        if (!panDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!panDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(panDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!panDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(panDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!panDetails.gender) {
          newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે (Gender is required)';
        }

        // Docs validation
        if (!panDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!panDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!panDocs.birthProofType) {
          newErrors.birthProofType = 'જન્મ પુરાવાનો પ્રકાર પસંદ કરો';
        } else if (panDocs.birthProofType === 'BIRTH_CERTIFICATE') {
          if (!panDocs.birthProofDoc) {
            newErrors.birthProofDoc = 'જન્મ પ્રમાણપત્ર અપલોડ કરો';
          }
        } else if (panDocs.birthProofType === 'VOTER_ID') {
          if (!panDocs.voterIdFront) {
            newErrors.voterIdFront = 'મતદાર આઈડી કાર્ડ આગળનો ભાગ અપલોડ કરો';
          }
          if (!panDocs.voterIdBack) {
            newErrors.voterIdBack = 'મતદાર આઈડી કાર્ડ પાછળનો ભાગ અપલોડ કરો';
          }
        }
        if (!panDocs.signature) newErrors.signature = 'અરજદારની સહી અપલોડ કરો';
        if (!panDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';

      } else if (formType === 'PAN_CARD_CORRECTION') {
        if (!panCorrectionDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે (First name is required)';
        if (!panCorrectionDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે (Last name is required)';
        if (!panCorrectionDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!panCorrectionDetails.mobile.trim()) newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        if (!panCorrectionDetails.email.trim()) newErrors.email = 'ઇમેઇલ જરૂરી છે';
        if (!panCorrectionDetails.oldPanCardNumber.trim()) newErrors.oldPanCardNumber = 'જૂનો પેન કાર્ડ નંબર જરૂરી છે';
        if (!panCorrectionDetails.correctionDetails || panCorrectionDetails.correctionDetails.length === 0) newErrors.correctionDetails = 'સુધારાની વિગતો પસંદ કરો';
        if (!panCorrectionDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        if (!panCorrectionDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!panCorrectionDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!panCorrectionDocs.signature) newErrors.signature = 'અરજદારની સહી અપલોડ કરો';
        if (!panCorrectionDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!panCorrectionDocs.birthProofType) newErrors.birthProofType = 'જન્મ પુરાવાનો પ્રકાર પસંદ કરો';
        if (panCorrectionDocs.birthProofType === 'VOTER_ID') {
          if (!panCorrectionDocs.voterIdFront) newErrors.voterIdFront = 'મતદાર આઈડી કાર્ડ આગળનો ભાગ અપલોડ કરો';
          if (!panCorrectionDocs.voterIdBack) newErrors.voterIdBack = 'મતદાર આઈડી કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        } else if (panCorrectionDocs.birthProofType === 'BIRTH_CERTIFICATE') {
          if (!panCorrectionDocs.birthProofDoc) newErrors.birthProofDoc = 'જન્મ પ્રમાણપત્ર અપલોડ કરો';
        }

      } else if (formType === 'MINOR_PAN_CARD') {
        if (!minorPanDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!minorPanDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!minorPanDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!minorPanDetails.mobile.trim()) newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        if (!minorPanDetails.email.trim()) newErrors.email = 'ઇમેઇલ જરૂરી છે';
        if (!minorPanDetails.representative) newErrors.representative = 'પ્રતિનિધિ પસંદ કરો';
        if (!minorPanDetails.repFirstName.trim()) newErrors.repFirstName = 'પ્રતિનિધિનું પ્રથમ નામ જરૂરી છે';
        if (!minorPanDetails.repLastName.trim()) newErrors.repLastName = 'પ્રતિનિધિની અટક જરૂરી છે';
        if (!minorPanDetails.repDesignation.trim()) newErrors.repDesignation = 'પ્રતિનિધિ હોદ્દો જરૂરી છે';
        if (!minorPanDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        if (!minorPanDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!minorPanDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!minorPanDocs.birthCertificate) newErrors.birthCertificate = 'જન્મ પ્રમાણપત્ર અપલોડ કરો';
        if (!minorPanDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!minorPanDocs.repSignature) newErrors.repSignature = 'પ્રતિનિધિની સહી અપલોડ કરો';
        if (!minorPanDocs.repDocType) newErrors.repDocType = 'પ્રતિનિધિનો દસ્તાવેજ પસંદ કરો';
        if (minorPanDocs.repDocType === 'AADHAR_CARD') {
          if (!minorPanDocs.repAadharFront) newErrors.repAadharFront = 'પ્રતિનિધિનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
          if (!minorPanDocs.repAadharBack) newErrors.repAadharBack = 'પ્રતિનિધિનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        } else if (minorPanDocs.repDocType === 'PAN_CARD') {
          if (!minorPanDocs.repPanCard) newErrors.repPanCard = 'પ્રતિનિધિનું પેન કાર્ડ અપલોડ કરો';
        }

      } else if (formType === 'VOTER_ID_CORRECTION') {
        if (!voterCorrectionDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!voterCorrectionDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!voterCorrectionDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!voterCorrectionDetails.mobile.trim()) newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        if (!voterCorrectionDetails.email.trim()) newErrors.email = 'ઇમેઇલ જરૂરી છે';
        if (!voterCorrectionDetails.correctionDetails || voterCorrectionDetails.correctionDetails.length === 0) newErrors.correctionDetails = 'સુધારાની વિગતો પસંદ કરો';
        if (!voterCorrectionDetails.relativeType) newErrors.relativeType = 'સંબંધીનો પ્રકાર પસંદ કરો';
        if (!voterCorrectionDetails.relativeFirstName.trim()) newErrors.relativeFirstName = 'સંબંધીનું પ્રથમ નામ જરૂરી છે';
        if (!voterCorrectionDetails.relativeLastName.trim()) newErrors.relativeLastName = 'સંબંધીની અટક જરૂરી છે';
        if (!voterCorrectionDetails.relativeEpicCardNumber.trim()) newErrors.relativeEpicCardNumber = 'સંબંધીનો ચૂંટણી કાર્ડ નંબર જરૂરી છે';
        if (!voterCorrectionDetails.oldEpicCardNumber.trim()) newErrors.oldEpicCardNumber = 'જૂનો ચૂંટણી કાર્ડ નંબર જરૂરી છે';
        if (!voterCorrectionDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        if (!voterCorrectionDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!voterCorrectionDocs.birthProofType) newErrors.birthProofType = 'જન્મ પુરાવાનો પ્રકાર પસંદ કરો';
        if (!voterCorrectionDocs.birthProofDoc) newErrors.birthProofDoc = 'જન્મ પુરાવો અપલોડ કરો';
        if (!voterCorrectionDocs.oldEpicCardFront) newErrors.oldEpicCardFront = 'જૂનો ચૂંટણી કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.oldEpicCardBack) newErrors.oldEpicCardBack = 'જૂનો ચૂંટણી કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.relativeEpicCardFront) newErrors.relativeEpicCardFront = 'સંબંધીનો ચૂંટણી કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.relativeEpicCardBack) newErrors.relativeEpicCardBack = 'સંબંધીનો ચૂંટણી કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!voterCorrectionDocs.addressProof) newErrors.addressProof = 'સરનામાનો પુરાવો અપલોડ કરો';


      } else if (formType === 'VOTER_ID') {
        if (!voterDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!voterDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!voterDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!voterDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(voterDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!voterDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(voterDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!voterDetails.fatherFirstName.trim()) newErrors.fatherFirstName = 'પિતાનું પ્રથમ નામ જરૂરી છે';
        if (!voterDetails.fatherLastName.trim()) newErrors.fatherLastName = 'પિતાની અટક જરૂરી છે';
        if (!voterDetails.relativeEpicNumber.trim()) newErrors.relativeEpicNumber = 'સંબંધીનો EPIC નંબર જરૂરી છે';
        if (!voterDetails.relativeType) newErrors.relativeType = 'સંબંધ પ્રકાર પસંદ કરો';
        if (!voterDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs validation
        if (!voterDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!voterDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!voterDocs.birthProofType) newErrors.birthProofType = 'જન્મ પુરાવાનો પ્રકાર પસંદ કરો';
        if (!voterDocs.birthProofDoc) newErrors.birthProofDoc = 'જન્મ પુરાવો અપલોડ કરો';
        if (!voterDocs.relativeEpicCardFront) newErrors.relativeEpicCardFront = 'સંબંધીનું EPIC કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!voterDocs.relativeEpicCardBack) newErrors.relativeEpicCardBack = 'સંબંધીનું EPIC કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!voterDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ ફોટો અપલોડ કરો';

      } else if (formType === 'E_SHRAM') {
        if (!eshramDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!eshramDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!eshramDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!eshramDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(eshramDetails.mobile.trim())) {
          newErrors.mobile = '૧０ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!eshramDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(eshramDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!eshramDetails.bankAccountNum.trim()) newErrors.bankAccountNum = 'બેંક ખાતા નંબર જરૂરી છે';
        if (!eshramDetails.bankIfsc.trim()) newErrors.bankIfsc = 'IFSC કોડ જરૂરી છે';
        if (!eshramDetails.bankHolderName.trim()) newErrors.bankHolderName = 'ખાતાધારકનું નામ જરૂરી છે';
        if (!eshramDetails.occupation.trim()) newErrors.occupation = 'વ્યવસાય/કામની વિગતો જરૂરી છે';
        if (!eshramDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!eshramDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!eshramDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!eshramDocs.bankPassbook) newErrors.bankPassbook = 'બેંક પાસબુક અપલોડ કરો';
        if (!eshramDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ ફોટો અપલોડ કરો';

      } else if (formType === 'FARMER_SUBSIDY') {
        if (!farmerDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!farmerDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!farmerDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(farmerDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!farmerDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(farmerDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!farmerDetails.villageName.trim()) newErrors.villageName = 'ગામનું નામ જરૂરી છે';
        if (!farmerDetails.district.trim()) newErrors.district = 'જિલ્લાનું નામ જરૂરી છે';
        if (!farmerDetails.subDistrict.trim()) newErrors.subDistrict = 'તાલુકો જરૂરી છે';
        if (!farmerDetails.surveyNumber.trim()) newErrors.surveyNumber = 'ખાતા નંબર અથવા સર્વે નંબર જરૂરી છે';
        if (!farmerDetails.subsidyScheme.trim()) newErrors.subsidyScheme = 'સબસિડી યોજના ટાઈપ કરો';
        if (!farmerDetails.bankAccountNum.trim()) newErrors.bankAccountNum = 'બેંક ખાતા નંબર જરૂરી છે';
        if (!farmerDetails.bankIfsc.trim()) newErrors.bankIfsc = 'IFSC કોડ જરૂરી છે';
        if (!farmerDetails.bankHolderName.trim()) newErrors.bankHolderName = 'ખાતાધારકનું નામ જરૂરી છે';
        if (!farmerDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!farmerDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!farmerDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!farmerDocs.landDoc) newErrors.landDoc = '7/12-8A જમીન નકશો અપલોડ કરો';
        if (!farmerDocs.bankPassbook) newErrors.bankPassbook = 'બેંક પાસબુક અપલોડ કરો';
      } else if (formType === 'CAST_CERTIFICATE') {
        if (!castDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!castDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!castDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!castDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(castDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!castDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(castDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!castDetails.purpose.trim()) newErrors.purpose = 'પ્રમાણપત્રનો હેતુ ટાઈપ કરો';
        if (!castDetails.fatherFirstName.trim()) newErrors.fatherFirstName = 'પિતાનું પ્રથમ નામ જરૂરી છે';
        if (!castDetails.fatherLastName.trim()) newErrors.fatherLastName = 'પિતાની અટક જરૂરી છે';
        if (!castDetails.caste) newErrors.caste = 'જાતિ (Caste Category) પસંદ કરો';
        if (!castDetails.subCaste.trim()) newErrors.subCaste = 'પેટા જાતિ (Sub-Caste) જરૂરી છે';
        if (!castDetails.fatherCaste.trim()) newErrors.fatherCaste = 'પિતાની જાતિ જરૂરી છે';
        if (!castDetails.fatherSubCaste.trim()) newErrors.fatherSubCaste = 'પિતાની પેટા જાતિ જરૂરી છે';
        if (!castDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!castDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનું પાનું અપલોડ કરો';
        if (!castDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનું પાનું અપલોડ કરો';
        if (!castDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!castDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!castDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!castDocs.schoolLeaving) newErrors.schoolLeaving = 'શાળા છોડ્યાનું પ્રમાણપત્ર અપલોડ કરો';
        if (!castDocs.fatherSchoolLeaving) newErrors.fatherSchoolLeaving = 'પિતાનું શાળા છોડ્યાનું પ્રમાણપત્ર અપલોડ કરો';

      } else if (formType === 'INCOME_CERTIFICATE') {
        if (!incomeDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!incomeDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!incomeDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!incomeDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(incomeDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!incomeDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(incomeDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!incomeDetails.purpose.trim()) newErrors.purpose = 'પ્રમાણપત્રનો હેતુ ટાઈપ કરો';
        if (!incomeDetails.rationCardNumber.trim()) newErrors.rationCardNumber = 'રેશનકાર્ડ નંબર જરૂરી છે';
        if (!incomeDetails.rationCardMemberId.trim()) newErrors.rationCardMemberId = 'રેશનકાર્ડ સભ્ય આઈડી જરૂરી છે';
        if (!incomeDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!incomeDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!incomeDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!incomeDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!incomeDocs.electricityBill) newErrors.electricityBill = 'છેલ્લું લાઇટ બિલ અપલોડ કરો';
        if (!incomeDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનું પાનું અપલોડ કરો';
        if (!incomeDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનું પાનું અપલોડ કરો';

      } else if (formType === 'AYUSHYMAN_CARD') {
        if (!ayushmanDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!ayushmanDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!ayushmanDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!ayushmanDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(ayushmanDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!ayushmanDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(ayushmanDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!ayushmanDetails.rationCardNumber.trim()) newErrors.rationCardNumber = 'રેશનકાર્ડ નંબર જરૂરી છે';
        if (!ayushmanDetails.aadharCardNumber.trim()) {
          newErrors.aadharCardNumber = 'આધાર કાર્ડ નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(ayushmanDetails.aadharCardNumber.trim())) {
          newErrors.aadharCardNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!ayushmanDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!ayushmanDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!ayushmanDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!ayushmanDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનું પાનું અપલોડ કરો';
        if (!ayushmanDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનું પાનું અપલોડ કરો';
        if (!ayushmanDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';

      } else if (formType === 'AABHA_CARD') {
        if (!aabhaDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!aabhaDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!aabhaDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!aabhaDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(aabhaDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!aabhaDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(aabhaDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!aabhaDetails.aadharCardNumber.trim()) {
          newErrors.aadharCardNumber = 'આધાર કાર્ડ નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(aabhaDetails.aadharCardNumber.trim())) {
          newErrors.aadharCardNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!aabhaDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Docs
        if (!aabhaDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!aabhaDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!aabhaDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';

      } 
      else if (formType === 'NEW_BIRTH_CERTIFICATE') {
        if (!newBirthDetails.childFullNameGu.trim()) newErrors.childFullNameGu = 'બાળકનું પૂરું નામ ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.childFullNameEn.trim()) newErrors.childFullNameEn = 'બાળકનું પૂરું નામ English માં જરૂરી છે';
        if (!newBirthDetails.dob.trim()) newErrors.dob = 'જન્મ તારીખ જરૂરી છે';
        if (!newBirthDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';
        if (!newBirthDetails.birthPlace) {
          newErrors.birthPlace = 'જન્મ સ્થળ પસંદ કરવું જરૂરી છે';
        } else {
          if (newBirthDetails.birthPlace === 'HOSPITAL' || newBirthDetails.birthPlace === 'SANSTHA') {
            if (!newBirthDetails.hospitalName.trim()) newErrors.hospitalName = 'હોસ્પિટલ/સંસ્થાનું નામ જરૂરી છે';
            if (!newBirthDetails.hospitalAddress.trim()) newErrors.hospitalAddress = 'હોસ્પિટલ/સંસ્થાનું સરનામું જરૂરી છે';
            if (!newBirthDocs.hospitalReceipt) newErrors.hospitalReceipt = 'હોસ્પિટલ/સંસ્થાની પહોંચ અપલોડ કરવી જરૂરી છે';
          } else if (newBirthDetails.birthPlace === 'HOME') {
            if (!newBirthDetails.bornTimeAddress.trim()) newErrors.bornTimeAddress = 'જન્મ સમયનું સરનામું જરૂરી છે';
          }
        }
        if (!newBirthDetails.permanentAddress.trim()) newErrors.permanentAddress = 'કાયમી સરનામું જરૂરી છે';

        // Father & Mother Details
        if (!newBirthDetails.fatherFirstNameGu.trim()) newErrors.fatherFirstNameGu = 'પિતાનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.fatherLastNameGu.trim()) newErrors.fatherLastNameGu = 'પિતાની અટક ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.fatherFirstNameEn.trim()) newErrors.fatherFirstNameEn = 'પિતાનું પ્રથમ નામ English માં જરૂરી છે';
        if (!newBirthDetails.fatherLastNameEn.trim()) newErrors.fatherLastNameEn = 'પિતાની અટક English માં જરૂરી છે';
        if (!newBirthDetails.fatherAadhar.trim()) {
          newErrors.fatherAadhar = 'પિતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(newBirthDetails.fatherAadhar.trim())) {
          newErrors.fatherAadhar = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }

        if (!newBirthDetails.motherFirstNameGu.trim()) newErrors.motherFirstNameGu = 'માતાનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.motherLastNameGu.trim()) newErrors.motherLastNameGu = 'માતાની અટક ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.motherFirstNameEn.trim()) newErrors.motherFirstNameEn = 'માતાનું પ્રથમ નામ English માં જરૂરી છે';
        if (!newBirthDetails.motherLastNameEn.trim()) newErrors.motherLastNameEn = 'માતાની અટક English માં જરૂરી છે';
        if (!newBirthDetails.motherAadhar.trim()) {
          newErrors.motherAadhar = 'માતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(newBirthDetails.motherAadhar.trim())) {
          newErrors.motherAadhar = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }

        // Informer details
        if (!newBirthDetails.informerFirstNameGu.trim()) newErrors.informerFirstNameGu = 'માહિતી આપનારનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.informerLastNameGu.trim()) newErrors.informerLastNameGu = 'માહિતી આપનારની અટક ગુજરાતીમાં જરૂરી છે';
        if (!newBirthDetails.informerRelationship.trim()) newErrors.informerRelationship = 'બાળક સાથેનો સંબંધ જરૂરી છે';
        if (!newBirthDetails.informerMobile.trim()) {
          newErrors.informerMobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(newBirthDetails.informerMobile.trim())) {
          newErrors.informerMobile = '૧૦ આંકડાનો મોબાઇલ નંબર લખો';
        }
        if (!newBirthDetails.informerAddress.trim()) newErrors.informerAddress = 'માહિતી આપનારનું સરનામું જરૂરી છે';

        // Documents
        if (!newBirthDocs.informerAadharFront) newErrors.informerAadharFront = 'માહિતી આપનારનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!newBirthDocs.informerAadharBack) newErrors.informerAadharBack = 'માહિતી આપનારનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!newBirthDocs.informerSignature) newErrors.informerSignature = 'માહિતી આપનારની સહી અપલોડ કરો';
        if (!newBirthDocs.fatherAadharFront) newErrors.fatherAadharFront = 'પિતાનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!newBirthDocs.fatherAadharBack) newErrors.fatherAadharBack = 'પિતાનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!newBirthDocs.motherAadharFront) newErrors.motherAadharFront = 'માતાનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!newBirthDocs.motherAadharBack) newErrors.motherAadharBack = 'માતાનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
      }
      else if (formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        if (!birthCorrectionDetails.childFullNameGu.trim()) newErrors.childFullNameGu = 'બાળકનું પૂરું નામ ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.childFullNameEn.trim()) newErrors.childFullNameEn = 'બાળકનું પૂરું નામ English માં જરૂરી છે';
        if (!birthCorrectionDetails.dob.trim()) newErrors.dob = 'જન્મ તારીખ જરૂરી છે';
        if (!birthCorrectionDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';
        if (!birthCorrectionDetails.birthPlace) {
          newErrors.birthPlace = 'જન્મ સ્થળ પસંદ કરવું જરૂરી છે';
        } else {
          if (birthCorrectionDetails.birthPlace === 'HOSPITAL' || birthCorrectionDetails.birthPlace === 'SANSTHA') {
            if (!birthCorrectionDetails.hospitalName.trim()) newErrors.hospitalName = 'હોસ્પિટલ/સંસ્થાનું નામ જરૂરી છે';
            if (!birthCorrectionDetails.hospitalAddress.trim()) newErrors.hospitalAddress = 'હોસ્પિટલ/સંસ્થાનું સરનામું જરૂરી છે';
          } else if (birthCorrectionDetails.birthPlace === 'HOME') {
            if (!birthCorrectionDetails.bornTimeAddress.trim()) newErrors.bornTimeAddress = 'જન્મ સમયનું સરનામું જરૂરી છે';
          }
        }
        if (!birthCorrectionDetails.permanentAddress.trim()) newErrors.permanentAddress = 'કાયમી સરનામું જરૂરી છે';

        // Father & Mother Details
        if (!birthCorrectionDetails.fatherFirstNameGu.trim()) newErrors.fatherFirstNameGu = 'પિતાનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.fatherLastNameGu.trim()) newErrors.fatherLastNameGu = 'પિતાની અટક ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.fatherFirstNameEn.trim()) newErrors.fatherFirstNameEn = 'પિતાનું પ્રથમ નામ English માં જરૂરી છે';
        if (!birthCorrectionDetails.fatherLastNameEn.trim()) newErrors.fatherLastNameEn = 'પિતાની અટક English માં જરૂરી છે';
        if (!birthCorrectionDetails.fatherAadhar.trim()) {
          newErrors.fatherAadhar = 'પિતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(birthCorrectionDetails.fatherAadhar.trim())) {
          newErrors.fatherAadhar = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }

        if (!birthCorrectionDetails.motherFirstNameGu.trim()) newErrors.motherFirstNameGu = 'માતાનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.motherLastNameGu.trim()) newErrors.motherLastNameGu = 'માતાની અટક ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.motherFirstNameEn.trim()) newErrors.motherFirstNameEn = 'માતાનું પ્રથમ નામ English માં જરૂરી છે';
        if (!birthCorrectionDetails.motherLastNameEn.trim()) newErrors.motherLastNameEn = 'માતાની અટક English માં જરૂરી છે';
        if (!birthCorrectionDetails.motherAadhar.trim()) {
          newErrors.motherAadhar = 'માતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(birthCorrectionDetails.motherAadhar.trim())) {
          newErrors.motherAadhar = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }

        // Informer Details
        if (!birthCorrectionDetails.informerFirstNameGu.trim()) newErrors.informerFirstNameGu = 'માહિતી આપનારનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.informerLastNameGu.trim()) newErrors.informerLastNameGu = 'માહિતી આપનારની અટક ગુજરાતીમાં જરૂરી છે';
        if (!birthCorrectionDetails.informerRelationship.trim()) newErrors.informerRelationship = 'બાળક સાથેનો સંબંધ જરૂરી છે';
        if (!birthCorrectionDetails.informerMobile.trim()) {
          newErrors.informerMobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(birthCorrectionDetails.informerMobile.trim())) {
          newErrors.informerMobile = '૧૦ આંકડાનો મોબાઇલ નંબર લખો';
        }
        if (!birthCorrectionDetails.informerAddress.trim()) newErrors.informerAddress = 'માહિતી આપનારનું સરનામું જરૂરી છે';

        // Documents
        if (!birthCorrectionDocs.oldBirthCertificate) newErrors.oldBirthCertificate = 'જૂનું જન્મ પ્રમાણપત્ર અપલોડ કરો';
        if (!birthCorrectionDocs.informerAadharFront) newErrors.informerAadharFront = 'માહિતી આપનારનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!birthCorrectionDocs.informerAadharBack) newErrors.informerAadharBack = 'માહિતી આપનારનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!birthCorrectionDocs.informerSignature) newErrors.informerSignature = 'માહિતી આપનારની સહી અપલોડ કરો';
        if (!birthCorrectionDocs.fatherAadharFront) newErrors.fatherAadharFront = 'પિતાનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!birthCorrectionDocs.fatherAadharBack) newErrors.fatherAadharBack = 'પિતાનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!birthCorrectionDocs.motherAadharFront) newErrors.motherAadharFront = 'માતાનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!birthCorrectionDocs.motherAadharBack) newErrors.motherAadharBack = 'માતાનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
      }
      else if (formType === 'DEATH_CERTIFICATE') {
        if (!deathDetails.informerFirstNameGu.trim()) newErrors.informerFirstNameGu = 'માહિતી આપનારનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!deathDetails.informerLastNameGu.trim()) newErrors.informerLastNameGu = 'માહિતી આપનારની અટક ગુજરાતીમાં જરૂરી છે';
        if (!deathDetails.informerFirstNameEn.trim()) newErrors.informerFirstNameEn = 'માહિતી આપનારનું પ્રથમ નામ English માં જરૂરી છે';
        if (!deathDetails.informerLastNameEn.trim()) newErrors.informerLastNameEn = 'માહિતી આપનારની અટક English માં જરૂરી છે';
        if (!deathDetails.nomineeFirstNameGu.trim()) newErrors.nomineeFirstNameGu = 'વારસદારનું પ્રથમ નામ ગુજરાતીમાં જરૂરી છે';
        if (!deathDetails.nomineeLastNameGu.trim()) newErrors.nomineeLastNameGu = 'વારસદારની અટક ગુજરાતીમાં જરૂરી છે';
        if (!deathDetails.nomineeFirstNameEn.trim()) newErrors.nomineeFirstNameEn = 'વારસદારનું પ્રથમ નામ English માં જરૂરી છે';
        if (!deathDetails.nomineeLastNameEn.trim()) newErrors.nomineeLastNameEn = 'વારસદારની અટક English માં જરૂરી છે';
        if (!deathDetails.nomineeRelationship.trim()) newErrors.nomineeRelationship = 'વારસદારનો સંબંધ જરૂરી છે';
        if (!deathDetails.nomineeMobile.trim()) {
          newErrors.nomineeMobile = 'વારસદારનો મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(deathDetails.nomineeMobile.trim())) {
          newErrors.nomineeMobile = '૧૦ આંકડાનો મોબાઇલ નંબર લખો';
        }
        if (!deathDetails.nomineeAadhar.trim()) {
          newErrors.nomineeAadhar = 'વારસદારનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(deathDetails.nomineeAadhar.trim())) {
          newErrors.nomineeAadhar = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }

        // Documents
        if (!deathDocs.informerAadharFront) newErrors.informerAadharFront = 'માહિતી આપનારનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!deathDocs.informerAadharBack) newErrors.informerAadharBack = 'માહિતી આપનારનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!deathDocs.informerSignature) newErrors.informerSignature = 'માહિતી આપનારની સહી અપલોડ કરો';
        
        if (!deathDocs.deathPersonPhoto) newErrors.deathPersonPhoto = 'મૃતકનો પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!deathDocs.deathPersonAadharFront) newErrors.deathPersonAadharFront = 'મૃતકનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!deathDocs.deathPersonAadharBack) newErrors.deathPersonAadharBack = 'મૃતકનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!deathDocs.deathPersonRationFront) newErrors.deathPersonRationFront = 'મૃતકનું રેશન કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!deathDocs.deathPersonRationBack) newErrors.deathPersonRationBack = 'મૃતકનું રેશન કાર્ડ પાછળનો ભાગ અપલોડ કરો';

        if (!deathDocs.nomineePhoto) newErrors.nomineePhoto = 'વારસદારનો પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!deathDocs.nomineeAadharFront) newErrors.nomineeAadharFront = 'વારસદારનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!deathDocs.nomineeAadharBack) newErrors.nomineeAadharBack = 'વારસદારનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!deathDocs.nomineeSignature) newErrors.nomineeSignature = 'વારસદારની સહીનો ફોટો અપલોડ કરો';
      }
      else if (formType === 'OTHER_SERVICE') {
        if (!otherDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!otherDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!otherDetails.serviceName.trim()) newErrors.serviceName = 'સેવાનું નામ લખો';
        if (!otherDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(otherDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!otherDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';
      } else if (formType === 'UDHYAM_AADHAR') {
        if (!udhyamDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!udhyamDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!udhyamDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(udhyamDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!udhyamDetails.email.trim()) {
          newErrors.email = 'ઇમેઇલ જરૂરી છે';
        } else if (!/\S+@\S+\.\S+/.test(udhyamDetails.email.trim())) {
          newErrors.email = 'માન્ય ઇમેઇલ દાખલ કરો';
        }
        if (!udhyamDetails.businessName.trim()) newErrors.businessName = 'વ્યવસાયનું નામ જરૂરી છે';
        if (!udhyamDetails.businessCategory) newErrors.businessCategory = 'વ્યવસાયની શ્રેણી પસંદ કરો';
        if (!udhyamDetails.aadharCardNumber.trim()) {
          newErrors.aadharCardNumber = 'આધાર કાર્ડ નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(udhyamDetails.aadharCardNumber.trim())) {
          newErrors.aadharCardNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!udhyamDetails.panCardNumber.trim()) {
          newErrors.panCardNumber = 'પાનકાર્ડ નંબર જરૂરી છે';
        }
        if (!udhyamDetails.bankAccountNum.trim()) newErrors.bankAccountNum = 'બેંક ખાતા નંબર જરૂરી છે';
        if (!udhyamDetails.bankIfsc.trim()) newErrors.bankIfsc = 'બેંક IFSC કોડ જરૂરી છે';
        if (!udhyamDetails.bankHolderName.trim()) newErrors.bankHolderName = 'ખાતાધારકનું નામ જરૂરી છે';
        if (!udhyamDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Documents validation
        if (!udhyamDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!udhyamDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!udhyamDocs.panCard) newErrors.panCard = 'પાનકાર્ડ અપલોડ કરો';
        if (!udhyamDocs.bankPassbook) newErrors.bankPassbook = 'બેંક પાસબુક અપલોડ કરો';
      } else if (formType === 'MANAV_KALYAN') {
        if (!manavDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!manavDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!manavDetails.mobile.trim()) {
          newErrors.mobile = 'મોબાઇલ નંબર જરૂરી છે';
        } else if (!/^[0-9]{10}$/.test(manavDetails.mobile.trim())) {
          newErrors.mobile = '૧૦ આંકડાનો મોબાઇલ નંબર દાખલ કરો';
        }
        if (!manavDetails.dob) newErrors.dob = 'જન્મતારીખ જરૂરી છે';
        if (!manavDetails.caste) newErrors.caste = 'જાતિ પસંદ કરો';
        if (!manavDetails.scheme) newErrors.scheme = 'યોજના પસંદ કરો';
        if (!manavDetails.aadharCardNumber.trim()) {
          newErrors.aadharCardNumber = 'આધાર કાર્ડ નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(manavDetails.aadharCardNumber.trim())) {
          newErrors.aadharCardNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!manavDetails.rationCardNumber.trim()) newErrors.rationCardNumber = 'રેશન કાર્ડ નંબર જરૂરી છે';
        if (!manavDetails.rationCardMemberId.trim()) newErrors.rationCardMemberId = 'રેશન કાર્ડ મેમ્બર આઈડી જરૂરી છે';
        if (!manavDetails.eshramCardNumber.trim()) newErrors.eshramCardNumber = 'ઈ-શ્રમ કાર્ડ નંબર જરૂરી છે';
        if (!manavDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Documents
        if (!manavDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!manavDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!manavDocs.eshramCardFront) newErrors.eshramCardFront = 'ઈ-શ્રમ કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!manavDocs.eshramCardBack) newErrors.eshramCardBack = 'ઈ-શ્રમ કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!manavDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!manavDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!manavDocs.casteCertificate) newErrors.casteCertificate = 'જાતિ પ્રમાણપત્ર અપલોડ કરો';
        if (!manavDocs.incomeCertificate) newErrors.incomeCertificate = 'આવક પ્રમાણપત્ર અપલોડ કરો';
        if (!manavDocs.signature) newErrors.signature = 'સહીનો ફોટો અપલોડ કરો';
        if (!manavDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';

      } else if (formType === 'KUVAR_BAI_MAMERU') {
        if (!kuvarDetails.kanyaFirstName.trim()) newErrors.kanyaFirstName = 'કન્યાનું પ્રથમ નામ જરૂરી છે';
        if (!kuvarDetails.kanyaLastName.trim()) newErrors.kanyaLastName = 'કન્યાની અટક જરૂરી છે';
        if (!kuvarDetails.kanyaPitaFirstName.trim()) newErrors.kanyaPitaFirstName = 'કન્યાના પિતાનું નામ જરૂરી છે';
        if (!kuvarDetails.kanyaPitaLastName.trim()) newErrors.kanyaPitaLastName = 'કન્યાના પિતાની અટક જરૂરી છે';
        if (!kuvarDetails.kanyaDob) newErrors.kanyaDob = 'કન્યાની જન્મતારીખ જરૂરી છે';
        if (!kuvarDetails.marriageDate) newErrors.marriageDate = 'લગ્ન તારીખ જરૂરી છે';
        if (!kuvarDetails.kanyaCaste) newErrors.kanyaCaste = 'કન્યાની જાતિ પસંદ કરો';
        if (!kuvarDetails.kanyaPitaIncome.trim()) newErrors.kanyaPitaIncome = 'કન્યાના પિતાની વાર્ષિક આવક જરૂરી છે';
        if (!kuvarDetails.yuvakDob) newErrors.yuvakDob = 'યુવકની જન્મતારીખ જરૂરી છે';
        if (!kuvarDetails.yuvakPitaFirstName.trim()) newErrors.yuvakPitaFirstName = 'યુવકના પિતાનું નામ જરૂરી છે';
        if (!kuvarDetails.yuvakPitaLastName.trim()) newErrors.yuvakPitaLastName = 'યુવકના પિતાની અટક જરૂરી છે';
        if (!kuvarDetails.kanyaRationCardNumber.trim()) newErrors.kanyaRationCardNumber = 'કન્યાનું રેશન કાર્ડ નંબર જરૂરી છે';
        if (!kuvarDetails.yuvakRationCardNumber.trim()) newErrors.yuvakRationCardNumber = 'યુવકનું રેશન કાર્ડ નંબર જરૂરી છે';
        if (!kuvarDetails.kanyaPitaAadharNumber.trim()) {
          newErrors.kanyaPitaAadharNumber = 'કન્યાના પિતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(kuvarDetails.kanyaPitaAadharNumber.trim())) {
          newErrors.kanyaPitaAadharNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!kuvarDetails.yuvakPitaAadharNumber.trim()) {
          newErrors.yuvakPitaAadharNumber = 'યુવકના પિતાનો આધાર નંબર જરૂરી છે';
        } else if (!/^[0-9]{12}$/.test(kuvarDetails.yuvakPitaAadharNumber.trim())) {
          newErrors.yuvakPitaAadharNumber = '૧૨ આંકડાનો સાચો આધાર નંબર લખો';
        }
        if (!kuvarDetails.yuvakCaste) newErrors.yuvakCaste = 'યુવકની જાતિ પસંદ કરો';
        if (!kuvarDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી જરૂરી છે';

        // Documents
        if (!kuvarDocs.kanyaPassportPhoto) newErrors.kanyaPassportPhoto = 'કન્યાનો પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!kuvarDocs.yuvakPassportPhoto) newErrors.yuvakPassportPhoto = 'યુવકનો પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો';
        if (!kuvarDocs.kanyaAadharCardFront) newErrors.kanyaAadharCardFront = 'કન્યાનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!kuvarDocs.kanyaAadharCardBack) newErrors.kanyaAadharCardBack = 'કન્યાનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!kuvarDocs.yuvakAadharCardFront) newErrors.yuvakAadharCardFront = 'યુવકનું આધાર કાર્ડ આગળનો ભાગ અપલોડ કરો';
        if (!kuvarDocs.yuvakAadharCardBack) newErrors.yuvakAadharCardBack = 'યુવકનું આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરો';
        if (!kuvarDocs.kanyaPitaAadharCardFront) newErrors.kanyaPitaAadharCardFront = 'કન્યાના પિતાનું આધાર કાર્ડ આગળનો ભાગ';
        if (!kuvarDocs.kanyaPitaAadharCardBack) newErrors.kanyaPitaAadharCardBack = 'કન્યાના પિતાનું આધાર કાર્ડ પાછળનો ભાગ';
        if (!kuvarDocs.yuvakPitaAadharCardFront) newErrors.yuvakPitaAadharCardFront = 'યુવકના પિતાનું આધાર કાર્ડ આગળનો ભાગ';
        if (!kuvarDocs.yuvakPitaAadharCardBack) newErrors.yuvakPitaAadharCardBack = 'યુવકના પિતાનું આધાર કાર્ડ પાછળનો ભાગ';
        if (!kuvarDocs.kanyaSchoolLeaving) newErrors.kanyaSchoolLeaving = 'કન્યાનું શાળા છોડ્યાનું પ્રમાણપત્ર અપલોડ કરો';
        if (!kuvarDocs.yuvakSchoolLeaving) newErrors.yuvakSchoolLeaving = 'યુવકનું શાળા છોડ્યાનું પ્રમાણપત્ર અપલોડ કરો';
        if (!kuvarDocs.kanyaBankPassbook) newErrors.kanyaBankPassbook = 'કન્યાના બેંક પાસબુકનો પ્રથમ પાનું અપલોડ કરો';
        if (!kuvarDocs.kankarotri) newErrors.kankarotri = 'કંકોતરી અપલોડ કરો';
      } else if (formType === 'RATION_CARD_ADD_NAME') {
        if (!rationCardAddDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!rationCardAddDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!rationCardAddDetails.gender) newErrors.gender = 'લિંગ જરૂરી છે';
        if (!rationCardAddDetails.dob) newErrors.dob = 'જન્મ તારીખ જરૂરી છે';
        if (!rationCardAddDetails.rationCardNumber.trim()) newErrors.rationCardNumber = 'રેશન કાર્ડ નંબર જરૂરી છે';
        if (!rationCardAddDetails.headName.trim()) newErrors.headName = 'મુખીનું નામ જરૂરી છે';
        if (!rationCardAddDetails.relationWithHead) newErrors.relationWithHead = 'મુખી સાથે સંબંધ જરૂરી છે';

        if (!rationCardAddDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ જરૂરી છે';
        if (!rationCardAddDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ જરૂરી છે';
        if (!rationCardAddDocs.birthCertificate) newErrors.birthCertificate = 'જન્મ પ્રમાણપત્ર જરૂરી છે';
        if (!rationCardAddDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનો ભાગ જરૂરી છે';
        if (!rationCardAddDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનો ભાગ જરૂરી છે';
      } else if (formType === 'RATION_CARD_REMOVE_NAME') {
        if (!rationCardRemoveDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે';
        if (!rationCardRemoveDetails.lastName.trim()) newErrors.lastName = 'અટક જરૂરી છે';
        if (!rationCardRemoveDetails.gender) newErrors.gender = 'લિંગ જરૂરી છે';
        if (!rationCardRemoveDetails.rationCardNumber.trim()) newErrors.rationCardNumber = 'રેશન કાર્ડ નંબર જરૂરી છે';
        if (!rationCardRemoveDetails.address.trim()) newErrors.address = 'સરનામું જરૂરી છે';
        if (!rationCardRemoveDetails.removeReason) newErrors.removeReason = 'કમી કરવાનું કારણ જરૂરી છે';

        // Documents
        if (!rationCardRemoveDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ જરૂરી છે';
        if (!rationCardRemoveDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ જરૂરી છે';
        if (!rationCardRemoveDocs.rationCardFront) newErrors.rationCardFront = 'રેશન કાર્ડ આગળનો ભાગ જરૂરી છે';
        if (!rationCardRemoveDocs.rationCardBack) newErrors.rationCardBack = 'રેશન કાર્ડ પાછળનો ભાગ જરૂરી છે';

        // Conditional Docs
        if (rationCardRemoveDetails.removeReason === 'DEATH' && !rationCardRemoveDocs.deathCertificate) {
          newErrors.deathCertificate = 'મરણ પ્રમાણપત્ર જરૂરી છે';
        }
        if (rationCardRemoveDetails.removeReason === 'CHANGE_ADDRESS' && !rationCardRemoveDocs.addressProof) {
          newErrors.addressProof = 'સરનામાનો પુરાવો જરૂરી છે';
        }
        if (rationCardRemoveDetails.removeReason === 'MARRIAGE' && !rationCardRemoveDocs.marriageCertificate) {
          newErrors.marriageCertificate = 'લગ્ન કંકોતરી/પ્રમાણપત્ર જરૂરી છે';
        }
      } else if (formType === 'PASSPORT') {
        if (!passportDetails.passportCategory) {
          newErrors.passportCategory = 'કૃપા કરીને નવો પાસપોર્ટ અથવા પાસપોર્ટ રિન્યુ પસંદ કરો.';
          setErrors(newErrors);
          return newErrors;
        }

        if (!passportDetails.firstName.trim()) newErrors.firstName = 'પ્રથમ નામ જરૂરી છે (આધાર કાર્ડ મુજબ).';
        if (!passportDetails.middleName.trim()) newErrors.middleName = 'પિતા/પતિનું નામ જરૂરી છે (આધાર કાર્ડ મુજબ).';
        if (!passportDetails.lastName.trim()) newErrors.lastName = 'અટક (સરનેમ) જરૂરી છે (આધાર કાર્ડ મુજબ).';
        if (!passportDetails.gender) newErrors.gender = 'જાતિ પસંદ કરવી ફરજિયાત છે.';
        if (!passportDetails.caste) newErrors.caste = 'જ્ઞાતિ/વર્ગ પસંદ કરવો ફરજિયાત છે.';
        if (!passportDetails.dob) newErrors.dob = 'જન્મ તારીખ ફરજિયાત છે.';
        if (!passportDetails.address.trim()) newErrors.address = 'સરનામું જરૂરી છે (આધાર/વોટર આઈડી મુજબ).';
        if (!passportDetails.mobile.trim() || passportDetails.mobile.length < 10) newErrors.mobile = 'સાચો 10 આંકડાનો મોબાઈલ નંબર લખો.';
        if (!passportDetails.email.trim()) newErrors.email = 'ઈમેઈલ ID ફરજિયાત છે.';

        if (!passportDetails.fatherFirstName.trim()) newErrors.fatherFirstName = 'પિતાનું પ્રથમ નામ જરૂરી છે.';
        if (!passportDetails.fatherMiddleName.trim()) newErrors.fatherMiddleName = 'પિતાનું મિડલ નામ જરૂરી છે.';
        if (!passportDetails.fatherLastName.trim()) newErrors.fatherLastName = 'પિતાની અટક જરૂરી છે.';

        if (!passportDetails.motherFirstName.trim()) newErrors.motherFirstName = 'માતાનું પ્રથમ નામ જરૂરી છે.';
        if (!passportDetails.motherMiddleName.trim()) newErrors.motherMiddleName = 'માતાનું મિડલ નામ જરૂરી છે.';
        if (!passportDetails.motherLastName.trim()) newErrors.motherLastName = 'માતાની અટક જરૂરી છે.';

        if (passportDetails.passportCategory === 'NEW') {
          if (!passportDetails.maritalStatus) newErrors.maritalStatus = 'વૈવાહિક સ્થિતિ પસંદ કરો.';
          if (passportDetails.maritalStatus === 'MARRIED' && !passportDetails.spouseName?.trim()) {
            newErrors.spouseName = 'પતિ/પત્નીનું પૂરું નામ લખો.';
          }
          if (!passportDetails.passportType) newErrors.passportType = 'પાસપોર્ટ ટાઈપ (નોર્મલ/તત્કાલ) પસંદ કરો.';

          if (!passportDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.signature) newErrors.signature = 'અરજદારની સહી અપલોડ કરવી ફરજિયાત છે.';
          if (!passportDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.schoolLeaving) newErrors.schoolLeaving = 'શાળા છોડ્યાનું પ્રમાણપત્ર (LC) અપલોડ કરો.';
          if (!passportDocs.birthCertificate) newErrors.birthCertificate = 'જન્મનું પ્રમાણપત્ર અપલોડ કરો.';
          if (!passportDocs.rationCardFront) newErrors.rationCardFront = 'રેશનકાર્ડ આગળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.rationCardBack) newErrors.rationCardBack = 'રેશનકાર્ડ પાછળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.studyResult) newErrors.studyResult = 'અભ્યાસનું પરિણામ (Study Result) અપલોડ કરો.';
        } else if (passportDetails.passportCategory === 'RENEW') {
          if (!passportDetails.passportNumber?.trim()) newErrors.passportNumber = 'જૂનો પાસપોર્ટ નંબર લખો.';
          if (!passportDetails.passportIssueDate) newErrors.passportIssueDate = 'પાસપોર્ટ ઈશ્યુ તારીખ પસંદ કરો.';
          if (!passportDetails.passportExpiryDate) newErrors.passportExpiryDate = 'પાસપોર્ટ એક્સપાયરી તારીખ પસંદ કરો.';

          if (!passportDocs.passportPhoto) newErrors.passportPhoto = 'પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.signature) newErrors.signature = 'અરજદારની સહી અપલોડ કરવી ફરજિયાત છે.';
          if (!passportDocs.aadharCardFront) newErrors.aadharCardFront = 'આધાર કાર્ડ આગળનો ભાગ અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.aadharCardBack) newErrors.aadharCardBack = 'આધાર કાર્ડ પાછળનો ભાગ અપલોડ કરવો ફરજિયાત છે.';
          if (!passportDocs.voterIdFront) newErrors.voterIdFront = 'વોટર આઈડી આગળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.voterIdBack) newErrors.voterIdBack = 'વોટર આઈડી પાછળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.oldPassportFront) newErrors.oldPassportFront = 'જૂનો પાસપોર્ટ આગળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.oldPassportBack) newErrors.oldPassportBack = 'જૂનો પાસપોર્ટ પાછળનો ભાગ અપલોડ કરો.';
          if (!passportDocs.schoolLeaving) newErrors.schoolLeaving = 'શાળા છોડ્યાનું પ્રમાણપત્ર (LC) અપલોડ કરો.';
          if (!passportDocs.birthCertificate) newErrors.birthCertificate = 'જન્મનું પ્રમાણપત્ર અપલોડ કરો.';
        }
      }
    } else {
      // Draft mode - no validation requirements. Allows saving drafts even with completely empty values.
    }

    setErrors(newErrors);
    return newErrors;
  };

  const proceedWithSave = async (
    isDraft: boolean, 
    paymentMode: 'CASH' | 'ONLINE' | 'FREE' | 'WALLET' | null, 
    paymentAmount: number, 
    paymentStatus: 'PENDING' | 'PAID' | 'COMPLETED' | null
  ) => {
    setIsSubmitting(true);
    try {
      const entryId = editingEntry ? editingEntry.id : 'APP_' + Date.now();
      const timestamp = new Date().toISOString();
      let finalPaymentStatus = paymentStatus;

      const user = getLoggedInUser();
      const userId = user?.uid || 'guest_user';
      const userName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
      const userMobile = user?.mobile || '';

      if (paymentMode === 'WALLET' && !isDraft) {
        // Fetch wallet first to verify again
        const currentWallet = await getWallet(userId);
        if (currentWallet.balance < paymentAmount) {
          throw new Error('વોલેટમાં અપૂરતું બેલેન્સ છે. કૃપા કરીને પહેલા વોલેટ રીચાર્જ કરો! (Insufficient wallet balance. Please top up your wallet first!)');
        }

        // Deduct
        await updateWalletBalance(userId, -paymentAmount);

        // Save wallet transaction
        await createWalletTransaction({
          userId,
          userName,
          userMobile,
          amount: paymentAmount,
          type: 'PAYMENT',
          status: 'COMPLETED',
          paymentMethod: 'WALLET_DEDUCTION',
          notes: `${getServiceLabel(formType)} અરજી માટે વોલેટ ચુકવણી (Wallet payment for ${getServiceLabel(formType)})`
        });
        
        finalPaymentStatus = 'PAID';
      }

      let activeDetails: any = null;
      let activeDocs: any = null;

            if (formType === 'PAN_CARD') {
        activeDetails = panDetails;
        activeDocs = panDocs;
      } else if (formType === 'PAN_CARD_CORRECTION') {
        activeDetails = panCorrectionDetails;
        activeDocs = panCorrectionDocs;
      } else if (formType === 'MINOR_PAN_CARD') {
        activeDetails = minorPanDetails;
        activeDocs = minorPanDocs;
      } else if (formType === 'VOTER_ID_CORRECTION') {
        activeDetails = voterCorrectionDetails;
        activeDocs = voterCorrectionDocs;
      } else if (formType === 'VOTER_ID') {
        activeDetails = voterDetails;
        activeDocs = voterDocs;
      } else if (formType === 'E_SHRAM') {
        activeDetails = eshramDetails;
        activeDocs = eshramDocs;
      } else if (formType === 'FARMER_SUBSIDY') {
        activeDetails = farmerDetails;
        activeDocs = farmerDocs;
      } else if (formType === 'CAST_CERTIFICATE') {
        activeDetails = castDetails;
        activeDocs = castDocs;
      } else if (formType === 'INCOME_CERTIFICATE') {
        activeDetails = incomeDetails;
        activeDocs = incomeDocs;
      } else if (formType === 'AYUSHYMAN_CARD') {
        activeDetails = ayushmanDetails;
        activeDocs = ayushmanDocs;
      } else if (formType === 'AABHA_CARD') {
        activeDetails = aabhaDetails;
        activeDocs = aabhaDocs;
      
      } else if (formType === 'NEW_BIRTH_CERTIFICATE') {
        activeDetails = newBirthDetails;
        activeDocs = newBirthDocs;
      } else if (formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        activeDetails = birthCorrectionDetails;
        activeDocs = birthCorrectionDocs;
      } else if (formType === 'DEATH_CERTIFICATE') {
        activeDetails = deathDetails;
        activeDocs = deathDocs;
} else if (formType === 'OTHER_SERVICE') {
        activeDetails = otherDetails;
        activeDocs = otherDocs;
      } else if (formType === 'UDHYAM_AADHAR') {
        activeDetails = udhyamDetails;
        activeDocs = udhyamDocs;
      } else if (formType === 'MANAV_KALYAN') {
        activeDetails = manavDetails;
        activeDocs = manavDocs;
      } else if (formType === 'KUVAR_BAI_MAMERU') {
        activeDetails = kuvarDetails;
        activeDocs = kuvarDocs;
      } else if (formType === 'RATION_CARD_ADD_NAME') {
        activeDetails = rationCardAddDetails;
        activeDocs = rationCardAddDocs;
      } else if (formType === 'RATION_CARD_REMOVE_NAME') {
        activeDetails = rationCardRemoveDetails;
        activeDocs = rationCardRemoveDocs;
      } else if (formType === 'RATION_CARD_CORRECTION') {
        activeDetails = rationCardCorrectionDetails;
        activeDocs = rationCardCorrectionDocs;
      } else if (formType === 'PASSPORT') {
        activeDetails = passportDetails;
        activeDocs = passportDocs;
      }

      const newEntry: ApplicationEntry = {
        id: entryId,
        formType,
        details: activeDetails,
        documents: activeDocs,
        status: isDraft ? (editingEntry?.status === 'CORRECTION_REQUIRED' ? 'CORRECTION_REQUIRED' : 'DRAFT') : 'COMPLETED',
        createdAt: editingEntry ? editingEntry.createdAt : timestamp,
        updatedAt: timestamp,
        userId: editingEntry?.userId || undefined,
        ...(isDraft && editingEntry?.adminFeedback ? { adminFeedback: editingEntry.adminFeedback } : {}),
        paymentMode,
        paymentAmount,
        paymentStatus: finalPaymentStatus,
      };

      await saveApplication(newEntry);
      setShowPaymentStep(false);
      if (isDraft) {
        onSuccess();
      } else {
        setSubmittedEntry(newEntry);
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error(e);
      setSubmitError(e instanceof Error ? e.message : String(e));
      setShowPaymentStep(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    setSubmitError(null);
    const newErrors = validateForm(isDraft);
    if (Object.keys(newErrors).length > 0) {
      setSubmitError('કેટલીક વિગતો અધૂરી છે અથવા ખોટી છે. કૃપા કરીને લાલ તારા (*) વાળા અને લાલ લખાણ વાળા તમામ ખાના ભરો! (Some fields are incomplete or invalid. Please fill in all required fields and upload all mandatory documents.)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isDraft) {
      // If updating an existing entry and it already has a payment mode, reuse it
      if (editingEntry?.paymentMode) {
        await proceedWithSave(
          isDraft, 
          editingEntry.paymentMode, 
          editingEntry.paymentAmount || 0, 
          editingEntry.paymentStatus || 'PENDING'
        );
      } else {
        const price = currentPrices[formType];
        if (price === 0) {
          await proceedWithSave(isDraft, 'FREE', 0, 'COMPLETED');
        } else {
          setSelectedPaymentMode(null);
          setShowPaymentStep(true);
        }
      }
    } else {
      await proceedWithSave(isDraft, null, 0, null);
    }
  };

  if (isServiceClosed) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-12 text-center space-y-6 max-w-4xl mx-auto my-8">
        <div className="mx-auto w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-950">હાલ પૂરતી આ સેવા બંધ છે</h1>
          <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
            આ સેવામાં નવી અરજી અત્યારે બંધ રાખવામાં આવેલ છે. માલિક દ્વારા આ સેવા ફરીથી ચાલુ કરવામાં આવ્યા બાદ જ તમે નવી અરજી કરી શકશો.
          </p>
          <p className="text-[10px] text-slate-400 font-medium font-sans">
            Temporarily Closed. Please try again after the administrator enables this service.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center text-xs font-black text-slate-700 bg-slate-150 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all cursor-pointer border border-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> પાછા જાઓ (Back)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-full mx-auto">
      {/* Form Header banner */}
      <div className="bg-indigo-900 p-4 md:p-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="h-32 w-32" />
        </div>
        
        <button 
          onClick={onCancel}
          className="inline-flex items-center text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl mb-4 transition-colors border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> અરજીઓની યાદી પર પાછા જાઓ (Back to Applications)
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full font-sans uppercase">
              {formType === 'PAN_CARD' ? 'PAN CARD' : 
               formType === 'VOTER_ID' ? 'VOTER ID CARD' : 
               formType === 'E_SHRAM' ? 'E-SHRAM CARD' : 
               formType === 'FARMER_SUBSIDY' ? 'FARMER SUBSIDY' :
               formType === 'CAST_CERTIFICATE' ? 'CAST CERTIFICATE' :
               formType === 'INCOME_CERTIFICATE' ? 'INCOME CERTIFICATE' :
               formType === 'AYUSHYMAN_CARD' ? 'AYUSHYMAN BHARAT' :
               formType === 'AABHA_CARD' ? 'ABHA HEALTH CARD' :
               formType === 'UDHYAM_AADHAR' ? 'UDHYAM AADHAR(MSME)' :
               formType === 'MANAV_KALYAN' ? 'MANAV KALYAN YOJNA' :
               formType === 'KUVAR_BAI_MAMERU' ? 'KUVAR BAI MAMERU YOJANA' :

               formType === 'NEW_BIRTH_CERTIFICATE' ? 'NEW BIRTH CERTIFICATE' :
               formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'BIRTH CERTIFICATE CORRECTION' :
               formType === 'DEATH_CERTIFICATE' ? 'DEATH CERTIFICATE' :

               formType === 'RATION_CARD_ADD_NAME' ? 'RATION CARD - ADD NAME' :
               formType === 'RATION_CARD_REMOVE_NAME' ? 'RATION CARD - REMOVE NAME' :
               formType === 'RATION_CARD_CORRECTION' ? 'RATION CARD - CORRECTION' :
               formType === 'PASSPORT' ? 'PASSPORT SERVICE' :

               'OTHER SERVICES'}
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-display mt-2 tracking-tight">
              {formType === 'PAN_CARD' ? 'નવું પાન કાર્ડ મેળવવા માટેનું અરજી ફોર્મ' : 
               formType === 'VOTER_ID' ? 'નવું મતદાર ઓળખપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'E_SHRAM' ? 'નવું ઈ-શ્રમ કાર્ડ મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'FARMER_SUBSIDY' ? 'ખેડૂત સબસિડી યોજના માટેનું અરજી ફોર્મ' :
               formType === 'CAST_CERTIFICATE' ? 'જાતિ પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'INCOME_CERTIFICATE' ? 'આવકનું પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'AYUSHYMAN_CARD' ? 'આયુષ્માન ભારત કાર્ડ મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'AABHA_CARD' ? 'આભા હેલ્થ કાર્ડ મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'UDHYAM_AADHAR' ? 'ઉદ્યમ આધાર (MSME) રજીસ્ટ્રેશન માટેનું અરજી ફોર્મ' :
               formType === 'MANAV_KALYAN' ? 'માનવ કલ્યાણ યોજના માટેનું અરજી ફોર્મ' :
               formType === 'KUVAR_BAI_MAMERU' ? 'કુંવરબાઈનું મામેરું યોજના માટેનું અરજી ફોર્મ' :

               formType === 'NEW_BIRTH_CERTIFICATE' ? 'નવું જન્મ પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'જન્મ પ્રમાણપત્ર સુધારવા માટેનું અરજી ફોર્મ' :
               formType === 'DEATH_CERTIFICATE' ? 'મરણ પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :

               formType === 'RATION_CARD_ADD_NAME' ? 'રેશન કાર્ડમાં નવું નામ ઉમેરવા માટેનું અરજી ફોર્મ' :
               formType === 'RATION_CARD_REMOVE_NAME' ? 'રેશન કાર્ડમાંથી નામ કમી કરવા માટેનું અરજી ફોર્મ' :
               formType === 'RATION_CARD_CORRECTION' ? 'રેશન કાર્ડમાં સુધારો કરવા માટેનું અરજી ફોર્મ' :
               formType === 'PASSPORT' ? 'પાસપોર્ટ સેવા (નવો / રિન્યુ) અરજી ફોર્મ' :

               'અન્ય સરકારી સેવાઓ પૂછપરછ ફોર્મ'}
            </h1>
            <p className="text-xs text-indigo-200 mt-1 italic font-sans">
              {formType === 'PAN_CARD' ? 'Application Form for New Permanent Account Number (PAN)' : 
               formType === 'VOTER_ID' ? 'Application for New Voter ID Registration (Form 6)' :
               formType === 'E_SHRAM' ? 'Application Form for New E-Shram Identity Card' :
               formType === 'FARMER_SUBSIDY' ? 'Application for Government Farmer Subsidy Scheme Registration' :
               formType === 'CAST_CERTIFICATE' ? 'Application Form for Caste Certificate (SC/ST/OBC/GEN)' :
               formType === 'INCOME_CERTIFICATE' ? 'Application Form for Income Certificate' :
               formType === 'AYUSHYMAN_CARD' ? 'Application Form for Ayushman Bharat PM-JAY Card' :
               formType === 'AABHA_CARD' ? 'Application Form for ABHA Health Card' :
               formType === 'UDHYAM_AADHAR' ? 'Application Form for Udhyam Aadhar (MSME) Registration' :
               formType === 'MANAV_KALYAN' ? 'Application Form for Manav Kalyan Yojna (Draw System Scheme)' :
               formType === 'KUVAR_BAI_MAMERU' ? 'Application Form for Kuvar Bai Mameru Yojana (Maternity/Marriage Aid)' :

               formType === 'RATION_CARD_ADD_NAME' ? 'Application Form to Add Name in Ration Card' :
               formType === 'RATION_CARD_REMOVE_NAME' ? 'Application Form to Remove Name from Ration Card' :
               formType === 'RATION_CARD_CORRECTION' ? 'Application Form for Ration Card Correction Entry' :
               formType === 'PASSPORT' ? 'Application Form for Passport Services (New / Renew)' :

               'Inquiry and Application Form for Other Government Services'}
            </p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <span className="text-xs bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-3 py-1 rounded-lg">
              ગુજરાત સરકાર (Government of Gujarat)
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic sub-service switcher if not editing */}
      {!editingEntry && (
        <>
          {/* PAN Card sub-services */}
          {(formType === 'PAN_CARD' || formType === 'PAN_CARD_CORRECTION' || formType === 'MINOR_PAN_CARD') && (
            <div className="bg-indigo-50/30 border-b border-indigo-100/80 p-4 md:p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                  પાન કૉર્ડ સેવા પ્રકાર (PAN Card Service Type)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">તમારી જરૂરિયાત મુજબ યોગ્ય પેન કાર્ડ સેવાનો પ્રકાર પસંદ કરો (Select PAN Card Service Type)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
                {[
                  { 
                    type: 'PAN_CARD', 
                    labelGu: 'નવું પેન કાર્ડ', 
                    labelEn: 'New PAN Card',
                    icon: IdCard,
                    bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-700',
                    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100'
                  },
                  { 
                    type: 'PAN_CARD_CORRECTION', 
                    labelGu: 'પેન કાર્ડ સુધારો', 
                    labelEn: 'PAN Card Correction',
                    icon: FileEdit,
                    bgClass: 'bg-gradient-to-r from-indigo-600 to-blue-700',
                    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100'
                  },
                  { 
                    type: 'MINOR_PAN_CARD', 
                    labelGu: 'સગીર પેન કાર્ડ', 
                    labelEn: 'Minor PAN Card',
                    icon: Baby,
                    bgClass: 'bg-gradient-to-r from-violet-600 to-purple-700',
                    colorClass: 'text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100'
                  },
                ].map((tab) => {
                  const basePrice = currentPrices[tab.type] ?? SERVICE_PRICES[tab.type as FormType] ?? 0;
                  const computedWalletPrice = Math.round(basePrice * (100 - currentDiscounts.walletDiscount) / 100);
                  const computedUpiPrice = Math.round(basePrice * (100 - currentDiscounts.upiDiscount) / 100);
                  const isSelected = formType === tab.type;

                  return (
                    <button
                      key={tab.type}
                      type="button"
                      onClick={() => setFormType(tab.type as FormType)}
                      className={`p-4 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100'
                          : 'bg-white border-slate-200 hover:bg-slate-50/50 hover:border-indigo-300'
                      }`}
                    >
                      {/* Service Header: Icon & Title */}
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-200 shrink-0 ${
                          isSelected ? tab.bgClass : 'bg-slate-100 text-slate-500'
                        }`}>
                          <tab.icon className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 leading-tight">
                            {tab.labelGu}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 font-sans tracking-wide mt-0.5 uppercase">
                            {tab.labelEn}
                          </p>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="pt-3 border-t border-slate-100 w-full space-y-1.5">
                        {/* Cash */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/80">
                          <span className="flex items-center gap-1 font-medium">💵 Cash (રોકડા):</span>
                          <span className="font-sans font-black text-slate-900 text-xs">₹{basePrice}</span>
                        </div>

                        {/* Wallet */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                          <span className="flex items-center gap-1 font-medium">
                            👛 Wallet:
                            <span className="text-[8px] font-black bg-emerald-200 text-emerald-900 px-1 rounded">
                              {currentDiscounts.walletDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-emerald-900 text-xs">₹{computedWalletPrice}</span>
                        </div>

                        {/* UPI */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-800 bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                          <span className="flex items-center gap-1 font-medium">
                            📲 UPI:
                            <span className="text-[8px] font-black bg-indigo-200 text-indigo-950 px-1 rounded">
                              {currentDiscounts.upiDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-indigo-900 text-xs">₹{computedUpiPrice}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Voter ID sub-services */}
          {(formType === 'VOTER_ID' || formType === 'VOTER_ID_CORRECTION') && (
            <div className="bg-emerald-50/30 border-b border-emerald-100/80 p-4 md:p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-600 rounded-sm"></span>
                  મતદાર આઈડી સેવા પ્રકાર (Voter ID Service Type)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">તમારી જરૂરિયાત મુજબ યોગ્ય મતદાર આઈડી સેવાનો પ્રકાર પસંદ કરો (Select Voter ID Service Type)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {[
                  { 
                    type: 'VOTER_ID', 
                    labelGu: 'નવું મતદાર આઈડી', 
                    labelEn: 'New Voter ID',
                    icon: Vote,
                    bgClass: 'bg-gradient-to-r from-emerald-600 to-teal-700',
                    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                  },
                  { 
                    type: 'VOTER_ID_CORRECTION', 
                    labelGu: 'મતદાર આઈડી સુધારો', 
                    labelEn: 'Voter ID Correction',
                    icon: UserCheck,
                    bgClass: 'bg-gradient-to-r from-teal-600 to-emerald-700',
                    colorClass: 'text-teal-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                  },
                ].map((tab) => {
                  const basePrice = currentPrices[tab.type] ?? SERVICE_PRICES[tab.type as FormType] ?? 0;
                  const computedWalletPrice = Math.round(basePrice * (100 - currentDiscounts.walletDiscount) / 100);
                  const computedUpiPrice = Math.round(basePrice * (100 - currentDiscounts.upiDiscount) / 100);
                  const isSelected = formType === tab.type;

                  return (
                    <button
                      key={tab.type}
                      type="button"
                      onClick={() => setFormType(tab.type as FormType)}
                      className={`p-4 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-white border-emerald-600 shadow-md shadow-emerald-100'
                          : 'bg-white border-slate-200 hover:bg-slate-50/50 hover:border-emerald-300'
                      }`}
                    >
                      {/* Service Header: Icon & Title */}
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-200 shrink-0 ${
                          isSelected ? tab.bgClass : 'bg-slate-100 text-slate-500'
                        }`}>
                          <tab.icon className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-600 leading-tight">
                            {tab.labelGu}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 font-sans tracking-wide mt-0.5 uppercase">
                            {tab.labelEn}
                          </p>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="pt-3 border-t border-slate-100 w-full space-y-1.5">
                        {/* Cash */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/80">
                          <span className="flex items-center gap-1 font-medium">💵 Cash (રોકડા):</span>
                          <span className="font-sans font-black text-slate-900 text-xs">₹{basePrice}</span>
                        </div>

                        {/* Wallet */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                          <span className="flex items-center gap-1 font-medium">
                            👛 Wallet:
                            <span className="text-[8px] font-black bg-emerald-200 text-emerald-900 px-1 rounded">
                              {currentDiscounts.walletDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-emerald-900 text-xs">₹{computedWalletPrice}</span>
                        </div>

                        {/* UPI */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-800 bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                          <span className="flex items-center gap-1 font-medium">
                            📲 UPI:
                            <span className="text-[8px] font-black bg-indigo-200 text-indigo-950 px-1 rounded">
                              {currentDiscounts.upiDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-indigo-900 text-xs">₹{computedUpiPrice}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ration Card sub-services */}
          {(formType === 'RATION_CARD_ADD_NAME' || formType === 'RATION_CARD_REMOVE_NAME' || formType === 'RATION_CARD_CORRECTION') && (
            <div className="bg-amber-50/30 border-b border-amber-100/80 p-4 md:p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
                  રેશન કાર્ડ સેવા પ્રકાર (Ration Card Service Type)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">તમારી જરૂરિયાત મુજબ યોગ્ય રેશન કાર્ડ સેવાનો પ્રકાર પસંદ કરો (Select Ration Card Service Type)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
                {[
                  { 
                    type: 'RATION_CARD_ADD_NAME', 
                    labelGu: 'નામ ઉમેરવું', 
                    labelEn: 'Add Name',
                    icon: UserPlus,
                    bgClass: 'bg-gradient-to-r from-emerald-600 to-green-700',
                    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-indigo-100'
                  },
                  { 
                    type: 'RATION_CARD_REMOVE_NAME', 
                    labelGu: 'નામ કમી કરવું', 
                    labelEn: 'Remove Name',
                    icon: UserMinus,
                    bgClass: 'bg-gradient-to-r from-rose-600 to-red-700',
                    colorClass: 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100'
                  },
                  { 
                    type: 'RATION_CARD_CORRECTION', 
                    labelGu: 'રેશન કાર્ડ સુધારો', 
                    labelEn: 'Ration Card Correction',
                    icon: Utensils,
                    bgClass: 'bg-gradient-to-r from-amber-600 to-yellow-600',
                    colorClass: 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100'
                  },
                ].map((tab) => {
                  const basePrice = currentPrices[tab.type] ?? SERVICE_PRICES[tab.type as FormType] ?? 0;
                  const computedWalletPrice = Math.round(basePrice * (100 - currentDiscounts.walletDiscount) / 100);
                  const computedUpiPrice = Math.round(basePrice * (100 - currentDiscounts.upiDiscount) / 100);
                  const isSelected = formType === tab.type;

                  return (
                    <button
                      key={tab.type}
                      type="button"
                      onClick={() => setFormType(tab.type as FormType)}
                      className={`p-4 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-md shadow-amber-100'
                          : 'bg-white border-slate-200 hover:bg-slate-50/50 hover:border-amber-300'
                      }`}
                    >
                      {/* Service Header: Icon & Title */}
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-200 shrink-0 ${
                          isSelected ? tab.bgClass : 'bg-slate-100 text-slate-500'
                        }`}>
                          <tab.icon className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-600 leading-tight">
                            {tab.labelGu}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 font-sans tracking-wide mt-0.5 uppercase">
                            {tab.labelEn}
                          </p>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="pt-3 border-t border-slate-100 w-full space-y-1.5">
                        {/* Cash */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/80">
                          <span className="flex items-center gap-1 font-medium">💵 Cash (રોકડા):</span>
                          <span className="font-sans font-black text-slate-900 text-xs">₹{basePrice}</span>
                        </div>

                        {/* Wallet */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                          <span className="flex items-center gap-1 font-medium">
                            👛 Wallet:
                            <span className="text-[8px] font-black bg-emerald-200 text-emerald-900 px-1 rounded">
                              {currentDiscounts.walletDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-emerald-900 text-xs">₹{computedWalletPrice}</span>
                        </div>

                        {/* UPI */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-800 bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                          <span className="flex items-center gap-1 font-medium">
                            📲 UPI:
                            <span className="text-[8px] font-black bg-indigo-200 text-indigo-950 px-1 rounded">
                              {currentDiscounts.upiDiscount}% OFF
                            </span>
                          </span>
                          <span className="font-sans font-black text-indigo-900 text-xs">₹{computedUpiPrice}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Form Fields */}
      <div className="p-4 md:p-8 space-y-8">
        
        {submitError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 animate-pulse shadow-sm">
            <div className="p-1.5 bg-rose-100 rounded-xl text-rose-600 flex-shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5 w-full">
              <h4 className="text-sm font-bold text-rose-800">અરજી સબમિટ કરવામાં ભૂલ આવી (Form Submission Error)</h4>
              <p className="text-xs text-rose-700 leading-relaxed">
                સર્વર સાથે સિંક કરતી વખતે કોઈ અણધારી સમસ્યા આવી છે. કૃપા કરીને ઇન્ટરનેટ કનેક્શન અને વિગતો તપાસો.
              </p>
              <div className="text-[11px] text-rose-700 bg-white/60 p-3 rounded-lg border border-rose-100 font-medium font-mono break-all leading-normal mt-1.5">
                {submitError}
              </div>
            </div>
          </div>
        )}

        {/* Verification banner if editing */}
        {editingEntry && (
          <div className="space-y-4">
            {editingEntry.status === 'CORRECTION_REQUIRED' && editingEntry.adminFeedback && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="space-y-1 w-full">
                  <p className="text-sm font-semibold text-rose-800">⚠️ માલિક દ્વારા સુધારો કરવા જણાવેલ છે (Correction Required by Owner)</p>
                  <div className="text-xs text-rose-700 bg-white/80 p-3 rounded-lg border border-rose-100 font-medium">
                    {editingEntry.adminFeedback}
                  </div>
                  <p className="text-[10px] text-rose-500 italic mt-1 font-medium">
                    * કૃપા કરીને ઉપર જણાવેલ ભૂલ સુધારીને ફરીથી સબમિટ કરો. (Please correct the listed issue and re-submit.)
                  </p>
                </div>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5 animate-spin-slow flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">અરજી સુધારી રહ્યા છો (Editing Application)</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  તમે અરજી ID: <span className="font-mono font-bold">{editingEntry.id}</span> માં ફેરફાર કરી રહ્યા છો.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAN CARD FORM FIELDS ================= */}
        {formType === 'PAN_CARD' && (
          <div className="space-y-8">
            
            {/* 1. Beneficiary Information */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. લાભાર્થીની વિગતો (1. Applicant Name & Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={panDetails.firstName}
                    onChange={e => handlePanDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ARJUN"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={panDetails.middleName}
                    onChange={e => handlePanDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESHBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={panDetails.lastName}
                    onChange={e => handlePanDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PATEL"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* DOB, Mobile, Email, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                {/* DOB */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={panDetails.dob}
                    onChange={e => handlePanDetailsChange('dob', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={panDetails.mobile}
                    onChange={e => handlePanDetailsChange('mobile', e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> ઇમેઇલ આઈડી (Email ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={panDetails.email}
                    onChange={e => handlePanDetailsChange('email', e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={panDetails.gender}
                    onChange={e => handlePanDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>
              </div>
            </section>

            {/* 2. Father Information */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૨. પિતાની વિગતો (2. Father Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Father First Name */}
                <div id="fatherFirstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાનું પ્રથમ નામ (Father First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={panDetails.fatherFirstName}
                    onChange={e => handlePanDetailsChange('fatherFirstName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH"
                    className={`w-full bg-slate-50 border ${errors.fatherFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherFirstName}</p>}
                </div>

                {/* Father Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાનું મધ્યમ નામ (Father Middle Name)
                  </label>
                  <input
                    type="text"
                    value={panDetails.fatherMiddleName}
                    onChange={e => handlePanDetailsChange('fatherMiddleName', e.target.value.toUpperCase())}
                    placeholder="e.g. HARIBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Father Last Name */}
                <div id="fatherLastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાની અટક (Father Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={panDetails.fatherLastName}
                    onChange={e => handlePanDetailsChange('fatherLastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PATEL"
                    className={`w-full bg-slate-50 border ${errors.fatherLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherLastName}</p>}
                </div>
              </div>
            </section>

            {/* 3. Document Upload Section */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૩. દસ્તાવેજો અપલોડ કરો (3. Upload Required Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ - આગળનો ભાગ (Aadhaar Card Front)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ આગળનો ભાગ"
                    document={panDocs.aadharCardFront}
                    onUpload={(doc) => setPanDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhaar Card Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ - પાછળનો ભાગ (Aadhaar Card Back)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ પાછળનો ભાગ"
                    document={panDocs.aadharCardBack}
                    onUpload={(doc) => setPanDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                {/* Birth Proof Type Selector & Doc */}
                <div id="birthProofType" className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      જન્મ તારીખ પુરાવાનો પ્રકાર (Birth Proof Type) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={panDocs.birthProofType}
                      onChange={e => {
                        setPanDocs(prev => ({ ...prev, birthProofType: e.target.value as any }));
                        removeError('birthProofType');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all cursor-pointer"
                    >
                      <option value="">-- પુરાવો પસંદ કરો --</option>
                      <option value="BIRTH_CERTIFICATE">જન્મ પ્રમાણપત્ર (Birth Certificate)</option>
                      <option value="VOTER_ID">મતદાર આઈડી (Voter ID Card)</option>
                    </select>
                    {errors.birthProofType && <p className="text-xs text-red-500 mt-1">{errors.birthProofType}</p>}
                  </div>

                  {panDocs.birthProofType === 'BIRTH_CERTIFICATE' && (
                    <div id="birthProofDoc">
                      <DocumentUploader
                        label="જન્મ પ્રમાણપત્ર (Birth Certificate)"
                        gujaratiLabel="જન્મતારીખના પુરાવા માટે જન્મ પ્રમાણપત્ર"
                        document={panDocs.birthProofDoc}
                        onUpload={(doc) => setPanDocs(prev => ({ ...prev, birthProofDoc: doc }))}
                        required
                      />
                      {errors.birthProofDoc && <p className="text-xs text-red-500 mt-1">{errors.birthProofDoc}</p>}
                    </div>
                  )}

                  {panDocs.birthProofType === 'VOTER_ID' && (
                    <div className="space-y-4">
                      <div id="voterIdFront">
                        <DocumentUploader
                          label="મતદાર આઈડી કાર્ડ - આગળનો ભાગ (Voter ID Front)"
                          gujaratiLabel="મતદાર આઈડી આગળનો ભાગ"
                          document={panDocs.voterIdFront || null}
                          onUpload={(doc) => setPanDocs(prev => ({ ...prev, voterIdFront: doc }))}
                          required
                        />
                        {errors.voterIdFront && <p className="text-xs text-red-500 mt-1">{errors.voterIdFront}</p>}
                      </div>
                      <div id="voterIdBack">
                        <DocumentUploader
                          label="મતદાર આઈડી કાર્ડ - પાછળનો ભાગ (Voter ID Back)"
                          gujaratiLabel="મતદાર આઈડી પાછળનો ભાગ"
                          document={panDocs.voterIdBack || null}
                          onUpload={(doc) => setPanDocs(prev => ({ ...prev, voterIdBack: doc }))}
                          required
                        />
                        {errors.voterIdBack && <p className="text-xs text-red-500 mt-1">{errors.voterIdBack}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature */}
                <div id="signature">
                  <DocumentUploader
                    label="અરજદારની સહી (Applicant Signature)"
                    gujaratiLabel="સફેદ કાગળ પર કાળી/બ્લુ પેનથી સહી"
                    document={panDocs.signature}
                    onUpload={(doc) => setPanDocs(prev => ({ ...prev, signature: doc }))}
                    required
                  />
                  {errors.signature && <p className="text-xs text-red-500 mt-1">{errors.signature}</p>}
                </div>

                {/* Passport Photo */}
                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="તાજેતરનો રંગીન પાસપોર્ટ ફોટો"
                    document={panDocs.passportPhoto}
                    onUpload={(doc) => setPanDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>
              </div>
            </section>

          </div>
        )}

        
        {formType === 'PAN_CARD_CORRECTION' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                અરજદારની વિગતો (Applicant Details) - પેન કાર્ડ સુધારો
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (First Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={panCorrectionDetails.firstName} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, firstName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="First Name" />
                  {errors.firstName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Middle Name)</label>
                  <input type="text" value={panCorrectionDetails.middleName} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, middleName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father/Husband Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Last Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={panCorrectionDetails.lastName} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, lastName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Surname" />
                  {errors.lastName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મતારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={panCorrectionDetails.dob} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.dob && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={panCorrectionDetails.gender} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male (પુરુષ)</option>
                    <option value="FEMALE">Female (સ્ત્રી)</option>
                    <option value="OTHER">Other (અન્ય)</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ નંબર (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={panCorrectionDetails.mobile} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, mobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="10 Digit Number" />
                  {errors.mobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email) <span className="text-rose-500">*</span></label>
                  <input type="email" value={panCorrectionDetails.email} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, email: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Email Address" />
                  {errors.email && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જૂનો પેન કાર્ડ નંબર (Old PAN Card No) <span className="text-rose-500">*</span></label>
                  <input type="text" value={panCorrectionDetails.oldPanCardNumber} onChange={(e) => setPanCorrectionDetails({ ...panCorrectionDetails, oldPanCardNumber: e.target.value.toUpperCase() })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="ABCDE1234F" />
                  {errors.oldPanCardNumber && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.oldPanCardNumber}</p>}
                </div>
              </div>

              <div className="mt-6">
                  <label className="block text-xs font-bold text-slate-700 mb-3">સુધારાની વિગતો (Correction Details) <span className="text-rose-500">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    {['Name', 'Date of birth', 'Address', 'Photo', 'signature'].map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={panCorrectionDetails.correctionDetails.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPanCorrectionDetails({...panCorrectionDetails, correctionDetails: [...panCorrectionDetails.correctionDetails, item]});
                            } else {
                              setPanCorrectionDetails({...panCorrectionDetails, correctionDetails: panCorrectionDetails.correctionDetails.filter(i => i !== item)});
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  {errors.correctionDetails && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.correctionDetails}</p>}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                જરૂરી દસ્તાવેજો (Required Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="આધાર કાર્ડ આગળ (Aadhaar Front) *" gujaratiLabel="" document={panCorrectionDocs.aadharCardFront} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, aadharCardFront: doc})} />
                  {errors.aadharCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="આધાર કાર્ડ પાછળ (Aadhaar Back) *" gujaratiLabel="" document={panCorrectionDocs.aadharCardBack} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, aadharCardBack: doc})} />
                  {errors.aadharCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="સહી (Signature) *" gujaratiLabel="" document={panCorrectionDocs.signature} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, signature: doc})} />
                  {errors.signature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.signature}</p>}
                </div>
                <div>
                  <DocumentUploader label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo) *" gujaratiLabel="" document={panCorrectionDocs.passportPhoto} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, passportPhoto: doc})} />
                  {errors.passportPhoto && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.passportPhoto}</p>}
                </div>
                
                <div className="col-span-full border-t border-slate-200 pt-6 mt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-3">જન્મતારીખ નો પુરાવો પસંદ કરો (Select Date of Birth Proof) <span className="text-rose-500">*</span></label>
                  <select 
                    value={panCorrectionDocs.birthProofType} 
                    onChange={(e) => setPanCorrectionDocs({ ...panCorrectionDocs, birthProofType: e.target.value as any })}
                    className="w-full md:w-1/2 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 mb-6"
                  >
                    <option value="">-- પુરાવો પસંદ કરો --</option>
                    <option value="BIRTH_CERTIFICATE">જન્મ પ્રમાણપત્ર (Birth Certificate)</option>
                    <option value="VOTER_ID">ચૂંટણી કાર્ડ (Voter ID)</option>
                  </select>
                  {errors.birthProofType && <p className="text-rose-500 text-[10px] mt-1 font-bold -mt-4 mb-4">{errors.birthProofType}</p>}
                  
                  {panCorrectionDocs.birthProofType === 'BIRTH_CERTIFICATE' && (
                    <div>
                  <DocumentUploader label="જન્મ પ્રમાણપત્ર (Birth Certificate) *" gujaratiLabel="" document={panCorrectionDocs.birthProofDoc} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, birthProofDoc: doc})} />
                  {errors.birthProofDoc && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.birthProofDoc}</p>}
                </div>
                  )}
                  {panCorrectionDocs.birthProofType === 'VOTER_ID' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                  <DocumentUploader label="મતદાર આઈડી આગળ (Voter ID Front) *" gujaratiLabel="" document={panCorrectionDocs.voterIdFront} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, voterIdFront: doc})} />
                  {errors.voterIdFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.voterIdFront}</p>}
                </div>
                      <div>
                  <DocumentUploader label="મતદાર આઈડી પાછળ (Voter ID Back) *" gujaratiLabel="" document={panCorrectionDocs.voterIdBack} onUpload={(doc) => setPanCorrectionDocs({...panCorrectionDocs, voterIdBack: doc})} />
                  {errors.voterIdBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.voterIdBack}</p>}
                </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {formType === 'MINOR_PAN_CARD' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                સગીર અરજદારની વિગતો (Minor Applicant Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (First Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={minorPanDetails.firstName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, firstName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="First Name" />
                  {errors.firstName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Middle Name)</label>
                  <input type="text" value={minorPanDetails.middleName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, middleName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Middle Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Last Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={minorPanDetails.lastName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, lastName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Surname" />
                  {errors.lastName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મતારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={minorPanDetails.dob} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.dob && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={minorPanDetails.gender} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male (પુરુષ)</option>
                    <option value="FEMALE">Female (સ્ત્રી)</option>
                    <option value="OTHER">Other (અન્ય)</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ નંબર (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={minorPanDetails.mobile} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, mobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="10 Digit Number" />
                  {errors.mobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email) <span className="text-rose-500">*</span></label>
                  <input type="email" value={minorPanDetails.email} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, email: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Email Address" />
                  {errors.email && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                પ્રતિનિધિની વિગતો (Representative Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રતિનિધિ (Representative) <span className="text-rose-500">*</span></label>
                  <select value={minorPanDetails.representative} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, representative: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Representative</option>
                    <option value="FATHER">Father (પિતા)</option>
                    <option value="MOTHER">Mother (માતા)</option>
                    <option value="OTHER">Other (અન્ય)</option>
                  </select>
                  {errors.representative && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.representative}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રતિનિધિનું પ્રથમ નામ <span className="text-rose-500">*</span></label>
                  <input type="text" value={minorPanDetails.repFirstName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, repFirstName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.repFirstName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repFirstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રતિનિધિનું વચલું નામ</label>
                  <input type="text" value={minorPanDetails.repMiddleName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, repMiddleName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રતિનિધિની અટક <span className="text-rose-500">*</span></label>
                  <input type="text" value={minorPanDetails.repLastName} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, repLastName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.repLastName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repLastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રતિનિધિ હોદ્દો (Designation) <span className="text-rose-500">*</span></label>
                  <input type="text" value={minorPanDetails.repDesignation} onChange={(e) => setMinorPanDetails({ ...minorPanDetails, repDesignation: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.repDesignation && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repDesignation}</p>}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                જરૂરી દસ્તાવેજો (Required Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="આધાર કાર્ડ આગળ (Aadhaar Front) *" gujaratiLabel="" document={minorPanDocs.aadharCardFront} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, aadharCardFront: doc})} />
                  {errors.aadharCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="આધાર કાર્ડ પાછળ (Aadhaar Back) *" gujaratiLabel="" document={minorPanDocs.aadharCardBack} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, aadharCardBack: doc})} />
                  {errors.aadharCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="જન્મ પ્રમાણપત્ર (Birth Certificate) *" gujaratiLabel="" document={minorPanDocs.birthCertificate} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, birthCertificate: doc})} />
                  {errors.birthCertificate && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.birthCertificate}</p>}
                </div>
                <div>
                  <DocumentUploader label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo) *" gujaratiLabel="" document={minorPanDocs.passportPhoto} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, passportPhoto: doc})} />
                  {errors.passportPhoto && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.passportPhoto}</p>}
                </div>
                <div>
                  <DocumentUploader label="પ્રતિનિધિની સહી (Rep. Signature) *" gujaratiLabel="" document={minorPanDocs.repSignature} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, repSignature: doc})} />
                  {errors.repSignature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repSignature}</p>}
                </div>
                
                <div className="col-span-full border-t border-slate-200 pt-6 mt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-3">પ્રતિનિધિનો દસ્તાવેજ પસંદ કરો (Select Representative Doc) <span className="text-rose-500">*</span></label>
                  <select 
                    value={minorPanDocs.repDocType} 
                    onChange={(e) => setMinorPanDocs({ ...minorPanDocs, repDocType: e.target.value as any })}
                    className="w-full md:w-1/2 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 mb-6"
                  >
                    <option value="">-- દસ્તાવેજ પસંદ કરો --</option>
                    <option value="AADHAR_CARD">આધાર કાર્ડ (Aadhaar Card)</option>
                    <option value="PAN_CARD">પેન કાર્ડ (PAN Card)</option>
                  </select>
                  {errors.repDocType && <p className="text-rose-500 text-[10px] mt-1 font-bold -mt-4 mb-4">{errors.repDocType}</p>}
                  
                  {minorPanDocs.repDocType === 'AADHAR_CARD' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                  <DocumentUploader label="પ્રતિ. આધાર આગળ (Rep Aadhaar Front) *" gujaratiLabel="" document={minorPanDocs.repAadharFront} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, repAadharFront: doc})} />
                  {errors.repAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repAadharFront}</p>}
                </div>
                      <div>
                  <DocumentUploader label="પ્રતિ. આધાર પાછળ (Rep Aadhaar Back) *" gujaratiLabel="" document={minorPanDocs.repAadharBack} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, repAadharBack: doc})} />
                  {errors.repAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repAadharBack}</p>}
                </div>
                    </div>
                  )}
                  {minorPanDocs.repDocType === 'PAN_CARD' && (
                    <div>
                  <DocumentUploader label="પ્રતિ. પેન કાર્ડ (Rep PAN Card) *" gujaratiLabel="" document={minorPanDocs.repPanCard} onUpload={(doc) => setMinorPanDocs({...minorPanDocs, repPanCard: doc})} />
                  {errors.repPanCard && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.repPanCard}</p>}
                </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {formType === 'VOTER_ID_CORRECTION' && (
          <div className="space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                અરજદારની વિગતો (Applicant Details) - મતદાર આઈડી સુધારો
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (First Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.firstName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, firstName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="First Name" />
                  {errors.firstName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Middle Name)</label>
                  <input type="text" value={voterCorrectionDetails.middleName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, middleName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Last Name) <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.lastName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, lastName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.lastName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મતારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={voterCorrectionDetails.dob} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.dob && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={voterCorrectionDetails.gender} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male (પુરુષ)</option>
                    <option value="FEMALE">Female (સ્ત્રી)</option>
                    <option value="OTHER">Other (અન્ય)</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ નંબર (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={voterCorrectionDetails.mobile} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, mobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.mobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email) <span className="text-rose-500">*</span></label>
                  <input type="email" value={voterCorrectionDetails.email} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, email: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.email && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જૂનો ચૂંટણી કાર્ડ નંબર (Old Epic No) <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.oldEpicCardNumber} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, oldEpicCardNumber: e.target.value.toUpperCase() })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.oldEpicCardNumber && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.oldEpicCardNumber}</p>}
                </div>
              </div>
              <div className="mt-6">
                  <label className="block text-xs font-bold text-slate-700 mb-3">સુધારાની વિગતો (Correction Details) <span className="text-rose-500">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    {['Name', 'Date of birth', 'Address', 'Photo'].map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={voterCorrectionDetails.correctionDetails.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVoterCorrectionDetails({...voterCorrectionDetails, correctionDetails: [...voterCorrectionDetails.correctionDetails, item]});
                            } else {
                              setVoterCorrectionDetails({...voterCorrectionDetails, correctionDetails: voterCorrectionDetails.correctionDetails.filter(i => i !== item)});
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  {errors.correctionDetails && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.correctionDetails}</p>}
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                સંબંધીની વિગતો (Relative Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">સંબંધી (Relative Type) <span className="text-rose-500">*</span></label>
                  <select value={voterCorrectionDetails.relativeType} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, relativeType: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select</option>
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="SPOUSE">Spouse</option>
                  </select>
                  {errors.relativeType && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeType}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.relativeFirstName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, relativeFirstName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.relativeFirstName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeFirstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ</label>
                  <input type="text" value={voterCorrectionDetails.relativeMiddleName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, relativeMiddleName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.relativeLastName} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, relativeLastName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.relativeLastName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeLastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ચૂંટણી કાર્ડ નંબર (Epic No) <span className="text-rose-500">*</span></label>
                  <input type="text" value={voterCorrectionDetails.relativeEpicCardNumber} onChange={(e) => setVoterCorrectionDetails({ ...voterCorrectionDetails, relativeEpicCardNumber: e.target.value.toUpperCase() })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500" />
                  {errors.relativeEpicCardNumber && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeEpicCardNumber}</p>}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                જરૂરી દસ્તાવેજો (Required Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="આધાર કાર્ડ આગળ (Aadhaar Front) *" gujaratiLabel="" document={voterCorrectionDocs.aadharCardFront} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, aadharCardFront: doc})} />
                  {errors.aadharCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="આધાર કાર્ડ પાછળ (Aadhaar Back) *" gujaratiLabel="" document={voterCorrectionDocs.aadharCardBack} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, aadharCardBack: doc})} />
                  {errors.aadharCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo) *" gujaratiLabel="" document={voterCorrectionDocs.passportPhoto} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, passportPhoto: doc})} />
                  {errors.passportPhoto && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.passportPhoto}</p>}
                </div>
                
                <div>
                  <DocumentUploader label="જૂનો ચૂંટણી કાર્ડ આગળ *" gujaratiLabel="" document={voterCorrectionDocs.oldEpicCardFront} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, oldEpicCardFront: doc})} />
                  {errors.oldEpicCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.oldEpicCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="જૂનો ચૂંટણી કાર્ડ પાછળ *" gujaratiLabel="" document={voterCorrectionDocs.oldEpicCardBack} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, oldEpicCardBack: doc})} />
                  {errors.oldEpicCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.oldEpicCardBack}</p>}
                </div>
                
                <div>
                  <DocumentUploader label="સંબંધીનો ચૂંટણી કાર્ડ આગળ *" gujaratiLabel="" document={voterCorrectionDocs.relativeEpicCardFront} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, relativeEpicCardFront: doc})} />
                  {errors.relativeEpicCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeEpicCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="સંબંધીનો ચૂંટણી કાર્ડ પાછળ *" gujaratiLabel="" document={voterCorrectionDocs.relativeEpicCardBack} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, relativeEpicCardBack: doc})} />
                  {errors.relativeEpicCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.relativeEpicCardBack}</p>}
                </div>
                
                <div>
                  <DocumentUploader label="સરનામાનો પુરાવો (Address Proof) *" gujaratiLabel="" document={voterCorrectionDocs.addressProof} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, addressProof: doc})} />
                  {errors.addressProof && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.addressProof}</p>}
                </div>
                
                <div className="col-span-full border-t border-slate-200 pt-6 mt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-3">જન્મ પુરાવાનો પ્રકાર (Birth Proof Type) <span className="text-rose-500">*</span></label>
                  <select 
                    value={voterCorrectionDocs.birthProofType} 
                    onChange={(e) => setVoterCorrectionDocs({ ...voterCorrectionDocs, birthProofType: e.target.value as any })}
                    className="w-full md:w-1/2 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 mb-6"
                  >
                    <option value="">-- પુરાવો પસંદ કરો --</option>
                    <option value="BIRTH_CERTIFICATE">જન્મ પ્રમાણપત્ર (Birth Certificate)</option>
                    <option value="SCHOOL_LEAVING">શાળા છોડ્યાનું પ્રમાણપત્ર (School Leaving)</option>
                  </select>
                  {errors.birthProofType && <p className="text-rose-500 text-[10px] mt-1 font-bold -mt-4 mb-4">{errors.birthProofType}</p>}
                  
                  {voterCorrectionDocs.birthProofType && (
                    <div>
                  <DocumentUploader label="જન્મ પુરાવો (Birth Proof) *" gujaratiLabel="" document={voterCorrectionDocs.birthProofDoc} onUpload={(doc) => setVoterCorrectionDocs({...voterCorrectionDocs, birthProofDoc: doc})} />
                  {errors.birthProofDoc && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.birthProofDoc}</p>}
                </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VOTER ID CARD FORM FIELDS ================= */}
        {formType === 'VOTER_ID' && (
          <div className="space-y-8">
            
            {/* 1. Applicant Name & Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. અરજદારની વ્યક્તિગત માહિતી (1. Applicant Personal Details)
                </h3>
                <span className="text-xs text-rose-500">* ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={voterDetails.firstName}
                    onChange={e => handleVoterDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. SANJAY"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={voterDetails.middleName}
                    onChange={e => handleVoterDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. MANUBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={voterDetails.lastName}
                    onChange={e => handleVoterDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. SOLANKI"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* DOB, Mobile, Email */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                {/* DOB */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={voterDetails.dob}
                    onChange={e => handleVoterDetailsChange('dob', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={voterDetails.mobile}
                    onChange={e => handleVoterDetailsChange('mobile', e.target.value)}
                    placeholder="e.g. 9988776655"
                    maxLength={10}
                    className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> ઇમેઇલ આઈડી (Email ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={voterDetails.email}
                    onChange={e => handleVoterDetailsChange('email', e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={voterDetails.gender}
                    onChange={e => handleVoterDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>
              </div>
            </section>

            {/* 2. Family/Relative Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૨. સગાં-સંબંધીની વિગતો (2. Relative Details & EPIC)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Relative Type */}
                <div id="relativeType" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    સગાં સંબંધીનો પ્રકાર (Relative Type) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={voterDetails.relativeType}
                    onChange={e => handleVoterDetailsChange('relativeType', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.relativeType ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all cursor-pointer`}
                  >
                    <option value="">-- સંબંધ પસંદ કરો --</option>
                    <option value="FATHER">પિતા (Father)</option>
                    <option value="MOTHER">માતા (Mother)</option>
                    <option value="SPOUSE">પતિ / પત્ની (Spouse)</option>
                  </select>
                  {errors.relativeType && <p className="text-xs text-red-500 mt-0.5">{errors.relativeType}</p>}
                </div>

                {/* Relative EPIC Card Number */}
                <div id="relativeEpicNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    સગાં સંબંધીનો EPIC નંબર (Relative EPIC Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={voterDetails.relativeEpicNumber}
                    onChange={e => handleVoterDetailsChange('relativeEpicNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. GJ/12/054/123456"
                    className={`w-full bg-slate-50 border ${errors.relativeEpicNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.relativeEpicNumber && <p className="text-xs text-red-500 mt-0.5">{errors.relativeEpicNumber}</p>}
                </div>
              </div>

              {/* Relative Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div id="fatherFirstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    સંબંધીનું પ્રથમ નામ (Relative First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={voterDetails.fatherFirstName}
                    onChange={e => handleVoterDetailsChange('fatherFirstName', e.target.value.toUpperCase())}
                    placeholder="e.g. MANUBHAI"
                    className={`w-full bg-slate-50 border ${errors.fatherFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherFirstName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    સંબંધીનું મધ્યમ નામ (Relative Middle Name)
                  </label>
                  <input
                    type="text"
                    value={voterDetails.fatherMiddleName}
                    onChange={e => handleVoterDetailsChange('fatherMiddleName', e.target.value.toUpperCase())}
                    placeholder="e.g. KANJIBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                <div id="fatherLastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    સંબંધીની અટક (Relative Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={voterDetails.fatherLastName}
                    onChange={e => handleVoterDetailsChange('fatherLastName', e.target.value.toUpperCase())}
                    placeholder="e.g. SOLANKI"
                    className={`w-full bg-slate-50 border ${errors.fatherLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherLastName}</p>}
                </div>
              </div>
            </section>

            {/* 3. Document Upload Section */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૩. દસ્તાવેજો અપલોડ કરો (3. Upload Required Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ - આગળનો ભાગ (Aadhaar Card Front)"
                    gujaratiLabel="ઓળખ અને સરનામા માટે આધાર કાર્ડ આગળનો ભાગ"
                    document={voterDocs.aadharCardFront}
                    onUpload={(doc) => setVoterDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhaar Card Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ - પાછળનો ભાગ (Aadhaar Card Back)"
                    gujaratiLabel="ઓળખ અને સરનામા માટે આધાર કાર્ડ પાછળનો ભાગ"
                    document={voterDocs.aadharCardBack}
                    onUpload={(doc) => setVoterDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                {/* Relative EPIC Card Front Upload */}
                <div id="relativeEpicCardFront">
                  <DocumentUploader
                    label="સંબંધીનું વોટર આઈડી - આગળનો ભાગ (Relative EPIC Card Front)"
                    gujaratiLabel="EPIC પુરાવા તરીકે સગાનું ચૂંટણી કાર્ડ આગળનો ભાગ"
                    document={voterDocs.relativeEpicCardFront}
                    onUpload={(doc) => setVoterDocs(prev => ({ ...prev, relativeEpicCardFront: doc }))}
                    required
                  />
                  {errors.relativeEpicCardFront && <p className="text-xs text-red-500 mt-1">{errors.relativeEpicCardFront}</p>}
                </div>

                {/* Relative EPIC Card Back Upload */}
                <div id="relativeEpicCardBack">
                  <DocumentUploader
                    label="સંબંધીનું વોટર આઈડી - પાછળનો ભાગ (Relative EPIC Card Back)"
                    gujaratiLabel="EPIC પુરાવા તરીકે સગાનું ચૂંટણી કાર્ડ પાછળનો ભાગ"
                    document={voterDocs.relativeEpicCardBack}
                    onUpload={(doc) => setVoterDocs(prev => ({ ...prev, relativeEpicCardBack: doc }))}
                    required
                  />
                  {errors.relativeEpicCardBack && <p className="text-xs text-red-500 mt-1">{errors.relativeEpicCardBack}</p>}
                </div>

                {/* Birth Proof Type Selector & Doc */}
                <div id="birthProofType" className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      જન્મ તારીખ પુરાવો (Birth Proof Type) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={voterDocs.birthProofType}
                      onChange={e => {
                        setVoterDocs(prev => ({ ...prev, birthProofType: e.target.value as any }));
                        removeError('birthProofType');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all cursor-pointer"
                    >
                      <option value="">-- પુરાવો પસંદ કરો --</option>
                      <option value="BIRTH_CERTIFICATE">જન્મ પ્રમાણપત્ર (Birth Certificate)</option>
                      <option value="SCHOOL_LEAVING">શાળા છોડ્યાનું પ્રમાણપત્ર (School Leaving Cert)</option>
                    </select>
                    {errors.birthProofType && <p className="text-xs text-red-500 mt-1">{errors.birthProofType}</p>}
                  </div>

                  {voterDocs.birthProofType && (
                    <div id="birthProofDoc">
                      <DocumentUploader
                        label="જન્મ તારીખનો દસ્તાવેજ (Birth Proof Document)"
                        gujaratiLabel="પસંદ કરેલો પુરાવો અપલોડ કરો"
                        document={voterDocs.birthProofDoc}
                        onUpload={(doc) => setVoterDocs(prev => ({ ...prev, birthProofDoc: doc }))}
                        required
                      />
                      {errors.birthProofDoc && <p className="text-xs text-red-500 mt-1">{errors.birthProofDoc}</p>}
                    </div>
                  )}
                </div>

                {/* Passport Photo */}
                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="વોટર આઈડીમાં છાપવા માટે પાસપોર્ટ ફોટો"
                    document={voterDocs.passportPhoto}
                    onUpload={(doc) => setVoterDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ================= E_SHRAM CARD FORM FIELDS ================= */}
        {formType === 'E_SHRAM' && (
          <div className="space-y-8">
            
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. વ્યક્તિગત વિગતો (1. Applicant Personal Details)
                </h3>
                <span className="text-xs text-rose-500">* ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eshramDetails.firstName}
                    onChange={e => handleEshramDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={eshramDetails.middleName}
                    onChange={e => handleEshramDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. HIRALAL"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eshramDetails.lastName}
                    onChange={e => handleEshramDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* DOB, Mobile, Email, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                {/* DOB */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={eshramDetails.dob}
                    onChange={e => handleEshramDetailsChange('dob', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={eshramDetails.mobile}
                    onChange={e => handleEshramDetailsChange('mobile', e.target.value)}
                    placeholder="e.g. 7890543210"
                    maxLength={10}
                    className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> ઇમેઇલ આઈડી (Email ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={eshramDetails.email}
                    onChange={e => handleEshramDetailsChange('email', e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eshramDetails.gender}
                    onChange={e => handleEshramDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>
              </div>

              {/* Occupation */}
              <div id="occupation" className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">
                  વ્યવસાય / કામની વિગતો (Occupation / Work Details) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eshramDetails.occupation}
                  onChange={e => handleEshramDetailsChange('occupation', e.target.value)}
                  placeholder="e.g. બાંધકામ મજૂર (Construction Labor), ખેત મજૂર, રિક્ષા ચાલક"
                  className={`w-full bg-slate-50 border ${errors.occupation ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                />
                {errors.occupation && <p className="text-xs text-red-500 mt-0.5">{errors.occupation}</p>}
              </div>
            </section>

            {/* 2. Bank Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Landmark className="h-4.5 w-4.5 text-indigo-600" /> ૨. બેંક ખાતાની વિગતો (2. Bank Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bank Account Number */}
                <div id="bankAccountNum" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક ખાતા નંબર (Account Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={eshramDetails.bankAccountNum}
                    onChange={e => handleEshramDetailsChange('bankAccountNum', e.target.value)}
                    placeholder="Enter Account Number"
                    className={`w-full bg-slate-50 border ${errors.bankAccountNum ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.bankAccountNum && <p className="text-xs text-red-500 mt-0.5">{errors.bankAccountNum}</p>}
                </div>

                {/* Bank IFSC Code */}
                <div id="bankIfsc" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક IFSC કોડ (IFSC Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eshramDetails.bankIfsc}
                    onChange={e => handleEshramDetailsChange('bankIfsc', e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0012345"
                    className={`w-full bg-slate-50 border ${errors.bankIfsc ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankIfsc && <p className="text-xs text-red-500 mt-0.5">{errors.bankIfsc}</p>}
                </div>

                {/* Bank Holder Name */}
                <div id="bankHolderName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ખાતાધારકનું નામ (Account Holder Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eshramDetails.bankHolderName}
                    onChange={e => handleEshramDetailsChange('bankHolderName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH HIRALAL PARMAR"
                    className={`w-full bg-slate-50 border ${errors.bankHolderName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankHolderName && <p className="text-xs text-red-500 mt-0.5">{errors.bankHolderName}</p>}
                </div>
              </div>
            </section>

            {/* 3. Documents */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૩. દસ્તાવેજો અપલોડ કરો (3. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ - આગળનો ભાગ (Aadhaar Card Front)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ આગળનો ભાગ"
                    document={eshramDocs.aadharCardFront}
                    onUpload={(doc) => setEshramDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhaar Card Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ - પાછળનો ભાગ (Aadhaar Card Back)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ પાછળનો ભાગ"
                    document={eshramDocs.aadharCardBack}
                    onUpload={(doc) => setEshramDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="bankPassbook">
                  <DocumentUploader
                    label="બેંક પાસબુક (Bank Passbook)"
                    gujaratiLabel="બેંક ખાતાની ખાતરી માટે પ્રથમ પાનું"
                    document={eshramDocs.bankPassbook}
                    onUpload={(doc) => setEshramDocs(prev => ({ ...prev, bankPassbook: doc }))}
                    required
                  />
                  {errors.bankPassbook && <p className="text-xs text-red-500 mt-1">{errors.bankPassbook}</p>}
                </div>

                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="રંગીન તાજેતરનો પાસપોર્ટ ફોટો"
                    document={eshramDocs.passportPhoto}
                    onUpload={(doc) => setEshramDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>

                <div id="panCard">
                  <DocumentUploader
                    label="પેન કાર્ડ - વૈકલ્પિક (PAN Card - Optional)"
                    gujaratiLabel="જો ઉપલબ્ધ હોય તો જ અપલોડ કરો"
                    document={eshramDocs.panCard}
                    onUpload={(doc) => setEshramDocs(prev => ({ ...prev, panCard: doc }))}
                  />
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ================= FARMER SUBSIDY FORM FIELDS ================= */}
        {formType === 'FARMER_SUBSIDY' && (
          <div className="space-y-8">
            
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. ખેડૂત અરજદારની વિગતો (1. Farmer Details)
                </h3>
                <span className="text-xs text-rose-500">* ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.firstName}
                    onChange={e => handleFarmerDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. KHIMJI"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.middleName}
                    onChange={e => handleFarmerDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. DEVRAJBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.lastName}
                    onChange={e => handleFarmerDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PATEL"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* Mobile, Email, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Mobile */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={farmerDetails.mobile}
                    onChange={e => handleFarmerDetailsChange('mobile', e.target.value)}
                    placeholder="e.g. 9426012345"
                    maxLength={10}
                    className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> ઇમેઇલ આઈડી (Email ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={farmerDetails.email}
                    onChange={e => handleFarmerDetailsChange('email', e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={farmerDetails.gender}
                    onChange={e => handleFarmerDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>
              </div>
            </section>

            {/* 2. Farming Land Details & Scheme selection */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Sprout className="h-4.5 w-4.5 text-lime-700" /> ૨. ખેતીની જમીન અને યોજનાની વિગતો (2. Land & Scheme Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Village Name */}
                <div id="villageName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ગામનું નામ (Village Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.villageName}
                    onChange={e => handleFarmerDetailsChange('villageName', e.target.value)}
                    placeholder="e.g. GONDAL"
                    className={`w-full bg-slate-50 border ${errors.villageName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.villageName && <p className="text-xs text-red-500 mt-0.5">{errors.villageName}</p>}
                </div>

                {/* Sub-district */}
                <div id="subDistrict" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    તાલુકો / પેટા-જિલ્લો (Sub-District / Taluka) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.subDistrict}
                    onChange={e => handleFarmerDetailsChange('subDistrict', e.target.value)}
                    placeholder="e.g. JETPUR"
                    className={`w-full bg-slate-50 border ${errors.subDistrict ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.subDistrict && <p className="text-xs text-red-500 mt-0.5">{errors.subDistrict}</p>}
                </div>

                {/* District */}
                <div id="district" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જિલ્લો (District) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.district}
                    onChange={e => handleFarmerDetailsChange('district', e.target.value)}
                    placeholder="e.g. RAJKOT"
                    className={`w-full bg-slate-50 border ${errors.district ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.district && <p className="text-xs text-red-500 mt-0.5">{errors.district}</p>}
                </div>

                {/* Survey Number */}
                <div id="surveyNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ખાતા નંબર / સર્વે નંબર (Khata No / Survey No) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.surveyNumber}
                    onChange={e => handleFarmerDetailsChange('surveyNumber', e.target.value)}
                    placeholder="e.g. 74/2 or 105"
                    className={`w-full bg-slate-50 border ${errors.surveyNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.surveyNumber && <p className="text-xs text-red-500 mt-0.5">{errors.surveyNumber}</p>}
                </div>
              </div>

              {/* Subsidy Scheme - Dynamic Type choose */}
              <div id="subsidyScheme" className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">
                  પસંદ કરેલ સબસિડી યોજના (Subsidy Scheme Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={farmerDetails.subsidyScheme}
                  onChange={e => handleFarmerDetailsChange('subsidyScheme', e.target.value)}
                  placeholder="e.g. ટ્રેક્ટર ખરીદી સબસિડી, ખેત તલાવડી યોજના, ટપક સિંચાઈ પદ્ધતિ સબસિડી"
                  className={`w-full bg-slate-50 border ${errors.subsidyScheme ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                />
                {errors.subsidyScheme && <p className="text-xs text-red-500 mt-0.5">{errors.subsidyScheme}</p>}
              </div>
            </section>

            {/* 3. Bank Account Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Landmark className="h-4.5 w-4.5 text-indigo-600" /> ૩. બેંક ખાતાની વિગતો (3. Bank Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Number */}
                <div id="bankAccountNum" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક ખાતા નંબર (Account Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={farmerDetails.bankAccountNum}
                    onChange={e => handleFarmerDetailsChange('bankAccountNum', e.target.value)}
                    placeholder="Enter Account Number"
                    className={`w-full bg-slate-50 border ${errors.bankAccountNum ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.bankAccountNum && <p className="text-xs text-red-500 mt-0.5">{errors.bankAccountNum}</p>}
                </div>

                {/* IFSC */}
                <div id="bankIfsc" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક IFSC કોડ (IFSC Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.bankIfsc}
                    onChange={e => handleFarmerDetailsChange('bankIfsc', e.target.value.toUpperCase())}
                    placeholder="e.g. BARB0GONDAL"
                    className={`w-full bg-slate-50 border ${errors.bankIfsc ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankIfsc && <p className="text-xs text-red-500 mt-0.5">{errors.bankIfsc}</p>}
                </div>

                {/* Bank Holder Name */}
                <div id="bankHolderName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ખાતાધારકનું નામ (Account Holder Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmerDetails.bankHolderName}
                    onChange={e => handleFarmerDetailsChange('bankHolderName', e.target.value.toUpperCase())}
                    placeholder="e.g. PATEL KHIMJI DEVRAJBHAI"
                    className={`w-full bg-slate-50 border ${errors.bankHolderName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankHolderName && <p className="text-xs text-red-500 mt-0.5">{errors.bankHolderName}</p>}
                </div>
              </div>
            </section>

            {/* 4. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૪. જમીનના દસ્તાવેજો અને પુરાવા (4. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ - આગળનો ભાગ (Aadhaar Card Front)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ આગળનો ભાગ"
                    document={farmerDocs.aadharCardFront}
                    onUpload={(doc) => setFarmerDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhaar Card Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ - પાછળનો ભાગ (Aadhaar Card Back)"
                    gujaratiLabel="ઓળખના પુરાવા તરીકે આધાર કાર્ડ પાછળનો ભાગ"
                    document={farmerDocs.aadharCardBack}
                    onUpload={(doc) => setFarmerDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="landDoc">
                  <DocumentUploader
                    label="જમીનના નકલ ઉતારા 7/12 અને 8-A (7/12 Land Copy)"
                    gujaratiLabel="સરકાર માન્ય જમીનનો સાતબાર નકશો"
                    document={farmerDocs.landDoc}
                    onUpload={(doc) => setFarmerDocs(prev => ({ ...prev, landDoc: doc }))}
                    required
                  />
                  {errors.landDoc && <p className="text-xs text-red-500 mt-1">{errors.landDoc}</p>}
                </div>

                <div id="bankPassbook">
                  <DocumentUploader
                    label="બેંક પાસબુક (Bank Passbook)"
                    gujaratiLabel="સબસિડી જમા મેળવવા માટે પાસબુક પ્રથમ પાનું"
                    document={farmerDocs.bankPassbook}
                    onUpload={(doc) => setFarmerDocs(prev => ({ ...prev, bankPassbook: doc }))}
                    required
                  />
                  {errors.bankPassbook && <p className="text-xs text-red-500 mt-1">{errors.bankPassbook}</p>}
                </div>

                <div id="casteCertificate">
                  <DocumentUploader
                    label="જાતિ પ્રમાણપત્ર - વૈકલ્પિક (Caste Certificate - Optional)"
                    gujaratiLabel="જો લાગુ પડતું હોય તો જ અપલોડ કરો"
                    document={farmerDocs.casteCertificate}
                    onUpload={(doc) => setFarmerDocs(prev => ({ ...prev, casteCertificate: doc }))}
                  />
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ================= CAST CERTIFICATE FORM FIELDS ================= */}
        {formType === 'CAST_CERTIFICATE' && (
          <div className="space-y-8">
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. લાભાર્થી અરજદારની વિગતો (1. Applicant Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.firstName}
                    onChange={e => handleCastDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ARJUN"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    મધ્યમ નામ / પિતાનું નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={castDetails.middleName}
                    onChange={e => handleCastDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESHBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name / Surname) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.lastName}
                    onChange={e => handleCastDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={castDetails.dob}
                      onChange={e => handleCastDetailsChange('dob', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-3.5 pr-10 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={castDetails.mobile}
                      onChange={e => handleCastDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={castDetails.email}
                      onChange={e => handleCastDetailsChange('email', e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={castDetails.gender}
                    onChange={e => handleCastDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>
              </div>

              {/* Purpose */}
              <div id="purpose" className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">
                  પ્રમાણપત્રનો હેતુ (Purpose of Certificate - e.g. government schemes benefits, educational admission, etc.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={castDetails.purpose}
                  onChange={e => handleCastDetailsChange('purpose', e.target.value)}
                  placeholder="e.g. સરકારી યોજનાના લાભો માટે (Government Schemes Benefits)"
                  className={`w-full bg-slate-50 border ${errors.purpose ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                />
                {errors.purpose && <p className="text-xs text-red-500 mt-0.5">{errors.purpose}</p>}
              </div>
            </section>

            {/* 2. Father Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૨. પિતાની વિગતો (2. Father Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Father First Name */}
                <div id="fatherFirstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાનું પ્રથમ નામ (Father First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.fatherFirstName}
                    onChange={e => handleCastDetailsChange('fatherFirstName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH"
                    className={`w-full bg-slate-50 border ${errors.fatherFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherFirstName}</p>}
                </div>

                {/* Father Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    પિતાનું મધ્યમ નામ (Father Middle Name)
                  </label>
                  <input
                    type="text"
                    value={castDetails.fatherMiddleName}
                    onChange={e => handleCastDetailsChange('fatherMiddleName', e.target.value.toUpperCase())}
                    placeholder="e.g. HIRALAL"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Father Last Name */}
                <div id="fatherLastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાની અટક (Father Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.fatherLastName}
                    onChange={e => handleCastDetailsChange('fatherLastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.fatherLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.fatherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherLastName}</p>}
                </div>
              </div>
            </section>

            {/* 3. Caste Category & Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-violet-600" /> ૩. જાતિ અને પેટા જાતિ વિગત (3. Caste Information)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Caste Category Select */}
                <div id="caste" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારની જાતિ કેટેગરી (Caste Category) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={castDetails.caste}
                    onChange={e => handleCastDetailsChange('caste', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.caste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">-- કેટેગરી પસંદ કરો (Select Category) --</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="OBC">OBC / SEBC (OBC)</option>
                    <option value="GENERAL">GENERAL</option>
                    <option value="OTHER">OTHER (અન્ય)</option>
                  </select>
                  {errors.caste && <p className="text-xs text-red-500 mt-0.5">{errors.caste}</p>}
                </div>

                {/* Sub-Caste */}
                <div id="subCaste" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારની પેટા-જાતિ (Sub Caste) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.subCaste}
                    onChange={e => handleCastDetailsChange('subCaste', e.target.value)}
                    placeholder="e.g. hindu-kadiya, Rohit, chamar, patel, etc."
                    className={`w-full bg-slate-50 border ${errors.subCaste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.subCaste && <p className="text-xs text-red-500 mt-0.5">{errors.subCaste}</p>}
                </div>

                {/* Father Caste */}
                <div id="fatherCaste" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાની જાતિ (Father Caste) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.fatherCaste}
                    onChange={e => handleCastDetailsChange('fatherCaste', e.target.value)}
                    placeholder="e.g. HINDU KADIYA / SC / OBC"
                    className={`w-full bg-slate-50 border ${errors.fatherCaste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.fatherCaste && <p className="text-xs text-red-500 mt-0.5">{errors.fatherCaste}</p>}
                </div>

                {/* Father Sub-Caste */}
                <div id="fatherSubCaste" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પિતાની પેટા-જાતિ (Father Sub Caste) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={castDetails.fatherSubCaste}
                    onChange={e => handleCastDetailsChange('fatherSubCaste', e.target.value)}
                    placeholder="e.g. hindu-kadiya, Rohit, chamar, etc."
                    className={`w-full bg-slate-50 border ${errors.fatherSubCaste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.fatherSubCaste && <p className="text-xs text-red-500 mt-0.5">{errors.fatherSubCaste}</p>}
                </div>
              </div>
            </section>

            {/* 4. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૪. દસ્તાવેજો અપલોડ કરો (4. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="rationCardFront">
                  <DocumentUploader
                    label="રેશન કાર્ડ - પ્રથમ પાનું (Ration Card First Page)"
                    gujaratiLabel="રેશન કાર્ડનું પ્રથમ/આગળનું પાનું"
                    document={castDocs.rationCardFront}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, rationCardFront: doc }))}
                    required
                  />
                  {errors.rationCardFront && <p className="text-xs text-red-500 mt-1">{errors.rationCardFront}</p>}
                </div>

                <div id="rationCardBack">
                  <DocumentUploader
                    label="રેશન કાર્ડ - પાછળનું પાનું (Ration Card Back Page)"
                    gujaratiLabel="રેશન કાર્ડનું પાછળનું પાનું"
                    document={castDocs.rationCardBack}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, rationCardBack: doc }))}
                    required
                  />
                  {errors.rationCardBack && <p className="text-xs text-red-500 mt-1">{errors.rationCardBack}</p>}
                </div>

                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={castDocs.aadharCardFront}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={castDocs.aadharCardBack}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Size Photo)"
                    gujaratiLabel="અરજદારનો તાજેતરનો પાસપોર્ટ ફોટો"
                    document={castDocs.passportPhoto}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>

                <div id="schoolLeaving">
                  <DocumentUploader
                    label="શાળા છોડ્યાનું પ્રમાણપત્ર (School Leaving Certificate)"
                    gujaratiLabel="અરજદારની એલ.સી (L.C.)"
                    document={castDocs.schoolLeaving}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, schoolLeaving: doc }))}
                    required
                  />
                  {errors.schoolLeaving && <p className="text-xs text-red-500 mt-1">{errors.schoolLeaving}</p>}
                </div>

                <div id="fatherSchoolLeaving">
                  <DocumentUploader
                    label="પિતાનું શાળા છોડ્યાનું પ્રમાણપત્ર (Father's School Leaving)"
                    gujaratiLabel="પિતાના શાળા છોડ્યાનું એલ.સી (Father's L.C.)"
                    document={castDocs.fatherSchoolLeaving}
                    onUpload={(doc) => setCastDocs(prev => ({ ...prev, fatherSchoolLeaving: doc }))}
                    required
                  />
                  {errors.fatherSchoolLeaving && <p className="text-xs text-red-500 mt-1">{errors.fatherSchoolLeaving}</p>}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= INCOME CERTIFICATE FORM FIELDS ================= */}
        {formType === 'INCOME_CERTIFICATE' && (
          <div className="space-y-8">
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. લાભાર્થી અરજદારની વિગતો (1. Applicant Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={incomeDetails.firstName}
                    onChange={e => handleIncomeDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ARJUN"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    મધ્યમ નામ / પિતાનું નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={incomeDetails.middleName}
                    onChange={e => handleIncomeDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESHBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name / Surname) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={incomeDetails.lastName}
                    onChange={e => handleIncomeDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={incomeDetails.dob}
                      onChange={e => handleIncomeDetailsChange('dob', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-3.5 pr-10 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={incomeDetails.mobile}
                      onChange={e => handleIncomeDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={incomeDetails.email}
                      onChange={e => handleIncomeDetailsChange('email', e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={incomeDetails.gender}
                    onChange={e => handleIncomeDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>

                {/* Ration Card Number */}
                <div id="rationCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    રેશનકાર્ડ નંબર (Ration Card Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={incomeDetails.rationCardNumber}
                    onChange={e => handleIncomeDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. 123456789012"
                    className={`w-full bg-slate-50 border ${errors.rationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.rationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardNumber}</p>}
                </div>

                {/* Ration Card Member ID */}
                <div id="rationCardMemberId" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    રેશનકાર્ડ સભ્ય આઈડી (Ration Card Member ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={incomeDetails.rationCardMemberId}
                    onChange={e => handleIncomeDetailsChange('rationCardMemberId', e.target.value)}
                    placeholder="e.g. 1"
                    className={`w-full bg-slate-50 border ${errors.rationCardMemberId ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.rationCardMemberId && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardMemberId}</p>}
                </div>
              </div>

              {/* Purpose */}
              <div id="purpose" className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">
                  આવક પ્રમાણપત્રનો હેતુ (Purpose of Certificate - e.g. educational scholarship, bank loan, subsidy, etc.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={incomeDetails.purpose}
                  onChange={e => handleIncomeDetailsChange('purpose', e.target.value)}
                  placeholder="e.g. શિષ્યવૃત્તિ અને શૈક્ષણિક સહાય માટે (Scholarship & Educational Aid)"
                  className={`w-full bg-slate-50 border ${errors.purpose ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2.5 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                />
                {errors.purpose && <p className="text-xs text-red-500 mt-0.5">{errors.purpose}</p>}
              </div>
            </section>

            {/* 2. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૨. આવકના પુરાવાઓ અને દસ્તાવેજો (2. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Size Photo)"
                    gujaratiLabel="અરજદારનો તાજેતરનો પાસપોર્ટ ફોટો"
                    document={incomeDocs.passportPhoto}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>

                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={incomeDocs.aadharCardFront}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={incomeDocs.aadharCardBack}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="electricityBill">
                  <DocumentUploader
                    label="છેલ્લું લાઇટ બિલ (Last Electricity Bill)"
                    gujaratiLabel="રહેઠાણના પુરાવા તરીકે છેલ્લું ભરેલ વીજળી બિલ"
                    document={incomeDocs.electricityBill}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, electricityBill: doc }))}
                    required
                  />
                  {errors.electricityBill && <p className="text-xs text-red-500 mt-1">{errors.electricityBill}</p>}
                </div>

                <div id="rationCardFront">
                  <DocumentUploader
                    label="રેશન કાર્ડ આગળનું પાનું (Ration Card Front)"
                    gujaratiLabel="રેશનકાર્ડનું વિગત દર્શાવતું મુખ્ય પાનું"
                    document={incomeDocs.rationCardFront}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, rationCardFront: doc }))}
                    required
                  />
                  {errors.rationCardFront && <p className="text-xs text-red-500 mt-1">{errors.rationCardFront}</p>}
                </div>

                <div id="rationCardBack">
                  <DocumentUploader
                    label="રેશન કાર્ડ પાછળનું પાનું (Ration Card Back)"
                    gujaratiLabel="રેશનકાર્ડના સભ્યોની વિગત દર્શાવતું પાછળનું પાનું"
                    document={incomeDocs.rationCardBack}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, rationCardBack: doc }))}
                    required
                  />
                  {errors.rationCardBack && <p className="text-xs text-red-500 mt-1">{errors.rationCardBack}</p>}
                </div>

                <div id="otherDoc">
                  <DocumentUploader
                    label="અન્ય દસ્તાવેજ - વૈકલ્પિક (Any Other Document - Voter/PAN)"
                    gujaratiLabel="વૈકલ્પિક: ચૂંટણી કાર્ડ અથવા પાન કાર્ડ"
                    document={incomeDocs.otherDoc}
                    onUpload={(doc) => setIncomeDocs(prev => ({ ...prev, otherDoc: doc }))}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= AYUSHYMAN BHARAT CARD FORM FIELDS ================= */}
        {formType === 'AYUSHYMAN_CARD' && (
          <div className="space-y-8">
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. આયુષ્માન કાર્ડ અરજદારની વિગતો (1. Applicant Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ayushmanDetails.firstName}
                    onChange={e => handleAyushmanDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ARJUN"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    મધ્યમ નામ / પિતાનું નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={ayushmanDetails.middleName}
                    onChange={e => handleAyushmanDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESHBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name / Surname) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ayushmanDetails.lastName}
                    onChange={e => handleAyushmanDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={ayushmanDetails.dob}
                      onChange={e => handleAyushmanDetailsChange('dob', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-3.5 pr-10 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={ayushmanDetails.mobile}
                      onChange={e => handleAyushmanDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={ayushmanDetails.email}
                      onChange={e => handleAyushmanDetailsChange('email', e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ayushmanDetails.gender}
                    onChange={e => handleAyushmanDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>

                {/* Ration Card Number */}
                <div id="rationCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    રેશનકાર્ડ નંબર (Ration Card Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ayushmanDetails.rationCardNumber}
                    onChange={e => handleAyushmanDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. 123456789012"
                    className={`w-full bg-slate-50 border ${errors.rationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.rationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardNumber}</p>}
                </div>

                {/* Aadhaar Card Number */}
                <div id="aadharCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    આધાર કાર્ડ નંબર (Aadhaar Card Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={ayushmanDetails.aadharCardNumber}
                      onChange={e => handleAyushmanDetailsChange('aadharCardNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123412341234"
                      className={`w-full bg-slate-50 border ${errors.aadharCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.aadharCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.aadharCardNumber}</p>}
                </div>
              </div>
            </section>

            {/* 2. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૨. આયુષ્માન કાર્ડ મેળવવા માટેના દસ્તાવેજો (2. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={ayushmanDocs.aadharCardFront}
                    onUpload={(doc) => setAyushmanDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={ayushmanDocs.aadharCardBack}
                    onUpload={(doc) => setAyushmanDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="rationCardFront">
                  <DocumentUploader
                    label="રેશન કાર્ડ - પ્રથમ પાનું (Ration Card First Page)"
                    gujaratiLabel="રેશન કાર્ડનું પ્રથમ/આગળનું પાનું"
                    document={ayushmanDocs.rationCardFront}
                    onUpload={(doc) => setAyushmanDocs(prev => ({ ...prev, rationCardFront: doc }))}
                    required
                  />
                  {errors.rationCardFront && <p className="text-xs text-red-500 mt-1">{errors.rationCardFront}</p>}
                </div>

                <div id="rationCardBack">
                  <DocumentUploader
                    label="રેશન કાર્ડ - પાછળનું પાનું (Ration Card Back Page)"
                    gujaratiLabel="રેશન કાર્ડનું પાછળનું પાનું"
                    document={ayushmanDocs.rationCardBack}
                    onUpload={(doc) => setAyushmanDocs(prev => ({ ...prev, rationCardBack: doc }))}
                    required
                  />
                  {errors.rationCardBack && <p className="text-xs text-red-500 mt-1">{errors.rationCardBack}</p>}
                </div>

                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="અરજદારનો તાજેતરનો પાસપોર્ટ ફોટો"
                    document={ayushmanDocs.passportPhoto}
                    onUpload={(doc) => setAyushmanDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= ABHA HEALTH CARD FORM FIELDS ================= */}
        {formType === 'AABHA_CARD' && (
          <div className="space-y-8">
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. લાભાર્થીની વિગતો (1. Applicant Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={aabhaDetails.firstName}
                    onChange={e => handleAabhaDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ARJUN"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-sans">
                    મધ્યમ નામ / પિતાનું નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={aabhaDetails.middleName}
                    onChange={e => handleAabhaDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESHBHAI"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અટક (Last Name / Surname) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={aabhaDetails.lastName}
                    onChange={e => handleAabhaDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={aabhaDetails.dob}
                      onChange={e => handleAabhaDetailsChange('dob', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-3.5 pr-10 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={aabhaDetails.mobile}
                      onChange={e => handleAabhaDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={aabhaDetails.email}
                      onChange={e => handleAabhaDetailsChange('email', e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={aabhaDetails.gender}
                    onChange={e => handleAabhaDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>

                {/* Aadhaar Card Number */}
                <div id="aadharCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    આધાર કાર્ડ નંબર (Aadhaar Card Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={aabhaDetails.aadharCardNumber}
                      onChange={e => handleAabhaDetailsChange('aadharCardNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123412341234"
                      className={`w-full bg-slate-50 border ${errors.aadharCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.aadharCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.aadharCardNumber}</p>}
                </div>
              </div>
            </section>

            {/* 2. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૨. આભા હેલ્થ કાર્ડ મેળવવા માટેના દસ્તાવેજો (2. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={aabhaDocs.aadharCardFront}
                    onUpload={(doc) => setAabhaDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={aabhaDocs.aadharCardBack}
                    onUpload={(doc) => setAabhaDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="અરજદારનો તાજેતરનો પાસપોર્ટ ફોટો"
                    document={aabhaDocs.passportPhoto}
                    onUpload={(doc) => setAabhaDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= UDHYAM AADHAR (MSME) FORM FIELDS ================= */}
        {formType === 'UDHYAM_AADHAR' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Applicant & Business Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. અરજદાર અને વ્યવસાયની વિગતો (1. Applicant & Business Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારનું પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.firstName}
                    onChange={e => handleUdhyamDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.middleName}
                    onChange={e => handleUdhyamDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. HIRALAL"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારની અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.lastName}
                    onChange={e => handleUdhyamDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      value={udhyamDetails.mobile}
                      onChange={e => handleUdhyamDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email Address */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={udhyamDetails.email}
                      onChange={e => handleUdhyamDetailsChange('email', e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={udhyamDetails.gender}
                    onChange={e => handleUdhyamDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>

                {/* Business Name */}
                <div id="businessName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    વ્યવસાયનું નામ (Business Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.businessName}
                    onChange={e => handleUdhyamDetailsChange('businessName', e.target.value.toUpperCase())}
                    placeholder="e.g. DAY INFOTECH"
                    className={`w-full bg-slate-50 border ${errors.businessName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.businessName && <p className="text-xs text-red-500 mt-0.5">{errors.businessName}</p>}
                </div>

                {/* Business Category */}
                <div id="businessCategory" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    વ્યવસાયની શ્રેણી (Business Category) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={udhyamDetails.businessCategory}
                    onChange={e => handleUdhyamDetailsChange('businessCategory', e.target.value as any)}
                    className={`w-full bg-slate-50 border ${errors.businessCategory ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">-- પસંદ કરો (Select) --</option>
                    <option value="SERVICE">Service (સેવા)</option>
                    <option value="TRADING">Trading (વેપાર)</option>
                  </select>
                  {errors.businessCategory && <p className="text-xs text-red-500 mt-0.5">{errors.businessCategory}</p>}
                </div>

                {/* Applicant Aadhar Number */}
                <div id="aadharCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારનો આધાર નંબર (Applicant Aadhar Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={udhyamDetails.aadharCardNumber}
                      onChange={e => handleUdhyamDetailsChange('aadharCardNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123412341234"
                      className={`w-full bg-slate-50 border ${errors.aadharCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.aadharCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.aadharCardNumber}</p>}
                </div>

                {/* Applicant Pancard Number */}
                <div id="panCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારનો પાનકાર્ડ નંબર (Applicant Pancard Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={udhyamDetails.panCardNumber}
                    onChange={e => handleUdhyamDetailsChange('panCardNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className={`w-full bg-slate-50 border ${errors.panCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.panCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.panCardNumber}</p>}
                </div>
              </div>
            </section>

            {/* 2. Applicant Bank Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Landmark className="h-4.5 w-4.5 text-emerald-600" /> ૨. અરજદારની બેંક વિગતો (2. Applicant Bank Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Number */}
                <div id="bankAccountNum" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક ખાતા નંબર (Account Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.bankAccountNum}
                    onChange={e => handleUdhyamDetailsChange('bankAccountNum', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 100012345678"
                    className={`w-full bg-slate-50 border ${errors.bankAccountNum ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.bankAccountNum && <p className="text-xs text-red-500 mt-0.5">{errors.bankAccountNum}</p>}
                </div>

                {/* IFSC Code */}
                <div id="bankIfsc" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    બેંક IFSC કોડ (IFSC Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={udhyamDetails.bankIfsc}
                    onChange={e => handleUdhyamDetailsChange('bankIfsc', e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001234"
                    className={`w-full bg-slate-50 border ${errors.bankIfsc ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankIfsc && <p className="text-xs text-red-500 mt-0.5">{errors.bankIfsc}</p>}
                </div>

                {/* Account Holder Name */}
                <div id="bankHolderName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ખાતાધારકનું નામ (Account Holder Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={udhyamDetails.bankHolderName}
                    onChange={e => handleUdhyamDetailsChange('bankHolderName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH HIRALAL PARMAR"
                    className={`w-full bg-slate-50 border ${errors.bankHolderName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.bankHolderName && <p className="text-xs text-red-500 mt-0.5">{errors.bankHolderName}</p>}
                </div>
              </div>
            </section>

            {/* 3. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> ૩. ઉદ્યમ આધાર માટેના દસ્તાવેજો (3. Upload Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhar Card Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={udhyamDocs.aadharCardFront}
                    onUpload={(doc) => setUdhyamDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhar Card Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={udhyamDocs.aadharCardBack}
                    onUpload={(doc) => setUdhyamDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                {/* Pan Card */}
                <div id="panCard">
                  <DocumentUploader
                    label="પાનકાર્ડ (PAN Card)"
                    gujaratiLabel="અરજદારના પાનકાર્ડની નકલ"
                    document={udhyamDocs.panCard}
                    onUpload={(doc) => setUdhyamDocs(prev => ({ ...prev, panCard: doc }))}
                    required
                  />
                  {errors.panCard && <p className="text-xs text-red-500 mt-1">{errors.panCard}</p>}
                </div>

                {/* Bank Passbook */}
                <div id="bankPassbook">
                  <DocumentUploader
                    label="બેંક પાસબુક (Bank Passbook / Cancelled Cheque)"
                    gujaratiLabel="બેંક પાસબુક અથવા રદ કરેલ ચેકની નકલ"
                    document={udhyamDocs.bankPassbook}
                    onUpload={(doc) => setUdhyamDocs(prev => ({ ...prev, bankPassbook: doc }))}
                    required
                  />
                  {errors.bankPassbook && <p className="text-xs text-red-500 mt-1">{errors.bankPassbook}</p>}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= MANAV KALYAN YOJNA FORM FIELDS ================= */}
        {formType === 'MANAV_KALYAN' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Applicant Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-600" /> ૧. અરજદારની અંગત વિગતો (1. Applicant Personal Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div id="firstName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારનું પ્રથમ નામ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manavDetails.firstName}
                    onChange={e => handleManavDetailsChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. RAMESH"
                    className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મધ્યમ નામ (Middle Name)
                  </label>
                  <input
                    type="text"
                    value={manavDetails.middleName}
                    onChange={e => handleManavDetailsChange('middleName', e.target.value.toUpperCase())}
                    placeholder="e.g. HIRALAL"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    અરજદારની અટક (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manavDetails.lastName}
                    onChange={e => handleManavDetailsChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. PARMAR"
                    className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all uppercase`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>

                {/* Mobile Number */}
                <div id="mobile" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    મોબાઇલ નંબર (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      value={manavDetails.mobile}
                      onChange={e => handleManavDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Email Address */}
                <div id="email" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઇમેઇલ એડ્રેસ (Email Address)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={manavDetails.email}
                      onChange={e => handleManavDetailsChange('email', e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div id="gender" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manavDetails.gender}
                    onChange={e => handleManavDetailsChange('gender', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">પસંદ કરો (Select)</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div id="dob" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જન્મતારીખ (Date of Birth) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={manavDetails.dob}
                      onChange={e => handleManavDetailsChange('dob', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 pl-10 pr-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                </div>

                {/* Caste Category Select */}
                <div id="caste" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    જ્ઞાતિ / જાતિ (Caste Category) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manavDetails.caste}
                    onChange={e => handleManavDetailsChange('caste', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.caste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">-- પસંદ કરો --</option>
                    <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                    <option value="ST">ST (અનુસૂચિત જનજાતિ)</option>
                    <option value="GENERAL">GENERAL (સામાન્ય)</option>
                    <option value="OTHER">OTHER (અન્ય)</option>
                  </select>
                  {errors.caste && <p className="text-xs text-red-500 mt-0.5">{errors.caste}</p>}
                </div>

                {/* Scheme Select */}
                <div id="scheme" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    યોજના વ્યવસાય પ્રકાર (Scheme / Trade) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manavDetails.scheme}
                    onChange={e => handleManavDetailsChange('scheme', e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.scheme ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  >
                    <option value="">-- પસંદ કરો (Draw system thi labh madse) --</option>
                    <option value="dudh dahi vechnar">દૂધ દહીં વેચનાર (Dudh Dahi Seller)</option>
                    <option value="bharatkam">ભરતકામ (Embroidery / Bharatkam)</option>
                    <option value="beauty parlor">બ્યુટી પાર્લર (Beauty Parlor)</option>
                    <option value="papad banavat">પાપડ બનાવટ (Papad Making)</option>
                    <option value="vahan Services and repairing">વાહન સર્વિસ અને રિપેરિંગ (Vehicle Services & Repairing)</option>
                    <option value="plumber">પ્લમ્બર (Plumber)</option>
                    <option value="senting kam">સેન્ટિંગ કામ (Senting Kam)</option>
                    <option value="electrical implosion and repairing">ઇલેક્ટ્રિકલ વાયરિંગ અને રિપેરિંગ (Electrical Wiring & Repairing)</option>
                    <option value="athana banavat">અથાણાં બનાવટ (Pickle / Athana Making)</option>
                    <option value="puncher kit">પંચર કીટ (Puncture Kit)</option>
                  </select>
                  {errors.scheme && <p className="text-xs text-red-500 mt-0.5">{errors.scheme}</p>}
                </div>
              </div>
            </section>

            {/* 2. Identity Cards */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <CreditCard className="h-4.5 w-4.5 text-emerald-600" /> ૨. ઓળખપત્ર અને કાર્ડ વિગતો (2. Identity & Card Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Aadhaar Number */}
                <div id="aadharCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    આધાર કાર્ડ નંબર (Aadhaar Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={manavDetails.aadharCardNumber}
                    onChange={e => handleManavDetailsChange('aadharCardNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123412341234"
                    className={`w-full bg-slate-50 border ${errors.aadharCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.aadharCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.aadharCardNumber}</p>}
                </div>

                {/* Ration Card Number */}
                <div id="rationCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    રેશન કાર્ડ નંબર (Ration Card Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manavDetails.rationCardNumber}
                    onChange={e => handleManavDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. RATION123456"
                    className={`w-full bg-slate-50 border ${errors.rationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.rationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardNumber}</p>}
                </div>

                {/* Ration Card Member ID */}
                <div id="rationCardMemberId" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    રેશન કાર્ડ સભ્ય આઈડી (Ration Card Member ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manavDetails.rationCardMemberId}
                    onChange={e => handleManavDetailsChange('rationCardMemberId', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 01"
                    className={`w-full bg-slate-50 border ${errors.rationCardMemberId ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.rationCardMemberId && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardMemberId}</p>}
                </div>

                {/* EShram Number */}
                <div id="eshramCardNumber" className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    ઈ-શ્રમ કાર્ડ નંબર (EShram Card Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manavDetails.eshramCardNumber}
                    onChange={e => handleManavDetailsChange('eshramCardNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. UAN12345678"
                    className={`w-full bg-slate-50 border ${errors.eshramCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden focus:ring-4 transition-all`}
                  />
                  {errors.eshramCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.eshramCardNumber}</p>}
                </div>
              </div>
            </section>

            {/* 3. Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> ૩. દસ્તાવેજો અપલોડ (3. Upload Required Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhar Front */}
                <div id="aadharCardFront">
                  <DocumentUploader
                    label="આધાર કાર્ડ આગળ (Aadhar Card Front)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો આગળનો ભાગ"
                    document={manavDocs.aadharCardFront}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                    required
                  />
                  {errors.aadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.aadharCardFront}</p>}
                </div>

                {/* Aadhar Back */}
                <div id="aadharCardBack">
                  <DocumentUploader
                    label="આધાર કાર્ડ પાછળ (Aadhar Card Back)"
                    gujaratiLabel="અરજદારના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={manavDocs.aadharCardBack}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                    required
                  />
                  {errors.aadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.aadharCardBack}</p>}
                </div>

                {/* EShram Front */}
                <div id="eshramCardFront">
                  <DocumentUploader
                    label="ઈ-શ્રમ કાર્ડ આગળ (EShram Card Front)"
                    gujaratiLabel="અરજદારના ઈ-શ્રમ કાર્ડનો આગળનો ભાગ"
                    document={manavDocs.eshramCardFront}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, eshramCardFront: doc }))}
                    required
                  />
                  {errors.eshramCardFront && <p className="text-xs text-red-500 mt-1">{errors.eshramCardFront}</p>}
                </div>

                {/* EShram Back */}
                <div id="eshramCardBack">
                  <DocumentUploader
                    label="ઈ-શ્રમ કાર્ડ પાછળ (EShram Card Back)"
                    gujaratiLabel="અરજદારના ઈ-શ્રમ કાર્ડનો પાછળનો ભાગ"
                    document={manavDocs.eshramCardBack}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, eshramCardBack: doc }))}
                    required
                  />
                  {errors.eshramCardBack && <p className="text-xs text-red-500 mt-1">{errors.eshramCardBack}</p>}
                </div>

                {/* Ration Card Front */}
                <div id="rationCardFront">
                  <DocumentUploader
                    label="રેશન કાર્ડ આગળ (Ration Card Front)"
                    gujaratiLabel="રેશન કાર્ડનો ફોટો આગળનો ભાગ"
                    document={manavDocs.rationCardFront}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, rationCardFront: doc }))}
                    required
                  />
                  {errors.rationCardFront && <p className="text-xs text-red-500 mt-1">{errors.rationCardFront}</p>}
                </div>

                {/* Ration Card Back */}
                <div id="rationCardBack">
                  <DocumentUploader
                    label="રેશન કાર્ડ પાછળ (Ration Card Back)"
                    gujaratiLabel="રેશન કાર્ડનો ફોટો પાછળનો ભાગ"
                    document={manavDocs.rationCardBack}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, rationCardBack: doc }))}
                    required
                  />
                  {errors.rationCardBack && <p className="text-xs text-red-500 mt-1">{errors.rationCardBack}</p>}
                </div>

                {/* Caste Cert */}
                <div id="casteCertificate">
                  <DocumentUploader
                    label="જાતિ પ્રમાણપત્ર (Caste Certificate)"
                    gujaratiLabel="સક્ષમ અધિકારી દ્વારા આપેલું જાતિનું પ્રમાણપત્ર"
                    document={manavDocs.casteCertificate}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, casteCertificate: doc }))}
                    required
                  />
                  {errors.casteCertificate && <p className="text-xs text-red-500 mt-1">{errors.casteCertificate}</p>}
                </div>

                {/* Income Cert */}
                <div id="incomeCertificate">
                  <DocumentUploader
                    label="આવક પ્રમાણપત્ર (Income Certificate)"
                    gujaratiLabel="વાર્ષિક આવક દર્શાવતું પ્રમાણપત્ર"
                    document={manavDocs.incomeCertificate}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, incomeCertificate: doc }))}
                    required
                  />
                  {errors.incomeCertificate && <p className="text-xs text-red-500 mt-1">{errors.incomeCertificate}</p>}
                </div>

                {/* Signature */}
                <div id="signature">
                  <DocumentUploader
                    label="અરજદારની સહી (Signature Photo)"
                    gujaratiLabel="અરજદારની સહી અથવા અંગૂઠાનું નિશાન"
                    document={manavDocs.signature}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, signature: doc }))}
                    required
                  />
                  {errors.signature && <p className="text-xs text-red-500 mt-1">{errors.signature}</p>}
                </div>

                {/* Passport Photo */}
                <div id="passportPhoto">
                  <DocumentUploader
                    label="પાસપોર્ટ સાઇઝ ફોટો (Passport Photo)"
                    gujaratiLabel="તાજેતરનો પાસપોર્ટ સાઇઝ કલર ફોટો"
                    document={manavDocs.passportPhoto}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, passportPhoto: doc }))}
                    required
                  />
                  {errors.passportPhoto && <p className="text-xs text-red-500 mt-1">{errors.passportPhoto}</p>}
                </div>

                {/* Self Declaration (Owner Uploaded) */}
                <div id="selfDeclaration">
                  <DocumentUploader
                    label="સ્વ-ઘોષણાપત્ર (Self Declaration Form)"
                    gujaratiLabel="સેલ્ફ ડેકલેરેશન ફોર્મ (દુકાન માલિક દ્વારા અપલોડ કરવામાં આવશે)"
                    document={manavDocs.selfDeclaration}
                    onUpload={(doc) => setManavDocs(prev => ({ ...prev, selfDeclaration: doc }))}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= KUVAR BAI MAMERU YOJANA FORM FIELDS ================= */}
        {formType === 'KUVAR_BAI_MAMERU' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Kanya (Bride) and Family Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૧. કન્યા અને કૌટુંબિક વિગતો (1. Bride & Family Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              {/* Bride Name */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">કન્યાની અંગત વિગતો (Bride's Name & DOB)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="kanyaFirstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાનું પ્રથમ નામ (Bride First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaFirstName}
                      onChange={e => handleKuvarDetailsChange('kanyaFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. DAKSHA"
                      className={`w-full bg-white border ${errors.kanyaFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.kanyaFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાનું મધ્યમ નામ (Bride Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaMiddleName}
                      onChange={e => handleKuvarDetailsChange('kanyaMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. ARJANBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="kanyaLastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાની અટક (Bride Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaLastName}
                      onChange={e => handleKuvarDetailsChange('kanyaLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. CHAVDA"
                      className={`w-full bg-white border ${errors.kanyaLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.kanyaLastName && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaLastName}</p>}
                  </div>

                  <div id="kanyaDob" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાની જન્મતારીખ (Bride DOB) <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={kuvarDetails.kanyaDob}
                      onChange={e => handleKuvarDetailsChange('kanyaDob', e.target.value)}
                      className={`w-full bg-white border ${errors.kanyaDob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.kanyaDob && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaDob}</p>}
                  </div>

                  <div id="kanyaCaste" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાની જાતિ (Bride Caste Category) <span className="text-red-500">*</span></label>
                    <select
                      value={kuvarDetails.kanyaCaste}
                      onChange={e => handleKuvarDetailsChange('kanyaCaste', e.target.value)}
                      className={`w-full bg-white border ${errors.kanyaCaste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">-- પસંદ કરો --</option>
                      <option value="OBC">OBC (બક્ષીપંચ)</option>
                      <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                      <option value="ST">ST (અનુસૂચિત જનજાતિ)</option>
                      <option value="GENERAL">GENERAL (સામાન્ય)</option>
                      <option value="OTHER">OTHER (અન્ય)</option>
                    </select>
                    {errors.kanyaCaste && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaCaste}</p>}
                  </div>

                  <div id="kanyaPitaIncome" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાની વાર્ષિક આવક (Father's Annual Income) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPitaIncome}
                      onChange={e => handleKuvarDetailsChange('kanyaPitaIncome', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 120000"
                      className={`w-full bg-white border ${errors.kanyaPitaIncome ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.kanyaPitaIncome && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaPitaIncome}</p>}
                  </div>

                  <div id="gender" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kuvarDetails.gender}
                      onChange={e => handleKuvarDetailsChange('gender', e.target.value)}
                      className={`w-full bg-white border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="MALE">પુરુષ (Male)</option>
                      <option value="FEMALE">સ્ત્રી (Female)</option>
                      <option value="OTHER">અન્ય (Other)</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                  </div>
                </div>
              </div>

              {/* Bride's Parents Names */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">કન્યાના માતા-પિતાના નામ (Bride's Father & Mother Names)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Father's Name */}
                  <div id="kanyaPitaFirstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું નામ (Father First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPitaFirstName}
                      onChange={e => handleKuvarDetailsChange('kanyaPitaFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. ARJANBHAI"
                      className={`w-full bg-white border ${errors.kanyaPitaFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.kanyaPitaFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaPitaFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું મધ્યમ નામ (Father Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPitaMiddleName}
                      onChange={e => handleKuvarDetailsChange('kanyaPitaMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. HARIBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="kanyaPitaLastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાની અટક (Father Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPitaLastName}
                      onChange={e => handleKuvarDetailsChange('kanyaPitaLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. CHAVDA"
                      className={`w-full bg-white border ${errors.kanyaPitaLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.kanyaPitaLastName && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaPitaLastName}</p>}
                  </div>

                  {/* Mother's Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું નામ (Mother First Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaMataFirstName}
                      onChange={e => handleKuvarDetailsChange('kanyaMataFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. SHARDABEN"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું મધ્યમ નામ (Mother Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaMataMiddleName}
                      onChange={e => handleKuvarDetailsChange('kanyaMataMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. ARJANBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાની અટક (Mother Last Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaMataLastName}
                      onChange={e => handleKuvarDetailsChange('kanyaMataLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. CHAVDA"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Bride Family Cards */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">કન્યાના પરિવારના દસ્તાવેજ નંબરો (Bride Family ID Numbers)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div id="kanyaRationCardNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાનું રેશન કાર્ડ નંબર (Bride Ration Card Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaRationCardNumber}
                      onChange={e => handleKuvarDetailsChange('kanyaRationCardNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 523412341234"
                      className={`w-full bg-white border ${errors.kanyaRationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.kanyaRationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaRationCardNumber}</p>}
                  </div>
                  <div id="kanyaPitaAadharNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કન્યાના પિતાનો આધાર નંબર (Father's Aadhar Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      maxLength={12}
                      value={kuvarDetails.kanyaPitaAadharNumber}
                      onChange={e => handleKuvarDetailsChange('kanyaPitaAadharNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456789012"
                      className={`w-full bg-white border ${errors.kanyaPitaAadharNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden font-mono`}
                    />
                    {errors.kanyaPitaAadharNumber && <p className="text-xs text-red-500 mt-0.5">{errors.kanyaPitaAadharNumber}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Groom (Husband) and Marriage Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૨. વરરાજા (પતિ) અને લગ્નની વિગતો (2. Groom & Marriage Details)
                </h3>
              </div>

              {/* Groom Name & DOB */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">વરરાજાની અંગત વિગતો (Groom's Name, DOB & Caste)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાનું પ્રથમ નામ (Groom First Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPatiFirstName}
                      onChange={e => handleKuvarDetailsChange('kanyaPatiFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAJESH"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાનું મધ્યમ નામ (Groom Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPatiMiddleName}
                      onChange={e => handleKuvarDetailsChange('kanyaPatiMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. KANJIBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાની અટક (Groom Last Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.kanyaPatiLastName}
                      onChange={e => handleKuvarDetailsChange('kanyaPatiLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PARMAR"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>

                  <div id="yuvakDob" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાની જન્મતારીખ (Groom DOB) <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={kuvarDetails.yuvakDob}
                      onChange={e => handleKuvarDetailsChange('yuvakDob', e.target.value)}
                      className={`w-full bg-white border ${errors.yuvakDob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.yuvakDob && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakDob}</p>}
                  </div>

                  <div id="yuvakCaste" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાની જાતિ (Groom Caste Category) <span className="text-red-500">*</span></label>
                    <select
                      value={kuvarDetails.yuvakCaste}
                      onChange={e => handleKuvarDetailsChange('yuvakCaste', e.target.value)}
                      className={`w-full bg-white border ${errors.yuvakCaste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">-- પસંદ કરો --</option>
                      <option value="OBC">OBC (બક્ષીપંચ)</option>
                      <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                      <option value="ST">ST (અનુસૂચિત જનજાતિ)</option>
                      <option value="GENERAL">GENERAL (સામાન્ય)</option>
                      <option value="OTHER">OTHER (અન્ય)</option>
                    </select>
                    {errors.yuvakCaste && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakCaste}</p>}
                  </div>

                  <div id="marriageDate" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">લગ્નની તારીખ (Marriage Date) <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={kuvarDetails.marriageDate}
                      onChange={e => handleKuvarDetailsChange('marriageDate', e.target.value)}
                      className={`w-full bg-white border ${errors.marriageDate ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.marriageDate && <p className="text-xs text-red-500 mt-0.5">{errors.marriageDate}</p>}
                  </div>
                </div>
              </div>

              {/* Groom's Parents Names */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">વરરાજાના માતા-પિતાના નામ (Groom's Father & Mother Names)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="yuvakPitaFirstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું પ્રથમ નામ (Father First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakPitaFirstName}
                      onChange={e => handleKuvarDetailsChange('yuvakPitaFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. KANJIBHAI"
                      className={`w-full bg-white border ${errors.yuvakPitaFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.yuvakPitaFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakPitaFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું મધ્યમ નામ (Father Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakPitaMiddleName}
                      onChange={e => handleKuvarDetailsChange('yuvakPitaMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. DEVABHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="yuvakPitaLastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાની અટક (Father Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakPitaLastName}
                      onChange={e => handleKuvarDetailsChange('yuvakPitaLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PARMAR"
                      className={`w-full bg-white border ${errors.yuvakPitaLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.yuvakPitaLastName && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakPitaLastName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું નામ (Mother First Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakMataFirstName}
                      onChange={e => handleKuvarDetailsChange('yuvakMataFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. REKHABEN"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું મધ્યમ નામ (Mother Middle Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakMataMiddleName}
                      onChange={e => handleKuvarDetailsChange('yuvakMataMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. KANJIBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાની અટક (Mother Last Name)</label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakMataLastName}
                      onChange={e => handleKuvarDetailsChange('yuvakMataLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PARMAR"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Groom Family Cards */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">વરરાજાના પરિવારના દસ્તાવેજ નંબરો (Groom Family ID Numbers)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div id="yuvakRationCardNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાનું રેશન કાર્ડ નંબર (Groom Ration Card Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={kuvarDetails.yuvakRationCardNumber}
                      onChange={e => handleKuvarDetailsChange('yuvakRationCardNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 523412344567"
                      className={`w-full bg-white border ${errors.yuvakRationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.yuvakRationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakRationCardNumber}</p>}
                  </div>
                  <div id="yuvakPitaAadharNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">વરરાજાના પિતાનો આધાર નંબર (Groom's Father's Aadhar Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      maxLength={12}
                      value={kuvarDetails.yuvakPitaAadharNumber}
                      onChange={e => handleKuvarDetailsChange('yuvakPitaAadharNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 987654321012"
                      className={`w-full bg-white border ${errors.yuvakPitaAadharNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden font-mono`}
                    />
                    {errors.yuvakPitaAadharNumber && <p className="text-xs text-red-500 mt-0.5">{errors.yuvakPitaAadharNumber}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Required Documents Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> ૩. જરૂરી દસ્તાવેજો અપલોડ (3. Required Documents Upload)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kanya Photo */}
                <div id="kanyaPassportPhoto">
                  <DocumentUploader
                    label="કન્યાનો પાસપોર્ટ સાઇઝ ફોટો (Bride Passport Photo)"
                    gujaratiLabel="તાજેતરનો પાસપોર્ટ સાઇઝ કલર ફોટો"
                    document={kuvarDocs.kanyaPassportPhoto}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaPassportPhoto: doc }))}
                    required
                  />
                  {errors.kanyaPassportPhoto && <p className="text-xs text-red-500 mt-1">{errors.kanyaPassportPhoto}</p>}
                </div>

                {/* Yuvak Photo */}
                <div id="yuvakPassportPhoto">
                  <DocumentUploader
                    label="વરરાજાનો પાસપોર્ટ સાઇઝ ફોટો (Groom Passport Photo)"
                    gujaratiLabel="તાજેતરનો પાસપોર્ટ સાઇઝ કલર ફોટો"
                    document={kuvarDocs.yuvakPassportPhoto}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, yuvakPassportPhoto: doc }))}
                    required
                  />
                  {errors.yuvakPassportPhoto && <p className="text-xs text-red-500 mt-1">{errors.yuvakPassportPhoto}</p>}
                </div>

                {/* Kanya Aadhar Front */}
                <div id="kanyaAadharCardFront">
                  <DocumentUploader
                    label="કન્યા આધાર કાર્ડ આગળ (Bride Aadhar Front)"
                    gujaratiLabel="કન્યાના આધાર કાર્ડનો આગળનો ભાગ"
                    document={kuvarDocs.kanyaAadharCardFront}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaAadharCardFront: doc }))}
                    required
                  />
                  {errors.kanyaAadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.kanyaAadharCardFront}</p>}
                </div>

                {/* Kanya Aadhar Back */}
                <div id="kanyaAadharCardBack">
                  <DocumentUploader
                    label="કન્યા આધાર કાર્ડ પાછળ (Bride Aadhar Back)"
                    gujaratiLabel="કન્યાના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={kuvarDocs.kanyaAadharCardBack}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaAadharCardBack: doc }))}
                    required
                  />
                  {errors.kanyaAadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.kanyaAadharCardBack}</p>}
                </div>

                {/* Yuvak Aadhar Front */}
                <div id="yuvakAadharCardFront">
                  <DocumentUploader
                    label="વરરાજા આધાર કાર્ડ આગળ (Groom Aadhar Front)"
                    gujaratiLabel="વરરાજાના આધાર કાર્ડનો આગળનો ભાગ"
                    document={kuvarDocs.yuvakAadharCardFront}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, yuvakAadharCardFront: doc }))}
                    required
                  />
                  {errors.yuvakAadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.yuvakAadharCardFront}</p>}
                </div>

                {/* Yuvak Aadhar Back */}
                <div id="yuvakAadharCardBack">
                  <DocumentUploader
                    label="વરરાજા આધાર કાર્ડ પાછળ (Groom Aadhar Back)"
                    gujaratiLabel="વરરાજાના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={kuvarDocs.yuvakAadharCardBack}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, yuvakAadharCardBack: doc }))}
                    required
                  />
                  {errors.yuvakAadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.yuvakAadharCardBack}</p>}
                </div>

                {/* Kanya Pita Aadhar Front */}
                <div id="kanyaPitaAadharCardFront">
                  <DocumentUploader
                    label="કન્યાના પિતા આધાર આગળ (Bride Father Aadhar Front)"
                    gujaratiLabel="કન્યાના પિતાના આધાર કાર્ડનો આગળનો ભાગ"
                    document={kuvarDocs.kanyaPitaAadharCardFront}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaPitaAadharCardFront: doc }))}
                    required
                  />
                  {errors.kanyaPitaAadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.kanyaPitaAadharCardFront}</p>}
                </div>

                {/* Kanya Pita Aadhar Back */}
                <div id="kanyaPitaAadharCardBack">
                  <DocumentUploader
                    label="કન્યાના પિતા આધાર પાછળ (Bride Father Aadhar Back)"
                    gujaratiLabel="કન્યાના પિતાના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={kuvarDocs.kanyaPitaAadharCardBack}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaPitaAadharCardBack: doc }))}
                    required
                  />
                  {errors.kanyaPitaAadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.kanyaPitaAadharCardBack}</p>}
                </div>

                {/* Yuvak Pita Aadhar Front */}
                <div id="yuvakPitaAadharCardFront">
                  <DocumentUploader
                    label="વરરાજાના પિતા આધાર આગળ (Groom Father Aadhar Front)"
                    gujaratiLabel="વરરાજાના પિતાના આધાર કાર્ડનો આગળનો ભાગ"
                    document={kuvarDocs.yuvakPitaAadharCardFront}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, yuvakPitaAadharCardFront: doc }))}
                    required
                  />
                  {errors.yuvakPitaAadharCardFront && <p className="text-xs text-red-500 mt-1">{errors.yuvakPitaAadharCardFront}</p>}
                </div>

                {/* Yuvak Pita Aadhar Back */}
                <div id="yuvakPitaAadharCardBack">
                  <DocumentUploader
                    label="વરરાજાના પિતા આધાર પાછળ (Groom Father Aadhar Back)"
                    gujaratiLabel="વરરાજાના પિતાના આધાર કાર્ડનો પાછળનો ભાગ"
                    document={kuvarDocs.yuvakPitaAadharCardBack}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, yuvakPitaAadharCardBack: doc }))}
                    required
                  />
                  {errors.yuvakPitaAadharCardBack && <p className="text-xs text-red-500 mt-1">{errors.yuvakPitaAadharCardBack}</p>}
                </div>

                {/* Kanya School Leaving */}
                <div id="kanyaSchoolLeaving">
                  <DocumentUploader
                    label="કન્યા શાળા છોડ્યાનું પ્રમાણપત્ર (Bride L.C. / School Leaving Certificate)"
                    gujaratiLabel="જન્મતારીખના પુરાવા માટે શાળા છોડ્યાનું પ્રમાણપત્ર"
                    document={kuvarDocs.kanyaSchoolLeaving}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaSchoolLeaving: doc }))}
                    required
                  />
                  {errors.kanyaSchoolLeaving && <p className="text-xs text-red-500 mt-1">{errors.kanyaSchoolLeaving}</p>}
                </div>

                {/* Caste Cert */}
                <div id="casteCertificate">
                  <DocumentUploader
                    label="જાતિનું પ્રમાણપત્ર (Caste Certificate) - વૈકલ્પિક"
                    gujaratiLabel="જાતિના પ્રમાણપત્રની કોપી (વૈકલ્પિક)"
                    document={kuvarDocs.casteCertificate}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, casteCertificate: doc }))}
                  />
                  {errors.casteCertificate && <p className="text-xs text-red-500 mt-1">{errors.casteCertificate}</p>}
                </div>

                {/* Income Cert */}
                <div id="kanyaPitaIncomeCertificate">
                  <DocumentUploader
                    label="પિતાનું આવકનું પ્રમાણપત્ર (Father's Income Certificate)"
                    gujaratiLabel="વાર્ષિક આવક દર્શાવતું સક્ષમ અધિકારીનું પ્રમાણપત્ર"
                    document={kuvarDocs.kanyaPitaIncomeCertificate}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaPitaIncomeCertificate: doc }))}
                    required
                  />
                  {errors.kanyaPitaIncomeCertificate && <p className="text-xs text-red-500 mt-1">{errors.kanyaPitaIncomeCertificate}</p>}
                </div>

                {/* Bank Passbook */}
                <div id="kanyaBankPassbook">
                  <DocumentUploader
                    label="કન્યાની બેંક પાસબુક (Bride Bank Passbook Front Page)"
                    gujaratiLabel="કન્યાના પોતાના નામની બેંક પાસબુકના પ્રથમ પાનાનો ફોટો"
                    document={kuvarDocs.kanyaBankPassbook}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, kanyaBankPassbook: doc }))}
                    required
                  />
                  {errors.kanyaBankPassbook && <p className="text-xs text-red-500 mt-1">{errors.kanyaBankPassbook}</p>}
                </div>

                {/* Marriage Cert */}
                <div id="marriageCertificate">
                  <DocumentUploader
                    label="લગ્ન નોંધણી પ્રમાણપત્ર (Marriage Registration Certificate)"
                    gujaratiLabel="લગ્ન નોંધણી કચેરી દ્વારા આપેલું મેરેજ સર્ટિફિકેટ"
                    document={kuvarDocs.marriageCertificate}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, marriageCertificate: doc }))}
                    required
                  />
                  {errors.marriageCertificate && <p className="text-xs text-red-500 mt-1">{errors.marriageCertificate}</p>}
                </div>

                {/* Self Declaration (Optional) */}
                <div id="selfDeclaration">
                  <DocumentUploader
                    label="સ્વ-ઘોષણાપત્ર (Self Declaration Form) - વૈકલ્પિક"
                    gujaratiLabel="સેલ્ફ ડેકલેરેશન ફોર્મ (દુકાન માલિક દ્વારા અપલોડ કરવામાં આવશે)"
                    document={kuvarDocs.selfDeclaration}
                    onUpload={(doc) => setKuvarDocs(prev => ({ ...prev, selfDeclaration: doc }))}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= OTHER SERVICES FORM FIELDS ================= */}
        
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.childFullNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, childFullNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="દા.ત. પટેલ આર્યન અમિતભાઈ" />
                  {errors.childFullNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.childFullNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Child Full Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.childFullNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, childFullNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" placeholder="e.g. PATEL ARYAN AMITBHAI" />
                  {errors.childFullNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.childFullNameEn}</p>}
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
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું નામ (Hospital Name)</label>
                      <input type="text" value={newBirthDetails.hospitalName} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, hospitalName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="col-span-full md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું સરનામું (Hospital Address)</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.fatherFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.fatherMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.fatherLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.fatherFirstNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.fatherFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={newBirthDetails.fatherMiddleNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.fatherLastNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.fatherLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={newBirthDetails.fatherAadhar} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" maxLength={10} value={newBirthDetails.fatherMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, fatherMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.motherFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.motherMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.motherLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.motherFirstNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.motherFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={newBirthDetails.motherMiddleNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.motherLastNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.motherLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={newBirthDetails.motherAadhar} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" maxLength={10} value={newBirthDetails.motherMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, motherMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.informerFirstNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={newBirthDetails.informerMiddleNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.informerLastNameGu} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English)</label>
                  <input type="text" value={newBirthDetails.informerFirstNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={newBirthDetails.informerMiddleNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English)</label>
                  <input type="text" value={newBirthDetails.informerLastNameEn} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળક સાથે સંબંધ (Relationship) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newBirthDetails.informerRelationship} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father, Mother, etc" />
                  {errors.informerRelationship && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerRelationship}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={newBirthDetails.informerMobile} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerMobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerMobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar)</label>
                  <input type="text" value={newBirthDetails.informerAadhar} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerAadhar: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">સરનામું (Address) <span className="text-rose-500">*</span></label>
                  <textarea rows={2} value={newBirthDetails.informerAddress} onChange={(e) => setNewBirthDetails({ ...newBirthDetails, informerAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                  {errors.informerAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAddress}</p>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ આગળ (Informer Aadhar Front) *" gujaratiLabel="" document={newBirthDocs.informerAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerAadharFront: doc})} />
                  {errors.informerAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ પાછળ (Informer Aadhar Back) *" gujaratiLabel="" document={newBirthDocs.informerAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerAadharBack: doc})} />
                  {errors.informerAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારની સહી (Informer Signature) *" gujaratiLabel="" document={newBirthDocs.informerSignature} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, informerSignature: doc})} />
                  {errors.informerSignature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerSignature}</p>}
                </div>
                <DocumentUploader label="પિતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.fatherAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, fatherAadharFront: doc})} />
                <DocumentUploader label="પિતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.fatherAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, fatherAadharBack: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.motherAadharFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, motherAadharFront: doc})} />
                <DocumentUploader label="માતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.motherAadharBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, motherAadharBack: doc})} />
                <DocumentUploader label="રેશન કાર્ડ આગળ" gujaratiLabel="" document={newBirthDocs.rationCardFront} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, rationCardFront: doc})} />
                <DocumentUploader label="રેશન કાર્ડ પાછળ" gujaratiLabel="" document={newBirthDocs.rationCardBack} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, rationCardBack: doc})} />
                <DocumentUploader label="લગ્ન પ્રમાણપત્ર (Marriage Cert.)" gujaratiLabel="" document={newBirthDocs.marriageCertificate} onUpload={(doc) => setNewBirthDocs({...newBirthDocs, marriageCertificate: doc})} />
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
                  {errors.childFullNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.childFullNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનું પૂરું નામ (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.childFullNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, childFullNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.childFullNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.childFullNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ તારીખ (Date of Birth) <span className="text-rose-500">*</span></label>
                  <input type="date" value={birthCorrectionDetails.dob} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, dob: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.dob && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={birthCorrectionDetails.gender} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- જાતિ પસંદ કરો --</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળકનો આધાર નંબર (Aadhar)</label>
                  <input type="text" maxLength={12} value={birthCorrectionDetails.childAadhar} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, childAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">નોંધણી નંબર (Registration Number)</label>
                  <input type="text" value={birthCorrectionDetails.registrationNumber} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, registrationNumber: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ સ્થળ (Birth Place) <span className="text-rose-500">*</span></label>
                  <select value={birthCorrectionDetails.birthPlace} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, birthPlace: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- સ્થળ પસંદ કરો --</option>
                    <option value="HOME">ઘર (Home)</option>
                    <option value="HOSPITAL">હોસ્પિટલ (Hospital)</option>
                    <option value="SANSTHA">સંસ્થા (Sanstha)</option>
                  </select>
                  {errors.birthPlace && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.birthPlace}</p>}
                </div>

                {(birthCorrectionDetails.birthPlace === 'HOSPITAL' || birthCorrectionDetails.birthPlace === 'SANSTHA') && (
                  <>
                    <div className="col-span-full md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું નામ (Hospital Name) <span className="text-rose-500">*</span></label>
                      <input type="text" value={birthCorrectionDetails.hospitalName} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, hospitalName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                      {errors.hospitalName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.hospitalName}</p>}
                    </div>
                    <div className="col-span-full md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલ/સંસ્થાનું સરનામું (Hospital Address) <span className="text-rose-500">*</span></label>
                      <input type="text" value={birthCorrectionDetails.hospitalAddress} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, hospitalAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                      {errors.hospitalAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.hospitalAddress}</p>}
                    </div>
                  </>
                )}

                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જન્મ સમયે માતાપિતાનું સરનામું (Address at time of birth) <span className="text-rose-500">*</span></label>
                  <textarea rows={2} value={birthCorrectionDetails.bornTimeAddress} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, bornTimeAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                  {errors.bornTimeAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.bornTimeAddress}</p>}
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">માતાપિતાનું કાયમી સરનામું (Permanent Address) <span className="text-rose-500">*</span></label>
                  <textarea rows={2} value={birthCorrectionDetails.permanentAddress} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, permanentAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                  {errors.permanentAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.permanentAddress}</p>}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.fatherFirstNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={birthCorrectionDetails.fatherMiddleNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.fatherLastNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.fatherFirstNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.fatherFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={birthCorrectionDetails.fatherMiddleNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.fatherLastNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.fatherLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={birthCorrectionDetails.fatherAadhar} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.fatherAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" maxLength={10} value={birthCorrectionDetails.fatherMobile} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={birthCorrectionDetails.fatherEmail} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, fatherEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.motherFirstNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={birthCorrectionDetails.motherMiddleNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.motherLastNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.motherFirstNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.motherFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={birthCorrectionDetails.motherMiddleNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.motherLastNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.motherLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar Number) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={birthCorrectionDetails.motherAadhar} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.motherAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile)</label>
                  <input type="tel" maxLength={10} value={birthCorrectionDetails.motherMobile} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={birthCorrectionDetails.motherEmail} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, motherEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.informerFirstNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={birthCorrectionDetails.informerMiddleNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.informerLastNameGu} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English)</label>
                  <input type="text" value={birthCorrectionDetails.informerFirstNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={birthCorrectionDetails.informerMiddleNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English)</label>
                  <input type="text" value={birthCorrectionDetails.informerLastNameEn} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">બાળક સાથે સંબંધ (Relationship) <span className="text-rose-500">*</span></label>
                  <input type="text" value={birthCorrectionDetails.informerRelationship} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father, Mother, etc" />
                  {errors.informerRelationship && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerRelationship}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={birthCorrectionDetails.informerMobile} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerMobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerMobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar)</label>
                  <input type="text" value={birthCorrectionDetails.informerAadhar} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerAadhar: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">સરનામું (Address) <span className="text-rose-500">*</span></label>
                  <textarea rows={2} value={birthCorrectionDetails.informerAddress} onChange={(e) => setBirthCorrectionDetails({ ...birthCorrectionDetails, informerAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                  {errors.informerAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAddress}</p>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="જૂનું જન્મ પ્રમાણપત્ર *" gujaratiLabel="" document={birthCorrectionDocs.oldBirthCertificate} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, oldBirthCertificate: doc})} />
                  {errors.oldBirthCertificate && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.oldBirthCertificate}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ આગળ *" gujaratiLabel="" document={birthCorrectionDocs.informerAadharFront} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, informerAadharFront: doc})} />
                  {errors.informerAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ પાછળ *" gujaratiLabel="" document={birthCorrectionDocs.informerAadharBack} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, informerAadharBack: doc})} />
                  {errors.informerAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારની સહી *" gujaratiLabel="" document={birthCorrectionDocs.informerSignature} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, informerSignature: doc})} />
                  {errors.informerSignature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerSignature}</p>}
                </div>
                <div>
                  <DocumentUploader label="પિતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={birthCorrectionDocs.fatherAadharFront} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, fatherAadharFront: doc})} />
                  {errors.fatherAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="પિતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={birthCorrectionDocs.fatherAadharBack} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, fatherAadharBack: doc})} />
                  {errors.fatherAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.fatherAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="માતાનું આધાર કાર્ડ આગળ" gujaratiLabel="" document={birthCorrectionDocs.motherAadharFront} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, motherAadharFront: doc})} />
                  {errors.motherAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="માતાનું આધાર કાર્ડ પાછળ" gujaratiLabel="" document={birthCorrectionDocs.motherAadharBack} onUpload={(doc) => setBirthCorrectionDocs({...birthCorrectionDocs, motherAadharBack: doc})} />
                  {errors.motherAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.motherAadharBack}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= DEATH CERTIFICATE ================= */}
        {formType === 'DEATH_CERTIFICATE' && (
          <div className="space-y-8">
            {/* Informer Details */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                માહિતી આપનારની વિગતો (Informer Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerFirstNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={deathDetails.informerMiddleNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerLastNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, informerLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerFirstNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, informerFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.informerFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={deathDetails.informerMiddleNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, informerMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerLastNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, informerLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.informerLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મૃતક સાથે સંબંધ (Relationship) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.informerRelationship} onChange={(e) => setDeathDetails({ ...deathDetails, informerRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Father, Mother, Brother..." />
                  {errors.informerRelationship && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerRelationship}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={deathDetails.informerMobile} onChange={(e) => setDeathDetails({ ...deathDetails, informerMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerMobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerMobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={deathDetails.informerAadhar} onChange={(e) => setDeathDetails({ ...deathDetails, informerAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.informerAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={deathDetails.informerEmail} onChange={(e) => setDeathDetails({ ...deathDetails, informerEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            
            {/* Deceased Person Details */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                મૃતકની વિગતો (Deceased Person Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.deathPersonFirstNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.deathPersonFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={deathDetails.deathPersonMiddleNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.deathPersonLastNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.deathPersonLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.deathPersonFirstNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.deathPersonFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={deathDetails.deathPersonMiddleNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.deathPersonLastNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.deathPersonLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">જાતિ (Gender) <span className="text-rose-500">*</span></label>
                  <select value={deathDetails.gender || ''} onChange={(e) => setDeathDetails({ ...deathDetails, gender: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- જાતિ પસંદ કરો --</option>
                    <option value="MALE">પુરુષ (Male)</option>
                    <option value="FEMALE">સ્ત્રી (Female)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ તારીખ (Death Date) <span className="text-rose-500">*</span></label>
                  <input type="date" value={deathDetails.deathDate} onChange={(e) => setDeathDetails({ ...deathDetails, deathDate: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.deathDate && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ સમય (Death Time)</label>
                  <input type="time" value={deathDetails.deathTime} onChange={(e) => setDeathDetails({ ...deathDetails, deathTime: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ સ્થળ (Death Place) <span className="text-rose-500">*</span></label>
                  <select value={deathDetails.deathPlace} onChange={(e) => setDeathDetails({ ...deathDetails, deathPlace: e.target.value as any })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- સ્થળ પસંદ કરો --</option>
                    <option value="HOME">ઘર (Home)</option>
                    <option value="HOSPITAL">હોસ્પિટલ (Hospital)</option>
                    <option value="OTHER">અન્ય (Other)</option>
                  </select>
                  {errors.deathPlace && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPlace}</p>}
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={deathDetails.deathPersonAadhar} onChange={(e) => setDeathDetails({ ...deathDetails, deathPersonAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.deathPersonAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonAadhar}</p>}
                </div>

                {deathDetails.deathPlace === 'HOSPITAL' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલનું નામ (Hospital Name) <span className="text-rose-500">*</span></label>
                      <input type="text" value={deathDetails.hospitalName} onChange={(e) => setDeathDetails({ ...deathDetails, hospitalName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                      {errors.hospitalName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.hospitalName}</p>}
                    </div>
                    <div className="col-span-full md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">હોસ્પિટલનું સરનામું (Hospital Address) <span className="text-rose-500">*</span></label>
                      <input type="text" value={deathDetails.hospitalAddress} onChange={(e) => setDeathDetails({ ...deathDetails, hospitalAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                      {errors.hospitalAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.hospitalAddress}</p>}
                    </div>
                  </>
                )}

                {(deathDetails.deathPlace === 'HOME' || deathDetails.deathPlace === 'OTHER') && (
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">મરણ સમયનું સરનામું (Address at time of death) <span className="text-rose-500">*</span></label>
                    <textarea rows={2} value={deathDetails.deathTimeAddress} onChange={(e) => setDeathDetails({ ...deathDetails, deathTimeAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                    {errors.deathTimeAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathTimeAddress}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">રેશન કાર્ડ નંબર (Ration Card Number) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.rationCardNumber} onChange={(e) => setDeathDetails({ ...deathDetails, rationCardNumber: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.rationCardNumber && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationCardNumber}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">રેશન સભ્ય આઈડી (Ration Member ID) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.rationMemberId} onChange={(e) => setDeathDetails({ ...deathDetails, rationMemberId: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.rationMemberId && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationMemberId}</p>}
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">કાયમી સરનામું (Permanent Address) <span className="text-rose-500">*</span></label>
                  <textarea rows={2} value={deathDetails.permanentAddress} onChange={(e) => setDeathDetails({ ...deathDetails, permanentAddress: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                  {errors.permanentAddress && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.permanentAddress}</p>}
                </div>
              </div>
            </div>

            {/* Nominee Details */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                વારસદારની વિગતો (Nominee / Legal Heir Details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">પ્રથમ નામ (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.nomineeFirstNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeFirstNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.nomineeFirstNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeFirstNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">વચલું નામ (Gujarati)</label>
                  <input type="text" value={deathDetails.nomineeMiddleNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeMiddleNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">અટક (Gujarati) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.nomineeLastNameGu} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeLastNameGu: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.nomineeLastNameGu && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeLastNameGu}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.nomineeFirstNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeFirstNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.nomineeFirstNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeFirstNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (English)</label>
                  <input type="text" value={deathDetails.nomineeMiddleNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeMiddleNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (English) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.nomineeLastNameEn} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeLastNameEn: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" />
                  {errors.nomineeLastNameEn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeLastNameEn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મૃતક સાથે સંબંધ (Relationship) <span className="text-rose-500">*</span></label>
                  <input type="text" value={deathDetails.nomineeRelationship} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeRelationship: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Wife, Son, Daughter, Husband..." />
                  {errors.nomineeRelationship && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeRelationship}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">મોબાઇલ (Mobile) <span className="text-rose-500">*</span></label>
                  <input type="tel" maxLength={10} value={deathDetails.nomineeMobile} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeMobile: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.nomineeMobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeMobile}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">આધાર નંબર (Aadhar) <span className="text-rose-500">*</span></label>
                  <input type="text" maxLength={12} value={deathDetails.nomineeAadhar} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeAadhar: e.target.value.replace(/[^0-9]/g, '') })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.nomineeAadhar && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeAadhar}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ઇમેઇલ (Email)</label>
                  <input type="email" value={deathDetails.nomineeEmail} onChange={(e) => setDeathDetails({ ...deathDetails, nomineeEmail: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                દસ્તાવેજો (Documents)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ આગળ *" gujaratiLabel="" document={deathDocs.informerAadharFront} onUpload={(doc) => setDeathDocs({...deathDocs, informerAadharFront: doc})} />
                  {errors.informerAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારનું આધાર કાર્ડ પાછળ *" gujaratiLabel="" document={deathDocs.informerAadharBack} onUpload={(doc) => setDeathDocs({...deathDocs, informerAadharBack: doc})} />
                  {errors.informerAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="માહિતી આપનારની સહી *" gujaratiLabel="" document={deathDocs.informerSignature} onUpload={(doc) => setDeathDocs({...deathDocs, informerSignature: doc})} />
                  {errors.informerSignature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.informerSignature}</p>}
                </div>

                <div>
                  <DocumentUploader label="મૃતકનો ફોટો *" gujaratiLabel="" document={deathDocs.deathPersonPhoto} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonPhoto: doc})} />
                  {errors.deathPersonPhoto && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonPhoto}</p>}
                </div>
                <div>
                  <DocumentUploader label="મૃતકનું આધાર કાર્ડ આગળ *" gujaratiLabel="" document={deathDocs.deathPersonAadharFront} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonAadharFront: doc})} />
                  {errors.deathPersonAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="મૃતકનું આધાર કાર્ડ પાછળ *" gujaratiLabel="" document={deathDocs.deathPersonAadharBack} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonAadharBack: doc})} />
                  {errors.deathPersonAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonAadharBack}</p>}
                </div>

                <div>
                  <DocumentUploader label="મૃતકનું રેશન કાર્ડ આગળ *" gujaratiLabel="" document={deathDocs.deathPersonRationFront} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonRationFront: doc})} />
                  {errors.deathPersonRationFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonRationFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="મૃતકનું રેશન કાર્ડ પાછળ *" gujaratiLabel="" document={deathDocs.deathPersonRationBack} onUpload={(doc) => setDeathDocs({...deathDocs, deathPersonRationBack: doc})} />
                  {errors.deathPersonRationBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathPersonRationBack}</p>}
                </div>

                <div>
                  <DocumentUploader label="વારસદારનો ફોટો *" gujaratiLabel="" document={deathDocs.nomineePhoto} onUpload={(doc) => setDeathDocs({...deathDocs, nomineePhoto: doc})} />
                  {errors.nomineePhoto && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineePhoto}</p>}
                </div>
                <div>
                  <DocumentUploader label="વારસદારનું આધાર કાર્ડ આગળ *" gujaratiLabel="" document={deathDocs.nomineeAadharFront} onUpload={(doc) => setDeathDocs({...deathDocs, nomineeAadharFront: doc})} />
                  {errors.nomineeAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="વારસદારનું આધાર કાર્ડ પાછળ *" gujaratiLabel="" document={deathDocs.nomineeAadharBack} onUpload={(doc) => setDeathDocs({...deathDocs, nomineeAadharBack: doc})} />
                  {errors.nomineeAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="વારસદારની સહી *" gujaratiLabel="" document={deathDocs.nomineeSignature} onUpload={(doc) => setDeathDocs({...deathDocs, nomineeSignature: doc})} />
                  {errors.nomineeSignature && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nomineeSignature}</p>}
                </div>

                {deathDetails.deathPlace === 'HOSPITAL' && (
                  <div>
                    <DocumentUploader label="હોસ્પિટલ/પોલીસ/PM રિપોર્ટ *" gujaratiLabel="" document={deathDocs.hospitalReceipt} onUpload={(doc) => setDeathDocs({...deathDocs, hospitalReceipt: doc})} />
                    {errors.hospitalReceipt && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.hospitalReceipt}</p>}
                  </div>
                )}
                {deathDetails.deathPlace === 'HOME' && (
                  <div>
                    <DocumentUploader label="સ્મશાન/કબ્રસ્તાનની પહોંચ *" gujaratiLabel="" document={deathDocs.crematoriumReceipt} onUpload={(doc) => setDeathDocs({...deathDocs, crematoriumReceipt: doc})} />
                    {errors.crematoriumReceipt && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.crematoriumReceipt}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {formType === 'OTHER_SERVICE' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Applicant & Service Details */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> અરજદાર અને સેવાની વિગતો (Applicant & Service Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              {/* Name fields */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">અરજદારનું નામ (Applicant Name)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="firstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પ્રથમ નામ (First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={otherDetails.firstName}
                      onChange={e => handleOtherDetailsChange('firstName', e.target.value.toUpperCase())}
                      placeholder="e.g. SANJAY"
                      className={`w-full bg-white border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">મધ્યમ નામ (Middle Name)</label>
                    <input
                      type="text"
                      value={otherDetails.middleName}
                      onChange={e => handleOtherDetailsChange('middleName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAMESHBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="lastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">અટક (Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={otherDetails.lastName}
                      onChange={e => handleOtherDetailsChange('lastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PATEL"
                      className={`w-full bg-white border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              {/* Service & Contact */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">સેવાની પસંદગી અને સંપર્ક (Service & Contact)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="serviceName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">જરૂરી સેવાનું નામ (Required Service Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={otherDetails.serviceName}
                      onChange={e => handleOtherDetailsChange('serviceName', e.target.value)}
                      placeholder="દા.ત. આવકનો દાખલો, વિધવા સહાય વગેરે"
                      className={`w-full bg-white border ${errors.serviceName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.serviceName && <p className="text-xs text-red-500 mt-0.5">{errors.serviceName}</p>}
                  </div>
                  <div id="mobile" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">મોબાઈલ નંબર (Mobile Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      maxLength={10}
                      value={otherDetails.mobile}
                      onChange={e => handleOtherDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-white border ${errors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden font-mono`}
                    />
                    {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                  </div>
                  <div id="gender" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" /> જાતિ (Gender) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={otherDetails.gender}
                      onChange={e => handleOtherDetailsChange('gender', e.target.value)}
                      className={`w-full bg-white border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="MALE">પુરુષ (Male)</option>
                      <option value="FEMALE">સ્ત્રી (Female)</option>
                      <option value="OTHER">અન્ય (Other)</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Supporting Document Upload */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> દસ્તાવેજો અપલોડ (Supporting Documents)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="supportingDoc">
                  <DocumentUploader
                    label="સહાયક દસ્તાવેજ (Supporting Document) - વૈકલ્પિક"
                    gujaratiLabel="અરજી સંબંધિત કોઈપણ એક પીડીએફ અથવા ફોટો"
                    document={otherDocs.supportingDoc || null}
                    onUpload={(doc) => setOtherDocs(prev => ({ ...prev, supportingDoc: doc }))}
                  />
                </div>
              </div>
            </section>
          </div>
        )}


        {formType === 'RATION_CARD_ADD_NAME' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Beneficiary Information */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૧. જે સભ્યનું નામ ઉમેરવાનું છે તેની વિગતો (1. New Member Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">સભ્યનું નામ અને જન્મ તારીખ (Member Name & DOB)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="firstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પ્રથમ નામ (First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.firstName}
                      onChange={e => handleRationCardAddDetailsChange('firstName', e.target.value.toUpperCase())}
                      placeholder="e.g. ARJUN"
                      className={`w-full bg-white border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">મધ્યમ નામ (Middle Name)</label>
                    <input
                      type="text"
                      value={rationCardAddDetails.middleName}
                      onChange={e => handleRationCardAddDetailsChange('middleName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAMESHBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="lastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">અટક (Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.lastName}
                      onChange={e => handleRationCardAddDetailsChange('lastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PATEL"
                      className={`w-full bg-white border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="dob" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={rationCardAddDetails.dob}
                      onChange={e => handleRationCardAddDetailsChange('dob', e.target.value)}
                      className={`w-full bg-white border ${errors.dob ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                  </div>
                  <div id="gender" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">લિંગ (Gender) <span className="text-red-500">*</span></label>
                    <select
                      value={rationCardAddDetails.gender}
                      onChange={e => handleRationCardAddDetailsChange('gender', e.target.value)}
                      className={`w-full bg-white border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="MALE">પુરુષ (Male)</option>
                      <option value="FEMALE">સ્ત્રી (Female)</option>
                      <option value="OTHER">અન્ય (Other)</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                  </div>
                  <div id="caste" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">જ્ઞાતિ (Caste / Category) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.caste}
                      onChange={e => handleRationCardAddDetailsChange('caste', e.target.value.toUpperCase())}
                      placeholder="e.g. HINDU - PATEL (OBC/GEN/SC/ST)"
                      className={`w-full bg-white border ${errors.caste ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.caste && <p className="text-xs text-red-500 mt-0.5">{errors.caste}</p>}
                  </div>
                </div>
              </div>

              {/* Parents details */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">માતા-પિતાની વિગતો (Parent Details)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="fatherFirstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું પ્રથમ નામ (Father First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.fatherFirstName}
                      onChange={e => handleRationCardAddDetailsChange('fatherFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAMESHBHAI"
                      className={`w-full bg-white border ${errors.fatherFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.fatherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાનું મધ્યમ નામ (Father Middle Name)</label>
                    <input
                      type="text"
                      value={rationCardAddDetails.fatherMiddleName}
                      onChange={e => handleRationCardAddDetailsChange('fatherMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. DHIRUBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="fatherLastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પિતાની અટક (Father Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.fatherLastName}
                      onChange={e => handleRationCardAddDetailsChange('fatherLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PATEL"
                      className={`w-full bg-white border ${errors.fatherLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.fatherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherLastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="motherFirstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું પ્રથમ નામ (Mother First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.motherFirstName}
                      onChange={e => handleRationCardAddDetailsChange('motherFirstName', e.target.value.toUpperCase())}
                      placeholder="e.g. KOKILABEN"
                      className={`w-full bg-white border ${errors.motherFirstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.motherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.motherFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાનું મધ્યમ નામ (Mother Middle Name)</label>
                    <input
                      type="text"
                      value={rationCardAddDetails.motherMiddleName}
                      onChange={e => handleRationCardAddDetailsChange('motherMiddleName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAMESHBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="motherLastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">માતાની અટક (Mother Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.motherLastName}
                      onChange={e => handleRationCardAddDetailsChange('motherLastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PATEL"
                      className={`w-full bg-white border ${errors.motherLastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.motherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.motherLastName}</p>}
                  </div>
                </div>
              </div>

              {/* Ration details */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">રેશનકાર્ડ અને સરનામાની વિગતો (Ration Card & Address Details)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="rationCardNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">રેશન કાર્ડ નંબર (Ration Card Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardAddDetails.rationCardNumber}
                      onChange={e => handleRationCardAddDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 24XXXXXXXXXX"
                      className={`w-full bg-white border ${errors.rationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.rationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardNumber}</p>}
                  </div>
                  <div id="relationshipWithHead" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">મુખ્ય સભ્ય સાથેનો સંબંધ (Relationship with Head) <span className="text-red-500">*</span></label>
                    <select
                      value={rationCardAddDetails.relationshipWithHead}
                      onChange={e => handleRationCardAddDetailsChange('relationshipWithHead', e.target.value)}
                      className={`w-full bg-white border ${errors.relationshipWithHead ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="SON">પુત્ર (Son)</option>
                      <option value="DAUGHTER">પુત્રી (Daughter)</option>
                      <option value="WIFE">પત્ની (Wife)</option>
                      <option value="BROTHER">ભાઈ (Brother)</option>
                      <option value="SISTER">બહેન (Sister)</option>
                      <option value="BROTHER_IN_LAW">બનેવી / સાળો (Brother-in-law)</option>
                      <option value="SISTER_IN_LAW">ભાભી / સાળી (Sister-in-law)</option>
                      <option value="OTHER">અન્ય (Other)</option>
                    </select>
                    {errors.relationshipWithHead && <p className="text-xs text-red-500 mt-0.5">{errors.relationshipWithHead}</p>}
                  </div>
                  <div id="rationCategory" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">રેશન કેટેગરી (Ration Category) <span className="text-red-500">*</span></label>
                    <select
                      value={rationCardAddDetails.rationCategory}
                      onChange={e => handleRationCardAddDetailsChange('rationCategory', e.target.value)}
                      className={`w-full bg-white border ${errors.rationCategory ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="APL">APL</option>
                      <option value="BPL">BPL / NFSA</option>
                    </select>
                    {errors.rationCategory && <p className="text-xs text-red-500 mt-0.5">{errors.rationCategory}</p>}
                  </div>
                </div>

                <div className="space-y-1.5" id="address">
                  <label className="text-xs font-semibold text-slate-700">પૂરેપૂરું સરનામું (Full Address) <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    value={rationCardAddDetails.address}
                    onChange={e => handleRationCardAddDetailsChange('address', e.target.value.toUpperCase())}
                    placeholder="ENTER COMPLETE RESIDENTIAL ADDRESS"
                    className={`w-full bg-white border ${errors.address ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> ૨. જરૂરી દસ્તાવેજો અપલોડ કરો (2. Upload Required Documents)
                </h3>
              </div>

              <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">મહત્વની સૂચના (Important Notice):</p>
                  <p>• તમામ દસ્તાવેજો સ્પષ્ટ રીતે વાંચી શકાય તેવા હોવા જોઈએ (All documents must be clearly readable).</p>
                  <p>• જો બીજા રેશનકાર્ડમાંથી નામ કમી કરી અહીં ઉમેરવાનું હોય, તો "નામ કમી કર્યાનો દાખલો" ફરજિયાત અપલોડ કરો.</p>
                  <p>• જો નવું જ જન્મેલ બાળક હોય તો તેનું "જન્મ પ્રમાણપત્ર" અપલોડ કરો.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <DocumentUploader label="નવા સભ્યનું આધાર કાર્ડ (આગળ) *" gujaratiLabel="Aadhaar Card Front" document={rationCardAddDocs.aadharCardFront} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, aadharCardFront: doc})} />
                  {errors.aadharCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="નવા સભ્યનું આધાર કાર્ડ (પાછળ) *" gujaratiLabel="Aadhaar Card Back" document={rationCardAddDocs.aadharCardBack} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, aadharCardBack: doc})} />
                  {errors.aadharCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="રેશનકાર્ડ આગળનો ભાગ *" gujaratiLabel="Ration Card Front" document={rationCardAddDocs.rationCardFront} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, rationCardFront: doc})} />
                  {errors.rationCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="રેશનકાર્ડ પાછળનો ભાગ *" gujaratiLabel="Ration Card Back" document={rationCardAddDocs.rationCardBack} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, rationCardBack: doc})} />
                  {errors.rationCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="મુખ્ય સભ્યનું આધાર કાર્ડ (આગળ) *" gujaratiLabel="Head of Family Aadhaar Front" document={rationCardAddDocs.headAadharFront} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, headAadharFront: doc})} />
                  {errors.headAadharFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.headAadharFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="મુખ્ય સભ્યનું આધાર કાર્ડ (પાછળ) *" gujaratiLabel="Head of Family Aadhaar Back" document={rationCardAddDocs.headAadharBack} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, headAadharBack: doc})} />
                  {errors.headAadharBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.headAadharBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="નામ કમી કર્યાનો દાખલો (જો લાગુ પડે તો)" gujaratiLabel="Name Deletion Certificate (If Transferring)" document={rationCardAddDocs.deletionCertificate || null} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, deletionCertificate: doc})} />
                </div>
                <div>
                  <DocumentUploader label="જન્મ પ્રમાણપત્ર (જો નવું બાળક હોય)" gujaratiLabel="Birth Certificate (If Fresh Born Baby)" document={rationCardAddDocs.birthCertificate || null} onUpload={(doc) => setRationCardAddDocs({...rationCardAddDocs, birthCertificate: doc})} />
                </div>
              </div>
            </section>
          </div>
        )}

        {formType === 'RATION_CARD_REMOVE_NAME' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Member to Remove */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-600" /> ૧. જે સભ્યનું નામ કમી કરવાનું છે તેની વિગતો (1. Member Removal Details)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">સભ્યની અંગત વિગતો (Member Details)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="firstName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">પ્રથમ નામ (First Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardRemoveDetails.firstName}
                      onChange={e => handleRationCardRemoveDetailsChange('firstName', e.target.value.toUpperCase())}
                      placeholder="e.g. ASHABEN"
                      className={`w-full bg-white border ${errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">મધ્યમ નામ (Middle Name)</label>
                    <input
                      type="text"
                      value={rationCardRemoveDetails.middleName}
                      onChange={e => handleRationCardRemoveDetailsChange('middleName', e.target.value.toUpperCase())}
                      placeholder="e.g. RAMESHBHAI"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div id="lastName" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">અટક (Last Name) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardRemoveDetails.lastName}
                      onChange={e => handleRationCardRemoveDetailsChange('lastName', e.target.value.toUpperCase())}
                      placeholder="e.g. PATEL"
                      className={`w-full bg-white border ${errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div id="gender" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">લિંગ (Gender) <span className="text-red-500">*</span></label>
                    <select
                      value={rationCardRemoveDetails.gender}
                      onChange={e => handleRationCardRemoveDetailsChange('gender', e.target.value)}
                      className={`w-full bg-white border ${errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="MALE">પુરુષ (Male)</option>
                      <option value="FEMALE">સ્ત્રી (Female)</option>
                      <option value="OTHER">અન્ય (Other)</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                  </div>
                  <div id="rationCardNumber" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">રેશન કાર્ડ નંબર (Ration Card Number) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={rationCardRemoveDetails.rationCardNumber}
                      onChange={e => handleRationCardRemoveDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 24XXXXXXXXXX"
                      className={`w-full bg-white border ${errors.rationCardNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                    />
                    {errors.rationCardNumber && <p className="text-xs text-red-500 mt-0.5">{errors.rationCardNumber}</p>}
                  </div>
                  <div id="removeReason" className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">કમી કરવાનું કારણ (Removal Reason) <span className="text-red-500">*</span></label>
                    <select
                      value={rationCardRemoveDetails.removeReason}
                      onChange={e => handleRationCardRemoveDetailsChange('removeReason', e.target.value)}
                      className={`w-full bg-white border ${errors.removeReason ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden`}
                    >
                      <option value="">પસંદ કરો (Select)</option>
                      <option value="DEATH">મૃત્યુ પામેલ હોવાથી (Death)</option>
                      <option value="MARRIAGE">લગ્ન થઈ ગયેલ હોવાથી (Marriage / Transfer)</option>
                      <option value="CHANGE_ADDRESS">બીજા સ્થળે રહેવા ગયેલ હોવાથી (Change of Address)</option>
                      <option value="OTHER">અન્ય કારણોસર (Other Reason)</option>
                    </select>
                    {errors.removeReason && <p className="text-xs text-red-500 mt-0.5">{errors.removeReason}</p>}
                  </div>
                </div>

                <div className="space-y-1.5" id="address">
                  <label className="text-xs font-semibold text-slate-700">રેશનકાર્ડનું પૂરેપૂરું સરનામું (Full Address on Ration Card) <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    value={rationCardRemoveDetails.address}
                    onChange={e => handleRationCardRemoveDetailsChange('address', e.target.value.toUpperCase())}
                    placeholder="ENTER RESIDENTIAL ADDRESS AS PER RATION CARD"
                    className={`w-full bg-white border ${errors.address ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> ૨. જરૂરી દસ્તાવેજો અપલોડ કરો (2. Upload Required Documents)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <DocumentUploader label="કમી કરનાર સભ્યનું આધાર કાર્ડ (આગળ) *" gujaratiLabel="Member Aadhaar Card Front" document={rationCardRemoveDocs.aadharCardFront} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, aadharCardFront: doc})} />
                  {errors.aadharCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="કમી કરનાર સભ્યનું આધાર કાર્ડ (પાછળ) *" gujaratiLabel="Member Aadhaar Card Back" document={rationCardRemoveDocs.aadharCardBack} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, aadharCardBack: doc})} />
                  {errors.aadharCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.aadharCardBack}</p>}
                </div>
                <div>
                  <DocumentUploader label="રેશનકાર્ડ આગળનો ભાગ *" gujaratiLabel="Ration Card Front" document={rationCardRemoveDocs.rationCardFront} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, rationCardFront: doc})} />
                  {errors.rationCardFront && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationCardFront}</p>}
                </div>
                <div>
                  <DocumentUploader label="રેશનકાર્ડ પાછળનો ભાગ *" gujaratiLabel="Ration Card Back" document={rationCardRemoveDocs.rationCardBack} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, rationCardBack: doc})} />
                  {errors.rationCardBack && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.rationCardBack}</p>}
                </div>

                {/* Conditional Uploders */}
                {rationCardRemoveDetails.removeReason === 'DEATH' && (
                  <div className="md:col-span-2">
                    <DocumentUploader label="મરણ પ્રમાણપત્ર *" gujaratiLabel="Death Certificate" document={rationCardRemoveDocs.deathCertificate || null} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, deathCertificate: doc})} />
                    {errors.deathCertificate && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.deathCertificate}</p>}
                  </div>
                )}
                {rationCardRemoveDetails.removeReason === 'MARRIAGE' && (
                  <div className="md:col-span-2">
                    <DocumentUploader label="લગ્ન કંકોતરી / લગ્નનું પ્રમાણપત્ર *" gujaratiLabel="Marriage Invitation or Certificate" document={rationCardRemoveDocs.marriageCertificate || null} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, marriageCertificate: doc})} />
                    {errors.marriageCertificate && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.marriageCertificate}</p>}
                  </div>
                )}
                {rationCardRemoveDetails.removeReason === 'CHANGE_ADDRESS' && (
                  <div className="md:col-span-2">
                    <DocumentUploader label="બીજા રહેઠાણનું સરનામાનો પુરાવો (લાઈટ બિલ/ચૂંટણી કાર્ડ) *" gujaratiLabel="New Address Proof" document={rationCardRemoveDocs.addressProof || null} onUpload={(doc) => setRationCardRemoveDocs({...rationCardRemoveDocs, addressProof: doc})} />
                    {errors.addressProof && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.addressProof}</p>}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {formType === 'RATION_CARD_CORRECTION' && (
          <div className="space-y-8 animate-fade-in">
            {/* Correction details form */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Edit3 className="h-4.5 w-4.5 text-teal-600" /> રેશન કાર્ડ વિગત સુધારો અરજી (Ration Card Correction Enquiry Form)
                </h3>
              </div>

              <div className="bg-teal-50 border border-teal-200/50 p-4 rounded-2xl">
                <p className="text-xs text-teal-900 leading-relaxed font-semibold">
                  નોંધ: રેશનકાર્ડમાં નામ સુધારવું, સંબંધ સુધારવો, અથવા વિગતોની ચોકસાઈ માટે તમે અહીં સંપર્ક વિગતો અને સુધારવાની વિગતો સબમિટ કરી શકો છો. અમારા પ્રતિનિધિ તમારો સંપર્ક કરશે.
                </p>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">અરજદારની વિગતો (Applicant Info)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">અરજદારનું નામ (Full Name)</label>
                    <input
                      type="text"
                      value={rationCardCorrectionDetails.firstName}
                      onChange={e => handleRationCardCorrectionDetailsChange('firstName', e.target.value.toUpperCase())}
                      placeholder="e.g. SANJAYBHAI PATEL"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">રેશન કાર્ડ નંબર (Ration Card Number)</label>
                    <input
                      type="text"
                      value={rationCardCorrectionDetails.rationCardNumber}
                      onChange={e => handleRationCardCorrectionDetailsChange('rationCardNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 24XXXXXXXXXX"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">સંપર્ક નંબર (Contact Number)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={rationCardCorrectionDetails.contactNumber}
                      onChange={e => handleRationCardCorrectionDetailsChange('contactNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">શું સુધારો કરવાનો છે તેની સવિસ્તાર માહિતી (Correction Details Description)</label>
                  <textarea
                    rows={4}
                    value={rationCardCorrectionDetails.correctionEnquiry}
                    onChange={e => handleRationCardCorrectionDetailsChange('correctionEnquiry', e.target.value)}
                    placeholder="દા.ત. રેશનકાર્ડમાં પિતાના નામમાં પટેલ ની જગ્યાએ રાઠોડ કરવાનું છે, અથવા બાળકની ઉંમર સુધારવાની છે..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-sm outline-hidden"
                  />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-600" /> દસ્તાવેજો અપલોડ કરો (Upload Documents) - વૈકલ્પિક
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploader label="રેશનકાર્ડ આગળ-પાછળ કોપી" gujaratiLabel="Ration Card copy" document={rationCardCorrectionDocs.rationCardFront} onUpload={(doc) => setRationCardCorrectionDocs({...rationCardCorrectionDocs, rationCardFront: doc})} />
                <DocumentUploader label="સાચું નામ ધરાવતું કોઈ પણ પ્રમાણપત્ર (આધાર/LC)" gujaratiLabel="Supporting Proof (Aadhaar or LC)" document={rationCardCorrectionDocs.supportingDoc} onUpload={(doc) => setRationCardCorrectionDocs({...rationCardCorrectionDocs, supportingDoc: doc})} />
              </div>
            </section>
          </div>
        )}

        {formType === 'PASSPORT' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Category Selection */}
            <section className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-indigo-600" /> ૧. પાસપોર્ટ કેટેગરી પસંદ કરો (1. Passport Category)
                </h3>
                <span className="text-xs text-rose-500">* દર્શાવેલ વિગતો ફરજિયાત છે</span>
              </div>

              <div id="passportCategory" className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-800">અરજીનો પ્રકાર (Application Type) <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => handlePassportDetailsChange('passportCategory', 'NEW')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      passportDetails.passportCategory === 'NEW'
                        ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="passportCategory"
                      checked={passportDetails.passportCategory === 'NEW'}
                      onChange={() => handlePassportDetailsChange('passportCategory', 'NEW')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-sm font-bold">નવો પાસપોર્ટ (New Passport)</p>
                      <p className="text-[11px] text-slate-500">પ્રથમ વખત પાસપોર્ટ કઢાવવા માટે</p>
                    </div>
                  </label>

                  <label
                    onClick={() => handlePassportDetailsChange('passportCategory', 'RENEW')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      passportDetails.passportCategory === 'RENEW'
                        ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="passportCategory"
                      checked={passportDetails.passportCategory === 'RENEW'}
                      onChange={() => handlePassportDetailsChange('passportCategory', 'RENEW')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-sm font-bold">પાસપોર્ટ રિન્યુ (Renew Passport)</p>
                      <p className="text-[11px] text-slate-500">જૂના પાસપોર્ટને રિન્યુ કરવા માટે</p>
                    </div>
                  </label>
                </div>
                {errors.passportCategory && <p className="text-xs text-red-500 font-semibold mt-1">{errors.passportCategory}</p>}
              </div>
            </section>

            {passportDetails.passportCategory && (
              <>
                {/* 2. Personal Information */}
                <section className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                      <User className="h-4.5 w-4.5 text-indigo-600" /> ૨. અરજદારની અંગત વિગતો (2. Personal Details)
                    </h3>
                  </div>

                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">નામ ની વિગતો (આધાર કાર્ડ મુજબ)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div id="firstName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">પ્રથમ નામ (First Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.firstName}
                          onChange={e => handlePassportDetailsChange('firstName', e.target.value.toUpperCase())}
                          placeholder="e.g. RAMESHBHAI"
                          className={`w-full bg-white border ${errors.firstName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                      </div>

                      <div id="middleName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">પિતા/પતિનું નામ (Middle Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.middleName}
                          onChange={e => handlePassportDetailsChange('middleName', e.target.value.toUpperCase())}
                          placeholder="e.g. AMBALAL"
                          className={`w-full bg-white border ${errors.middleName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.middleName && <p className="text-xs text-red-500 mt-0.5">{errors.middleName}</p>}
                      </div>

                      <div id="lastName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">અટક (Last Name / Surname) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.lastName}
                          onChange={e => handlePassportDetailsChange('lastName', e.target.value.toUpperCase())}
                          placeholder="e.g. PATEL"
                          className={`w-full bg-white border ${errors.lastName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div id="gender" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">જાતિ (Gender) <span className="text-red-500">*</span></label>
                        <select
                          value={passportDetails.gender}
                          onChange={e => handlePassportDetailsChange('gender', e.target.value)}
                          className={`w-full bg-white border ${errors.gender ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                        >
                          <option value="">પસંદ કરો (Select)</option>
                          <option value="MALE">પુરુષ (Male)</option>
                          <option value="FEMALE">સ્ત્રી (Female)</option>
                          <option value="OTHER">અન્ય (Other)</option>
                        </select>
                        {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
                      </div>

                      <div id="caste" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">જ્ઞાતિ/વર્ગ (Category) <span className="text-red-500">*</span></label>
                        <select
                          value={passportDetails.caste}
                          onChange={e => handlePassportDetailsChange('caste', e.target.value)}
                          className={`w-full bg-white border ${errors.caste ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                        >
                          <option value="">પસંદ કરો (Select)</option>
                          <option value="GENERAL">સામાન્ય (General)</option>
                          <option value="OBC">ઓ.બી.સી / સામાજિક શૈક્ષણિક પછાત (OBC)</option>
                          <option value="SC">અનુસૂચિત જાતિ (SC)</option>
                          <option value="ST">અનુસૂચિત જનજાતિ (ST)</option>
                          <option value="OTHER">અન્ય (Other)</option>
                        </select>
                        {errors.caste && <p className="text-xs text-red-500 mt-0.5">{errors.caste}</p>}
                      </div>

                      <div id="dob" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">જન્મ તારીખ (Date of Birth) <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={passportDetails.dob}
                          onChange={e => handlePassportDetailsChange('dob', e.target.value)}
                          className={`w-full bg-white border ${errors.dob ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                        />
                        {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
                      </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div id="mobile" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">મોબાઈલ નંબર (Mobile) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          maxLength={10}
                          value={passportDetails.mobile}
                          onChange={e => handlePassportDetailsChange('mobile', e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9876543210"
                          className={`w-full bg-white border ${errors.mobile ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm font-mono`}
                        />
                        {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
                      </div>

                      <div id="email" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">ઈમેઈલ (Email Address) <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          value={passportDetails.email}
                          onChange={e => handlePassportDetailsChange('email', e.target.value)}
                          placeholder="e.g. example@gmail.com"
                          className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                      </div>
                    </div>

                    <div id="address" className="space-y-1.5 pt-2">
                      <label className="text-xs font-semibold text-slate-700">સરનામું (Address - આધાર/વોટર આઈડી મુજબ) <span className="text-red-500">*</span></label>
                      <textarea
                        rows={2}
                        value={passportDetails.address}
                        onChange={e => handlePassportDetailsChange('address', e.target.value)}
                        placeholder="ગામ, તાલુકો, જિલ્લો, પિનકોડ સાથે સંપૂર્ણ સરનામું લખો..."
                        className={`w-full bg-white border ${errors.address ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
                    </div>

                    {/* NEW Passport specific fields */}
                    {passportDetails.passportCategory === 'NEW' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-200/60">
                        <div id="maritalStatus" className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">વૈવાહિક સ્થિતિ (Marital Status) <span className="text-red-500">*</span></label>
                          <select
                            value={passportDetails.maritalStatus || ''}
                            onChange={e => handlePassportDetailsChange('maritalStatus', e.target.value)}
                            className={`w-full bg-white border ${errors.maritalStatus ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                          >
                            <option value="">પસંદ કરો (Select)</option>
                            <option value="UNMARRIED">અપરિણિત (Unmarried)</option>
                            <option value="MARRIED">પરિણિત (Married)</option>
                            <option value="DIVORCED">છૂટાછેડા (Divorced)</option>
                          </select>
                          {errors.maritalStatus && <p className="text-xs text-red-500 mt-0.5">{errors.maritalStatus}</p>}
                        </div>

                        {passportDetails.maritalStatus === 'MARRIED' && (
                          <div id="spouseName" className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">પતિ/પત્નીનું પૂરું નામ (Spouse Full Name) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={passportDetails.spouseName || ''}
                              onChange={e => handlePassportDetailsChange('spouseName', e.target.value.toUpperCase())}
                              placeholder="e.g. SUNITABEN PATEL"
                              className={`w-full bg-white border ${errors.spouseName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                            />
                            {errors.spouseName && <p className="text-xs text-red-500 mt-0.5">{errors.spouseName}</p>}
                          </div>
                        )}

                        <div id="passportType" className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">પાસપોર્ટ પ્રકાર (Passport Type) <span className="text-red-500">*</span></label>
                          <select
                            value={passportDetails.passportType || ''}
                            onChange={e => handlePassportDetailsChange('passportType', e.target.value)}
                            className={`w-full bg-white border ${errors.passportType ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                          >
                            <option value="">પસંદ કરો (Select)</option>
                            <option value="NORMAL">નોર્મલ (Normal Process)</option>
                            <option value="TATKAAL">તત્કાલ (Tatkaal Process)</option>
                          </select>
                          {errors.passportType && <p className="text-xs text-red-500 mt-0.5">{errors.passportType}</p>}
                        </div>
                      </div>
                    )}

                    {/* RENEW Passport specific fields */}
                    {passportDetails.passportCategory === 'RENEW' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-200/60">
                        <div id="passportNumber" className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">જૂનો પાસપોર્ટ નંબર (Old Passport No) <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={passportDetails.passportNumber || ''}
                            onChange={e => handlePassportDetailsChange('passportNumber', e.target.value.toUpperCase())}
                            placeholder="e.g. Z1234567"
                            className={`w-full bg-white border ${errors.passportNumber ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase font-mono`}
                          />
                          {errors.passportNumber && <p className="text-xs text-red-500 mt-0.5">{errors.passportNumber}</p>}
                        </div>

                        <div id="passportIssueDate" className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">ઈશ્યુ તારીખ (Issue Date) <span className="text-red-500">*</span></label>
                          <input
                            type="date"
                            value={passportDetails.passportIssueDate || ''}
                            onChange={e => handlePassportDetailsChange('passportIssueDate', e.target.value)}
                            className={`w-full bg-white border ${errors.passportIssueDate ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                          />
                          {errors.passportIssueDate && <p className="text-xs text-red-500 mt-0.5">{errors.passportIssueDate}</p>}
                        </div>

                        <div id="passportExpiryDate" className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">એક્સપાયરી તારીખ (Expiry Date) <span className="text-red-500">*</span></label>
                          <input
                            type="date"
                            value={passportDetails.passportExpiryDate || ''}
                            onChange={e => handlePassportDetailsChange('passportExpiryDate', e.target.value)}
                            className={`w-full bg-white border ${errors.passportExpiryDate ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm`}
                          />
                          {errors.passportExpiryDate && <p className="text-xs text-red-500 mt-0.5">{errors.passportExpiryDate}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* 3. Parents Name Section */}
                <section className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                      <Users className="h-4.5 w-4.5 text-indigo-600" /> ૩. માતા-પિતાની વિગતો (3. Parents Details)
                    </h3>
                  </div>

                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    {/* Father Details */}
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1">પિતાનું પૂરું નામ (Father's Full Name)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div id="fatherFirstName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">પિતાનું નામ (First Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.fatherFirstName}
                          onChange={e => handlePassportDetailsChange('fatherFirstName', e.target.value.toUpperCase())}
                          placeholder="e.g. AMBALAL"
                          className={`w-full bg-white border ${errors.fatherFirstName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.fatherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherFirstName}</p>}
                      </div>

                      <div id="fatherMiddleName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">દાદાનું નામ (Middle Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.fatherMiddleName}
                          onChange={e => handlePassportDetailsChange('fatherMiddleName', e.target.value.toUpperCase())}
                          placeholder="e.g. DEVJIBHAI"
                          className={`w-full bg-white border ${errors.fatherMiddleName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.fatherMiddleName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherMiddleName}</p>}
                      </div>

                      <div id="fatherLastName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">અટક (Last Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.fatherLastName}
                          onChange={e => handlePassportDetailsChange('fatherLastName', e.target.value.toUpperCase())}
                          placeholder="e.g. PATEL"
                          className={`w-full bg-white border ${errors.fatherLastName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.fatherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.fatherLastName}</p>}
                      </div>
                    </div>

                    {/* Mother Details */}
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1 pt-2">માતાનું પૂરું નામ (Mother's Full Name)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div id="motherFirstName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">માતાનું નામ (First Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.motherFirstName}
                          onChange={e => handlePassportDetailsChange('motherFirstName', e.target.value.toUpperCase())}
                          placeholder="e.g. SHARDABEN"
                          className={`w-full bg-white border ${errors.motherFirstName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.motherFirstName && <p className="text-xs text-red-500 mt-0.5">{errors.motherFirstName}</p>}
                      </div>

                      <div id="motherMiddleName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">પિતા/પતિનું નામ (Middle Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.motherMiddleName}
                          onChange={e => handlePassportDetailsChange('motherMiddleName', e.target.value.toUpperCase())}
                          placeholder="e.g. AMBALAL"
                          className={`w-full bg-white border ${errors.motherMiddleName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.motherMiddleName && <p className="text-xs text-red-500 mt-0.5">{errors.motherMiddleName}</p>}
                      </div>

                      <div id="motherLastName" className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">અટક (Last Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={passportDetails.motherLastName}
                          onChange={e => handlePassportDetailsChange('motherLastName', e.target.value.toUpperCase())}
                          placeholder="e.g. PATEL"
                          className={`w-full bg-white border ${errors.motherLastName ? 'border-red-400' : 'border-slate-200'} rounded-xl py-2 px-3.5 text-sm uppercase`}
                        />
                        {errors.motherLastName && <p className="text-xs text-red-500 mt-0.5">{errors.motherLastName}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Documents Upload Section */}
                <section className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-indigo-600" /> ૪. જરૂરી દસ્તાવેજો અપલોડ કરો (4. Required Documents Upload)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div id="passportPhoto">
                      <DocumentUploader
                        label="અરજદારનો પાસપોર્ટ સાઇઝ ફોટો *"
                        gujaratiLabel="Passport Size Photo (White Background)"
                        document={passportDocs.passportPhoto}
                        error={errors.passportPhoto}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, passportPhoto: doc }))}
                      />
                    </div>

                    <div id="signature">
                      <DocumentUploader
                        label="અરજદારની સહી (Signature) *"
                        gujaratiLabel="Applicant Signature on White Paper"
                        document={passportDocs.signature}
                        error={errors.signature}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, signature: doc }))}
                      />
                    </div>

                    <div id="aadharCardFront">
                      <DocumentUploader
                        label="આધાર કાર્ડ આગળનો ભાગ *"
                        gujaratiLabel="Aadhaar Card Front Side"
                        document={passportDocs.aadharCardFront}
                        error={errors.aadharCardFront}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, aadharCardFront: doc }))}
                      />
                    </div>

                    <div id="aadharCardBack">
                      <DocumentUploader
                        label="આધાર કાર્ડ પાછળનો ભાગ *"
                        gujaratiLabel="Aadhaar Card Back Side"
                        document={passportDocs.aadharCardBack}
                        error={errors.aadharCardBack}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, aadharCardBack: doc }))}
                      />
                    </div>

                    <div id="schoolLeaving">
                      <DocumentUploader
                        label="શાળા છોડ્યાનું પ્રમાણપત્ર (LC) *"
                        gujaratiLabel="School Leaving Certificate"
                        document={passportDocs.schoolLeaving}
                        error={errors.schoolLeaving}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, schoolLeaving: doc }))}
                      />
                    </div>

                    <div id="birthCertificate">
                      <DocumentUploader
                        label="જન્મનું પ્રમાણપત્ર *"
                        gujaratiLabel="Birth Certificate"
                        document={passportDocs.birthCertificate}
                        error={errors.birthCertificate}
                        onUpload={(doc) => setPassportDocs(prev => ({ ...prev, birthCertificate: doc }))}
                      />
                    </div>

                    {passportDetails.passportCategory === 'NEW' && (
                      <>
                        <div id="rationCardFront">
                          <DocumentUploader
                            label="રેશનકાર્ડ આગળનો ભાગ *"
                            gujaratiLabel="Ration Card Front Side"
                            document={passportDocs.rationCardFront || null}
                            error={errors.rationCardFront}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, rationCardFront: doc }))}
                          />
                        </div>

                        <div id="rationCardBack">
                          <DocumentUploader
                            label="રેશનકાર્ડ પાછળનો ભાગ *"
                            gujaratiLabel="Ration Card Back Side"
                            document={passportDocs.rationCardBack || null}
                            error={errors.rationCardBack}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, rationCardBack: doc }))}
                          />
                        </div>

                        <div id="studyResult">
                          <DocumentUploader
                            label="અભ્યાસનું પરિણામ (10th/12th Marksheet) *"
                            gujaratiLabel="Study Result / Educational Qualification Proof"
                            document={passportDocs.studyResult || null}
                            error={errors.studyResult}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, studyResult: doc }))}
                          />
                        </div>
                      </>
                    )}

                    {passportDetails.passportCategory === 'RENEW' && (
                      <>
                        <div id="voterIdFront">
                          <DocumentUploader
                            label="વોટર આઈડી કાર્ડ આગળનો ભાગ *"
                            gujaratiLabel="Voter ID Card Front Side"
                            document={passportDocs.voterIdFront || null}
                            error={errors.voterIdFront}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, voterIdFront: doc }))}
                          />
                        </div>

                        <div id="voterIdBack">
                          <DocumentUploader
                            label="વોટર આઈડી કાર્ડ પાછળનો ભાગ *"
                            gujaratiLabel="Voter ID Card Back Side"
                            document={passportDocs.voterIdBack || null}
                            error={errors.voterIdBack}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, voterIdBack: doc }))}
                          />
                        </div>

                        <div id="oldPassportFront">
                          <DocumentUploader
                            label="જૂનો પાસપોર્ટ પ્રથમ પેજ (Front Page) *"
                            gujaratiLabel="Old Passport First Page with Photo"
                            document={passportDocs.oldPassportFront || null}
                            error={errors.oldPassportFront}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, oldPassportFront: doc }))}
                          />
                        </div>

                        <div id="oldPassportBack">
                          <DocumentUploader
                            label="જૂનો પાસપોર્ટ છેલ્લું પેજ (Back Page) *"
                            gujaratiLabel="Old Passport Address Page"
                            document={passportDocs.oldPassportBack || null}
                            error={errors.oldPassportBack}
                            onUpload={(doc) => setPassportDocs(prev => ({ ...prev, oldPassportBack: doc }))}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>

      {/* Form Action Buttons (Save Draft & Submit) */}
      <div className="bg-slate-50 px-4 md:px-6 py-4 md:py-4.5 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-center rounded-b-3xl">
        <div className="text-xs text-slate-500 font-semibold text-left">
          * કૃપા કરીને સબમિટ કરતા પહેલા તમામ વિગતો ચકાસી લો. (Please verify all details before submitting.)
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="h-4 w-4 text-slate-500" />
            ડ્રાફ્ટ સેવ કરો (Save Draft)
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" />
            સબમિટ કરો (Save & Submit)
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPaymentStep && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-indigo-950 text-white px-6 py-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-10">
                  <Wallet className="h-24 w-24 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-indigo-900/50 rounded-lg shrink-0">
                    <Wallet className="h-5 w-5 text-indigo-300" />
                  </div>
                  <h3 className="text-base font-black font-display tracking-tight">ચુકવણી વિકલ્પ પસંદ કરો (Choose Payment Option)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  className="p-1.5 bg-indigo-950 hover:bg-indigo-800 text-indigo-200 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Application Fee Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-2xs">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">સેવાનો પ્રકાર (Service Type)</p>
                    <p className="text-xs font-black text-indigo-950 mt-0.5">
                      {formType === 'PAN_CARD' ? 'નવું પેન કાર્ડ અરજી (PAN Card)' :
                       formType === 'VOTER_ID' ? 'નવું વોટર આઈડી (Voter ID)' :
                       formType === 'E_SHRAM' ? 'નવું ઈ-શ્રમ કાર્ડ (E-Shram Card)' :
                       formType === 'FARMER_SUBSIDY' ? 'ખેડૂત સબસિડી (Farmer Subsidy)' :
                       formType === 'CAST_CERTIFICATE' ? 'જાતિ પ્રમાણપત્ર (Cast Certificate)' :
                       formType === 'INCOME_CERTIFICATE' ? 'આવક પ્રમાણપત્ર (Income Certificate)' :
                       formType === 'AYUSHYMAN_CARD' ? 'આયુષ્માન ભારત કાર્ડ (Ayushman)' :
                       formType === 'AABHA_CARD' ? 'આભા હેલ્થ કાર્ડ (Abha Health Card)' : 
                       formType === 'MANAV_KALYAN' ? 'માનવ કલ્યાણ યોજના (Manav Kalyan)' :
                       formType === 'KUVAR_BAI_MAMERU' ? 'કુંવરબાઈ મામેરું યોજના (Kuvar Bai Mameru)' : formType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">કુલ ફી (Total Fees)</p>
                    <p className="text-base font-black text-indigo-600 font-sans">₹ {SERVICE_PRICES[formType]}</p>
                  </div>
                </div>

                {/* Payment Options Selection Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {/* CASH button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMode('CASH')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPaymentMode === 'CASH'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <Wallet className={`h-6 w-6 mb-1.5 ${selectedPaymentMode === 'CASH' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-black leading-tight text-center">CASH (રોકડ)</span>
                    <span className="text-[9px] text-slate-500 mt-0.5 text-center">કાઉન્ટર પર ચૂકવો</span>
                  </button>

                  {/* ONLINE UPI button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMode('ONLINE')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPaymentMode === 'ONLINE'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <QrCode className={`h-6 w-6 mb-1.5 ${selectedPaymentMode === 'ONLINE' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-black leading-tight text-center">ONLINE (ઓનલાઇન)</span>
                    {currentDiscounts.upiDiscount > 0 ? (
                      <span className="text-[10px] text-emerald-600 font-extrabold text-center block mt-0.5">
                        ₹{upiPrice} ({currentDiscounts.upiDiscount}% OFF!)
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 mt-0.5 text-center">UPI QR કોડ સ્કેન</span>
                    )}
                  </button>

                  {/* WALLET button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMode('WALLET')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPaymentMode === 'WALLET'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <Wallet className={`h-6 w-6 mb-1.5 ${selectedPaymentMode === 'WALLET' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-black leading-tight text-center">WALLET (વોલેટ)</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold text-center block mt-0.5">
                      ₹{walletPrice} ({currentDiscounts.walletDiscount}% OFF!)
                    </span>
                    <span className="text-[9px] text-slate-550 mt-1 text-center font-bold">
                      {loadingWallet ? 'લોડિંગ...' : `બેલેન્સ: ₹${wallet?.balance ?? 0}`}
                    </span>
                  </button>
                </div>

                {/* Option Specific Details Area */}
                {selectedPaymentMode === 'CASH' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex space-y-3"
                  >
                    <div className="flex items-start gap-2.5 text-emerald-900">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs font-medium space-y-1">
                        <p className="font-bold">રોકડા ચુકવણી પસંદ કરેલ છે! (CASH Mode Selected)</p>
                        <p className="leading-relaxed text-emerald-800">
                          કૃપા કરીને સેવા સબમિટ કર્યા પછી તમારા રોકડા પૈસા <strong>₹{SERVICE_PRICES[formType]}</strong> દુકાન પર કાઉન્ટર પર ચૂકવો.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedPaymentMode === 'ONLINE' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 bg-slate-50/80 rounded-2xl p-4 flex flex-col items-center space-y-4"
                  >
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-slate-800">ઓનલાઇન UPI QR કોડ (Online UPI Code)</p>
                      <p className="text-[11px] text-indigo-700 font-semibold leading-relaxed">
                        નીચેનો QR કોડ તમારા Google Pay, PhonePe, Paytm, અથવા કોઈપણ UPI એપથી સ્કેન કરી <strong>₹{upiPrice}</strong> ચૂકવો.
                        {currentDiscounts.upiDiscount > 0 && <span className="block text-[10px] text-emerald-600 font-black mt-0.5">({currentDiscounts.upiDiscount}% ડિસ્કાઉન્ટ લાગુ કરેલ છે!)</span>}
                      </p>
                    </div>

                    {/* QR Code generator integration */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                           `upi://pay?pa=bsporiya9@okaxis&pn=DAY%20INFOTECH&am=${upiPrice}&cu=INR&tn=Application%20Fee%20${formType}`
                        )}`}
                        alt="UPI Payment QR Code"
                        className="h-44 w-44 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center space-y-0.5 text-[11px]">
                      <p className="text-slate-500">UPI ID: <strong className="text-slate-900 font-mono">bsporiya9@okaxis</strong></p>
                      <p className="text-slate-500">નામ (Payee Name): <strong className="text-slate-900">DAY INFOTECH</strong></p>
                    </div>
                  </motion.div>
                )}

                {selectedPaymentMode === 'WALLET' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {loadingWallet ? (
                      <div className="flex justify-center p-4">
                        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : (() => {
                      const hasEnough = (wallet?.balance ?? 0) >= walletPrice;
                      return (
                        <div className="space-y-4">
                          <div className={`border rounded-2xl p-4 flex flex-col space-y-2 ${
                            hasEnough
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle className={`h-5 w-5 shrink-0 mt-0.5 ${
                                hasEnough ? 'text-emerald-600' : 'text-rose-600'
                              }`} />
                              <div className="text-xs font-medium space-y-1">
                                <p className="font-bold">
                                  {hasEnough
                                    ? `વોલેટમાંથી ચુકવણી ઉપલબ્ધ છે! (Wallet Payment Available - ${currentDiscounts.walletDiscount}% Discount Applied)`
                                    : 'વોલેટમાં પૂરતું બેલેન્સ નથી! (Insufficient Wallet Balance)'}
                                </p>
                                <p className="leading-relaxed">
                                  તમારું વોલેટ બેલેન્સ <strong>₹{wallet?.balance ?? 0}</strong> છે અને આ ફોર્મની ફી (${currentDiscounts.walletDiscount}% ડિસ્કાઉન્ટ સાથે) <strong>₹{walletPrice}</strong> છે (મૂળ કિંમત ₹{SERVICE_PRICES[formType]}).
                                </p>
                                {!hasEnough ? (
                                  <p className="text-rose-700 font-black mt-1 leading-normal">
                                    કૃપા કરીને પહેલા તમારા વોલેટમાં બેલેન્સ એડ કરો. લઘુત્તમ ₹100 એડ કરી શકાશે. (આ ફોર્મ સબમિટ કરવા માટે ₹{walletPrice - (wallet?.balance ?? 0)} વધુ જરૂરી છે.)
                                  </p>
                                ) : (
                                  <p className="text-emerald-700 font-black mt-1 leading-normal">
                                    સબમિટ બટન દબાવતા તમારા વોલેટમાંથી (${currentDiscounts.walletDiscount}% ડિસ્કાઉન્ટ સાથે) ₹{walletPrice} આપમેળે કપાઈ જશે.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Inline Top-up Option */}
                          {getLoggedInUser()?.uid ? (
                            <div className="space-y-3">
                              {!showInlineTopup ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowInlineTopup(true);
                                    setInlineAmount(Math.max(100, walletPrice - (wallet?.balance ?? 0)).toString());
                                    setInlineStep('AMOUNT');
                                    setInlineUtr('');
                                    setInlineError(null);
                                  }}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                >
                                  <PlusCircle className="h-4 w-4 shrink-0" />
                                  વોલેટમાં પૈસા ઉમેરો (Add Money to Wallet)
                                </button>
                              ) : (
                                <div className="bg-slate-950/95 border border-slate-800 p-4 rounded-2xl space-y-4 text-left">
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                                      <Wallet className="h-4 w-4 text-amber-500" /> વોલેટ એડ મની (Recharge Wallet)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setShowInlineTopup(false)}
                                      className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {inlineError && (
                                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold rounded-lg leading-relaxed">
                                      {inlineError}
                                    </div>
                                  )}

                                  {inlineStep === 'AMOUNT' && (
                                    <div className="space-y-3.5">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">રકમ (Enter Amount - Min ₹100)</label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-amber-500">₹</span>
                                          <input
                                            type="number"
                                            min="100"
                                            value={inlineAmount}
                                            onChange={e => setInlineAmount(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-bold text-xs focus:border-amber-500 outline-hidden font-mono"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const amt = parseFloat(inlineAmount);
                                          if (isNaN(amt) || amt < 100) {
                                            setInlineError('લઘુત્તમ રકમ ₹100 હોવી જોઈએ!');
                                            return;
                                          }
                                          setInlineStep('QR');
                                        }}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg active:scale-95 transition-all cursor-pointer text-center"
                                      >
                                        આગળ વધો (Generate QR Code)
                                      </button>
                                    </div>
                                  )}

                                  {inlineStep === 'QR' && (
                                    <form onSubmit={handleInlineTopupSubmit} className="space-y-4">
                                      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl max-w-[170px] mx-auto border border-slate-200 shadow-sm">
                                        <img
                                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                            `upi://pay?pa=bsporiya9-1@okicici&pn=DAY%20INFOTECH&am=${inlineAmount}&cu=INR&tn=Form%20Wallet%20Topup`
                                          )}`}
                                          alt="UPI QR Code"
                                          className="h-36 w-36 object-contain"
                                          referrerPolicy="no-referrer"
                                        />
                                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">UPI QR CODE - ₹{inlineAmount}</p>
                                      </div>

                                      <div className="space-y-1 text-[11px] text-slate-300">
                                        <p className="font-bold leading-normal">
                                          ૧. ઉપરનો QR કોડ સ્કેન કરી ₹{inlineAmount} ચૂકવો.
                                        </p>
                                        <p className="font-bold leading-normal">
                                          ૨. ચુકવણી પછી બેંકમાંથી મળેલો ૧૨-આંકડાનો UTR (ટ્રાન્ઝેક્શન આઈડી) નીચે લખો:
                                        </p>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">UTR / ટ્રાન્ઝેક્શન નંબર</label>
                                        <input
                                          type="text"
                                          required
                                          maxLength={12}
                                          value={inlineUtr}
                                          onChange={e => setInlineUtr(e.target.value.replace(/[^0-9]/g, ''))}
                                          placeholder="દા.ત. 612845601894"
                                          className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-bold text-xs focus:border-amber-500 outline-hidden font-mono"
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setInlineStep('AMOUNT')}
                                          className="flex-1 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-905 font-bold text-xs cursor-pointer text-center"
                                        >
                                          પાછા (Back)
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={isInlineSubmitting}
                                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1"
                                        >
                                          {isInlineSubmitting && <RefreshCw className="h-3 w-3 animate-spin" />}
                                          સબમિટ કરો
                                        </button>
                                      </div>
                                    </form>
                                  )}

                                  {inlineStep === 'SUCCESS' && (
                                    <div className="text-center space-y-3 py-2">
                                      <div className="mx-auto w-10 h-10 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/25">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-xs font-black text-emerald-400">વિનંતી સબમિટ થઈ ગઈ છે!</h4>
                                        <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                          તમારી ₹{inlineAmount} ની વિનંતી ઓનરને મોકલાઈ છે. તે મંજૂર થતાં જ તમારું વોલેટ બેલેન્સ વધી જશે અને તમે સબમિટ કરી શકશો.
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setShowInlineTopup(false)}
                                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-[10px] rounded-lg cursor-pointer"
                                      >
                                        બંધ કરો (Close)
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 bg-rose-950/15 border border-rose-900/35 rounded-xl text-rose-200 text-left text-[11px] font-bold leading-normal mt-2">
                              ⚠️ તમે મહેમાન મોડમાં ફોર્મ ભરી રહ્યા છો. વોલેટમાંથી ડાયરેક્ટ પેમેન્ટ કરવા અથવા વોલેટ રિચાર્જ કરવા માટે કૃપા કરીને પહેલા તમારા અરજદાર અકાઉન્ટથી લૉગ ઇન કરો.
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

              </div>

              {/* Modal Action Buttons Footer */}
              <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer text-center"
                >
                  પાછા જાઓ (Back)
                </button>

                <button
                  type="button"
                  disabled={
                    !selectedPaymentMode || 
                    isSubmitting || 
                    (selectedPaymentMode === 'WALLET' && !loadingWallet && (wallet?.balance ?? 0) < walletPrice)
                  }
                  onClick={() => {
                    if (selectedPaymentMode) {
                      proceedWithSave(false, selectedPaymentMode, finalPrice, selectedPaymentMode === 'WALLET' ? 'PAID' : 'PENDING');
                    }
                  }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md transition-all ${
                    (!selectedPaymentMode || (selectedPaymentMode === 'WALLET' && !loadingWallet && (wallet?.balance ?? 0) < walletPrice))
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>ચુકવણી કન્ફર્મ કરી ફોર્મ સબમિટ કરો (Confirm & Submit)</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {showSuccessModal && submittedEntry && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Green Success Header */}
              <div className="bg-emerald-600 text-white p-6 text-center space-y-2 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-10">
                  <CheckCircle className="h-28 w-28 text-white" />
                </div>
                <div className="mx-auto w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-1">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-black font-display tracking-tight">અرજી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે!</h3>
                <p className="text-[10px] text-emerald-100 font-bold tracking-widest uppercase font-mono">
                  Application Submitted Successfully
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">અરજી ID (App ID)</span>
                    <span className="font-mono font-bold text-slate-800">{submittedEntry.id}</span>
                  </div>
                  <div className="flex justify-between items-start text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold shrink-0">સેવા (Service)</span>
                    <span className="font-bold text-slate-800 text-right">{getServiceLabel(submittedEntry.formType)}</span>
                  </div>
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-slate-500 font-bold shrink-0">અરજદાર (Applicant)</span>
                    <span className="font-bold text-indigo-600 text-right">{getApplicantName(submittedEntry.formType, submittedEntry.details)}</span>
                  </div>
                </div>

                {/* Notification Cards */}
                {!isOwner() ? (
                  /* Applicant Mode: Only show "Notify Owner via WhatsApp" */
                  <div className="space-y-3">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2.5 text-emerald-800">
                        <div className="p-1 bg-emerald-600 text-white rounded-lg shrink-0">
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                          </svg>
                        </div>
                        <span className="text-xs font-black">માલિકને વોટ્સએપ પર અરજીની જાણ કરો (Notify Owner)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                        આ અરજી સફળતાપૂર્વક સેવ થઈ ગઈ છે. માલિકના વ્હોટ્સએપ નંબર <strong className="text-slate-800">7600361873</strong> પર અરજીની ઓનલાઈન જાણ કરો.
                      </p>
                    </div>
                    
                    <p className="text-[10px] text-center text-slate-400 font-bold bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
                      નોંધ: તમારી અરજી સફળતાપૂર્વક સિસ્ટમમાં સબમિટ થઈ ગઈ છે. વ્હોટ્સએપ દ્વારા જાણ ન કરો તો પણ અરજી સેવ જ રહેશે.
                    </p>
                  </div>
                ) : (
                  /* Owner Mode: Only show "Notify Applicant" */
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2.5 text-indigo-800">
                      <div className="p-1 bg-indigo-600 text-white rounded-lg shrink-0">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                        </svg>
                      </div>
                      <span className="text-xs font-black">અરજદારને કન્ફર્મેશન મોકલો (Notify Applicant)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      અરજદારને સીધો વ્હોટ્સએપ અથવા એસએમએસ મોકલો કે તેમની અરજી સફળતાપૂર્વક મળી ગઈ છે.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-100 flex flex-col gap-2">
                {!isOwner() ? (
                  /* Applicant Mode Footer Actions */
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSuccessModal(false);
                        onSuccess();
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer text-center flex-1 sm:flex-none"
                    >
                      બંધ કરો (Close)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const url = getWhatsAppUrl(submittedEntry);
                        window.open(url, '_blank');
                        setShowSuccessModal(false);
                        onSuccess();
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-white shadow-xs bg-emerald-600 hover:bg-emerald-700 transition-all flex-1"
                    >
                      <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                      </svg>
                      <span>માલિકને વોટ્સએપ પર જણાવો (Notify Owner via WhatsApp)</span>
                    </button>
                  </div>
                ) : (
                  /* Owner Mode Footer Actions */
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSuccessModal(false);
                          onSuccess();
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer text-center flex-1 sm:flex-none"
                      >
                        બંધ કરો (Close)
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const url = getApplicantNotificationSMSUrl(submittedEntry);
                          window.open(url, '_self');
                          setShowSuccessModal(false);
                          onSuccess();
                        }}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex-1"
                      >
                        <span>💬 SMS દ્વારા અરજદારને જણાવો (SMS Customer)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const url = getApplicantNotificationWhatsAppUrl(submittedEntry);
                          window.open(url, '_blank');
                          setShowSuccessModal(false);
                          onSuccess();
                        }}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-white shadow-xs bg-indigo-600 hover:bg-indigo-700 transition-all flex-1"
                      >
                        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.761.459 3.475 1.332 4.992L2 22l5.228-1.371a9.923 9.923 0 004.776 1.375h.004c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm6.65 14.22c-.273.768-1.353 1.4-1.854 1.493-.459.085-1.054.154-3.048-.67-2.548-1.053-4.184-3.663-4.31-3.834-.127-.17-1.025-1.37-1.025-2.613 0-1.243.649-1.854.88-2.102.231-.248.504-.31.67-.31h.483c.154 0 .363-.058.568.441.21.509.718 1.751.78 1.879.063.128.105.278.021.449-.084.17-.126.277-.252.427-.126.15-.264.336-.378.462-.126.139-.258.29-.111.543.147.252.654 1.077 1.403 1.748.966.863 1.782 1.132 2.034 1.258.252.127.4-.105.547-.277.164-.19.714-.833.903-1.116.19-.283.378-.235.638-.139.26.096 1.647.777 1.93.918.283.141.472.21.542.33.07.12.07.693-.203 1.461z" />
                        </svg>
                        <span>વોટ્સએપ દ્વારા જણાવો (WhatsApp Customer)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
