export async function up(knex) {
  await knex.schema
    // ROLES Y USUARIOS
    .createTable('roles', (t) => {
      t.increments('id_rol').primary();
      t.enu('nombre_rol', ['Administrador', 'Inspector', 'Ciudadano']).notNullable().unique();
    })
    .createTable('usuarios', (t) => {
      t.increments('id_usuario').primary();
      t.string('nombre_completo', 120).notNullable();
      t.string('dni', 8).unique();
      t.string('correo', 100).notNullable().unique();
      t.string('contrasena', 255).notNullable();
      t.string('telefono', 20);
      t.string('direccion', 200);
      t.integer('id_rol').unsigned().notNullable().references('id_rol').inTable('roles').onDelete('RESTRICT');
      t.timestamp('fecha_registro').defaultTo(knex.fn.now());
    })
    // TRAMITES
    .createTable('tramites', (t) => {
      t.increments('id_tramite').primary();
      t.string('codigo_tramite', 40).notNullable().unique();
      t.string('tipo_tramite', 100).notNullable();
      t.decimal('area_m2', 10, 2).notNullable();
      t.string('distrito', 80);
      t.string('zona', 50);
      t.smallint('complejidad').notNullable();
      t.string('estado', 50).notNullable().defaultTo('En revisión');
      t.enu('prioridad', ['Alta', 'Media', 'Baja']).defaultTo('Media');
      t.boolean('documentacion_completa').defaultTo(false);
      t.decimal('tiempo_estimado', 6, 2);
      t.date('fecha_inicio').defaultTo(knex.fn.now());
      t.date('fecha_fin');
      t.integer('id_usuario').unsigned().notNullable().references('id_usuario').inTable('usuarios').onDelete('RESTRICT');
    })
    // PAGOS
    .createTable('pagos', (t) => {
        t.increments('id_pago').primary();
        t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
        t.decimal('monto', 10, 2).notNullable();
        t.enu('metodo_pago', ['Tarjeta', 'Transferencia', 'Efectivo']).notNullable();
        t.string('id_transaccion_externa').unique();
        t.enu('estado', ['Pendiente', 'Completado', 'Fallido']).notNullable().defaultTo('Pendiente');
        t.timestamp('fecha_pago').defaultTo(knex.fn.now());
        t.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
    })
    // DOCUMENTOS
    .createTable('documentos', (t) => {
      t.increments('id_documento').primary();
      t.string('nombre_doc', 150).notNullable();
      t.string('url_archivo', 300);
      t.string('tipo', 80);
      t.timestamp('fecha_subida').defaultTo(knex.fn.now());
      t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
    })
    // INSPECCIONES
    .createTable('inspecciones', (t) => {
      t.increments('id_inspeccion').primary();
      t.date('fecha_programada').notNullable();
      t.date('fecha_realizacion');
      t.enu('resultado', ['Aprobado', 'Observado', 'Rechazado']).defaultTo('Observado');
      t.text('observaciones');
      t.integer('id_inspector').unsigned().references('id_usuario').inTable('usuarios').onDelete('SET NULL');
      t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
    })
    // NOTIFICACIONES
    .createTable('notificaciones', (t) => {
      t.increments('id_notificacion').primary();
      t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
      t.integer('id_usuario').unsigned().notNullable().references('id_usuario').inTable('usuarios').onDelete('CASCADE');
      t.enu('tipo', ['Email', 'SMS', 'Web']).defaultTo('Email');
      t.text('mensaje');
      t.timestamp('fecha_envio').defaultTo(knex.fn.now());
      t.boolean('leido').defaultTo(false);
    })
    // HISTORIAL_ESTADOS
    .createTable('historial_estados', (t) => {
      t.increments('id_historial').primary();
      t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
      t.string('estado_anterior', 50);
      t.string('estado_nuevo', 50);
      t.integer('usuario_responsable').unsigned().references('id_usuario').inTable('usuarios').onDelete('SET NULL');
      t.timestamp('fecha_cambio').defaultTo(knex.fn.now());
    })
    // PREDICCIONES_ML
    .createTable('predicciones_ml', (t) => {
      t.increments('id_prediccion').primary();
      t.integer('id_tramite').unsigned().notNullable().references('id_tramite').inTable('tramites').onDelete('CASCADE');
      t.string('modelo_usado', 150);
      t.enu('tipo_prediccion', ['Tiempo', 'Documentacion', 'Prioridad', 'Anomalia']);
      t.string('valor_predicho', 200);
      t.decimal('probabilidad', 8, 6);
      t.timestamp('fecha_prediccion').defaultTo(knex.fn.now());
    })
    // CONTRIBUCIONES
    .createTable('contribuciones', (t) => {
        t.increments('id_contribucion').primary();
        t.integer('id_usuario').unsigned().references('id_usuario').inTable('usuarios').onDelete('CASCADE');
        t.string('titulo', 150).notNullable();
        t.text('descripcion').notNullable();
        t.string('categoria', 80).notNullable(); // sugerencia, queja, mejora
        t.timestamp('fecha_envio').defaultTo(knex.fn.now());
        t.boolean('atendido').defaultTo(false);
    })
    // AUDITORIA_LOGS
    .createTable('auditoria_logs', (t) => {
        t.increments('id_log').primary();
        t.integer('id_usuario').unsigned().references('id_usuario').inTable('usuarios').onDelete('SET NULL');
        t.string('accion', 150).notNullable();
        t.enu('nivel', ['INFO', 'WARN', 'ERROR', 'AUDIT']).defaultTo('INFO');
        t.text('descripcion');
        t.string('origen', 120);
        t.string('ip_origen', 45);
        t.timestamp('fecha_log').defaultTo(knex.fn.now());
    });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_tramites_estado ON tramites (estado)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_tramites_fecha_inicio ON tramites (fecha_inicio)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos (estado)');
}

export async function down(knex) {
  await knex.schema
    .dropTableIfExists('auditoria_logs')
    .dropTableIfExists('contribuciones')
    .dropTableIfExists('predicciones_ml')
    .dropTableIfExists('historial_estados')
    .dropTableIfExists('notificaciones')
    .dropTableIfExists('inspecciones')
    .dropTableIfExists('documentos')
    .dropTableIfExists('pagos')
    .dropTableIfExists('tramites')
    .dropTableIfExists('usuarios')
    .dropTableIfExists('roles');
}
