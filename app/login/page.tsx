"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "../../lib/firebase/client";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(firebaseAuth, setUser), []);

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      }
      setMessage("Signed in with MPlace ID.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setMessage("");
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      setMessage("Signed in with MPlace ID.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await signOut(firebaseAuth);
    setMessage("Signed out.");
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand-lockup" href="/">
          <img src="https://unrealcake8.github.io/cdn-hls/mplace.png" alt="MPlace" className="mplace-logo" />
          <span className="product-name">ADS</span>
          <span className="product-short">M.Ads</span>
        </Link>
        <div className="nav-actions">
          <Link className="pill" href="/publisher">Publishers</Link>
          <Link className="pill" href="/docs">API Docs</Link>
        </div>
      </nav>

      <section className="hero" style={{ gridTemplateColumns: "minmax(0, 620px)", justifyContent: "center" }}>
        <div className="panel hero-panel">
          <span className="tag">MPlace ID</span>
          <h1>{user ? "Your M.Ads account" : mode === "signin" ? "Sign in to M.Ads" : "Create your MPlace ID"}</h1>
          <p>Use the same MPlace ID across M.Ads, MPlace Pages, MVideo, and MPlace Search.</p>

          {user ? (
            <div className="section">
              <p><strong>{user.displayName || user.email || "MPlace member"}</strong></p>
              <p className="muted">{user.email}</p>
              <div className="cta-row">
                <Link className="pill primary-pill" href="/publisher">Go to Publishers →</Link>
                <button className="pill" type="button" onClick={logout}>Sign out</button>
              </div>
            </div>
          ) : (
            <div className="section">
              <button className="pill primary-pill" type="button" onClick={handleGoogle} disabled={busy} style={{ width: "100%" }}>
                Continue with Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
                <span style={{ height: 1, background: "var(--border, #ddd)", flex: 1 }} />
                <span className="muted">or</span>
                <span style={{ height: 1, background: "var(--border, #ddd)", flex: 1 }} />
              </div>

              <form onSubmit={handleEmail} style={{ display: "grid", gap: 12 }}>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" minLength={6} required />
                <button className="pill primary-pill" disabled={busy} type="submit">
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create MPlace ID"}
                </button>
              </form>

              <button className="pill" type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ width: "100%", marginTop: 12 }}>
                {mode === "signin" ? "Create an account instead" : "Sign in instead"}
              </button>
            </div>
          )}

          {message && <p className="muted" role="status">{message}</p>}
        </div>
      </section>
    </main>
  );
}
