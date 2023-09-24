## Demonstrator for CoCi
COSS ETHZ is building a software demonstrator on top of CityFlow to demo various traffic control algorithms.
This repository contains the backend and frontend code for that.
1. A Flask server
2. Svelte app, see the set up documentation under svelte-app/README.md

## Design

The app consists of a Python/Flask backend (a simple REST API, located in `app.py`) and a Svelte frontend (locate under `svelte-app`). Moreover, the simulation files generated using CityFlow are stored on the server under `${SERVER_HOME}/static/software_demonstrator_coci/`. 
![Design overview](image.png)
Below we explain the responsibilities of each of these components. A short technical presentation can be found [here](https://demonstrator.inn.ac/static/software-demonstrator.pdf)
### Simulation files
Each simulation is a parametrized by set of 3 files:
1. A roadnet (.json) definition of the network (aka Scenario)
2. A flow (.txt) definition of the traffic flows with 3600 timesteps (aka Method)
3. A density file which gives the density of vehicles on each road at each timestep
### Flask server
The flask server is responsible for serving the simulation files to the frontend. It also provides a REST API for the frontend to 
1. Fetch the list of available simulations. For each scenario, currently 5 possible methods are available.
2. Given the scenario/method combination, get the 3 files mentioned above corresponding to the combination.
### Svelte frontend
The frontend is responsible for rendering the simulation files. It extends the [CityFlow](https://cityflow.readthedocs.io/en/latest/) frontend with additional featrues such as:
1. Hosted predefined scenarios and a dropdown to select them
2. Support for multiple simulation runs to let user compare different methods side by side
3. A heatmap according to traffic density
We have used [Svelte](https://svelte.dev/) to modularize the design of frontend -- for example: (i) to encapsulate the simulation in a component, which allows us to spawn multiple of them, (ii) to refactor Navbar, Controller etc into their own components so they can be reused, etc. We have also replaced gradually JavaScript with TypeScript for better developer experience.

### Running development server
1. Create a virtual environtment and activate it
```
python -m venv env
source env/bin/activate
```
2. Install the app
```
pip install -r requirements.txt
```
3. Run the app
```
flask run
----
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit

```

### Deploying to production
Flask is not secure or performant enough to be used as a production server. Hence, we proxy the flask app by a [gunicorn](https://flask.palletsprojects.com/en/2.2.x/deploying/gunicorn/) server.

The [COSS server](https://serverinfo.inn.ac/) runs an Apache server to host all it's websites. Hence, we create an apache configuration for our app, and proxy API requests to the gunicorn instance
// TO-DO add step by step details of deploying to production (certificates, exact configuration files)

### Live
The app is currently deployed and can be viewed at https://demonstrator.inn.ac/
