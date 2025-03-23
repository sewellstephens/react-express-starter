import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import cookies from '../../../libs/getCookie.js';
import { nanoid } from 'nanoid';
import { toast, ToastContainer, Bounce } from 'react-toastify';

function SaveToCMS({ isOpen, setIsOpen, markdown, title }) {

    const [slug, setSlug] = useState(title.toLowerCase().replace(/\s/g, '-'));
    const [coverImage, setCoverImage] = useState('');
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [isWebflow, setIsWebflow] = useState(false);
    const [webhooks, setWebhooks] = useState([]);
    const [selectedWebhook, setSelectedWebhook] = useState('');
    const [isWebhook, setIsWebhook] = useState(false);
    const [databases, setDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [isNotion, setIsNotion] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imagePrompt, setImagePrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [theImage, setTheImage] = useState('');

     /***
   * Converts a dataUrl base64 image string into a File byte array
   * dataUrl example:
   * data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACLCAYAAABRGWr/AAAAAXNSR0IA...etc
   */
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

    const handleImageAdd = (e) => {
        e.preventDefault();
        setTheImage(imageUrl);
    }

    const handleImageGenerate = (e) => {
      e.preventDefault();
      setIsGenerating(true);
      fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/pages/generateImage`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies('token')
        },
        body: JSON.stringify({ text: imagePrompt, size: "1024x1024" }),
      })
      .then(res => res.json())
      .then(data => {

        //convert base64 to file
        const base64 = `data:image/png;base64,${data.data.data[0].b64_json}`;
        const image = dataURLtoFile(base64, `ai-image-${Date.now()}.png`);

        const formData = new FormData();
        formData.append("file", image);
  
        const docId = router.asPath.replace("/doc/", "");
  
        fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
            setTheImage(data.url);
            setIsGenerating(false);
        })
      })
      .catch(err => {
        console.log(err);
        setIsGenerating(false);
      })
  }

    const handleImageUpload = (e) => {
        e.preventDefault();
        setIsUploading(true);
        const file = e.target.files?.[0];
        if (!file) return;
  
        const formData = new FormData();
        formData.append("file", file);
  
        const docId = router.asPath.replace("/doc/", "");
  
        fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/imageUpload?pageId=${docId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setTheImage(`${process.env.REACT_APP_API || "http://localhost:4090"}/${data.imageUrl}`);
        })
      }

    useEffect(() => {
        console.log(markdown);
        if (!isWebflow) {
            console.log('Webflow not connected');
        }
        else {
            fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/savedData`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies('token'),
                },
            }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                setCollections(data.webflow);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [isWebflow]);


    useEffect(() => {
        console.log(markdown);
        if (!isNotion) {
            console.log('Notion not connected');
        }
        else {
            fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/notion/checkData`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies('token'),
                },
            }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                setDatabases(data.notion);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [isNotion]);


    const handleSelectedIntegration = (e) => {
        if (e === 'webflow') {
            setIsWebflow(true);
            setIsWebhook(false);
            setIsNotion(false);
        }
        else if (e === 'webhook') {
            setIsWebhook(true);
            setIsWebflow(false);
            setIsNotion(false);
        }
        else if (e === 'notion') {
            setIsNotion(true);
            setIsWebflow(false);
            setIsWebhook(false);
        }
    }

    const handlePublish = async () => {
        const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webflow/publish`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                title: title,
                content: markdown,
                slug: slug,
                collectionId: selectedCollection,
                imageUrl: theImage
            }),
        });
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


    const handleNotionPublish = async () => {
        const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/notion/createItem`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                title: title,
                content: markdown,
                slug: slug,
                status: 'published',
                databaseId: selectedDatabase
            }),
        });
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

    const handleSchedulePostWebflow = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API || 'http://localhost:4090'}/scheduler/create`,
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
                        content: markdown,
                        slug: slug,
                        collectionId: selectedCollection,
                        imageUrl: theImage
                    },
                    exportTo: 'webflow',
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


    const handleSchedulePostWebhook = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API || 'http://localhost:4090'}/scheduler/create`,
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
                        content: markdown,
                        slug: slug,
                        contentType: 'BlogPost',
                        imageUrl: theImage
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
            const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webhooks`, {
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

        const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/integrations/webhooks/export/${selectedWebhook}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies('token'),
            },
            body: JSON.stringify({
                    title: title,
                    content: markdown,
                    slug: slug,
                    contentType: 'BlogPost'
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
                                        Export to CMS
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <label htmlFor="chooseIntegration" className="block text-sm font-medium text-gray-700">Choose integration</label>
                                        <select id="chooseIntegration" name="chooseIntegration" onChange={(e) => handleSelectedIntegration(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                            <option value="webflow">Webflow</option>
                                            <option value="webhook">Webhook</option>
                                            <option value="notion">Notion</option>
                                        </select>
                                    </div>

                                    {isNotion && (
                                        <div>
                                            <label htmlFor="database" className="block text-sm font-medium text-gray-700">Choose database</label>
                                            <select id="database" name="database" onChange={(e) => setSelectedDatabase(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                                <option value="">Select a database</option>
                                                {databases.map((database, index) => {
                                                    const databaseName = `My connection ${index + 1}`;
                                                    return <option key={database.id} value={database.databaseId}>{databaseName}</option>
                                                })}
                                            </select>
                                            <button type="button" onClick={handleNotionPublish} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500">Publish</button>
                                        </div>
                                    )}

                                    {isWebflow && (
                                        <div>
                                        <div className="mt-4">
                                        <label htmlFor="cms" className="block text-sm font-medium text-gray-700">
                                            Choose integration
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="cms"
                                                name="cms"
                                                autoComplete="cms"
                                                onChange={(e) => setSelectedCollection(e.target.value)}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="">Select a collection</option>
                                                {collections.map((collection) => {
                                                  const collectionName = `${collection.collectionName} - ${collection.siteName}`;
                                                 return (
                                                    <option key={collection.collectionId} value={collection.collectionId}>{collectionName}</option>
                                                 )}
                                                 )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className='flex flex-col gap-4 mt-4 mb-4 w-[180px]'>
                                            <label className="inline-flex items-center justify-center cursor-pointer rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" htmlFor="image">Upload cover image</label>
                                            <input type="file" name="image" id="image" className='hidden' onChange={(e) => handleImageUpload(e)} />
                                        </div>
                                    </div>


                                    
                                    

                                    <form onSubmit={handlePublish}>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Publish now
                                            </button>

                                            <div className="mt-4">
                                                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Schedule date</label>
                                                <input type="datetime-local" id="scheduleDate" name="scheduleDate" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" onChange={(e) => setScheduleDate(e.target.value)} />
                                            </div>
                                               
                                            <button
                                                type="button"
                                                onClick={() => handleSchedulePostWebflow()}
                                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300"
                                            >
                                                Schedule publish
                                            </button>
                                        </div>
                                    </form>

                                </div>
                                    )}
                                    {isWebhook && (
                                        <div>


                                    <div className="mt-4">
                                        <div className='flex flex-col gap-4 mt-4 mb-4 w-[180px]'>
                                            <label className="inline-flex items-center justify-center cursor-pointer rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" htmlFor="image">Upload cover image</label>
                                            <input type="file" name="image" id="image" className='hidden' onChange={(e) => handleImageUpload(e)} />
                                        </div>
                                    </div>    

                                            <form onSubmit={webhookSave}>
                                                <label htmlFor="webhook">Webhook</label>
                                                <select id="webhook" name="webhook" onChange={(e) => setSelectedWebhook(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                                    <option value="">Select a webhook</option>
                                                    {webhooks.map((webhook) => {
                                                        return <option key={webhook._id} value={webhook._id}>{webhook.webhookName}</option>
                                                    })}
                                                </select>
                                                <button type="submit" className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  transition-all duration-300 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                                            </form>

                                                 

                                            <div className="mt-4">
                                                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Schedule date</label>
                                                <input type="datetime-local" id="scheduleDate" name="scheduleDate" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" onChange={(e) => setScheduleDate(e.target.value)} />
                                            </div>
                                            <button type="button" onClick={() => handleSchedulePostWebhook()} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300">Schedule publish</button>
                                        </div>
                                    )}

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

export default SaveToCMS;