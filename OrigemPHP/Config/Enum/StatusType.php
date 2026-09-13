<?php

namespace OrigemPHP\Config\Enum;



class StatusType
{
    const HABILITADO   = "1";
    const APROVADO     = "2";
    const RECUSADO     = "0";
    const ANALISE      = "3";
    const PENDENTESEG  = "7";

    const ERRO1001 = "Erro na seguradora. (já estamos atuando junto a seguradora para que possamos devolver o status dessa consulta o mais rápido possível)";
    const ERRO1000 = "Erro na seguradora. (já estamos atuando junto a seguradora para que possamos devolver o status dessa consulta o mais rapido possivel)";
    const ERRO3    = "Essa cotação está em processo de análise. O status dessa consulta será atualizado dentro de até 48hs.";
    const MSGAPROVADO = "Parabéns, sua cotação está aprovada! Selecione o produto desejado para interagir e avançar.";
    const FALHASERVE  = "Falha na conexão com a seguradora";
    const FALHAAUTH   = "Falha na autenticação da seguradora.";

    /* =========================
     * Retorna todos os valores
     * ========================= */
    public static function all()
    {
        return [
            self::HABILITADO,
            self::APROVADO,
            self::RECUSADO,
            self::ANALISE,
            self::PENDENTESEG,
            self::ERRO1001,
            self::ERRO1000,
            self::ERRO3,
            self::MSGAPROVADO,
            self::FALHASERVE,
            self::FALHAAUTH,
        ];
    }

    /* =========================
     * Valida se existe
     * ========================= */
    public static function isValid($value)
    {
        return in_array($value, self::all(), true);
    }
}