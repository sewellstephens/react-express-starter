import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function PaySuccess({ isOpen, setIsOpen, email, name }) {

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
                <Dialog.Panel className="w-[600px] h-[300px] transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
            <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600">
                <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
            </div>
        </div>
      <Dialog.Title as="h2" className="text-3xl font-extrabold text-center mb-12 mt-1 leading-9 text-gray-900">Payment successful</Dialog.Title>
       </div>
       <p className="text-center">You have completed your payment. If you have any issues, Please contact info@krastie.ai.</p>
       <p className="text-center mt-10 text-xs">*Note it may take a few min for new feature to populate. If features dont populate within a few min contact info@krastie.ai for refund.</p>
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

export default PaySuccess;