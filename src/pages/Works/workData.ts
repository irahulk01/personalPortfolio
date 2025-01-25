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
    name: 'StorTrack',
    image: storeTrack,
    link: 'https://www.stortrack.com/',
    githubLink: '',
    tags: ['JavaScript','React','mapbox.js', 'Material UI'],
    features: ['Protected Routes', 'Lazy Loading', 'Dynamic Routing'],
    organisationWorkedWith: "Aggregate Intelligence",
    organisationLogo: AILogo,
    description: "Stortrack is a selfstorge platform. It helps users to find nearby place to store house goods.",
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
    description: "Earning Beats is a visual stock market analyser. It helps portfolio managers make trade recommendations for their clients.",
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
    description: "This online survey app integrates multiple vendors (Dynata, Voxco, Precision, Tap Research, Market Cube) providing diverse audience segments with varying qualifications, age groups, and more.",
  },
  {
    name: 'Game Dashboard',
    image: GameDashboard,
    link: '',
    tags: ['React.JS', 'javaScript', 'Node.JS', 'MySql'],
    features: [''],
    organisationWorkedWith: "NMS Games Private Limited",
    organisationLogo: NmsGames,
    description: 'I transitioned a PHP-based dashboard into a contemporary React.js application. This dashboard serves as a management interface for game app owners, enabling them to efficiently manage their Android game app. Through this web-based dashboard, administrators can conduct various tasks such as updating, verifying, and authenticating users via Aadhar details. Additionally, they have the ability to perform actions such as blocking users, as well as checking and managing user details, including points, currency, and status, among other functionalities.',
  },
  {
    name: 'Sarkari Filing',
    image: sarkariFiling,
    link: 'https://www.sarkarifiling.com/',
    tags: ['Next.js', 'TypeScript', 'CSS', "HTML"],
    features: ['Dropdown List', 'Mobile Responsive', 'Smooth scroll'],
    organisationWorkedWith: "Sarkari Filing",
    organisationLogo: sarkariFilingLogo,
    description: 'In developing the landing page for Sarkari Filings, I employed a blend of creativity and precision, harnessing plain CSS and HTML within the Next.js framework to construct a captivating user experience. The header and footer sections were meticulously crafted to frame the page with intuitive navigation and essential information, ensuring seamless exploration for users. Introducing an element of interactivity, I integrated a dropdown list feature, enhanced with subtle animations to elevate user engagement and provide a dynamic browsing experience. These animations, while light, add a touch of elegance and modernity to the UI, complementing the overall aesthetic. By combining innovative design elements with industry-standard coding practices, the landing page of Sarkari Filings sets the stage for a seamless journey through government form submissions, enticing users to engage further with the platforms intuitive functionality and streamlined workflows',
  },
];
