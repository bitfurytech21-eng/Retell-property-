export interface NavLink {
  label: string;
  path: string;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Marketplace', path: '/properties' },
  { label: 'Team', path: '/team' },
  { label: 'Wealth Advisory', path: '/wealth' },
  { label: 'How It Works', path: '/investing' },
  { label: 'Tokenization', path: '/token' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export const FOOTER_LINKS = {
  platform: [
    { label: 'All Properties', path: '/properties' },
    { label: 'How It Works', path: '/investing' },
    { label: 'Token Model & Liquidity', path: '/token' },
    { label: 'Platform Performance', path: '/properties#performance' },
  ],
  legal: [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Risk Disclosure & Warnings', path: '/terms#risks' },
    { label: 'Investor Protection Notice', path: '/terms#protection' },
  ],
  support: [
    { label: 'Help Center & FAQ', path: '/faq' },
    { label: 'Direct Contact', path: '/contact' },
    { label: 'Compliance & KYC', path: '/faq#kyc' },
    { label: 'Institutional Desk', path: '/contact#institutional' },
  ],
};
