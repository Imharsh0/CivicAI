import { SeverityLevel, PriorityLevel, IssueCategory } from '../types';

export interface PriorityCalculationInput {
  severity: SeverityLevel;
  category: IssueCategory;
  locationType?: 'arterial_road' | 'metro_junction' | 'residential' | 'market_area' | 'campus_walkway';
  hazardLevel?: 'fatal_risk' | 'injury_risk' | 'nuisance' | 'cosmetic';
  publicDensity?: 'dense_commuters' | 'medium_footfall' | 'low_traffic';
}

export interface PriorityResult {
  score: number; // 0 to 100
  level: PriorityLevel;
  badgeLabel: string;
  rationale: string[];
  explanation: string;
}

export function calculatePriorityScore(input: PriorityCalculationInput): PriorityResult {
  let score = 0;
  const rationale: string[] = [];

  // 1. Base Severity Weight (Max 40 pts)
  switch (input.severity) {
    case 'Critical':
      score += 40;
      rationale.push('Critical physical damage / imminent hazard (+40)');
      break;
    case 'High':
      score += 30;
      rationale.push('Significant infrastructure impairment (+30)');
      break;
    case 'Medium':
      score += 20;
      rationale.push('Moderate degradation (+20)');
      break;
    case 'Low':
      score += 10;
      rationale.push('Minor surface defect (+10)');
      break;
  }

  // 2. Safety Impact Weight (Max 25 pts)
  if (input.hazardLevel === 'fatal_risk' || input.severity === 'Critical') {
    score += 25;
    rationale.push('High safety risk to two-wheelers & pedestrians (+25)');
  } else if (input.hazardLevel === 'injury_risk' || input.severity === 'High') {
    score += 18;
    rationale.push('Direct injury or vehicular skid risk (+18)');
  } else if (input.hazardLevel === 'nuisance') {
    score += 10;
    rationale.push('Public health or movement impediment (+10)');
  } else {
    score += 5;
    rationale.push('Low direct safety hazard (+5)');
  }

  // 3. Location & Traffic Importance (Max 20 pts)
  if (input.locationType === 'arterial_road' || input.locationType === 'metro_junction') {
    score += 20;
    rationale.push('Major arterial route / high transit corridor (+20)');
  } else if (input.locationType === 'market_area' || input.locationType === 'campus_walkway') {
    score += 15;
    rationale.push('High pedestrian footfall zone (+15)');
  } else {
    score += 10;
    rationale.push('Secondary or residential sector road (+10)');
  }

  // 4. Category Urgency Multiplier (Max 15 pts)
  if (input.category === 'Road Infrastructure' || input.category === 'Water & Drainage') {
    score += 15;
    rationale.push('Lifeline infrastructure priority (+15)');
  } else if (input.category === 'Lighting & Electricity') {
    score += 12;
    rationale.push('Nighttime safety & electrical hazard priority (+12)');
  } else if (input.category === 'Solid Waste Management') {
    score += 10;
    rationale.push('Sanitation & vector control priority (+10)');
  } else {
    score += 8;
    rationale.push('Civic amenity restoration (+8)');
  }

  // Clamp score between 0 and 100
  const finalScore = Math.min(Math.max(score, 15), 98);

  // Map to Level
  let level: PriorityLevel = 'P4';
  let badgeLabel = 'P4 — Low';

  if (finalScore >= 85) {
    level = 'P1';
    badgeLabel = 'P1 — Critical';
  } else if (finalScore >= 70) {
    level = 'P2';
    badgeLabel = 'P2 — High';
  } else if (finalScore >= 50) {
    level = 'P3';
    badgeLabel = 'P3 — Medium';
  } else {
    level = 'P4';
    badgeLabel = 'P4 — Low';
  }

  const explanation = `Why ${level}? ${rationale.slice(0, 3).map(r => r.replace(/\s*\(\+\d+\)/, '')).join(' + ')}`;

  return {
    score: finalScore,
    level,
    badgeLabel,
    rationale,
    explanation,
  };
}
