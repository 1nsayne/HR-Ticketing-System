import React from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="text-center max-w-md space-y-8">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-2xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
            Unauthorized
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-semibold">
            You don't have permission to access this page
          </p>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Please log in with an account that has the required role or contact your administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button 
            onClick={() => navigate('/login')} 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
          >
            Back to Login
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            Home
          </Button>
        </div>

        <img 
          src={logo} 
          alt="Logo" 
          className="w-16 h-16 mx-auto opacity-20 absolute bottom-8 right-8"
        />
      </div>
    </div>
  );
}
