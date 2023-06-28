## Getting Started

Replace your admin_seed.txt and the admin-did in the composedb.config.json file with your own.
You will also need to create a .env file in the root of your directory and place your seed phrase there

First, install dependencies:
```bash
npm install
```

Next, run the development server:

```bash
nvm use 16
npm run dev
```
Wait until all composites are compiled and NextJS has launched.

Then, run the Python server:

```bash
cd pyServer
python -m textclassification
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local Requirements

1. Docker
2. Python
3. Node version 16
