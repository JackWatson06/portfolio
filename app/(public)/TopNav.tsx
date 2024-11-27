import NavigationLinks from "./NavigationLinks";
import SocialLinks from "./SocialLinks";
import Tagline from "./Tagline";

export default function TopNav() {
  return (
    <>
      <div className="flex h-20 px-5 shadow-md">
        <Tagline />
        <div className="hidden md:block md:grow xl:basis-1/3">
          <NavigationLinks />
        </div>
        <SocialLinks />
      </div>

      <div className="md:hidden">
        <NavigationLinks />
      </div>
    </>
  );
}
