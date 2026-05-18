import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MatchChart = ({ candidates }) => {
  const data = candidates.map(c => ({
    name: c.name,
    matchPercentage: Math.round(c.matchScore * 100)
  })).slice(0, 5); // top 5 for chart

  return (
    <div className="card mt-4" style={{ height: '300px' }}>
      <h3 className="mb-2 text-sm text-muted">Top 5 Candidates Match Score (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'var(--text-muted)' }} 
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: 'var(--text-muted)' }} 
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'var(--bg-hover)' }}
            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          />
          <Bar 
            dataKey="matchPercentage" 
            fill="var(--accent-primary)" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MatchChart;
