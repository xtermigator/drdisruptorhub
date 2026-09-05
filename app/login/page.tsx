"use client";

import { createBrowserClient } from "@supabase/ssr";
import { FormEvent, useState } from "react";
import { Brain, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function signIn(event: FormEvent) {
    event.preventDefault();
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setError(result.error.message); else window.location.href = "/";
  }
  return <main className="grid min-h-screen place-items-center bg-navy p-5"><form onSubmit={signIn} className="w-full max-w-sm rounded-[28px] bg-white p-8 shadow-2xl"><div className="mb-8 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gator text-white"><Brain/></div><div><h1 className="display text-xl font-extrabold">Super Brain</h1><p className="text-xs text-ink/40">Private command center</p></div></div><label className="text-xs font-bold">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-ink/10 px-4 font-normal"/></label><label className="mt-5 block text-xs font-bold">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-ink/10 px-4 font-normal"/></label>{error&&<p className="mt-4 text-xs font-semibold text-red-600">{error}</p>}<button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gator font-bold text-white"><LockKeyhole size={17}/> Enter securely</button></form></main>;
}
