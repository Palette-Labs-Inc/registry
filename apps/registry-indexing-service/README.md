# EAS Indexing Service

This tool allows you to quickly spin up your own EAS indexer on any EVM chain that has EAS contracts deployed

## Installation

First, clone the repository and install dependencies:

```bash
yarn
```

You'll need to create a `.env` file in the root directory of the project. You can setup your `.env` by running:
```bash
cp .env.example .env
```

Here you'll want to set `CHAIN_ID` to the chain you want to index. Make sure that `CHAIN_ID` has an associated
config defined as an entry on `EAS_CHAIN_CONFIGS` in `utils.ts`. By default, this project only currently supports the Base Sepolia network.

Then generate the necessary files for Prisma:

```bash
yarn prisma:generate
```

Then you can start the Docker services:

```bash
yarn docker:db
```

If you end up making any changes to this project's files, like adding your own chain config, remember to rebuild the
Docker containers so that the changes get redeployed.

```bash
yarn compose:down
yarn docker:db
```

After docker is running, and before starting your server, run the following command to establish your database.

```bash
yarn prisma:migrate
```

To start your server, run:

```bash
yarn start
```

This script will start your server and loop through a series of blocks to fetch the registered node entries, starting at the `contractStartBlock` that you define in your `ChainConfig`. If you intend to index all node entries the `contractStartBlock` should be no smaller than the genesis block for the `NodeRegistry` contract. View the `/registry-contract` package to view the latest deployment information.

After this process completes, you can run:

```bash
yarn prisma:studio
```

This will display a simple tabular interface you can use to quickly have a look at the data of your local database and check if your app is working correctly.

Your GraphQL server will be running at `http://localhost:3000`. 

As an example, you can run the following query:

```graphql
query NodeEntries {
    nodeEntries(take: 2) {
        uid
        name
        callbackUrl
        location
        industryCode
        owner
        nodeType
        status
    }
}
```

The output should look something like:
```
{
    "data": {
        "nodeEntries": [
            {
                "uid": "0x214978f84ea6adb114deb41b5922f9007e6fa5debcf1c61d382186f5b4e1fce0",
                "name": "Node One",
                "callbackUrl": "http://callback.one",
                "location": [
                    "882681a339fffff"
                ],
                "industryCode": "FOOD",
                "owner": "0xd443dDeeC8cD386B6d592b82853738490798922a",
                "nodeType": "PSN",
                "status": "INITIATED"
            },
            {
                "uid": "0x514299713646043dc4cdd91d4dcdf61ed3b5b4f9e3dedd8ec246e76ef02785d0",
                "name": "Node Two",
                "callbackUrl": "http://callback.two",
                "location": [
                    "882681a339fffff"
                ],
                "industryCode": "FOOD",
                "owner": "0xd443dDeeC8cD386B6d592b82853738490798922a",
                "nodeType": "BSN",
                "status": "INITIATED"
            }
        ]
    }
}


## Yarn gotchas

If you're using Yarn and your packages are not linking correctly due to no `node_modules` folder being present, you can
add a `.yarnrc.yml` file to the root of the project with the following contents:

```yaml 
nodeLinker: node-modules
```

# Notes
There is a general conflict here. Specifically, the docker container does not run properly when using prisma 4.13.0. However, in order to get the project working, we have to generate the graphQL types and resolvers. In order to generate these types, we are supposed to include this in our `prisma.schema` file:

```ts
generator typegraphql {
  provider = "typegraphql-prisma"
  output   = "../graphql/type-graphql"
}
```

But then docker does not run. In order to get the docker container to run and the server to start, we need to upgrade to the latest version of prisma.

The interim solution:

**Step 1:** 
```ts
generator typegraphql {
  provider = "typegraphql-prisma"
  output   = "../graphql/type-graphql"
}
```

downgrade and generate the types by running npx prisma generate.

```bash
yarn remove @prisma/client prisma
yarn add @prisma/client@4.13 prisma@4.13
npx prisma generate
```

You should see the generated types in your `../graphql/type-graphql` filepath.

**Step 2:** 
Remove or comment the typegraphql in `prisma.schema` 
```ts
/*
generator typegraphql {
  provider = "typegraphql-prisma"
  output   = "../graphql/type-graphql"
}
*/
```

upgrade to the latest prisma by running npx prisma generate.

```bash
yarn remove @prisma/client prisma
yarn add @prisma/client@latest prisma@latest
npx prisma generate
```

Steps: 
- [ ] update prisma schema
- [ ] remove unecessary chain configurations
- [ ] update chain ID to base-sepolia
- [ ] update .env.template
- [ ] modify ts config to accept single quotes
- [ ] modify topics for events to just accept the event for registered node emissions
- [ ] need to get error codes emitted properly from the contract and handled by the SDK. For example, registering the same node twice fails but the error does not provide any useful information.

