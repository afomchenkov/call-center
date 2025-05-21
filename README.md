# Callcenter exmaple app

## Features

```text
- BE app refactored, docker added
- FE app added
- Tailwind, ShadCN, TS added
- REST requests integrated
- Necessary components/pages added
- Simple error handling added
- Responsive layout
```

## To be added

```text
- The e2e and unit tests
- Auto agent reassignment
- Agent patch request to edit the agent data
- Fix BE auto reassignment when new agent is available
```

## Start the app

> Make sure you have Node v20.* or above

```bash
# from root
docker-compose up --build
# this should start a BE container
```

```bash
# start FE once BE is running
cd call-center-client
npm install
npm run dev
```