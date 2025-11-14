"use client"

import { useState } from "react"
import LoginForm from "../components/login-form"
import SignupForm from "../components/signup-form"

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Store Rating Platform</h1>
          <p className="text-secondary">Rate and discover the best stores</p>
        </div>

        <div className="bg-slate-900 rounded-lg shadow-xl border border-border p-8">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:text-primary-dark font-semibold transition"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
