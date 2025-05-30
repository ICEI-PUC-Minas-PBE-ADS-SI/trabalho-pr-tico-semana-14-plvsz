const API_URL = 'http://localhost:3000';

async function carregarDetalhesReceita() {
    const urlParams = new URLSearchParams(window.location.search);
    const receitaId = urlParams.get('id');
    console.log('ID da receita:', receitaId);
    
    if (!receitaId) {
        mostrarErro('ID da receita não fornecido');
        return;
    }

    try {
        console.log('Fazendo requisição para:', `${API_URL}/receitas/${receitaId}`);
        const response = await fetch(`${API_URL}/receitas/${receitaId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const receita = await response.json();
        console.log('Dados da receita:', receita);
        
        const detalhesContainer = document.getElementById('receita-detalhes');
        if (!detalhesContainer) {
            throw new Error('Elemento receita-detalhes não encontrado!');
        }
        
        detalhesContainer.innerHTML = `
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h1 class="text-center mb-4">${receita.titulo}</h1>
                    <h3 class="text-center mb-4">Serve: ${receita.porcoes} • Tempo: ${receita.tempoPreparo} • Dificuldade: ${receita.dificuldade}</h3>
                    <img src="${receita.imagem}" alt="${receita.titulo}" class="img-fluid rounded mb-4">
                    
                    <div class="mb-4">
                        <h2>Ingredientes</h2>
                        <ul class="list-unstyled">
                            ${receita.ingredientes.map(ing => `
                                <li class="mb-2">
                                    <input type="checkbox" id="ing${Math.random().toString(36).substr(2, 9)}" class="me-2">
                                    <label>${ing}</label>
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
                </div>
            </div>
        `;
        console.log('HTML renderizado com sucesso');
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        mostrarErro(error.message);
    }
}

function mostrarErro(mensagem) {
    const detalhesContainer = document.getElementById('receita-detalhes');
    if (detalhesContainer) {
        detalhesContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p>${mensagem}</p>
                <hr>
                <p class="mb-0">
                    <a href="index.html" class="alert-link">Voltar para a página inicial</a>
                </p>
            </div>
        `;
    }
}

// Carregar os detalhes da receita quando a página carregar
document.addEventListener('DOMContentLoaded', carregarDetalhesReceita); 