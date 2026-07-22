import { loadEducation } from './education';
import { loadExternalAccounts } from './external-account';
import { loadPositions } from './position';
import { loadProfile } from './profile';
import { loadRepoContext } from './repo';
import { loadSiteConfig } from './site-config';
import { loadSkills } from './skill';
import { setAtprotoData } from './store';

export const initAtproto = async (): Promise<void> => {
  const repoContext = await loadRepoContext();

  const [profile, siteConfig, education, positions, skills, externalAccounts] = await Promise.all([
    loadProfile(repoContext),
    loadSiteConfig(repoContext),
    loadEducation(repoContext),
    loadPositions(repoContext),
    loadSkills(repoContext),
    loadExternalAccounts(repoContext),
  ]);

  setAtprotoData({ profile, siteConfig, education, positions, skills, externalAccounts });
};
