import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export default function DashboardCard({ title, value, icon, color = 'bg-blue-500' }: DashboardCardProps) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white flex items-center space-x-6 ${color} transition-transform hover:scale-105 duration-200`}>
      {icon && <div className="text-5xl opacity-80">{icon}</div>}
      <div>
        <h3 className="text-lg font-medium opacity-90 uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}
