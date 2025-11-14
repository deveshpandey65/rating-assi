interface StatsCardProps {
  title: string
  value: number
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg border border-border">
      <p className="text-secondary text-sm font-medium mb-2">{title}</p>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  )
}
