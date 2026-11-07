<script setup lang="ts">
import { useTema } from '../../composables/useTema'

const { tema, alternarTema } = useTema()
</script>

<template>
  <button
    class="controle-tema"
    type="button"
    @click="alternarTema"
    :aria-label="tema === 'terra'
      ? 'Ativar tema Espaço'
      : 'Ativar tema Terra'"
    :title="tema === 'terra'
      ? 'Ativar tema Espaço'
      : 'Ativar tema Terra'"
  >
    <span aria-hidden="true">
      {{ tema === 'terra' ? '☾' : '☀' }}
    </span>

    <span class="controle-tema-texto">
      {{ tema === 'terra' ? 'Espaço' : 'Terra' }}
    </span>
  </button>
</template>