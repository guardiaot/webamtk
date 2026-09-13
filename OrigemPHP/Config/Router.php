<?php

namespace OrigemPHP\Config;
use \Closure;
use \ReflectionFunction;
use OrigemPHP\Config\Middleware\Queue;

class Router
{

    private $url = '';
    private $prefix = '';
    private $routes = [];
    private $request;
    private $contentType = 'text/html';

    public function __construct($url)
    {
        $this->request = new Request($this);
        $this->url = $url;
        $this->setPrefix();
    }

    public function setContentType($contentType)
    {
        $this->contentType = $contentType;
    }

    private function setPrefix()
    {
        $parseUrl = parse_url($this->url);
        $this->prefix = $parseUrl['path'] ?? '';
    }

    private function addRoute($method, $route, $params = [])
    {
        foreach ($params as $key => $value) {
            if ($value instanceof Closure) {
                $params['Servicos'] = $value;
                unset($params[$key]);
                continue;
            }
        }

        $params['middlewares'] = $params['middlewares'] ?? [];

        // Variáveis passadas pela URL
        $params['variables'] = [];

        $patternVariable = '/{(.*?)}/';

        if (preg_match_all($patternVariable, $route, $matches)) {

            // Cada variável aceita somente um segmento da URL.
            // Não permite que {id} capture "1/status", por exemplo.
            $route = preg_replace(
                $patternVariable,
                '([^/]+)',
                $route
            );

            $params['variables'] = $matches[1] ?? [];
        }

        $route = rtrim($route, '/');

        // Usa ~ como delimitador para não precisar escapar "/"
        $patternRoute = '~^' . $route . '$~';

        $this->routes[$patternRoute][$method] = $params;
    }

    // responsavel por retornar a uri desconsiderando o prefix
    private function getUri()
    {
        $uri = $this->request->getUri();
        //divide a uri com prefix
        // Se houver prefix definido e a URI começar com ele, remove apenas o prefix do começo
        if (strlen($this->prefix) && strpos($uri, $this->prefix) === 0) {
            $without = substr($uri, strlen($this->prefix));
        } else {
            $without = $uri;
        }

        // retorno sem prefix
        return rtrim($without, '/');

    }

    //retorna os dados da rota atual
    private function getRoute()
    {
        $uri = $this->getUri();
        $httpMethod = $this->request->getHttpMethod();



        //valida rota
        foreach ($this->routes as $patternRoute => $methods) {

            if (preg_match($patternRoute, $uri, $matches)) {
                if (isset($methods[$httpMethod])) {
                    // valores capturados (grupos) sem o índice 0
                    $groupValues = array_slice($matches, 1);

                    // chaves definidas na rota
                    $keys = is_array($methods[$httpMethod]['variables']) ? $methods[$httpMethod]['variables'] : [];

                    $vars = [];
                    foreach ($keys as $i => $key) {
                        $vars[$key] = $groupValues[$i] ?? '';
                    }

                    $methods[$httpMethod]['variables'] = $vars;
                    $methods[$httpMethod]['variables']['request'] = $this->request;

                    return $methods[$httpMethod];
                }

                throw new \Exception("Metodo não permitido", 405);

            }
        }

        throw new \Exception("Rota não encontrada", 404);

    }




    public function get($route, $params = [])
    {

        return $this->addRoute('GET', $route, $params);
    }

    public function post($route, $params = [])
    {

        // print_r($route."\n");
        return $this->addRoute('POST', $route, $params);
    }

    public function put($route, $params = [])
    {
        return $this->addRoute('PUT', $route, $params);
    }

    public function delete($route, $params = [])
    {
        return $this->addRoute('DELETE', $route, $params);
    }

    public function run()
    {
        try {
            $route = $this->getRoute();

            if (!isset($route['Servicos'])) {
                throw new \Exception("Serviço não encontrado", 500);
            }
            $args = [];
            $reflection = new ReflectionFunction($route['Servicos']);
            foreach ($reflection->getParameters() as $parameters) {
                $name = $parameters->getName();
                $args[$name] = $route['variables'][$name] ?? '';
            }
            return (new Queue($route['middlewares'], $route['Servicos'], $args))->next($this->request);

        } catch (\Exception $e) {
            return new Response($e->getCode(), $this->getErrorMessage($e->getMessage()), $this->contentType);
        }
    }

    private function getErrorMessage($message)
    {
        $baseType = strtolower(trim(explode(';', $this->contentType)[0]));

        switch ($baseType) {
            case 'application/json':
                return ['error' => $message];
            default:
                return $message;
        }
    }
}