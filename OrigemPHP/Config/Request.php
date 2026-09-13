<?php

namespace OrigemPHP\Config;

class Request
{

    private $router;
    private $httpMethod;
    private $uri;
    private $queryParams = [];
    private $postVars = [];
    private $putVars = [];
    private $headers = [];
    private $rawInput = '';



    public function __construct($router)
    {
        $this->router = $router;
        $this->queryParams = $_GET ?? [];
        $this->headers = function_exists('getallheaders')
            ? getallheaders()
            : [];

        $this->httpMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri = explode('?', $_SERVER['REQUEST_URI'] ?? '')[0];
        // Lê o php://input apenas uma vez
        $this->rawInput = file_get_contents('php://input');

        $this->setPostVars();
        $this->setPutVars();
    }
    public function setPutVars()
    {
        if (!in_array($this->httpMethod, ['PUT', 'PATCH'])) {
            return;
        }

        if (empty($this->rawInput)) {
            return;
        }

        $json = json_decode($this->rawInput, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            $this->putVars = $json;
        } else {
            parse_str($this->rawInput, $this->putVars);
        }
    }

    public function setPostVars()
    {
        if ($this->httpMethod !== 'POST') {
            return;
        }

        $this->postVars = $_POST ?? [];
        if (!empty($this->postVars)) {
            return;
        }

        if (!empty($this->rawInput)) {
            $json = json_decode($this->rawInput, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                $this->postVars = $json;
            }
        }
    }


    private function setUri()
    {
        $this->uri = $_SERVER['REQUEST_URI'] ?? '';
        $xuri = explode('?', $this->uri);
        $this->uri = $xuri[0];
    }

    public function getRouter()
    {
        return $this->router;
    }

    // retorna o Method da requisicao
    public function getHttpMethod()
    {
        return $this->httpMethod;
    }

    // retorna o url da requisicao
    public function getUri()
    {
        return $this->uri;
    }

    // retorna o headers da requisicao
    public function getHeaders()
    {
        return $this->headers;
    }

    // retorna o parametro da requisicao
    public function getQueryParams()
    {
        return $this->queryParams;
    }

    // retorna o post da requisição
    public function getPostVars()
    {
        return $this->postVars;
    }

    // retorna o post da requisição
    public function getPutVars()
    {
        return $this->putVars;
    }

    // retorna os query params com sanitização básica (removendo tags e caracteres de controle)
    public function getSanitizedQueryParams()
    {
        return $this->sanitizeArray($this->queryParams);
    }

    // retorna os post vars com sanitização básica (removendo tags e caracteres de controle)
    public function getSanitizedPostVars()
    {
        return $this->sanitizeArray($this->postVars);
    }

    // retorna os put vars com sanitização básica
    public function getSanitizedPutVars()
    {
        return $this->sanitizeArray($this->putVars);
    }

    // sanitiza recursivamente arrays/valores
    private function sanitizeArray($data)
    {
        if (is_array($data)) {
            $out = [];
            foreach ($data as $k => $v) {
                $out[$k] = $this->sanitizeArray($v);
            }
            return $out;
        }

        return $this->sanitizeValue($data);
    }

    // sanitização básica de um valor escalar
    private function sanitizeValue($value)
    {
        if (is_null($value)) {
            return null;
        }

        if (is_bool($value) || is_int($value) || is_float($value)) {
            return $value;
        }

        // apenas strings a serem limpas
        if (is_string($value)) {
            // remove bytes nulos e caracteres de controle
            $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
            // remove tags HTML/PHP
            $value = strip_tags($value);
            // trim
            $value = trim($value);
            return $value;
        }

        // qualquer outro tipo, retorna como está
        return $value;
    }



}