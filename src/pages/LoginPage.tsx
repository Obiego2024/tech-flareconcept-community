import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldAlert, UserCheck } from "lucide-react";
import Brand from "../components/Brand";
import { isAdminEmail, useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (user) {
    return <Navigate to={isAdminEmail(user.email) ? "/admin" : "/community"} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessage = login(email, password);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      navigate(isAdminEmail(email) ? "/admin" : "/community");
    }
  };

  // Quick Demo One-Click Login Handler
  const handleQuickLogin = (demoType: "admin" | "user") => {
    const demoEmail = demoType === "admin" ? "admin@techflareconcept.com" : "student@techflareconcept.com";
    const demoPassword = "password123";
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    const errorMessage = login(demoEmail, demoPassword);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      navigate(isAdminEmail(demoEmail) ? "/admin" : "/community");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101010] px-4 py-9 text-zinc-100 sm:px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-52 h-110 w-110 rounded-full bg-orange-500 opacity-[0.13] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -left-32 h-110 w-110 rounded-full bg-orange-300 opacity-[0.10] blur-[100px]"
      />
      <div className="relative z-10 w-full max-w-107.5">
        <Brand />
        <section className="rounded-[18px] border border-[#35302b] bg-linear-to-br from-[#1c1b1a] to-[#151515] p-6 shadow-2xl shadow-black/40 sm:p-7.5">
          <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-[#58361d] bg-[#352316] text-orange-300">
            <LockKeyhole size={22} aria-hidden="true" />
          </div>
          <span className="text-[9px] font-bold tracking-[1.7px] text-orange-300">
            STUDENT COMMUNITY
          </span>
          <h1 className="mt-2 mb-2 font-[Space_Grotesk] text-[28px] font-bold tracking-tight text-white sm:text-[29px]">
            Welcome back
          </h1>
          <p className="mb-6 text-xs leading-6 text-zinc-400">
            Sign in to connect with your academy community.
          </p>

          {/* Quick Demo Access Buttons */}
          <div className="mb-5 rounded-xl border border-orange-500/25 bg-orange-500/5 p-3.5">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 flex items-center gap-1.5">
              <span>⚡</span> Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#58361d] bg-[#352316] px-3 py-2 text-[11px] font-semibold text-orange-300 transition hover:bg-[#482e1c]"
              >
                <ShieldAlert size={14} aria-hidden="true" /> Login as Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("user")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-[11px] font-semibold text-zinc-200 transition hover:bg-zinc-700"
              >
                <UserCheck size={14} aria-hidden="true" /> Login as Student
              </button>
            </div>
          </div>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mb-2 text-[11px] text-zinc-300">
              Email address
            </label>
            <div className="flex h-11.5 items-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-zinc-500 transition focus-within:border-orange-500">
              <Mail size={17} aria-hidden="true" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <label htmlFor="password" className="mt-4 mb-2 text-[11px] text-zinc-300">
              Password
            </label>
            <div className="flex h-11.5 items-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-zinc-500 transition focus-within:border-orange-500">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter demo password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="grid place-items-center border-0 bg-transparent p-1 text-zinc-500 hover:text-orange-300"
              >
                {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-3 rounded-lg border border-[#673329] bg-[#321f1b] p-2.5 text-[11px] text-[#ff9c8b]"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-bold text-zinc-950 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Sign in <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="h-px flex-1 bg-zinc-800" />
            or
            <span className="h-px flex-1 bg-zinc-800" />
          </div>

          <p className="text-center text-[11px] text-zinc-400">
            New to the community?{" "}
            <Link className="font-semibold text-orange-300 hover:underline" to="/signup">
              Create a demo account
            </Link>
          </p>

          <div className="mt-5 rounded-lg border border-[#443323] bg-[#282018] px-3 py-2.5 text-[9px] leading-relaxed text-[#b18b67]">
            Demo only: credentials are not securely verified. Click the quick demo buttons above or use any email.
          </div>
        </section>

        <footer className="mt-6 text-center text-[9px] leading-relaxed text-zinc-600">
          © {new Date().getFullYear()} Tech Flareconcept Academy · Empowering minds, building future.
        </footer>
      </div>
    </main>
  );
}