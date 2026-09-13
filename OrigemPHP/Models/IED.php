<?php

namespace OrigemPHP\Models;

use Illuminate\Database\Eloquent\Model;

class IED extends Model
{
    protected $table = 'ieds';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'agent_id',
        'code',
        'name',
        'manufacturer',
        'model',
        'host',
        'port',
        'status',
        'source',
        'response_time_us',
        'last_check',
        'last_seen',
        'failures',
        'checks',
        'consecutive_failures',
        'transmission_function_id',
    ];

    protected $casts = [
        'port' => 'integer',
        'response_time_us' => 'integer',
        'failures' => 'integer',
        'checks' => 'integer',
        'consecutive_failures' => 'integer',
        'transmission_function_id' => 'integer',
        'last_check' => 'datetime',
        'last_seen' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(
            Agent::class,
            'agent_id',
            'id'
        );
    }

    public function events()
    {
        return $this->hasMany(
            Event::class,
            'ied_id',
            'id'
        );
    }

    public function telemetry()
    {
        return $this->hasMany(
            Telemetry::class,
            'ied_id',
            'id'
        );
    }

    public static function cadastrar(array $data): int
    {
        $name = strtoupper(trim($data['name']));
        $name = preg_replace('/[\s_]+/', '-', $name);

        $model = strtoupper(trim($data['model']));
        $model = preg_replace('/[\s_]+/', '-', $model);

        $manufacturer = strtoupper(trim($data['manufacturer']));
        $manufacturer = preg_replace('/[\s_]+/', '-', $manufacturer);

        $registro = self::create([
            'agent_id' => $data['agent_id'] ?? null,
            'name' => $name,
            'code' => 'ied-'.strtoupper($name),
            'manufacturer' => $manufacturer ?? null,
            'model' => $model ?? null,
            'host' => $data['host'],
            'port' => $data['port'],
            'status' => $data['status'] ?? 'unknown',
            'source' => $data['source'] ?? 'manual',
            'response_time_us' => $data['response_time_us'] ?? 0,
            'last_check' => $data['last_check'] ?? null,
            'last_seen' => $data['last_seen'] ?? null,
            'failures' => $data['failures'] ?? 0,
            'checks' => $data['checks'] ?? 0,
            'consecutive_failures' => $data['consecutive_failures'] ?? 0,
        ]);

        return (int) $registro->id;
    }
}
