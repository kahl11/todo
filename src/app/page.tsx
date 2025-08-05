'use client';

import { useAuth } from '../lib/auth';
import { PhoneLoginForm } from '../components/PhoneLoginForm';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <PhoneLoginForm />;
  }

  return <Dashboard />;
}