## Initial Setup

1. You will need to add both your admin seed into the admin_seed.txt file, and your admin did into the composedb.config.json file within the ceramic/ocean-starter directory
2. You will also need to place your admin seed into an admin_seed.txt file you will need to create within the label_studio/frontend directory. If you need to set one up, you can always do so using the [Create Ceramic App repo](https://github.com/ceramicstudio/create-ceramic-app)
3. Make sure to edit "db" property in the composedb.config.json file within the ceramic/ocean-starter to reflect the name of your personal username

## Getting Started

After following the steps above, use the following steps:

1. Run "npm install" within the ceramic/ocean-starter directory. Once finished, run "npm run dev" to start your Ceramic node
2. In a new terminal in the label_studio/frontend directory, run the following:
```bash
# Install all the necessary modules
yarn install 

# Run webpack
npx webpack
```
3. In a new terminal in the root (label-studio) directory, install Label Studio locally, and then start the server: 
```bash
# Install all package dependencies
pip install -e .
# Run database migrations
python label_studio/manage.py migrate
python label_studio/manage.py collectstatic
# Start the server in development mode at http://localhost:8080
python label_studio/manage.py runserver
```

## Learn More

To learn more about Ceramic please visit the following links

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!

You can check out [Create Ceramic App repo](https://github.com/ceramicstudio/create-ceramic-app) and provide us with your feedback or contributions! 
