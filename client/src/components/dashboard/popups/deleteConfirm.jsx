import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment } from 'react'
import cookies from '../../libs/getCookie';
import { XMarkIcon } from '@heroicons/react/20/solid'

function DeleteConfirm({ isOpen, setIsOpen }) {

  const handleDelete = async (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/delete`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies('token'),
      },
    }).then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
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
                <Dialog.Panel className="w-[600px] h-[300px] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
            <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600">
                <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
            </div>
        </div>
      <Dialog.Title as="h2" className="text-2xl font-extrabold text-center mb-12 mt-1 leading-9 text-gray-900">Are you share you want to delete</Dialog.Title>
        <div>
          <div className="flex justify-center">
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default DeleteConfirm;