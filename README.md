This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Develompent

### Workflow
We use Github Actions to handle deployment of the application, testing, linting, and formatting.
Use the below steps to make changes to the application.
1. Branch off the _development_ branch with a new feature branch.
2. Make your changes to the application.
3. Push to your feature branch with your changes.
4. Make a PR into the _development_ branch. Merge when checks pass.
5. Make a new release PR into the _main_ branch. Name the PR using the scheme: _{version} {features}_.
6. Merge into _main_ and make a new release using the same version put in the PR.

### Testing

We have two seperate testing environments. Both environments use Jest for testing. We have API tests
and page tests. The API tests use the _node_ environment and the page tests use the _jsdom_
environment. After you complete a feature you should add tests to either section.

#### Running the Tests

To run the API tests run the following command:

```
bin/npm run test:api
```

The page tests:

```
bin/npm run test:page
```

All tests:

```
bin/npm run test
```

Additinoaly you can either watch the page or API tests for changes by appending watch to the end
of either the API or page test command:

```
bin/npm run test:api:watch
```
