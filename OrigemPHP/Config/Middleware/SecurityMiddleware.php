<?php

namespace OrigemPHP\Config\Middleware;

class SecurityMiddleware
{
    private $maxRequests = 100; // requisições
    private $timeWindow = 60;  // segundos
    private $allowedOrigins = [
        'https://ksssolucoes.com.br',
        'http://localhost:3000',
        'http://localhost'
    ];

    public function handle()
    {
        try {

            /* =========================
             * PEGAR IP REAL
             * ========================= */
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

            /* =========================
             * RATE LIMIT (ANTI DDOS)
             * ========================= */
            $this->rateLimit($ip);

            /* =========================
             * CORS
             * ========================= */
            $this->handleCors();

            /* =========================
             * SQL INJECTION
             * ========================= */
            $this->checkSqlInjection();

        } catch (\Exception $e) {

            http_response_code(403);
            echo json_encode([
                "error" => true,
                "message" => $e->getMessage()
            ]);
            exit;

        } finally {

            // nada pra fechar aqui, mas mantido padrão

        }
    }

    /* =========================
     * RATE LIMIT SIMPLES
     * ========================= */
    private function rateLimit($ip)
    {
        $file = sys_get_temp_dir() . "/rate_" . md5($ip);

        $data = [
            "count" => 0,
            "time" => time()
        ];

        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
        }

        if ((time() - $data['time']) > $this->timeWindow) {
            $data = ["count" => 1, "time" => time()];
        } else {
            $data['count']++;
        }

        file_put_contents($file, json_encode($data));

        if ($data['count'] > $this->maxRequests) {
            throw new \Exception("Too many requests - possível ataque detectado");
        }
    }

    /* =========================
     * CORS SEGURO
     * ========================= */
    private function handleCors()
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        // Somente valida quando a requisição possui Origin
        if (!empty($origin)) {

            if (!in_array($origin, $this->allowedOrigins, true)) {
                throw new \Exception("CORS bloqueado");
            }

            header("Access-Control-Allow-Origin: {$origin}");
            header("Vary: Origin");
            header("Access-Control-Allow-Credentials: true");
        }

        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Max-Age: 86400");

        // Responde imediatamente ao preflight
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    /* =========================
     * DETECTAR SQL INJECTION
     * ========================= */
    private function checkSqlInjection()
    {
        $input = json_encode($_REQUEST);

        $patterns = [
            '/(\%27)|(\')|(\-\-)|(\%23)|(#)/i',
            '/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|AND)\b/i',
            '/\b(1=1|1=0)\b/i'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                throw new \Exception("SQL Injection detectado");
            }
        }
    }
}