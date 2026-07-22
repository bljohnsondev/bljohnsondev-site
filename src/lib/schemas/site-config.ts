import { z } from 'zod';

const PageTitleSchema = z.object({
  path: z.string().max(500),
  title: z.string().max(500),
});

const SkillCategorySchema = z.object({
  name: z.string().max(200),
  skills: z.array(z.string().max(200)).max(100),
});

export const SiteConfigSchema = z.object({
  greeting: z.string().max(200).optional(),
  tagline: z.string().max(500).optional(),
  siteName: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  employmentViewTotal: z.number().int().min(0).optional(),
  pageTitles: z.array(PageTitleSchema).max(50).optional(),
  skillCategories: z.array(SkillCategorySchema).max(50).optional(),
  createdAt: z.string(),
});

export type PageTitle = z.infer<typeof PageTitleSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
