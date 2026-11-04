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
      <p class="texto-introdutorio">
        Acompanhe as atividades e consulte os detalhes de cada tarefa.
      </p>

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

    <BarraFiltros />

    <section
      v-if="erroExclusao"
      class="aviso-erro-operacao"
      role="alert"
    >
      <span class="icone-alerta" aria-hidden="true">⚠</span>
      <p>{{ erroExclusao }}</p>
    </section>

    <section
      v-if="erroAtualizacao"
      class="aviso-erro-operacao"
      role="alert"
    >
      <span class="icone-alerta" aria-hidden="true">⚠</span>
      <p>{{ erroAtualizacao }}</p>
    </section>

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

/* Avisos de erro das operações */
.aviso-erro-operacao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding: 14px 18px;

  border: 1px solid #fecdca;
  border-radius: 12px;

  background: #fef3f2;
  color: #b42318;
}

.aviso-erro-operacao p {
  margin: 0;
  line-height: 1.5;
}

.icone-alerta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border-radius: 50%;
  background: #fee4e2;

  color: #b42318;
  font-size: 18px;
  font-weight: bold;
}

@media (max-width: 480px) {
  .aviso-erro-operacao {
    align-items: flex-start;
    padding: 12px;
  }
}
</style>