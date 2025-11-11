import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:2050/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
    });
    console.log(firstName, lastName, email, password)
    const data = await response.json();
    if(data.status === "201"){

        const response = await fetch('http://localhost:2050/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({email, password}),
        });

        const data = await response.json();
        console.log(data);
         // should be redirect to  dashboard
         navigate('/profile');
        alert("Registration successful!");

    } else {
        console.log(data.message)
    }

   
    // TODO: handle sign up (send form data to your API)
    // You can read fields by using FormData(e.currentTarget)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-sky-50 flex items-center justify-center p-6">
      <main className="w-full max-w-md">
        <section className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 sm:p-8">
          <header className="text-center mb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Start with tiny wins — be gentle, consistent, and supported.
            </p>
          </header>

          {/* OAuth / social buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm text-gray-700 shadow-sm"
              aria-label="Sign up with Google (placeholder)"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 11.1v2.8h4.7c-.2 1.2-.9 2.3-1.9 3.1l3 2.3C19.7 19.1 21 16.8 21 14c0-.6-.1-1.1-.2-1.6H12z"
                />
                <path
                  fill="#34A853"
                  d="M6.3 14.1c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9L3.3 6.1C2.4 8 2 10 2 12s.4 4 .3 5.9l3-2.3z"
                />
                <path
                  fill="#4A90E2"
                  d="M12 6.5c1.3 0 2.5.4 3.5 1.2l2.6-2.6C17.4 3.6 14.9 2.5 12 2.5 9.7 2.5 7.6 3.4 6 5.1l3 2.3C9.3 7 10.6 6.5 12 6.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M21 14c0-.6-.1-1.1-.2-1.6H12v3.1h5.3c-.2 1.2-.9 2.3-1.9 3.1l3 2.3C19.7 19.1 21 16.8 21 14z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-gray-700"
              >
                First name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Drej"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Ryan"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700"
              >
                Email
              </label>
              <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="confirm the password"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            By continuing you agree to our{" "}
            <a className="underline" href="#">
              Terms
            </a>
            .
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
