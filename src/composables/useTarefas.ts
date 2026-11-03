
import { ref } from 'vue'
import { atualizarTarefa, listarTarefas } from '../api'
import type { Status, Tarefa } from '../tipos'

export function useTarefas() {
  const tarefas = ref<Tarefa[]>([])
  const carregando = ref(true)
  const erroCarregamento = ref('')
  const erroAtualizacao = ref('')

  async function buscarTarefas() {
    carregando.value = true
    erroCarregamento.value = ''

    try {
      tarefas.value = await listarTarefas()
    } catch (erro) {
      erroCarregamento.value = erro instanceof Error
        ? erro.message
        : 'Não foi possível carregar as tarefas.'
    } finally {
      carregando.value = false
    }
  }

  async function mudarStatusTarefa(
    id: string,
    novoStatus: Status,
  ): Promise<boolean> {
    erroAtualizacao.value = ''

    try {
      const atualizada = await atualizarTarefa(id, {
        status: novoStatus,
      })

      const index = tarefas.value.findIndex(
        (tarefa) => tarefa.id === id,
      )

      if (index !== -1) {
        tarefas.value[index] = atualizada
      }

      return true
    } catch (erro) {
      erroAtualizacao.value = erro instanceof Error
        ? erro.message
        : 'Não foi possível atualizar o status da tarefa.'

      return false
    }
  }

  return {
    tarefas,
    carregando,
    erroCarregamento,
    erroAtualizacao,
    buscarTarefas,
    mudarStatusTarefa,
  }
}
