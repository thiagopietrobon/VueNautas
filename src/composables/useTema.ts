import { ref } from 'vue'

export type Tema = 'terra' | 'espaco'

const CHAVE_TEMA = 'vuenautas-tema'

function obterPreferenciaSalva(): Tema | null {
    try {
        const temaSalvo = localStorage.getItem(CHAVE_TEMA)

        if (temaSalvo === 'terra' || temaSalvo === 'espaco') {
            return temaSalvo
        }
    } catch {
        // O sistema continuará funcionando sem persistência.
    }

    return null
}

function detectarTemaSistema(): Tema {
    if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return 'espaco'
    }

    return 'terra'
}

const tema = ref<Tema>(
    obterPreferenciaSalva() ?? detectarTemaSistema()
)

function aplicarTema(novoTema: Tema): void {
    document.documentElement.setAttribute('data-tema', novoTema)
}

export function inicializarTema(): void {
    aplicarTema(tema.value)

    if (typeof window === 'undefined') {
        return
    }

    const preferenciaSistema = window.matchMedia(
        '(prefers-color-scheme: dark)'
    )

    preferenciaSistema.addEventListener('change', (evento) => {
        const preferenciaManual = obterPreferenciaSalva()

        if (preferenciaManual === null) {
            tema.value = evento.matches ? 'espaco' : 'terra'
            aplicarTema(tema.value)
        }
    })
}

export function definirTema(novoTema: Tema): void {
    tema.value = novoTema
    aplicarTema(novoTema)

    try {
        localStorage.setItem(CHAVE_TEMA, novoTema)
    } catch {
        // A alternância continua funcionando sem persistência.
    }
}

export function alternarTema(): void {
    definirTema(tema.value === 'terra' ? 'espaco' : 'terra')
}

export function useTema() {
    return {
        tema,
        definirTema,
        alternarTema
    }
}