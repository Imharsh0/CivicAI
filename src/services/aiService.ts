import { AIAnalysisResult, IssueCategory, SeverityLevel, PriorityLevel } from '../types';
import { calculatePriorityScore } from './priorityEngine';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AnalyzeImageParams {
  imageBase64?: string;
  imageUrl?: string;
  fileName?: string;
  city?: string;
}

// Preset intelligent demo detections based on visual heuristics or user hints
const DEMO_PRESETS: Array<{
  keywords: string[];
  result: {
    issue_type: string;
    category: IssueCategory;
    confidence: number;
    severity: SeverityLevel;
    explanation: string;
    safety_impact: string;
    suggested_action: string;
    locationType: 'arterial_road' | 'metro_junction' | 'residential' | 'market_area';
  };
}> = [
  {
    keywords: ['pothole', 'road', 'asphalt', 'crater', 'street'],
    result: {
      issue_type: 'Large Deep Pothole',
      category: 'Road Infrastructure',
      confidence: 94,
      severity: 'High',
      explanation: 'Deep road surface crater detected measuring ~15cm depth with exposed subgrade. Poses high risk to two-wheeler riders.',
      safety_impact: 'High vehicular skid and sudden deceleration accident risk; acute hazard during monsoon rainfall.',
      suggested_action: 'Cold-mix asphalt patch repair and deployment of reflective safety delineators.',
      locationType: 'arterial_road',
    },
  },
  {
    keywords: ['garbage', 'waste', 'trash', 'dump', 'bin', 'plastic'],
    result: {
      issue_type: 'Overflowing Community Garbage Dump',
      category: 'Solid Waste Management',
      confidence: 92,
      severity: 'High',
      explanation: 'Secondary community waste bins overflowing onto pedestrian footpath for over 48 hours, blocking pedestrian passage.',
      safety_impact: 'Severe vector breeding and public health hazard; stray animals congregating in traffic lanes.',
      suggested_action: 'Deploy compactor dumper truck and sanitize collection perimeter.',
      locationType: 'market_area',
    },
  },
  {
    keywords: ['water', 'pipe', 'leak', 'drain', 'flood', 'sewage'],
    result: {
      issue_type: 'Major Water Distribution Line Burst',
      category: 'Water & Drainage',
      confidence: 95,
      severity: 'Critical',
      explanation: 'High-pressure clean water line rupture discharging potable water onto the road sub-base, causing erosion.',
      safety_impact: 'Asphalt collapse risk and drinking water scarcity for adjacent wards.',
      suggested_action: 'Immediate isolation of feeder valve and dispatch of hydraulic pipeline repair squad.',
      locationType: 'arterial_road',
    },
  },
  {
    keywords: ['light', 'pole', 'wire', 'electric', 'dark'],
    result: {
      issue_type: 'Damaged Electric Pole & Exposed Wires',
      category: 'Lighting & Electricity',
      confidence: 89,
      severity: 'High',
      explanation: 'Base service door missing on streetlight pole with insulated conductors exposed at shoulder height.',
      safety_impact: 'Direct electrocution risk to pedestrians and cyclists during damp conditions.',
      suggested_action: 'Isolate circuit breaker, reinstall steel cover plate, and measure ground fault current.',
      locationType: 'metro_junction',
    },
  },
  {
    keywords: ['tree', 'branch', 'green', 'leaf', 'fallen'],
    result: {
      issue_type: 'Fallen Tree Branch Blocking Traffic',
      category: 'Environment & Greenery',
      confidence: 93,
      severity: 'Medium',
      explanation: 'Heavy tree limb severed and resting across secondary transit lane and bicycle path.',
      safety_impact: 'Obstruction to emergency vehicles and commuters; moderate collision risk.',
      suggested_action: 'Dispatch chainsaw arborists for rapid sectioning and timber removal.',
      locationType: 'residential',
    },
  },
  {
    keywords: ['bench', 'toilet', 'bus', 'footpath', 'railing', 'pavement'],
    result: {
      issue_type: 'Damaged Public Footpath Pavers',
      category: 'Public Infrastructure',
      confidence: 88,
      severity: 'Medium',
      explanation: 'Missing interlocking tiles and caved-in telecommunication chamber lid causing uneven pedestrian walkway.',
      safety_impact: 'Tripping hazard for senior citizens, school children, and visually impaired citizens.',
      suggested_action: 'Re-lay precast concrete pavers and secure chamber frame.',
      locationType: 'market_area',
    },
  },
];

export async function analyzeCivicImage(params: AnalyzeImageParams): Promise<AIAnalysisResult> {
  // 1. If Supabase Edge Function is available, call it first
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-civic-issue', {
        body: {
          image_base64: params.imageBase64,
          image_url: params.imageUrl,
          city: params.city,
        },
      });

      if (!error && data && data.issue_type) {
        return {
          issue_type: data.issue_type,
          category: data.category || 'Road Infrastructure',
          confidence: data.confidence || 92,
          severity: data.severity || 'High',
          priority_level: data.priority_level || 'P1',
          priority_score: data.priority_score || 91,
          explanation: data.explanation || 'Civic infrastructure anomaly detected.',
          safety_impact: data.safety_impact || 'Safety hazard requiring civic maintenance.',
          suggested_action: data.suggested_action || 'Dispatch local zonal municipal engineer.',
          is_demo: Boolean(data.is_demo),
        };
      }
    } catch (edgeErr) {
      console.warn('Edge Function call skipped or failed, using intelligent client AI demo engine:', edgeErr);
    }
  }

  // 2. Intelligent Client-Side Demo AI Mode with realistic 1.8s scan simulation
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Determine best matching preset based on filename, or default to Pothole (the hackathon flagship demo!)
  const filename = (params.fileName || '').toLowerCase();
  let matched = DEMO_PRESETS.find((p) =>
    p.keywords.some((kw) => filename.includes(kw))
  );

  if (!matched) {
    // Default to the flagship Pothole demo as required in requirement 22 & 50
    matched = DEMO_PRESETS[0];
  }

  const baseResult = matched.result;
  const calculatedPriority = calculatePriorityScore({
    severity: baseResult.severity,
    category: baseResult.category,
    locationType: baseResult.locationType,
  });

  return {
    issue_type: baseResult.issue_type,
    category: baseResult.category,
    confidence: baseResult.confidence,
    severity: baseResult.severity,
    priority_level: calculatedPriority.level,
    priority_score: calculatedPriority.score,
    explanation: baseResult.explanation,
    safety_impact: baseResult.safety_impact,
    suggested_action: baseResult.suggested_action,
    is_demo: true,
  };
}
