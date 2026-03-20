import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function AdvancedStats({ sessions }) {
  // Process Emotional Data
  const emotionMap = sessions.reduce((acc, s) => {
    const e = s.emotion || 'Neutral';
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  
  const emotionData = Object.keys(emotionMap).map(key => ({
    name: key, value: emotionMap[key]
  }));

  // Process Routine Data
  const routineMap = sessions.reduce((acc, s) => {
    const r = s.routine || 'Manual';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const routineData = Object.keys(routineMap).map(key => ({
    name: key, count: routineMap[key]
  }));

  const COLORS = ['#63b3ed', '#9f7aea', '#68d391', '#f6ad55', '#fc8181', '#cbd5e0'];

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginBottom: '1.5rem', color: '#9f7aea' }}>
        📈 Advanced Therapist Analytics
      </h3>

      {/* Row 1: Emotion Distribution */}
      <div style={chartCardStyle}>
        <h4 style={chartTitleStyle}>Emotional Distribution</h4>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emotionData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Routine Frequency */}
      <div style={chartCardStyle}>
        <h4 style={chartTitleStyle}>Routine Effectiveness (Frequency)</h4>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#63b3ed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '1rem' }}>
        Insights based on {sessions.length} recorded sessions.
      </p>
    </div>
  );
}

const chartCardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 20, padding: '1.5rem',
  marginBottom: '1.5rem'
};

const chartTitleStyle = {
  margin: '0 0 1rem 0', fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600
};

const tooltipStyle = {
  background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white'
};
