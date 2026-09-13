<?php

namespace OrigemPHP\Servicos\Audit;

use Illuminate\Database\Capsule\Manager as DB;

class UserActivityLogger
{
    public static function registrar($action, $module, $description, $entityType = null, $entityId = null, $metadata = null): void
    {
        try {
            $metadata = self::sanitize($metadata);
            DB::table('user_activities')->insert([
                'user_id' => $_SESSION['users']['id'] ?? null,
                'action' => (string) $action,
                'module' => (string) $module,
                'entity_type' => $entityType !== null ? (string) $entityType : null,
                'entity_id' => $entityId !== null ? (string) $entityId : null,
                'description' => (string) $description,
                'http_method' => $_SERVER['REQUEST_METHOD'] ?? null,
                'route' => $_SERVER['REQUEST_URI'] ?? null,
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                'metadata' => $metadata === null ? null : json_encode($metadata, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        } catch (\Throwable $e) {
            error_log(
                '[UserActivityLogger] '
                . get_class($e)
                . ': '
                . $e->getMessage()
                . ' in '
                . $e->getFile()
                . ':'
                . $e->getLine()
            );
            return;
        }
    }

    private static function sanitize($value)
    {
        if (!is_array($value))
            return null;
        $blocked = ['password', 'access_token', 'authorization', 'cookie', 'cfg', 'dat', 'request'];
        $result = [];
        foreach ($value as $key => $item) {
            if (in_array(strtolower((string) $key), $blocked, true))
                continue;
            $result[$key] = is_array($item) ? self::sanitize($item) : $item;
        }
        return $result;
    }
}
