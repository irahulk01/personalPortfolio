import earningBeatsImage from '../../assets/workSampleImg/earningBeats.jpeg';
import Zamplia from '../../assets/workSampleImg/zamplia.jpeg';
import GameDashboard from '../../assets/workSampleImg/gameDashboard.png';
import NmsGames from '../../assets/CompanyLogo/nmsGames.jpeg'
import PandoIndia from '../../assets/CompanyLogo/pandoLogo.png'
import sarkariFilingLogo from '../../assets/CompanyLogo/sarkarifilingsLogo.png'
import sarkariFiling from '../../assets/workSampleImg/sarkarifiling.jpeg'
import storeTrack from '../../assets/workSampleImg/storTrack.png';
import AILogo from '../../assets/CompanyLogo/aiLogo.png'

export const projects = [
  {
    name: 'Self‑Storage Discovery Platform',
    image: storeTrack,
    link: '',
    githubLink: '',
    tags: ['JavaScript','React','mapbox.js', 'Material UI'],
    features: ['Protected Routes', 'Lazy Loading', 'Dynamic Routing'],
    organisationWorkedWith: "Confidential Client",
    organisationLogo: AILogo,
    description: "A location-based web platform designed to help users discover nearby self-storage options for safely storing household items. The system focuses on performance, usability, and map-driven search experience.",
  },
  {
    name: 'Earning Beats',
    image: earningBeatsImage,
    link: 'https://www.earningsbeats.com/',
    githubLink: '',
    tags: ['React', 'TypeScript', 'Tanstack Query', 'Tailwind', 'Node.js', 'MySQL'],
    features: ['Protected Routes', 'Lazy Loading', 'Role Beased Access Control (RBAC)', 'Dynamic Routing'],
    organisationWorkedWith: "Pando India Software Consultants",
    organisationLogo: PandoIndia,
    description: "Earning Beats is a stock market analysis platform that helps portfolio managers analyze data and make better trade decisions for their clients.",
  },
  {
    name: 'Zamplia',
    image: Zamplia,
    link: 'https://zamplia.com/',
    githubLink: '',
    tags: ['HTML', 'CSS', 'JavaScript', "React.Js", "Redux.JS"],
    features: [''],
    organisationWorkedWith: "Pando India Software Consultants",
    organisationLogo: PandoIndia,
    description: "Zamplia is an online survey platform that connects with multiple vendors to provide access to different audience groups based on age, qualifications, and other criteria.",
  },
  {
    name: 'Game Dashboard',
    image: GameDashboard,
    link: '',
    tags: ['React.JS', 'javaScript', 'Node.JS', 'MySql'],
    features: [''],
    organisationWorkedWith: "NMS Games Private Limited",
    organisationLogo: NmsGames,
    description: "This project involved converting an existing PHP dashboard into a modern React.js application. The dashboard allows game app owners to manage users, verify details, control access, and monitor user data such as points, currency, and account status.",
  },
  {
    name: 'Sarkari Filing',
    image: sarkariFiling,
    link: 'https://www.sarkarifiling.com/',
    tags: ['Next.js', 'TypeScript', 'CSS', "HTML"],
    features: ['Dropdown List', 'Mobile Responsive', 'Smooth scroll'],
    organisationWorkedWith: "Sarkari Filing",
    organisationLogo: sarkariFilingLogo,
    description: "Sarkari Filing is a landing page built using Next.js, HTML, and CSS. It provides clear navigation, responsive design, and interactive elements like dropdowns with smooth animations to guide users through government form services easily.",
  },
];
