-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-05-2026 a las 18:53:14
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
-- Base de datos: `sistema_soporte`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id`, `nombre`) VALUES
(3, 'direccion'),
(1, 'recursos_financieros'),
(2, 'recursos_humanos'),
(4, 'servicios_escolares');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'hardware'),
(4, 'mantenimiento_preventivo'),
(5, 'otro'),
(3, 'red'),
(2, 'software');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id`, `nombre`) VALUES
(2, 'en_proceso'),
(1, 'pendiente'),
(3, 'resuelto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles_tecnicos`
--

CREATE TABLE `perfiles_tecnicos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `foto_url` varchar(255) DEFAULT 'assets/iconos/IconoUsuario.png',
  `nombre_publico` varchar(100) NOT NULL,
  `carrera` varchar(100) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfiles_tecnicos`
--

INSERT INTO `perfiles_tecnicos` (`id`, `usuario_id`, `foto_url`, `nombre_publico`, `carrera`, `especialidad`, `fecha_registro`, `area_id`) VALUES
(1, 15, 'https://ui-avatars.com/api/?name=Oliver+Flores&background=0D8ABC&color=fff&size=150', 'Oliver Flores', 'Ingeniería en sistemas computacionales', 'Ingeniería en software', '2026-04-14 18:13:21', 3),
(2, 10, 'https://ui-avatars.com/api/?name=Angelica+Alvarez&background=0D8ABC&color=fff&size=150', 'Angélica Álvarez Rivero', 'Ingeniería en Sistemas Computacionales', 'Project Management', '2026-05-06 16:37:33', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prioridades`
--

CREATE TABLE `prioridades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prioridades`
--

INSERT INTO `prioridades` (`id`, `nombre`) VALUES
(3, 'alta'),
(1, 'baja'),
(4, 'critica'),
(2, 'media');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `equipo_id` varchar(50) NOT NULL,
  `evidencia` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `solucion_texto` text DEFAULT NULL,
  `evidencia_url` varchar(255) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `prioridad_id` int(11) DEFAULT NULL,
  `estado_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `usuario_id`, `asunto`, `descripcion`, `equipo_id`, `evidencia`, `fecha_creacion`, `fecha_actualizacion`, `solucion_texto`, `evidencia_url`, `categoria_id`, `prioridad_id`, `estado_id`) VALUES
(7, 11, 'computadora vieja', 'la computadora esta ieja y no puedo trabajar asi', 'itc-2028', NULL, '2026-04-13 22:06:20', '2026-05-06 15:54:13', NULL, NULL, 5, 3, 1),
(8, 11, 'mi mouse no funciona se traba', 'mi mouse se conecta y desconecta solo', 'itc-4748', NULL, '2026-04-13 22:07:12', '2026-05-06 15:54:13', NULL, NULL, 1, 2, 1),
(9, 11, 'mi pantalla se ve azul y a veces verde ', 'estaba trabajando se escucho un clic en elmonitor y empezo a cambiar de color azul y verde ', 'itc-4634', NULL, '2026-04-13 22:08:22', '2026-05-06 15:54:13', NULL, NULL, 1, 2, 1),
(10, 13, 'mi teclado no funciona', 'la linea de emedio de mi teclado no funciona y no me deja escribir', 'itc-4789', NULL, '2026-04-13 22:09:29', '2026-05-06 15:54:13', NULL, NULL, 1, 3, 1),
(11, 13, 'mi cpu hace mucho ruido', 'no afecta en nada de lo que hago hasta el momento pero me preocupa que empeore mas adelante', 'itc-1234', NULL, '2026-04-13 22:10:29', '2026-05-06 15:54:13', NULL, NULL, 1, 1, 2),
(12, 13, 'mi computadora se apaga', 'tengo unos documentos en la computadora que ocupo entregar y no quiere encender, ayuda!!!!!!', 'itc-96385', NULL, '2026-04-13 22:11:34', '2026-05-06 15:54:13', 'se cambio al fuente de poder porque fallaba', 'http://localhost:5000/static/evidencias/folio_12_WIN_20250603_14_34_38_Pro.jpg', 1, 4, 3),
(13, 14, 'el puerto usb de mi computadora no lee mi usb', 'intento leer un usb en mi computadora que se que en otras si puedo leer\n\n', 'itc-4759', NULL, '2026-04-13 22:13:34', '2026-05-06 15:54:13', NULL, NULL, 1, 4, 3),
(14, 14, 'mamo mi ', 'soy el jefe de departamento y estaba acomodando la computadora y se me cayo', 'itc-4239', NULL, '2026-04-13 22:14:22', '2026-05-06 15:54:13', 'dejo de mamar la compu', 'http://localhost:5000/static/evidencias/folio_14_WIN_20250603_14_35_57_Pro.jpg', 2, 4, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'tecnico'),
(3, 'usuario_basico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `rol_id` int(11) DEFAULT NULL,
  `area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `password`, `foto_url`, `rol_id`, `area_id`) VALUES
(9, 'Erick de jesus', 'prueba@tecnm.mx', 'scrypt:32768:8:1$pfx8GtuqCTjSJPdE$616691c98076c6c61cb23382f6e1c7ae3a25ad34976660ee7548f096b41627db3d3019a697919c4871d2c16620f051759c9bc0b6bb0c402064883a690e9bc11a', 'http://localhost:5000/static/profile_pics/user_9_A-Vista_Principal.jpg', 1, 1),
(10, 'angelica alvarez rivero', 'angelica@tecnm.mx', 'scrypt:32768:8:1$H5Qrh706Ki5vhOmN$be4d070d5edd06f1790943d25617bb1a78b0bf33d7f8e3cfd15c2d3d1181d7e1ea8f0c172f398137eb49da4997319d6126bebe50ac364b348a3881592c641ca3', 'http://localhost:5000/static/profile_pics/user_10_Captura_de_pantalla_2025-04-08_211110.png', 2, 2),
(11, 'Brian Enrique', 'Brian@tecnm.mx', 'scrypt:32768:8:1$1PtyMhF8fSeMhDbK$a9e2e9a6ee56741cc64d101fd1cdf69de9209a44e315198ffc29255ceee183904b66cbc16c874972e7ca5f88bec26c6041368eb8fd38986c64720d92eb648035', NULL, 3, 3),
(13, 'Zeuz olimpo', 'zeuz@tecnm.mx', 'scrypt:32768:8:1$UXRO8rp7lsvuxMOY$d53f30a7d08a3259fa676989f05e3ce979b3832cb024f6b37debab2f42d813837700da65d3de0e3ac7e79a768e5d841e7d0f6f546574781c8bfa8556df01a9e4', NULL, 3, 4),
(14, 'Rafita', 'rafa@tecnm.mx', 'scrypt:32768:8:1$ZK8ZLk4iAnT0Fxxb$d7a5a6953cc88639af96d3de9370b96a9afebcf8aae6272e6de9f0941d909a20adfb512a810205e7f1d229625ef84b1008e2a1abd8fbb12487bb430da4f7faa0', NULL, 3, 2),
(15, 'Oliver', 'oli@tecnm.mx', 'scrypt:32768:8:1$HFGpBGjzPsAIYV6y$c20b82ef42d578a245c01d465762d5392b9adfdcbc5e980f56f5d867ea56da5c30b0ba1c82828be3c5ddd06a2e4baaf2ed7ea959e8387c0a97c466abdee33506', NULL, 2, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `perfiles_tecnicos`
--
ALTER TABLE `perfiles_tecnicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_pt_area` (`area_id`);

--
-- Indices de la tabla `prioridades`
--
ALTER TABLE `prioridades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_rep_cat` (`categoria_id`),
  ADD KEY `fk_rep_prio` (`prioridad_id`),
  ADD KEY `fk_rep_est` (`estado_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuarios_rol` (`rol_id`),
  ADD KEY `fk_usuarios_area` (`area_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `perfiles_tecnicos`
--
ALTER TABLE `perfiles_tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `prioridades`
--
ALTER TABLE `prioridades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `perfiles_tecnicos`
--
ALTER TABLE `perfiles_tecnicos`
  ADD CONSTRAINT `fk_pt_area` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`),
  ADD CONSTRAINT `perfiles_tecnicos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `fk_rep_cat` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `fk_rep_est` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `fk_rep_prio` FOREIGN KEY (`prioridad_id`) REFERENCES `prioridades` (`id`),
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_area` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`),
  ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
