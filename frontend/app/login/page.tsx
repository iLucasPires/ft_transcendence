"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [type, setType] = useState("signup");

  function handleSubmit(e: any) {
    e.preventDefault();
    if (type === "login") {
      // login
    }
    if (type === "signup") {
      // signup
    }
  }

  function changeType() {
    setType(type === "signin" ? "signup" : "signin");
  }

  return (
    <div className="hero min-h-screen bg-base-200 w-full justify-center">
      <div className="hero-content flex-col lg:flex-row-reverse w-screen">
        <div className="card w-full max-w-md md:shadow-2xl md:bg-base-100 ">
          <div className="card-body w-full">
            <h1 className="mb-5 text-4xl font-bold">
              {type === "signin" ? "Sign in" : "Sign up"}
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label label-text">Email</label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label label-text">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
              </div>
              {type === "signin" ? (
                <Link href="#" className="label label-text-alt link link-hover">
                  Forgot password?
                </Link>
              ) : (
                <div>
                  <div className="form-control">
                    <label className="label label-text">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="password again"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    By signing up, you agree to our Terms
                    <br />
                    <Link href="#" className="label-text-alt link link-hover">
                      Terms of Service
                    </Link>
                    &nbsp;and&nbsp;
                    <Link href="#" className="label-text-alt link link-hover">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              )}
              <div className="form-control mt-6">
                <button className="btn btn-primary">{type}</button>
              </div>
            </form>
            <div className="form-control">
              <div className="join w-full">
                <button className="btn btn-neutral w-1/2 join-item">
                  42
                </button>
                <button className="btn bg-white text-black w-1/2 join-item">
                  Google
                </button>
              </div>

              <label className="label">
                <button
                  className="label-text-alt link link-hover"
                  onClick={changeType}
                >
                  {type === "signin"
                    ? "Don't have an account yet? Sign up"
                    : "Already have an account? Login"}
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
