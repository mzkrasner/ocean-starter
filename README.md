## Getting Started

Clone this repository

```bash
git clone https://github.com/mzkrasner/ocean-starter
```

You will first need to create an admin_seed.txt file and generate a seed key from Ceramic to store there.
Next, generate an admin-did for your composedb.config.json file.
For reference, check out how to [Set Up Your Environment](https://composedb.js.org/docs/0.4.x/set-up-your-environment)

You will also need to create a .env file in the root of your directory and place your seed key there as well.

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
