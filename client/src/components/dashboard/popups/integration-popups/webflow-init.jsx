import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';
import { nanoid } from 'nanoid';
import { set } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function Webflow({ isOpen, setIsOpen, isWebflow, setIsWebflow }) {
    const [view, setView] = useState('step1');
    const [sites, setSites] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fields1, setFields1] = useState([]);
    const [fields2, setFields2] = useState([]);
    const [fields3, setFields3] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [selectedSite, setSelectedSite] = useState([]);
    const [sitesLoaded, setSitesLoaded] = useState(false);
    const [collectionsLoaded, setCollectionsLoaded] = useState(false);
    const [titleField, setTitleField] = useState('');
    const [contentField, setContentField] = useState('');
    const [slugField, setSlugField] = useState('');
    const [coverImageField, setCoverImageField] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {

        //if the browser is not ready, return
        if (!window) {
            console.log("not ready");
            return;
        }

        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getPlan`, {
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

            if (!isWebflow) {
                console.log('not webflow');
                    setView('step1');
            }
            else {
                fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/sites`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies('token'),        
                    },
                }).then((res) => res.json())
                .then((data) => {
                    if (data.errCode === 401) {
                        setIsError(true);
                        setIsWebflow(false);
                        console.error(data.message);

                        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/deleteData`, {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'Cookie': cookies('token'),
                            },
                        }).then((res) => res.json())

                    }
                    else if (data.errCode) {
                        setIsError(true);
                        setIsWebflow(false);
                        console.error(data.message);
                    }
                    else {
                        console.log(data);
                    setSites(data.sites);
                    setSitesLoaded(true);
                    }
                }).catch((error) => {   
                    setIsError(true);
                    setIsWebflow(false);
                    console.error(error);
                });
            }
        });
    }, [isWebflow]);

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        console.log(selectedCollection);
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/collectionFields/${selectedCollection[0]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            setFields1(data.fields);
            setFields2(data.fields);
            setFields3(data.fields);
            setView('step3');
        })
    }

    const handleSubmit3 = async (e) => {
        console.log(selectedSite);
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/mapFields`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                titleField: titleField,
                contentField: contentField,
                slugField: slugField,
                coverImageField: coverImageField,
                collectionId: selectedCollection[0],
                cmsLocaleId: selectedSite[1],
                siteName: selectedSite[2],
                collectionName: selectedCollection[1],
            }),
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            setIsOpen(false);
            toast.success('Webflow integration successful!', {
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
        .catch((error) => {
            console.error(error);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedSite);
        if (selectedSite[1] === 'not compatible') {
            console.error('Site not compatible with Webflow CMS');
            toast.error('Site not compatible with Webflow CMS', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce
            });
        }
        else {
        setView('step2');
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/collections/${selectedSite[0]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            setCollections(data.collections);
            setCollectionsLoaded(true);
        })
        }
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
                                        Connect Webflow
                                    </Dialog.Title>

                                    <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="flex justify-center items-center">
                                                <img src="/images/logos/webflow-icon.png" alt="Webflow" className="h-20 w-20 m-auto" />
                                            </div>
                                            <p className="mt-10">By connecting Webflow, you will be guided through the following steps.</p>
                                            <ol className="list-decimal ml-5 list-inside mt-4">
                                                <li>Select a site</li>
                                                <li>Select a collection</li>
                                                <li>Map fields</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center">
                                        <Link
                                            to="https://webflow.com/oauth/authorize?response_type=code&client_id=094155b0b51b27c629503997626448c8eac3102fda99ae08da6b4cf454618525&scope=cms%3Aread+cms%3Awrite+sites%3Aread+sites%3Awrite+authorized_user%3Aread"
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

    if (!isWebflow) return (
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
                                        Connect Webflow
                                    </Dialog.Title>

                                    {view === 'step1' && (
                                        <>
                                        <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="flex justify-center items-center">
                                                <img src="/images/logos/webflow-icon.png" alt="Webflow" className="h-20 w-20 m-auto" />
                                            </div>
                                            <p className="mt-10">By connecting Webflow, you will be guided through the following steps.</p>
                                            <ol className="list-decimal ml-5 list-inside mt-4">
                                                <li>Select a site</li>
                                                <li>Select a collection</li>
                                                <li>Map fields</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center">
                                        <Link
                                            to="https://webflow.com/oauth/authorize?response_type=code&client_id=094155b0b51b27c629503997626448c8eac3102fda99ae08da6b4cf454618525&scope=cms%3Aread+cms%3Awrite+sites%3Aread+sites%3Awrite+authorized_user%3Aread"
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
                                        Connect Webflow
                                    </Dialog.Title>

                                    <div>
                                        <div>
                                            {view === 'step3' && (
                                              <form className="space-y-6 mt-6" onSubmit={handleSubmit3}>
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
                                                            {fields1.map((field) => (
                                                                <option key={field.id} value={field.slug}>{field.displayName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="contentField" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Map doc content
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="contentField"
                                                            id="contentField"
                                                            required
                                                            onChange={(e) => setContentField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select content field</option>
                                                            {fields2.map((field) => (
                                                                <option key={field.id} value={field.slug}>{field.displayName}</option>
                                                            ))}
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
                                                            {fields3.map((field) => (
                                                                <option key={field.id} value={field.slug}>{field.displayName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="coverImageField" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Map cover image
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="coverImageField"
                                                            id="coverImageField"
                                                            required
                                                            onChange={(e) => setCoverImageField(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="">Select cover image field</option>
                                                            {fields3.map((field) => (
                                                                <option key={field.id} value={field.slug}>{field.displayName}</option>
                                                            ))}
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
                                            {view === 'step2' && (
                                                <form className="space-y-6 mt-6" onSubmit={handleSubmit2}>
                                                    <div className="mt-2">
                                                    <label htmlFor="collections" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Select collection
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="collections"
                                                            id="collections"
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setSelectedCollection(e.target.value.split(","))}
                                                        >
                                                            <option value="">Select collection</option>
                                                            {collectionsLoaded === true && collections.map((collection) => {
                                                                const value = `${collection.id},${collection.displayName}`;
                                                                return (
                                                                    <option key={collection.id} value={value}>{collection.displayName}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                    >
                                                        Next
                                                    </button>
                                                </form>
                                            )}
                                            {view === 'step1' && (
                                                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                                                <div className="mt-2">
                                                    <label htmlFor="sites" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Select site
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            name="sites"
                                                            id="sites"
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setSelectedSite(e.target.value.split(","))}
                                                        >
                                                            <option value="">Select site</option>
                                                            {sitesLoaded === true && sites.map((site) => {
                                                                let value;
                                                                let display;
                                                                if (!site.locales) {
                                                                    value = `${site.id},not compatible,${site.displayName}`;
                                                                    display = `${site.displayName} (not compatible)`;
                                                                }
                                                                else {
                                                                    value = `${site.id},${site.locales.primary.cmsLocaleId},${site.displayName}`;
                                                                    display = site.displayName;
                                                                }
                                                                return (
                                                                    <option key={site.id} value={value}>{display}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='mt-2'>
                                                   <p>Don't see your site? <Link to="https://webflow.com/oauth/authorize?response_type=code&client_id=094155b0b51b27c629503997626448c8eac3102fda99ae08da6b4cf454618525&scope=cms%3Aread+cms%3Awrite+sites%3Aread+sites%3Awrite+authorized_user%3Aread" className="font-semibold text-indigo-600hover:text-indigo-500">Reconnect</Link></p>
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

export default Webflow;