import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment } from 'react'
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { Star } from 'lucide-react';


function FeedbackPopup({ isOpen, setIsOpen, initialMessage }) {
    const [message, setMessage] = useState(initialMessage || "");
    const [rating, setRating] = useState(0);
    const [pageUrl, setPageUrl] = useState(window.location.href);

    //classnames adder
    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        posthog?.capture("survey sent", {
            $survey_id: "0195219c-cd99-0000-28e2-74dd68950e5e", // required
            $survey_response: message,
            $survey_response_1: rating,
            $survey_response_2: pageUrl,
        })
        toast.success('Feedback submitted.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
        });
    };

    return (
        <div>
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
                            <Dialog.Panel className="w-[700px] h-[300px] transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div>
                                    <Dialog.Title as="h3" className="text-xl font-bold text-center leading-6 text-gray-900">
                                       Submit your bug report.
                                    </Dialog.Title>

                                    <div className="flex flex-col mt-4">
                                        <label htmlFor="message" className="text-sm text-gray-500">Please describe the bug you encountered in as much detail as possible.</label>
                                        <textarea id="message" name="message" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    </div>

                                    <div className="flex flex-col mt-4">
                                        <p className="text-sm text-gray-500">Please rate your experience with the app.</p>
                                        <div className="flex flex-row">
                                            <p className='p-1.5 hover:bg-gray-200 rounded-full' onClick={() => setRating(1)}><Star className={classNames("text-lg text-gray-500 cursor-pointer rounded-full", rating >= 1 ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} size={20} /></p>
                                            <p className='p-1.5 hover:bg-gray-200 rounded-full' onClick={() => setRating(2)}><Star className={classNames("text-lg text-gray-500 cursor-pointer rounded-full", rating >= 2 ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} size={20} /></p>
                                            <p className='p-1.5 hover:bg-gray-200 rounded-full' onClick={() => setRating(3)}><Star className={classNames("text-lg text-gray-500 cursor-pointer rounded-full", rating >= 3 ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} size={20} /></p>
                                            <p className='p-1.5 hover:bg-gray-200 rounded-full' onClick={() => setRating(4)}><Star className={classNames("text-lg text-gray-500 cursor-pointer rounded-full", rating >= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} size={20} /></p>
                                            <p className='p-1.5 hover:bg-gray-200 rounded-full' onClick={() => setRating(5)}><Star className={classNames("text-lg text-gray-500 cursor-pointer rounded-full", rating >= 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} size={20} /></p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-4">
                                        <label htmlFor="pageUrl" className="text-sm text-gray-500">Please enter the page you were on when the bug occurred.</label>
                                        <input id="pageUrl" name="pageUrl" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} />
                                    </div>

                                    <div className="mt-4">
                                    <button
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    className="inline-flex items-center rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                                                >
                                                    Submit
                                                </button>
                                    </div>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </div>
    );
}

export default FeedbackPopup;