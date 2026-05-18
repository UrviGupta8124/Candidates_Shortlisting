import React, { useState } from 'react';
import axios from 'axios';
import { Target, Search, Loader } from 'lucide-react';
import ShortlistDisplay from './ShortlistDisplay';

const JobRequirementForm = () => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: 0
  });
  const [shortlisted, setShortlisted] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShortlisted(null);
    setAiSuggestion('');
    
    try {
      const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        requiredSkills: skillsArray,
        minExperience: Number(formData.minExperience)
      };

      // Basic matching
      const res = await axios.post('http://localhost:5000/api/match', payload);
      const candidates = res.data;
      setShortlisted(candidates);
      setLoading(false);

      // AI Matching
      if (candidates.length > 0) {
        setAiLoading(true);
        try {
          const aiRes = await axios.post('http://localhost:5000/api/ai/shortlist', {
            requiredSkills: skillsArray,
            minExperience: payload.minExperience,
            candidates: candidates.slice(0, 5) // Send top 5 to AI
          });
          setAiSuggestion(aiRes.data.aiSuggestion);
        } catch (aiErr) {
          console.error("AI matching failed", aiErr);
          const errMsg = aiErr.response?.data?.error || "AI shortlisting failed. Please check the API key or try again later.";
          setAiSuggestion(`Error: ${errMsg}`);
        } finally {
          setAiLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setAiSuggestion("Error: Cannot connect to the server. Is the backend running?");
      setShortlisted([]); // To trigger the error display
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="card">
        <h2 className="flex items-center gap-3 mb-6 m-0 text-slate-800">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Target color="var(--accent-secondary)" size={26} />
          </div>
          Find Perfect Candidates
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div className="form-group mb-0">
              <label>Required Skills (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. React, Node.js, MongoDB" 
                required 
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>
            <div className="form-group mb-0">
              <label>Min Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                value={formData.minExperience}
                onChange={(e) => setFormData({...formData, minExperience: e.target.value})}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <Search />}
            Shortlist Candidates
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center text-muted mt-4 p-8 card border-dashed">
          <Loader className="animate-spin mx-auto mb-2" size={32} color="var(--accent-primary)" />
          <p>Running matching algorithm...</p>
        </div>
      )}

      {shortlisted && !loading && (
        <ShortlistDisplay 
          candidates={shortlisted} 
          aiSuggestion={aiSuggestion || (aiLoading ? null : '')} 
          requiredSkills={formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)}
        />
      )}
    </div>
  );
};

export default JobRequirementForm;
