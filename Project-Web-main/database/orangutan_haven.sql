-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 10 Jun 2026 pada 06.39
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orangutan_haven`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `activity` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$rQZ9QxZQxZQxZQxZQxZQxOZJ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', '2026-06-10 03:49:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` enum('Published','Draft') DEFAULT 'Published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `articles`
--

INSERT INTO `articles` (`id`, `title`, `category`, `thumbnail`, `content`, `status`, `created_at`) VALUES
(1, 'Mengenal Orangutan Sumatera', 'Education', NULL, 'Orangutan Sumatera merupakan salah satu spesies orangutan yang hanya ditemukan di Pulau Sumatera dan termasuk satwa yang terancam punah. Mereka memiliki peran penting dalam ekosistem hutan sebagai penyebar biji yang membantu regenerasi hutan.', 'Published', '2026-06-10 03:49:15'),
(2, 'Ancaman Terhadap Orangutan', 'Conservation', NULL, 'Perusakan habitat, perburuan liar, dan perdagangan satwa ilegal menjadi ancaman terbesar bagi kelangsungan hidup orangutan. Dalam beberapa dekade terakhir, populasi orangutan Sumatera telah menurun drastis akibat konversi hutan menjadi perkebunan kelapa sawit.', 'Published', '2026-06-10 03:49:15'),
(3, 'Pentingnya Konservasi Hutan', 'Conservation', NULL, 'Hutan merupakan habitat utama orangutan. Upaya konservasi hutan sangat penting untuk menjaga keberlangsungan spesies ini. Setiap hektar hutan yang diselamatkan berarti menyelamatkan ribuan pohon dan satwa yang bergantung padanya.', 'Published', '2026-06-10 03:49:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('BCA','BNI','BRI','Mandiri','Dana','OVO','GoPay','QRIS') NOT NULL,
  `status` enum('Success') DEFAULT 'Success',
  `donated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
(1, 'Apa itu Orangutan Haven?', 'Orangutan Haven adalah pusat konservasi yang memberikan tempat tinggal aman bagi orangutan yang tidak dapat kembali ke alam liar.'),
(2, 'Bagaimana cara berdonasi?', 'Masuk ke akun Anda, buka halaman Donation, pilih nominal donasi dan metode pembayaran yang tersedia.'),
(3, 'Ke mana dana donasi digunakan?', 'Dana digunakan untuk mendukung perawatan orangutan, penyediaan makanan, fasilitas, dan program konservasi.'),
(4, 'Apakah saya mendapatkan badge donatur?', 'Ya. Badge diberikan berdasarkan total donasi yang telah Anda lakukan.'),
(5, 'Apakah website ini menggunakan pembayaran asli?', 'Untuk tujuan pembelajaran dan demonstrasi, website menggunakan sistem simulasi pembayaran.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orangutans`
--

CREATE TABLE `orangutans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orangutans`
--

INSERT INTO `orangutans` (`id`, `name`, `gender`, `birth_year`, `age`, `description`, `created_at`) VALUES
(1, 'Krismon', 'Male', 1996, 30, 'Krismon adalah orangutan jantan yang lahir sekitar tahun 1996 dan saat ini berusia sekitar 30 tahun. Ia diselamatkan pada tanggal 30 Mei 2016 setelah menghabiskan hampir 19 tahun hidup sebagai hewan peliharaan ilegal. Setelah rehabilitasi, Krismon menunjukkan perkembangan positif dan mampu menampilkan perilaku alami orangutan.', '2026-06-10 03:49:15'),
(2, 'Dek Nong', 'Female', 1999, 27, 'Dek Nong adalah orangutan betina yang diselamatkan dari pemeliharaan ilegal. Ia mengalami kelumpuhan dari pinggang ke bawah dan gangguan persendian sehingga memerlukan perawatan khusus di Orangutan Haven.', '2026-06-10 03:49:15'),
(3, 'Lewis', 'Male', 1991, 35, 'Lewis adalah orangutan jantan yang kehilangan penglihatannya secara permanen akibat ditembak berkali-kali menggunakan senapan angin saat terjadi konflik dengan manusia setelah habitatnya rusak.', '2026-06-10 03:49:15'),
(4, 'Leuser', 'Male', 2000, 26, 'Leuser disita dari pemeliharaan ilegal saat masih kecil. Ia mengalami kebutaan permanen sehingga tidak dapat dilepasliarkan kembali ke habitat alaminya.', '2026-06-10 03:49:15'),
(5, 'Dina', 'Female', NULL, NULL, 'Dina merupakan orangutan betina yang mengalami kebutaan akibat infeksi otak saat masih kecil. Ia mendapatkan perawatan khusus di Orangutan Haven.', '2026-06-10 03:49:15'),
(6, 'Fahzren', 'Male', NULL, NULL, 'Fahzren diselundupkan secara ilegal ke Malaysia dan dijadikan satwa pertunjukan. Karena kehilangan kesempatan belajar keterampilan hidup di alam liar, ia tidak dapat dilepasliarkan kembali.', '2026-06-10 03:49:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orangutan_photos`
--

CREATE TABLE `orangutan_photos` (
  `id` int(11) NOT NULL,
  `orangutan_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `badge` enum('Friend of Orangutans','Orangutan Protector','Rainforest Guardian') DEFAULT 'Friend of Orangutans',
  `status` enum('Active','Suspended') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_activity_admin` (`admin_id`);

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_donations_user` (`user_id`);

--
-- Indeks untuk tabel `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `orangutans`
--
ALTER TABLE `orangutans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `orangutan_photos`
--
ALTER TABLE `orangutan_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orangutan_photos` (`orangutan_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `orangutans`
--
ALTER TABLE `orangutans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `orangutan_photos`
--
ALTER TABLE `orangutan_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `fk_donations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `orangutan_photos`
--
ALTER TABLE `orangutan_photos`
  ADD CONSTRAINT `fk_orangutan_photos` FOREIGN KEY (`orangutan_id`) REFERENCES `orangutans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
