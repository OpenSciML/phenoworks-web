# PhenoWorks Website

This Docusaurus site publishes the PhenoWorks documentation that was migrated from
the previous documentation source. It also includes a blog for project updates,
release notes, and development notes.

## Local Development

```bash
npm install
npm run start
```

## Build

```bash
npm run build
```

The production build is written to `build/`.

## Content

Documentation pages live in `docs/`. Blog posts live in `blog/`. The sidebar
order is defined in `sidebars.ts`, and site metadata lives in
`docusaurus.config.ts`.

## Team page

Edit `src/data/team.json` to update the people shown at `/team`. Each group has
an `id`, `title`, `description`, and `members` array. Add contributors to that
array without changing the page component.

Each member needs `name`, `role`, and `bio`. Optional fields include `affiliation`,
`position`, and `image`. Use `role` for the person's PhenoWorks responsibility and
`position` for their current title at their organization.
Leave `position` empty when it is not yet confirmed; empty values are not displayed.

Each profile type has a separate optional URL field:

| Field | Link destination |
| --- | --- |
| `websiteUrl` | Personal website or portfolio |
| `linkedinUrl` | LinkedIn profile |
| `githubUrl` | GitHub profile |
| `googleScholarUrl` | Google Scholar author profile |
| `universityProfileUrl` | Official university or institutional profile |

Each populated field displays its own icon with a tooltip and accessible label.
Omit a field or leave it empty to hide that link. Add only confirmed profile URLs.

Put portraits in `static/img/team/`
and use a path such as `/img/team/person.jpg`. If `image` is omitted, the card
shows initials rather than a broken or invented portrait.

`TeamDirectory` renders the groups, and `TeamMemberCard` renders each person.
Photo sources are recorded in `static/img/team/README.md`. Add missing portraits and
profile links when those details are available.
