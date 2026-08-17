import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-paper-100">
      <div className="max-w-md w-full border border-paper-200 bg-paper-50 p-8 text-center shadow-folio">
        <div className="text-courtyard-700 mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-950 mb-3">No access</h1>
        <p className="text-ink-600 mb-6">You do not have permission to view this page.</p>
        <Link to="/" className="btn-courtyard justify-center">
          Back home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
