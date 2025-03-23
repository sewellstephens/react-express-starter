import { useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom"
import { toast, ToastContainer, Bounce } from 'react-toastify';
import cookies from '../libs/getCookie';
 
export default function SignInForm() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  


  //if the user is already logged in, redirect them to the dashboard.
  useEffect(() => {
    const token = cookies('token');
    fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/account`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': token,
      },
    }).then((res) => res.json())
    .then((data) => {
      if (data.email) {
        window.location.href = '/';
      }
    })
  }, []);


  useEffect(() => {
    setTimeout(() => {
      //get url params
      const urlParams = new URLSearchParams(window.location.search);
      //if there is an error, display it.
      if (urlParams.get('error')) {
        //if their is an error, display it.
        toast.error(urlParams.get('error'), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
      }
      else if (urlParams.get('tfa')) {
        //if two factor authentication is required, display a success message.
        toast.success("Two factor required. Please check email.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
      }
    }, 2000);
  }, []);
  
  return (
    <div className="h-full bg-white">
    {/*
      This example requires updating your template:

      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    */}
    <div className="flex min-h-full flex-1 mt-10">
        <div className="mx-auto w-full max-w-sm lg:max-w-[480px]">
          <div className="flex items-center justify-center flex-col">
            <img
              alt="Krastie AI logo"
              src="/images/logos/re-logo.png"
              className="h-8 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 text-center tracking-tight text-gray-900">
              Welcome back
            </h2>
          </div>

          <div className="shadow sm:rounded-lg border p-12 mt-10">

          <div className="">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <form method="POST" action={`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/login`} className="space-y-6">
                <div>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      onChange={(e) => setEmailAddress(e.target.value)}
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">

                  <div className="text-sm leading-6">
                    <Link to="/forgot" className="font-semibold text-indigo-600hover:text-indigo-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                  >
                    {loading ? 'Loading...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10">

          <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/google`}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus-visible:ring-transparent"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">Sign in with Google</span>
                </a>
              </div>
            </div>

            </div>

            
          </div>


          <p className="my-6 text-sm text-center leading-6 text-gray-500">
              Not a member?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600hover:text-indigo-500">
                Create an account
              </Link>
            </p>

        </div>
      </div>
    <ToastContainer />
  </div>
  );

}