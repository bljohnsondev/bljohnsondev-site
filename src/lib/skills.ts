import type { Skill } from '$lib/schemas/sifa';
import type { SkillCategory } from '$lib/schemas/site-config';

export interface GroupedSkillCategory {
  name: string;
  skills: string[];
}

export const groupSkillsByCategory = (skills: Skill[], categories: SkillCategory[] = []): GroupedSkillCategory[] => {
  const distinctNames = [...new Set(skills.map(skill => skill.name))];

  const groups = categories.map(category => ({
    name: category.name,
    skills: category.skills.filter(name => distinctNames.includes(name)),
  }));

  return groups.filter(group => group.skills.length > 0);
};
