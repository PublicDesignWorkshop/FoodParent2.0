-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2016 at 03:09 AM
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
-- Table structure for table `adopt`
--

CREATE TABLE `adopt` (
  `id` int(11) NOT NULL,
  `tree` int(11) NOT NULL,
  `parent` int(11) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `name` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `name`) VALUES
(1, 'ConcreteJungle'),
(2, 'Manager'),
(3, 'Participant'),
(4, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `place` int(11) NOT NULL,
  `tree` varchar(128) NOT NULL,
  `quantity` float NOT NULL,
  `picture` varchar(512) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `flag`
--

CREATE TABLE `flag` (
  `id` int(11) NOT NULL,
  `name` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `flag`
--

INSERT INTO `flag` (`id`, `name`) VALUES
(1, 'dead'),
(2, 'verified'),
(3, 'hidden');

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
(3, 'Pears', 'pears.svg', '', 1, '2016-01-30 00:00:00'),
(4, 'Mulberries', 'mulberries.svg', '', 1, '2016-01-30 00:00:00'),
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
(30, 'Loquat', 'loquat.svg', '', 0, '0000-00-00 00:00:00');

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
  `address` varchar(128) NOT NULL,
  `contact` varchar(128) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `neighborhood` varchar(128) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `auth`, `name`, `address`, `contact`, `password`, `salt`, `neighborhood`, `updated`) VALUES
(1, 1, 'Craig Durkin', '', 'craig@concrete-jungle.org', 'f0172539810bf52afc511e783f55540d7fde67e1bd9e08cc28c12e376c93293fd06d773ecb19e67a2edb78b966bd1f5d5b6135a01b9499c6b9390efc2c444091', '7b14ee507ab0ac2bf9b03d32996e203ab11675ead01c71d7298acf7363af3875ef6eff06dfadd7edf37dbd76d1b64bc51e5b6d9322eac9f91f31fe6fcc922761', '', '2016-01-30 16:33:11'),
(3, 2, 'Karl Kim', '', 'jkim848@gatech.edu', '4d3de6a750589c8d8dab4590857ae284de3a6f0455debd8d39474d606692d5e72272df989ec0c4dee5fbe2da180a5449aa00101f8aeb27ea46c8703c4222cbdd', '6a660b55f4d1e11fbbf6818f205fe4208aac62e69ebf53a9af0dcf195921a34c3f43415c18000f4d26d837e651bbe873d9a3414a501057d6dcf36c49d7976513', '', '2016-01-30 20:12:01');

-- --------------------------------------------------------

--
-- Table structure for table `place`
--

CREATE TABLE `place` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adopt`
--
ALTER TABLE `adopt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
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
-- Indexes for table `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tree`
--
ALTER TABLE `tree`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adopt`
--
ALTER TABLE `adopt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
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
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `place`
--
ALTER TABLE `place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tree`
--
ALTER TABLE `tree`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
