import { useEffect, useState } from "react";

const messages = [
    "Hoje é uma ótima oportunidade para transformar pequenas ações em grandes resultados.",
    "Cada tarefa concluída é um passo a mais rumo ao sucesso. Continue!",
    "Um café, uma boa ideia e um pouco de dedicação podem mudar o seu dia.",
    "Não esqueça de sorrir. Um bom humor também faz parte da produtividade.",
    "As melhores soluções costumam surgir quando você menos espera. Confie no seu talento.",
    "Foque em uma tarefa de cada vez. O progresso acontece aos poucos.",
    "Todo dia é uma nova chance de aprender algo diferente.",
    "Você já superou desafios antes. Este também será apenas mais um.",
    "Grandes conquistas começam com pequenas decisões.",
    "O importante não é ser perfeito, é continuar evoluindo.",
    "Que seu dia seja leve, produtivo e cheio de boas surpresas.",
    "Pessoas incríveis constroem equipes incríveis. Faça a diferença hoje.",
    "Cada linha de código bem escrita é um investimento no futuro.",
    "Lembre-se de fazer uma pausa quando precisar. Descansar também faz parte do trabalho.",
    "O sucesso é a soma de pequenos esforços repetidos todos os dias.",
    "Que hoje não faltem boas notícias e motivos para comemorar.",
    "Você está mais perto dos seus objetivos do que imagina.",
    "Aprender algo novo hoje pode facilitar muito o amanhã.",
    "Espalhe gentileza. Ela sempre encontra o caminho de volta.",
    "Respire fundo, organize as ideias e faça acontecer!"
];

function randomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

export default function MotivationMessage() {
    const [message, setMessage] = useState(randomMessage());

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(randomMessage());
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <p className="text-[16px] h-[35px] text-gray-500 text-start transition-all duration-500">
            {message}
        </p>
    );
}