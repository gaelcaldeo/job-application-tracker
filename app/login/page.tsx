
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";



// export default function LoginPage() {
//   const router = useRouter();

//   const [isSignup, setIsSignup] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

  

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       if (isSignup) {
//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             emailRedirectTo: `${window.location.origin}/login`,
//           },
//         });

//         if (error) throw error;

//         if (data.session) {
//           router.replace("/");
//           router.refresh();
//         } else {
//           setMessage(
//             "Account created! Check your email to confirm your account before logging in."
//           );
//         }
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) throw error;

//         router.replace("/");
//         router.refresh();
//       }
//     } catch (error) {
//       setMessage(
//         error instanceof Error ? error.message : "Something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
//       <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
//         <div className="mb-8 text-center">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
//             J
//           </div>

//           <h1 className="mt-4 text-2xl font-bold text-slate-900">
//             JobTrack
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             {isSignup
//               ? "Create your personal job search account."
//               : "Welcome back. Continue your job search."}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Email address
//             </label>

//             <input
//               id="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Password
//             </label>

//             <input
//               id="password"
//               type="password"
//               autoComplete={isSignup ? "new-password" : "current-password"}
//               minLength={6}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="At least 6 characters"
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//             />
//           </div>

//           {message && (
//             <p
//               role="status"
//               className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"
//             >
//               {message}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading
//               ? "Please wait..."
//               : isSignup
//                 ? "Create Account"
//                 : "Log In"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-slate-500">
//           {isSignup ? "Already have an account?" : "New to JobTrack?"}{" "}
//           <button
//             type="button"
//             onClick={() => {
//               setIsSignup(!isSignup);
//               setMessage("");
//             }}
//             className="font-semibold text-indigo-600 hover:text-indigo-700"
//           >
//             {isSignup ? "Log in" : "Create account"}
//           </button>
//         </p>
//       </section>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";



export default function LoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace("/");
          router.refresh();
        } else {
          setMessage(
            "Account created! Check your email to confirm your account before logging in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  

const handleGoogleLogin = async () => {
  setLoading(true);
  setMessage("");

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Google login failed. Please try again."
    );
    setLoading(false);
  }
};



  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
            J
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            JobTrack
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isSignup
              ? "Create your personal job search account."
              : "Welcome back. Continue your job search."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            
<button
  type="button"
  onClick={handleGoogleLogin}
  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.85 46.98 24.55Z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
    />
  </svg>
  Continue with Google
</button>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {message && (
            <p
              role="status"
              className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account?" : "New to JobTrack?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {isSignup ? "Log in" : "Create account"}
          </button>
        </p>
      </section>
    </main>
  );
}
