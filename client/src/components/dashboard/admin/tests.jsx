

const Tests = () => {

    const handleRunTest = (test) => {
        if (test.cliTest) {
            console.log(test.command);
        }
        else {
            if (test.name === "User onboarding") {
                window.location.href = "/dashboard?test=onboarding";
            }
        }
    }

    let tests = [{
        name: "User onboarding",
        description: "This test is used to see if users can onboard themselves",
        id: 1,
        cliTest: false,
    },
    {
        name: "AI tests",
        description: "This test is used to see if users can use the AI chat",
        id: 2,
        cliTest: true,
        command: "npx cypress run --spec 'cypress/e2e/feature-tests/ai_chat_tests.cy.js'"
    },
    {
        name: "Log in tests",
        description: "This test is used to see if users can log in",
        id: 3,
        cliTest: true,
        command: "npx cypress run --spec 'cypress/e2e/authentication-tests/login_tests.cy.js'"
    },
    {
        name: "Sign up tests",
        description: "This test is used to see if users can sign up",
        id: 4,
        cliTest: true,
        command: "npx cypress run --spec 'cypress/e2e/authentication-tests/signup_tests.cy.js'"
    },
];

const handleSearch = (e) => {
    tests = tests.filter((test) => test.name.toLowerCase().includes(e.target.value.toLowerCase()));
}

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-10 m-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Tests</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the tests of Krastie AI
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <div className="flex gap-x-2">
                  <input
                      type="text"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-48 sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => handleSearch(e)}
                      placeholder="search by name"
                  />
                  </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tests.map((test, index) => (
                    <tr key={test.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{test.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{test.description}</div>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <div className="flex items-center justify-end gap-4">
                      {!test.cliTest ? <button
                        onClick={() => handleRunTest(test)}
                        className="text-indigo-600hover:text-indigo-900"
                      >
                        Run test
                      </button> : <div>{test.command}</div>}
                    </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Tests;
