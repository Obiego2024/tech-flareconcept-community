import { CheckCheck } from "lucide-react";

interface CommunityToastProps {
  message: string;
}

export default function CommunityToast({ message }: CommunityToastProps) {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <CheckCheck size={17} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}