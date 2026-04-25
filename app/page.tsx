import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import LandingPage from '@/components/LandingPage'

export default function Home() {
  const { userId } = auth()
  if (userId) redirect('/dashboard')
  return <LandingPage />
}
