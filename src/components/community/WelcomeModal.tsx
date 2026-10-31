import { Code2, GraduationCap, MessageCircle, ShieldCheck, X } from "lucide-react";

interface WelcomeModalProps {
  onDismiss: () => void;
}

export default function WelcomeModal({ onDismiss }: WelcomeModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <button className="modal-close icon-btn" onClick={onDismiss} aria-label="Close welcome modal">
          <X size={18} />
        </button>
        <div className="modal-logo"><GraduationCap size={28} /></div>
        <span className="eyebrow">WELCOME TO THE COMMUNITY</span>
        <h2 id="welcome-title">Learn together.<br /><em>Grow together.</em></h2>
        <p>Your space to connect with students, share projects, ask questions, and build your future in tech.</p>
        <div className="modal-features">
          <span><MessageCircle size={15} /> Group & private chat</span>
          <span><Code2 size={15} /> Course communities</span>
          <span><ShieldCheck size={15} /> Student-first space</span>
        </div>
        <button className="btn btn-primary btn-full" onClick={onDismiss}>Enter community <span>→</span></button>
        <small>This is a local demo. Messages stay in this browser.</small>
      </section>
    </div>
  );
}
