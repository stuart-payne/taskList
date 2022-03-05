const getPasswordFromEnv = (): string => {
  const sessionPw = process.env.SESSION_PW;
  if (!sessionPw) {
    throw new Error(
      "SESSION_PW not set. This is required for production. Must be 32 characters long."
    );
  }
  return sessionPw;
};

export const ironOptions = {
  cookieName: "task_list",
  password:
    process.env.NODE_ENV === "production"
      ? getPasswordFromEnv()
      : "rNEzFXudkDkAz6uPSXgGZdNusjaBmZbv",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
