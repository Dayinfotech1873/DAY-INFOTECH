import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
  isGujarati: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  isGujarati: false,
});

export const DICTIONARY: Record<Language, Record<string, Record<string, string>>> = {
  en: {
    common: {
      brand_title: "DAY INFOTECH",
      brand_subtitle: "Digital Service Center & Online Form Assistant",
      visitors: "Visitors",
      theme: "Theme",
      language: "Language",
      cloud_synced: "Cloud Synced",
      system_active: "System Active",
      secure_cloud: "100% Secure Cloud",
      logout: "Log Out",
      close_system: "Log Out System",
      mobile_view: "Mobile View",
      back: "Back",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      actions: "Actions",
      search: "Search...",
      no_records: "No records found",
      status: "Status",
      date: "Date",
      name: "Name",
      mobile: "Mobile No.",
      email: "Email",
      username: "Username",
      password: "Password",
      gender: "Gender",
      dob: "Date of Birth",
    },
    auth: {
      welcome_back: "Welcome back to DAY INFOTECH",
      enter_details: "Enter your credentials to log in to your account.",
      username_label: "Username",
      password_label: "Password",
      login_button: "Log In",
      logging_in: "Logging in...",
      forgot_password: "Forgot Password?",
      dont_have_account: "Don't have an account? Sign Up",
      already_have_account: "Already have an account? Log In",
      signup_title: "Create New Account",
      signup_subtitle: "Enter your correct details to register as an applicant.",
      fullname: "Full Name (As per Aadhar)",
      fullname_placeholder: "Enter full name",
      mobile_placeholder: "Enter 10-digit mobile number",
      email_placeholder: "Enter email address",
      username_placeholder: "Choose a unique username",
      password_placeholder: "Choose a secure password",
      dob_label: "Date of Birth",
      gender_label: "Gender",
      gender_select: "Select Gender",
      gender_male: "Male",
      gender_female: "Female",
      gender_other: "Other",
      register_button: "Register Account",
      registering: "Registering...",
      forgot_title: "Reset Password Request",
      forgot_subtitle: "Enter your registered mobile number. Admin will verify and reset.",
      forgot_mobile: "Registered Mobile Number",
      forgot_button: "Send Reset Request",
      back_to_login: "Back to Log In",
      admin_section: "Admin Section",
      admin_forgot: "Admin Forgot Password?",
      admin_forgot_subtitle: "Provide secret verification keys to reset admin login.",
      dob_aadhar_match: "Aadhar & Date of Birth confirmation required",
      admin_dob: "Admin Date of Birth",
      admin_aadhar: "Admin Aadhar Card Number",
      admin_email: "Admin Email ID",
      admin_mobile: "Admin Mobile Number",
      admin_new_password: "New Secure Password",
      admin_verify_reset: "Verify & Reset Password",
      custom_login_error: "Please enter both username and password.",
    },
    nav: {
      dashboard: "Dashboard",
      applications: "Applications",
      users: "Users",
      services: "Services",
      official_websites: "Official Websites",
      send_message: "Live Support",
      apply_service: "Apply Service",
      your_applications: "Your Applications",
      wallet: "Wallet",
      about_us: "About Us",
      online_users: "Online Connections",
      chats: "Customer Chats",
      offline_forms: "Offline Forms",
      tracker: "Application Tracker",
      home_workspace: "Home Workspace",
    },
    dashboard: {
      stats_total: "Total Applications",
      stats_completed: "Completed Forms",
      stats_drafts: "Drafts / Pending",
      welcome_user: "Welcome,",
      role_admin: "Authorized Admin",
      role_user: "Registered Applicant",
      announcement_title: "OFFICIAL ANNOUNCEMENT",
    },
    services: {
      title: "Apply for Online Services",
      subtitle: "Select a service below to fill and submit your application with required documents.",
      charges: "Government Fee + Service Charge",
      apply_now: "Apply Now",
    },
  },
  gu: {
    common: {
      brand_title: "ડે ઇન્ફોટેક",
      brand_subtitle: "ડિજિટલ સર્વિસ સેન્ટર અને ઓનલાઈન ફોર્મ સહાયક",
      visitors: "મુલાકાતીઓ",
      theme: "થીમ",
      language: "ભાષા",
      cloud_synced: "ક્લાઉડ સિંક્ડ",
      system_active: "સિસ્ટમ સક્રિય",
      secure_cloud: "૧૦૦% સુરક્ષિત ક્લાઉડ",
      logout: "લોગ આઉટ",
      close_system: "સિસ્ટમ બંધ કરો (લોગ આઉટ)",
      mobile_view: "મોબાઇલ વ્યુ",
      back: "પાછા જાઓ",
      cancel: "રદ કરો",
      submit: "સબમિટ કરો",
      loading: "લોડ થઈ રહ્યું છે...",
      save: "સાચવો",
      edit: "સુધારો",
      delete: "ડીલીટ",
      view: "જુઓ",
      actions: "ક્રિયાઓ",
      search: "શોધો...",
      no_records: "કોઈ માહિતી મળી નથી",
      status: "સ્થિતિ",
      date: "તારીખ",
      name: "નામ",
      mobile: "મોબાઇલ નંબર",
      email: "ઇમેઇલ",
      username: "યુઝરનેમ",
      password: "પાસવર્ડ",
      gender: "જાતિ",
      dob: "જન્મ તારીખ",
    },
    auth: {
      welcome_back: "ડે ઇન્ફોટેકમાં આપનું સ્વાગત છે",
      enter_details: "તમારા એકાઉન્ટમાં લોગિન કરવા માટે યુઝરનેમ અને પાસવર્ડ દાખલ કરો.",
      username_label: "યુઝરનેમ",
      password_label: "પાસવર્ડ",
      login_button: "લોગિન કરો",
      logging_in: "લોગિન થઈ રહ્યું છે...",
      forgot_password: "પાસવર્ડ ભૂલી ગયા છો?",
      dont_have_account: "એકાઉન્ટ નથી? સાઇન અપ કરો",
      already_have_account: "પહેલાથી એકાઉન્ટ છે? લોગિન કરો",
      signup_title: "નવું એકાઉન્ટ બનાવો",
      signup_subtitle: "અરજદાર તરીકે નોંધણી કરવા માટે સાચી વિગતો ભરો.",
      fullname: "પૂરું નામ (આધાર કાર્ડ મુજબ)",
      fullname_placeholder: "પૂરું નામ દાખલ કરો",
      mobile_placeholder: "૧૦ અંકનો મોબાઇલ નંબર લખો",
      email_placeholder: "ઇમેઇલ સરનામું લખો",
      username_placeholder: "એક અનન્ય યુઝરનેમ પસંદ કરો",
      password_placeholder: "એક સુરક્ષિત પાસવર્ડ બનાવો",
      dob_label: "જન્મ તારીખ",
      gender_label: "જાતિ",
      gender_select: "જાતિ પસંદ કરો",
      gender_male: "પુરુષ",
      gender_female: "સ્ત્રી",
      gender_other: "અન્ય",
      register_button: "એકાઉન્ટ બનાવો",
      registering: "એકાઉન્ટ બની રહ્યું છે...",
      forgot_title: "પાસવર્ડ રીસેટ વિનંતી",
      forgot_subtitle: "નોંધાયેલ મોબાઇલ નંબર દાખલ કરો. એડમિન વેરિફિકેશન કરી પાસવર્ડ રીસેટ કરશે.",
      forgot_mobile: "નોંધાયેલ મોબાઇલ નંબર",
      forgot_button: "રીસેટ વિનંતી મોકલો",
      back_to_login: "લોગિન પર પાછા જાઓ",
      admin_section: "એડમિન વિભાગ",
      admin_forgot: "એડમિન પાસવર્ડ રીસેટ",
      admin_forgot_subtitle: "એડમિન લોગિન રીસેટ કરવા માટે સિક્રેટ વેરિફિકેશન કી આપો.",
      dob_aadhar_match: "આધાર અને જન્મ તારીખની વિગતો મેળ ખાવી જોઈએ",
      admin_dob: "એડમિન જન્મ તારીખ",
      admin_aadhar: "એડમિન આધાર કાર્ડ નંબર",
      admin_email: "એડમિન ઇમેઇલ આઈડી",
      admin_mobile: "એડમિન મોબાઇલ નંબર",
      admin_new_password: "નવો સુરક્ષિત પાસવર્ડ",
      admin_verify_reset: "વેરિફાય અને પાસવર્ડ રીસેટ કરો",
      custom_login_error: "કૃપા કરીને યુઝરનેમ અને પાસવર્ડ બંને દાખલ કરો.",
    },
    nav: {
      dashboard: "ડેશબોર્ડ",
      applications: "અરજીઓ",
      users: "યુઝર્સ",
      services: "સેવાઓ",
      official_websites: "સત્તાવાર વેબસાઇટ્સ",
      send_message: "લાઇવ સપોર્ટ",
      apply_service: "અરજી કરો",
      your_applications: "તમારી અરજીઓ",
      wallet: "વોલેટ",
      about_us: "અમારા વિશે",
      online_users: "ઓનલાઇન કનેક્શન",
      chats: "ગ્રાહક ચેટ્સ",
      offline_forms: "ઓફલાઇન ફોર્મ ફાઇલો",
      tracker: "અરજી ટ્રેકર",
      home_workspace: "હોમ ડેસ્કટોપ",
    },
    dashboard: {
      stats_total: "કુલ અરજીઓ",
      stats_completed: "પૂર્ણ થયેલ અરજીઓ",
      stats_drafts: "બાકી રહેલ અરજીઓ",
      welcome_user: "આપનું સ્વાગત છે,",
      role_admin: "અધિકૃત એડમિન",
      role_user: "નોંધાયેલ અરજદાર",
      announcement_title: "સત્તાવાર જાહેરાત",
    },
    services: {
      title: "ઓનલાઇન સેવાઓ માટે અરજી કરો",
      subtitle: "જરૂરી દસ્તાવેજો સાથે ફોર્મ ભરવા અને અરજી કરવા માટે નીચેની સેવા પસંદ કરો.",
      charges: "સરકારી ફી + સર્વિસ ચાર્જ",
      apply_now: "અરજી કરો",
    },
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('app_language') as Language) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch (e) {}
  };

  const t = (key: string, section = 'common'): string => {
    const translationSection = DICTIONARY[language][section];
    if (translationSection && translationSection[key]) {
      return translationSection[key];
    }
    // Fallback to English
    const englishSection = DICTIONARY['en'][section];
    if (englishSection && englishSection[key]) {
      return englishSection[key];
    }
    return key;
  };

  return React.createElement(LanguageContext.Provider, {
    value: { language, setLanguage, t, isGujarati: language === 'gu' }
  }, children);
};

export const useLanguage = () => useContext(LanguageContext);
