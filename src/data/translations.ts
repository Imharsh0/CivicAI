export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  tagline: string;
  subTagline: string;
  reportProblem: string;
  exploreIssues: string;
  selectCity: string;
  howItWorks: string;
  whatWeDetect: string;
  myReports: string;
  adminDashboard: string;
  cityOverview: string;
  allIssues: string;
  login: string;
  logout: string;
  signup: string;
  guestUser: string;
  statusReported: string;
  statusVerified: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;
  priorityCritical: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  aiConfidence: string;
  location: string;
  severity: string;
  description: string;
  submitReport: string;
  analyzingImage: string;
  takePhoto: string;
  chooseFile: string;
  before: string;
  after: string;
  resolutionEvidence: string;
  whyPriority: string;
  duplicateAlertTitle: string;
  duplicateAlertDesc: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    tagline: 'See a problem. Report it. Let AI take it forward.',
    subTagline: 'AI-powered civic problem detection, prioritization and resolution platform for Indian cities.',
    reportProblem: 'Report a Problem',
    exploreIssues: 'Explore Issues',
    selectCity: 'Select Your City',
    howItWorks: 'How CivicAI Works',
    whatWeDetect: 'What CivicAI Detects',
    myReports: 'My Reports',
    adminDashboard: 'Civic Operations',
    cityOverview: 'City Overview',
    allIssues: 'All Civic Issues',
    login: 'Log In',
    logout: 'Log Out',
    signup: 'Create Account',
    guestUser: 'Citizen',
    statusReported: 'Reported',
    statusVerified: 'Verified',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',
    priorityCritical: 'P1 — Critical',
    priorityHigh: 'P2 — High',
    priorityMedium: 'P3 — Medium',
    priorityLow: 'P4 — Low',
    aiConfidence: 'AI Confidence',
    location: 'Location',
    severity: 'Severity',
    description: 'Description',
    submitReport: 'Submit Report',
    analyzingImage: 'AI is analyzing your report...',
    takePhoto: 'Take a Photo / Upload',
    chooseFile: 'Upload Image',
    before: 'Reported Condition',
    after: 'Verified Resolution',
    resolutionEvidence: 'Resolution Evidence',
    whyPriority: 'Why this Priority?',
    duplicateAlertTitle: 'A similar issue may already have been reported nearby',
    duplicateAlertDesc: 'Our system spotted another report near this location. You can view the existing ticket or proceed.',
  },
  hi: {
    tagline: 'समस्या देखें। रिपोर्ट करें। एआई को आगे बढ़ाने दें।',
    subTagline: 'भारतीय शहरों के लिए एआई-संचालित नागरिक समस्या पहचान, प्राथमिकता एवं निवारण मंच।',
    reportProblem: 'समस्या दर्ज करें',
    exploreIssues: 'समस्याएं देखें',
    selectCity: 'अपना शहर चुनें',
    howItWorks: 'CivicAI कैसे काम करता है',
    whatWeDetect: 'CivicAI किन समस्याओं की पहचान करता है',
    myReports: 'मेरी रिपोर्ट',
    adminDashboard: 'नागरिक प्रशासन संचालन',
    cityOverview: 'शहर का ब्यौरा',
    allIssues: 'सभी नागरिक समस्याएं',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    signup: 'खाता बनाएं',
    guestUser: 'नागरिक',
    statusReported: 'दर्ज की गई',
    statusVerified: 'सत्यापित',
    statusAssigned: 'अधिकारी को सौंपा गया',
    statusInProgress: 'कार्य प्रगति पर है',
    statusResolved: 'समाधान पूर्ण',
    statusRejected: 'अस्वीकृत',
    priorityCritical: 'P1 — अति गंभीर',
    priorityHigh: 'P2 — उच्च प्राथमिकता',
    priorityMedium: 'P3 — मध्यम प्राथमिकता',
    priorityLow: 'P4 — सामान्य प्राथमिकता',
    aiConfidence: 'एआई विश्वास स्कोर',
    location: 'स्थान',
    severity: 'गंभीरता',
    description: 'विवरण',
    submitReport: 'रिपोर्ट जमा करें',
    analyzingImage: 'एआई आपकी रिपोर्ट का विश्लेषण कर रहा है...',
    takePhoto: 'फोटो खींचें / अपलोड करें',
    chooseFile: 'तस्वीर चुनें',
    before: 'समस्या की तस्वीर',
    after: 'समाधान की तस्वीर',
    resolutionEvidence: 'समाधान प्रमाण',
    whyPriority: 'यह प्राथमिकता क्यों?',
    duplicateAlertTitle: 'पास में इसी प्रकार की समस्या पहले से दर्ज हो सकती है',
    duplicateAlertDesc: 'हमारे सिस्टम ने इस स्थान के पास एक मिलती-जुलती रिपोर्ट पाई है। आप पुरानी रिपोर्ट देख सकते हैं या जारी रख सकते हैं।',
  },
};
