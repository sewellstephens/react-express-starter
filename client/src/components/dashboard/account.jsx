import MainNav from './navigation/mainNav'
import { useState, useEffect } from 'react'
import { toast, ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import cookies from '../libs/getCookie.js';
import DeleteConfirm from './popups/deleteConfirm'
import { Link } from 'react-router-dom';

export default function Account() {
    const [formData, setFormData] = useState({});
    const [aiUsage, setAiUsage] = useState('');
    const [imageUsage, setImageUsage] = useState('');
    const [keywordUsage, setKeywordUsage] = useState('');
    const [plan, setPlan] = useState('');
    const [docUsage, setDocUsage] = useState('');
    const [teamUsage, setTeamUsage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [name, setName] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [company, setCompany] = useState('');
    const [website, setWebsite] = useState('');
    const [teamUpgrade, setTeamUpgrade] = useState(false);
    const [lastSiteFetch, setLastSiteFetch] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [initial, setInitial] = useState('');

    const handleProfilePic = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/upload`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        const data = await response.json();
        setProfilePic(data.url);
    }

  useEffect(() => {
    //fetch account data
    const fetchAccountData = async () => {
      //try to get account data
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API || 'http://localhost:4090'}/users/account`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json", 'Cookie': cookies('token') },
                }
            );
            const data = await response.json();
            //set email and name
            setEmail(data.email);
            setName(data.name);
            setCompany(data.org);
            setWebsite(data.website);
            setLastSiteFetch(data.lastSiteFetch);
            setProfilePic(data.pictureUrl);
            setInitial(data.name.charAt(0));
        } catch (err) {
            //log error
            console.error(err);
            //toast error
            toast.error(err, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        }
    };
    //run fetchAccountData DO NOT REMOVE
    fetchAccountData();
    }, []);

    useEffect( () => {
      //timeout to prevent code from running before browser is ready
      setTimeout(async () => {
        //log token for debugging
        console.log(cookies('token'));
        //try to get plan
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getPlan`,
            {
              method: "GET",
              credentials: "include",
              //forward the authentication cookie to the backend
              headers: {
                "Content-Type": "application/json",
                'Cookie': cookies('token'),
              },
            }
          );
          const data = await response.json();
            //set plan
            setPlan(data.plan);
            setTeamUpgrade(data.teamUpgrade);
  
        } catch (err) {
          //log error
          console.error(err);
          //toast error
          toast.error(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }, 2000);
    }, []);

    useEffect( () => {
      //timeout to prevent code from running before browser is ready
        setTimeout(async () => {
          //log token for debugging
          console.log(cookies('token'));
          //try to get usage
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getUsage`,
              {
                method: "GET",
                credentials: "include",
                //forward the authentication cookie to the backend
                headers: {
                  "Content-Type": "application/json",
                  'Cookie': cookies('token'),
                },
              }
            );
            const data = await response.json();
              setAiUsage(data.textGenerationCredits);
              setTeamUsage(data.teamSize);
              setImageUsage(data.imageGenerationCredits);
              setKeywordUsage(data.keywordCredits);

    
          } catch (err) {
            //log error
            console.error(err);
            //toast error
            toast.error(err, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        }
      }, 2000);
    }, []);


   //handle deleting users from team
   const handleDelete = async (email) => {
    try {
        //send delete request to backend
        const response = await fetch(
            `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/removeMember/${email}`,
        {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        }
    );
    const data = await response.json();
    if (data.errCode) {
        //if error, log error
        console.error(data.message);
        //toast error with react-toastify
        toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
        });
    } else {
        //if success, toast success with react-toastify
        toast.success("Successfully deleted user", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
        });
    }
    } catch (err) {
        //if error, log error
        console.error(err);
        //toast error with react-toastify
        toast.error(err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
    });
    }
};
        

  const handleTwoFactor = async (e) => {
    e.preventDefault();
    //try to update two factor authentication
    try {
      const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/activateTwoFactor`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies('token'),
        },
        body: JSON.stringify({
          enabledState: enabled,
        }),
      });
      const data = await response.json();
      if (data.errCode) {
        //log error
        console.error(data.message);
        //toast error
        toast.error(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        });
      } else {
        //toast success
        toast.success(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        });
      }
    } catch (err) {
      //log error
      console.error(err);
      //toast error
      toast.error(err, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //try to update account info
    try {
      console.log(name, email, company, website);
      //update account info
      const response = await fetch(
        `${process.env.REACT_APP_API || 'http://localhost:4090'}/users/account`,
        {
          method: "PUT",
          credentials: "include",
          headers: { 
            "Content-Type": "application/json",
            "Cookie": cookies('token'),
          },
          body: JSON.stringify({
            name: name,
            email: email,
            org: company,
            website: website,
            pictureUrl: profilePic,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        //log error
        console.error(data.message);
        //toast error
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
      //log error
      console.error(err);
      //toast error
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

  //if loading, show loading spinner
  if (isLoading) return (
    <div>
      <div>
            <div role="status" className="flex justify-center items-center mt-5 h-screen w-full">
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
  </div>
            </div>
    </div>
)

  return (
    <div className="mt-10">
      <div className="space-y-12">

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Update your personal info here.</p>
          </div>

          <form onSubmit={handleSubmit}>

          <div className='flex flex-row items-center justify-start gap-x-4'>
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="h-12 w-12 rounded-full" />
            ) : (
              <span id="user-menu" className="bg-indigo-600 font-semibold transition-all duration-300 ease-in-out text-white flex rounded-full text-2xl items-center justify-center w-12 h-12">
                  {initial}
                </span>
            )}
            <label htmlFor="profilePic" className="rounded-md cursor-pointer text-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold bg-white hover:bg-gray-200 ring-1 ring-inset ring-indigo-200 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">Upload picture</label>
            <input type="file" id="profilePic" name="profilePic" onChange={handleProfilePic} className="hidden" />
          </div>

          <div className="grid max-w-2xl grid-cols-1 mt-4 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  id="name"
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {teamUpgrade ? (
              <>
              <div className="col-span-full">
                <p className="block text-sm font-medium leading-6 text-gray-900">You are part of a team</p>
                <button
                  type="button"
                  onClick={() => handleDelete(email)}
                  className="rounded-md mt-2 bg-red-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                >
                  Leave team
                </button>
              </div>
              </>
            ) : (
              <>
              <div className="col-span-full">
              <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                Organization name
              </label>
              <div className="mt-2">
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Enter your organization name"
                  defaultValue={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="company"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                Website
              </label>
              <div className="mt-2">
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="Enter your website"
                  defaultValue={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  autoComplete="website"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            </>
            )}

            <div className="col-span-full">
              <button
                type="submit"
                className="rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                Update
              </button>
            </div>
          </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Usage statistics</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              See your quota here. You can upgrade your plan to get more quota.
            </p>
          </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="col-span-full">
                    <p className="block text-sm font-medium leading-6 text-gray-900">Text generation credits: {aiUsage}</p>
                    <p className="block text-sm font-medium leading-6 text-gray-900">Image generation credits: {imageUsage}</p>
                    <p className="block text-sm font-medium leading-6 text-gray-900">Keyword credits: {keywordUsage}</p>
                    <p className="block text-sm font-medium leading-6 text-gray-900">Team size: {teamUsage}</p>
                    </div>
                    </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Current plan</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              See your current plan here.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full flow-root">
              <p className="block text-xl font-medium leading-6 text-gray-900 float-left">{plan}</p>
              <div className="float-right">
              {plan === 'Basic' ? (
                <Link
                  to="/pay"
                  className="rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                >
                  Upgrade
                </Link>
              ) : (
                <form action={`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`} method="POST">
                  <input type="hidden" name="email" value={email} />
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                  >
                    Manage
                  </button>
                </form>
              )}
              </div>
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Two factor authentication</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Enable or disable two factor authentication.
            </p>
          </div>
          <form onSubmit={handleTwoFactor}>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
            <label htmlFor="enabled" className="block text-sm font-medium leading-6 text-gray-900">
                Two factor
              </label>
              <div className="mt-2">
              <select
                id="enabled"
                name="enabled"
                autoComplete="enabled"
                onChange={(e) => setEnabled(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>Select one</option>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </select>

            </div>
            </div>

            <div className="col-span-full">
              <button
                type="submit"
                className="rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                Update
              </button>
              </div>
              
          </div>
          </form>
          </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Delete account</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Delete your account here.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <button
                type="button"
                onClick={() => setIsOpen2(true)}
                className="rounded-md bg-red-600 transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete account
              </button>
            </div>
          </div>
          </div>
      </div>
    <DeleteConfirm isOpen={isOpen2} setIsOpen={setIsOpen2} />
    </div>
  )
}
