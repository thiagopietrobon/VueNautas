<script setup lang="ts">
import LogoVueNautas from './components/layout/LogoVueNautas.vue'
import ControleTema from './components/layout/ControleTema.vue'
</script>

<template>
  <div class="app-shell">
    <header class="cabecalho">
      <div class="cabecalho-conteudo">

        <RouterLink
          class="marca"
          to="/"
          aria-label="VueNautas — página inicial"
        >
          <LogoVueNautas />

          <span class="marca-texto">
            <strong>VueNautas</strong>
            <small>Explorando tarefas e projetos</small>
          </span>
        </RouterLink>

        <div class="cabecalho-acoes">
          <nav
            class="navegacao"
            aria-label="Navegação principal"
          >
            <RouterLink
              to="/"
              class="link-nav"
              exact-active-class="ativo"
            >
              Tarefas
            </RouterLink>

            <RouterLink
              to="/quadro"
              class="link-nav"
              active-class="ativo"
            >
              Quadro
            </RouterLink>

            <RouterLink
              to="/projetos"
              class="link-nav"
              active-class="ativo"
            >
              Projetos
            </RouterLink>
          </nav>

          <ControleTema />
        </div>

      </div>
    </header>

    <main class="conteudo-principal">
      <RouterView />
    </main>

    <footer class="rodape">
      VueNautas — Explorando novas possibilidades.
    </footer>
  </div>
</template>