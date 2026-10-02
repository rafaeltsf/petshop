const API_URL = 'http://localhost:3000';

const form = document.getElementById('form-pet');
const nomeInput = document.getElementById('nome');
const especieInput = document.getElementById('especie');
const racaInput = document.getElementById('raca');
const dataNascimentoInput = document.getElementById('dataNascimento');
const pesoInput = document.getElementById('peso');
const sexoInput = document.getElementById('sexo');
const observacoesInput = document.getElementById('observacoes');
const btnSalvar = form.querySelector('button[type="submit"]');
const alertBox = document.getElementById('alerta');

function mostrarErro(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none', 'alert-success');
  alertBox.classList.add('alert-danger');
}

function mostrarSucesso(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none', 'alert-danger');
  alertBox.classList.add('alert-success');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const pet = {
    nome: nomeInput.value.trim(),
    especie: especieInput.value,
    raca: racaInput.value.trim() || null,
    dataNascimento: dataNascimentoInput.value || null,
    peso: pesoInput.value || null,
    sexo: sexoInput.value || null,
    observacoes: observacoesInput.value.trim() || null,
  };

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const response = await fetch(`${API_URL}/api/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });

    const data = await response.json();

    if (response.ok) {
      mostrarSucesso('Pet cadastrado com sucesso!');
      form.reset();
      form.classList.remove('was-validated');
    } else {
      mostrarErro(data.message || 'Não foi possível cadastrar o pet.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    mostrarErro('Não foi possível conectar ao servidor.');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Cadastrar pet';
  }
});