"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavigationLink = {
  name: string;
  link: string;
};

export type RoutedNavigationLink = {
  name: string;
  link: string;
  active: boolean;
};

export function createRoutedNavigationOptions(
  navigation_links: Array<NavigationLink>,
  current_route: string,
): Array<RoutedNavigationLink> {
  return navigation_links.map((navigation_link) => {
    return {
      name: navigation_link.name,
      link: navigation_link.link,
      active: navigation_link.link === current_route,
    };
  });
}

const navigation_links: Array<NavigationLink> = [
  {
    name: "Projects",
    link: "/projects",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Resume",
    link: "/resume",
  },
];

export default function NavigationOptions() {
  const pathname = usePathname();
  const routed_navigation_links = createRoutedNavigationOptions(
    navigation_links,
    pathname,
  );

  return (
    <div className="border-slate-30 h-9 border-b px-8 text-base md:mx-auto md:flex md:h-full md:max-w-96 md:flex-col md:justify-center md:border-none md:px-0 xl:text-lg">
      <div className="flex h-full items-end text-center md:h-auto">
        {routed_navigation_links.map((routed_navigation_link) => {
          return (
            <div key={routed_navigation_link.link} className="basis-1/3">
              <Link
                href={routed_navigation_link.link}
                className={`${routed_navigation_link.active && "text-lime-800"}`}
              >
                {routed_navigation_link.name}
              </Link>
              {routed_navigation_link.active && (
                <div className="w-20 border-b m-auto border-lime-800 md:border-b-2 xl:w-24"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
