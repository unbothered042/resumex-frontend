import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingKey, setBuyingKey] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await API.get('/payments/plans/');
      setPlans(res.data);
    } catch (err) {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (planKey) => {
    setBuyingKey(planKey);
    setError('');
    try {
      const res = await API.post('/payments/initialize/', { plan: planKey });
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setError('Could not start checkout. Please try again.');
      setBuyingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-4xl mb-2 text-center" style={displayFont}>Choose a Plan</h1>
        <p className="text-[#9AA1B2] mb-12 text-center max-w-xl mx-auto">
          Credits are a one-time top-up, not a subscription. They never expire and
          only run out when you use them.
        </p>

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-6 text-sm max-w-md mx-auto text-center">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[#9AA1B2] text-center">Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-8 flex flex-col"
              >
                <h2 className="text-2xl mb-1" style={displayFont}>{plan.label}</h2>
                <p className="text-3xl font-semibold text-[#D4A657] mb-1">
                  ₦{plan.price_ngn.toLocaleString()}
                </p>
                <p className="text-[#6C7386] text-sm mb-6">one-time</p>

                <ul className="text-[#C7CAD4] text-sm space-y-2 mb-8 flex-1">
                  <li>{plan.credits} full analyses (CV rewrite + cover letter included)</li>
                  <li>Unlocks {plan.key === 'starter' ? 'Entry' : plan.key === 'plus' ? 'Entry & Mid' : 'all seniority'} level rewrites</li>
                  <li>Credits never expire</li>
                </ul>

                <button
                  onClick={() => handleBuy(plan.key)}
                  disabled={buyingKey === plan.key}
                  className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {buyingKey === plan.key ? 'Redirecting...' : `Get ${plan.label}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Plans;