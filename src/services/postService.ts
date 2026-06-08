import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type {
  CreatePostPayload,
  CreateCommentPayload,
  EditCommentPayload,
  CommentResponse,
  PostDetail,
  PostFeedPage,
  PostSearchParams,
  UpdatePostPayload,
  ReactionToggleRequest,
  ItinerarySummary,
} from "@/types/post";
import type { PaginatedData } from "@/types/api";
import type { ApiError } from "@/types/api";

function authHeaders(): Record<string, string> {
  const token = AuthCookies.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const postService = {
  async createPost(payload: CreatePostPayload): Promise<void> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("status", "PUBLISHED");
    payload.files.forEach((file) => formData.append("files", file));
    if (payload.poiId !== undefined)
      formData.append("poiId", String(payload.poiId));
    if (payload.itineraryId !== undefined)
      formData.append("itineraryId", String(payload.itineraryId));
    formData.append("topicTag", payload.topicTag);

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.POSTS.CREATE_POST}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to create post.",
      } satisfies ApiError;
    }
  },

  async getPostById(postId: number): Promise<PostDetail> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.POSTS.GET_POST_DETAIL(postId)}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to load post.",
      } satisfies ApiError;
    }

    return result.data as PostDetail;
  },

  async deletePost(postId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.POSTS.DELETE_POST(postId)}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to delete post.",
      } satisfies ApiError;
    }
  },

  async searchPosts(params: PostSearchParams = {}): Promise<PostDetail[]> {
    const query = new URLSearchParams();
    if (params.keyword) query.set("keyword", params.keyword);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortDirection) query.set("sortDirection", params.sortDirection);
    if (params.fromDate) query.set("fromDate", params.fromDate);
    if (params.toDate) query.set("toDate", params.toDate);

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.POSTS.SEARCH_POSTS}?${query.toString()}`,
      { method: "GET", headers: authHeaders() },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to search posts.",
      } satisfies ApiError;
    }

    return result.data.content as PostDetail[];
  },

  async getComments(
    postId: number,
    page = 0,
    size = 10,
  ): Promise<PaginatedData<CommentResponse>> {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.COMMENTS.GET_COMMENTS(postId)}?${query}`,
      { method: "GET", headers: authHeaders() },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to load comments.",
      } satisfies ApiError;
    }
    return result.data as PaginatedData<CommentResponse>;
  },

  async createComment(payload: CreateCommentPayload): Promise<void> {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (payload.parentId !== undefined)
      formData.append("parentId", String(payload.parentId));

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.COMMENTS.CREATE_COMMENT(payload.postId)}`,
      { method: "POST", headers: authHeaders(), body: formData },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to post comment.",
      } satisfies ApiError;
    }
  },

  async deleteComment(commentId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.COMMENTS.DELETE_COMMENT(commentId)}`,
      { method: "DELETE", headers: authHeaders() },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to delete comment.",
      } satisfies ApiError;
    }
  },

  async getReplies(
    commentId: number,
    page = 0,
    size = 20,
  ): Promise<PaginatedData<CommentResponse>> {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.COMMENTS.GET_REPLIES(commentId)}?${query}`,
      { method: "GET", headers: authHeaders() },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to load replies.",
      } satisfies ApiError;
    }
    return result.data as PaginatedData<CommentResponse>;
  },

  async updatePost(payload: UpdatePostPayload): Promise<void> {
    const formData = new FormData();
    if (payload.title !== undefined) formData.append("title", payload.title);
    if (payload.content !== undefined)
      formData.append("content", payload.content);
    payload.keptMediaIds?.forEach((id) =>
      formData.append("keptMediaIds", String(id)),
    );
    payload.newFiles?.forEach((file) => formData.append("newFiles", file));

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.POSTS.EDIT_POST(payload.postId)}`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to update post.",
      } satisfies ApiError;
    }
  },

  async editComment(payload: EditCommentPayload): Promise<void> {
    const formData = new FormData();
    formData.append("content", payload.content);
    payload.keptMediaIds.forEach((id) =>
      formData.append("keptMediaIds", String(id)),
    );

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.COMMENTS.EDIT_COMMENT(payload.commentId)}`,
      { method: "PATCH", headers: authHeaders(), body: formData },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to update comment.",
      } satisfies ApiError;
    }
  },

  async toggleReaction(request: ReactionToggleRequest): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.REACTIONS.ADD_REACTION()}`,
      {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to toggle reaction.",
      } satisfies ApiError;
    }
  },
};

/**
 * Fetch all posts authored by a given user.
 * TODO: replace mock return with real API call when GET /api/posts/users/:id is ready.
 */
export async function getPostsByUserId(
  _userId: number,
  sortField: string,
  sortDirection: "ASC" | "DESC",
  page: number,
  size: number,
): Promise<PostDetail[]> {
  // Temporary: return mock data directly until backend endpoint is available.
  // const { mockProfilePosts } = await import("@/lib/mock-profile");
  // return mockProfilePosts as unknown as PostDetail[];
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.POSTS.GET_POSTS_BY_USER(_userId)}?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to load user's posts.",
    } satisfies ApiError;
  }

  return result.data.content as PostDetail[];
}

export async function getUserPublicItineraries(
  userId: string | number,
  page = 0,
  size = 20,
): Promise<PaginatedData<ItinerarySummary>> {
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.GET_USER_PUBLIC_ITINERARIES(userId, page, size)}`,
    { method: "GET", headers: authHeaders() },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to load itineraries.",
    } satisfies ApiError;
  }
  return result.data as PaginatedData<ItinerarySummary>;
}

export async function getPosts(
  size: number,
  lastPostId?: number,
): Promise<PostFeedPage> {
  const query = new URLSearchParams({ size: String(size) });
  if (lastPostId !== undefined) query.set("lastPostId", String(lastPostId));

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.POSTS.GET_POSTS}?${query.toString()}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to load posts.",
    } satisfies ApiError;
  }

  return result.data as PostFeedPage;
}
