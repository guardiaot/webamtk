<?php

namespace OrigemPHP\Servicos\TransmissionFunctions;

use Illuminate\Database\Capsule\Manager as DB;
use OrigemPHP\Config\BaseController;
use OrigemPHP\Servicos\Usuarios\Permissao;

class TransmissionFunctionsApi extends BaseController
{
    public static function listar($request)
    {
        Permissao::proteger('transmission_functions.view');
        $params = $request->getQueryParams();
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? $params['limit'] ?? 20)));
        $query = self::baseQuery();
        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $search = '%' . $search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('transmission_functions.name', 'ilike', $search)
                    ->orWhere('transmission_function_types.name', 'ilike', $search)
                    ->orWhere('installations.name', 'ilike', $search)
                    ->orWhere('regionals.name', 'ilike', $search)
                    ->orWhere('regionals.abbreviation', 'ilike', $search)
                    ->orWhere('owners.name', 'ilike', $search)
                    ->orWhere('states.name', 'ilike', $search)
                    ->orWhere('states.abbreviation', 'ilike', $search);
            });
        }
        if (array_key_exists('enabled', $params) && $params['enabled'] !== '')
            $query->where('transmission_functions.enabled', self::booleanValue($params['enabled']));
        if (!empty($params['owner_id']))
            $query->where('regionals.owner_id', $params['owner_id']);
        if (!empty($params['regional_id']))
            $query->where('regionals.id', $params['regional_id']);
        if (!empty($params['installation_id']))
            $query->where('transmission_functions.installation_id', $params['installation_id']);
        if (!empty($params['type_id']))
            $query->where('transmission_functions.type_id', $params['type_id']);
        if (!empty($params['state_id']))
            $query->where('installations.state_id', $params['state_id']);
        $total = (clone $query)->count('transmission_functions.id');
        $ativos = (clone $query)->where('transmission_functions.enabled', true)->count('transmission_functions.id');
        $inativos = (clone $query)->where('transmission_functions.enabled', false)->count('transmission_functions.id');
        $sortFields = ['name' => 'transmission_functions.name', 'type_name' => 'transmission_function_types.name', 'installation_name' => 'installations.name', 'regional_name' => 'regionals.name', 'owner_name' => 'owners.name', 'state_name' => 'states.name', 'created_at' => 'transmission_functions.created_at'];
        $sort = $sortFields[$params['sort'] ?? ''] ?? 'transmission_functions.name';
        $direction = strtolower($params['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $pagination = $query->orderBy($sort, $direction)->orderBy('transmission_functions.id', 'asc')->paginate($perPage, ['*'], 'page', $page);
        return ['data' => $pagination->items(), 'current_page' => $pagination->currentPage(), 'last_page' => $pagination->lastPage(), 'per_page' => $pagination->perPage(), 'total' => $total, 'from' => $pagination->firstItem(), 'to' => $pagination->lastItem(), 'ativos' => $ativos, 'inativos' => $inativos];
    }

    public static function listarSimples($request)
    {
        Permissao::proteger('transmission_functions.view');
        $query = DB::table('transmission_functions')->join('installations', 'transmission_functions.installation_id', '=', 'installations.id')->join('transmission_function_types', 'transmission_functions.type_id', '=', 'transmission_function_types.id')->select('transmission_functions.id', 'transmission_functions.name', 'transmission_functions.installation_id', 'installations.name as installation_name', 'transmission_function_types.name as type_name')->where('transmission_functions.enabled', true);
        $params = $request->getQueryParams();
        if (!empty($params['installation_id']))
            $query->where('transmission_functions.installation_id', $params['installation_id']);
        if (!empty($params['type_id']))
            $query->where('transmission_functions.type_id', $params['type_id']);
        if (!empty($params['include_id']))
            $query->orWhere(function ($q) use ($params) {
                $q->where('transmission_functions.id', $params['include_id']); });
        return $query->orderBy('transmission_functions.name')->get();
    }

    public static function listarPorId($request, $id)
    {
        Permissao::proteger('transmission_functions.view');
        $function = self::findDetailed($id);
        return $function ?: ['erro' => 1, 'mensagem' => 'Função de Transmissão não encontrada.'];
    }

    public static function criar($request)
    {
        Permissao::proteger('transmission_functions.manage');
        $data = self::data($request);
        $error = self::validate($data, true);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        try {
            $id = DB::connection()->transaction(function () use ($data) {
                $id = DB::table('transmission_functions')->insertGetId(['installation_id' => (int) $data['installation_id'], 'type_id' => (int) $data['type_id'], 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
                if (array_key_exists('line_parameters', $data) && $data['line_parameters'] !== null)
                    self::saveLineParameters($id, $data['line_parameters']);
                if (array_key_exists('risk_sections', $data))
                    self::syncRiskSections($id, $data['risk_sections']);
                return $id;
            });
            return ['erro' => 0, 'mensagem' => 'Função de Transmissão criada com sucesso.', 'data' => self::findDetailed($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe uma Função de Transmissão com este nome nesta Instalação.' : 'Não foi possível criar a Função de Transmissão.'];
        }
    }

    public static function atualizar($request, $id)
    {
        Permissao::proteger('transmission_functions.manage');
        if (!self::find($id))
            return ['erro' => 1, 'mensagem' => 'Função de Transmissão não encontrada.'];
        $data = self::data($request);
        $error = self::validate($data, false, $id);
        if ($error)
            return ['erro' => 1, 'mensagem' => $error];
        try {
            DB::connection()->transaction(function () use ($data, $id) {
                DB::table('transmission_functions')->where('id', $id)->update(['installation_id' => (int) $data['installation_id'], 'type_id' => (int) $data['type_id'], 'name' => trim($data['name']), 'enabled' => self::booleanValue($data['enabled'] ?? true), 'updated_at' => date('Y-m-d H:i:s')]);
                if (array_key_exists('line_parameters', $data)) {
                    if ($data['line_parameters'] === null)
                        DB::table('transmission_line_parameters')->where('transmission_function_id', $id)->delete();
                    else
                        self::saveLineParameters($id, $data['line_parameters']);
                }
                if (array_key_exists('risk_sections', $data))
                    self::syncRiskSections($id, $data['risk_sections']);
            });
            return ['erro' => 0, 'mensagem' => 'Função de Transmissão atualizada com sucesso.', 'data' => self::findDetailed($id)];
        } catch (\Throwable $e) {
            return ['erro' => 1, 'mensagem' => self::isDuplicate($e) ? 'Já existe uma Função de Transmissão com este nome nesta Instalação.' : 'Não foi possível atualizar a Função de Transmissão.'];
        }
    }

    public static function alterarStatus($request, $id)
    {
        Permissao::proteger('transmission_functions.manage');
        if (!self::find($id))
            return ['erro' => 1, 'mensagem' => 'Função de Transmissão não encontrada.'];
        $data = self::data($request);
        if (!array_key_exists('enabled', $data))
            return ['erro' => 1, 'mensagem' => 'Informe o novo status.'];
        DB::table('transmission_functions')->where('id', $id)->update(['enabled' => self::booleanValue($data['enabled']), 'updated_at' => date('Y-m-d H:i:s')]);
        return ['erro' => 0, 'mensagem' => 'Status da Função de Transmissão atualizado com sucesso.', 'data' => self::find($id)];
    }

    private static function baseQuery()
    {
        return DB::table('transmission_functions')->join('installations', 'transmission_functions.installation_id', '=', 'installations.id')->join('regionals', 'installations.regional_id', '=', 'regionals.id')->join('owners', 'regionals.owner_id', '=', 'owners.id')->join('states', 'installations.state_id', '=', 'states.id')->join('transmission_function_types', 'transmission_functions.type_id', '=', 'transmission_function_types.id')->select('transmission_functions.id', 'transmission_functions.name', 'transmission_functions.enabled', 'transmission_functions.type_id', 'transmission_function_types.name as type_name', 'transmission_functions.installation_id', 'installations.name as installation_name', 'installations.state_id', 'states.name as state_name', 'states.abbreviation as state_abbreviation', 'regionals.id as regional_id', 'regionals.name as regional_name', 'regionals.abbreviation as regional_abbreviation', 'owners.id as owner_id', 'owners.name as owner_name', 'transmission_functions.created_at', 'transmission_functions.updated_at');
    }

    private static function find($id)
    {
        return self::baseQuery()->where('transmission_functions.id', $id)->first();
    }
    private static function data($request): array
    {
        return $request->getPostVars();
    }
    private static function validate(array $data, bool $creating, $id = null)
    {
        $installationId = (int) ($data['installation_id'] ?? 0);
        $typeId = (int) ($data['type_id'] ?? 0);
        if (!$installationId)
            return 'Selecione uma Instalação.';
        $installation = DB::table('installations')->join('regionals', 'installations.regional_id', '=', 'regionals.id')->join('owners', 'regionals.owner_id', '=', 'owners.id')->select('installations.id', 'installations.enabled as installation_enabled', 'regionals.enabled as regional_enabled', 'owners.enabled as owner_enabled')->where('installations.id', $installationId)->first();
        if (!$installation)
            return 'Instalação não encontrada.';
        if ($creating && (!(bool) $installation->installation_enabled || !(bool) $installation->regional_enabled || !(bool) $installation->owner_enabled))
            return 'Selecione uma Instalação ativa em uma hierarquia ativa.';
        if (!$typeId)
            return 'Selecione um Tipo de Função de Transmissão.';
        $type = DB::table('transmission_function_types')->where('id', $typeId)->first();
        if (!$type)
            return 'Tipo de Função de Transmissão não encontrado.';
        if ($creating && !(bool) $type->enabled)
            return 'Selecione um Tipo de Função de Transmissão ativo.';
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '')
            return 'Informe o nome da Função de Transmissão.';
        $query = DB::table('transmission_functions')->where('installation_id', $installationId)->where('name', $name);
        if ($id)
            $query->where('id', '<>', $id);
        if ($query->exists())
            return 'Já existe uma Função de Transmissão com este nome nesta Instalação.';
        return self::validateTechnical($data, $creating, $id);
    }
    private static function findDetailed($id)
    {
        $function = self::find($id);
        if (!$function)
            return null;
        $function->line_parameters = DB::table('transmission_line_parameters')->select('voltage_level', 'nominal_current', 'line_length_km', 'infeed', 'r1', 'r0', 'x1', 'x0')->where('transmission_function_id', $id)->first();
        $function->risk_sections = DB::table('transmission_line_risk_sections')->select('id', 'km_start', 'km_end')->where('transmission_function_id', $id)->orderBy('km_start')->orderBy('id')->get();
        return $function;
    }
    private static function saveLineParameters($functionId, array $data): void
    {
        $values = ['transmission_function_id' => $functionId, 'voltage_level' => self::decimalValue($data['voltage_level'] ?? null), 'nominal_current' => self::decimalValue($data['nominal_current'] ?? null), 'line_length_km' => self::decimalValue($data['line_length_km'] ?? null), 'infeed' => self::booleanValue($data['infeed'] ?? false), 'r1' => self::decimalValue($data['r1'] ?? null), 'r0' => self::decimalValue($data['r0'] ?? null), 'x1' => self::decimalValue($data['x1'] ?? null), 'x0' => self::decimalValue($data['x0'] ?? null), 'updated_at' => date('Y-m-d H:i:s')];
        $exists = DB::table('transmission_line_parameters')->where('transmission_function_id', $functionId)->exists();
        if ($exists)
            DB::table('transmission_line_parameters')->where('transmission_function_id', $functionId)->update($values);
        else
            DB::table('transmission_line_parameters')->insert($values + ['created_at' => date('Y-m-d H:i:s')]);
    }
    private static function syncRiskSections($functionId, array $sections): void
    {
        DB::table('transmission_line_risk_sections')->where('transmission_function_id', $functionId)->delete();
        foreach ($sections as $section)
            DB::table('transmission_line_risk_sections')->insert(['transmission_function_id' => $functionId, 'km_start' => self::decimalValue($section['km_start']), 'km_end' => self::decimalValue($section['km_end']), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
    }
    private static function validateTechnical(array $data, bool $creating, $id = null)
    {
        $parameters = array_key_exists('line_parameters', $data) ? $data['line_parameters'] : null;
        if (array_key_exists('line_parameters', $data) && $parameters !== null) {
            if (!is_array($parameters))
                return 'Informe os parâmetros técnicos em formato válido.';
            foreach (['voltage_level', 'nominal_current', 'line_length_km', 'r1', 'r0', 'x1', 'x0'] as $field) {
                $value = self::decimalValue($parameters[$field] ?? null);
                if (($parameters[$field] ?? null) !== null && ($parameters[$field] ?? '') !== '' && $value === null)
                    return 'Informe um valor decimal válido para ' . $field . '.';
                if (in_array($field, ['voltage_level', 'nominal_current', 'line_length_km'], true) && $value !== null && self::decimalCompare($value, '0') < 0)
                    return 'O valor de ' . $field . ' deve ser maior ou igual a zero.';
            }
        }
        if (array_key_exists('risk_sections', $data)) {
            if (!is_array($data['risk_sections']))
                return 'Informe os trechos de alto risco em formato válido.';
            $lineLength = null;
            if (is_array($parameters) && array_key_exists('line_length_km', $parameters))
                $lineLength = self::decimalValue($parameters['line_length_km']);
            elseif (!array_key_exists('line_parameters', $data) && !$creating)
                $lineLength = DB::table('transmission_line_parameters')->where('transmission_function_id', $id)->value('line_length_km');
            $ranges = [];
            foreach ($data['risk_sections'] as $section) {
                if (!is_array($section) || !array_key_exists('km_start', $section) || $section['km_start'] === '')
                    return 'Informe o km inicial do trecho de alto risco.';
                if (!array_key_exists('km_end', $section) || $section['km_end'] === '')
                    return 'Informe o km final do trecho de alto risco.';
                $start = self::decimalValue($section['km_start']);
                $end = self::decimalValue($section['km_end']);
                if ($start === null)
                    return 'Informe um km inicial válido.';
                if ($end === null)
                    return 'Informe um km final válido.';
                if (self::decimalCompare($start, '0') < 0 || self::decimalCompare($end, '0') < 0)
                    return 'Os kms do trecho de alto risco devem ser maiores ou iguais a zero.';
                if (self::decimalCompare($start, $end) >= 0)
                    return 'O km inicial deve ser menor que o km final.';
                if ($lineLength !== null && self::decimalCompare($end, $lineLength) > 0)
                    return 'O trecho de alto risco não pode ultrapassar o comprimento da linha.';
                $ranges[] = [$start, $end];
            }
            usort($ranges, fn($a, $b) => self::decimalCompare($a[0], $b[0]));
            for ($i = 1; $i < count($ranges); $i++)
                if (self::decimalCompare($ranges[$i][0], $ranges[$i - 1][1]) < 0)
                    return 'Existem trechos de alto risco sobrepostos.';
        }
        return null;
    }
    private static function decimalValue($value): ?string
    {
        if ($value === null)
            return null;
        $value = trim((string) $value);
        if ($value === '')
            return null;
        $value = str_replace(',', '.', $value);
        return preg_match('/^-?(?:\d+(?:\.\d*)?|\.\d+)$/', $value) ? $value : null;
    }
    private static function decimalCompare(string $left, string $right): int
    {
        $leftNegative = str_starts_with($left, '-');
        $rightNegative = str_starts_with($right, '-');
        $left = ltrim($left, '+-');
        $right = ltrim($right, '+-');
        [$leftInt, $leftDec] = array_pad(explode('.', $left, 2), 2, '');
        [$rightInt, $rightDec] = array_pad(explode('.', $right, 2), 2, '');
        $leftInt = ltrim($leftInt, '0') ?: '0';
        $rightInt = ltrim($rightInt, '0') ?: '0';
        $leftDec = rtrim($leftDec, '0');
        $rightDec = rtrim($rightDec, '0');
        $compare = strlen($leftInt) <=> strlen($rightInt) ?: strcmp($leftInt, $rightInt) ?: strcmp(str_pad($leftDec, max(strlen($leftDec), strlen($rightDec)), '0'), str_pad($rightDec, max(strlen($leftDec), strlen($rightDec)), '0'));
        if ($leftNegative !== $rightNegative)
            return $leftNegative ? -1 : 1;
        return $leftNegative ? -$compare : $compare;
    }
    private static function booleanValue($value): bool
    {
        return is_bool($value) ? $value : (filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1));
    }
    private static function isDuplicate(\Throwable $e): bool
    {
        $message = strtolower($e->getMessage());
        return strpos($message, 'duplicate') !== false || strpos($message, 'unique') !== false;
    }
}
