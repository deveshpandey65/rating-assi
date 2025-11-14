"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "../../../components/navbar"
import StatsCard from "../../../components/stats-card"

interface DashboardStats {
  totalUsers: number
  totalStores: number
  totalRatings: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/")

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(response.data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Users" value={stats?.totalUsers || 0} />
          <StatsCard title="Total Stores" value={stats?.totalStores || 0} />
          <StatsCard title="Total Ratings" value={stats?.totalRatings || 0} />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Management</h2>
            <ul className="space-y-3">
              <li>
                <a href="/admin/users" className="text-primary hover:text-primary-dark transition">
                  → Manage Users ({stats?.totalUsers || 0} users)
                </a>
              </li>
              <li>
                <a href="/admin/stores" className="text-primary hover:text-primary-dark transition">
                  → Manage Stores ({stats?.totalStores || 0} stores)
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Stats</h2>
            <ul className="space-y-3 text-secondary">
              <li>
                Total Ratings: <span className="text-primary font-semibold">{stats?.totalRatings || 0}</span>
              </li>
              <li>
                Average Rating Submissions:{" "}
                <span className="text-primary font-semibold">
                  {stats?.totalStores ? (stats.totalRatings / stats.totalStores).toFixed(1) : 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
