<script lang="ts">
  import Navbar from './navbar.svelte';
  import Footer from './footer.svelte';
</script>

<Navbar />

<main class="flex-shrink-0">
  <div class="container col-9">
    <div class="row">
      <div class="container col-9">
      <p class="font-weight-bold">
        How could innovative decentralized organisational approaches contribute to addressing
        humanity’s societal, sustainability, and governance challenges?
      </p>
      <p>
        [Temporary text replace with tool related text] Starting from the paradigm of smart cities, we propose that the requirement of organizing
        societies in a more resilient way implies the need for more decentralized solutions, based
        on digitally-​assisted self-​​organization and that this concept is also compatible with
        sustainability requirements and stronger democratic participation.
      </p>
      </div>
      <div class="container col-3">
        <img src="https://coss.ethz.ch/research/CoCi/_jcr_content/par/twocolumn_561788407/par_left/fullwidthimage/image.imageformat.lightbox.1590428751.png" height="200px" width="200px">
      </div>
    </div>


    <h2>Methods</h2>

    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
            Explanation of method #1
          </button>
        </h2>
        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
          <div class="accordion-body">
            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
            Explanation of method #2
          </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
          <div class="accordion-body">
            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
            Explanation of method #3
          </button>
        </h2>
        <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse">
          <div class="accordion-body">
            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
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
