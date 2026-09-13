<?php


namespace OrigemPHP\Config;

use OrigemPHP\Servicos\Autentica;

class Response
{

    private $httpCode = 200;
    private $headers = [];
    private $contentType = 'text/html';
    private $content;


    // inicia os valores da classe 
    public function __construct($httpCode, $content, $contentType = 'text/html')
    {
        $this->httpCode = $httpCode;
        $this->content = $content;
        $this->setContentType($contentType);
    }

    // responsavel por alterar o header da requisição
    public function setContentType($contentType)
    {

        error_reporting(E_ALL ^ E_NOTICE);
        ini_set("display_errors", 0);

        $this->contentType = $contentType;
        $this->addHeader('Access-Control-Allow-Origin', '*');
        $this->addHeader('Access-Control-Allow-Headers', '*');
        $this->addHeader('Access-Control-Max-Age', 86400);
        $this->addHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        $this->addHeader('Content-Type', $contentType);

    }

    // responsavel por adicionar registro no cabeçalho de response
    public function addHeader($key, $value)
    {

        $this->headers[$key] = $value;
    }

    private function sendHeaders()
    {
        // define o código HTTP antes de enviar headers
        http_response_code((int)$this->httpCode);

        // se os headers já foram enviados, evita tentar enviar novamente
        if (headers_sent()) {
            return;
        }

        foreach ($this->headers as $key => $value) {
            header($key . ': ' . $value);
        }

    }

    public function sendResponse()
    {
        $this->sendHeaders();

        // normaliza content type (ignora parâmetros como charset)
        $baseType = strtolower(trim(explode(';', $this->contentType)[0]));

        switch ($baseType) {
            case 'text/html':
                echo $this->content;
                break;

            case 'text/event-stream':
                // SSE precisa de flush e formatação específica
                if (is_array($this->content) || is_object($this->content)) {
                    $data = json_encode(
                        array(
                            'status' => Autentica::codehttp(http_response_code()),
                            'data' => $this->content
                        ),
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    );
                } else {
                    $data = $this->content;
                }

                // envia como SSE
                echo "data: {$data}\n\n";
                flush(); // força envio imediato
                break;

            case 'application/json':
            default:
                // para JSON e casos não explicitamente HTML/SSE, retornar JSON com status/data
                // se o conteúdo já for string JSON, tenta manter; caso contrário, encapsula
                $payload = $this->content;
                if (!is_string($payload)) {
                    $payload = array(
                        'status' => Autentica::codehttp(http_response_code()),
                        'data' => $this->content
                    );
                }

                echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                break;
        }

    }










}