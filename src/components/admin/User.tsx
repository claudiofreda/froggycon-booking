"use client";

import { useLogoutFunction, useUser } from "@propelauth/nextjs/client";

export const User = () => {
  const { loading, user } = useUser();
  const logout = useLogoutFunction();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <section>
      {user.email}{" "}
      <a href="/api/auth/logout">
        <button className="btn btn-primary" onClick={logout}>
          Logout
        </button>
      </a>
    </section>
  );
};
