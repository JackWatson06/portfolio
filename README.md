# Jack's Portfolio

This is a [Next.js](https://nextjs.org/) project to host my portfolio!

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

Run API functional tests and service tests:

```
bin/npm run test:api
```

Run UI tests:

```
bin/npm run test:page
```

Run all tests:

```
bin/npm run test
```

Additinoaly you can either watch the page or API tests for changes by appending watch to the end
onf either the API or page test command:

```
bin/npm run test:api:watch
```

## Deploying

We deploy our application on Vercel. Vercel offers a serverless hosting environment for Next.JS
applications. Since we have a serverless infastructure we have to leverage other services for
document storage or database support.

### Services

- Database: [Mongo DB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- Document Storage: [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## ToDo

- Remove Inter font, a custom Google Font
  [`next/font`](https://nextjs.org/docs/basic-features/font-optimization).

## Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Next.js Documentation](https://nextjs.org/docs)
