# Jack's Portfolio

This is a [Next.js](https://nextjs.org/) project to host my portfolio!

## Develompent

### Git Workflow

We use Github Actions to handle deployment of the application, testing, linting, and formatting.
Use the below steps to make changes to the application.

1. Branch off the _development_ branch with a new feature branch.
2. Make your changes to the application.
3. Push to your feature branch with your changes.
4. Make a PR into the _development_ branch. Merge when checks pass.
5. Make a new release PR into the _main_ branch. Name the PR using the scheme: _{version} {features}_.
6. Merge into _main_ and make a new release using the same version put in the PR.

### Testing

We have two seperate testing environments. Both environments use Jest for testing. We have client
tests and server tests. The server tests use the _node_ environment and the client tests use the _jsdom_
environment. While developing a feature write tests alongside the feature code.

*Note* The edge runtime does not catch all edge issues at the current moment. They may have not have
a complete implementation for jest.

#### Running the Tests

Run client tests:
```bash
bin/npm run test:client:[unit|int]
```

Run server tests:
```bash
bin/npm run test:server:[unit|int]
```

Watch a specific client test:
```bash
bin/npm run test:client:watch -- {file_path}
```

Watch a specific server test:
```bash
bin/npm run test:server:watch -- {file_path}
```

Run entire testing suite:
```bash
bin/npm run test
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
