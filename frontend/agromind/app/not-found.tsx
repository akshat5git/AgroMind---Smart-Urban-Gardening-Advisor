"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NotFound() {
  const router = useRouter()



  return (
    <div className="h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  )
}