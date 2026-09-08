import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {TeamMember} from '../TeamDirectory/members';
import styles from './styles.module.css';

const profiles = [
  {field: 'websiteUrl', label: 'Website', icon: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>},
  {field: 'linkedinUrl', label: 'LinkedIn', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7m0-10v.01M11 17v-7m0 3a3 3 0 0 1 6 0v4" /></>},
  {field: 'githubUrl', label: 'GitHub', icon: <path d="M9 21v-3c-4 1-4-2-6-2m12 5v-4c0-1 .3-1.6 1-2 3-.3 5-1.5 5-5 0-1.5-.5-2.5-1.5-3.5.2-1 .2-2-.5-3.5-1.5 0-3 1-3.5 1.5a12 12 0 0 0-7 0C8 4 6.5 3 5 3c-.7 1.5-.7 2.5-.5 3.5C3.5 7.5 3 8.5 3 10c0 3.5 2 4.7 5 5 .7.4 1 1 1 2" />},
  {field: 'googleScholarUrl', label: 'Google Scholar', icon: <><path d="m2 9 10-7 10 7-10 7L2 9Zm3 2v7" /><circle cx="12" cy="17" r="5" /></>},
  {field: 'universityProfileUrl', label: 'University profile', icon: <><path d="m3 8 9-5 9 5H3Zm0 13h18M5 11v7m5-7v7m4-7v7m5-7v7" /></>},
] as const;

/** Render only the profile types with a URL, with distinct icons and accessible labels. */
export default function TeamProfileLinks({member}: {member: TeamMember}): ReactNode {
  const availableProfiles = profiles.filter(({field}) => member[field]?.trim());
  if (!availableProfiles.length) return null;

  return (
    <div className={styles.links}>
      {availableProfiles.map(({field, label, icon}) => (
        <Link key={field} className={styles.profile} href={member[field]} aria-label={`${label} for ${member.name}`} title={label}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {icon}
          </svg>
        </Link>
      ))}
    </div>
  );
}
