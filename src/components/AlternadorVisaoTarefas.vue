
<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  visaoAtiva: 'lista' | 'quadro'
}>()
</script>

<template>
  <div class="barra-acoes-topo">
    <nav class="abas-visao" aria-label="Visão de tarefas">
      <RouterLink
        to="/"
        class="aba-visao"
        :class="{ ativa: visaoAtiva === 'lista' }"
        :aria-current="visaoAtiva === 'lista' ? 'page' : undefined"
      >
        📋 Lista
      </RouterLink>

      <RouterLink
        to="/quadro"
        class="aba-visao"
        :class="{ ativa: visaoAtiva === 'quadro' }"
        :aria-current="visaoAtiva === 'quadro' ? 'page' : undefined"
      >
        📊 Quadro
      </RouterLink>
    </nav>

    <RouterLink to="/tarefas/nova" class="botao">
      + Nova tarefa
    </RouterLink>
  </div>
</template>

<style scoped>
.barra-acoes-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.abas-visao {
  display: inline-flex;
  background: #eef3f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.aba-visao {
  padding: 8px 16px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  color: var(--texto-suave);
  transition: background 0.15s ease, color 0.15s ease;
}

.aba-visao.ativa {
  background: var(--branco);
  color: var(--azul);
  box-shadow: 0 2px 8px rgb(20 47 75 / 8%);
}
</style>
