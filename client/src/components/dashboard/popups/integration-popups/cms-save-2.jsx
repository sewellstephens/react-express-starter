import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';
import { nanoid } from 'nanoid';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function SaveToCMS2({ isOpen, setIsOpen, dataUrl, title }) {

    const [webhooks, setWebhooks] = useState([]);
    const [selectedWebhook, setSelectedWebhook] = useState('');
    const [isWebhook, setIsWebhook] = useState(true);
    const [scheduleDate, setScheduleDate] = useState('');
    const cookie = cookies('token');

    const handleSchedulePost = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API || 'https://api.krastie.ai'}/scheduler/create`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookies('token'),
                },
                body: JSON.stringify({
                    contentToExport: {
                        title: title,
                        dataUrl: dataUrl,
                        contentType: 'imagePost'
                    },
                    exportTo: 'webhook',
                    whenToExport: scheduleDate
                }),
            }
        );
        const res = await response.json();
        if (res.errCode) {
            console.error(res.message);
            toast.error(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        } else {
            console.log(res.message);
            toast.success(res.message, {
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
    }


    useEffect(() => {
        const getWebhooks = async () => {
            const response = await fetch(`${process.env.REACT_APP_API || 'https://api.krastie.ai'}/integrations/webhooks`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies('token'),
                },
            });
            const res = await response.json();

            if (res.errCode) {
                console.log('No webhooks found');
                setIsWebhook(false);
            }
            else {
                console.log(res);
                setWebhooks(res.webhooks);
                setIsWebhook(true);
            }
        }
        getWebhooks();
    }, []);

    const handleImageUpload = (theImage) => {
        
      }

      function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)?.[1],
            bstr = Buffer.from(arr[arr.length - 1], 'base64'), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr[n];
        }
        return new File([u8arr], filename, {type:mime});
      }

    const webhookSave = async (e) => {
        e.preventDefault();

        if (selectedWebhook === '') {
            toast.error('Please select a webhook', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }

        const image = dataUrl;
        const file = dataURLtoFile(image, `image-${Date.now()}.png`);

        if (!file) return;
  
        const formData = new FormData();
        formData.append("file", file);
  
        const studioId = nanoid(10);
        fetch(`${process.env.REACT_APP_API || "https://api.krastie.ai"}/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
        .then(res => res.json())
        .then(async data => {
          console.log(data);

        const response = await fetch(`${process.env.REACT_APP_API || 'https://api.krastie.ai'}/integrations/webhooks/export/${selectedWebhook}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                    title: title,
                    imageUrl: data.url,
                    contentType: 'imagePost'
            }),
        });

        const res = await response.json();
        console.log(res);

        if (res.errCode) {
            console.error(res.message);
            toast.error(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }

        toast.success(res.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
        });

    })

    }

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
                                        Export to social media
                                    </Dialog.Title>

                                        <div>
                                            <form onSubmit={webhookSave}>
                                                <label htmlFor="webhook">Webhook</label>
                                                <select id="webhook" name="webhook" onChange={(e) => setSelectedWebhook(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                                    <option value="">Select a webhook</option>
                                                    {webhooks.map((webhook) => {
                                                        return <option key={webhook._id} value={webhook._id}>{webhook.name}</option>
                                                    })}
                                                </select>
                                                <button type="submit" className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                                            </form>
                                            <div className="mt-4">
                                                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Schedule date</label>
                                                <input type="datetime-local" id="scheduleDate" name="scheduleDate" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" onChange={(e) => setScheduleDate(e.target.value)} />
                                            </div>
                                            <button type="button" onClick={() => handleSchedulePost()} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300">Schedule publish</button>
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

export default SaveToCMS2;