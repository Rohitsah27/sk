"use client"

import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent === 'accepted') {
      setConsentGiven(true);
    } else if (storedConsent !== 'denied') {
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsentGiven(true);
    setShowConsent(false);
    // Initialize cookie-dependent features
  };

  const denyCookies = () => {
    localStorage.setItem('cookieConsent', 'denied');
    setConsentGiven(false);
    setShowConsent(false);
    // Remove non-essential cookies
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 max-w-2xl bg-gray-800 text-white p-5 rounded-lg shadow-xl z-[1000] animate-fade-in-up">
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">
          We use cookies to enhance your browsing experience and analyze site traffic. 
          By clicking "Accept All", you consent to our use of cookies.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={denyCookies}
            className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;