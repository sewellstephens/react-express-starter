import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';
import { nanoid } from 'nanoid';
import { set } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function Linkedin({ isOpen, setIsOpen, isLinkedin, setIsLinkedin }) {


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
                                        Connect Linkedin
                                    </Dialog.Title>

                                    <div>
                                        <div className="mt-10 flex max-w-[400px] flex-col m-auto">
                                            <div className="flex justify-center items-center">
                                                <img src="/images/logos/linkedin-logo.png" alt="Linkedin" className="h-20 w-20 m-auto" />
                                            </div>
                                            <p className="mt-10">By connecting Linkedin, you will be able to publish posts to your Linkedin account.</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center">
                                        <Link
                                            to={`https://www.linkedin.com/oauth/v2/authorization?client_id=86cnhlbzkeyb96&response_type=code&redirect_uri=https://api.krastie.ai/integrations/linkedin/callback&state=${nanoid(20)}&scope=openid+w_member_social+email+profile`}
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
}

export default Linkedin;