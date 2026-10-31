import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/community" replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = signup(name, email, password);
    if (message) setError(message);
    else navigate("/community");
  };

  const inputClass = "h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600";
  const fieldClass = "flex h-[46px] items-center gap-2.5 rounded-lg border border-zinc-700 bg-[#121212] px-3 text-zinc-500 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101010] px-4 py-9 text-zinc-100 sm:px-5">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-52 h-110 w-110 rounded-full bg-orange-500 opacity-[0.13] blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 -left-32 h-110 w-110 rounded-full bg-orange-300 opacity-[0.10] blur-[100px]" />
      <div className="relative z-10 w-full max-w-107.5">
        <Brand />
        <section className="rounded-[18px] border border-[#35302b] bg-linear-to-br from-[#1c1b1a] to-[#151515] p-6 shadow-2xl shadow-black/40 sm:p-7.5">
          <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-[#58361d] bg-[#352316] text-orange-300"><UserRound size={22} /></div>
          <span className="text-[9px] font-bold tracking-[1.7px] text-orange-300">JOIN THE COMMUNITY</span>
          <h1 className="mt-2 mb-2 font-[Space_Grotesk] text-[27px] font-bold tracking-tight text-white sm:text-[29px]">Create your account</h1>
          <p className="mb-6 text-xs leading-6 text-zinc-400">Meet classmates, share projects, and learn together.</p>
          <form className="flex flex-col" onSubmit={submit}>
            <label htmlFor="name" className="mb-2 text-[11px] text-zinc-300">Full name</label>
            <div className={fieldClass}><UserRound size={17} /><input id="name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required className={inputClass} /></div>
            <label htmlFor="email" className="mt-4 mb-2 text-[11px] text-zinc-300">Email address</label>
            <div className={fieldClass}><Mail size={17} /><input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} /></div>
            <label htmlFor="password" className="mt-4 mb-2 flex items-center justify-between gap-2 text-[11px] text-zinc-300">Password <span className="text-[9px] text-zinc-500">At least 6 characters</span></label>
            <div className={fieldClass}><LockKeyhole size={17} /><input id="password" type={show ? "text" : "password"} placeholder="Create demo password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required className={inputClass} /><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility" className="grid place-items-center border-0 bg-transparent p-1 text-zinc-500 hover:text-orange-300">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {error && <div role="alert" className="mt-3 rounded-lg border border-[#673329] bg-[#321f1b] p-2.5 text-[11px] text-[#ff9c8b]">{error}</div>}
            <button className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-bold text-zinc-950 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300" type="submit">Create demo account <span aria-hidden="true">→</span></button>
          </form>
          <div className="my-5 flex items-center gap-3 text-[10px] text-zinc-500"><span className="h-px flex-1 bg-zinc-800" />or<span className="h-px flex-1 bg-zinc-800" /></div>
          <p className="text-center text-[11px] text-zinc-400">Already have a demo account? <Link className="font-semibold text-orange-300 hover:underline" to="/login">Sign in</Link></p>
          <div className="mt-5 rounded-lg border border-[#443323] bg-[#282018] px-3 py-2.5 text-[9px] leading-relaxed text-[#b18b67]">Demo only: account details are saved in this browser. This is not production authentication.</div>
        </section>
        <footer className="mt-6 text-center text-[9px] leading-relaxed text-zinc-600">© {new Date().getFullYear()} Tech Flareconcept Academy · Empowering minds, building future.</footer>
      </div>
    </main>
  );
}
