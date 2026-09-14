import { CityInfo } from '../types';

export const INDIAN_CITIES: CityInfo[] = [
  { name: 'Delhi', hindiName: 'दिल्ली', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, municipalBody: 'Municipal Corporation of Delhi (MCD)' },
  { name: 'Mumbai', hindiName: 'मुंबई', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, municipalBody: 'Brihanmumbai Municipal Corporation (BMC)' },
  { name: 'Bengaluru', hindiName: 'बेंगलुरु', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, municipalBody: 'Bruhat Bengaluru Mahanagara Palike (BBMP)' },
  { name: 'Hyderabad', hindiName: 'हैदराबाद', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, municipalBody: 'Greater Hyderabad Municipal Corporation (GHMC)' },
  { name: 'Chennai', hindiName: 'चेन्नई', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, municipalBody: 'Greater Chennai Corporation (GCC)' },
  { name: 'Kolkata', hindiName: 'कोलकाता', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, municipalBody: 'Kolkata Municipal Corporation (KMC)' },
  { name: 'Pune', hindiName: 'पुणे', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, municipalBody: 'Pune Municipal Corporation (PMC)' },
  { name: 'Ahmedabad', hindiName: 'अहमदाबाद', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, municipalBody: 'Ahmedabad Municipal Corporation (AMC)' },
  { name: 'Jaipur', hindiName: 'जयपुर', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, municipalBody: 'Jaipur Greater Nagar Nigam (JNN)' },
  { name: 'Lucknow', hindiName: 'लखनऊ', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, municipalBody: 'Lucknow Municipal Corporation (LMC)' },
  { name: 'Chandigarh', hindiName: 'चंडीगढ़', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, municipalBody: 'Municipal Corporation Chandigarh (MCC)' },
  { name: 'Gurugram', hindiName: 'गुरुग्राम', state: 'Haryana', latitude: 28.4595, longitude: 77.0266, municipalBody: 'Municipal Corporation of Gurugram (MCG)' },
  { name: 'Noida', hindiName: 'नोएडा', state: 'Uttar Pradesh', latitude: 28.5355, longitude: 77.3910, municipalBody: 'New Okhla Industrial Development Authority (NOIDA)' },
  { name: 'Bhopal', hindiName: 'भोपाल', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, municipalBody: 'Bhopal Municipal Corporation (BMC)' },
  { name: 'Indore', hindiName: 'इंदौर', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, municipalBody: 'Indore Municipal Corporation (IMC)' },
  { name: 'Patna', hindiName: 'पटना', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, municipalBody: 'Patna Municipal Corporation (PMC)' },
  { name: 'Surat', hindiName: 'सूरत', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, municipalBody: 'Surat Municipal Corporation (SMC)' },
  { name: 'Nagpur', hindiName: 'नागपुर', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, municipalBody: 'Nagpur Municipal Corporation (NMC)' },
  { name: 'Kochi', hindiName: 'कोच्चि', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, municipalBody: 'Kochi Municipal Corporation (KMC)' },
  { name: 'Bhubaneswar', hindiName: 'भुवनेश्वर', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, municipalBody: 'Bhubaneswar Municipal Corporation (BMC)' },
];

export const DEFAULT_CITY = INDIAN_CITIES[0]; // Delhi
