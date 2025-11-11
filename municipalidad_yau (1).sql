-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2025 a las 17:19:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `municipalidad_yau`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_logs`
--

CREATE TABLE `auditoria_logs` (
  `id_log` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `accion` varchar(150) NOT NULL,
  `nivel` enum('INFO','WARN','ERROR','AUDIT') DEFAULT 'INFO',
  `descripcion` text DEFAULT NULL,
  `origen` varchar(120) DEFAULT NULL,
  `ip_origen` varchar(45) DEFAULT NULL,
  `fecha_log` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_tramites`
--

CREATE TABLE `catalogo_tramites` (
  `id_catalogo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT 0.00,
  `requisitos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requisitos`)),
  `area_responsable` varchar(100) DEFAULT NULL,
  `duracion_estimada_dias` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_tramites`
--

INSERT INTO `catalogo_tramites` (`id_catalogo`, `nombre`, `descripcion`, `costo`, `requisitos`, `area_responsable`, `duracion_estimada_dias`, `activo`) VALUES
(1, 'Licencia de Funcionamiento', 'Permiso para operar un negocio o establecimiento comercial en el distrito.', 150.00, '[{\"id\":\"dni_titular\",\"label\":\"Copia de DNI del titular\",\"tipo\":\"doc\"},{\"id\":\"certificado_zonificacion\",\"label\":\"Certificado de zonificación\",\"tipo\":\"doc\"},{\"id\":\"recibo_pago\",\"label\":\"Recibo de pago por derecho de trámite\",\"tipo\":\"doc\"}]', 'Gerencia de Desarrollo Económico', 15, 1),
(2, 'Copia de Partida de Nacimiento', 'Obtención de copia certificada de la partida de nacimiento.', 25.50, '[{\"id\":\"nombre_inscrito\",\"label\":\"Nombres y apellidos completos del inscrito\",\"tipo\":\"info\"},{\"id\":\"fecha_nacimiento\",\"label\":\"Fecha de nacimiento del inscrito (aprox)\",\"tipo\":\"info\"},{\"id\":\"dni_solicitante\",\"label\":\"Copia de DNI del solicitante\",\"tipo\":\"doc\"}]', 'Registro Civil', 5, 1),
(3, 'Certificado de Domicilio', 'Constancia que acredita el domicilio actual del solicitante en el distrito.', 30.00, '[{\"id\":\"dni\",\"label\":\"Copia de DNI del solicitante\",\"tipo\":\"doc\"},{\"id\":\"recibo_servicio\",\"label\":\"Recibo de servicio (luz, agua) no mayor a 3 meses\",\"tipo\":\"doc\"},{\"id\":\"declaracion_jurada\",\"label\":\"Declaración jurada simple de domicilio\",\"tipo\":\"doc\"}]', 'Secretaría General', 3, 1),
(4, 'Permiso para Evento Temporal', 'Autorización para la realización de eventos temporales en espacios públicos.', 100.00, '[{\"id\":\"tipo_evento\",\"label\":\"Tipo de evento (social, cultural, etc.)\",\"tipo\":\"info\"},{\"id\":\"plan_seguridad\",\"label\":\"Plan de seguridad del evento\",\"tipo\":\"doc\"},{\"id\":\"autorizacion_defensa_civil\",\"label\":\"Copia de autorización de Defensa Civil\",\"tipo\":\"doc\"}]', 'Gerencia de Seguridad Ciudadana', 10, 1),
(5, 'Inscripción al Registro Vecinal', 'Registro de nuevos residentes en el distrito para acceder a beneficios y servicios municipales.', 0.00, '[{\"id\":\"dni\",\"label\":\"Copia de DNI\",\"tipo\":\"doc\"},{\"id\":\"titulo_propiedad_alquiler\",\"label\":\"Título de propiedad o contrato de alquiler\",\"tipo\":\"doc\"}]', 'Participación Vecinal', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contribuciones`
--

CREATE TABLE `contribuciones` (
  `id_contribucion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(80) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `atendido` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id_documento` int(10) UNSIGNED NOT NULL,
  `nombre_doc` varchar(150) NOT NULL,
  `url_archivo` varchar(300) DEFAULT NULL,
  `tipo` varchar(80) DEFAULT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_solicitud` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id_documento`, `nombre_doc`, `url_archivo`, `tipo`, `fecha_subida`, `id_solicitud`) VALUES
(1, 'descarga (2).pdf', 'subidas\\plan_seguridad-1762863016792-885985280.pdf', 'application/pdf', '2025-11-11 12:10:23', 2),
(2, 'descarga (1).pdf', 'subidas\\autorizacion_defensa_civil-1762863016793-293969764.pdf', 'application/pdf', '2025-11-11 12:10:23', 2),
(3, 'descarga.pdf', 'subidas\\dni-1762863687865-725309611.pdf', 'application/pdf', '2025-11-11 12:21:36', 3),
(4, 'descarga (2) (1).pdf', 'subidas\\recibo_servicio-1762863687869-679507244.pdf', 'application/pdf', '2025-11-11 12:21:36', 3),
(5, 'images.pdf', 'subidas\\declaracion_jurada-1762863687870-862974141.pdf', 'application/pdf', '2025-11-11 12:21:36', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_estados`
--

CREATE TABLE `historial_estados` (
  `id_historial` int(10) UNSIGNED NOT NULL,
  `id_solicitud` int(10) UNSIGNED NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) DEFAULT NULL,
  `usuario_responsable` int(10) UNSIGNED DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inspecciones`
--

CREATE TABLE `inspecciones` (
  `id_inspeccion` int(10) UNSIGNED NOT NULL,
  `fecha_programada` date NOT NULL,
  `fecha_realizacion` date DEFAULT NULL,
  `resultado` enum('Aprobado','Observado','Rechazado') DEFAULT 'Observado',
  `observaciones` text DEFAULT NULL,
  `id_inspector` int(10) UNSIGNED DEFAULT NULL,
  `id_solicitud` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20251109_consolidated_schema.js', 1, '2025-11-11 12:04:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(10) UNSIGNED NOT NULL,
  `id_solicitud` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tipo` enum('Email','SMS','Web') DEFAULT 'Email',
  `mensaje` text DEFAULT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(10) UNSIGNED NOT NULL,
  `id_solicitud` int(10) UNSIGNED NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Tarjeta','Transferencia','Efectivo') NOT NULL,
  `id_transaccion_externa` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Completado','Fallido') NOT NULL DEFAULT 'Pendiente',
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `predicciones_ml`
--

CREATE TABLE `predicciones_ml` (
  `id_prediccion` int(10) UNSIGNED NOT NULL,
  `id_solicitud` int(10) UNSIGNED NOT NULL,
  `modelo_usado` varchar(150) DEFAULT NULL,
  `tipo_prediccion` enum('Tiempo','Documentacion','Prioridad','Anomalia') DEFAULT NULL,
  `valor_predicho` varchar(200) DEFAULT NULL,
  `probabilidad` decimal(8,6) DEFAULT NULL,
  `fecha_prediccion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(10) UNSIGNED NOT NULL,
  `nombre_rol` enum('Administrador','Inspector','Ciudadano') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'Administrador'),
(2, 'Inspector'),
(3, 'Ciudadano');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` int(10) UNSIGNED NOT NULL,
  `codigo_seguimiento` varchar(40) NOT NULL,
  `id_catalogo` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'En revisión',
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_finalizacion` timestamp NULL DEFAULT NULL,
  `datos_especificos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_especificos`)),
  `prioridad_calculada` enum('Alta','Media','Baja') DEFAULT 'Media',
  `documentacion_completa` tinyint(1) DEFAULT 0,
  `tiempo_estimado_ml` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id_solicitud`, `codigo_seguimiento`, `id_catalogo`, `id_usuario`, `estado`, `fecha_solicitud`, `fecha_finalizacion`, `datos_especificos`, `prioridad_calculada`, `documentacion_completa`, `tiempo_estimado_ml`) VALUES
(2, 'YAU-2025-A750B619', 4, 1, 'En revisión', '2025-11-11 12:10:23', NULL, '{\"tipo_evento\":\"dada\",\"fecha_evento\":\"2025-11-11T12:10:01.005Z\"}', 'Alta', 0, NULL),
(3, 'YAU-2025-B3C03522', 3, 1, 'En revisión', '2025-11-11 12:21:36', NULL, '{\"fecha_evento\":\"2025-11-11T12:19:12.903Z\"}', 'Media', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre_completo` varchar(120) NOT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `id_rol` int(10) UNSIGNED NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `dni`, `correo`, `contrasena`, `telefono`, `direccion`, `id_rol`, `activo`, `fecha_registro`) VALUES
(1, 'Diego Lezama', NULL, 'diegolezama008@gmail.com', NULL, NULL, NULL, 1, 1, '2025-11-11 12:09:51');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `auditoria_logs_id_usuario_foreign` (`id_usuario`);

--
-- Indices de la tabla `catalogo_tramites`
--
ALTER TABLE `catalogo_tramites`
  ADD PRIMARY KEY (`id_catalogo`),
  ADD UNIQUE KEY `catalogo_tramites_nombre_unique` (`nombre`);

--
-- Indices de la tabla `contribuciones`
--
ALTER TABLE `contribuciones`
  ADD PRIMARY KEY (`id_contribucion`),
  ADD KEY `contribuciones_id_usuario_foreign` (`id_usuario`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id_documento`),
  ADD KEY `documentos_id_solicitud_foreign` (`id_solicitud`);

--
-- Indices de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `historial_estados_id_solicitud_foreign` (`id_solicitud`),
  ADD KEY `historial_estados_usuario_responsable_foreign` (`usuario_responsable`);

--
-- Indices de la tabla `inspecciones`
--
ALTER TABLE `inspecciones`
  ADD PRIMARY KEY (`id_inspeccion`),
  ADD KEY `inspecciones_id_inspector_foreign` (`id_inspector`),
  ADD KEY `inspecciones_id_solicitud_foreign` (`id_solicitud`);

--
-- Indices de la tabla `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `notificaciones_id_solicitud_foreign` (`id_solicitud`),
  ADD KEY `notificaciones_id_usuario_foreign` (`id_usuario`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `pagos_id_transaccion_externa_unique` (`id_transaccion_externa`),
  ADD KEY `pagos_id_solicitud_foreign` (`id_solicitud`),
  ADD KEY `idx_pagos_estado` (`estado`);

--
-- Indices de la tabla `predicciones_ml`
--
ALTER TABLE `predicciones_ml`
  ADD PRIMARY KEY (`id_prediccion`),
  ADD KEY `predicciones_ml_id_solicitud_foreign` (`id_solicitud`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `roles_nombre_rol_unique` (`nombre_rol`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD UNIQUE KEY `solicitudes_codigo_seguimiento_unique` (`codigo_seguimiento`),
  ADD KEY `solicitudes_id_catalogo_foreign` (`id_catalogo`),
  ADD KEY `solicitudes_id_usuario_foreign` (`id_usuario`),
  ADD KEY `idx_solicitudes_estado` (`estado`),
  ADD KEY `idx_solicitudes_fecha` (`fecha_solicitud`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuarios_correo_unique` (`correo`),
  ADD UNIQUE KEY `usuarios_dni_unique` (`dni`),
  ADD KEY `usuarios_id_rol_foreign` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  MODIFY `id_log` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `catalogo_tramites`
--
ALTER TABLE `catalogo_tramites`
  MODIFY `id_catalogo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `contribuciones`
--
ALTER TABLE `contribuciones`
  MODIFY `id_contribucion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id_documento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  MODIFY `id_historial` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inspecciones`
--
ALTER TABLE `inspecciones`
  MODIFY `id_inspeccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `predicciones_ml`
--
ALTER TABLE `predicciones_ml`
  MODIFY `id_prediccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD CONSTRAINT `auditoria_logs_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `contribuciones`
--
ALTER TABLE `contribuciones`
  ADD CONSTRAINT `contribuciones_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD CONSTRAINT `historial_estados_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_estados_usuario_responsable_foreign` FOREIGN KEY (`usuario_responsable`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `inspecciones`
--
ALTER TABLE `inspecciones`
  ADD CONSTRAINT `inspecciones_id_inspector_foreign` FOREIGN KEY (`id_inspector`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `inspecciones_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `predicciones_ml`
--
ALTER TABLE `predicciones_ml`
  ADD CONSTRAINT `predicciones_ml_id_solicitud_foreign` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_id_catalogo_foreign` FOREIGN KEY (`id_catalogo`) REFERENCES `catalogo_tramites` (`id_catalogo`),
  ADD CONSTRAINT `solicitudes_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_id_rol_foreign` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
