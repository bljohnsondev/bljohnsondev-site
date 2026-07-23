import type { Skill } from '$lib/schemas/sifa';
import type { SkillCategory } from '$lib/schemas/site-config';

export interface GroupedSkillCategory {
  name: string;
  skills: string[];
}

const getSortedDistinctSkillNames = (skills: Skill[], subCategory: string): string[] => {
  const distinctNames = new Set(skills.filter(skill => skill.subCategory === subCategory).map(skill => skill.name));
  return [...distinctNames].sort((skillNameA, skillNameB) => skillNameA.localeCompare(skillNameB));
};

export const groupSkillsByCategory = (skills: Skill[], categories: SkillCategory[] = []): GroupedSkillCategory[] => {
  const groups = categories.map(category => ({
    name: category.label,
    skills: getSortedDistinctSkillNames(skills, category.name),
  }));

  return groups.filter(group => group.skills.length > 0);
};
