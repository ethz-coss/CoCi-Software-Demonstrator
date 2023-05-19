<script>
  import { page } from '$app/stores';
</script>
<header>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">CoCi Demonstrator</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <a class="nav-link" class:active={$page.url.pathname==='/'} aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" class:active={$page.url.pathname==='/demonstrator'} href="/demonstrator">Demonstrator</a>
          </li>
      </div>
    </div>
  </nav>
</header>
