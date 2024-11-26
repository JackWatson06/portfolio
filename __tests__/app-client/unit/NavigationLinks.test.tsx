import {
  createRoutedNavigationOptions,
  type NavigationLink,
} from "@/app/(public)/NavigationLinks";

import { expect, test } from "@jest/globals";

test("we pick the correct navigation link based on our current route.", () => {
  const navigation_links: Array<NavigationLink> = [
    {
      name: "testing",
      link: "/testing",
    },
    {
      name: "testing_two",
      link: "/testing_two",
    },
  ];

  const routed_navigation_links = createRoutedNavigationOptions(
    navigation_links,
    "/testing",
  );

  expect(routed_navigation_links[0].active).toBe(true);
});

test("we do not pick a link when we pass in a incorrect route.", () => {
  const navigation_links: Array<NavigationLink> = [
    {
      name: "testing",
      link: "/testing",
    },
    {
      name: "testing_two",
      link: "/testing_two",
    },
  ];

  const routed_navigation_links = createRoutedNavigationOptions(
    navigation_links,
    "/testing_three",
  );

  expect(
    routed_navigation_links.some(
      (routed_navigation_link) => routed_navigation_link.active === true,
    ),
  ).toBe(false);
});
