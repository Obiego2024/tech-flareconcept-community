import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
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
            <LockKeyhole size={22} />
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

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mb-2 text-[11px] text-zinc-300">
              Email address
            </label>
            <div className="flex h-11.5 items-center text-zinc-500 transition">
              <Mail size={17} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" text-xs text-white h-full min-w-full px-3 rounded-lg flex-1 bg-transparent outline-none placeholder:text-zinc-600"
              />
            </div>

            <label htmlFor="password" className="mt-4 mb-2 text-[11px] text-zinc-300">
              Password
            </label>
            <div className="flex h-11.5 text-zinc-500 transition">
              <LockKeyhole size={17} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter demo password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-full min-w-full flex-1 px-3 rounded-lg bg-transparent text-xs text-white outline-none placeholder:text-zinc-600 focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="grid place-items-center border-0 bg-transparent p-1 text-zinc-500 hover:text-orange-300"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
            Demo only: credentials are not securely verified. Do not use a real password.
          </div>
        </section>

        <footer className="mt-6 text-center text-[9px] leading-relaxed text-zinc-600">
          © {new Date().getFullYear()} Tech Flareconcept Academy · Empowering minds, building future.
        </footer>
      </div>
    </main>
  );
}