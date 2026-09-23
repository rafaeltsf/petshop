const API_URL = 'http://localhost:3000';

const form = document.getElementById('cadastro-vet');
const nomeInput = document.getElementById('nome');
const cfmvInput = document.getElementById('cfmv');
const especialidadeInput = document.getElementById('especialidade');
const btnSalvar = document.getElementById('btn-salvar');
const alertBox = document.getElementById('alertBox');

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

function esconderErro() {
  alertBox.classList.add('d-none');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  esconderErro();

  const nome = nomeInput.value.trim();
  const cfmv = cfmvInput.value.trim();
  const especialidade = especialidadeInput.value.trim();

  if (!nome || !cfmv || !especialidade) {
    mostrarErro('Por favor, preencha todos os campos.');
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const response = await fetch(`${API_URL}/api/veterinarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, cfmv, especialidade }),
    });

    const data = await response.json();

    if (response.ok) {
      mostrarSucesso('Veterinário cadastrado com sucesso!');
      form.reset();
    } else {
      mostrarErro(data.message || 'Não foi possível cadastrar o veterinário.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    mostrarErro('Não foi possível conectar ao servidor.');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
  }
});