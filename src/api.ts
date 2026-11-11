import type {
    Projeto,
    Tarefa,
    NovoProjeto,
    AtualizarProjeto,
    NovaTarefa,
    AtualizarTarefa,
} from "./tipos";

export type {
    Projeto,
    Tarefa,
    NovoProjeto,
    AtualizarProjeto,
    NovaTarefa,
    AtualizarTarefa,
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type ProjetoComTarefas = Projeto & {
    tarefas: Tarefa[];
};

export class ErroApi extends Error {
    readonly status: number;

    constructor(status: number, mensagem: string) {
        super(mensagem);
        this.status = status;
        this.name = "ErroApi";
    }
}


function mensagemPorStatus(status: number): string {
    if (status === 404) {
        return "O registro solicitado não foi encontrado.";
    }

    if (status === 409) {
        return "Não foi possível concluir a operação porque os dados foram alterados. Tente novamente.";
    }

    if (status >= 500) {
        return "A API encontrou um erro interno. Tente novamente em instantes.";
    }

    return `A API respondeu com status ${status}.`;
}

async function requisitar<T>(
    caminho: string,
    opcoes?: RequestInit,
): Promise<T> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    } catch {
        throw new ErroApi(
            0,
            "Não foi possível conectar à API. Verifique sua conexão ou tente novamente mais tarde.",
        );
    }

    if (!resposta.ok) {
        throw new ErroApi(resposta.status, mensagemPorStatus(resposta.status));
    }

    if (resposta.status === 204) {
        return undefined as unknown as T;
    }

    const texto = await resposta.text();

    if (!texto) {
        return undefined as unknown as T;
    }

    try {
        return JSON.parse(texto) as T;
    } catch {
        throw new ErroApi(
            resposta.status,
            "A API retornou uma resposta inválida.",
        );
    }
}


export function listarProjetos(): Promise<Projeto[]> {
    return requisitar<Projeto[]>("/projetos");
}

export function buscarProjeto(id: string): Promise<ProjetoComTarefas> {
    return requisitar<ProjetoComTarefas>(
        `/projetos/${encodeURIComponent(id)}?_embed=tarefas`,
    );
}

export async function criarTarefa(tarefa: NovaTarefa): Promise<Tarefa> {
    const tarefas = await listarTarefas();
    const idsNumericos = tarefas
        .map((t) => Number(t.id))
        .filter((n) => !Number.isNaN(n));
    const proximoId = idsNumericos.length > 0 ? String(Math.max(...idsNumericos) + 1) : "1";

    return requisitar<Tarefa>("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: proximoId, ...tarefa }),
    });
}

export function atualizarTarefa(
    id: string,
    tarefa: AtualizarTarefa,
): Promise<Tarefa> {
    return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefa),
    });
}

export async function criarProjeto(projeto: NovoProjeto): Promise<Projeto> {
    const projetos = await listarProjetos();
    const idsNumericos = projetos
        .map((p) => Number(p.id))
        .filter((n) => !Number.isNaN(n));
    const proximoId = idsNumericos.length > 0 ? String(Math.max(...idsNumericos) + 1) : "1";

    return requisitar<Projeto>("/projetos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: proximoId, ...projeto }),
    });
}

export function atualizarProjeto(
    id: string,
    projeto: AtualizarProjeto,
): Promise<Projeto> {
    return requisitar<Projeto>(`/projetos/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projeto),
    });
}



export function listarTarefas(): Promise<Tarefa[]> {
    return requisitar<Tarefa[]>("/tarefas");
}

export function buscarTarefa(id: string): Promise<Tarefa> {
    return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`);
}

export function excluirTarefa(id: string): Promise<void> {
    return requisitar<void>(`/tarefas/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
