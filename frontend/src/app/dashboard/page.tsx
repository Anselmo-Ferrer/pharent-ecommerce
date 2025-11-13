'use client'

import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {

  useEffect(() => {
    const userData = getUser()
    if (userData?.role !== 'admin') {
      redirect("/")
    } else {
      redirect("/dashboard/overview")
    }
  }, [])

}
