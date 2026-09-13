<?php

namespace OrigemPHP\Config\Enum;

class Temperatura
{
    const FRIO   = 'frio';
    const MORNO  = 'morno';
    const QUENTE = 'quente';

    public static function all()
    {
        return [
            self::FRIO,
            self::MORNO,
            self::QUENTE
        ];
    }

    public static function isValid($value)
    {
        return in_array($value, self::all(), true);
    }
}