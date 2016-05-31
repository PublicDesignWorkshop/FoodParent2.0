-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2016 at 11:03 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.5.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tree_parent`
--

-- --------------------------------------------------------

--
-- Table structure for table `flag`
--

CREATE TABLE `flag` (
  `id` int(11) NOT NULL,
  `name` varchar(16) NOT NULL,
  `filter` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `flag`
--

INSERT INTO `flag` (`id`, `name`, `filter`) VALUES
(1, 'dead', 0),
(2, 'verified', 1),
(3, 'hidden', 0);

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` varchar(16) NOT NULL,
  `icon` varchar(128) NOT NULL,
  `description` varchar(512) NOT NULL,
  `season` tinyint(4) NOT NULL DEFAULT '0',
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`, `icon`, `description`, `season`, `updated`) VALUES
(1, '*Other', 'unknown.svg', '', 0, '2016-01-30 00:00:00'),
(2, 'Blackberries', 'blackberries.svg', '', 1, '2016-01-30 00:00:00'),
(3, 'Pears', 'pears.svg', '', 0, '2016-01-30 00:00:00'),
(4, 'Mulberries', 'mulberries.svg', '', 0, '2016-01-30 00:00:00'),
(5, 'Crabapples', 'crabapples.svg', '', 0, '2016-01-30 00:00:00'),
(6, 'Apples', 'apples.svg', '', 1, '0000-00-00 00:00:00'),
(7, 'Blueberries', 'blueberries.svg', '', 0, '0000-00-00 00:00:00'),
(8, 'Elderberries', 'elderberries.svg', '', 0, '0000-00-00 00:00:00'),
(9, 'Figs', 'figs.svg', '', 0, '0000-00-00 00:00:00'),
(10, 'Flying Dragon', 'flyingdragon.svg', '', 0, '0000-00-00 00:00:00'),
(11, 'Ginkgo', 'ginkgo.svg', '', 0, '0000-00-00 00:00:00'),
(12, 'Muscadines', 'muscadines.svg', '', 0, '0000-00-00 00:00:00'),
(13, 'Nectarines', 'nectarines.svg', '', 0, '0000-00-00 00:00:00'),
(14, 'Pawpaw', 'pawpaw.svg', '', 0, '0000-00-00 00:00:00'),
(15, 'Raspberries', 'raspberries.svg', '', 0, '0000-00-00 00:00:00'),
(16, 'Peaches', 'peaches.svg', '', 0, '0000-00-00 00:00:00'),
(17, 'Pecans', 'pecans.svg', '', 0, '0000-00-00 00:00:00'),
(18, 'Serviceberries', 'serviceberries.svg', '', 0, '0000-00-00 00:00:00'),
(19, 'Persimmons', 'persimmons.svg', '', 0, '0000-00-00 00:00:00'),
(20, 'Plums', 'plums.svg', '', 0, '0000-00-00 00:00:00'),
(21, 'Pomegranates', 'pomegranates.svg', '', 0, '0000-00-00 00:00:00'),
(22, 'Prickly Pears', 'pricklypears.svg', '', 0, '0000-00-00 00:00:00'),
(23, 'Cherries', 'cherries.svg', '', 0, '0000-00-00 00:00:00'),
(24, 'Quinces', 'quinces.svg', '', 0, '0000-00-00 00:00:00'),
(25, 'Black Walnuts', 'blackwalnuts.svg', '', 0, '0000-00-00 00:00:00'),
(26, 'Kiwis', 'kiwis.svg', '', 0, '0000-00-00 00:00:00'),
(27, 'Loquat', 'loquat.svg', '', 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `id` int(11) NOT NULL,
  `auth` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `contact` varchar(128) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `neighborhood` varchar(128) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `updated` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `auth`, `name`, `contact`, `password`, `salt`, `neighborhood`, `active`, `updated`) VALUES
(1, 1, 'FoodParent Admin', 'admin@foodparent.org', '37b7f23f9775b0518109ce53c02b35d817d6192d564b7a4d68c1c48210fdb74e80609e559cafe2df7e8437c8ed2761c648a611826be57f7ac084afaaa5806036', '6a267d66025b3230124cc42b35048eb9aeeac570e9bc36edbd968032d6aa4ef33622584a846bfe82a2e7f0ab2bda70ba00757f5424fe281bf134b867a9e67db3', '', 1, '2016-01-30');

-- --------------------------------------------------------

--
-- Table structure for table `tree`
--

CREATE TABLE `tree` (
  `id` int(11) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `food` int(11) NOT NULL,
  `flag` varchar(128) NOT NULL DEFAULT '0',
  `owner` int(11) NOT NULL DEFAULT '0',
  `description` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `parent` varchar(128) NOT NULL DEFAULT '0',
  `rate` tinyint(1) NOT NULL DEFAULT '0',
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `flag`
--
ALTER TABLE `flag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact` (`contact`);

--
-- Indexes for table `tree`
--
ALTER TABLE `tree`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flag`
--
ALTER TABLE `flag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tree`
--
ALTER TABLE `tree`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
