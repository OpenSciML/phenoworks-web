/** Public profile details displayed in the team directory. */
export type TeamMember = {
  name: string;
  role: string;
  /** Current title at the member's organization, distinct from their project role. */
  position?: string;
  bio: string;
  affiliation?: string;
  image?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  universityProfileUrl?: string;
  googleScholarUrl?: string;
};

/** A group of people with a shared role in the project. */
export type TeamGroup = {
  id: string;
  title: string;
  description: string;
  members: readonly TeamMember[];
};
