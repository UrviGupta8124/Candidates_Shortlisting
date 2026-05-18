import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, CheckCircle } from 'lucide-react';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        name: formData.name,
        email: formData.email,
        skills: skillsArray,
        experience: Number(formData.experience)
      };
      
      await axios.post('https://candidate-shortlist-backend-9yvd.onrender.com/api/candidates', payload);
      setStatus('success');
      setFormData({ name: '', email: '', skills: '', experience: '' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="flex items-center gap-2 mb-4">
        <UserPlus color="var(--accent-primary)" />
        Add New Candidate
      </h2>
      
      {status === 'success' && (
        <div className="badge mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle size={14} className="mr-1" /> Candidate added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group mb-1">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="e.g. Rahul Sharma" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="form-group mb-1">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="e.g. rahul@example.com" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div className="form-group mb-1">
          <label>Skills (comma separated)</label>
          <input 
            type="text" 
            placeholder="e.g. React, Node.js, MongoDB" 
            required 
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
          />
        </div>
        
        <div className="form-group mb-4">
          <label>Experience (Years)</label>
          <input 
            type="number" 
            placeholder="e.g. 2" 
            min="0"
            required 
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-full">
          Save Candidate Profile
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
