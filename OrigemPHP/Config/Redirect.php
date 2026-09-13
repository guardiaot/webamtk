<?php
namespace OrigemPHP\Config;

session_start();

class Redirect
{
    protected $url;

    public static function back()
    {
        $instance = new self;
        $instance->url = $_SERVER['HTTP_REFERER'] ?? '/';
        return $instance;
    }

    public static function to($url)
    {
        $instance = new self;
        $instance->url = $url;
        return $instance;
    }

    public function with($key, $message)
    {
        $_SESSION[$key] = $message;
        return $this;
    }

    public function send()
    {
        header("Location: " . $this->url);
        exit;
    }
}
