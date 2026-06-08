export interface EnhancementHistorySummary {
  id: number;
  originalFileName: string;
  providerPrompt: string;
  createdAt: string;
}

export interface ActionableEnhancement {
  poiName: string;
  insightType: string;
  evidence: string;
  advice: string;
}

export interface SuggestedAddition {
  proposedPoi: string;
}

export interface AnalysisResult {
  itineraryPros: string[];
  experienceGaps: string[];
  actionableEnhancements: ActionableEnhancement[];
  suggestedAdditions: SuggestedAddition[];
}

export interface EnhancementHistoryDetail extends EnhancementHistorySummary {
  analysisResult: AnalysisResult;
}
