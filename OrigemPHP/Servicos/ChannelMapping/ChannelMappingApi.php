<?php

namespace OrigemPHP\Servicos\ChannelMapping;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class ChannelMappingApi extends BaseController
{
    private const SEMANTIC_CODES = ['VA', 'VB', 'VC', 'VN', 'IA', 'IB', 'IC', 'IN'];

    public static function context($request, $recordId)
    {
        Permissao::proteger('channel_mappings.view');
        $recordId = self::positiveId($recordId);
        if (!$recordId) return ['erro' => 1, 'mensagem' => 'Registro COMTRADE inválido.'];
        $record = self::record($recordId);
        if (!$record) return ['erro' => 1, 'mensagem' => 'Registro COMTRADE não encontrado.'];
        if (!self::iedExists($record->ied_id)) return ['erro' => 1, 'mensagem' => 'IED nÃ£o encontrado.'];
        $channels = self::channels($recordId);
        $fingerprint = self::layoutFingerprint($channels);
        $profile = DB::table('ied_channel_mapping_profiles')->where('ied_id', $record->ied_id)->where('layout_fingerprint', $fingerprint)
            ->orderByRaw("CASE WHEN status = 'confirmed' THEN 0 WHEN status = 'draft' THEN 1 ELSE 2 END")->orderByDesc('updated_at')->orderByDesc('id')->first();
        return [
            'record' => $record,
            'ied' => ['id' => $record->ied_id, 'code' => $record->ied_code, 'name' => $record->ied_name, 'manufacturer' => $record->ied_manufacturer, 'model' => $record->ied_model],
            'layout_fingerprint' => $fingerprint,
            'analog_channels' => $channels,
            'profile' => $profile,
            'mappings' => $profile ? self::mappings($profile->id) : [],
        ];
    }

    public static function profile($request, $profileId)
    {
        Permissao::proteger('channel_mappings.view');
        $profileId = self::positiveId($profileId);
        $profile = $profileId ? DB::table('ied_channel_mapping_profiles')->where('id', $profileId)->first() : null;
        if (!$profile) return ['erro' => 1, 'mensagem' => 'Perfil de Associação de Canais não encontrado.'];
        return ['profile' => $profile, 'mappings' => self::mappings($profile->id)];
    }

    public static function createProfile($request)
    {
        Permissao::proteger('channel_mappings.manage');
        $data = $request->getPostVars();
        $recordId = self::positiveId($data['comtrade_record_id'] ?? null);
        if (!$recordId) return ['erro' => 1, 'mensagem' => 'Informe um registro COMTRADE válido.'];
        $record = self::record($recordId);
        if (!$record) return ['erro' => 1, 'mensagem' => 'Registro COMTRADE não encontrado.'];
        if (!self::iedExists($record->ied_id)) return ['erro' => 1, 'mensagem' => 'IED nÃ£o encontrado.'];
        $fingerprint = self::layoutFingerprint(self::channels($recordId));
        $base = DB::table('ied_channel_mapping_profiles')->where('ied_id', $record->ied_id)->where('layout_fingerprint', $fingerprint);
        $confirmed = (clone $base)->where('status', 'confirmed')->first();
        if ($confirmed) return ['erro' => 1, 'mensagem' => 'Já existe um perfil confirmado para este IED e layout.', 'data' => $confirmed];
        $draft = (clone $base)->where('status', 'draft')->first();
        if ($draft) return ['erro' => 0, 'mensagem' => 'Perfil draft já existente.', 'data' => self::profileData($draft)];
        $now = date('Y-m-d H:i:s');
        try {
            $id = DB::table('ied_channel_mapping_profiles')->insertGetId(['ied_id' => $record->ied_id, 'layout_fingerprint' => $fingerprint, 'status' => 'draft', 'version' => 1, 'created_at' => $now, 'updated_at' => $now]);
        } catch (\Throwable $e) {
            if (self::isUniqueViolation($e)) {
                $active = self::activeProfile($record->ied_id, $fingerprint);
                if ($active && $active->status === 'draft') return ['erro' => 0, 'mensagem' => 'Perfil draft existente.', 'data' => self::profileData($active)];
                if ($active && $active->status === 'confirmed') return ['erro' => 1, 'mensagem' => 'Perfil confirmado existente para este IED e layout.', 'data' => $active];
            }
            return ['erro' => 1, 'mensagem' => 'Nao foi possivel criar o perfil de Associacao de Canais.'];
        }
        $profile = DB::table('ied_channel_mapping_profiles')->where('id', $id)->first();
        return ['erro' => 0, 'mensagem' => 'Perfil de Associação de Canais criado com sucesso.', 'data' => self::profileData($profile)];
    }

    public static function update($request, $profileId)
    {
        Permissao::proteger('channel_mappings.manage');
        $profile = self::findProfile($profileId);
        if (!$profile) return ['erro' => 1, 'mensagem' => 'Perfil de Associação de Canais não encontrado.'];
        if ($profile->status !== 'draft') return ['erro' => 1, 'mensagem' => 'Somente perfis draft podem ser alterados.'];
        $data = $request->getPutVars();
        $validation = self::prepareMappings($profile, $data['mappings'] ?? null);
        if (isset($validation['erro'])) return $validation;
        $now = date('Y-m-d H:i:s');
        try {
            DB::connection()->transaction(function () use ($profile, $validation, $now) {
                DB::table('ied_channel_mappings')->where('profile_id', $profile->id)->delete();
                if ($validation) DB::table('ied_channel_mappings')->insert($validation);
                DB::table('ied_channel_mapping_profiles')->where('id', $profile->id)->update(['updated_at' => $now]);
            });
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => 'Nao foi possivel atualizar a Associacao de Canais.'];
        }
        $profile = self::findProfile($profile->id);
        return ['erro' => 0, 'mensagem' => 'Associação de Canais atualizada com sucesso.', 'data' => self::profileData($profile)];
    }

    public static function confirm($request, $profileId)
    {
        Permissao::proteger('channel_mappings.manage');
        $profile = self::findProfile($profileId);
        if (!$profile) return ['erro' => 1, 'mensagem' => 'Perfil de Associação de Canais não encontrado.'];
        if ($profile->status !== 'draft') return ['erro' => 1, 'mensagem' => 'Somente perfis draft podem ser confirmados.'];
        $validation = self::validateStoredMappings(self::mappings($profile->id));
        if ($validation) return ['erro' => 1, 'mensagem' => $validation];
        try {
            DB::table('ied_channel_mapping_profiles')->where('id', $profile->id)->update(['status' => 'confirmed', 'updated_at' => date('Y-m-d H:i:s')]);
        } catch (\Throwable $e) {
            if (self::isUniqueViolation($e)) return ['erro' => 1, 'mensagem' => 'Perfil ativo existente para este IED e layout.'];
            return ['erro' => 1, 'mensagem' => 'Não foi possível confirmar o perfil de Associação de Canais.'];
        }
        return ['erro' => 0, 'mensagem' => 'Perfil de Associação de Canais confirmado com sucesso.', 'data' => self::profileData(self::findProfile($profile->id))];
    }

    public static function invalidate($request, $profileId)
    {
        Permissao::proteger('channel_mappings.manage');
        $profile = self::findProfile($profileId);
        if (!$profile) return ['erro' => 1, 'mensagem' => 'Perfil de Associação de Canais não encontrado.'];
        if ($profile->status !== 'confirmed') return ['erro' => 1, 'mensagem' => 'Somente perfis confirmados podem ser invalidados.'];
        try {
            DB::table('ied_channel_mapping_profiles')->where('id', $profile->id)->update(['status' => 'invalidated', 'updated_at' => date('Y-m-d H:i:s')]);
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => 'Nao foi possivel invalidar o perfil de Associacao de Canais.'];
        }
        return ['erro' => 0, 'mensagem' => 'Perfil de Associação de Canais invalidado com sucesso.', 'data' => self::profileData(self::findProfile($profile->id))];
    }

    private static function record($id)
    {
        return DB::table('comtrade_records')->leftJoin('ieds', 'comtrade_records.ied_id', '=', 'ieds.id')->select('comtrade_records.*', 'ieds.name as ied_name', 'ieds.code as ied_code', 'ieds.manufacturer as ied_manufacturer', 'ieds.model as ied_model')->where('comtrade_records.id', $id)->first();
    }

    private static function channels($recordId)
    {
        return DB::table('comtrade_analog_channels')->where('comtrade_record_id', $recordId)->orderBy('channel_number')->get();
    }

    private static function iedExists($iedId)
    {
        return $iedId && DB::table('ieds')->where('id', $iedId)->exists();
    }

    private static function activeProfile($iedId, $fingerprint)
    {
        return DB::table('ied_channel_mapping_profiles')->where('ied_id', $iedId)->where('layout_fingerprint', $fingerprint)->whereIn('status', ['draft', 'confirmed'])
            ->orderByRaw("CASE WHEN status = 'confirmed' THEN 0 ELSE 1 END")->orderByDesc('updated_at')->orderByDesc('id')->first();
    }

    private static function findProfile($id)
    {
        $id = self::positiveId($id);
        return $id ? DB::table('ied_channel_mapping_profiles')->where('id', $id)->first() : null;
    }

    private static function mappings($profileId)
    {
        return DB::table('ied_channel_mappings')->where('profile_id', $profileId)->orderBy('channel_number')->get()->all();
    }

    private static function profileData($profile)
    {
        return ['profile' => $profile, 'mappings' => self::mappings($profile->id)];
    }

    private static function prepareMappings($profile, $input)
    {
        if (!is_array($input)) return ['erro' => 1, 'mensagem' => 'Informe as associações de canais.'];
        $records = DB::table('comtrade_records')->where('ied_id', $profile->ied_id)->get();
        $channels = collect();
        foreach ($records as $record) { $candidate = self::channels($record->id); if (self::layoutFingerprint($candidate) === $profile->layout_fingerprint) { $channels = $candidate; break; } }
        $byNumber = [];
        foreach ($channels as $channel) $byNumber[(int) $channel->channel_number] = $channel;
        $rows = []; $physical = []; $semantic = [];
        foreach ($input as $item) {
            if (!is_array($item)) return ['erro' => 1, 'mensagem' => 'Associação de canal inválida.'];
            $number = filter_var($item['channel_number'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            $code = strtoupper(trim((string) ($item['semantic_code'] ?? '')));
            if (!$number || !isset($byNumber[$number])) return ['erro' => 1, 'mensagem' => 'Canal analógico não encontrado no layout.'];
            if (!in_array($code, self::SEMANTIC_CODES, true)) return ['erro' => 1, 'mensagem' => 'Código semântico inválido.'];
            if (array_key_exists('enabled', $item) && !is_bool($item['enabled'])) return ['erro' => 1, 'mensagem' => 'O campo enabled deve ser booleano.'];
            $enabled = $item['enabled'] ?? true;
            if (isset($physical[$number])) return ['erro' => 1, 'mensagem' => 'O canal físico não pode ser repetido.'];
            if ($enabled && isset($semantic[$code])) return ['erro' => 1, 'mensagem' => 'O código semântico ativo não pode ser repetido.'];
            $physical[$number] = true; if ($enabled) $semantic[$code] = true;
            $rows[] = self::snapshot($profile->id, $byNumber[$number], $code, $enabled);
        }
        return $rows;
    }

    private static function snapshot($profileId, $channel, $code, $enabled)
    {
        return ['profile_id' => $profileId, 'channel_kind' => 'analog', 'channel_number' => (int) $channel->channel_number, 'channel_name' => $channel->name ?? null, 'channel_phase' => $channel->phase ?? null, 'channel_circuit' => $channel->circuit ?? null, 'channel_unit' => $channel->unit ?? null, 'channel_a' => property_exists($channel, 'a') ? $channel->a : null, 'channel_b' => property_exists($channel, 'b') ? $channel->b : null, 'channel_primary' => $channel->primary_value ?? null, 'channel_secondary' => $channel->secondary_value ?? null, 'channel_ps' => $channel->ps ?? null, 'semantic_code' => $code, 'enabled' => $enabled, 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')];
    }

    private static function validateStoredMappings($mappings)
    {
        if (!$mappings) return 'Informe ao menos uma associação de canal.';
        $physical = []; $semantic = []; $enabled = false;
        foreach ($mappings as $mapping) {
            if ($mapping->channel_kind !== 'analog' || (int) $mapping->channel_number < 1 || !in_array($mapping->semantic_code, self::SEMANTIC_CODES, true)) return 'As associações de canais são inválidas.';
            if (isset($physical[$mapping->channel_number])) return 'O canal físico não pode ser repetido.';
            if ($mapping->enabled && isset($semantic[$mapping->semantic_code])) return 'O código semântico ativo não pode ser repetido.';
            $physical[$mapping->channel_number] = true; if ($mapping->enabled) $semantic[$mapping->semantic_code] = true;
            if ($mapping->enabled) $enabled = true;
        }
        if (!$enabled) return 'Informe ao menos um mapping habilitado.';
        return null;
    }

    private static function layoutFingerprint($channels)
    {
        $layout = [];
        foreach ($channels as $channel) $layout[] = [(int) $channel->channel_number, self::value($channel->name ?? null), self::value($channel->phase ?? null), self::value($channel->circuit ?? null), self::value($channel->unit ?? null), self::numberValue(property_exists($channel, 'a') ? $channel->a : null), self::numberValue(property_exists($channel, 'b') ? $channel->b : null), self::numberValue($channel->primary_value ?? null), self::numberValue($channel->secondary_value ?? null), self::value($channel->ps ?? null)];
        return hash('sha256', json_encode($layout, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    private static function value($value)
    {
        return $value === null ? '' : trim((string) $value);
    }

    private static function numberValue($value)
    {
        if ($value === null) return '';
        $value = trim((string) $value);
        if (!preg_match('/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?$/D', $value, $matches)) return $value;
        $sign = $matches[1] === '-' ? '-' : '';
        $parts = explode('.', $matches[2], 2);
        $rawDigits = $parts[0] . ($parts[1] ?? '');
        $digits = ltrim($rawDigits, '0');
        if ($digits === '') return '0';
        $decimalPosition = strlen($parts[0]) + (int) ($matches[3] ?? 0) - (strlen($rawDigits) - strlen($digits));
        if ($decimalPosition <= 0) $result = '0.' . str_repeat('0', -$decimalPosition) . $digits;
        elseif ($decimalPosition >= strlen($digits)) $result = $digits . str_repeat('0', $decimalPosition - strlen($digits));
        else $result = substr($digits, 0, $decimalPosition) . '.' . substr($digits, $decimalPosition);
        if (strpos($result, '.') !== false) $result = rtrim(rtrim($result, '0'), '.');
        return $sign . ($result === '' ? '0' : $result);
    }

    private static function isUniqueViolation(\Throwable $e)
    {
        $message = strtolower($e->getMessage());
        return strpos($message, 'uq_ied_channel_mapping_profiles_active') !== false || strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false;
    }

    private static function positiveId($value)
    {
        return filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) ?: null;
    }
}
