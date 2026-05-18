const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const fetch = require('node-fetch'); // We will use dynamic import or the built-in global fetch if using Node >= 18

// 1. Add Candidate
router.post('/candidates', async (req, res) => {
  try {
    const { name, email, skills, experience } = req.body;
    const newCandidate = new Candidate({ name, email, skills, experience });
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// 2. Get All Candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// 3. Shortlist Candidates (Basic Logic)
router.post('/match', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    let candidates = await Candidate.find();
    
    // Basic match logic as defined
    const matchedCandidates = candidates.map(candidate => {
      const matchedSkills = candidate.skills.filter(skill => 
        requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
      );
      const score = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0;
      
      // We can also factor in minExperience if needed, but for now we just return the score
      return {
        ...candidate.toObject(),
        matchScore: score,
        matchedSkillsCount: matchedSkills.length
      };
    }).filter(c => c.experience >= (minExperience || 0))
      .sort((a, b) => b.matchScore - a.matchScore);
      
    res.json(matchedCandidates);
  } catch (error) {
    console.error("Error in matching:", error);
    res.status(500).json({ error: 'Failed to match candidates' });
  }
});

// 4. AI-Based Candidate Suggestion
router.post('/ai/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience, candidates } = req.body;
    
    // Only send the top candidates to AI to save tokens and time if there are many, or just send all
    const promptCandidates = candidates.map((c, index) => {
      return `${index + 1}. ${c.name} - ${c.skills.join(', ')} - ${c.experience} years`;
    }).join('\n');
    
    const prompt = `
You are an expert technical AI recruiter. Rank the following candidates for a job opening and provide a detailed, logical explanation for your ranking.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience}+ years

Candidates:
${promptCandidates}

Instructions:
1. Rank the candidates STRICTLY based on how well their skills match the required skills. The candidate with the most exact skill matches must be ranked #1.
2. Provide a DETAILED explanation for each candidate's rank. Explicitly mention which required skills they have, which they are missing, and evaluate their years of experience.
3. Do not use markdown asterisks or bold text. 

Format your response exactly like this:

Ranking:
1. [Name] - [Brief summary of why they are ranked here]
2. [Name] - [Brief summary]

Detailed Analysis:
- [Name]: [Thorough paragraph explaining their exact skill overlap, missing skills, and overall fit]
- [Name]: [Thorough paragraph...]
    `;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey || openRouterApiKey === 'YOUR_API_KEY') {
       return res.status(500).json({ error: 'OpenRouter API Key is missing or invalid in backend.' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free", // Routing to any available free model
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    
    const aiData = await response.json();
    console.log("OpenRouter API Response:", JSON.stringify(aiData, null, 2));
    
    if (aiData.choices && aiData.choices.length > 0) {
      res.json({ aiSuggestion: aiData.choices[0].message.content });
    } else {
      const errorMessage = aiData.error ? aiData.error.message : 'Failed to get a valid response from AI';
      res.status(500).json({ error: errorMessage, details: aiData });
    }

  } catch (error) {
    console.error("Error in AI shortlisting:", error);
    res.status(500).json({ error: 'Failed to perform AI shortlisting' });
  }
});

module.exports = router;
