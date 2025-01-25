import { TfiInstagram, TfiGithub, TfiTwitter, TfiLinkedin } from "react-icons/tfi";

const SocialMediaIcons = () => {
    const instagramLink = `https://www.instagram.com/irahulks/`;
    const gitHubLink = `https://github.com/irahulkumar1`;
    const twitterLink = `https://twitter.com/irahulkv`;
    const linkedInLink = `https://www.linkedin.com/in/irahulk/`;

    return (
        <ul className="flex gap-6">
            <li className="cursor-pointer group transform transition-transform duration-500 hover:scale-125">
                <a
                    href={linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                >
                    <TfiLinkedin className="icon text-2xl" />
                </a>
            </li>
            <li className="cursor-pointer group transform transition-transform duration-500 hover:scale-125">
                <a
                    href={gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                >
                    <TfiGithub className="icon text-2xl" />
                </a>
            </li>
            <li className="cursor-pointer group transform transition-transform duration-500 hover:scale-125">
                <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                >
                    <TfiInstagram className="icon text-2xl" />
                </a>
            </li>
            <li className="cursor-pointer group transform transition-transform duration-500 hover:scale-125">
                <a
                    href={twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                >
                    <TfiTwitter className="icon text-2xl" />
                </a>
            </li>
        </ul>
    );
};

export default SocialMediaIcons;
