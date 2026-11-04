<script setup lang="ts">
defineProps<{
  carregando: boolean
  erro?: string
  mensagemCarregamento?: string
}>()

const emit = defineEmits<{
  (evento: 'tentar-novamente'): void
}>()
</script>

<template>
  <p
    v-if="carregando"
    class="estado-consulta"
    role="status"
  >
    {{ mensagemCarregamento || 'Carregando...' }}
  </p>

  <section
    v-else-if="erro"
    class="estado-consulta estado-consulta--erro"
    role="alert"
  >
    <div class="erro-conteudo">
      <span class="icone-alerta" aria-hidden="true">⚠</span>

      <p>{{ erro }}</p>
    </div>

    <button
      type="button"
      class="botao-tentar-novamente"
      @click="emit('tentar-novamente')"
    >
      Tentar novamente
    </button>
  </section>

  <slot v-else />
</template>

<style scoped>
.estado-consulta {
  padding: 1.5rem;
  text-align: center;
}

/* Painel de erro */
.estado-consulta--erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding: 1.5rem;
  border: 1px solid #fecdca;
  border-radius: 12px;

  background-color: #fef3f2;
  color: #b42318;
}

/* Ícone e mensagem */
.erro-conteudo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.icone-alerta {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  width: 2rem;
  height: 2rem;

  border-radius: 50%;
  background-color: #fee4e2;

  color: #b42318;
  font-size: 1.25rem;
  font-weight: bold;
}

.erro-conteudo p {
  margin: 0;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

/* Botão */
.botao-tentar-novamente {
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 8px;

  background-color: #2563eb;
  color: #ffffff;

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.botao-tentar-novamente:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.botao-tentar-novamente:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.botao-tentar-novamente:active {
  transform: translateY(0);
}

/* Ajustes para telas menores */
@media (max-width: 480px) {
  .estado-consulta--erro {
    padding: 1rem;
  }

  .erro-conteudo {
    align-items: flex-start;
  }
}
</style>