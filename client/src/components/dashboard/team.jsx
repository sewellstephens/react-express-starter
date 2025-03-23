import { useState, useEffect } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import cookies from '../libs/getCookie.js';
  
  export default function Team() {
    const [people, setPeople] = useState([]);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState("");
    const [teamUpgrade, setTeamUpgrade] = useState(false);

    useEffect(() => {
        //fetch team members from backend
        const fetchUsers = async (team) => {
            try {
            const response = await fetch(
                `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/getUsers/${team}`,
                {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", 'Cookie': cookies('token'), },
                }
            );
            const data = await response.json();
            setPeople(data.users);
            setIsLoading(false);
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
            });
            }
        }
        //timeout to fetch team members after 2 seconds to prevent errors
        setTimeout(async () => {
          //fetch current team from backend so we can fetch team members. 
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/getTeam`,
                    {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json", 'Cookie': cookies('token'), },
                    }
                );
                const data = await response.json();
                //fetch team members from backend
                fetchUsers(data.team);
                //set team to current team
                setTeam(data);
                console.log(data);
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
        }, 2000);
        }, []);

        useEffect(() => {
          fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getPlan`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", 'Cookie': cookies('token'), },
          }).then(res => res.json())
          .then(data => {
            setTeamUpgrade(data.teamUpgrade);
          });
        }, [team]);

        //handle inviting users to team
        const handleInvite = async (e) => {
            e.preventDefault();
            const emails = email.replace(" ", "").split(",");
            console.log(emails);
            try {
                //send invite to backend
                const response = await fetch(
                    `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/teamInvite`,
                {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", 'Cookie': cookies('token'),},
                body: JSON.stringify({ emails: emails, inviteToken: team.team, teamName: team.org }),
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
                toast.success("Successfully invited user", {
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

        //if loading, show loading spinner

        if (isLoading) return (
          <div className="px-4 sm:px-6 lg:px-8 mt-10">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name, and email.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              {!teamUpgrade ? (<form className="flex gap-x-2" onSubmit={handleInvite}>
                  <input
                      type="text"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-48 sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Emails (comma separated)"
                  />
                  <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo-600focus:border-indigo-500 active:bg-indigo-500 transition duration-150 ease-in-out"
                  >
                      Invite Users
                  </button>
              </form>) : null}
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div role="status" className="flex justify-center items-center mt-5 h-[200px] w-full">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
              </div>
            </div>
          </div>
        </div>
        )

    return (
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, and email.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {!teamUpgrade ? (<form className="flex gap-x-2" onSubmit={handleInvite}>
                  <input
                      type="text"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-48 sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Emails (comma separated)"
                  />
                  <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo-600focus:border-indigo-500 active:bg-indigo-500 transition duration-150 ease-in-out"
                  >
                      Invite Users
                  </button>
              </form>) : null}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          {person.pictureUrl ? (
                            <img src={person.pictureUrl} alt="Profile" className="h-11 w-11 rounded-full" />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-indigo-600  transition-all duration-300 ease-in-out text-white font-semibold flex items-center justify-center text-xl">
                              {person.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{person.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{person.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{person.role}</td>
                      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {!teamUpgrade ? <button
                            type="button"
                            onClick={() => handleDelete(person.email)}
                            className="text-red-600 hover:text-red-900"
                            >
                            Remove
                        </button> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  