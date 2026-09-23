const form = document.getElementById('form-pet');
const alerta = document.getElementById('alerta');

function mostrarAlerta(mensagem, tipo = 'danger') {
  alerta.textContent = mensagem;
  alerta.className = `alert alert-${tipo}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) {
    mostrarAlerta('Você precisa estar logado para cadastrar um pet.');
    return;
  }

  const pet = {
    nome: document.getElementById('nome').value.trim(),
    especie: document.getElementById('especie').value,
    raca: document.getElementById('raca').value.trim() || null,
    dataNascimento: document.getElementById('dataNascimento').value || null,
    peso: document.getElementById('peso').value ? parseFloat(document.getElementById('peso').value) : null,
    sexo: document.getElementById('sexo').value || null,
    observacoes: document.getElementById('observacoes').value.trim() || null,
    usuarioId: usuarioLogado.id
  };

  try {
    const response = await fetch('http://localhost:3000/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet)
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw new Error(erro.message || 'Não foi possível cadastrar o pet.');
    }

    mostrarAlerta('Pet cadastrado com sucesso!', 'success');
    form.reset();
    form.classList.remove('was-validated');
  } catch (err) {
    mostrarAlerta(err.message);
  }
});