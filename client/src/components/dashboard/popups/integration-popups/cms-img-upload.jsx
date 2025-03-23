import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';

export const ImageUpload = ({ isOpen, setIsOpen, setTheImage }) => {

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePrompt, setImagePrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const editor = useEditorRef();

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
        setIsOpen(false);
    }

    const handleImageGenerate = (e) => {
      e.preventDefault();
      setIsGenerating(true);
      fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/pages/generateImage`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cookie": token
        },
        body: JSON.stringify({ text: imagePrompt, size: "1024x1024" }),
      })
      .then(res => res.json())
      .then(data => {

        //convert base64 to file
        const base64 = `data:image/png;base64,${data.data.data[0].b64_json}`;
        const image = dataURLtoFile(base64, `ai-image-${Date.now()}.png`);

        const formData = new FormData();
        formData.append("image", image);
  
        const docId = window.location.pathname.replace("/doc/", "");
  
        fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/imageUpload?pageId=${docId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
            setTheImage(`${process.env.REACT_APP_API || "http://localhost:4090"}/${data.imageUrl}`);
            setIsOpen(false);
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
        formData.append("image", file);
  
        const docId = window.location.pathname.replace("/doc/", "");
  
        fetch(`${process.env.REACT_APP_API || "http://localhost:4090"}/imageUpload?pageId=${docId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setTheImage(`${process.env.REACT_APP_API || "http://localhost:4090"}/${data.imageUrl}`);
          setIsOpen(false);
        })
      }


  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className='relative z-50' onClose={() => setIsOpen(false)}>
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
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="w-[500px] h-[500px] transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-2xl font-bold text-center">Add image</Dialog.Title>
              <p className='font-semibold text-sm'>Upload image</p>
              <div className='flex flex-col gap-4 mt-4 mb-4 w-[120px]'>
                 <label className="inline-flex items-center justify-center cursor-pointer rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" htmlFor="image">Upload image</label>
                 <input type="file" name="image" id="image" className='hidden' onChange={(e) => handleImageUpload(e)} />
              </div>
              <p className='font-semibold text-sm'>Insert image URL</p>
              <form onSubmit={handleImageAdd} className='flex flex-row gap-4 mt-4 mb-4 items-center justify-center'>
                <input type="text" placeholder='Image URL' className='block w-[85%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6' onChange={(e) => setImageUrl(e.target.value)} />
                <button className="flex items-center justify-center w-[25%] rounded-md bg-indigo-600  transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">Add image</button>
              </form>
              <p className='font-semibold text-sm'>Generate image with AI</p>
              <div className='flex flex-col gap-4 mt-4 mb-4'>
                <form onSubmit={handleImageGenerate} className='flex flex-row gap-4 mt-4 mb-4 items-center justify-center'>
                  <input type="text" placeholder='Prompt' onChange={(e) => setImagePrompt(e.target.value)} className='block w-[85%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                  <button className="flex items-center justify-center w-[25%] rounded-md bg-indigo-600   transition-all duration-300 ease-in-out px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          </div>
          </div>
          </Dialog>
      </Transition>
  );

}