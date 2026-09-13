    //Auto Close Timer
    function sucesso(){
        $('body').removeClass('timer-alert');
        Swal.fire({
            title: 'Salvo com Sucesso!',
            text: 'Fecharei em 1 segundo.',
            icon: "success",
            timer: 1000,
            customClass: {
            container: 'swal-whatsapp-container'
        }
        })?.then(
            function () {
            },
            // lidando com a rejeição da promessa
            function (dismiss) {
                if (dismiss === 'timer') {
                    console.log('Eu estava fechado pelo cronômetro')
                }
            }
        )
    }


        //Auto Close Timer
    function excluido(){
        $('body').removeClass('timer-alert');
        Swal.fire({
            title: 'Excluido com Sucesso!',
            text: 'Fecharei em 1 segundo.',
            icon: "success",
            timer: 1000,
            customClass: {
            container: 'swal-whatsapp-container'
        }
        })?.then(
            function () {
            },
            // lidando com a rejeição da promessa
            function (dismiss) {
                if (dismiss === 'timer') {
                    console.log('Eu estava fechado pelo cronômetro')
                }
            }
        )
    }
    



        //Auto Close Timer
    function alertcobrar(){
        $('body').removeClass('timer-alert');
        Swal.fire({
            title: 'Cobrança Efetuada!',
            text: 'Fecharei em 1 segundo.',
            icon: "success",
            timer: 1000,
            customClass: {
            container: 'swal-whatsapp-container'
        }
        })?.then(
            function () {
            },
            // lidando com a rejeição da promessa
            function (dismiss) {
                if (dismiss === 'timer') {
                    console.log('Eu estava fechado pelo cronômetro')
                }
            }
        )
    }



function baixado() {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: 'Baixa Efeturada com Sucesso!',
        text: 'Fecharei em 1 segundo.',
        icon: "success",
        timer: 2000,
        customClass: {
            container: 'swal-whatsapp-container'
        }
    })?.then(
        function () {
        },
        // lidando com a rejeição da promessa
        function (dismiss) {
            if (dismiss === 'timer') {
                console.log('Eu estava fechado pelo cronômetro')
            }
        }
    )
}


function alertWarning(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: 'Informação',
        text: mensagem,
        icon: "warning",
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}


// ALERT EXCLUIR #######################################
function excluirAlert(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success", // Adiciona margem à direita do botão "Sim, Excluir!"
            cancelButton: "btn btn-danger me-1",
            container: 'swal-whatsapp-container'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Deseja Excluir?",
        text: "Você não conseguirá recuperá-lo novamente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, Excluir!",
        cancelButtonText: "Não, Cancelar!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Realiza a requisição AJAX para excluir o item
            $.ajax({
                url: 'paginas/' + pag + "/excluir.php",
                method: 'POST',
                data: { id },
                dataType: "html",
                success: function (mensagem) {
                    if (mensagem.trim() == "Excluído com Sucesso") {
                        // Exibe mensagem de sucesso após a exclusão
                        swalWithBootstrapButtons.fire({
                            title: mensagem,
                            text: 'Fecharei em 1 segundo.',
                            icon: "success",
                            timer: 1000,
                            timerProgressBar: true,
                            confirmButtonText: 'OK',
                            customClass: {
                             container: 'swal-whatsapp-container'
                             }
                        });
                        listar();
                        limparCampos()
                    } else {
                        // Exibe mensagem de erro se a requisição falhar
                        swalWithBootstrapButtons.fire({
                            title: "Opss!",
                            text: mensagem,
                            icon: "error",
                            confirmButtonText: 'OK',
                            customClass: {
                             container: 'swal-whatsapp-container'
                             }
                        });
                    }
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "Fecharei em 1 segundo.",
                icon: "error",
                timer: 1000,
                timerProgressBar: true,
            });
        }
    });
}






// ALERT SALVAR FINAL ##############
function alertsucesso(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: mensagem,
        text: 'Fecharei em 1 segundo.',
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}

function alertCobrar(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: mensagem,
        icon: "success",
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}

//ALERTA MENSAGEM EXCLUIDO ###################
function alertexcluido(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: mensagem,
        text: 'Fecharei em 1 segundo.',
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}



// ALERT ERRO ##############
function alertErro(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: 'Opss...',
        text: mensagem,
        icon: "error",
        confirmButtonText: 'OK',
        customClass: {
            container: 'swal-whatsapp-container'
        },
        // Adicione a opção `target` se necessário
        target: document.body // ou um seletor específico se necessário
    });
}


//############### MÁSCRAS MOEDAS #########################################
function mascaraMoeda(elemento) {
    let value = elemento.value;
    // Remove todos os caracteres que não são números
    value = value.replace(/\D/g, '');
    // Converte o valor para um número decimal com duas casas
    value = (value / 100).toFixed(2);
    // Substitui ponto por vírgula
    value = value.replace('.', ',');
    // Adiciona separadores de milhar
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Atualiza o valor do input sem o prefixo "R$"
    elemento.value = value;
}

// FUNÇÃO PARA FORMATAR VALOR PARA REAL
function formatarParaReal(valor) {
    return valor.toLocaleString({
        style: 'currency',
        currency: 'BRL'
    });
}


//FUNÇÃO PARA MOEDA
function formatarMoeda(input) {
    // Remove caracteres que não são dígitos
    let valor = input.value.replace(/\D/g, '');

    // Formata como moeda
    valor = (valor / 100).toFixed(2).replace('.', ',');

    // Adiciona o prefixo de moeda
    input.value = valor;
}




// FUNÇÃO PARA VERIFICAR TELEFONE
function verificarTelefone(tel, valor) {
    if (valor.length > 14) {
        $('#' + tel).mask('(00) 00000-0000');
    } else if (valor.length == 14) {
        $('#' + tel).mask('(00) 0000-00000');
    } else {
        $('#' + tel).mask('(00) 0000-0000');

    }

    document.getElementById(tel).setSelectionRange(100, 100);
}


// ALERT SALVAR FINAL ##############
function alertInformativo(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: mensagem,
        text: 'Fecharei em 3 segundo.',
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}


function alertWarning(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: 'Informação',
        text: mensagem,
        icon: "warning",
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}



function alertCarregando(mensagem) {
    $('body').removeClass('timer-alert');
    Swal.fire({
        title: mensagem,
        text: 'Fecharei em 1 segundo.',
        icon: "info",
        timer: 5000,
        timerProgressBar: true,
        confirmButtonText: 'OK',
         customClass: {
            container: 'swal-whatsapp-container'
        }
    })
}