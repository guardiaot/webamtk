<?php

use Illuminate\Database\Capsule\Manager as DB;

return function (): void {

    DB::statement("
        CREATE TABLE role_permissions (
            role_id BIGINT NOT NULL,
            permission_id BIGINT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT pk_role_permissions
                PRIMARY KEY (role_id, permission_id),

            CONSTRAINT fk_role_permissions_role
                FOREIGN KEY (role_id)
                REFERENCES roles(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_role_permissions_permission
                FOREIGN KEY (permission_id)
                REFERENCES permissions(id)
                ON DELETE CASCADE
        )
    ");

    DB::statement("
        CREATE INDEX idx_role_permissions_permission_id
        ON role_permissions (permission_id)
    ");
};