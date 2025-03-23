import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import { ShieldCheck, Check } from 'lucide-react';
import cookies from '../../libs/getCookie'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

function Pay({ isOpen, setIsOpen, email, name }) {

  const [frequency, setFrequency] = useState(frequencies[1])
  const [basicPayUrl, setBasicPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [startupPayUrl, setStartupPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [proPayUrl, setProPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [basicButtonText, setBasicButtonText] = useState('Purchase');
  const [startupButtonText, setStartupButtonText] = useState('Purchase');
  const [proButtonText, setProButtonText] = useState('Purchase');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getPlan`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies('token'),
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.plan === 'Basic') {
          setBasicPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
          setStartupPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
          setProPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);

          setBasicButtonText('Current Plan');
          setStartupButtonText('Purchase');
          setProButtonText('Purchase');
        }
        else if (data.plan === 'Startup') {
          setBasicPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setStartupPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setProPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);

          setBasicButtonText('Downgrade');
          setStartupButtonText('Manage Plan');
          setProButtonText('Purchase');
        }
        else if (data.plan === 'Pro') {
          setBasicPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setStartupPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setProPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);

          setBasicButtonText('Downgrade');
          setStartupButtonText('Downgrade');
          setProButtonText('Manage Plan');
        }
    })
  });
  
  const tiers = [
    {
      name: 'Basic',
      id: 'tier-basic',
      href: basicPayUrl,
      button: basicButtonText,
      price: { monthly: '$0', annually: '$0' },
      stripeId: { monthly: 'basic', annually: 'basic' },
      description: 'The essential features for your business.',
      features: [
        'Unlimited documents', 
        '100 AI requests/mo', 
        'AI Studio (coming soon)',
        'Prompt library',
        'Basic document editing features',
        'Collaboration',
      ],
      mostPopular: false,
    },
    {
      name: 'Startup',
      id: 'tier-startup',
      href: startupPayUrl,
      button: startupButtonText,
      price: { monthly: '$15', annually: '$12' },
      stripeId: { monthly: process.env.REACT_APP_STARTUP_MONTHLY, annually: process.env.REACT_APP_STARTUP_YEARLY },
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        'Unlimited documents',
        '150 AI requests/mo',
        'AI Studio (coming soon)',
        'Prompt library',
        'Basic document editing features',
        'Collaboration',
        'All integrations',
      ],
      mostPopular: true,
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: proPayUrl,
      button: proButtonText,
      price: { monthly: '$30', annually: '$24' },
      stripeId: { monthly: process.env.REACT_APP_PRO_MONTHLY, annually: process.env.REACT_APP_PRO_YEARLY },
      description: 'Dedicated support and infrastructure for your company.',
      features: [
          'Unlimited documents',
          '300 AI requests/mo',
          'Prompt library',
          'AI Studio (coming soon)',
          'Basic document editing features',
          'Collaboration',
          'All integrations',
          'Priority support',
      ],
      mostPopular: false,
    },
  ]

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
                <Dialog.Panel className="w-[80%] h-[800px] transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <Dialog.Title as="h2" className="text-3xl font-extrabold text-center mb-12 mt-1 leading-9 text-gray-900">Choose a pricing plan</Dialog.Title>
        <div className="flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={classNames(
                    frequency === option ? 'bg-indigo-600  transition-all duration-300 ease-in-out text-white' : 'text-gray-900',
                    'rounded-full px-2 py-1.5 cursor-pointer'
            )}
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
          <p className="rounded-full bg-gray-100 duration-300 ease-in-out/10 px-1.5 py-0.5 ml-2 mt-1 mb-1 text-xs font-semibold leading-5 text-gray-600">
            Save 20%
          </p>
        </div>
        <div className="flex mt-7 justify-center items-center">
        <div className="py-2 px-4 bg-gray-100 ease-in-out/10 rounded-lg flex items-center w-[700px]">
          <div className="w-[5%]">
          <ShieldCheck className="size-4" />
          </div>
          <p className="text-gray-600 w-[90%] text-xs">We have safeguards in place to prevent disputes and may reject your payment if deemed high risk. If you are having issues paying, contact us at info@krastie.ai</p>
        </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-2 ring-indigo' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-indigo' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-gray-100 transition-all duration-300 ease-in-out/10 px-2.5 py-1 text-xs font-semibold leading-5 text-gray-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/user/mo</span>
              </p>
              <p className="mt-4 text-sm leading-4 text-gray-600">billed {frequency.value}</p>
              <form action={tier.href} method="POST">
              <input type="hidden" name="priceId" value={tier.stripeId[frequency.value]} />
              <input type="hidden" name="planName" value={tier.name} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="name" value={name} />
              <button
                type="submit"
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'transition-all duration-300 ease-in-out bg-indigo-600  hover:bg-indigo-500 text-white shadow-sm'
                    : 'text-indigo-600ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-6 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo'
                )}
              >
                {tier.button}
              </button>
              </form>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-indigo" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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

export default Pay;