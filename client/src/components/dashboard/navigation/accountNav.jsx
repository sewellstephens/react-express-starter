'use client'

import { Fragment, useState, useEffect, Suspense } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Welcome from '../popups/welcome';
import { User, Users, CreditCard } from 'lucide-react'
import FeedbackPopup from '../popups/feedbackPopup';
import { ToastContainer } from 'react-toastify';

import { Link } from 'react-router-dom';
import cookies from '../../libs/getCookie'
import { useId } from 'react'
import { usePostHog } from 'posthog-js/react';
import LoadingPage from '../loading';


const navigation = [
  { name: 'Account', href: '/account', icon: User },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Plans', href: '/pay', icon: CreditCard }
]

const userNavigation = [
    { name: 'Account', href: '/account' },
    { name: 'Team', href: '/team' },
]

//function to combine classes for tailwind. DO NOT REMOVE
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MainNav({ children }) {
  const [initial, setInitial] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [docs, setDocs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [aiUsage, setAiUsage] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userId, setUserId] = useState('');
  const sessionKey = useId();
  const [survey, setSurvey] = useState(false);

  useEffect( () => {
    //delay to prevent code from running before browser is ready
    setTimeout(async () => {
      //check if user is in a team
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/getTeam`,
          {
            method: "GET",
            credentials: "include",
            //forward the authentication cookie to the backend
            headers: {
              "Content-Type": "application/json",
              "Cookie": cookies('token'),
            },
          }
        );
        const data = await response.json();
        //if user is not in a team, show welcome popup
          if (data.team === null) {
              setIsOpen2(true);
          }
          //if user is in a team, hide welcome popup
          else {
              setIsOpen2(false);
          }

      }
      catch (err) {
        //if there is an error, log it for debugging
        console.error(err);
      }

    }, 4000);
  }, []);

  useEffect( () => {
    //delay to prevent code from running before browser is ready
    setTimeout(async () => {
      console.log(cookies('token'));
      //get ai usage
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getUsage`,
          {
            method: "GET",
            credentials: "include",
            //forward the authentication cookie to the backend
            headers: {
              "Content-Type": "application/json",
              "Cookie": cookies('token'),
            },
          }
        );
        const data = await response.json();
          setAiUsage(data.textGenerationCredits);

      } catch (err) {
        //if there is an error, log it for debugging
        console.error(err);
      }
    }, 4000);
  }, []);

  /*
  old legacy code for getting docs. docs are now fetched from docs router in backend.
  useEffect( () => {
    //delay to prevent code from running before browser is ready
    setTimeout(async () => {
     const { token } = cookies('token');
     try {
       const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/pages`, {
         method: "GET",
         credentials: "include",
         //forward the authentication cookie to the backend
         headers: {
           "Content-Type": "application/json",
           "Cookie": token,
         },
       });
       const data = await response.json();
       const pageIdList = data.pages;
       const pages = await Promise.all(
         pageIdList.map(async (id) => {
           const response = await fetch(
             `${process.env.REACT_APP_API || 'http://localhost:4090'}/pages/${id}`,
             {
               method: "GET",
               credentials: "include",
               //forward the authentication cookie to the backend
               headers: {
                 "Content-Type": "application/json",
                 "Cookie": cookies('token'),
               },
             }
           );
           return await response.json();
         })
       );
       const filteredPages = pages.filter((page) => !page.errCode);
       setDocs(filteredPages);
       console.log(filteredPages);
       setLoading(false);
     } catch (err) {
       console.log(err);
       return { props: {} };
     }
    }, 2000);
     }, []);*/
     
     //logout function
     const logout = async () => {
      fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies('token'),
        },
      }).then((res) => {
        //reset posthog (IMPORTANT FOR ANALYTICAL PURPOSES)
        posthog.reset()
        //redirect to login page
        window.location.href = '/login';
      });
     };

     //check if user is logged in
  const checkUser = async () => {
    //delay to prevent code from running before browser is ready
    setTimeout(async () => {
      //log the token for debugging
      console.log(cookies('token'));

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API || 'http://localhost:4090'}/users/account`,
          {
            method: "GET",
            credentials: "include",
            //forward the authentication cookie to the backend
            headers: {
              "Content-Type": "application/json",
              "Cookie": cookies('token'),
            },
          }
        );
        const data = await response.json();
          const initial = data.name.at(0).toUpperCase();
          setInitial(initial);
          setEmail(data.email);
          setName(data.name);
          setUserId(data.userId);
          setProfilePic(data.pictureUrl);
      } catch (err) {
        //if there is an error, log it for debugging
        console.error(err);
        //redirect to login page also
        window.location.href = '/login';
        return { props: {} };
      }
    }, 1000);
  };


    useEffect(() => {
      //check user function call. DO NOT REMOVE
      checkUser();

    }, []);

  return (
    <LoadingPage>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div>

        {/* Static sidebar for desktop */}
        <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-50 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Link to="/dashboard">
              <img
                className="h-8 w-auto"
                src="/images/logos/re-logo.png"
                alt="Krastie logo"
              />
                </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            item.href === window.location.pathname
                              ? 'bg-gray-200 text-gray-900'
                              : 'text-gray-900 hover:bg-gray-200',
                            'group flex gap-x-3 items-center justify-start rounded-md p-1.5 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.href === window.location.pathname ? 'text-gray-900' : 'text-gray-900 group-hover:text-gray-900',
                              'h-5 w-5 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                
                </li>
                <li className="mt-auto">
                    <ul role="list" className="flex flex-col -mx-2 mb-5">
                        <li>
                          Text generations: {aiUsage}
                        </li>
                    </ul>
                          <Link
                            to="/pay"
                            className="items-center justify-center w-full -mx-2 mb-10 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500"
                          >
                            Upgrade
                          </Link>
                          <Menu as="div" className="relative">
                          <Menu.Button className="flex items-center justify-center w-full -mx-2 mb-4 rounded-md font-semibold hover:bg-gray-200 p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="bg-indigo-600  transition-all duration-300 ease-in-out text-white flex rounded-full text-lg items-center justify-center w-8 h-8">
                          {initial}
                        </span>
                    )}
                       <p className="truncate ml-3 w-[80%]">
                          {name}
                        </p>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    
                    <Menu.Items className="absolute bottom-14 z-10 mt-2.5 w-52 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item as="a" className="flex items-center px-3 py-1 justify-center gap-x-4">
                   
                    <div className="truncate text-center">
                      <p className='text-sm font-bold truncate'>{name}</p>
                    </div>
                    </Menu.Item>
                      {userNavigation.map((item) => (
                        <Menu.Item as="a" key={item.name} className="flex items-center w-full justify-center">
                          {({ active }) => (
                            <Link
                              to={item.href}
                              className={classNames(
                                active ? 'bg-gray-200' : '',
                                'block px-3 py-1 text-sm text-center leading-6 w-full text-gray-900'
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                          </Menu.Item>
                      ))}
                      <Menu.Item as="a" className="flex items-center w-full justify-center">
                      <button
                              onClick={() => logout()}
                              className="block px-3 py-1 text-sm text-center leading-6 w-full text-gray-900 hover:bg-gray-200"
                            >Log out</button>
                            </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                        </li>
              </ul>
            </nav>
          </div>
        </div>

        

        <div className="fixed bottom-5 right-5 z-[999]">
        <Menu as="div" className="relative">
          <Menu.Button>
          <img 
           src="/images/icons/help.png" 
           className="h-10 w-10 cursor-pointer" 
           alt="Help" 
          />
          </Menu.Button>
          <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
          >
          <Menu.Items anchor="top end" className="absolute bottom-14 right-0 z-[999] mt-2.5 w-52 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <Menu.Item as="a" className="flex items-center w-full justify-center">
              <a
              href="https://www.krastie.ai/help"
              target="_blank"
              className="block px-3 py-1 text-sm text-center leading-6 w-full text-gray-900 hover:bg-gray-200"
              >
                Help
              </a>
              </Menu.Item>
            <Menu.Item as="a" className="flex items-center w-full justify-center">
              <a
              href="https://re-logo.features.vote/roadmap"
              target="_blank"
              className="block px-3 py-1 text-sm text-center leading-6 w-full text-gray-900 hover:bg-gray-200"
              >
                Roadmap
              </a>
              </Menu.Item>
              <Menu.Item as="a" className="flex items-center w-full justify-center">
              <button
              id="report-bug"
              className="block px-3 py-1 text-sm text-center leading-6 w-full text-gray-900 hover:bg-gray-200"
              >
                Contact
              </button>
              </Menu.Item>
          </Menu.Items>
          </Transition>
        </Menu>
        </div>

        <main className="pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Welcome isOpen={isOpen2} setIsOpen={setIsOpen2} />
        <FeedbackPopup isOpen={survey} setIsOpen={setSurvey} />
      </div>
      <ToastContainer />
    </LoadingPage>
  )
}