<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { agruparPorStatus, filtrarTarefas } from './derivar'
import type { Status } from './tipos'
import { useFiltrosStore } from './filtrosStore'
import CartaoTarefa from './components/CartaoTarefa.vue'
import BarraFiltros from './components/BarraFiltros.vue'
import { useTarefas } from './composables/useTarefas'

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

const rotulosStatus: Record<Status, string> = {
  'a-fazer': 'A fazer',
  'em-andamento': 'Em andamento',
  'em-revisao': 'Em revisão',
  'concluida': 'Concluída',
}

const colunas = computed(() => {
  const filtradas = filtrarTarefas(tarefas.value, storeFiltros)
  return agruparPorStatus(filtradas)
})

const totalFiltradas = computed(() => {
  return colunas.value.reduce(
    (total, coluna) => total + coluna.tarefas.length,
    0,
  )
})

onMounted(buscarTarefas)
</script>

<template>
  <section class="pagina">
    <div class="titulo-pagina">
      <p class="sobretitulo">VISÃO DE QUADRO</p>
      <h1>Quadro de Tarefas</h1>
      <p class="texto-introdutorio">
        Acompanhe o fluxo de trabalho organizado pelas etapas de execução.
      </p>

      <div class="barra-acoes-topo">
        <div class="abas-visao" role="tablist" aria-label="Visão de tarefas">
          <RouterLink to="/" class="aba-visao" role="tab" aria-selected="false">
            📋 Lista
          </RouterLink>
          <RouterLink to="/quadro" class="aba-visao ativa" role="tab" aria-selected="true">
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
        
        <p v-if="carregando" class="mensagem" role="status">
          Carregando quadro...
        </p>
        
        <p v-else-if="erroCarregamento" class="mensagem mensagem-erro" role="alert">
          {{ erroCarregamento }}
        </p>
        
        <div v-else-if="tarefas.length === 0" class="mensagem">
          Nenhuma tarefa cadastrada.
        </div>
        
        <div v-else-if="totalFiltradas === 0" class="mensagem mensagem-vazia">
          <p>Nenhuma tarefa encontrada com os filtros informados.</p>
        
          <button
            type="button"
            class="botao-secundario"
            @click="storeFiltros.limpar"
          >
            Limpar filtros
          </button>
        </div>
        
        <div v-else class="recipiente-quadro">
          <div class="grade-quadro" role="region" aria-label="Colunas por status">
            <section
              v-for="coluna in colunas"
              :key="coluna.status"
              class="coluna-quadro"
              :data-status="coluna.status"
              :aria-label="`Coluna ${rotulosStatus[coluna.status]}`"
            >
              <header class="coluna-cabecalho">
                <div class="coluna-titulo-com-indicador">
                  <span
                    class="indicador-status"
                    :data-status="coluna.status"
                  ></span>
        
                  <h2>{{ rotulosStatus[coluna.status] }}</h2>
                </div>
        
                <span
                  class="coluna-contador"
                  :aria-label="`${coluna.tarefas.length} tarefas`"
                >
                  {{ coluna.tarefas.length }}
                </span>
              </header>
        
              <div class="coluna-corpo">
                <div v-if="coluna.tarefas.length === 0" class="coluna-vazia">
                  Nenhuma tarefa
                </div>
        
                <CartaoTarefa
                  v-for="tarefa in coluna.tarefas"
                  :key="tarefa.id"
                  :tarefa="tarefa"
                  permitir-excluir
                  :excluindo="excluindoId === tarefa.id"
                  :ao-mudar-status="mudarStatusTarefa"
                  @excluir="removerTarefa"
                />
              </div>
            </section>
          </div>
        </div>
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

.recipiente-quadro {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 24px;
}

.grade-quadro {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  gap: 20px;
  align-items: start;
}

.coluna-quadro {
  background: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 400px;
}

.coluna-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.coluna-titulo-com-indicador {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicador-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #94a3b8;
}

.indicador-status[data-status="a-fazer"] {
  background: #64748b;
}

.indicador-status[data-status="em-andamento"] {
  background: #0284c7;
}

.indicador-status[data-status="em-revisao"] {
  background: #d97706;
}

.indicador-status[data-status="concluida"] {
  background: #16a34a;
}

.coluna-cabecalho h2 {
  font-size: 16px;
  margin: 0;
  color: var(--azul-escuro);
}

.coluna-contador {
  background: var(--branco);
  border: 1px solid #cbd5e1;
  color: var(--azul-escuro);
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.coluna-corpo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.coluna-vazia {
  padding: 24px 12px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  font-style: italic;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 900px) {
  .grade-quadro {
    grid-template-columns: repeat(4, 280px);
  }
}
</style>
