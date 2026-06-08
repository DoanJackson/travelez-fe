export const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_BACKEND_URL ?? "https://api.zsocial.id.vn") // server: bypass proxy, hit backend directly
    : (process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy");             // client: go through Next.js proxy

export const API_ENDPOINTS = {
  SSO: {
    REGISTER: "/api/sso/register",
    LOGIN: "/api/sso/login",
    GOOGLE: "/api/sso/google",
  },
  USER: {
    GET_PROFILE: "/api/users/me",
    GET_USER_BY_ID: (userId: number) => `/api/users/${userId}`,
    SEARCH_USERS: "/api/users/search",
    UPDATE_USERAVATAR: "/api/users/me/avatar",
    UPDATE_USERINFO: "/api/users/me",
    GET_INTEGRATIONS: "/api/users/me/integrations",
    CALENDAR_CALLBACK: "/api/users/me/google/calendar-callback",
  },
  ITINERARY: {
    GENERATE: "/api/itineraries/generate",
    GET_TEMP: (tempId: string) => `/api/itineraries/temp/${tempId}`,
    SAVE: "/api/itineraries/save",
    GET_MY_ITINERARIES: "/api/itineraries",
    GET_DETAIL: (id: number) => `/api/itineraries/${id}`,
    DELETE_ITINERARY: (id: number) => `/api/itineraries/${id}`,
    REPLAN: "/api/itineraries/replan",
  },
  ITINERARY_MANAGEMENT: {
    GET_SHARED_ITINERARY: () => `/api/management/itineraries/shared-with-me`,
    SHARE_ITINERARY_TO_USER: (id: number) =>
      `/api/management/itineraries/${id}/share`,
    DELETE_SHARED_ITINERARY: (id: number, username: string) =>
      `/api/management/itineraries/${id}/share/${username}`,
    GET_SHARED_USERS: (id: number) =>
      `/api/management/itineraries/${id}/shared-users`,
    SEARCH_SHARED_USERS: (id: number) =>
      `/api/management/itineraries/${id}/shared-users/search`,
    TOGGLE_VISIBILITY: (id: number) =>
      `/api/management/itineraries/${id}/public`,
    SEARCH_PUBLIC_ITINERARIES: (prompt: string, page = 0, size = 9) =>
      `/api/management/itineraries/public/search?prompt=${encodeURIComponent(prompt)}&page=${page}&size=${size}`,
    GET_PUBLIC_ITINERARIES: (page: number, size: number) =>
      `/api/management/itineraries/public?page=${page}&size=${size}`,
    GET_USER_PUBLIC_ITINERARIES: (userId: string | number, page = 0, size = 20) =>
      `/api/management/itineraries/users/${userId}/public?page=${page}&size=${size}`,
    EXPORT_CALENDAR: (id: number | string) =>
      `/api/management/itineraries/${id}/export-calendar`,
  },
  PLACES: {
    FIND_PLACES: "/api/places",
  },
  POIS: {
    GET_POI_LIST: "/api/pois",
    GET_POI_DETAIL: (poiId: number) => `/api/pois/${poiId}`,
    SEMANTIC_SEARCH_POIS: "/api/pois/semantic-search",
  },
  REVIEWS: {
    GET_REVIEWS: (poiId: number) => `/api/pois/${poiId}/reviews`,
    CREATE_REVIEW: (poiId: number) => `/api/pois/${poiId}/reviews`,
    DELETE_REVIEW: (reviewId: number) => `/api/reviews/${reviewId}`,
    GET_REVIEW_BY_USER: (userId: number) => `/api/users/${userId}/reviews`,
  },
  POSTS: {
    CREATE_POST: "/api/posts",
    GET_POSTS: "/api/posts",
    GET_POST_DETAIL: (postId: number) => `/api/posts/${postId}`,
    DELETE_POST: (postId: number) => `/api/posts/${postId}`,
    EDIT_POST: (postId: number) => `/api/posts/${postId}`,
    GET_POSTS_BY_USER: (userId: number) => `/api/posts/users/${userId}`,
    SEARCH_POSTS: "/api/posts/search",
  },
  COMMENTS: {
    GET_COMMENTS: (postId: number) => `/api/posts/${postId}/comments`,
    CREATE_COMMENT: (postId: number) => `/api/posts/${postId}/comments`,
    DELETE_COMMENT: (commentId: number) => `/api/comments/${commentId}`,
    EDIT_COMMENT: (commentId: number) => `/api/comments/${commentId}`,
    GET_REPLIES: (commentId: number) => `/api/comments/${commentId}/replies`,
  },
  REACTIONS:{
    ADD_REACTION: () => `/api/reactions/toggle`,
  },
  REPORTS:{
    CREATE_REPORT: "/api/reports",
  },
  PROVIDER_ITINERARY: {
    IMPROVE:            "/api/itinerary-enhancement/improve",
    GET_HISTORIES:      "/api/itinerary-enhancement/histories",
    GET_HISTORY_DETAIL: (id: number) => `/api/itinerary-enhancement/histories/${id}`,
    DELETE_HISTORY:     (id: number) => `/api/itinerary-enhancement/histories/${id}`,
  },
  SOCIAL: {
    FOLLOW_USER: (targetUserId: string) => `/api/users/${targetUserId}/follow`,
    UNFOLLOW_USER: (targetUserId: string) => `/api/users/${targetUserId}/unfollow`,
  },
  ADMIN_USERS: {
    LIST:   ()               => `/api/admin/users`,
    DETAIL: (userId: number) => `/api/admin/users/${userId}`,
    STATUS: (userId: number) => `/api/admin/users/${userId}/status`,
  },
};
