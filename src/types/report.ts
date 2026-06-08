export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "HATE_SPEECH"
  | "FALSE_INFORMATION"
  | "INAPPROPRIATE_CONTENT"
  | "INTELLECTUAL_PROPERTY_INFRINGEMENT"
  | "OTHER";

export interface ReportRequest {
  targetType: "POST";
  targetId: number;
  reason: ReportReason;
  reasonDetail: string;
  files: string[];
}

export interface ReportResponse {
  success: boolean;
  message: string;
}
