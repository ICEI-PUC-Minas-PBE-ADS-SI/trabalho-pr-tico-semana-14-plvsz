const API_URL = 'http://localhost:3000';

function criarCardReceita(receita) {
    return `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <h2 class="text-center">${receita.titulo}</h2>
                <h3 class="text-center">Serve: ${receita.porcoes} • Tempo de preparo: ${receita.tempoPreparo} • Dificuldade: ${receita.dificuldade}</h3>
                <img src="${receita.imagem}" alt="${receita.titulo}" class="img-fluid rounded mb-4">
                <a href="detalhes.html?id=${receita.id}" class="btn btn-primary d-block mx-auto mt-3">Ver Receita Completa</a>
            </div>
        </div>
    `;
}

async function carregarTodasReceitas() {
    try {
        const response = await fetch(`${API_URL}/receitas`);
        if (!response.ok) throw new Error('Erro ao carregar receitas');
        
        const receitas = await response.json();
        console.log('Receitas carregadas:', receitas);
        return receitas;
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        return [];
    }
}

async function carregarReceitasPorCategoria(categoria) {
    try {
        console.log('Carregando receitas da categoria:', categoria);
        const response = await fetch(`${API_URL}/receitas?categoria=${categoria}`);
        if (!response.ok) throw new Error('Erro ao carregar receitas');
        
        const receitas = await response.json();
        console.log('Receitas encontradas:', receitas);
        return receitas;
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        return [];
    }
}

async function carregarDetalhesReceita() {
    const urlParams = new URLSearchParams(window.location.search);
    const receitaId = urlParams.get('id');
    
    if (receitaId) {
        try {
            const response = await fetch(`${API_URL}/receitas/${receitaId}`);
            if (!response.ok) throw new Error('Receita não encontrada');
            
            const receita = await response.json();
            const detalhesContainer = document.getElementById('receita-detalhes');
            
            detalhesContainer.innerHTML = `
                <h1>${receita.titulo}</h1>
                <h3>Serve: ${receita.porcoes} • Tempo de preparo: ${receita.tempoPreparo} • Dificuldade: ${receita.dificuldade}</h3>
                <img src="${receita.imagem}" alt="${receita.titulo}" class="img-fluid rounded mb-4">
                
                <div class="mb-4">
                    <h2>Ingredientes</h2>
                    <ul class="list-unstyled">
                        ${receita.ingredientes.map(ingrediente => `
                            <li>
                                <input type="checkbox" id="ing${Math.random().toString(36).substr(2, 9)}">
                                <label>${ingrediente}</label>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="preparation-section">
                    <h2>Modo de preparo</h2>
                    <ol class="list-group list-group-numbered">
                        ${receita.modoPreparo.map(passo => `
                            <li class="list-group-item">${passo}</li>
                        `).join('')}
                    </ol>
                </div>
            `;
        } catch (error) {
            const detalhesContainer = document.getElementById('receita-detalhes');
            detalhesContainer.innerHTML = `<p class="alert alert-danger">Erro ao carregar a receita: ${error.message}</p>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página carregada, iniciando carregamento de receitas...');
    
    if (window.location.pathname.includes('detalhes.html')) {
        carregarDetalhesReceita();
    } else {
        try {
            // Primeiro, vamos carregar todas as receitas
            const todasReceitas = await carregarTodasReceitas();
            console.log('Total de receitas carregadas:', todasReceitas.length);

            // Depois, vamos processar cada seção
            const sections = document.querySelectorAll('section[id]');
            console.log('Seções encontradas:', sections.length);

            sections.forEach(async (section) => {
                const categoria = section.id;
                console.log('Processando categoria:', categoria);
                
                // Filtra as receitas pela categoria
                const receitasCategoria = todasReceitas.filter(receita => 
                    receita.categoria.toLowerCase() === categoria.toLowerCase()
                );
                
                console.log(`Receitas encontradas para ${categoria}:`, receitasCategoria.length);
                
                if (receitasCategoria.length > 0) {
                    const row = section.querySelector('.row');
                    if (row) {
                        row.innerHTML = receitasCategoria.map(receita => criarCardReceita(receita)).join('');
                    } else {
                        console.error(`Elemento .row não encontrado na seção ${categoria}`);
                    }
                } else {
                    console.log(`Nenhuma receita encontrada para a categoria ${categoria}`);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar as receitas:', error);
            // Adiciona uma mensagem de erro visível para o usuário
            const main = document.querySelector('main');
            if (main) {
                main.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Erro ao carregar as receitas. Por favor, verifique se o servidor está rodando.
                    </div>
                `;
            }
        }
    }
}); 