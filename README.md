## Demonstrator for CoCi
COSS ETHZ is building a software demonstrator on top of CityFlow to demo various traffic control algorithms.
This repository contains the webapp code for that.
1. A Flask server
2. Svelte app, see the set up documentation under svelte-app/README.md

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
