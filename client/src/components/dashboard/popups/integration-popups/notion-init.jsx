import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';
import { nanoid } from 'nanoid';
import { set } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function Notion({ isOpen, setIsOpen, isNotion, setIsNotion }) {
    const [view, setView] = useState('step1');
    const [databases, setDatabases] = useState([]);
    const [databaseProperties, setDatabaseProperties] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [titleField, setTitleField] = useState('');
    const [slugField, setSlugField] = useState('');
    const [dateField, setDateField] = useState('');
    const [statusField, setStatusField] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!isNotion) {
            setView('step1');
        }
        else {
            fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/notion/searchDatabase`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies('token'),
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setDatabases(data.databases.results);
            })
        }
    }, [isNotion]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/notion/getDatabase/${selectedDatabase}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setDatabaseProperties(data.database.results[0]);
            setView('step2');
        })
    }

    const handleSubmit2 = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/notion/mapFields`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                databaseId: selectedDatabase,
                titleField: titleField,
                slugField: slugField,
                dateField: dateField,
                statusField: statusField,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setIsOpen(false);
            toast.success('Notion integration successful!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        })
    }


    if (isError) return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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

                <div className="fixed inset-0 overflow-y-auto">
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
                                        Connect Notion
                                    </Dialog.Title>

                                    <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="flex justify-center items-center">
                                                <img src="/images/logos/notion-icon.png" alt="Notion" className="h-20 w-20 m-auto" />
                                            </div>
                                            <p className="mt-10">By connecting Notion, you will be guided through the following steps.</p>
                                            <ol className="list-decimal ml-5 list-inside mt-4">
                                                <li>Select a page</li>
                                                <li>Map fields</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center">
                                        <Link
                                            to={`https://api.notion.com/v1/oauth/authorize?client_id=158d872b-594c-80bb-8a99-00378d53ddd8&response_type=code&owner=user&redirect_uri=${process.env.REACT_APP_API}/integrations/notion/callback`}
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                        >
                                            Connect
                                        </Link>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    if (!isNotion) return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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

                <div className="fixed inset-0 overflow-y-auto">
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
                                        Connect Notion
                                    </Dialog.Title>

                                    {view === 'step1' && (
                                        <>
                                        <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="flex justify-center items-center">
                                                <img src="/images/logos/notion-icon.png" alt="Notion" className="h-20 w-20 m-auto" />
                                            </div>
                                            <p className="mt-10">By connecting Notion, you will be guided through the following steps.</p>
                                            <ol className="list-decimal ml-5 list-inside mt-4">
                                                <li>Select a page</li>
                                                <li>Map fields</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center">
                                        <Link
                                            to={`https://api.notion.com/v1/oauth/authorize?client_id=158d872b-594c-80bb-8a99-00378d53ddd8&response_type=code&owner=user&redirect_uri=${process.env.REACT_APP_API}/integrations/notion/callback`}
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                        >
                                            Connect
                                        </Link>
                                    </div>
                                        </>
                                    )}
                                    {view === 'upgrade' && (
                                        <>
                                        <div className="flex flex-col items-center justify-center">
                                                <div className="mt-4">
                                                    <p className="text-center text-lg font-semibold">Upgrade to Startup to connect Webflow</p>
                                                </div>
                                                <div className="mt-4 flex justify-center">
                                                    <Link to="/pay" className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">Upgrade</Link>
                                                </div>
                                                </div>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    return (
        <>
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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

                <div className="fixed inset-0 overflow-y-auto">
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
                                        Connect Notion
                                    </Dialog.Title>

                                    <div>
                                        <div>
                                            {view === 'step2' && (
                                              <form className="space-y-6 mt-6" onSubmit={handleSubmit2}>
                                                <div className="mt-2">
                                                    <label htmlFor="titleField" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Map doc title
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="titleField"
                                                            id="titleField"
                                                            required
                                                            onChange={(e) => setTitleField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select title field</option>
                                                            {Object.entries(databaseProperties.properties).map(([propertyName, propertyValue]) => {
                                                                return (
                                                                    <option key={propertyValue.id} value={propertyName}>{propertyName}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="dateField" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Map doc date
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="dateField"
                                                            id="dateField"
                                                            required
                                                            onChange={(e) => setDateField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select date field</option>
                                                            {Object.entries(databaseProperties.properties).map(([propertyName, propertyValue]) => {
                                                                return (
                                                                    <option key={propertyValue.id} value={propertyName}>{propertyName}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="slugField" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Map slug
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="slugField"
                                                            id="slugField"
                                                            required
                                                            onChange={(e) => setSlugField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select slug field</option>
                                                            {Object.entries(databaseProperties.properties).map(([propertyName, propertyValue]) => {
                                                                return (
                                                                    <option key={propertyValue.id} value={propertyName}>{propertyName}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="statusField" className="block text-sm font-medium leading-6 text-gray-900"> Map doc status </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="statusField"
                                                            id="statusField"
                                                            required
                                                            onChange={(e) => setStatusField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select status field</option>
                                                            {Object.entries(databaseProperties.properties).map(([propertyName, propertyValue]) => {
                                                                return (
                                                                    <option key={propertyValue.id} value={propertyName}>{propertyName}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                >
                                                    Finish
                                                </button>
                                            </form>
                                            )}
                                            {view === 'step1' && (
                                                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                                                <div className="mt-2">
                                                    <label htmlFor="databases" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Select database
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="sites"
                                                            id="sites"
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setSelectedDatabase(e.target.value)}
                                                        >
                                                            <option value="">Select database</option>
                                                            {databases.map((database) => {
                                                                return (
                                                                    <option key={database.id} value={database.id}>{database.title[0].text.content}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='mt-2'>
                                                   <p>Don't see your database? <Link to={`https://api.notion.com/v1/oauth/authorize?client_id=158d872b-594c-80bb-8a99-00378d53ddd8&response_type=code&owner=user&redirect_uri=${process.env.REACT_APP_API}/integrations/notion/callback`} className="font-semibold text-indigo-600hover:text-indigo-500">Reconnect</Link></p>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                >
                                                    Next
                                                </button>
                                            </form>
                                            )}
                                            {view === 'upgrade' && (
                                                <div className="flex flex-col items-center justify-center">
                                                <div className="mt-4">
                                                    <p className="text-center text-lg font-semibold">Upgrade to Startup to connect Webflow</p>
                                                </div>
                                                <div className="mt-4 flex justify-center">
                                                    <Link to="/pay" className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">Upgrade</Link>
                                                </div>
                                                </div>
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
        </>
    );
}

export default Notion;