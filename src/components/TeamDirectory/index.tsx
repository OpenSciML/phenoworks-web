import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import teamData from '@site/src/data/team.json';
import TeamMemberCard from '../TeamMemberCard';
import type {TeamGroup} from './members';
import styles from './styles.module.css';

const teamGroups: readonly TeamGroup[] = teamData;

/** Render the four team groups and an invitation to contribute to PhenoWorks. */
export default function TeamDirectory(): ReactNode {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>The people behind PhenoWorks</p>
        <h1>Building better tools for research, together.</h1>
        <p>PhenoWorks brings together researchers across disciplines to build reusable tools for crop phenotyping and data analysis.</p>
      </header>
      {teamGroups.map((group) => (
        <section key={group.id} className={styles.section} aria-labelledby={group.id}>
          <header className={styles.sectionHeading}>
            <h2 id={group.id}>{group.title}</h2>
            <p>{group.description}</p>
          </header>
          <div className={`${styles.grid} ${group.members.length === 1 ? styles.single : ''}`}>
            {group.members.map((member) => <TeamMemberCard key={member.name} member={member} />)}
          </div>
        </section>
      ))}
      <aside className={styles.contribute}>
        <div>
          <h2>Contribute to PhenoWorks</h2>
          <p>Have a method to share or want to become a contributor? Help extend PhenoWorks with analysis blocks, plug-ins, documentation, or research examples.</p>
        </div>
        <div className={styles.contributeActions}>
          <Link className="button button--primary" href="https://docs.google.com/forms/d/e/1FAIpQLSfs6dAI3IQofL37Zmodcbr3v7B1f0_09GoUnwPrqVkgOdvf6g/viewform">Express Interest</Link>
          <Link className="button button--secondary" to="/blog/building-custom-lgopy-blocks">Build an analysis block</Link>
        </div>
      </aside>
    </main>
  );
}
