import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import cookies from '../libs/getCookie';
import { toast, ToastContainer, Bounce } from 'react-toastify';
 
const ForgotPasswordPage = () => {
 
  
  
    const values = {};
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      //prevent form from refreshing
      e.preventDefault();
      //get url params
      const urlParams = new URLSearchParams(window.location.search);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API || 'http://localhost:4090'}/users/resetPassword`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              password: password,
              resetToken: urlParams.get('token'),
            }),
          }
        );
        const data = await response.json();
        if (data.errCode) {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } else {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    };
  
 
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="/images/logos/re-logo.png"
            alt="Krastie logo"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 border shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Enter your new password"
                    required
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              <div>
              <button
                type="submit"
                className="flex w-full mt-8 justify-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >Reset password
              </button>
            </div>
            </div>
            </form>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            <Link to="/login" className="font-semibold leading-6 text-indigo-600hover:text-indigo-500">
              Remembered password
            </Link>
          </p>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            progress={undefined}
            theme="light"
            transition={Bounce}
          />
    </div>
  );
};
 
export default ForgotPasswordPage;