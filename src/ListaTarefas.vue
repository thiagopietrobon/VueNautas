<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
<<<<<<< HEAD
import { atualizarTarefa, excluirTarefa, listarTarefas } from './api'
import type { Status, Tarefa } from './tipos'
=======
>>>>>>> 9710f712e9041ca275f12406287499464210b4eb
import { filtrarTarefas } from './derivar'
import { useFiltrosStore } from './filtrosStore'
import CartaoTarefa from './components/CartaoTarefa.vue'
import BarraFiltros from './components/BarraFiltros.vue'
import { useTarefas } from './composables/useTarefas'

const {
  tarefas,
  carregando,
  erroCarregamento,
  erroAtualizacao,
  buscarTarefas,
  mudarStatusTarefa,
} = useTarefas()

const storeFiltros = useFiltrosStore()

<<<<<<< HEAD
const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref('')
const erroExclusao = ref('')
const excluindoId = ref<string | null>(null)
=======
>>>>>>> 9710f712e9041ca275f12406287499464210b4eb

const tarefasFiltradas = computed(() => {
  return filtrarTarefas(tarefas.value, storeFiltros)
})

<<<<<<< HEAD
async function buscarTarefas() {
  carregando.value = true
  erro.value = ''

  try {
    tarefas.value = await listarTarefas()
  } catch (erroBusca) {
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Ocorreu um erro ao carregar as tarefas.'
  } finally {
    carregando.value = false
  }
}

async function mudarStatusTarefa(id: string, novoStatus: Status) {
  try {
    const atualizada = await atualizarTarefa(id, { status: novoStatus })
    const index = tarefas.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tarefas.value[index] = atualizada
    }
  } catch (erroStatus) {
    erro.value = erroStatus instanceof Error
      ? erroStatus.message
      : 'Não foi possível atualizar o status da tarefa.'
  }
}

async function excluirTarefaDaLista(id: string) {
  const tarefa = tarefas.value.find((t) => t.id === id)

  if (!tarefa) return

  const confirmado = window.confirm(
    `Excluir a tarefa "${tarefa.titulo}"? Esta ação não pode ser desfeita.`,
  )

  if (!confirmado) return

  erroExclusao.value = ''
  excluindoId.value = id

  try {
    await excluirTarefa(id)
    tarefas.value = tarefas.value.filter((t) => t.id !== id)
  } catch (erroExcluir) {
    const mensagem = erroExcluir instanceof Error
      ? erroExcluir.message
      : 'Ocorreu um erro ao excluir a tarefa.'

    erroExclusao.value = `Não foi possível excluir a tarefa. ${mensagem}`
  } finally {
    excluindoId.value = null
  }
}

=======
>>>>>>> 9710f712e9041ca275f12406287499464210b4eb
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
<<<<<<< HEAD

    <p v-if="erroExclusao" class="mensagem mensagem-erro" role="alert">
      {{ erroExclusao }}
    </p>

    <p v-if="carregando" class="mensagem" role="status">Carregando tarefas...</p>
    <p v-else-if="erro" class="mensagem mensagem-erro" role="alert">
      {{ erro }}
=======
    
    <p v-if="erroAtualizacao" class="mensagem mensagem-erro" role="alert">
      {{ erroAtualizacao }}
>>>>>>> 9710f712e9041ca275f12406287499464210b4eb
    </p>
    
    <p v-if="carregando" class="mensagem" role="status">
      Carregando tarefas...
    </p>
    
    <p v-else-if="erroCarregamento" class="mensagem mensagem-erro" role="alert">
      {{ erroCarregamento }}
    </p>
    
    <div v-else-if="tarefas.length === 0" class="mensagem">
      Nenhuma tarefa cadastrada.
    </div>
    <div v-else-if="tarefasFiltradas.length === 0" class="mensagem mensagem-vazia">
      <p>Nenhuma tarefa encontrada com os filtros informados.</p>
      <button type="button" class="botao-secundario" @click="storeFiltros.limpar">
        Limpar filtros
      </button>
    </div>
    <section v-else class="grade-cartoes" aria-label="Lista de tarefas">
      <CartaoTarefa
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
<<<<<<< HEAD
        permitir-excluir
        :excluindo="excluindoId === tarefa.id"
        @mudar-status="mudarStatusTarefa"
        @excluir="excluirTarefaDaLista"
      />
=======
        :ao-mudar-status="mudarStatusTarefa"      />
>>>>>>> 9710f712e9041ca275f12406287499464210b4eb
    </section>
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
