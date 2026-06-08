const handleGoogleLogin = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: "http://localhost:3000/auth/callback",
    client_id: "YOUR_CLIENT_ID",
    access_type: "offline", // BẮT BUỘC
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar", // Xin quyền Calendar
    ].join(" "),
  };
  window.location.href = `${rootUrl}?${new URLSearchParams(
    options
  ).toString()}`;
};
