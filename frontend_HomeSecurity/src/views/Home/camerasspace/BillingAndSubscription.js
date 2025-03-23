import React, { useState, useEffect } from 'react';

const BillingAndSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [newPlan, setNewPlan] = useState('');

  useEffect(() => {
    // Fetch subscription details and billing info when the component mounts
    fetchSubscriptionDetails();
    fetchBillingInfo();
  }, []);

  const fetchSubscriptionDetails = async () => {
    // Replace with your API call
    const response = await fetch('/api/subscription');
    const data = await response.json();
    setSubscription(data);
  };

  const fetchBillingInfo = async () => {
    // Replace with your API call
    const response = await fetch('/api/billing-info');
    const data = await response.json();
    setBillingInfo(data);
  };

  const handlePlanChange = (event) => {
    setNewPlan(event.target.value);
  };

  const updateSubscription = async () => {
    // Replace with your API call to update subscription
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan }),
    });
    if (response.ok) {
      fetchSubscriptionDetails(); // Refresh subscription details
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Billing & Subscription</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Subscription</h2>
        {subscription ? (
          <div className="p-4 bg-gray-100 rounded-md">
            <p><span className="font-semibold">Plan:</span> {subscription.plan}</p>
            <p><span className="font-semibold">Status:</span> {subscription.status}</p>
          </div>
        ) : (
          <p>Loading subscription details...</p>
        )}
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Billing Information</h2>
        {billingInfo ? (
          <div className="p-4 bg-gray-100 rounded-md">
            <p><span className="font-semibold">Card Number:</span> {billingInfo.cardNumber}</p>
            <p><span className="font-semibold">Expiry Date:</span> {billingInfo.expiryDate}</p>
          </div>
        ) : (
          <p>Loading billing information...</p>
        )}
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Update Subscription Plan</h2>
        <label htmlFor="plan-select" className="block text-sm font-medium mb-2">Select New Plan:</label>
        <select
          id="plan-select"
          value={newPlan}
          onChange={handlePlanChange}
          className="block w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">--Select a plan--</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button
          onClick={updateSubscription}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update Plan
        </button>
      </section>
    </div>
  );
};

export default BillingAndSubscription;
