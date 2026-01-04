import { BiLogoTypescript, BiLogoTailwindCss, BiLogoRedux, BiLogoJavascript, BiLogoReact, BiLogoHtml5, BiLogoCss3, BiLogoNodejs, BiLogoGit } from 'react-icons/bi';
import { TbBrandNextjs } from "react-icons/tb";
import { SiMui } from "react-icons/si";

export const skills = [
  { name: 'JavaScript', percentage: 75, icon: <BiLogoJavascript />, category: 'Language' },
  { name: 'React', percentage: 85, icon: <BiLogoReact />, category: 'Framework' },
  { name: 'Next.JS', percentage: 75, icon: <TbBrandNextjs />, category: 'Framework' },
  { name: 'TypeScript', percentage: 65, icon: <BiLogoTypescript />, category: 'Language' },
  { name: 'Redux', percentage: 80, icon: <BiLogoRedux />, category: 'Framework' },
  { name: 'HTML & CSS', percentage: 90, icon: <><BiLogoHtml5 /> <BiLogoCss3 /></>, category: 'Language' },
  { name: 'Tailwind', percentage: 65, icon: <BiLogoTailwindCss />, category: 'Framework' },
  { name: 'Git & Github', percentage: 75, icon: <BiLogoGit />, category: 'Framework' },
  { name: 'Material UI', percentage: 70, icon: <SiMui/>, category: 'Framework' },
  { name: 'Node.js', percentage: 50, icon: <BiLogoNodejs />, category: 'Backend' },
];
