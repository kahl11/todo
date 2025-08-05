'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../app/firebase';
import { Phone, Shield, ArrowLeft, Send } from 'lucide-react';

interface PhoneLoginFormProps {
  onBack?: () => void;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({ onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const { signInWithPhone } = useAuth();

  useEffect(() => {
    // Initialize reCAPTCHA with a small delay to ensure DOM is ready
    const initializeRecaptcha = () => {
        if (typeof window !== 'undefined' && !recaptchaVerifier) {
          try {
            const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
            console.log('Initializing reCAPTCHA with site key:', siteKey ? 'Found' : 'Missing');
            
            // Remove the check that throws an error - let's proceed without custom site key
            if (!siteKey) {
              console.warn('reCAPTCHA site key not found in environment variables, using Firebase default');
            }
            
            // Ensure the DOM element exists before creating RecaptchaVerifier
            const containerElement = document.getElementById('recaptcha-container');
            if (!containerElement) {
              throw new Error('reCAPTCHA container element not found');
            }
            
            // Create verifier with minimal config - don't use custom sitekey for now
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
              callback: (response: string) => {
                console.log('reCAPTCHA solved successfully:', response);
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
              },
              'error-callback': (error: any) => {
                console.error('reCAPTCHA error:', error);
                setError('reCAPTCHA verification failed. Please refresh the page.');
              },
            });
            setRecaptchaVerifier(verifier);
            console.log('reCAPTCHA verifier initialized successfully');
          } catch (error) {
            console.error('Failed to initialize reCAPTCHA:', error);
            setError('Failed to initialize security verification. Please refresh the page.');
          }
        }
      };
    
    // Add small delay to ensure DOM is ready
    const timer = setTimeout(initializeRecaptcha, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [recaptchaVerifier]);

  // Cleanup effect
  useEffect(() => {

    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, [recaptchaVerifier]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Must have exactly 10 digits for US phone number
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // Handle case where user includes country code
      return `+1${digits.slice(1)}`;
    }
    
    // Return null for invalid lengths
    return null;
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !recaptchaVerifier) return;

    // Validate phone number before sending
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit US phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!formattedPhone) {
        setError('Please enter a valid 10-digit US phone number');
        return;
      }
      
      const result = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('verification');
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || !confirmationResult) return;

    setError('');
    setLoading(true);

    try {
      await confirmationResult.confirm(verificationCode);
      // User will be automatically signed in via the auth state listener
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove all non-digit characters for processing
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits maximum
    const limitedDigits = digits.slice(0, 10);
    
    // Just store the digits, no formatting
    setPhoneNumber(limitedDigits);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              {step === 'phone' ? (
                <Phone className="h-6 w-6 text-white" />
              ) : (
                <Shield className="h-6 w-6 text-white" />
              )}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {step === 'phone' ? 'Sign in with phone' : 'Verify your number'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {step === 'phone' 
                ? 'Enter your phone number to receive a verification code'
                : `We sent a verification code to ${phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`
              }
            </p>
          </div>

          {step === 'phone' ? (
            <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="5551234567"
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm font-medium"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  US phone numbers only. Enter 10 digits: 5551234567
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !phoneNumber.trim() || !isValidPhoneNumber(phoneNumber)}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Code
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl font-mono tracking-widest font-bold"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="flex-1 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {onBack && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Back to login options
              </button>
            </div>
          )}

          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container" ref={recaptchaRef}></div>
        </div>
      </div>
    </div>
  );
};