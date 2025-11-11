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
      t.string('contrasena', 255).nullable(); // Permitir nulos para login social
      t.string('telefono', 20);
      t.string('direccion', 200);
      t.integer('id_rol').unsigned().notNullable().references('id_rol').inTable('roles').onDelete('RESTRICT');
      t.boolean('activo').notNullable().defaultTo(true); // Columna para activar/desactivar usuarios
      t.timestamp('fecha_registro').defaultTo(knex.fn.now());
    })

    // --- INICIO DEL REDISEÑO ---

    // 1. NUEVA TABLA: Catálogo de todos los trámites disponibles.
    .createTable('catalogo_tramites', (t) => {
      t.increments('id_catalogo').primary();
      t.string('nombre', 150).notNullable().unique();
      t.text('descripcion');
      t.decimal('costo', 10, 2).defaultTo(0.00);
      t.jsonb('requisitos'); // Campo flexible para listar requisitos como: [{"id":"dni","label":"Copia DNI","tipo":"doc"}]
      t.string('area_responsable', 100);
      t.integer('duracion_estimada_dias');
      t.boolean('activo').defaultTo(true);
    })

    // 2. TABLA RENOMBRADA Y AJUSTADA: De 'tramites' a 'solicitudes'.
    .createTable('solicitudes', (t) => {
      t.increments('id_solicitud').primary();
      t.string('codigo_seguimiento', 40).notNullable().unique();
      t.integer('id_catalogo').unsigned().notNullable().references('id_catalogo').inTable('catalogo_tramites').onDelete('RESTRICT');
      t.integer('id_usuario').unsigned().notNullable().references('id_usuario').inTable('usuarios').onDelete('RESTRICT');
      t.string('estado', 50).notNullable().defaultTo('En revisión');
      t.timestamp('fecha_solicitud').defaultTo(knex.fn.now());
      t.timestamp('fecha_finalizacion').nullable();
      t.jsonb('datos_especificos'); // Datos variables para cada solicitud (ej: area_m2, tipo_evento)
      t.enu('prioridad_calculada', ['Alta', 'Media', 'Baja']).defaultTo('Media');
      t.boolean('documentacion_completa').defaultTo(false);
      t.integer('tiempo_estimado_ml');
    })

    // --- FIN DEL REDISEÑO ---

    // PAGOS
    .createTable('pagos', (t) => {
        t.increments('id_pago').primary();
        t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
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
      t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
    })
    // INSPECCIONES
    .createTable('inspecciones', (t) => {
      t.increments('id_inspeccion').primary();
      t.date('fecha_programada').notNullable();
      t.date('fecha_realizacion');
      t.enu('resultado', ['Aprobado', 'Observado', 'Rechazado']).defaultTo('Observado');
      t.text('observaciones');
      t.integer('id_inspector').unsigned().references('id_usuario').inTable('usuarios').onDelete('SET NULL');
      t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
    })
    // NOTIFICACIONES
    .createTable('notificaciones', (t) => {
      t.increments('id_notificacion').primary();
      t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
      t.integer('id_usuario').unsigned().notNullable().references('id_usuario').inTable('usuarios').onDelete('CASCADE');
      t.enu('tipo', ['Email', 'SMS', 'Web']).defaultTo('Email');
      t.text('mensaje');
      t.timestamp('fecha_envio').defaultTo(knex.fn.now());
      t.boolean('leido').defaultTo(false);
    })
    // HISTORIAL_ESTADOS
    .createTable('historial_estados', (t) => {
      t.increments('id_historial').primary();
      t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
      t.string('estado_anterior', 50);
      t.string('estado_nuevo', 50);
      t.integer('usuario_responsable').unsigned().references('id_usuario').inTable('usuarios').onDelete('SET NULL');
      t.timestamp('fecha_cambio').defaultTo(knex.fn.now());
    })
    // PREDICCIONES_ML
    .createTable('predicciones_ml', (t) => {
      t.increments('id_prediccion').primary();
      t.integer('id_solicitud').unsigned().notNullable().references('id_solicitud').inTable('solicitudes').onDelete('CASCADE');
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

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes (estado)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes (fecha_solicitud)');
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
    .dropTableIfExists('solicitudes')
    .dropTableIfExists('catalogo_tramites')
    .dropTableIfExists('usuarios')
    .dropTableIfExists('roles');
}
