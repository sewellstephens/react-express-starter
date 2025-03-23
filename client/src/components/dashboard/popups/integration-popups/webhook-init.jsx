import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';   
import { nanoid } from 'nanoid';
import { set } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function Webflow({ isOpen, setIsOpen }) {
    const [webhookName, setWebhookName] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [webhookContentType, setWebhookContentType] = useState('');

    const handleWebhookSave = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webhooks/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'), 
            },
            body: JSON.stringify({
                webhookName: webhookName,
                webhookUrl: webhookUrl,
                webhookType: webhookContentType,
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (!data.errCode) {
                toast.success(data.message, {
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
            else {
                toast.error(data.message, {
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
        })
    }

    return (
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
                                        Create Webhook
                                    </Dialog.Title>

                                    <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-700">Create a webhook to automatically sync your content with none native integrations via Make or Zapier. You can create as many webhooks as you want.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleWebhookSave}>
                                            <div className="mt-4">
                                                <label htmlFor="webhookName" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                                <input type="text" id="webhookName" name="webhookName" value={webhookName} onChange={(e) => setWebhookName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="webhookUrl" className="block text-sm font-medium leading-6 text-gray-900">URL</label>
                                                <input type="text" id="webhookUrl" name="webhookUrl" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="webhookContentType" className="block text-sm font-medium leading-6 text-gray-900">Webhook type</label>
                                                <select id="webhookContentType" name="webhookContentType" value={webhookContentType} onChange={(e) => setWebhookContentType(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                    <option value="blog">Text (for blog posts)</option>
                                                    <option value="image">Image (for social media posts)</option>
                                                </select>
                                            </div>

                                            <div className="mt-4 flex justify-center">
                                                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out">Create</button>
                                            </div>
                                        </form>
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

export default Webflow;