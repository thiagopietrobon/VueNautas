<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  buscarProjeto,
  criarProjeto,
  atualizarProjeto,
} from './api'
import EstadoConsulta from './components/EstadoConsulta.vue'

const rota = useRoute()
const router = useRouter()

const modoEdicao = computed(() => Boolean(rota.params.id))
const idProjeto = computed(() => String(rota.params.id ?? ''))

const carregando = ref(true)
const salvando = ref(false)
const erro = ref('')
const erroCarregamento = ref(false)
const formularioRef = ref<HTMLFormElement | null>(null)

const nome = ref('')
const descricao = ref('')
const disciplina = ref('')
const criadoEm = ref('')

const erros = ref({
  nome: '',
  descricao: '',
  disciplina: '',
})

let requisicaoAtual = 0

function limparErros() {
  erros.value = {
    nome: '',
    descricao: '',
    disciplina: '',
  }
}

function limparFormulario() {
  nome.value = ''
  descricao.value = ''
  disciplina.value = ''
  criadoEm.value = ''
  limparErros()
}

async function carregarFormulario() {
  const numeroRequisicao = ++requisicaoAtual

  erro.value = ''
  erroCarregamento.value = false
  limparErros()

  if (!modoEdicao.value) {
    limparFormulario()
    carregando.value = false
    return
  }

  carregando.value = true

  try {
    const projeto = await buscarProjeto(idProjeto.value)

    if (numeroRequisicao !== requisicaoAtual) return

    nome.value = projeto.nome
    descricao.value = projeto.descricao
    disciplina.value = projeto.disciplina
    criadoEm.value = projeto.criadoEm
  } catch (erroBusca) {
    if (numeroRequisicao !== requisicaoAtual) return

    erroCarregamento.value = true
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Não foi possível carregar os dados do projeto.'
  } finally {
    if (numeroRequisicao === requisicaoAtual) {
      carregando.value = false
    }
  }
}

watch(
  [idProjeto, modoEdicao],
  carregarFormulario,
  { immediate: true },
)

function validarFormulario(): boolean {
  limparErros()

  let valido = true

  if (!nome.value.trim()) {
    erros.value.nome = 'Informe o nome do projeto.'
    valido = false
  }

  if (!descricao.value.trim()) {
    erros.value.descricao = 'Informe a descrição do projeto.'
    valido = false
  }

  if (!disciplina.value.trim()) {
    erros.value.disciplina = 'Informe a disciplina do projeto.'
    valido = false
  }

  return valido
}

function validarCampo(campo: keyof typeof erros.value) {
  switch (campo) {
    case 'nome':
      erros.value.nome = nome.value.trim()
        ? ''
        : 'Informe o nome do projeto.'
      break

    case 'descricao':
      erros.value.descricao = descricao.value.trim()
        ? ''
        : 'Informe a descrição do projeto.'
      break

    case 'disciplina':
      erros.value.disciplina = disciplina.value.trim()
        ? ''
        : 'Informe a disciplina do projeto.'
      break
  }
}

async function salvarProjeto() {
  if (salvando.value) return

  erro.value = ''

  if (!validarFormulario()) {
    await nextTick()
    formularioRef.value
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
    return
  }

  salvando.value = true

  const dadosProjeto = {
    nome: nome.value.trim(),
    descricao: descricao.value.trim(),
    disciplina: disciplina.value.trim(),
    criadoEm: modoEdicao.value
      ? criadoEm.value
      : new Date().toISOString(),
  }

  try {
    if (modoEdicao.value) {
      await atualizarProjeto(
        idProjeto.value,
        dadosProjeto,
      )

      await router.push({
        name: 'detalhe-projeto',
        params: { id: idProjeto.value },
      })
    } else {
      await criarProjeto(dadosProjeto)
      await router.push('/projetos')
    }
  } catch (erroSalvar) {
    const mensagem = erroSalvar instanceof Error
      ? erroSalvar.message
      : 'Verifique se a API está ativa.'

    erro.value = `Não foi possível salvar o projeto. ${mensagem}`
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <RouterLink
      class="link-voltar"
      :to="modoEdicao
        ? { name: 'detalhe-projeto', params: { id: idProjeto } }
        : '/projetos'"
    >
      ← {{ modoEdicao ? 'Voltar para projeto' : 'Voltar para projetos' }}
    </RouterLink>

    <div class="titulo-pagina">
      <h1 id="titulo-formulario-projeto">
        {{ modoEdicao ? 'Editar projeto' : 'Novo projeto' }}
      </h1>
    </div>

    <EstadoConsulta
      :carregando="carregando"
      :erro="erroCarregamento ? erro : ''"
      mensagem-carregamento="Carregando dados do formulário..."
      @tentar-novamente="carregarFormulario"
    >
      <form
        ref="formularioRef"
        class="formulario-projeto"
        aria-labelledby="titulo-formulario-projeto"
        novalidate
        @submit.prevent="salvarProjeto"
      >
        <p id="projeto-campos-obrigatorios" class="texto-ajuda">
          Os campos marcados com * são obrigatórios.
        </p>

        <p v-if="erro" class="mensagem mensagem-erro" role="alert">
          {{ erro }}
        </p>

        <div class="formulario-campo">
          <label for="nome">Nome do projeto *</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            required
            :disabled="salvando"
            :aria-invalid="Boolean(erros.nome)"
            :aria-describedby="erros.nome
              ? 'projeto-campos-obrigatorios erro-nome'
              : 'projeto-campos-obrigatorios'"
            @input="validarCampo('nome')"
            @blur="validarCampo('nome')"
          />

          <small
            v-if="erros.nome"
            id="erro-nome"
            class="mensagem-erro"
            role="alert"
          >
            {{ erros.nome }}
          </small>
        </div>

        <div class="formulario-campo">
          <label for="descricao">Descrição *</label>
          <textarea
            id="descricao"
            v-model="descricao"
            required
            :disabled="salvando"
            :aria-invalid="Boolean(erros.descricao)"
            :aria-describedby="erros.descricao
              ? 'projeto-campos-obrigatorios erro-descricao'
              : 'projeto-campos-obrigatorios'"
            @input="validarCampo('descricao')"
            @blur="validarCampo('descricao')"
          ></textarea>

          <small
            v-if="erros.descricao"
            id="erro-descricao"
            class="mensagem-erro"
            role="alert"
          >
            {{ erros.descricao }}
          </small>
        </div>

        <div class="formulario-campo">
          <label for="disciplina">Disciplina *</label>
          <input
            id="disciplina"
            v-model="disciplina"
            type="text"
            required
            :disabled="salvando"
            :aria-invalid="Boolean(erros.disciplina)"
            :aria-describedby="erros.disciplina
              ? 'projeto-campos-obrigatorios erro-disciplina'
              : 'projeto-campos-obrigatorios'"
            @input="validarCampo('disciplina')"
            @blur="validarCampo('disciplina')"
          />

          <small
            v-if="erros.disciplina"
            id="erro-disciplina"
            class="mensagem-erro"
            role="alert"
          >
            {{ erros.disciplina }}
          </small>
        </div>

        <div class="formulario-acoes">
          <button
            type="submit"
            class="botao"
            :disabled="salvando"
          >
            {{
              salvando
                ? 'Salvando...'
                : modoEdicao
                  ? 'Salvar alterações'
                  : 'Salvar projeto'
            }}
          </button>

          <RouterLink
            class="botao-secundario"
            :to="modoEdicao
              ? { name: 'detalhe-projeto', params: { id: idProjeto } }
              : '/projetos'"
          >
            Cancelar
          </RouterLink>
        </div>
      </form>
    </EstadoConsulta>
  </section>
</template>