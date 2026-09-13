<?php

namespace OrigemPHP\Servicos\Logs;

use Illuminate\Database\Capsule\Manager as DB;

class SystemLogger
{
    public static function registrar($level, $module, $message, $context = null): void
    {
        try {
            $context = self::sanitize($context);
            DB::table('system_logs')->insert([
                'level' => (string) $level,
                'module' => (string) $module,
                'message' => (string) $message,
                'route' => $_SERVER['REQUEST_URI'] ?? null,
                'context' => $context === null ? null : json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        } catch (\Throwable $e) {
            error_log('[SystemLogger] ' . get_class($e) . ': ' . $e->getMessage());
        }
    }

    private static function sanitize($value, $depth = 0)
    {
        if ($depth > 4 || $value === null || is_scalar($value)) {
            return $value;
        }

        if (is_array($value)) {
            $result = [];
            foreach ($value as $key => $item) {
                if (in_array(strtolower((string) $key), ['password', 'token', 'authorization', 'cookies', 'session', 'cfg_content', 'dat_content', 'payload'], true)) {
                    continue;
                }
                $result[$key] = self::sanitize($item, $depth + 1);
            }
            return $result;
        }

        return null;
    }
}
