import React from 'react';

const DonationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Make a Difference with Your Donation</h1>
        <p className="text-center text-green-600 mb-4">Your contribution can help change lives. Join us in making a positive impact.</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Amount</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Donation Amount"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Donate Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;