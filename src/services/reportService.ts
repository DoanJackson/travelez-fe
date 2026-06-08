import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type { ReportRequest } from "@/types/report";
import type { ApiError } from "@/types/api";

function authHeaders(): Record<string, string> {
  const token = AuthCookies.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const reportService = {
  async sendReport(request: ReportRequest): Promise<void> {
    const formData = new FormData();
    formData.append("targetType", request.targetType);
    formData.append("targetId", request.targetId.toString());
    formData.append("reason", request.reason);
    formData.append("reasonDetail", request.reasonDetail || "");

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.REPORTS.CREATE_REPORT}`,
      {
        method: "POST",
        headers: { ...authHeaders() },
        body: formData,
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to submit report.",
      } satisfies ApiError;
    }
  },
};
