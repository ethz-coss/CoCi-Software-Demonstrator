<script lang="ts">
  import Navbar from './navbar.svelte';
  import Footer from './footer.svelte';
</script>

<Navbar />

<main class="flex-shrink-0">
  <div class="container col-9">
    <div class="row">
      <div class="container col-9">
        <p class="lead">
          How could innovative decentralized organisational approaches contribute to addressing
          humanity’s societal, sustainability, and governance challenges?
        </p>
        <p>
          Starting from the paradigm of smart cities, we propose that the requirement of organizing
          societies in a more resilient way implies the need for more decentralized solutions, based
          on digitally-​assisted self-​​organization and that this concept is also compatible with
          sustainability requirements and stronger democratic participation.
        </p>
        <p>
          Traffic signal control as a methodology of alleviating traffic and improving city life has
          been a core point of interest for researchers and industry working on smart cities. This
          tool demonstrates the performance of some Machine Learning based as well as
          Self-Organizing approaches to traffic signal control in a variety of scenarios. The
          methods and scenarios are described in detail in the publications, which we link below.
        </p>
      </div>
      <div class="container col-3">
        <a href="https://coss.ethz.ch/research/CoCi.html">
          <img
            alt="CoCi Logo"
            src="/coci.png"
            height="200px"
            width="200px"
          />
        </a>
      </div>
    </div>

    <div class="row">
      <div class="col-6 col-s-12">
        <h2>Methods</h2>

        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                GuidedLight
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionPanelsStayOpenExample">
              <div class="accordion-body">
                A Deep Q-Learning method using length-agnostic state design and heuristic exploration.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo"
              >
                PressLight
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample">
              <div class="accordion-body">
                A Deep Q-Learning method based on intersection pressure minimisation.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree"
              >
                Analytic+
              </button>
            </h2>
            <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample">
              <div class="accordion-body">
                A self-organizing analytic method relying on insights from traffic physics.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFive"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFive"
              >
                Demand
              </button>
            </h2>
            <div id="panelsStayOpen-collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample">
              <div class="accordion-body">
                A simple adaptive method that always gives green to the flows with the largest number of vehicles
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFour"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFour"
              >
                Fixed
              </button>
            </h2>
            <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample">
              <div class="accordion-body">
                A simple baseline cyclically changing lights in a loop.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-s-12">
        <h2>Scenarios</h2>

        <div class="accordion" id="accordionPanelsStayOpenExample1">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne1"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne1"
              >
                2x2
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne1" class="accordion-collapse collapse show" data-bs-parent="#accordionPanelsStayOpenExample1">
              <div class="accordion-body row">
                <div class="col-8">A synthetic homogenous network with high traffic demand.</div>
                <div class="col-4"><img src="/paper4-figure0.svg" alt="2x2"></div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo1"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo1"
              >
                4x4
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo1" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample1">
              <div class="accordion-body row">
                <div class="col-8">A synthetic heterogenous network (varied approaches lengths) and medium traffic demand.</div>
                <div class="col-4"><img src="/paper4-figure1.svg" alt="4x4"></div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree1"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree1"
              >
                Hangzhou
              </button>
            </h2>
            <div id="panelsStayOpen-collapseThree1" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample1">
              <div class="accordion-body row">
                <div class="col-8">Realistic traffic network of the city Hangzhou, China with flow based on real-world data.</div>
                <div class="col-4"><img src="/paper4-figure2.svg" alt="Hangzhou"></div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFour1"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFour1"
              >
                NY48
              </button>
            </h2>
            <div id="panelsStayOpen-collapseFour1" class="accordion-collapse collapse" data-bs-parent="#accordionPanelsStayOpenExample1">
              <div class="accordion-body row">
                <div class="col-8">Realistic traffic network of part of Manhattan, New York City, USA with flow based on real-world data.</div>
                <div class="col-4"><img src="/paper4-figure3.svg" alt="Manhattan"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="pt-3">Publications</h2>
    <ul>
      <li>
        Analytically Guided Reinforcement Learning for Green It and Fluent Traffic [<a
          href="https://ieeexplore.ieee.org/abstract/document/9875292">IEEE]</a
        >
      </li>
      <li>
        Adaptability and sustainability of machine learning approaches to traffic signal control [<a
          href="https://www.nature.com/articles/s41598-022-21125-3">Nature</a
        >]
      </li>
      <li>
        How Well Do Reinforcement Learning Approaches Cope With Disruptions? The Case of Traffic
        Signal Control [<a href="https://ieeexplore.ieee.org/abstract/document/10100954">IEEE</a>]
      </li>
    </ul>
    <h2>Links</h2>
    <ul>
      <li>Go to <a href="/demonstrator">demonstrator</a></li>
      <li>
        Source code: <a href="https://github.com/ethz-coss/CoCi-Software-Demonstrator">GitHub</a>
      </li>
      <li>Go to <a href="https://coss.ethz.ch/research/CoCi.html">CoCi Home</a></li>
    </ul>
  </div>
</main>

<Footer />
