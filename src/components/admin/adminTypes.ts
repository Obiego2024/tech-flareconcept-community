export type AdminSection = "overview" | "students" | "moderation" | "channels" | "settings";

export type AdminNotice = {
  message: string;
  error: boolean;
};
