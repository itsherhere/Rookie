import type { MatchScoreResult } from '../types';

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim();
}

function getScoreLabel(score: number): MatchScoreResult['label'] {
  if (score >= 80) return 'Strong fit';
  if (score >= 60) return 'Good fit';
  if (score >= 40) return 'Partial fit';
  return 'Low fit';
}

/**
 * Calculate a skill-based match score between a job and a candidate.
 *
 * Formula: (matched skills / required skills) * 100
 *
 * Example:
 *   Job requires: React, TypeScript, Supabase
 *   Candidate has: React, Tailwind, Supabase
 *   Matched: React, Supabase (2 of 3)
 *   Score: 67%
 */
export function calculateMatchScore(
  jobSkills: string[],
  candidateSkills: string[]
): MatchScoreResult {
  if (!jobSkills.length) {
    return {
      score: 100,
      matched_skills: [],
      missing_skills: [],
      label: 'Strong fit',
    };
  }

  const normalizedJobSkills = jobSkills.map(normalizeSkill);
  const normalizedCandidateSkills = candidateSkills.map(normalizeSkill);

  const matched_skills: string[] = [];
  const missing_skills: string[] = [];

  for (let i = 0; i < normalizedJobSkills.length; i++) {
    const jobSkill = normalizedJobSkills[i];
    if (normalizedCandidateSkills.includes(jobSkill)) {
      matched_skills.push(jobSkills[i]); // use original casing
    } else {
      missing_skills.push(jobSkills[i]); // use original casing
    }
  }

  const score = Math.round((matched_skills.length / jobSkills.length) * 100);

  return {
    score,
    matched_skills,
    missing_skills,
    label: getScoreLabel(score),
  };
}
