import React from 'react'

const ComplaintCategory = () => {
  return (
    <div>
          <section className="bg-white py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

      {/* Card 1: Financial Fraud */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">💲</div>
        <h3 className="text-xl font-semibold mb-2">Financial Fraud</h3>
        <p className="text-gray-600 mb-4">
          Report online scams, banking fraud, investment fraud, and other financial cybercrimes swiftly.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Register a Complaint
        </button>
      </div>

      {/* Card 2: Harassment or Abuse */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">🙅‍♀️</div>
        <h3 className="text-xl font-semibold mb-2">Harassment or Abuse</h3>
        <p className="text-gray-600 mb-4">
          Address cyberstalking, online abuse, revenge porn, and other digital harassment incidents.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Register & Track
          </button>
        </div>
      </div>

      {/* Card 3: Other Cyber Crimes */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">💻</div>
        <h3 className="text-xl font-semibold mb-2">Other Cyber Crimes</h3>
        <p className="text-gray-600 mb-4">
          For phishing, hacking, data theft, intellectual property theft, and other digital offenses.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Register a Complaint
        </button>
      </div>

    </div>
  </div>
</section>
    </div>
  )
}

export default ComplaintCategory
