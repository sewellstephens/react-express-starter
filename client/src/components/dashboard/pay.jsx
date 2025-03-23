import { RadioGroup } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import { ShieldCheck, Check } from 'lucide-react';
import cookies from "../libs/getCookie.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'yearly', label: 'Yearly', priceSuffix: '/year' },
]

function Pay() {

  const [frequency, setFrequency] = useState(frequencies[1])
  const [basicPayUrl, setBasicPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [startupPayUrl, setStartupPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [proPayUrl, setProPayUrl] = useState(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);
  const [basicButtonText, setBasicButtonText] = useState('Purchase');
  const [startupButtonText, setStartupButtonText] = useState('Purchase');
  const [proButtonText, setProButtonText] = useState('Purchase');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [teamUpgrade, setTeamUpgrade] = useState(false);
  const cookie = cookies('token');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/account`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Cookie': cookies('token'),
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setEmail(data.email);
        setName(data.name);
      })
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/usage/getPlan`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Cookie': cookies('token'),
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
          setTeamUpgrade(data.teamUpgrade);
        }
        else if (data.plan === 'Startup') {
            setBasicPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setStartupPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setProPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/create`);

          setBasicButtonText('Downgrade');
          setStartupButtonText('Manage Plan');
          setProButtonText('Purchase');
          setTeamUpgrade(data.teamUpgrade);
        }
        else if (data.plan === 'Pro') {
          setBasicPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setStartupPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);
          setProPayUrl(`${process.env.REACT_APP_API || 'http://localhost:4090'}/payments/portal`);

          setBasicButtonText('Downgrade');
          setStartupButtonText('Downgrade');
          setProButtonText('Manage Plan');
          setTeamUpgrade(data.teamUpgrade);
        }
    })
  });
  
  const tiers = [
    {
      name: 'Basic',
      id: 'tier-basic',
      href: basicPayUrl,
      button: basicButtonText,
      price: { monthly: '$0', yearly: '$0' },
      stripeId: { monthly: 'basic', yearly: 'basic' },
      description: 'Best for trying out our product',
      features: [
        'Unlimited documents', 
        'Unlimited studios',
        '20 text gen', 
        '10 image gen',
        '5 keyword searches',
        'Prompt library',
        'Basic document editing features',
        'Team collaboration',
        '0 team members',
      ],
      mostPopular: false,
    },
    {
      name: 'Startup',
      id: 'tier-startup',
      href: startupPayUrl,
      button: startupButtonText,
      price: { monthly: '$15', yearly: '$12' },
      stripeId: { monthly: process.env.REACT_APP_STARTUP_MONTHLY, yearly: process.env.REACT_APP_STARTUP_YEARLY },
      description: 'Best for startups getting a feel',
      features: [
        'Unlimited documents',
        'Unlimited studios',
        '300 monthly text gen',
        '100 monthly image gen',
        '30 monthly keyword searches',
        'Prompt library',
        'Basic document editing features',
        'Team collaboration',
        '2 team members',
        'All integrations',
      ],
      mostPopular: false,
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: proPayUrl,
      button: proButtonText,
      price: { monthly: '$30', yearly: '$24' },
      stripeId: { monthly: process.env.REACT_APP_PRO_MONTHLY, yearly: process.env.REACT_APP_PRO_YEARLY },
      description: 'Best for medium-large businesses',
      features: [
          'Unlimited documents',
          'Unlimited studios',
          '500 monthly text gen',
          '300 monthly image gen',
          '50 monthly keyword searches',
          'Prompt library',
          'Basic document editing features',
          'Team collaboration',
          '4 team members',
          'All integrations',
          'Priority support',
      ],
      mostPopular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 'Custom', yearly: 'Custom' },
      stripeId: { monthly: 'enterprise', yearly: 'enterprise' },
      description: 'Best for large businesses',
      features: [
        'Unlimited documents',
        'Unlimited studios',
        'Unlimited text gen',
        'Unlimited image gen',
        'Unlimited keyword searches',
        'Prompt library',
        'Basic document editing features',
        'Team collaboration',
        'Unlimited team members',
        'All integrations',
        'Priority support',
    ],
      id: 'tier-enterprise',
      href: 'https://www.krastie.ai/request-a-demo',
      button: 'Contact Sales',
    },
  ]

  if (teamUpgrade) {
    return (
      <div>
        <div className="bg-white mt-10 mb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="ring-1 mt-5 ring-inset ring-gray-200 rounded-lg p-4 mb-7">
        <h2 className="text-gray-900 text-xl font-bold">You are part of a team</h2>
        <p className="text-gray-600 text-sm mt-2">Please contact the owner of the team to upgrade your plan</p>
          </div>
          </div>
        </div>
      </div>
    )
  }

  return (
 <div>
    <div className="bg-white mt-10 mb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="ring-1 mt-5 ring-inset ring-gray-200 rounded-lg p-4 mb-7">
        <h2 className="text-gray-900 text-xl font-bold">Need more team members?</h2>
        <p className="text-gray-600 text-sm mt-2">Contact our sales team to upgrade your plan to Enterprise.</p>
      </div>
      <h1 className="text-3xl font-bold text-center mb-10 leading-9 mt-10 text-gray-900">Upgrade your plan</h1>
        <div className="flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="flex gap-x-1 rounded-lg p-1 bg-gray-100 text-center text-xs/5 font-semibold ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={classNames(
                    frequency === option ? 'bg-white text-gray-900' : 'bg-transparent text-gray-900',
                    'rounded-lg px-2.5 py-1 cursor-pointer'
            )}
              >
                <span>{option.label} {option.value === 'yearly'}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>

          <div className="flex items-center ml-2">
            <span className="text-white bg-indigo-600 px-2 py-1 rounded-full font-semibold text-xs">Save 20%</span>
          </div>
        </div>
        <div className="isolate mx-auto mt-7 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-1 ring-indigo-600' : 'ring-1 ring-gray-200',
                'rounded-xl px-8 py-8'
              )}
            >
              <div className="flex items-center justify-start gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-indigo' : 'text-gray-900',
                    'text-lg text-left font-semibold leading-6'
                  )}
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-6 flex items-baseline justify-start gap-x-1">
                <span className="text-2xl font-bold tracking-tight text-gray-900">{tier?.price[frequency?.value] || 'Custom'}</span>
                <span className="text-xs font-semibold leading-6 text-gray-600">{tier.name === 'Enterprise' ? '' : '/month'}</span>
              </p>
              <p className="mt-4 text-xs leading-4 text-gray-600">Billed {frequency.value}</p>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              {tier.href === 'https://www.krastie.ai/request-a-demo' ? (
                <a href={tier.href} target="_blank" className='text-indigo-600 transition-all duration-300 ease-in-out ring-1 ring-inset ring-indigo-200 hover:bg-gray-200 hover:ring-indigo-300 mt-6 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo'>
                  {tier.button}
                </a>
              ) : (
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
                  : 'text-indigo-600 transition-all duration-300 ease-in-out ring-1 ring-inset ring-indigo-200 hover:bg-gray-200 hover:ring-indigo-300',
                  'mt-6 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo'
                )}
              >
                {tier.button}
              </button>
              </form>
              )}
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
  )
}

export default Pay;