import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, QrCode, CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight, 
  Search, Plus, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownLeft, Info, HelpCircle, User, Phone, Check, CheckSquare, X,
  TrendingUp, PlusCircle, ShoppingBag, BookOpen, Coins, Smartphone, Copy
} from 'lucide-react';
import { Wallet as WalletType, WalletTransaction } from '../types';
import { 
  getWallet, 
  getWalletTransactions, 
  createWalletTransaction, 
  requestWalletRefund, 
  approveWalletDeposit, 
  rejectWalletDeposit, 
  approveWalletRefund, 
  rejectWalletRefund,
  getLoggedInUser,
  isOwner,
  getAllWallets
} from '../utils/db';
import { THEMES } from '../utils/theme';

interface WalletDashboardProps {
  themeId: string;
  refreshTrigger: number;
  onRefreshStats?: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  themeId, 
  refreshTrigger,
  onRefreshStats 
}) => {
  const activeTheme = THEMES[themeId] || THEMES.light;
  const isDark = themeId === 'dark';

  // Auth & user info
  const user = getLoggedInUser();
  const userId = user?.uid || 'guest_user';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const userMobile = user?.mobile || '';

  // Core wallet & tx states
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [allWallets, setAllWallets] = useState<WalletType[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);

  // Deposit form states
  const [depositStep, setDepositStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [depositAmount, setDepositAmount] = useState<string>('200');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSuccessTx, setDepositSuccessTx] = useState<WalletTransaction | null>(null);
  const [paymentMode, setPaymentMode] = useState<'NONE' | 'QR' | 'UPI_APP'>('NONE');

  // Refund form states
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundMethod, setRefundMethod] = useState<'CASH' | 'UPI'>('UPI');
  const [refundUpiId, setRefundUpiId] = useState<string>('');
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<boolean>(false);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Admin approval states
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [adminActionTx, setAdminActionTx] = useState<WalletTransaction | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<'APPROVE' | 'REJECT' | null>(null);

  // Search filter for transactions
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [overviewSearchQuery, setOverviewSearchQuery] = useState('');
  const [selectedUserReportId, setSelectedUserReportId] = useState<string | null>(null);

  // Active sub-tab inside Wallet
  const [subTab, setSubTab] = useState<'BALANCE' | 'HISTORY' | 'REFUND' | 'ADMIN_DEPOSITS' | 'ADMIN_REFUNDS' | 'ADMIN_ALL' | 'ADMIN_OVERVIEW'>(() => {
    return isOwner() ? 'ADMIN_DEPOSITS' : 'BALANCE';
  });

  // Fetch Wallet and Transactions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current wallet (or initializes if not exists)
        const walletData = await getWallet(userId);
        setWallet(walletData);

        // Fetch wallet transactions (if owner, fetches all; if user, fetches user-specific)
        const txData = await getWalletTransactions(isOwner() ? undefined : userId);
        setTransactions(txData);

        // Fetch all wallets if owner
        if (isOwner()) {
          const walletsData = await getAllWallets();
          setAllWallets(walletsData);
        }
      } catch (e) {
        console.error('Error fetching wallet data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, localRefresh, refreshTrigger]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 50 || amount > 500) {
      setDepositError('ડિપોઝિટ રકમ ₹૫૦ થી ₹૫૦૦ ની વચ્ચે હોવી જોઈએ! (Deposit amount must be between ₹50 and ₹500)');
      return;
    }

    if (!utrNumber.trim()) {
      setDepositError('કૃપા કરીને ટ્રાન્ઝેક્શન યુટીઆર (UTR) નંબર દાખલ કરો! (Transaction reference number is required)');
      return;
    }

    setIsSubmitting(true);
    try {
      const pendingTx = await createWalletTransaction({
        userId,
        userName,
        userMobile,
        amount,
        type: 'DEPOSIT_REQUEST',
        status: 'PENDING',
        paymentMethod: 'UPI_QR',
        referenceId: utrNumber.trim(),
        notes: `વોલેટ ટોપઅપ વિનંતી (${paymentMode === 'UPI_APP' ? 'UPI App' : 'QR Code'} દ્વારા)`
      });

      setDepositSuccessTx(pendingTx);
      setDepositStep('SUCCESS');
      setUtrNumber('');
      setPaymentMode('NONE'); // Reset mode for next transactions
      setLocalRefresh(prev => prev + 1);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      setDepositError(err.message || 'ડિપોઝિટ વિનંતી સબમિટ કરવામાં ભૂલ આવી! (Error submitting request)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRefundError(null);
    setRefundSuccess(false);

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      setRefundError('કૃપા કરીને મંજૂર રિફંડ રકમ દાખલ કરો! (Please enter a valid amount)');
      return;
    }

    if (wallet && wallet.balance < amount) {
      setRefundError(`અપૂરતું બેલેન્સ છે! તમારી પાસે ફક્ત ₹${wallet.balance} ઉપલબ્ધ છે. (Insufficient balance)`);
      return;
    }

    if (refundMethod === 'UPI' && !refundUpiId.trim()) {
      setRefundError('કૃપા કરીને તમારું UPI ID દાખલ કરો! (Please enter your UPI ID)');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestWalletRefund(userId, amount, userName, userMobile, refundMethod, refundUpiId);
      setRefundSuccess(true);
      setRefundAmount('');
      setRefundUpiId('');
      setLocalRefresh(prev => prev + 1);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      setRefundError(err.message || 'રિફંડ વિનંતી સબમિટ કરવામાં ભૂલ આવી! (Error submitting refund request)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminApprove = async () => {
    if (!adminActionTx) return;
    setIsSubmitting(true);
    try {
      if (adminActionTx.type === 'DEPOSIT_REQUEST') {
        await approveWalletDeposit(adminActionTx.id);
      } else if (adminActionTx.type === 'REFUND_REQUEST') {
        await approveWalletRefund(adminActionTx.id);
      }
      
      setShowAdminModal(null);
      setAdminActionTx(null);
      setAdminNotes('');
      setLocalRefresh(prev => prev + 1);
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminReject = async () => {
    if (!adminActionTx) return;
    setIsSubmitting(true);
    try {
      if (adminActionTx.type === 'DEPOSIT_REQUEST') {
        await rejectWalletDeposit(adminActionTx.id, adminNotes);
      } else if (adminActionTx.type === 'REFUND_REQUEST') {
        await rejectWalletRefund(adminActionTx.id, adminNotes);
      }
      
      setShowAdminModal(null);
      setAdminActionTx(null);
      setAdminNotes('');
      setLocalRefresh(prev => prev + 1);
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered transactions for search
  const filteredTxs = transactions.filter(t => {
    const q = txSearchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      (t.referenceId || '').toLowerCase().includes(q) ||
      (t.userName || '').toLowerCase().includes(q) ||
      t.userMobile.includes(q) ||
      t.notes?.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  });

  // Split admin transactions
  const pendingDeposits = transactions.filter(t => t.type === 'DEPOSIT_REQUEST' && t.status === 'PENDING');
  const pendingRefunds = transactions.filter(t => t.type === 'REFUND_REQUEST' && t.status === 'PENDING');

  const totalAllWalletsBalance = React.useMemo(() => {
    return allWallets.reduce((acc, w) => acc + w.balance, 0);
  }, [allWallets]);

  const totalSystemDeposits = React.useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.status === 'COMPLETED' && tx.type === 'DEPOSIT_REQUEST') {
        return acc + tx.amount;
      }
      return acc;
    }, 0);
  }, [transactions]);

  const totalSystemSpent = React.useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.status === 'COMPLETED' && tx.type === 'PAYMENT') {
        return acc + tx.amount;
      }
      return acc;
    }, 0);
  }, [transactions]);

  const userWalletStatsMap = React.useMemo(() => {
    if (!isOwner()) return [];

    const stats: Record<string, {
      userId: string;
      userName: string;
      userMobile: string;
      balance: number;
      totalDeposited: number;
      totalSpent: number;
      spendCount: number;
      depositCount: number;
      serviceUsage: { serviceLabel: string; amount: number; date: string }[];
    }> = {};

    // Initialize with all wallets
    allWallets.forEach(w => {
      stats[w.userId] = {
        userId: w.userId,
        userName: 'અજાણ્યો યુઝર (Unknown User)',
        userMobile: '',
        balance: w.balance,
        totalDeposited: 0,
        totalSpent: 0,
        spendCount: 0,
        depositCount: 0,
        serviceUsage: []
      };
    });

    // Populate using transactions
    transactions.forEach(tx => {
      if (!stats[tx.userId]) {
        stats[tx.userId] = {
          userId: tx.userId,
          userName: tx.userName || 'અજાણ્યો યુઝર',
          userMobile: tx.userMobile || '',
          balance: 0,
          totalDeposited: 0,
          totalSpent: 0,
          spendCount: 0,
          depositCount: 0,
          serviceUsage: []
        };
      }

      const userStat = stats[tx.userId];
      
      if (tx.userName && tx.userName !== 'Guest' && tx.userName !== 'guest_user') {
        userStat.userName = tx.userName;
      }
      if (tx.userMobile) {
        userStat.userMobile = tx.userMobile;
      }

      if (tx.status === 'COMPLETED') {
        if (tx.type === 'DEPOSIT_REQUEST') {
          userStat.totalDeposited += tx.amount;
          userStat.depositCount += 1;
        } else if (tx.type === 'PAYMENT') {
          userStat.totalSpent += tx.amount;
          userStat.spendCount += 1;
          
          let serviceLabel = 'સર્વિસ ચુકવણી';
          if (tx.notes) {
            const match = tx.notes.match(/(.+) અરજી/);
            if (match) {
              serviceLabel = match[1];
            } else {
              serviceLabel = tx.notes;
            }
          }
          userStat.serviceUsage.push({
            serviceLabel,
            amount: tx.amount,
            date: tx.createdAt
          });
        }
      }
    });

    return Object.values(stats);
  }, [allWallets, transactions]);

  const getTxTypeBadge = (type: string, status: string) => {
    switch (type) {
      case 'DEPOSIT_REQUEST':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
            જમા વિનંતી (Pending Deposit)
          </span>
        );
      case 'DEPOSIT_APPROVED':
      case 'DEPOSIT_COMPLETED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            જમા સફળ (Deposit Approved)
          </span>
        );
      case 'DEPOSIT_REJECTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
            જમા ના-મંજૂર (Deposit Rejected)
          </span>
        );
      case 'PAYMENT':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            ફોર્મ ચુકવણી (Form Payment)
          </span>
        );
      case 'REFUND_REQUEST':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            રિફંડ વિનંતી (Pending Refund)
          </span>
        );
      case 'REFUND_APPROVED':
      case 'REFUND_COMPLETED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            રિફંડ સફળ (Refund Completed)
          </span>
        );
      case 'REFUND_REJECTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
            રિફંડ ના-મંજૂર (Refund Rejected)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400">
            {type}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse font-sans">
            પેન્ડિંગ (PENDING)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
            સફળ (SUCCESSFUL)
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-sans">
            નામંજૂર (REJECTED)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-slate-500/10 text-slate-400 font-sans">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title Grid */}
      <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30"></div>
        
        <div className="space-y-1 relative z-10">
          <h2 className={`text-xl font-black font-display tracking-tight flex items-center gap-2.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <div className="p-2 bg-amber-500/15 border border-amber-500/25 rounded-xl text-amber-500 shrink-0">
              <Wallet className="h-6 w-6" />
            </div>
            DAY INFOTECH વોલેટ સર્વિસ (Wallet Portal)
          </h2>
          <p className="text-xs text-slate-400 font-semibold max-w-xl">
            તમારા ઓનલાઈન ફોર્મની ચુકવણી ઝડપી બનાવવા વોલેટ નો ઉપયોગ કરો. ₹100 થી ગમે તેટલા પૈસા ઓટોમેટિક સ્કેન કરીને જમા કરી શકો છો.
          </p>
        </div>

        {/* Current Wallet Balance Card */}
        <div className="bg-slate-950/45 border border-slate-700/40 p-4.5 rounded-2xl flex items-center gap-4.5 shrink-0 w-full md:w-auto relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Wallet className="h-24 w-24 text-white" />
          </div>
          <div className="p-3.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none font-sans">હાલનું વોલેટ બેલેન્સ (CURRENT BALANCE)</p>
            <h3 className="text-2xl font-black text-white font-sans mt-1">
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-white" />
              ) : (
                `₹ ${wallet?.balance ?? 0}`
              )}
            </h3>
            <p className="text-[9px] text-slate-400 mt-0.5 font-bold font-mono">
              અકાઉન્ટ ID: {userId.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Bar Navigation */}
      <div className="flex border-b border-slate-700/40 pb-0.5 overflow-x-auto gap-2 scrollbar-none">
        {/* Applicant Options */}
        {!isOwner() && (
          <>
            <button
              onClick={() => setSubTab('BALANCE')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer ${
                subTab === 'BALANCE'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              પૈસા ઉમેરો (Add Money)
            </button>
            <button
              onClick={() => setSubTab('HISTORY')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer ${
                subTab === 'HISTORY'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              ચુકવણી ઇતિહાસ (Transactions)
            </button>
            <button
              onClick={() => setSubTab('REFUND')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer ${
                subTab === 'REFUND'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              રિફંડ મેળવો (Request Refund)
            </button>
          </>
        )}

        {/* Owner/Admin Options */}
        {isOwner() && (
          <>
            <button
              onClick={() => setSubTab('ADMIN_DEPOSITS')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                subTab === 'ADMIN_DEPOSITS'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              પેન્ડિંગ ડિપોઝિટ (Pending Deposits)
              {pendingDeposits.length > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-md animate-pulse">
                  {pendingDeposits.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSubTab('ADMIN_REFUNDS')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                subTab === 'ADMIN_REFUNDS'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              રિફંડ વિનંતીઓ (Refund Requests)
              {pendingRefunds.length > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-purple-600 text-white rounded-md animate-pulse">
                  {pendingRefunds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSubTab('ADMIN_ALL')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer ${
                subTab === 'ADMIN_ALL'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              બધી વોલેટ લેવડ-દેવડ (All Ledger)
            </button>
            <button
              onClick={() => setSubTab('ADMIN_OVERVIEW')}
              className={`px-3 py-1.5 text-xs font-black border-b-2 font-sans transition-all shrink-0 cursor-pointer ${
                subTab === 'ADMIN_OVERVIEW'
                  ? 'border-amber-500 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              વોલેટ્સ રિપોર્ટ (Wallets Overview)
            </button>
          </>
        )}
      </div>

      {/* Subtab Contents Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold font-sans">ડેટા લોડ થઈ રહ્યો છે, કૃપા કરીને થોડી રાહ જુઓ...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB: BALANCE (Add Money QR) */}
            {subTab === 'BALANCE' && (
              userId === 'guest_user' ? (
                <div className={`w-full ${activeTheme.cardBg} border-2 border-dashed border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-lg max-w-4xl mx-auto mt-4`}>
                  <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border border-rose-500/25">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-rose-500 font-display">⚠️ લોગિન કરવું જરૂરી છે! (Login Required)</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto">
                      વ્યક્તિગત વોલેટ મેળવવા અને તેમાં પૈસા ઉમેરવા માટે કૃપા કરીને પહેલા તમારા અકાઉન્ટથી લોગિન કરો. મહેમાન (Guest) મોડમાં પેમેન્ટ ટ્રેક કરી શકાશે નહીં.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 font-bold">
                      મહેરબાની કરીને ડેશબોર્ડમાં ઉપર જઈને <strong className="text-emerald-400">"અરજદાર લોગિન કરો"</strong> બટન પર ક્લિક કરીને લોગિન કરો.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-4"
                >
                  {/* Left Side: Enter Deposit Amount */}
                  <div className={`lg:col-span-3 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 space-y-4 shadow-lg`}>
                    <div className="space-y-1">
                      <h3 className={`text-base font-black ${isDark ? 'text-slate-200' : 'text-slate-800'} flex items-center gap-2`}>
                        <Plus className="h-5 w-5 text-amber-400" /> વોલેટમાં રકમ ઉમેરો (Add Money to Wallet)
                      </h3>
                    </div>

                    {depositError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{depositError}</span>
                      </div>
                    )}

                    {depositStep === 'FORM' ? (
                      <form onSubmit={handleDepositSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">ડિપોઝિટ રકમ (DEPOSIT AMOUNT - INR)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-500">₹</span>
                            <input
                              type="number"
                              min="50"
                              max="500"
                              value={depositAmount}
                              onChange={(e) => {
                                setDepositAmount(e.target.value);
                                setDepositError(null);
                                setPaymentMode('NONE'); // Reset selected payment method when amount is modified
                              }}
                              className="w-full pl-8 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/60 rounded-xl font-bold text-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all"
                              placeholder="રકમ ₹૫૦ થી ₹૫૦૦ સુધી ઉમેરો"
                            />
                          </div>
                          <p className="text-[10px] text-amber-500/85 font-semibold">
                            * ઓછામાં ઓછા ₹૫૦ અને વધુમાં વધુ ₹૫૦૦ જમા કરી શકાશે. (Limit: ₹50 - ₹500)
                          </p>
                        </div>

                        {/* Preset Amounts Fast Selection */}
                        <div className="grid grid-cols-4 gap-2.5">
                          {['50', '100', '200', '500'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setDepositAmount(preset);
                                setDepositError(null);
                                setPaymentMode('NONE'); // Reset selected method
                              }}
                              className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                                depositAmount === preset
                                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                                  : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              + ₹{preset}
                            </button>
                          ))}
                        </div>

                        {/* Payment Method Selector & Transaction ID display */}
                        {(() => {
                          const amt = parseFloat(depositAmount);
                          const isValidAmount = !isNaN(amt) && amt >= 50 && amt <= 500;

                          if (!isValidAmount) {
                            return (
                              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold rounded-xl flex items-center gap-2">
                                <Info className="h-4 w-4 shrink-0" />
                                <span>આગળ વધવા માટે ₹૫૦ થી ₹૫૦૦ ની વચ્ચે રકમ પસંદ કરો. (Enter between ₹50 and ₹500 to proceed)</span>
                              </div>
                            );
                          }

                          if (paymentMode === 'NONE') {
                            return (
                              <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                                  ચૂકવણી પદ્ધતિ પસંદ કરો (SELECT PAYMENT METHOD)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMode('QR')}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-400 font-extrabold text-xs rounded-xl cursor-pointer transition-all active:scale-98"
                                  >
                                    <QrCode className="h-4 w-4 text-amber-500" />
                                    <span>ક્યુઆર કોડ બનાવો (Generate QR Code)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPaymentMode('UPI_APP');
                                      // Trigger launch of UPI app on mobile
                                      window.location.href = `upi://pay?pa=bsporiya9-1@okicici&pn=DAY%20INFOTECH&am=${depositAmount}&cu=INR&tn=Wallet%20Topup%20${userMobile}`;
                                    }}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-indigo-400 font-extrabold text-xs rounded-xl cursor-pointer transition-all active:scale-98"
                                  >
                                    <Smartphone className="h-4 w-4 text-indigo-400" />
                                    <span>UPI એપથી ચૂકવો (Pay by UPI App)</span>
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-4 pt-2">
                              {/* Selection Info */}
                              <div className="flex items-center justify-between p-3 bg-slate-950/45 border border-slate-800 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                                    {paymentMode === 'QR' ? <QrCode className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                                  </div>
                                  <span className="text-xs font-bold text-white">
                                    {paymentMode === 'QR' ? 'પસંદ કરેલ: ક્યુઆર કોડ (QR Code)' : 'પસંદ કરેલ: UPI એપ્લિકેશન (Pay by UPI)'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPaymentMode('NONE')}
                                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                                >
                                  પદ્ધતિ બદલો (Change Method)
                                </button>
                              </div>

                              {/* Transaction ID / UTR Box (Shows ONLY after payment is initiated) */}
                              <div className="space-y-1.5 p-4 bg-slate-950/45 border border-amber-500/20 rounded-2xl animate-fadeIn">
                                <div className="flex items-center gap-1.5 text-amber-400">
                                  <CheckSquare className="h-4 w-4 shrink-0" />
                                  <label className="text-[10px] font-black uppercase tracking-widest block font-sans">
                                    ટ્રાન્ઝેક્શન UTR / રેફરન્સ નંબર (ENTER 12-DIGIT UTR/Tx ID)
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  required
                                  maxLength={24}
                                  value={utrNumber}
                                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                                  placeholder="દા.ત. 612845601894"
                                  className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/60 rounded-xl font-bold text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all font-mono"
                                />
                                <p className="text-[9px] text-slate-400 leading-normal">
                                  * તમે પેમેન્ટ ચૂકવી દીધા પછી તેની રસીદમાં દેખાતો ૧૨ આંકડાનો UTR નંબર અહીં લખીને "વિનંતી સબમિટ કરો" બટન પર ક્લિક કરો.
                                </p>
                              </div>

                              {/* Submit button */}
                              <button
                                type="submit"
                                disabled={isSubmitting || !utrNumber.trim()}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                                  !utrNumber.trim()
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-750'
                                    : 'bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-98'
                                }`}
                              >
                                {isSubmitting ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span>જમા કરવાની વિનંતી સબમિટ કરો (Submit Deposit Request)</span>
                              </button>
                            </div>
                          );
                        })()}
                      </form>
                    ) : (
                      <div className="space-y-5 text-center py-6">
                        <div className="mx-auto w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/25">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-base font-black text-emerald-400">વિનંતી સફળતાપૂર્વક મોકલવામાં આવી છે!</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto">
                            તમારી ₹{depositSuccessTx?.amount} જમા કરવાની વિનંતી ઓનરને મોકલવામાં આવી છે. ઓનર ચુકવણી વેરીફાય કરી ટૂંક સમયમાં બેલેન્સ મંજૂર કરશે.
                          </p>
                        </div>

                        <div className="max-w-xs mx-auto space-y-2 bg-slate-950/40 border border-slate-800 p-3.5 rounded-2xl text-xs font-mono text-left text-slate-300">
                          <p className="flex justify-between"><span>વિનંતી ID:</span> <span>{depositSuccessTx?.id}</span></p>
                          <p className="flex justify-between"><span>જમા રકમ:</span> <span className="font-sans font-extrabold text-white">₹{depositSuccessTx?.amount}</span></p>
                          <p className="flex justify-between"><span>ટ્રાન્ઝેક્શન UTR:</span> <span>{depositSuccessTx?.referenceId}</span></p>
                          <p className="flex justify-between"><span>સ્થિતિ (Status):</span> <span className="text-amber-400 font-sans">પેન્ડિંગ (PENDING)</span></p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDepositStep('FORM');
                            setDepositSuccessTx(null);
                          }}
                          className="px-6 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          બીજી રકમ ઉમેરો (Add More)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Dynamic Payment Assistant (QR Scanner / UPI Launcher) */}
                  <div className={`lg:col-span-2 flex flex-col justify-between ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg text-center space-y-3`}>
                    {paymentMode === 'QR' && depositStep === 'FORM' && parseFloat(depositAmount) >= 50 && parseFloat(depositAmount) <= 500 ? (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl max-w-[210px] mx-auto shadow-md border border-slate-200">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              `upi://pay?pa=bsporiya9-1@okicici&pn=DAY%20INFOTECH&am=${depositAmount}&cu=INR&tn=Wallet%20Topup%20${userMobile}`
                            )}`}
                            alt="UPI Payee QR Code"
                            className="h-44 w-44 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[10px] text-slate-850 font-black tracking-wider mt-1.5">ચૂકવો: <span className="font-sans font-black text-indigo-700">₹{depositAmount}</span></p>
                        </div>

                        <div className="space-y-1 text-slate-400 text-xs">
                          <p className="font-bold">UPI ID: <span className="font-mono text-white text-[11px] select-all bg-slate-950 px-2 py-1 rounded">bsporiya9-1@okicici</span></p>
                          <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                            કોઈપણ UPI એપ (GPay, PhonePe, Paytm, BHIM) વડે આ QR કોડ સ્કેન કરીને ચૂકવણી કરો.
                          </p>
                        </div>
                      </div>
                    ) : paymentMode === 'UPI_APP' && depositStep === 'FORM' && parseFloat(depositAmount) >= 50 && parseFloat(depositAmount) <= 500 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-5 border border-dashed border-indigo-500/20 rounded-2xl space-y-4 my-2 bg-indigo-500/5 animate-fadeIn">
                        <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/25">
                          <Smartphone className="h-8 w-8 animate-pulse" />
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-xs font-black text-slate-200">UPI એપ્લિકેશન ટ્રાન્સફર</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-[180px] mx-auto">
                            તમારા મોબાઈલમાં ઇન્સ્ટોલ કરેલ કોઈપણ ચુકવણી એપથી ચૂકવણી કરવા માટે નીચે આપેલ બટન પર ક્લિક કરો.
                          </p>
                        </div>

                        <a
                          href={`upi://pay?pa=bsporiya9-1@okicici&pn=DAY%20INFOTECH&am=${depositAmount}&cu=INR&tn=Wallet%20Topup%20${userMobile}`}
                          className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                        >
                          <Smartphone className="h-4 w-4" />
                          <span>પેમેન્ટ એપ ખોલો (Open UPI App)</span>
                        </a>
                      </div>
                    ) : depositStep === 'SUCCESS' ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-800/30 rounded-2xl space-y-3.5 my-4 bg-emerald-500/5">
                        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full">
                          <Check className="h-10 w-10 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-300">ચુકવણી વિનંતી સફળ</p>
                          <p className="text-[10px] text-slate-500 font-semibold leading-normal max-w-[180px] mx-auto">
                            વેરિફિકેશન પ્રક્રિયા શરૂ થઈ ગઈ છે, થોડીવારમાં બેલેન્સ ઉમેરાઈ જશે.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-700/60 rounded-2xl space-y-3.5 my-4 bg-slate-950/35">
                        <div className="p-3.5 bg-slate-900 rounded-full text-amber-500/60 border border-slate-800">
                          <QrCode className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-300">ચૂકવણી પદ્ધતિ પસંદ કરો</p>
                          <p className="text-[10px] text-slate-500 font-semibold leading-normal max-w-[200px] mx-auto">
                            રકમ દાખલ કરી ક્યુઆર કોડ અથવા UPI એપ્લિકેશનમાંથી અનુકૂળ પદ્ધતિ પસંદ કરો જેથી ચૂકવણી માટેની લીંક અથવા QR કોડ જનરેટ થાય.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            )}

            {/* TAB: HISTORY */}
            {subTab === 'HISTORY' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg space-y-4`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className={`text-base font-black ${isDark ? 'text-slate-200' : 'text-slate-800'} flex items-center gap-2`}>
                      <Clock className="h-5 w-5 text-indigo-400" /> વોલેટ ખાતાનો ઇતિહાસ (Wallet History)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      તમારા વોલેટ ખાતામાં થયેલી જમા અને ઉપાડની વિગતોની સૂચિ.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:max-w-xs shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={txSearchQuery}
                      onChange={(e) => setTxSearchQuery(e.target.value)}
                      placeholder="વિનંતી ID કે રેફરન્સથી શોધો..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-950/40 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {filteredTxs.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border-2 border-dashed border-slate-800 rounded-2xl">
                    <HelpCircle className="h-10 w-10 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">કોઈ પણ લેવડ-દેવડ મળી નથી! (No Transactions Found)</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold">
                          <th className="p-3">તારીખ અને સમય</th>
                          <th className="p-3">ટ્રાન્ઝેક્શન વિગત</th>
                          <th className="p-3">યુટીઆર / રેફરન્સ ID</th>
                          <th className="p-3 text-center">પ્રકાર (Type)</th>
                          <th className="p-3 text-center">સ્થિતિ (Status)</th>
                          <th className="p-3 text-right">રકમ (Amount)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredTxs.map((tx) => {
                          const isPlus = tx.type.includes('DEPOSIT') || tx.type === 'REFUND_REJECTED';
                          return (
                            <tr key={tx.id} className="hover:bg-slate-900/30 font-medium">
                              <td className="p-3 text-slate-400 font-mono">
                                {new Date(tx.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </td>
                              <td className="p-3 space-y-0.5">
                                <p className="font-bold text-slate-200">{tx.notes || 'વોલેટ ટ્રાન્ઝેક્શન'}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {tx.id}</p>
                              </td>
                              <td className="p-3 font-mono text-slate-300">
                                {tx.referenceId || '-'}
                              </td>
                              <td className="p-3 text-center">
                                {getTxTypeBadge(tx.type, tx.status)}
                              </td>
                              <td className="p-3 text-center">
                                {getStatusBadge(tx.status)}
                              </td>
                              <td className={`p-3 text-right font-black font-sans text-sm ${
                                isPlus ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {isPlus ? '+' : '-'} ₹{tx.amount}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: REFUND */}
            {subTab === 'REFUND' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 space-y-4 shadow-lg`}>
                  <div className="space-y-1">
                    <h3 className={`text-base font-black ${isDark ? 'text-slate-200' : 'text-slate-800'} flex items-center gap-2`}>
                      <ArrowDownLeft className="h-5 w-5 text-indigo-400" /> વોલેટમાંથી રિફંડ મેળવો (Request Wallet Refund)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      જો તમારા વોલેટમાં રહેલી રકમ પરત જોઈતી હોય તો ઓનરને વિનંતી મોકલો. મંજૂર થતાં તે રકમ પરત કરવામાં આવશે.
                    </p>
                  </div>

                  {refundError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{refundError}</span>
                    </div>
                  )}

                  {refundSuccess ? (
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/10 rounded-2xl text-center space-y-3">
                      <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-black text-emerald-400">રિફંડ વિનંતી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે!</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto">
                        તમારી વિનંતી ઓનરને મોકલવામાં આવી છે. તમારા વોલેટમાંથી રકમ હોલ્ડ કરી દેવામાં આવી છે. ઓનર વિનંતી ચેક કરી ટૂંક સમયમાં તમને તમારા બેંક અકાઉન્ટ/UPI પર રિફંડ કરી દેશે.
                      </p>
                      <button
                        type="button"
                        onClick={() => setRefundSuccess(false)}
                        className="px-5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        નવી વિનંતી મોકલો (Request Another)
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRefundSubmit} className="space-y-4">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1.5 text-[11px] text-indigo-200 leading-normal font-semibold">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Info className="h-4 w-4" />
                          <span>અગત્યની માહિતી:</span>
                        </div>
                        <p>૧. વિનંતી સબમિટ કરવાથી રકમ તમારા વોલેટમાંથી તાત્કાલિક ડેડક્ટ (હોલ્ડ) થઈ જશે.</p>
                        <p>૨. ઓનર વેરીફાય કરીને તમારા ગુગલ પે/UPI આઈડી પર ટ્રાન્સફર કરી રિફંડ મંજૂર કરશે.</p>
                        <p>૩. જો ઓનર નામંજૂર કરશે, તો એ રકમ ઓટોમેટિક તમારા વોલેટમાં પાછી જમા થઈ જશે.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">રિફંડ રકમ (REFUND AMOUNT - INR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-500">₹</span>
                          <input
                            type="number"
                            max={wallet?.balance ?? 0}
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            className={`w-full pl-8 pr-4 py-2.5 rounded-xl font-bold text-sm outline-hidden transition-all ${activeTheme.inputBg} ${activeTheme.inputBorder} ${activeTheme.inputText} ${activeTheme.focusRing}`}
                            placeholder={`મહત્તમ ₹${wallet?.balance ?? 0} મેળવી શકાય`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                          <span>હાલનું વોલેટ બેલેન્સ: ₹{wallet?.balance ?? 0}</span>
                          <button
                            type="button"
                            onClick={() => setRefundAmount((wallet?.balance ?? 0).toString())}
                            className="text-amber-400 hover:underline cursor-pointer"
                          >
                            પૂરેપૂરું રિફંડ કરો (Refund Full)
                          </button>
                        </div>
                      </div>

                      {/* Refund Method Selection */}
                      <div className="space-y-3.5 border-t border-slate-800/80 pt-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">રિફંડ મેળવવાની પદ્ધતિ (Select Refund Method)</label>
                        <div className="grid grid-cols-2 gap-3">
                          {/* UPI Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setRefundMethod('UPI');
                              setRefundError(null);
                            }}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer gap-2 active:scale-95 ${
                              refundMethod === 'UPI'
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                                : isDark
                                ? 'bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <Smartphone className="h-5 w-5" />
                            <div className="text-xs font-black">ઓનલાઈન UPI</div>
                            <span className="text-[9px] opacity-80 font-bold">Online UPI Transfer</span>
                          </button>

                          {/* Cash Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setRefundMethod('CASH');
                              setRefundError(null);
                            }}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer gap-2 active:scale-95 ${
                              refundMethod === 'CASH'
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                : isDark
                                ? 'bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <Coins className="h-5 w-5" />
                            <div className="text-xs font-black">રોકડા (Cash)</div>
                            <span className="text-[9px] opacity-80 font-bold">Office Cash Pickup</span>
                          </button>
                        </div>

                        {/* Method Specific Views */}
                        <AnimatePresence mode="wait">
                          {refundMethod === 'UPI' ? (
                            <motion.div
                              key="upi"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-1.5"
                            >
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">તમારો UPI ID દાખલ કરો (Your UPI ID)</label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <Smartphone className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  required
                                  value={refundUpiId}
                                  onChange={(e) => setRefundUpiId(e.target.value)}
                                  placeholder="દા.ત. 9876543210@paytm અથવા name@okhdfc"
                                  className={`w-full pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-hidden font-mono ${activeTheme.inputBg} ${activeTheme.inputBorder} ${activeTheme.inputText} ${activeTheme.focusRing}`}
                                />
                              </div>
                              <p className="text-[9px] text-slate-400 font-semibold italic pl-1 leading-normal">
                                * ઓનર આ UPI ID પર રિફંડ રકમ જમા કરશે. કૃપા કરીને સાચો UPI ID લખો.
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="cash"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-2xl flex items-start gap-3 leading-relaxed font-semibold"
                            >
                              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-extrabold text-[13px] text-amber-300">⚠️ કૅશ રિફંડ માટે અગત્યની નોટિસ:</p>
                                <p className="text-amber-200/90 leading-relaxed font-bold">
                                  રિફંડ વિનંતી સબમિટ કર્યાના <strong className="text-white underline decoration-amber-400 decoration-2 font-black">૩ કલાક (3 Hours) ની અંદર</strong> ઓફિસ પરથી રૂબરૂ આવીને તમારા રોકડા (Cash) મેળવી લેવા વિનંતી છે.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !refundAmount}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-98 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                        <span>રિફંડ માટેની વિનંતી મોકલો (Request Refund Now)</span>
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: ADMIN_DEPOSITS (Owner view to approve/reject deposits) */}
            {subTab === 'ADMIN_DEPOSITS' && isOwner() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg space-y-4`}
              >
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-200 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-amber-500" /> પેન્ડિંગ જમા વિનંતીઓ (Pending Deposits Ledger)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    અરજદારોએ બેંકમાંથી QR કોડ દ્વારા નાણા ચૂકવી જમા કરવાની વિનંતી મોકલેલ છે. UTR વેરીફાય કરી બાય-બેલેન્સ જમા કરો.
                  </p>
                </div>

                {pendingDeposits.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border-2 border-dashed border-slate-800 rounded-2xl">
                    <CheckSquare className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-400 font-bold">બધા જ પેન્ડિંગ વેરિફિકેશન પૂર્ણ છે! (No Pending Deposits)</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold">
                          <th className="p-3">વિનંતી સમય</th>
                          <th className="p-3">અરજદાર વિગત</th>
                          <th className="p-3">ટ્રાન્ઝેક્શન UTR</th>
                          <th className="p-3 text-right">રકમ</th>
                          <th className="p-3 text-center">ક્રિયાઓ (Verify Actions)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {pendingDeposits.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-900/30 font-medium">
                            <td className="p-3 text-slate-400 font-mono">
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 space-y-1">
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-indigo-400" /> {tx.userName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-500" /> {tx.userMobile}
                              </p>
                            </td>
                            <td className="p-3 font-mono text-amber-300 select-all font-black bg-slate-950/20 px-2 rounded-lg">
                              {tx.referenceId}
                            </td>
                            <td className="p-3 text-right font-black font-sans text-sm text-emerald-400">
                              ₹{tx.amount}
                            </td>
                            <td className="p-3 text-center flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setAdminActionTx(tx);
                                  setShowAdminModal('APPROVE');
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-lg text-[10px] cursor-pointer"
                              >
                                મંજૂર (Approve)
                              </button>
                              <button
                                onClick={() => {
                                  setAdminActionTx(tx);
                                  setShowAdminModal('REJECT');
                                }}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black rounded-lg text-[10px] cursor-pointer"
                              >
                                રદ (Reject)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ADMIN_REFUNDS (Owner view to approve/reject refunds) */}
            {subTab === 'ADMIN_REFUNDS' && isOwner() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg space-y-4`}
              >
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-200 flex items-center gap-2">
                    <ArrowDownLeft className="h-5 w-5 text-indigo-400" /> પેન્ડિંગ રિફંડ વિનંતીઓ (Pending Refund Requests)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    અરજદારોએ વોલેટ બેલેન્સ પાછા મેળવવા રિફંડ રિક્વેસ્ટ કરેલ છે. તમે તેમને રૂબરૂ અથવા ઓનલાઈન ચુકવણી કરી રિફંડ કન્ફર્મ કરો.
                  </p>
                </div>

                {pendingRefunds.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border-2 border-dashed border-slate-800 rounded-2xl">
                    <Check className="h-10 w-10 text-indigo-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">બધા રિફંડ સેટલ થઈ ગયા છે! (No Pending Refunds)</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold">
                          <th className="p-3">વિનંતી સમય</th>
                          <th className="p-3">અરજદાર વિગત</th>
                          <th className="p-3">વિગત / નોંધ</th>
                          <th className="p-3 text-right">રિફંડ રકમ</th>
                          <th className="p-3 text-center">ક્રિયાઓ (Verify Actions)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {pendingRefunds.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-900/30 font-medium">
                            <td className="p-3 text-slate-400 font-mono">
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 space-y-1">
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-indigo-400" /> {tx.userName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-500" /> {tx.userMobile}
                              </p>
                            </td>
                            <td className="p-3 space-y-1.5 text-slate-300">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {tx.refundMethod === 'UPI' ? (
                                  <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-[9px] rounded-md font-bold uppercase tracking-wider">
                                    UPI રિફંડ (UPI Refund)
                                  </span>
                                ) : tx.refundMethod === 'CASH' ? (
                                  <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 text-[9px] rounded-md font-bold uppercase tracking-wider">
                                    રોકડા (Cash Refund)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-500/15 text-slate-400 border border-slate-500/25 text-[9px] rounded-md font-bold uppercase tracking-wider">
                                    રિફંડ વિનંતી
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-semibold text-slate-200">{tx.notes}</p>
                              {tx.refundMethod === 'UPI' && tx.upiId && (
                                <div className="mt-1 flex items-center gap-1.5 bg-slate-950/40 border border-slate-800/80 p-1 px-2 rounded-lg max-w-[220px]">
                                  <span className="text-[10px] text-indigo-300 font-mono font-bold select-all break-all">{tx.upiId}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(tx.upiId || '');
                                      setCopiedTxId(tx.id);
                                      setTimeout(() => setCopiedTxId(null), 2000);
                                    }}
                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md cursor-pointer shrink-0 transition-colors"
                                    title="UPI ID Copy કરો"
                                  >
                                    {copiedTxId === tx.id ? (
                                      <span className="text-[8px] font-black text-emerald-400">Copied!</span>
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-right font-black font-sans text-sm text-rose-400">
                              ₹{tx.amount}
                            </td>
                            <td className="p-3 text-center flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setAdminActionTx(tx);
                                  setShowAdminModal('APPROVE');
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black rounded-lg text-[10px] cursor-pointer"
                              >
                                રીફંડ આપ્યું (Confirm Refunded)
                              </button>
                              <button
                                onClick={() => {
                                  setAdminActionTx(tx);
                                  setShowAdminModal('REJECT');
                                }}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black rounded-lg text-[10px] cursor-pointer"
                              >
                                રદ (Reject)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ADMIN_ALL (Owner Ledger view) */}
            {subTab === 'ADMIN_ALL' && isOwner() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg space-y-4`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-200 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-400" /> બધી વોલેટ લેવડ-દેવડ (Unified Wallet Ledger)
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">
                      સિસ્ટમના તમામ વપરાશકર્તાઓની ડિપોઝિટ, પેમેન્ટ અને રિફંડનો સંપૂર્ણ રેકોર્ડ.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:max-w-xs shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={txSearchQuery}
                      onChange={(e) => setTxSearchQuery(e.target.value)}
                      placeholder="યુઝર નામ, મોબાઇલ કે UTR થી શોધો..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-950/40 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {filteredTxs.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border-2 border-dashed border-slate-800 rounded-2xl">
                    <HelpCircle className="h-10 w-10 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">કોઈ પણ લેવડ-દેવડ મળી નથી! (No Transactions Found)</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold">
                          <th className="p-3">સમય</th>
                          <th className="p-3">અરજદાર વિગત</th>
                          <th className="p-3">ટ્રાન્ઝેક્શન રેકોર્ડ</th>
                          <th className="p-3">UTR / રેફરન્સ</th>
                          <th className="p-3 text-center">પ્રકાર</th>
                          <th className="p-3 text-center">સ્થિતિ</th>
                          <th className="p-3 text-right">રકમ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredTxs.map((tx) => {
                          const isPlus = tx.type.includes('DEPOSIT') || tx.type === 'REFUND_REJECTED';
                          return (
                            <tr key={tx.id} className="hover:bg-slate-900/30 font-medium">
                              <td className="p-3 text-slate-400 font-mono">
                                {new Date(tx.createdAt).toLocaleString()}
                              </td>
                              <td className="p-3 space-y-0.5">
                                <p className="font-bold text-white">{tx.userName}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{tx.userMobile}</p>
                              </td>
                              <td className="p-3 space-y-0.5">
                                <p className="font-bold text-slate-200">{tx.notes || 'વોલેટ ટ્રાન્ઝેક્શન'}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {tx.id}</p>
                              </td>
                              <td className="p-3 font-mono text-slate-300">
                                {tx.referenceId || '-'}
                              </td>
                              <td className="p-3 text-center">
                                {getTxTypeBadge(tx.type, tx.status)}
                              </td>
                              <td className="p-3 text-center">
                                {getStatusBadge(tx.status)}
                              </td>
                              <td className={`p-3 text-right font-black font-sans text-sm ${
                                isPlus ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {isPlus ? '+' : '-'} ₹{tx.amount}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ADMIN_OVERVIEW */}
            {subTab === 'ADMIN_OVERVIEW' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-2xl shadow-sm flex items-center gap-4`}>
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">કુલ સિસ્ટમ વોલેટ બેલેન્સ (TOTAL POOL)</p>
                      <h4 className="text-xl font-black text-white font-sans mt-0.5">
                        ₹{allWallets.reduce((acc, w) => acc + (w.balance || 0), 0).toLocaleString()}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">તમામ અરજદારોનું બાકી વોલેટ બેલેન્સ</p>
                    </div>
                  </div>

                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-2xl shadow-sm flex items-center gap-4`}>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                      <PlusCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">કુલ મંજૂર થયેલ ડિપોઝિટ (TOTAL INFLOW)</p>
                      <h4 className="text-xl font-black text-emerald-400 font-sans mt-0.5">
                        ₹{transactions
                          .filter(tx => (tx.type === 'DEPOSIT' || tx.type === 'DEPOSIT_REQUEST') && tx.status === 'APPROVED')
                          .reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">સિસ્ટમમાં જમા થયેલ કુલ રકમ</p>
                    </div>
                  </div>

                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-2xl shadow-sm flex items-center gap-4`}>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">સેવાઓમાં વપરાયેલ કુલ રકમ (TOTAL OUTFLOW)</p>
                      <h4 className="text-xl font-black text-indigo-400 font-sans mt-0.5">
                        ₹{transactions
                          .filter(tx => tx.type === 'PAYMENT' && tx.status === 'APPROVED')
                          .reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">વોલેટ પેમેન્ટ દ્વારા મેળવેલ કુલ વકરો</p>
                    </div>
                  </div>
                </div>

                {/* Master Detail Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  
                  {/* Left Column: Applicant Wallet List (2/5) */}
                  <div className={`lg:col-span-2 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg flex flex-col h-[520px]`}>
                    <div className="space-y-2 mb-3 shrink-0">
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">અરજદાર યાદી (Applicant Wallets)</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">અલગ-અલગ અરજદારના વોલેટ બેલેન્સ જોવા અને રિપોર્ટ માટે પસંદ કરો.</p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={overviewSearchQuery}
                          onChange={(e) => setOverviewSearchQuery(e.target.value)}
                          placeholder="નામ અથવા મોબાઈલ નંબરથી શોધો..."
                          className="w-full pl-9 pr-4 py-2 bg-slate-950/40 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Applicant List scrollbox */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {allWallets.filter(w => {
                        if (!overviewSearchQuery.trim()) return true;
                        const q = overviewSearchQuery.toLowerCase();
                        return (w.userName?.toLowerCase().includes(q) || w.userMobile?.includes(q));
                      }).length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-xs font-bold border border-dashed border-slate-800 rounded-2xl">
                          કોઈ પણ અરજદાર મળ્યા નથી!
                        </div>
                      ) : (
                        allWallets
                          .filter(w => {
                            if (!overviewSearchQuery.trim()) return true;
                            const q = overviewSearchQuery.toLowerCase();
                            return (w.userName?.toLowerCase().includes(q) || w.userMobile?.includes(q));
                          })
                          .map((w) => {
                            const isSelected = selectedUserReportId === w.userId;
                            return (
                              <button
                                key={w.userId}
                                type="button"
                                onClick={() => setSelectedUserReportId(w.userId)}
                                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-amber-500/10 border-amber-500/35 text-white'
                                    : 'bg-slate-950/30 border-slate-800/80 hover:bg-slate-900/50 text-slate-300'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <p className="text-xs font-extrabold text-white">{w.userName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono font-semibold">{w.userMobile}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black font-sans text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/10">
                                    ₹{w.balance}
                                  </span>
                                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">બેલેન્સ જુઓ</p>
                                </div>
                              </button>
                            );
                          })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Dynamic User Wallet Report & Transactions (3/5) */}
                  <div className={`lg:col-span-3 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-3xl p-4 shadow-lg flex flex-col h-[520px]`}>
                    {selectedUserReportId ? (
                      (() => {
                        const selWallet = allWallets.find(w => w.userId === selectedUserReportId);
                        const selTxs = transactions.filter(tx => tx.userId === selectedUserReportId);
                        const uDeposits = selTxs
                          .filter(tx => (tx.type === 'DEPOSIT' || tx.type === 'DEPOSIT_REQUEST') && tx.status === 'APPROVED')
                          .reduce((acc, tx) => acc + tx.amount, 0);
                        const uSpent = selTxs
                          .filter(tx => tx.type === 'PAYMENT' && tx.status === 'APPROVED')
                          .reduce((acc, tx) => acc + tx.amount, 0);
                        const uRefunds = selTxs
                          .filter(tx => tx.type === 'REFUND_APPROVED' && tx.status === 'APPROVED')
                          .reduce((acc, tx) => acc + tx.amount, 0);

                        return (
                          <div className="flex flex-col h-full space-y-4">
                            {/* Selected User Header */}
                            <div className="flex justify-between items-start border-b border-slate-800 pb-3 shrink-0">
                              <div>
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">અરજદાર વોલેટ સ્ટેટમેન્ટ</span>
                                <h4 className="text-sm font-black text-white mt-1">{selWallet?.userName || 'અજાણ્યો અરજદાર'}</h4>
                                <p className="text-xs text-slate-400 font-mono font-bold">{selWallet?.userMobile}</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <div className="bg-slate-950/60 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-right">
                                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">વોલેટ બેલેન્સ</p>
                                  <p className="text-sm font-black text-amber-400 font-sans">₹{selWallet?.balance || 0}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedUserReportId(null)}
                                  className="p-1.5 bg-slate-900 border border-slate-750 text-slate-400 hover:text-slate-200 rounded-xl cursor-pointer"
                                  title="રિપોર્ટ બંધ કરો"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Mini Metrics for Selected User */}
                            <div className="grid grid-cols-3 gap-3 shrink-0">
                              <div className="bg-slate-950/30 border border-slate-800/80 p-2.5 rounded-2xl text-center">
                                <p className="text-[8px] text-slate-400 font-black">કુલ ઉમેરેલ રકમ</p>
                                <p className="text-xs font-black text-emerald-400 font-sans mt-0.5">₹{uDeposits}</p>
                              </div>
                              <div className="bg-slate-950/30 border border-slate-800/80 p-2.5 rounded-2xl text-center">
                                <p className="text-[8px] text-slate-400 font-black">વપરાયેલ રકમ</p>
                                <p className="text-xs font-black text-rose-400 font-sans mt-0.5">₹{uSpent}</p>
                              </div>
                              <div className="bg-slate-950/30 border border-slate-800/80 p-2.5 rounded-2xl text-center">
                                <p className="text-[8px] text-slate-400 font-black">મંજૂર રિફંડ</p>
                                <p className="text-xs font-black text-indigo-400 font-sans mt-0.5">₹{uRefunds}</p>
                              </div>
                            </div>

                            {/* User Itemized Transactions */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 font-sans shrink-0">લેવડ-દેવડ રિપોર્ટ (Itemized Usage Ledger)</p>
                              
                              <div className="flex-1 overflow-y-auto rounded-xl border border-slate-850 bg-slate-950/30 custom-scrollbar">
                                {selTxs.length === 0 ? (
                                  <div className="text-center py-12 text-xs text-slate-400 font-bold">
                                    આ અરજદારે હજુ સુધી કોઈ લેવડ-દેવડ કરી નથી.
                                  </div>
                                ) : (
                                  <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                      <tr className="bg-slate-950/80 border-b border-slate-850 text-slate-400 font-bold sticky top-0 z-10">
                                        <th className="p-2.5">તારીખ</th>
                                        <th className="p-2.5">વિગત/સેવાનું નામ</th>
                                        <th className="p-2.5 text-center">સ્થિતિ</th>
                                        <th className="p-2.5 text-right">રકમ</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-850/60 font-semibold">
                                      {selTxs.map((tx) => {
                                        const isPlus = tx.type.includes('DEPOSIT') || tx.type === 'REFUND_REJECTED';
                                        return (
                                          <tr key={tx.id} className="hover:bg-slate-900/30 text-slate-300">
                                            <td className="p-2.5 text-slate-400 font-mono text-[10px]">
                                              {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-2.5 space-y-0.5">
                                              <p className="font-extrabold text-white text-[11px] leading-tight">{tx.notes || 'વોલેટ લેવડ-દેવડ'}</p>
                                              {tx.referenceId && <p className="text-[9px] text-slate-400 font-mono">UTR: {tx.referenceId}</p>}
                                            </td>
                                            <td className="p-2.5 text-center">
                                              {getStatusBadge(tx.status)}
                                            </td>
                                            <td className={`p-2.5 text-right font-black font-sans text-xs ${
                                              isPlus ? 'text-emerald-400' : 'text-rose-400'
                                            }`}>
                                              {isPlus ? '+' : '-'} ₹{tx.amount}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3.5">
                        <div className="p-4 bg-slate-900/80 rounded-full border border-slate-800 text-amber-500/80">
                          <BookOpen className="h-10 w-10" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">અરજદાર અહેવાલ કેન્દ્ર</h4>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
                            કોઈપણ અરજદારના ખાતામાં કેટલા પૈસા ક્યારે ક્રેડિટ થયા, અને કઈ સેવા (Service) પાછળ કેટલા રકમ ખર્ચાયા તેનો વિગતવાર ઇતિહાસ મેળવવા માટે ડાબી બાજુથી કોઈપણ એક અરજદારને પસંદ કરો.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* Admin Approve/Reject Modal Overlay */}
      {showAdminModal && adminActionTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100"
          >
            {/* Modal Header */}
            <div className={`p-5 flex items-center justify-between border-b border-slate-800 ${
              showAdminModal === 'APPROVE' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-rose-950/40 text-rose-400'
            }`}>
              <h3 className="text-sm font-black font-display uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5" />
                {showAdminModal === 'APPROVE' ? 'ટ્રાન્ઝેક્શન મંજૂર કરો (Approve)' : 'ટ્રાન્ઝેક્શન અસ્વીકાર કરો (Reject)'}
              </h3>
              <button
                onClick={() => {
                  setShowAdminModal(null);
                  setAdminActionTx(null);
                  setAdminNotes('');
                }}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-2 text-xs font-semibold">
                <p className="flex justify-between text-slate-400"><span>અરજદારનું નામ:</span> <span className="text-white font-bold">{adminActionTx.userName}</span></p>
                <p className="flex justify-between text-slate-400"><span>મોબાઇલ નંબર:</span> <span className="text-white font-mono">{adminActionTx.userMobile}</span></p>
                <p className="flex justify-between text-slate-400"><span>રકમ (Amount):</span> <span className="text-amber-400 font-sans font-black text-sm">₹{adminActionTx.amount}</span></p>
                {adminActionTx.referenceId && (
                  <p className="flex justify-between text-slate-400"><span>ટ્રાન્ઝેક્શન UTR:</span> <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 select-all">{adminActionTx.referenceId}</span></p>
                )}
                <p className="flex justify-between text-slate-400"><span>પ્રકાર:</span> <span>{adminActionTx.type}</span></p>
              </div>

              {/* Feedback Input Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">રિમાર્ક્સ / ઓનર નોંધ (Optional Notes/Feedback)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="અરજદારને દેખાય તેવી કોઈ નોંધ લખો... (દા.ત. રિફંડ ડન/નામંજૂર થવાનું કારણ)"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-950/50 p-4 border-t border-slate-800/60 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAdminModal(null);
                  setAdminActionTx(null);
                  setAdminNotes('');
                }}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                રદ કરો (Cancel)
              </button>
              
              {showAdminModal === 'APPROVE' ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAdminApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>હા, મંજૂર કરો (Confirm Approve)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAdminReject}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>હા, રદ કરો (Confirm Reject)</span>
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
};
