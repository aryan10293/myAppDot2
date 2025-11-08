import React from "react";
import { Link } from "react-router-dom";


export default function Landingpage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-sky-50 flex items-center justify-center p-6">
      <main className="w-full max-w-4xl">
        <section className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl p-6 md:p-10">
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Small steps. Real recovery. Gentle support.
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              software designed around tiny wins, forgiving repair plans,
              and encouragement from people who care.
            </p>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* Tiny Wins */}
            <div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-transparent hover:border-indigo-100 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Tiny Wins</h3>
              <p className="text-sm text-gray-600">
                Build momentum with short, forgiving daily goals that feel
                possible — and stack up into real change.
              </p>
            </div>

            {/* Repair Plan */}
            <div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-transparent hover:border-indigo-100 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Repair Plan</h3>
              <p className="text-sm text-gray-600">
                Missed a day? Get a clear, kind plan to bounce back — no restart
                guilt, just recovery that keeps you moving forward.
              </p>
            </div>

            {/* Real Accountability */}
            <div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-transparent hover:border-indigo-100 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM8 13c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4zM16 13c-.29 0-.577.012-.86.035 1.13.564 1.86 1.516 1.86 2.465v1h6v-1c0-2.667-5.333-4-7-4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Real Accountability</h3>
              <p className="text-sm text-gray-600">
                Gentle nudges and encouragement from buddies who know you
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex sm:flex-row sm:gap-4 gap-2 items-center">
                <Link to="/signup">
                    <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[.99] text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Start your first 5-minute win"
                    >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                        d="M12 6v6l4 2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    Start your first 5‑minute win
                    </button>
                </Link>
                <Link to="/login">
                    <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[.99] text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Login to your account"
                    >
                    
                    Login to your account
                    </button>
                </Link>
            </div>
            <p className="text-xs text-gray-500">No shame. Just steady progress.</p>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} — Built for small, steady progress.
        </footer>
      </main>
    </div>
  );
}
