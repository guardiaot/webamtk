const fields = [

    {
        name: "nome",
        label: "Nome",
        type: "text",
        col: 6,
        required: true,
        upper: true,
        maxLength: 100
    },

    {
        name: "email",
        label: "Email",
        type: "email",
        col: 6,
        placeholder: "email@empresa.com.br"
    },

    {
        name: "telefone",
        label: "Telefone",
        type: "telefone",
        col: 3
    },

    {
        name: "cpf_cnpj",
        label: "CPF/CNPJ",
        type: "cpfcnpj",
        col: 4
    },

    {
        name: "tipo_pessoa",
        label: "Tipo",
        type: "select",
        col: 3,
        options: [
            { value: "C", label: "Cliente" },
            { value: "I", label: "Imobiliária" }
        ]
    },

    {
        name: "observacao",
        label: "Observação",
        type: "textarea",
        rows: 5,
        col: 12
    }

];


# O componente passa a entender dezenas de propriedades
Propriedade         	Função
name	                Campo do banco
label	                Texto do label
type	                Tipo do componente
col	Largura             Bootstrap
required	            Obrigatório
disabled	            Desabilita
readOnly	            Somente leitura
hidden	                Oculta
placeholder	            Placeholder
default	                Valor padrão
upper	                Converte maiúsculo
lower	                Converte minúsculo
trim	                Remove espaços
maxLength	            maxLength
minLength	            minLength
min	                    Número mínimo
max	                    Número máximo
step	                Step number
rows	                Textarea
options	                Select
mask	                Máscara
onBlur	                Evento
onChange	            Evento
icon	                Ícone
help	                Texto de ajuda
autoFocus	            Auto foco
className	            Classe do input
colClass	            Classe da coluna

## utilização

<Origem_Form
    fields={fields}
    data={data}
    setData={setData}
    errors={errors}
/>