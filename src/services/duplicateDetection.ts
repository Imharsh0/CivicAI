import { CivicIssue, IssueCategory } from '../types';

// Haversine distance in meters between two lat/lon points
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

export interface DuplicateCheckResult {
  isDuplicateLikely: boolean;
  matchedIssue?: CivicIssue;
  distanceMeters?: number;
  reason?: string;
}

export function findPotentialDuplicates(
  allIssues: CivicIssue[],
  newCategory: IssueCategory,
  latitude: number,
  longitude: number,
  locationText: string,
  thresholdMeters: number = 600
): DuplicateCheckResult {
  for (const existing of allIssues) {
    // Only check active/unresolved or recently reported issues
    if (existing.status === 'Resolved' || existing.status === 'Rejected') {
      continue;
    }

    // Category match
    const categoryMatches = existing.category === newCategory;

    // Coordinate distance
    if (existing.latitude && existing.longitude && latitude && longitude) {
      const dist = calculateDistanceMeters(latitude, longitude, existing.latitude, existing.longitude);
      if (dist <= thresholdMeters && categoryMatches) {
        return {
          isDuplicateLikely: true,
          matchedIssue: existing,
          distanceMeters: Math.round(dist),
          reason: `Found an active "${existing.issue_type}" report within ${Math.round(dist)}m (${existing.location_text}).`,
        };
      }
    }

    // Text landmark match fallback
    const locLower = locationText.toLowerCase();
    const existLocLower = existing.location_text.toLowerCase();
    if (categoryMatches && locLower.length > 5 && existLocLower.length > 5) {
      if (locLower.includes(existLocLower) || existLocLower.includes(locLower)) {
        return {
          isDuplicateLikely: true,
          matchedIssue: existing,
          distanceMeters: 150,
          reason: `Found an existing ticket matching landmark "${existing.location_text}".`,
        };
      }
    }
  }

  return { isDuplicateLikely: false };
}
