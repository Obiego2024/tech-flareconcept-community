import { CheckCheck } from "lucide-react";

export default function CommunityToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      <CheckCheck size={17} />
      {message}
    </div>
  );
}
