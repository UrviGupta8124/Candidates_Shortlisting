import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Users, Briefcase, PlusCircle, Sparkles } from 'lucide-react';
import CandidateForm from './components/CandidateForm';
import JobRequirementForm from './components/JobRequirementForm';
import CandidateList from './components/CandidateList';

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-12">
        <nav className="navbar mb-8">
          <div className="brand flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Sparkles size={22} color="var(--accent-primary)" />
            </div>
            AI Shortlist Pro
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              <div className="flex items-center gap-2"><Briefcase size={18}/> Match Jobs</div>
            </NavLink>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? "active" : ""}>
              <div className="flex items-center gap-2"><Users size={18}/> All Candidates</div>
            </NavLink>
            <NavLink to="/add-candidate" className={({ isActive }) => isActive ? "active" : ""}>
              <div className="flex items-center gap-2"><PlusCircle size={18}/> Add Candidate</div>
            </NavLink>
          </div>
        </nav>

        <main className="container animate-fade-in pt-4">
          <Routes>
            <Route path="/" element={<JobRequirementForm />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/add-candidate" element={<CandidateForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
