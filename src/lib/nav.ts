// Sidebar sections, in order. A page belongs to the section named by the first
// segment of its path under src/content/docs.
export const SECTIONS: { id: string; title: string }[] = [
  { id: 'get-started', title: 'Get started' },
  { id: 'control', title: 'Control' },
  { id: 'workflows', title: 'Workflows' },
  { id: 'runs', title: 'Runs' },
  { id: 'decisions', title: 'Decisions and review' },
  { id: 'workforce', title: 'Workforce' },
  { id: 'cost', title: 'Cost' },
  { id: 'evidence', title: 'Evidence' },
  { id: 'pix', title: 'Pix calls' },
  { id: 'belai', title: 'Belai CLI and TUI' },
  { id: 'reference', title: 'Reference' },
];

export const REPO_URL = 'https://github.com/Vulnetix/software-factory';
export const CONSOLE_URL = 'https://www.vulnetix.com/resolve/factory';

// Docs ids are paths without the extension; "get-started/overview" is the
// home page and is served at "/".
export const HOME_ID = 'get-started/overview';
export const hrefFor = (id: string) => (id === HOME_ID ? '/' : `/${id}/`);
