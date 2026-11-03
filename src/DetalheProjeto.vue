<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { buscarProjeto as buscarProjetoApi, ErroApi } from './api'
import type { Projeto, Tarefa } from './tipos'
import CartaoTarefa from './components/CartaoTarefa.vue'
import { formatarData } from './utils'

const rota = useRoute()
const projeto = ref<Projeto | null>(null)
const tarefas = ref<Tarefa[]>([])
const carregando = ref(false)
const erro = ref('')
const idProjeto = computed(() => String(rota.params.id ?? ''))
let requisicaoAtual = 0

async function buscarProjeto(id: string) {
  const numeroRequisicao = ++requisicaoAtual
  projeto.value = null
  tarefas.value = []
  erro.value = ''
  carregando.value = true

  try {
    const dadosProjeto = await buscarProjetoApi(id)
    if (numeroRequisicao !== requisicaoAtual) return
    projeto.value = dadosProjeto
    tarefas.value = dadosProjeto.tarefas
  } catch (erroBusca) {
    if (numeroRequisicao !== requisicaoAtual) return
    if (erroBusca instanceof ErroApi && erroBusca.status === 404) {
      erro.value = `Nenhum projeto foi encontrado com o ID ${id}.`
      return
    }
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Ocorreu um erro ao consultar o projeto.'
  } finally {
    if (numeroRequisicao === requisicaoAtual) carregando.value = false
  }
}

watch(idProjeto, buscarProjeto, { immediate: true })

</script>

<template>
  <section class="pagina pagina-detalhe">
    <RouterLink class="link-voltar" to="/projetos">← Voltar para projetos</RouterLink>
    <div class="titulo-pagina">
      <p class="sobretitulo">VISÃO DO PROJETO</p>
      <h1>Detalhe do projeto</h1>
      <p class="texto-introdutorio">Dados do projeto e atividades associadas a ele.</p>
    </div>

    <p v-if="carregando" class="mensagem" role="status">Buscando projeto e tarefas...</p>
    <p v-else-if="erro" class="mensagem mensagem-erro" role="alert">{{ erro }}</p>

    <template v-else-if="projeto">
      <section class="painel-detalhes">
        <div class="painel-titulo">
          <span class="etiqueta">Projeto #{{ projeto.id }}</span>
          <h2>{{ projeto.nome }}</h2>

          <RouterLink
            class="botao"
            :to="`/projetos/${projeto.id}/editar`"
          >
            Editar projeto
          </RouterLink>
        </div>
        <dl class="lista-detalhes">
          <div class="item-detalhe">
            <dt>ID</dt>
            <dd>{{ projeto.id }}</dd>
          </div>
          <div class="item-detalhe item-detalhe-largo">
            <dt>Nome</dt>
            <dd>{{ projeto.nome }}</dd>
          </div>
          <div class="item-detalhe item-detalhe-largo">
            <dt>Descrição</dt>
            <dd>{{ projeto.descricao || 'Não informada' }}</dd>
          </div>
          <div class="item-detalhe">
            <dt>Disciplina</dt>
            <dd>{{ projeto.disciplina }}</dd>
          </div>
          <div class="item-detalhe">
            <dt>Criado em</dt>
            <dd>{{ formatarData(projeto.criadoEm) }}</dd>
          </div>
        </dl>
      </section>

      <section class="secao-tarefas-projeto">
        <div class="cabecalho-secao">
          <div>
            <p class="sobretitulo">ATIVIDADES</p>
            <h2>Tarefas do projeto</h2>
          </div>
          <div class="acoes-secao">
            <span class="contador">{{ tarefas.length }} {{ tarefas.length === 1 ? 'tarefa' : 'tarefas' }}</span>
            <RouterLink
              class="botao"
              :to="{ path: '/tarefas/nova', query: { projetoId: projeto.id } }"
            >
              Nova tarefa
            </RouterLink>
          </div>
        </div>

        <p v-if="tarefas.length === 0" class="mensagem">Este projeto ainda não possui tarefas vinculadas.</p>
        <div v-else class="grade-cartoes" aria-label="Tarefas deste projeto">
          <CartaoTarefa v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa" />
        </div>
      </section>
    </template>
  </section>
</template>
