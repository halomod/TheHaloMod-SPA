# Github actions
## Workflows
### [Client Testing](./client.yaml)

Runs client lint, unit and integration tests on every pull request. 

Requires python and gfortran to generate constants file before running.

### [Client Deployment](./clientDeployment.yaml)

Builds and deploys client dev and main branch to netlify.

Requires python and gfortran to generate constants file before running.

### [Server Testing](./server.yaml)

Runs server lint, unit and integration tests on every pull request. 

### [Server Deployment](./serverDeployment.yaml)

Builds and deploys server main branch to ASU's servers.

### Secret Keys

All secret keys for both client and server are kept [here](https://github.com/halomod/TheHaloMod-SPA/settings/secrets/actions)
