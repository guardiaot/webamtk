import { Calendar, Sun, CloudSun, Moon, PartyPopper, Heart, Gift, Trees } from "lucide-react";

export default function GreetingBanner() {
    const now = new Date();

    const hour = now.getHours();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const events = [
        {
            month: 1,
            day: 1,
            title: "🎉 Feliz Ano Novo!",
            message: "Que seu dia seja repleto de conquistas e boas energias.",
            icon: PartyPopper,
            color: "bg-green-500",
        },
        {
            month: 2,
            day: 14,
            title: "❤️ Feliz Dia dos Namorados (Internacional)!",
            message: "Espalhe carinho por onde passar.",
            icon: Heart,
            color: "bg-pink-500",
        },
        {
            month: 4,
            day: 21,
            title: "🇧🇷 Tiradentes",
            message: "Um ótimo feriado para você!",
            icon: Calendar,
            color: "bg-blue-500",
        },
        {
            month: 12,
            day: 25,
            title: "🎄 Feliz Natal!",
            message: "Que a paz e a alegria estejam presentes em seu lar.",
            icon: Trees,
            color: "bg-red-500",
        },
        {
            month: 12,
            day: 31,
            title: "🥂 Último dia do ano!",
            message: "Hora de celebrar tudo que foi conquistado.",
            icon: PartyPopper,
            color: "bg-indigo-500",
        },
    ];

    const event = events.find((e) => e.month === month && e.day === day);

    let greeting = {};
    let Icon = Sun;

    if (!event) {
        if (hour < 12) {
            greeting = {
                title: "☀️ Bom dia!",
                message: "Comece o dia com um café e muita disposição!",
                color: "bg-yellow-500",
            };
            Icon = Sun;
        } else if (hour < 18) {
            greeting = {
                title: "🌤️ Boa tarde!",
                message: "Que sua tarde seja produtiva e cheia de boas notícias.",
                color: "bg-orange-500",
            };
            Icon = CloudSun;
        } else {
            greeting = {
                title: "🌙 Boa noite!",
                message: "Hora de finalizar o dia com chave de ouro.",
                color: "bg-slate-700",
            };
            Icon = Moon;
        }
    }

    const data = event || greeting;
    const ComponentIcon = event ? event.icon : Icon;

    return (
        <div
            className={`  p-1 flex items-center gap-4`}
        >
            <div className="bg-white/20 rounded-full p-3">
                <ComponentIcon size={34} />
            </div>

            <div>
                <h2 className="text-xl font-bold mb-0">{data.title}</h2>
                <p className="p-1 mb-0">{data.message}</p>
            </div>
        </div>
    );
}