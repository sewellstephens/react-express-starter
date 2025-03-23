import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../libs/getCookie';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';

function Welcome({ isOpen, setIsOpen, email, userId }) {
    const [role, setRole] = useState('');
    const [size, setSize] = useState(0);
    const [source, setSource] = useState('');
    const [view, setView] = useState('welcome');
    const [org, setOrg] = useState('');
    const [team, setTeam] = useState('');
    const [website, setWebsite] = useState('');

    const teamId = nanoid(20);

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/team/welcome`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                size: size,
                role: role,
                source: source,
            }),
        }).then(() => {
            setView('welcome2');
        }).catch((error) => {
            console.error(error);
            toast.error('Error creating organization', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        });
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/team/createTeam`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                orgName: org,
                teamId: teamId,
                website: website,
            }),
        }).then(() => {
            toast.success('Organization created!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            setIsOpen(false);
        }).catch((error) => {
            console.error(error);
            toast.error('Error creating organization', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        });
    };
    const handleInvite = async () => {
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/team/teamInvite`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                email: team,
                teamName: org,
                inviteToken: teamId,
            }),
        });
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(true)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto" id="welcome-popup">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-[700px] h-[500px] transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div>
                                    <Dialog.Title as="h3" className="text-xl font-bold text-center leading-6 text-gray-900">
                                        Thanks for signing up. Let's get started.
                                    </Dialog.Title>

                                    <div>
                                        <div>
                                            {view === 'welcome2' && (
                                                <form className="space-y-6 mt-6" id="welcome2" onSubmit={handleSubmit2}>
                                                    <div className="mt-2">
                                                        <label htmlFor="org" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Organization name
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="org"
                                                                id="org"
                                                                placeholder="Enter your organization name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                onChange={(e) => setOrg(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <label htmlFor="team" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Website URL
                                                        </label>
                                                        <div className="mt-2">
                                                               <input
                                                                type="text"
                                                                name="website"
                                                                id="website"
                                                                placeholder="Enter your website URL"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                onChange={(e) => setWebsite(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-x-4">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center rounded-md bg-white transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray"
                                                            onClick={() => setView('welcome')}
                                                        >
                                                            Back
                                                        </button>
                                                    
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                        >
                                                            Finish
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            {view === 'welcome' && (
                                                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                                                <div className="mt-2">
                                                    <label htmlFor="size" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Size of team
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="number"
                                                            required
                                                            name="size"
                                                            id="size"
                                                            placeholder="Enter the size of your team"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setSize(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Your role
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="role"
                                                            id="role"
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setRole(e.target.value)}
                                                        >
                                                            <option value="">Select one</option>
                                                            <option value="Founder">Founder</option>
                                                            <option value="Marketing">Marketing</option>
                                                            <option value="Designer">Designer</option>
                                                            <option value="Software developer">Software developer</option>
                                                            <option value="Project manager">Project manager</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="source" className="block text-sm font-medium leading-6 text-gray-900">
                                                        How did you hear about us?
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="source"
                                                            required
                                                            id="source"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setSource(e.target.value)}
                                                        >
                                                            <option value="">Select one</option>
                                                            <option value="Google search">Google search</option>
                                                            <option value="Social media">Social media</option>
                                                            <option value="Friend">Friend</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex gap-x-4">
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                    >
                                                        Next
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md bg-white transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray"
                                                        onClick={() => setView('welcome2')}
                                                    >
                                                        Skip
                                                    </button>
                                                </div>
                                            </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Welcome;