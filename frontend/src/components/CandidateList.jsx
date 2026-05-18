import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Code, Clock, Mail } from 'lucide-react';

// Simple cache for instant loading (Stale-While-Revalidate pattern)
let cachedCandidates = null;

const CandidateList = () => {
  const [candidates, setCandidates] = useState(cachedCandidates || []);
  const [loading, setLoading] = useState(!cachedCandidates);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (cachedCandidates) {
      setCandidates(cachedCandidates);
      setLoading(false);
    }
    fetchCandidates(!!cachedCandidates); // silent background fetch if cached
  }, []);

  const fetchCandidates = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await axios.get('https://candidate-shortlist-backend-9yvd.onrender.com/api/candidates');
      cachedCandidates = res.data;
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="flex items-center gap-3 m-0 text-slate-800">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users color="var(--accent-primary)" size={28} />
          </div>
          Candidate Database
        </h2>
        
        <div className="flex items-center gap-2" style={{ width: '350px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or skill..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '45px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted font-medium">Loading candidate profiles...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '4rem', background: 'transparent', border: '2px dashed var(--border-color)' }}>
           <Users size={48} className="mx-auto mb-4 opacity-50" />
           <h3 className="text-xl">No candidates found</h3>
           <p>Try adjusting your search terms or add a new candidate.</p>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {filteredCandidates.map(candidate => (
            <div key={candidate._id} className="card card-interactive flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="m-0 text-xl font-bold text-slate-800">{candidate.name}</h3>
                  <div className="flex items-center gap-1.5 text-muted text-sm mt-1">
                    <Mail size={14} /> {candidate.email}
                  </div>
                </div>
                <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 border border-amber-100">
                  <Clock size={14} />
                  {candidate.experience} {candidate.experience === 1 ? 'yr' : 'yrs'}
                </div>
              </div>
              
              <div className="mt-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-1.5 mb-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Skills
                </div>
                <div className="flex" style={{ gap: '0.6rem', flexWrap: 'wrap' }}>
                  {candidate.skills.map((skill, i) => (
                    <span key={i} className="badge bg-blue-50 text-blue-600 border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
