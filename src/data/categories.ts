import { IssueCategory } from '../types';

export interface CategoryMeta {
  id: IssueCategory;
  name: string;
  hindiName: string;
  description: string;
  examples: string[];
  icon: string;
  color: string;
}

export const CIVIC_CATEGORIES: CategoryMeta[] = [
  {
    id: 'Road Infrastructure',
    name: 'Roads & Footpaths',
    hindiName: 'सड़क एवं फुटपाथ',
    description: 'Potholes, damaged roads, cracks, missing manholes, broken kerbs.',
    examples: ['Deep Pothole', 'Damaged Asphalt', 'Broken Footpath Pavers', 'Open Manhole'],
    icon: 'Car',
    color: 'emerald',
  },
  {
    id: 'Solid Waste Management',
    name: 'Waste & Garbage',
    hindiName: 'कचरा एवं सफाई',
    description: 'Overflowing dustbins, garbage dumping, uncollected community waste, litter.',
    examples: ['Overflowing Dustbin', 'Illegal Garbage Dumping', 'Dead Animal Carcass', 'Construction Debris'],
    icon: 'Trash2',
    color: 'amber',
  },
  {
    id: 'Water & Drainage',
    name: 'Water & Drainage',
    hindiName: 'जल एवं जलनिकासी',
    description: 'Water pipeline leakage, blocked drains, waterlogging, contaminated supply, sewage overflow.',
    examples: ['Water Main Burst', 'Monsoon Waterlogging', 'Blocked Storm Drain', 'Sewage Overflow'],
    icon: 'Droplets',
    color: 'blue',
  },
  {
    id: 'Lighting & Electricity',
    name: 'Lighting & Electricity',
    hindiName: 'बिजली एवं स्ट्रीट लाइट',
    description: 'Broken streetlights, unlit dark spots, open junction boxes, dangling power cables.',
    examples: ['Non-functional Street Light', 'Exposed Electrical Cable', 'Damaged Electric Pole', 'Dark Junction'],
    icon: 'Zap',
    color: 'yellow',
  },
  {
    id: 'Public Infrastructure',
    name: 'Public Infrastructure',
    hindiName: 'सार्वजनिक बुनियादी ढांचा',
    description: 'Damaged public toilets, broken park benches, vandalized bus shelters, bridge railings.',
    examples: ['Damaged Bus Shelter', 'Broken Park Bench', 'Unusable Public Toilet', 'Damaged Divider Railing'],
    icon: 'Building2',
    color: 'indigo',
  },
  {
    id: 'Environment & Greenery',
    name: 'Environment & Trees',
    hindiName: 'पर्यावरण एवं पेड़',
    description: 'Fallen trees, dangerous hanging branches, open burning of waste, park maintenance.',
    examples: ['Fallen Tree on Road', 'Dangerous Tree Limb', 'Illegal Tree Felling', 'Garbage Burning'],
    icon: 'Trees',
    color: 'teal',
  },
];
