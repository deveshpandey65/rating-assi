"use client"

import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}

  const getRoleBasedLinks = () => {
    if (user.role === "admin") {
      return [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/stores", label: "Stores" },
      ]
    } else if (user.role === "store_owner") {
      return [
        { href: "/store-owner/dashboard", label: "Dashboard" },
        { href: "/user/settings", label: "Settings" },
      ]
    } else {
      return [
        { href: "/user/dashboard", label: "Discover Stores" },
        { href: "/user/settings", label: "Settings" },
      ]
    }
  }

  return (
    <nav className="bg-slate-900 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-foreground">Store Rating</div>
        <div className="flex items-center gap-6">
          <div className="flex gap-6">
            {getRoleBasedLinks().map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition ${
                  pathname === link.href ? "text-primary font-semibold" : "text-secondary hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <span className="text-secondary text-sm border-l border-border pl-6">{user.name}</span>
          <button onClick={handleLogout} className="text-primary hover:text-primary-dark transition font-semibold">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
