import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicIssue, IssueStatus, IssueCategory, ResolutionEvidence } from '../types';
import { INITIAL_MOCK_ISSUES } from '../data/mockIssues';
import { generateReportId } from '../utils/formatters';
import { findPotentialDuplicates, DuplicateCheckResult } from '../services/duplicateDetection';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface IssuesContextType {
  issues: CivicIssue[];
  isLoading: boolean;
  addIssue: (newIssue: Omit<CivicIssue, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<CivicIssue>;
  updateIssueStatus: (
    issueId: string,
    newStatus: IssueStatus,
    comment?: string,
    assignedTo?: string
  ) => Promise<void>;
  addResolutionEvidence: (
    issueId: string,
    resolutionNote: string,
    afterImageUrl: string,
    resolvedByName?: string
  ) => Promise<void>;
  getIssueById: (id: string) => CivicIssue | undefined;
  checkForDuplicate: (
    category: IssueCategory,
    lat: number,
    lng: number,
    locationText: string
  ) => DuplicateCheckResult;
  refreshIssues: () => Promise<void>;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('civicai_issues');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return INITIAL_MOCK_ISSUES;
      }
    }
    return INITIAL_MOCK_ISSUES;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync with Supabase on mount if connected
  const refreshIssues = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*, resolutions(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: CivicIssue[] = data.map((row: any) => ({
          id: row.id,
          user_id: row.user_id,
          organization_id: row.organization_id,
          image_url: row.image_url,
          issue_type: row.issue_type,
          category: row.category,
          description: row.description,
          location_text: row.location_text,
          city: row.city,
          state: row.state,
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          severity: row.severity,
          priority_score: Number(row.priority_score),
          priority_level: row.priority_level,
          ai_confidence: Number(row.ai_confidence),
          ai_explanation: row.ai_explanation,
          safety_impact: row.safety_impact,
          suggested_action: row.suggested_action,
          status: row.status,
          assigned_to: row.assigned_to,
          created_at: row.created_at,
          updated_at: row.updated_at,
          resolution: row.resolutions?.[0]
            ? {
                id: row.resolutions[0].id,
                issue_id: row.resolutions[0].issue_id,
                resolution_note: row.resolutions[0].resolution_note,
                after_image_url: row.resolutions[0].after_image_url,
                created_at: row.resolutions[0].created_at,
              }
            : undefined,
        }));
        setIssues(mapped);
      }
    } catch (err) {
      console.warn('Failed to fetch issues from Supabase, staying on cached state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshIssues();
  }, []);

  // Save to localStorage for demo persistence
  useEffect(() => {
    localStorage.setItem('civicai_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = async (
    newIssueData: Omit<CivicIssue, 'id' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<CivicIssue> => {
    const reportId = generateReportId();
    const now = new Date().toISOString();

    const createdIssue: CivicIssue = {
      ...newIssueData,
      id: reportId,
      status: 'Reported',
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('issues').insert({
          id: createdIssue.id,
          user_id: createdIssue.user_id,
          organization_id: createdIssue.organization_id,
          image_url: createdIssue.image_url,
          issue_type: createdIssue.issue_type,
          category: createdIssue.category,
          description: createdIssue.description,
          location_text: createdIssue.location_text,
          city: createdIssue.city,
          state: createdIssue.state,
          latitude: createdIssue.latitude,
          longitude: createdIssue.longitude,
          severity: createdIssue.severity,
          priority_score: createdIssue.priority_score,
          priority_level: createdIssue.priority_level,
          ai_confidence: createdIssue.ai_confidence,
          ai_explanation: createdIssue.ai_explanation,
          status: 'Reported',
        });
      } catch (err) {
        console.warn('Supabase issue insertion error:', err);
      }
    }

    setIssues((prev) => [createdIssue, ...prev]);
    return createdIssue;
  };

  const updateIssueStatus = async (
    issueId: string,
    newStatus: IssueStatus,
    comment?: string,
    assignedTo?: string
  ) => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('issues')
          .update({
            status: newStatus,
            assigned_to: assignedTo,
            updated_at: now,
          })
          .eq('id', issueId);

        if (comment) {
          await supabase.from('issue_updates').insert({
            issue_id: issueId,
            status: newStatus,
            comment,
          });
        }
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: newStatus,
            assigned_to: assignedTo !== undefined ? assignedTo : iss.assigned_to,
            updated_at: now,
          };
        }
        return iss;
      })
    );
  };

  const addResolutionEvidence = async (
    issueId: string,
    resolutionNote: string,
    afterImageUrl: string,
    resolvedByName = 'Civic Operations Team'
  ) => {
    const now = new Date().toISOString();
    const resolution: ResolutionEvidence = {
      id: `res-${Date.now().toString(36)}`,
      issue_id: issueId,
      resolved_by_name: resolvedByName,
      resolution_note: resolutionNote,
      after_image_url: afterImageUrl,
      created_at: now,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('resolutions').insert({
          issue_id: issueId,
          resolution_note: resolutionNote,
          after_image_url: afterImageUrl,
        });

        await supabase
          .from('issues')
          .update({ status: 'Resolved', updated_at: now })
          .eq('id', issueId);
      } catch (err) {
        console.warn('Supabase resolution insertion error:', err);
      }
    }

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: 'Resolved',
            updated_at: now,
            resolution,
          };
        }
        return iss;
      })
    );
  };

  const getIssueById = (id: string): CivicIssue | undefined => {
    return issues.find((iss) => iss.id === id);
  };

  const checkForDuplicate = (
    category: IssueCategory,
    lat: number,
    lng: number,
    locationText: string
  ): DuplicateCheckResult => {
    return findPotentialDuplicates(issues, category, lat, lng, locationText);
  };

  return (
    <IssuesContext.Provider
      value={{
        issues,
        isLoading,
        addIssue,
        updateIssueStatus,
        addResolutionEvidence,
        getIssueById,
        checkForDuplicate,
        refreshIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};
