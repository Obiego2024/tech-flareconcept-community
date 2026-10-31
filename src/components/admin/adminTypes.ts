export type AdminSection = "overview" | "moderation" | "channels" | "settings";

export type AdminNotice = {
  message: string;
  error: boolean;
};
