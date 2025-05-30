// Tente as duas URLs para evitar problemas de CORS/local
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/receitas'
  : '/receitas';

document.getElementById('form-receita').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const dados = {
        titulo: form.titulo.value,
        categoria: form.categoria.value,
        imagem: form.imagem.value,
        tempoPreparo: form.tempoPreparo.value,
        porcoes: form.porcoes.value,
        dificuldade: form.dificuldade.value,
        ingredientes: form.ingredientes.value.split('\n').map(i => i.trim()).filter(i => i),
        modoPreparo: form.modoPreparo.value.split('\n').map(m => m.trim()).filter(m => m),
        origem: form.origem.value
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error('Erro ao cadastrar receita');
        document.getElementById('mensagem').innerHTML = '<span style="color:green">Receita cadastrada com sucesso!</span>';
        form.reset();
    } catch (error) {
        document.getElementById('mensagem').innerHTML = '<span style="color:red">' + error.message + '</span>';
    }
});
