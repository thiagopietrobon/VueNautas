<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { filtrarTarefas } from './derivar'
import { useFiltrosStore } from './filtrosStore'
import CartaoTarefa from './components/CartaoTarefa.vue'
import BarraFiltros from './components/BarraFiltros.vue'
import { useTarefas } from './composables/useTarefas'
import EstadoConsulta from './components/EstadoConsulta.vue'

const {
  tarefas,
  carregando,
  erroCarregamento,
  erroAtualizacao,
  erroExclusao,
  excluindoId,
  buscarTarefas,
  mudarStatusTarefa,
  removerTarefa,
} = useTarefas()

const storeFiltros = useFiltrosStore()

const tarefasFiltradas = computed(() => {
  return filtrarTarefas(tarefas.value, storeFiltros)
})

onMounted(buscarTarefas)
</script>

<template>
  <section class="pagina">
    <div class="titulo-pagina">
      <p class="sobretitulo">ORGANIZAÇÃO</p>
      <h1>Tarefas</h1>
      <p class="texto-introdutorio">Acompanhe as atividades e consulte os detalhes de cada tarefa.</p>

      <div class="barra-acoes-topo">
        <div class="abas-visao" role="tablist" aria-label="Visão de tarefas">
          <RouterLink to="/" class="aba-visao ativa" role="tab" aria-selected="true">
            📋 Lista
          </RouterLink>
          <RouterLink to="/quadro" class="aba-visao" role="tab" aria-selected="false">
            📊 Quadro
          </RouterLink>
        </div>

        <RouterLink to="/tarefas/nova" class="botao">
          + Nova tarefa
        </RouterLink>
      </div>
    </div>

    <!-- Barra de Filtros compartilhada via Pinia -->
    <BarraFiltros />
    
        <p v-if="erroExclusao" class="mensagem mensagem-erro" role="alert">
          {{ erroExclusao }}
        </p>
        
        <p v-if="erroAtualizacao" class="mensagem mensagem-erro" role="alert">
          {{ erroAtualizacao }}
        </p>
        
        <EstadoConsulta
          :carregando="carregando"
          :erro="erroCarregamento"
          mensagem-carregamento="Carregando tarefas..."
          @tentar-novamente="buscarTarefas"
        >
          <div v-if="tarefas.length === 0" class="mensagem">
            Nenhuma tarefa cadastrada.
          </div>
        
          <div
            v-else-if="tarefasFiltradas.length === 0"
            class="mensagem mensagem-vazia"
          >
            <p>Nenhuma tarefa encontrada com os filtros informados.</p>
        
            <button
              type="button"
              class="botao-secundario"
              @click="storeFiltros.limpar"
            >
              Limpar filtros
            </button>
          </div>
        
          <section
            v-else
            class="grade-cartoes"
            aria-label="Lista de tarefas"
          >
            <CartaoTarefa
              v-for="tarefa in tarefasFiltradas"
              :key="tarefa.id"
              :tarefa="tarefa"
              permitir-excluir
              :excluindo="excluindoId === tarefa.id"
              :ao-mudar-status="mudarStatusTarefa"
              @excluir="removerTarefa"
            />
          </section>
        </EstadoConsulta>
  </section>
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

.mensagem-vazia {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
