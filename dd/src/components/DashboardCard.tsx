import React from 'react'
import './DashboardCard.css'

type DashboardCardProps = {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
}

export default function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  return (
    <div className="dashboard-card" style={{ backgroundColor: color }}>
      <div className="dashboard-card-content">
        <div className="dashboard-card-icon">{icon}</div>
        <div className="dashboard-card-text">
          <p className="dashboard-card-title">{title}</p>
          <p className="dashboard-card-value">{value}</p>
        </div>
      </div>
    </div>
  )
}
