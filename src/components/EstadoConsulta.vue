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
    <p>{{ erro }}</p>

    <button
      type="button"
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

.estado-consulta--erro {
  color: #b42318;
}

.estado-consulta button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>