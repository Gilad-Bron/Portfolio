-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2024 at 04:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skyroads`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `first_name`, `last_name`, `email`, `password`, `role`) VALUES
(1, 'גלעד', 'ברונשטיין', 'gilad.bron@gmail.com', '$2a$10$Lb3ojiEE20l4W5r2vM9hGOtrz0cfPEKTvBGiYBUNoO9LUz37cJDeO', 'admin'),
(2, 'Lucy', 'Westenra', 'lwest@gmail.com', '$2a$10$SzKJB80FKTYCnYZCi14YSO38JeTHzL2TX0gcXcxIkD7LWZrft8S8K', 'user'),
(6, 'William', 'Harker', 'whark@gmail.com', '$2a$10$rGrajMMMsQx/8mbsxINer.gEGLI/B9UJc41s/ZFA25O8HDInlrhYW', 'user'),
(7, 'Abraham', 'Van Helsing', 'avanh@gmail.com', '$2a$10$XXF6DzSTNohmtyCwkozdLuB0Y1pS/aAd4xfuUD1MOy.O0kciynUSS', 'user'),
(8, 'Count', 'Dracula', 'cdrac@gmail.com', '$2a$10$ki1uPbhlwGUHfoWnXRDgleOfCMtnYAEuRw0b2EjC4nyLltaOG7/bu', 'user'),
(9, 'Yael', 'Kushlin', 'ykushlin@gmail.com', '$2a$10$om.CY1yeBUgOhiRdSgJjXu0NRRDLN/MVid5V2RinboBNgrzlr7hSC', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users_vacations`
--

CREATE TABLE `users_vacations` (
  `user_id` int(11) NOT NULL,
  `vacation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_vacations`
--

INSERT INTO `users_vacations` (`user_id`, `vacation_id`) VALUES
(1, 4),
(1, 5),
(9, 5),
(9, 6),
(6, 30),
(6, 10),
(6, 2),
(7, 9),
(7, 9),
(7, 5),
(8, 33),
(8, 3),
(8, 29),
(9, 29),
(2, 2),
(2, 4),
(2, 6),
(2, 9),
(2, 28),
(2, 30),
(2, 31),
(2, 33);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `ID` int(11) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` float NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`ID`, `destination`, `description`, `start_date`, `end_date`, `price`, `image`) VALUES
(2, 'Paris', 'Experience the City of Lights with its iconic Eiffel Tower, Louvre Museum, and charming cafes. Stroll along the Seine River, explore the Notre Dame Cathedral, and indulge in delicious French cuisine. This romantic getaway is perfect for couples and art enthusiasts.\r\n', '2025-06-15', '2025-06-22', 2500, 'paris.jpg'),
(3, 'Kyoto', 'Immerse yourself in the ancient culture of Japan in Kyoto. Visit the Fushimi Inari Shrine with its thousands of red gates, explore the Kinkaku-ji Temple (Golden Pavilion), and wander through the Arashiyama Bamboo Forest. Experience a traditional tea ceremony and witness the beauty of geisha districts.\r\n', '2025-09-10', '2025-09-17', 3200, 'kyoto.jpg'),
(4, 'Marrakech', 'Explore the vibrant souks of Marrakech, with their colorful spices, textiles, and handicrafts. Get lost in the maze-like alleys of the medina, visit the Bahia Palace and the Koutoubia Mosque, and experience the energy of Djemaa el-Fna square.\r\n', '2025-10-05', '2025-10-12', 1800, 'marrakech.jpg'),
(5, 'Machu Picchu', 'Hike the Inca Trail to the lost city of Machu Picchu, a UNESCO World Heritage site nestled in the Andes Mountains. Explore the ancient ruins, marvel at the breathtaking views, and learn about the fascinating Inca civilization.\r\n', '2025-11-19', '2025-11-26', 4100, 'machu_picchu.jpg'),
(6, 'Santorini', 'Relax on the stunning beaches of Santorini, with its iconic blue-domed churches and whitewashed houses. Watch the sunset over the Aegean Sea, explore the volcanic caldera, and indulge in delicious Greek cuisine and wine.\r\n', '2025-07-02', '2025-07-09', 2700, 'santorini.jpg'),
(9, 'Yellowstone National Park', 'Witness the geothermal wonders of Yellowstone National Park, with its geysers, hot springs, and mudpots. See the iconic Old Faithful erupt, hike through the Grand Canyon of the Yellowstone, and spot wildlife such as bison, elk, and wolves.', '2024-12-21', '2024-12-28', 4900, 'yellowstone.jpg'),
(10, 'Sydney', 'Explore the vibrant city of Sydney, with its iconic Opera House and Harbour Bridge. Climb the bridge for panoramic views, relax on Bondi Beach, and visit the Taronga Zoo. Experience the unique Australian culture and enjoy the outdoor lifestyle.', '2025-12-06', '2025-12-13', 4000, 'sydney.jpg'),
(28, 'Rio de Janeiro', 'Dance the samba in Rio de Janeiro, with its famous Copacabana and Ipanema beaches. Visit the Christ the Redeemer statue, ride a cable car to Sugarloaf Mountain, and experience the vibrant nightlife and Carnival celebrations.\n', '2025-02-13', '2025-02-20', 2800, 'rio_de_jeneiro.jpg'),
(29, 'Bangkok', 'Explore the bustling city of Bangkok, with its ornate temples, floating markets, and delicious street food. Visit the Grand Palace and Wat Pho, take a boat trip on the Chao Phraya River, and experience the vibrant nightlife.\n', '2025-03-09', '2025-03-16', 3100, 'bangkok.jpg'),
(30, 'Amsterdam', 'Cycle through the charming canals of Amsterdam, visit the Anne Frank House, and explore the Rijksmuseum. Enjoy the coffee shops and unique culture, and take a boat trip on the canals to see the city from a different perspective', '2025-04-21', '2025-04-26', 1900, 'amsterdam.jpg'),
(31, 'Banff National Park', 'Explore the stunning scenery of Banff National Park, with its turquoise lakes, snow-capped mountains, and glaciers. Hike to Johnston Canyon and Moraine Lake, take a gondola ride up Sulphur Mountain, and spot wildlife such as bears, elk, and moose.\n', '2025-12-19', '2025-12-26', 4900, 'banff.jpg'),
(32, 'Dubai', 'Experience the luxury and extravagance of Dubai, with its towering skyscrapers, world-class shopping, and stunning beaches. Visit the Burj Khalifa, the tallest building in the world, ski indoors at Ski Dubai, and enjoy the vibrant nightlife.\n', '2025-10-02', '2025-10-08', 3200, 'dubai.jpg'),
(33, 'Istanbul', 'Discover the historical city of Istanbul, where East meets West. Visit the Hagia Sophia and the Blue Mosque, explore the Topkapi Palace, and wander through the Grand Bazaar and Spice Market. Experience the Turkish culture and enjoy the delicious cuisine.\n', '2025-05-14', '2025-05-21', 1600, 'istanbul.jpg'),
(34, 'Serengeti National Park', 'Witness the Great Migration in Serengeti National Park, where millions of wildebeest, zebras, and gazelles roam the plains. Go on a safari to see lions, elephants, giraffes, and other wildlife in their natural habitat. Experience the beauty and diversity of the African savanna.\n', '2026-03-10', '2026-03-24', 6400, 'serengeti.jpg'),
(35, 'Tatooine', 'A harsh desert world orbiting twin suns in the galaxy’s Outer Rim, Tatooine is a lawless place ruled by Hutt gangsters. Many settlers scratch out a living on moisture farms, while spaceport cities such as Mos Eisley and Mos Espa serve as home base for smugglers, criminals, and other rogues.', '2099-12-02', '2099-12-30', 10000, 'tatooine.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users_vacations`
--
ALTER TABLE `users_vacations`
  ADD KEY `vacation_id` (`vacation_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users_vacations`
--
ALTER TABLE `users_vacations`
  ADD CONSTRAINT `users_vacations_ibfk_1` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_vacations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
