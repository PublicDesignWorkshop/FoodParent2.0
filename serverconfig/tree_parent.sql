-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2016 at 06:19 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.21

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
-- Table structure for table `donate`
--

CREATE TABLE `donate` (
  `id` int(11) NOT NULL,
  `location` int(11) NOT NULL,
  `food` int(11) NOT NULL,
  `tree` varchar(128) NOT NULL,
  `person` int(11) NOT NULL,
  `comment` text NOT NULL,
  `picture` varchar(128) NOT NULL,
  `amount` float NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(1, 'Other', 'Marker_Other.svg', '', 0, '0000-00-00 00:00:00'),
(2, 'Blackberries', 'Marker_Blackberries.svg', '', 0, '2016-01-30 00:00:00'),
(3, 'Pears', 'Marker_Pears.svg', '', 1, '2016-01-30 00:00:00'),
(4, 'Mulberries', 'Marker_Mulberries.svg', '', 0, '2016-01-30 00:00:00'),
(5, 'Crabapples', 'Marker_Crabapples.svg', '', 0, '2016-01-30 00:00:00'),
(6, 'Apples', 'Marker_Apples.svg', '', 0, '0000-00-00 00:00:00'),
(7, 'Blueberries', 'Marker_Blueberries.svg', '', 0, '0000-00-00 00:00:00'),
(8, 'Elderberries', 'Marker_Elderberries.svg', '', 0, '0000-00-00 00:00:00'),
(9, 'Figs', 'Marker_Figs.svg', '', 0, '0000-00-00 00:00:00'),
(10, 'Flying Dragon', 'Marker_FlyingDragon.svg', '', 0, '0000-00-00 00:00:00'),
(11, 'Ginkgo', 'Marker_Ginkgo.svg', '', 0, '0000-00-00 00:00:00'),
(12, 'Muscadines', 'Marker_Muscadines.svg', '', 0, '0000-00-00 00:00:00'),
(13, 'Nectarines', 'Marker_Nectarines.svg', '', 0, '0000-00-00 00:00:00'),
(14, 'Pawpaw', 'Marker_Pawpaws.svg', '', 0, '0000-00-00 00:00:00'),
(15, 'Raspberries', 'Marker_Raspberries.svg', '', 0, '0000-00-00 00:00:00'),
(16, 'Peaches', 'Marker_Peaches.svg', '', 0, '0000-00-00 00:00:00'),
(17, 'Pecans', 'Marker_Pecans.svg', '', 0, '0000-00-00 00:00:00'),
(18, 'Serviceberries', 'Marker_Serviceberries.svg', '', 0, '0000-00-00 00:00:00'),
(19, 'Persimmons', 'Marker_Persimmons.svg', '', 0, '0000-00-00 00:00:00'),
(20, 'Plums', 'Marker_Plums.svg', '', 0, '0000-00-00 00:00:00'),
(21, 'Pomegranates', 'Marker_Pomegranates.svg', '', 0, '0000-00-00 00:00:00'),
(22, 'Prickly Pears', 'Marker_PricklyPears.svg', '', 0, '0000-00-00 00:00:00'),
(24, 'Quinces', 'Marker_Quinces.svg', '', 0, '0000-00-00 00:00:00'),
(25, 'Black Walnuts', 'Marker_BlackWalnuts.svg', '', 0, '0000-00-00 00:00:00'),
(26, 'Kiwis', 'Marker_Kiwis.svg', '', 0, '0000-00-00 00:00:00'),
(29, 'Cherries', 'Marker_Cherries.svg', '', 0, '0000-00-00 00:00:00'),
(30, 'Loquat', 'Marker_Loquats.svg', '', 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `description` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `tree` int(11) NOT NULL,
  `person` int(11) NOT NULL,
  `comment` text NOT NULL,
  `picture` varchar(128) NOT NULL,
  `rate` tinyint(1) NOT NULL DEFAULT '0',
  `amount` float NOT NULL DEFAULT '0',
  `proper` tinyint(1) NOT NULL DEFAULT '0',
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Indexes for table `donate`
--
ALTER TABLE `donate`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
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
-- AUTO_INCREMENT for table `donate`
--
ALTER TABLE `donate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `flag`
--
ALTER TABLE `flag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `tree`
--
ALTER TABLE `tree`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
