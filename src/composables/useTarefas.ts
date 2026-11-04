import { ref } from "vue";
import {atualizarTarefa, excluirTarefa as excluirTarefaApi, listarTarefas} from "../api";
import type { Status, Tarefa } from "../tipos";

export function useTarefas() {
  const tarefas = ref<Tarefa[]>([]);
  const carregando = ref(true);
  const erroCarregamento = ref("");
  const erroAtualizacao = ref("");
  const erroExclusao = ref("");
  const excluindoId = ref<string | null>(null);

  async function buscarTarefas() {
    carregando.value = true;
    erroCarregamento.value = "";

    try {
      tarefas.value = await listarTarefas();
    } catch (erro) {
      erroCarregamento.value =
        erro instanceof Error
          ? erro.message
          : "Não foi possível carregar as tarefas.";
    } finally {
      carregando.value = false;
    }
  }

  async function mudarStatusTarefa(
    id: string,
    novoStatus: Status,
  ): Promise<boolean> {
    erroAtualizacao.value = "";

    try {
      const atualizada = await atualizarTarefa(id, {
        status: novoStatus,
      });

      const index = tarefas.value.findIndex((tarefa) => tarefa.id === id);

      if (index !== -1) {
        tarefas.value[index] = atualizada;
      }

      return true;
    } catch (erro) {
      erroAtualizacao.value =
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar o status da tarefa.";

      return false;
    }
  }

  async function removerTarefa(id: string): Promise<boolean> {
    erroExclusao.value = "";

    const tarefa = tarefas.value.find((item) => item.id === id);

    if (!tarefa) return false;

    const confirmado = window.confirm(
      `Excluir a tarefa "${tarefa.titulo}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmado) return false;

    excluindoId.value = id;

    try {
      await excluirTarefaApi(id);

      tarefas.value = tarefas.value.filter((item) => item.id !== id);

      return true;
    } catch (erro) {
      erroExclusao.value =
        erro instanceof Error
          ? erro.message
          : "Não foi possível excluir a tarefa.";

      return false;
    } finally {
      excluindoId.value = null;
    }
  }

  return {
    tarefas,
    carregando,
    erroCarregamento,
    erroAtualizacao,
    erroExclusao,
    excluindoId,
    buscarTarefas,
    mudarStatusTarefa,
    removerTarefa,
  };
}