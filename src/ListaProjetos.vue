<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { listarProjetos } from "./api";
import type { Projeto } from "./tipos";
import CartaoProjeto from "./components/CartaoProjeto.vue";
import EstadoConsulta from "./components/EstadoConsulta.vue";

const projetos = ref<Projeto[]>([]);
const carregando = ref(true);
const erro = ref("");

async function buscarProjetos() {
    carregando.value = true;
    erro.value = "";

    try {
        projetos.value = await listarProjetos();
    } catch (erroBusca) {
        erro.value =
            erroBusca instanceof Error
                ? erroBusca.message
                : "Ocorreu um erro ao carregar os projetos.";
    } finally {
        carregando.value = false;
    }
}

onMounted(buscarProjetos);
</script>

<template>
    <section class="pagina">
        <div class="titulo-pagina">
            <p class="sobretitulo">VISÃO GERAL</p>
            <h1>Projetos</h1>
            <p class="texto-introdutorio">
                Acesse um projeto para consultar suas informações e tarefas.
            </p>

            <RouterLink to="/projetos/novo" class="botao">
                Novo projeto
            </RouterLink>
        </div>

        <EstadoConsulta
            :carregando="carregando"
            :erro="erro"
            mensagem-carregamento="Carregando projetos..."
            @tentar-novamente="buscarProjetos"
        >
            <div v-if="projetos.length === 0" class="mensagem">
                Nenhum projeto cadastrado.
            </div>

            <section
                v-else
                class="grade-cartoes"
                aria-label="Lista de projetos"
            >
                <CartaoProjeto
                    v-for="projeto in projetos"
                    :key="projeto.id"
                    :projeto="projeto"
                />
            </section>
        </EstadoConsulta>
    </section>
</template>
