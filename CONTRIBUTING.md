## Extending and contributing
First, go over [README.md](README.md) to understand the high level design. Set up the app locally by following the [setup instructions](README.md#setting-up-for-development).

To familiarize yourself with Flask and Svelte I recommend the official tutorials/quickstart guides: [flask quickstart](https://flask.palletsprojects.com/en/2.3.x/quickstart/), [svelte tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte).

The app is distributed under Apache License. To extend the app for personal use, create a fork of the project. If the change you are making is more generally applicable, create a pull request on this repository.

Below we give an overview of the codebase to facilitate extension and contribution.

Table of contents:
- [Flask app](#flask-app)
- [Svelte app](#svelte-app)
- [Adding a new scenario / method](#adding-a-new-scenario--method)
### Flask app
The entry point of the flask app is [app.py](app.py). The only dependency is [data.py](data.py) which contains mapping from scenario/method in the UI dropdown to the corresponding simulation files.
`app.py` provides a REST API for the frontend to fetch the list of available scenarios and methods, and to fetch the simulation files for a given scenario/method combination.

### Svelte app
In [svelte-app/](svelte-app/), at the root level are files generated while creating a new app with [SvelteKit](https://github.com/sveltejs/kit/tree/master/packages/create-svelte) and contain various configuration files related to the app - e.g. package.json contains the dependencies. 

The actual frontend code is located under [svelte-app/src/](svelte-app/src/). In svelte, each unique path in the app is called a `route`. The `+page.svelte` is the entry point for each route. Hence, the landing page (`/`) is defined in [svelte-app/src/routes/+page.svelte](svelte-app/src/routes/+page.svelte).

Similarly, the core of the app, i.e. the demonstrator itself (`/demonstrator`) has it's entry point in [svelte-app/src/routes/demonstrator/+page.svelte](svelte-app/src/routes/demonstrator/+page.svelte).

You will notice that `<Navbar/>` and `<Footer/>` are included as components on the landing page, and `<Navbar/>` is included also in the demonstrator page. These components are defined at the root level in [svelte-app/src/routes/navbar.svelte](svelte-app/src/routes/navbar.svelte) and [svelte-app/src/routes/footer.svelte](svelte-app/src/routes/footer.svelte).

The controller logic (i.e. dropdowns, speed, start, pause) is encapsulated in the `<Controller/>` component defined in [svelte-app/src/routes/demonstrator/controller.svelte](svelte-app/src/routes/demonstrator/controller.svelte). 

In Svelte, a `store` is used to share state across various components. Components can react when the state of the store changes. The `store` is defined in [svelte-app/src/routes/demonstrator/stores.ts](svelte-app/src/routes/demonstrator/stores.ts).

The simulator itself is defined in the [`<Simulator/>`](svelte-app/src/routes/demonstrator/simulator.svelte) component. This is mostly a major refactoring and an extension of the CityFlow's [script.js](https://github.com/cityflow-project/CityFlow/blob/master/frontend/script.js) based on PIXI.js.

On user interaction, the `<Controller/>` updates the state in store, which in turn triggers the simulator to update the simulation. The simulator reacts to this update and makes the necesarry changes to the simulation.

When simulations run side-by-side, it is important to synchronize them at every time step. The synchronization logic is implemented in `createGlobalCount()` in `store.ts`

### Adding a new scenario / method
Add the scenario and the supported methods to the dicts `self.roadnet_options` and `self.replay_options` in [data.py](data.py) and add the corresponding simulation files to [static/software_demonstrator_coci/](static/software_demonstrator_coci/). The frontend will automatically pick up the new scenario and display it in the dropdown. No changes to frontend code are necessary. The flask server will need to be restarted after this.