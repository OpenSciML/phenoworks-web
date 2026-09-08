import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {TeamMember} from '../TeamDirectory/members';
import styles from './styles.module.css';
import TeamProfileLinks from '../TeamProfileLinks';

/** Render a member's portrait and public biography, using initials when no photo is available. */
export default function TeamMemberCard({member}: {member: TeamMember}): ReactNode {
  const imageUrl = useBaseUrl(member.image ?? '/img/phenoworks-logo.svg');
  const initials = member.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return (
    <article className={styles.card}>
      {member.image ? (
        <img className={styles.portrait} src={imageUrl} alt={`Portrait of ${member.name}`} loading="lazy" width="160" height="160" />
      ) : (
        <div className={styles.initials} aria-label={`Photo not yet available for ${member.name}`}>{initials}</div>
      )}
      <div className={styles.memberDetails}>
        <p className={styles.role}>{member.role}</p>
        <h3>{member.name}</h3>
        {member.position && <p className={styles.position}>{member.position}</p>}
        {member.affiliation && <p className={styles.affiliation}>{member.affiliation}</p>}
        <p className={styles.bio}>{member.bio}</p>
        <TeamProfileLinks member={member} />
      </div>
    </article>
  );
}
