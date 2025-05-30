-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-05-2025 a las 06:07:14
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
-- Base de datos: `fintech_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dni_tipos`
--

CREATE TABLE `dni_tipos` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `dni_tipos` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dni_tipos`
--

INSERT INTO `dni_tipos` (`created_at`, `updated_at`, `id`, `dni_tipos`) VALUES
('2025-05-30 03:51:03.052678', '2025-05-30 03:51:03.052678', 1, 'CC'),
('2025-05-30 03:51:03.098887', '2025-05-30 03:51:03.098887', 2, 'PAS'),
('2025-05-30 03:51:03.216095', '2025-05-30 03:51:03.216095', 3, 'CE'),
('2025-05-30 03:51:03.255046', '2025-05-30 03:51:03.255046', 4, 'NIT');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `estado` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`created_at`, `updated_at`, `id`, `estado`) VALUES
('2025-05-30 03:51:02.284439', '2025-05-30 03:51:02.284439', 1, 'Activo'),
('2025-05-30 03:51:02.390749', '2025-05-30 03:51:02.390749', 2, 'Inactivo'),
('2025-05-30 03:51:02.450636', '2025-05-30 03:51:02.450636', 3, 'Operativo'),
('2025-05-30 03:51:02.488070', '2025-05-30 03:51:02.488070', 4, 'Suspendido'),
('2025-05-30 03:51:02.539194', '2025-05-30 03:51:02.539194', 5, 'Desconectado'),
('2025-05-30 03:51:02.668445', '2025-05-30 03:51:02.668445', 6, 'Registrado'),
('2025-05-30 03:51:02.717614', '2025-05-30 03:51:02.717614', 7, 'Retirado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estratos`
--

CREATE TABLE `estratos` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `estrato` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estratos`
--

INSERT INTO `estratos` (`created_at`, `updated_at`, `id`, `estrato`) VALUES
('2025-05-30 03:51:02.953054', '2025-05-30 03:51:02.953054', 1, '1'),
('2025-05-30 03:51:02.997826', '2025-05-30 03:51:02.997826', 2, '2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1748576766016, 'Initial1748576766016');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `role` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`created_at`, `updated_at`, `id`, `role`) VALUES
('2025-05-30 03:51:01.803985', '2025-05-30 03:51:01.803985', 1, 'Administrador'),
('2025-05-30 03:51:01.862439', '2025-05-30 03:51:01.862439', 2, 'Jefe de zona'),
('2025-05-30 03:51:02.169052', '2025-05-30 03:51:02.169052', 3, 'Proveedor'),
('2025-05-30 03:51:02.229946', '2025-05-30 03:51:02.229946', 4, 'Beneficiario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sexos`
--

CREATE TABLE `sexos` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `sexo` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sexos`
--

INSERT INTO `sexos` (`created_at`, `updated_at`, `id`, `sexo`) VALUES
('2025-05-30 03:51:02.778745', '2025-05-30 03:51:02.778745', 1, 'Masculino'),
('2025-05-30 03:51:02.820493', '2025-05-30 03:51:02.820493', 2, 'Femenino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `dni` varchar(100) DEFAULT NULL,
  `contrato` varchar(100) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `codigo_departamento` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `codigo_municipio` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `via_principal_clave` varchar(100) DEFAULT NULL,
  `via_principal_valor` varchar(100) DEFAULT NULL,
  `via_secundaria_clave` varchar(100) DEFAULT NULL,
  `via_secundaria_valor` varchar(100) DEFAULT NULL,
  `tipo_unidad_uno_clave` varchar(100) DEFAULT NULL,
  `tipo_unidad_uno_valor` varchar(100) DEFAULT NULL,
  `tipo_unidad_dos_clave` varchar(100) DEFAULT NULL,
  `tipo_unidad_dos_valor` varchar(100) DEFAULT NULL,
  `barrio` varchar(100) DEFAULT NULL,
  `latitud` varchar(100) DEFAULT NULL,
  `longitud` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono_uno` varchar(100) DEFAULT NULL,
  `telefono_dos` varchar(100) DEFAULT NULL,
  `Telefono_tres` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` varchar(100) DEFAULT NULL,
  `anexo` text DEFAULT NULL,
  `dni_tipos_id` int(10) UNSIGNED DEFAULT NULL,
  `estados_id` int(10) UNSIGNED DEFAULT NULL,
  `sexos_id` int(10) UNSIGNED DEFAULT NULL,
  `estratos_id` int(10) UNSIGNED DEFAULT NULL,
  `roles_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`created_at`, `updated_at`, `id`, `nombre`, `apellido`, `dni`, `contrato`, `nacionalidad`, `codigo_departamento`, `departamento`, `codigo_municipio`, `municipio`, `via_principal_clave`, `via_principal_valor`, `via_secundaria_clave`, `via_secundaria_valor`, `tipo_unidad_uno_clave`, `tipo_unidad_uno_valor`, `tipo_unidad_dos_clave`, `tipo_unidad_dos_valor`, `barrio`, `latitud`, `longitud`, `direccion`, `telefono_uno`, `telefono_dos`, `Telefono_tres`, `password`, `email`, `fecha_nacimiento`, `anexo`, `dni_tipos_id`, `estados_id`, `sexos_id`, `estratos_id`, `roles_id`) VALUES
('2025-05-30 03:51:03.472472', '2025-05-30 03:51:03.472472', 1, 'Juan', 'Pérez', '123456789', 'Contrato-001', 'Colombiana', '05', 'Antioquia', '05001', 'Medellín', 'CL', '50', 'CR', '30', 'AP', '302', 'ET', '1', 'El Poblado', '6.2442', '-75.5812', 'Cra 30 #50-302', '3001234567', '3107654321', '3201112233', '$2b$10$DGTMk9GSzJEqqTkOkHZeSe8GRvviHAHVLkBLGdoLZUf2iHyFVYAfW', 'juan.perez@example.com', '1990-05-20 00:00:00.000', '', 1, 1, 1, 1, 1),
('2025-05-30 03:51:03.582192', '2025-05-30 03:51:03.582192', 2, 'Ana', 'Gómez', '987654321', 'Contrato-002', 'Colombiana', '08', 'Atlántico', '08001', 'Barranquilla', 'AV', '10', 'CL', '12', 'CA', '5', 'PT', '1', 'El Prado', '10.9685', '-74.7813', 'Av 10 #12-5', '3007654321', '3101234567', '3203334444', '$2b$10$ZZQBj1NC1m6czDpyWg8cz..ttCVlBZ/wpwFaH3kouHGdaZBTXbRNy', 'ana.gomez@example.com', '1985-08-10 00:00:00.000', '', 2, 1, 2, 2, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dni_tipos`
--
ALTER TABLE `dni_tipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estratos`
--
ALTER TABLE `estratos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sexos`
--
ALTER TABLE `sexos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ce3ae280065412e091a080372f5` (`dni_tipos_id`),
  ADD KEY `FK_2085bf8ad0172da09676fa67d76` (`estados_id`),
  ADD KEY `FK_ad0600ba0c3ccd924ddfd2de481` (`sexos_id`),
  ADD KEY `FK_81432c4eb8f9e176a4dc0f8c0fb` (`estratos_id`),
  ADD KEY `FK_28de221731be7761ba1b165df08` (`roles_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dni_tipos`
--
ALTER TABLE `dni_tipos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estratos`
--
ALTER TABLE `estratos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sexos`
--
ALTER TABLE `sexos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FK_2085bf8ad0172da09676fa67d76` FOREIGN KEY (`estados_id`) REFERENCES `estados` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_28de221731be7761ba1b165df08` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_81432c4eb8f9e176a4dc0f8c0fb` FOREIGN KEY (`estratos_id`) REFERENCES `estratos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ad0600ba0c3ccd924ddfd2de481` FOREIGN KEY (`sexos_id`) REFERENCES `sexos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ce3ae280065412e091a080372f5` FOREIGN KEY (`dni_tipos_id`) REFERENCES `dni_tipos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
