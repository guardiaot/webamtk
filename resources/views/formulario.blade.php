@extends('layout.page')

<title>Home</title>

@section('content')


    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Pré-atendimento Jurídico</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="{{ OrigemPHP\Config\Helpers::getUrl() }}img/icone.png" type="image/x-icon" />
    </head>

    <body class="bg-gray-100 text-gray-800">

        <div class="max-w-3xl mx-auto py-10 px-4">

            <div
                class="bg-blue-100 text-blue-900 rounded-xl px-6 py-4 shadow-md mb-8 flex items-center justify-center gap-3">
                <!-- Ícone de balança (ícone jurídico) -->
                <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 3v2m0 0c-3 0-5.5 2.5-5.5 5.5S9 16 12 16s5.5-2.5 5.5-5.5S15 5 12 5zm0 0v14m6 0H6" />
                </svg>
                <h2 class="text-xl font-bold">Pré-atendimento Jurídico com IA</h2>
            </div>


            <form id="formAtendimento" class="bg-white shadow-lg rounded-2xl p-6 space-y-6">

                <!-- Tipo de Problema -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Tipo de problema jurídico</label>
                    <select name="tipo_acao"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" required="">
                        <option value="">Selecione</option>
                        @foreach ($tiposServicos as $serverValue)
                            <option value="{{ $serverValue->id }}">{{ $serverValue->nome }}</option>)
                        
                        @endforeach
                        <option value="0">Outros</option>
                    </select>
                </div>

                <!-- Descrição do Caso -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Descreva o caso com o máximo de detalhes</label>
                    <textarea name="descricao" rows="6"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Explique o que ocorreu, datas, partes envolvidas..." required=""></textarea>
                </div>

                <!-- Partes Envolvidas -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Quem está envolvido no caso?</label>
                    <input type="text" name="partes"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: empresa tal, vizinho, ex-cônjuge, etc." required="">
                </div>

                <!-- Já possui processo? -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Já existe processo em andamento?</label>
                    <select name="processo_existente"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione</option>
                        <option>Sim</option>
                        <option>Não</option>
                    </select>
                </div>

                <!-- Objetivo do Cliente -->
                <div>
                    <label class="block text-sm font-semibold mb-2">O que você espera com esse atendimento?</label>
                    <textarea name="objetivo" rows="4"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Receber uma indenização, conseguir guarda dos filhos, etc." required=""></textarea>
                </div>



                <!-- advogado -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Advogado</label>
                    <select name="advogado"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" required="">
                        <option value="0">Sem Preferência</option>
                        @foreach ($usuarios as $advogados)
                            <option value="{{ $advogados->id }}">{{ $advogados->nome }}</option>
                        @endforeach
                    </select>
                </div>




                <!-- Informações do Cliente -->
                <div class="space-y-4">
                    <div class="flex flex-wrap gap-4">
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-sm font-semibold mb-2">CPF / CNPJ</label>
                            <input onblur="buscarCliente()" type="text" name="cpf" id="cpf"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                placeholder="000.000.000-00" required>
                        </div>

                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-sm font-semibold mb-2">Telefone</label>
                            <input type="text" name="telefone" id="telefone" maxlength="15"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                placeholder="(00) 00000-0000" required>
                        </div>

                    </div>

                    <div>
                        <label class="block text-sm font-semibold mb-2">Nome completo</label>
                        <input type="text" name="nome" id="nome"
                            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome completo do cliente" required>
                    </div>



                </div>


                <!-- Botão Enviar -->
                <div class="text-center">
                    <button id="btn_salvar" type="submit"
                        class="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition">
                        Enviar
                    </button>
                </div>
            </form>
        </div>

    </body>

    </html>


    <script src="{{ OrigemPHP\Config\Helpers::getUrl() }}painel/js/jquery-1.11.1.min.js"></script>
    <!-- SweetAlert JS -->
    <script src="{{ OrigemPHP\Config\Helpers::getUrl() }}painel/js/sweetalert2.all.min.js"></script>
    <script src="{{ OrigemPHP\Config\Helpers::getUrl() }}painel/js/sweetalert1.min.css"></script>
    <script src="{{ OrigemPHP\Config\Helpers::getUrl() }}painel/js/alertas.js"></script>


    <script>
        // variável global JS (fica disponível em qualquer script)
        var url_sistema = "{{ OrigemPHP\Config\Helpers::getUrl() }}";
    </script>


    <script>
        const cpfInput = document.getElementById('cpf');

        cpfInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');

            if (value.length <= 11) {
                // Máscara para CPF: 000.000.000-00
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                // Máscara para CNPJ: 00.000.000/0000-00
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
            }

            this.value = value;
        });



        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            this.value = value;
        });
    </script>


    <script type="text/javascript">
        function buscarCliente() {
            var cpf = $("#cpf").val();
            $.ajax({
                url: url_sistema + 'ajax/buscar_cliente.php',
                method: 'POST',
                data: { cpf },
                dataType: "html",

                success: function (result) {
                    if (result != "") {
                        var split = result.split("*");
                        var nome = split[0];
                        var telefone = split[1];
                        $("#nome").val(nome);
                        $("#telefone").val(telefone);
                    }
                }
            });
        }





        $("#formAtendimento").submit(function () {

            event.preventDefault();
            alertCarregando("Inserindo...")
            var formData = new FormData(this);
            $('#btn_salvar').hide();
            $.ajax({
                url: url_sistema + 'ajax/salvar_caso.php',
                type: 'POST',
                data: formData,

                success: function (mensagem) {
                    if (mensagem.trim() == "Salvo com Sucesso") {
                        alertsucesso(mensagem);
                        $("#formAtendimento")[0].reset();
                        location.reload();
                    } else {
                        alertInformativo(mensagem)
                    }

                    $('#btn_salvar').show();

                },

                cache: false,
                contentType: false,
                processData: false,

            });

        });

    </script>

@endsection