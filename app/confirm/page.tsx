"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid confirmation link')
      return
    }

    // Confirm the email
    fetch('/api/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setStatus('success')
        setMessage('Email confirmed successfully!')
        // Redirect to confirmed page after 2 seconds
        setTimeout(() => {
          router.push('/confirmed')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Confirmation failed')
      }
    })
    .catch(error => {
      console.error('Confirmation error:', error)
      setStatus('error')
      setMessage('Network error occurred')
    })
  }, [searchParams, router])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl font-mono mb-2">Verifying...</h1>
            <p className="text-gray-400">Please wait while we confirm your email</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-mono mb-2 text-green-400">Confirmed!</h1>
            <p className="text-gray-400">{message}</p>
            <p className="text-xs text-gray-500 mt-4">Redirecting...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-mono mb-2 text-red-400">Error</h1>
            <p className="text-gray-400 mb-4">{message}</p>
            <button
              onClick={() => router.push('/early-access')}
              className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-2 font-mono text-sm uppercase tracking-wider transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </main>
  )
}