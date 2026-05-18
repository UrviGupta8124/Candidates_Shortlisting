import React from 'react';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import MatchChart from './MatchChart';

const ShortlistDisplay = ({ candidates, aiSuggestion, requiredSkills }) => {
  if (!candidates || candidates.length === 0) return (
    <div className="card text-center text-muted mt-4" style={{ padding: '4rem 2rem', background: 'transparent', border: '2px dashed var(--border-color)' }}>
      <Sparkles size={48} className="mx-auto mb-4" color="var(--border-color)" />
      <h3 style={{ color: 'var(--text-muted)' }}>No candidates matched your criteria.</h3>
      <p>Try lowering the experience requirement or adjusting the skills.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 mt-4 animate-fade-in">
      <div className="card ai-box p-8">
        <h2 className="flex items-center gap-2 m-0 mb-4" style={{ color: 'var(--accent-secondary)' }}>
          <Sparkles size={24} />
          AI Recommendation
        </h2>
        {aiSuggestion ? (
          <div className="p-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-main)' }}>
            {aiSuggestion.replace(/\*\*/g, '')}
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center gap-3 text-muted opacity-70 my-4">
            <div style={{
              width: '40px', height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p className="font-medium tracking-wide">Analyzing profiles and generating insights...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}
      </div>

      <h3 className="mt-4 mb-2" style={{ fontSize: '1.5rem', marginLeft: '0.75rem' }}>Top Matches</h3>
      
      <div className="grid">
        {candidates.map((c, idx) => {
          const matchPercent = Math.round(c.matchScore * 100);
          let scoreColor = 'var(--accent-danger)';
          if (matchPercent >= 80) scoreColor = 'var(--accent-success)';
          else if (matchPercent >= 50) scoreColor = 'var(--accent-warning)';

          return (
            <div key={idx} className="card card-interactive flex flex-col gap-2 relative overflow-hidden" style={{ paddingLeft: '2.5rem' }}>
              <div 
                style={{ 
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px',
                  backgroundColor: scoreColor
                }} 
              />
              <div className="flex justify-between items-center">
                <h3 className="m-0" style={{ fontSize: '1.35rem' }}>{c.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider">Match Score</span>
                    <span className="text-2xl font-bold" style={{ color: scoreColor }}>{matchPercent}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-sm text-muted mb-2 font-medium">Skills Comparison</div>
                <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                  {requiredSkills.map(reqSkill => {
                    const hasSkill = c.skills.some(s => s.toLowerCase() === reqSkill.toLowerCase());
                    return (
                      <div key={reqSkill} className="flex items-center gap-1 text-sm font-medium" 
                           style={{ 
                             backgroundColor: hasSkill ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                             color: hasSkill ? 'var(--accent-success)' : 'var(--accent-danger)',
                             padding: '4px 10px',
                             borderRadius: '6px',
                             border: `1px solid ${hasSkill ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                           }}>
                        {hasSkill ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                        {reqSkill}
                      </div>
                    );
                  })}
                  {c.skills.filter(s => !requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase())).map(extraSkill => (
                     <div key={extraSkill} className="badge text-muted" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid transparent' }}>
                       + {extraSkill}
                     </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MatchChart candidates={candidates} />
    </div>
  );
};

export default ShortlistDisplay;
