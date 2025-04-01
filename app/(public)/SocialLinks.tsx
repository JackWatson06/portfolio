import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function SocialLinks() {
  return (
    <nav className="hidden lg:my-auto lg:flex lg:h-8 lg:min-w-8 lg:space-x-2 xl:basis-1/3 xl:justify-end">
      <FontAwesomeIcon icon={faLinkedin} />
      <FontAwesomeIcon icon={faGithub} />
    </nav>
  );
}
