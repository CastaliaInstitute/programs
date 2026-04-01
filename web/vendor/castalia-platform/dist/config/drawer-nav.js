/** Same-origin paths (www). External properties use full URLs. */
const DRAWER_DEF = [
    { path: '/start-here', label: 'Start Here', highlight: true },
    { path: '/about', label: 'About' },
    { path: '/faculty', label: 'Faculty' },
    { path: 'https://commonplace.castalia.institute', label: 'Commonplace', newTab: true },
    { path: 'https://bibliotech.castalia.institute', label: 'Bibliotech', newTab: true },
    { path: 'https://inquirer.castalia.institute', label: 'The Inquirer', newTab: true },
    { path: '/inq', label: 'iNQ' },
    { path: '/atelier', label: 'Atelier' },
    { path: '/atlas', label: 'Atlas' },
    { path: '/terrain', label: 'Terrain' },
    { path: '/faculty.club', label: 'Faculty.Club' },
    { path: '/salon', label: 'Salon' },
    { path: '/symposia', label: 'Symposia' },
    { path: '/colleges', label: 'Colleges' },
    { path: '/courses', label: 'Courses' },
    { path: '/contact', label: 'Contact' },
    { path: '/press', label: 'Press' },
    { path: '/faculty-rank', label: 'Faculty Rank' },
    { path: '/org-chart', label: 'Org Chart' },
    { path: '/salon/villa.diodati', label: 'Villa Diodati' },
    { path: '/tts', label: 'TTS' },
    { path: '/support', label: 'Support', highlight: true, cta: true },
    { path: '/status', label: 'Status' },
];
function joinOrigin(origin, path) {
    if (path.startsWith('http://') || path.startsWith('https://'))
        return path;
    if (!origin)
        return path;
    const o = origin.replace(/\/$/, '');
    return `${o}${path.startsWith('/') ? path : `/${path}`}`;
}
/**
 * Drawer navigation for Castalia web apps.
 * @param origin — `''` for same-origin (www); `https://castalia.institute` for satellites linking home.
 */
export function getCastaliaDrawerNav(origin) {
    return DRAWER_DEF.map((d) => ({
        href: joinOrigin(origin, d.path),
        label: d.label,
        highlight: d.highlight,
        cta: d.cta,
        external: Boolean(d.newTab),
    }));
}
export const castaliaDesktopQuickLinks = (origin) => [
    { href: joinOrigin(origin, '/start-here'), label: 'Start Here', external: false },
    { href: joinOrigin(origin, '/about'), label: 'About', external: false },
];
/** Default footer link sets for satellites (absolute institute URLs). */
export function getCastaliaSatelliteFooterBlocks(origin) {
    const j = (p) => joinOrigin(origin, p);
    const membershipLinks = [
        { href: j('/membership'), label: 'Membership', external: false },
        { href: j('/auth/signin'), label: 'Sign in', external: false },
        { href: j('/contact'), label: 'Contact', external: false },
    ];
    const propertyLinks = [
        { href: j('/'), label: 'Castalia Institute', external: false },
        { href: 'https://commonplace.castalia.institute', label: 'Commonplace', external: true },
        { href: 'https://bibliotech.castalia.institute', label: 'Bibliotech', external: true },
        { href: j('/symposia'), label: 'Symposia', external: false },
        { href: 'https://homeschool.castalia.institute', label: 'Homeschool', external: true },
        { href: 'https://maps.castalia.institute', label: 'Map of Inquiry', external: true },
        { href: 'https://mhth.castalia.institute', label: 'More Human Than Human', external: true },
        { href: 'https://voight-kampff.castalia.institute', label: 'Voight-Kampff (MHTH S1)', external: true },
        { href: 'https://vk.castalia.institute', label: 'Voight-Kampff Lab', external: true },
        { href: 'https://arbor.castalia.institute', label: 'Arbor Scientiae', external: true },
        { href: 'https://dialogic.castalia.institute', label: 'Dialogic', external: true },
        { href: 'https://cards.castalia.institute', label: 'iNQ Cards', external: true },
        { href: j('/courses'), label: 'Courses', external: false },
    ];
    const legalLinks = [
        { href: j('/terms'), label: 'Terms of Service', external: false },
        { href: j('/privacy'), label: 'Privacy Policy', external: false },
        { href: j('/compliance'), label: 'Compliance', external: false },
    ];
    return { membershipLinks, propertyLinks, legalLinks };
}
