document.addEventListener('DOMContentLoaded', () => {
    const btnVagas = document.getElementById('btnVagas');
    const btnVeiculos = document.getElementById('btnVeiculos');
    const btnConsulta = document.getElementById('btnConsulta');

    const cadastroVagas = document.getElementById('cadastroVagas');
    const cadastroVeiculos = document.getElementById('cadastroVeiculos');
    const consultaVagas = document.getElementById('consultaVagas');

    function toggleSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    btnVagas.addEventListener('click', () => toggleSection(cadastroVagas));
    btnVeiculos.addEventListener('click', () => toggleSection(cadastroVeiculos));
    btnConsulta.addEventListener('click', () => toggleSection(consultaVagas));

    const blocos = ['A', 'B'];
    const apartamentos = ['101', '102', '103', '201', '202', '203'];
    const vagas = Array.from({ length: 6 }, (_, i) => (i + 1).toString());

    function preencherSelects(){
        const placaSelect = document.getElementById('placaVaga');
        const numeroAptoSelect = document.getElementById('numeroApto');
        const blocoAptoSelect = document.getElementById('blocoApto');
        const numeroVagaSelect = document.getElementById('numeroVaga');
    
        // Limpa o select antes de adicionar novas opções
        placaSelect.innerHTML = ''; 
        numeroAptoSelect.innerHTML = '';
        blocoAptoSelect.innerHTML = '';
        numeroVagaSelect.innerHTML = '';

        // Adiciona a opção padrão ao select de placas
        const optionPlaceholderPlaca = document.createElement('option');
        optionPlaceholderPlaca.value = '';
        optionPlaceholderPlaca.textContent = 'Selecione a placa';
        placaSelect.appendChild(optionPlaceholderPlaca);

        // Adiciona a opção padrão ao select de Blocos
        const optionPlaceholderBloco = document.createElement('option');
        optionPlaceholderBloco.value = '';
        optionPlaceholderBloco.textContent = 'Selecione o bloco';
        blocoAptoSelect.appendChild(optionPlaceholderBloco);

        // Adiciona a opção padrão ao select de apartamento
        const optionPlaceholderNumero = document.createElement('option');
        optionPlaceholderNumero.value = '';
        optionPlaceholderNumero.textContent = 'Selecione o apartamento';
        numeroAptoSelect.appendChild(optionPlaceholderNumero);

        // Adiciona a opção padrão ao select de vagas
        const optionPlaceholderVagas = document.createElement('option');
        optionPlaceholderVagas.value = '';
        optionPlaceholderVagas.textContent = 'Selecione a vaga';
        numeroVagaSelect.appendChild(optionPlaceholderVagas);
        
        // Preencher o select de placas
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        veiculos.forEach(veiculo =>{
            const option = document.createElement('option');
            option.value = veiculo.placa;
            option.textContent = veiculo.placa;
            placaSelect.appendChild(option);
        });

        // Preencher o select de apartamentos
        apartamentos.forEach(apto => {
            const option = document.createElement('option');
            option.value = apto;
            option.textContent = apto;
            numeroAptoSelect.appendChild(option);
        });

        // Preencher o select de blocos
        blocos.forEach(bloco => {
            const option = document.createElement('option');
            option.value = bloco;
            option.textContent = bloco;
            blocoAptoSelect.appendChild(option);
        });

        // Preencher o select de vagas
        vagas.forEach(vaga => {
            const option = document.createElement('option');
            option.value = vaga;
            option.textContent = vaga;
            numeroVagaSelect.appendChild(option);
        });
    }

    function salvarVaga(vaga) {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const index = vagas.findIndex(v => v.numeroVaga === vaga.numeroVaga);
        if (index !== -1) {
            vagas[index] = vaga;
        } else {
            vagas.push(vaga);
        }
        localStorage.setItem('vagas', JSON.stringify(vagas));
        listarVagasDisponiveis();
        listarVagasCadastradas(); // Chamada para atualizar a lista de vagas
    }

    function salvarVeiculo(veiculo) {
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        veiculos.push(veiculo);
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        listarVeiculos(); // Lista todos os veiculos
        preencherSelects(); // Atualiza o select de placas
    }

    window.removerVaga = function(index) {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        vagas.splice(index, 1);
        localStorage.setItem('vagas', JSON.stringify(vagas));
        listarVagasDisponiveis();
        listarVagasCadastradas(); // Atualiza a lista após remoção
        alert('Vaga removida com sucesso!');
    };

    window.removerVeiculo = function(index) {
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        veiculos.splice(index, 1);
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        listarVeiculos(); // Lista todos os veiculos
        preencherSelects(); // Atualiza o select de placas
        alert('Veículo removido com sucesso!');
    };

    const formVaga = document.getElementById('formVaga');
    formVaga.addEventListener('submit', (e) => {
        e.preventDefault();
        const vaga = {
            placa: document.getElementById('placaVaga').value,
            numeroApto: document.getElementById('numeroApto').value,
            blocoApto: document.getElementById('blocoApto').value,
            numeroVaga: document.getElementById('numeroVaga').value,
            disponivel: false
        };
        salvarVaga(vaga);
        formVaga.reset();
        listarVagasDisponiveis(); // Atualiza a lista de vagas disponíveis
    });

    const formVeiculo = document.getElementById('formVeiculo');
    formVeiculo.addEventListener('submit', (e) => {
        e.preventDefault();
        const veiculo = {
            placa: document.getElementById('placaVeiculo').value,
            nomeProprietario: document.getElementById('nomeProprietario').value,
            modeloVeiculo: document.getElementById('modeloVeiculo').value,
            corVeiculo: document.getElementById('corVeiculo').value
        };
        salvarVeiculo(veiculo);
        formVeiculo.reset(); // Limpa o formulário após o envio
    });

    function listarVagasDisponiveis() {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const vagasDisponiveis = document.getElementById('vagasDisponiveis');
        vagasDisponiveis.innerHTML = '';

        // Garante que haja pelo menos 6 vagas
        for (let i = 1; i <= 6; i++) {
            const vagaIndex = vagas.findIndex(v => v.numeroVaga === i.toString());
            if (vagaIndex === -1) {
                // Vaga disponível
                vagasDisponiveis.innerHTML += `
                    <div class="vaga disponivel">
                        Vaga ${i} - Disponível
                        <button onclick="cadastrarVaga(${i}) required">Cadastrar Vaga</button>
                    </div>`;
            } else {
                // Vaga ocupada
                const vaga = vagas[vagaIndex];
                vagasDisponiveis.innerHTML += `
                <div class="vaga ocupada">
                    Vaga ${vaga.numeroVaga} - Ocupada (${vaga.placa})
                    <button onclick="removerVaga(${vagaIndex})">Remover</button>
                    <button onclick="editarVaga(${vagaIndex})">Editar</button>
                </div>`;
            }
        }
    }

    function listarVeiculos() {
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        const listaVeiculos = document.getElementById('listaVeiculos');
        listaVeiculos.innerHTML = '';
        veiculos.forEach((veiculo, index) => {
            listaVeiculos.innerHTML += `
                <div class="veiculo">
                    ${veiculo.placa} - ${veiculo.nomeProprietario} (${veiculo.modeloVeiculo}/${veiculo.corVeiculo})
                    <button onclick="removerVeiculo(${index})">Remover</button>
                    <button onclick="editarVeiculo(${index})">Editar</button>
                </div>`;
        });
    }

    window.removerVaga = function(index) {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        vagas.splice(index, 1);
        localStorage.setItem('vagas', JSON.stringify(vagas));
        listarVagasCadastradas();
        listarVagasDisponiveis();
    };

    window.removerVeiculo = function(index) {
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        veiculos.splice(index, 1);
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        listarVeiculos();
    };

    // Listar vagas disponíveis
    function listarVagasDisponiveis() {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const vagasDisponiveis = document.getElementById('vagasDisponiveis');
        vagasDisponiveis.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const vagaIndex = vagas.findIndex(v => v.numeroVaga === i.toString());
            if (vagaIndex === -1) {
                vagasDisponiveis.innerHTML += `
                    <div class="vaga disponivel">
                        Vaga ${i} - Disponível
                        <button onclick="cadastrarVaga(${i})">Cadastrar Vaga</button>
                    </div>`;
            } else {
                const vaga = vagas[vagaIndex];
                vagasDisponiveis.innerHTML += `
                <div class="vaga ocupada">
                Vaga ${vaga.numeroVaga} - Ocupada (Placa: ${vaga.placa} | Bloco: ${vaga.blocoApto} | Apartamento: ${vaga.numeroApto})
                <button onclick="removerVaga(${vagaIndex})">Remover</button>
                <button onclick="editarVaga(${vagaIndex})">Editar</button>
            </div>`;
            }
        }
    }

    // Nova função para cadastrar a vaga
    window.cadastrarVaga = function(numeroVaga) {
        const placa = document.getElementById('placaVaga').value;
        const numeroApto = document.getElementById('numeroApto').value;
        const blocoApto = document.getElementById('blocoApto').value;

        // Verifica se todos os campos estão preenchidos
        if (!placa || !numeroApto || !blocoApto) {
            alert('Por favor, selecione todos os campos antes de cadastrar a vaga.');
            return;
        }

        // Verifica se a placa já está cadastrada em outra vaga
        const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const vagaExistente = vagas.find(v => v.placa === placa && !v.disponivel);

        if (vagaExistente) {
            alert('Este veículo já está cadastrado em outra vaga.');
            return;
        }

        const vaga = {
            numeroVaga: numeroVaga.toString(),
            placa: placa,
            numeroApto: numeroApto,
            blocoApto: blocoApto,
            disponivel: false
        };
        
        salvarVaga(vaga);
    };

    // Função para editar a vaga
    window.editarVaga = function(index) {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const vaga = vagas[index];

        document.getElementById('placaVaga').value = vaga.placa;
        document.getElementById('numeroApto').value = vaga.numeroApto;
        document.getElementById('blocoApto').value = vaga.blocoApto;
        document.getElementById('numeroVaga').value = vaga.numeroVaga;
        
        // Remover a vaga atual para evitar duplicados
        removerVaga(index);
        listarVagasDisponiveis();
        listarVagasCadastradas(); // Atualiza a lista após edição
    };

    // Função para editar o veículo
    window.editarVeiculo = function(index) {
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        const veiculo = veiculos[index];
        document.getElementById('placaVeiculo').value = veiculo.placa;
        document.getElementById('nomeProprietario').value = veiculo.nomeProprietario;
        document.getElementById('modeloVeiculo').value = veiculo.modeloVeiculo;
        document.getElementById('corVeiculo').value = veiculo.corVeiculo;

        // Remover o veículo atual para evitar duplicados
        removerVeiculo(index);
        preencherSelects(); // Atualiza o select de placas após a edição
    };

    // Função para mostrar as vagas na tela de cadastro
    function listarVagasCadastradas() {
        let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const listaVagas = document.getElementById('listaVagas');
        listaVagas.innerHTML = '';
    
        vagas.forEach((vaga, index) => {
            listaVagas.innerHTML += `
                <div class="vaga">
                    Vaga ${vaga.numeroVaga} - Ocupada (Placa: ${vaga.placa} | Bloco: ${vaga.blocoApto} | Apartamento: ${vaga.numeroApto})
                    <button onclick="editarVaga(${index})">Editar</button>
                    <button onclick="removerVaga(${index})">Remover</button>
                </div>`;
        });
    }

    // Lista inicial de vagas e veículos
    preencherSelects();
    listarVagasDisponiveis();
    listarVagasCadastradas();
    listarVeiculos();
});