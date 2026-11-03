<script setup lang="ts">
import type { Status, Tarefa } from '../tipos'
import { formatarData } from '../utils'

const props = withDefaults(defineProps<{
  tarefa: Tarefa
  permitirExcluir?: boolean
  excluindo?: boolean
}>(), {
  permitirExcluir: false,
  excluindo: false,
})

const emit = defineEmits<{
  (e: 'mudarStatus', id: string, novoStatus: Status): void
  (e: 'excluir', id: string): void
}>()

function aoAlterarStatus(event: Event) {
  const alvo = event.target as HTMLSelectElement
  emit('mudarStatus', alvo.dataset.id ?? '', alvo.value as Status)
}

function aoExcluir() {
  emit('excluir', props.tarefa.id)
}
</script>

<template>
  <article class="cartao cartao-tarefa">
    <div class="cartao-etiquetas">
      <span class="etiqueta etiqueta-status" :data-status="tarefa.status">{{ tarefa.status }}</span>
      <span class="etiqueta etiqueta-prioridade" :data-prioridade="tarefa.prioridade">Prioridade: {{ tarefa.prioridade }}</span>
    </div>

    <h2>{{ tarefa.titulo }}</h2>
    <p class="cartao-descricao">{{ tarefa.descricao }}</p>

    <div class="cartao-metadados">
      <p><strong>Responsável:</strong> {{ tarefa.responsavel || 'Não informado' }}</p>
      <p><strong>Prazo:</strong> {{ formatarData(tarefa.prazo) }}</p>
    </div>

    <div class="cartao-acoes">
      <RouterLink class="link-detalhes" :to="{ name: 'detalhe-tarefa', params: { id: tarefa.id } }">
        Ver detalhes <span aria-hidden="true">→</span>
      </RouterLink>

      <div class="cartao-status-controle">
        <label :for="`status-select-${tarefa.id}`" class="rotulo-status">Status:</label>
        <select
          :id="`status-select-${tarefa.id}`"
          :data-id="tarefa.id"
          :value="tarefa.status"
          class="seletor-status"
          aria-label="Alterar status da tarefa"
          @change="aoAlterarStatus"
        >
          <option value="a-fazer">A fazer</option>
          <option value="em-andamento">Em andamento</option>
          <option value="em-revisao">Em revisão</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <button
        v-if="permitirExcluir"
        type="button"
        class="botao-excluir"
        :disabled="excluindo"
        :aria-label="`Excluir a tarefa ${tarefa.titulo}`"
        @click="aoExcluir"
      >
        {{ excluindo ? 'Excluindo...' : 'Excluir' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.cartao-tarefa {
  display: flex;
  flex-direction: column;
}

.cartao-tarefa h2 {
  margin: 15px 0 9px;
  font-size: 20px;
  line-height: 1.35;
}

.cartao-descricao {
  margin: 0;
  color: var(--texto-suave);
  line-height: 1.6;
}

.cartao-etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.etiqueta-status {
  background: #eef6ff;
}

.etiqueta-prioridade {
  background: #fbf7ec;
  border-color: #f1e5c6;
  color: #89651b;
}

.cartao-metadados {
  width: 100%;
  margin-top: auto;
  padding-top: 15px;
}

.cartao-metadados p {
  margin: 5px 0;
  color: #536579;
  font-size: 13px;
}

.cartao-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #edf1f6;
  flex-wrap: wrap;
}

.cartao-status-controle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rotulo-status {
  font-size: 12px;
  font-weight: 700;
  color: var(--texto-suave);
}

.seletor-status {
  padding: 5px 8px;
  border: 1px solid var(--borda);
  border-radius: 6px;
  font-size: 12px;
  background: #fbfcfe;
  color: var(--azul-escuro);
  cursor: pointer;
  outline: none;
}

.seletor-status:focus {
  border-color: var(--azul);
}

.botao-excluir {
  padding: 5px 10px;
  border: 1px solid #f0caca;
  border-radius: 6px;
  background: #fff7f7;
  color: #9c3333;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.botao-excluir:hover:not(:disabled) {
  border-color: #d99a9a;
  background: #fdeaea;
}

.botao-excluir:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 420px) {
  .cartao-tarefa {
    padding: 18px;
  }

  .cartao-acoes {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
