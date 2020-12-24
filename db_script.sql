-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: imaginato
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (45,'synthesize deposit','Marcella30','I\'ll reboot the cross-platform SMTP bus, that should panel the SAS capacitor!','2020-12-23 09:01:05.457290','2020-12-23 09:01:05.457290'),(46,'Fresh proactive Seamless microchip Applications','Vella40','You can\'t calculate the sensor without hacking the wireless XSS protocol!','2020-12-23 09:01:06.107966','2020-12-23 09:01:06.107966'),(47,'indexing Car','Ewell_Schinner40','Try to connect the CSS feed, maybe it will synthesize the mobile matrix!','2020-12-23 09:01:06.608663','2020-12-23 09:01:06.608663');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nsleft` int NOT NULL DEFAULT '1',
  `nsright` int NOT NULL DEFAULT '2',
  `parentId` int DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `articleId` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_8770bd9030a3d13c5f79a7d2e81` (`parentId`),
  KEY `FK_b0011304ebfcb97f597eae6c31f` (`articleId`),
  CONSTRAINT `FK_8770bd9030a3d13c5f79a7d2e81` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`),
  CONSTRAINT `FK_b0011304ebfcb97f597eae6c31f` FOREIGN KEY (`articleId`) REFERENCES `articles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (41,'Stevie18',1,26,NULL,'We need to back up the mobile PCI bus!',45,'2020-12-23 09:01:15.112845','2020-12-23 09:01:15.112845'),(42,'Markus_McKenzie92',1,26,NULL,'The SDD panel is down, calculate the online transmitter so we can input the SMTP transmitter!',45,'2020-12-23 09:01:15.684697','2020-12-23 09:01:15.684697'),(43,'Frank.Wuckert',1,26,NULL,'The GB pixel is down, copy the optical bus so we can program the AGP pixel!',45,'2020-12-23 09:01:16.167240','2020-12-23 09:01:16.167240'),(44,'John_McKenzie70',2,21,41,'You can\'t reboot the bus without backing up the online XML feed!',45,'2020-12-23 09:01:24.604392','2020-12-23 09:01:24.604392'),(45,'Orie91',22,23,41,'If we synthesize the circuit, we can get to the RAM array through the mobile IB matrix!',45,'2020-12-23 09:01:25.095890','2020-12-23 09:01:25.095890'),(46,'Rossie.Koch48',24,25,41,'I\'ll compress the auxiliary SAS driver, that should matrix the SMTP card!',45,'2020-12-23 09:01:25.595357','2020-12-23 09:01:25.595357'),(47,'Clementine_Christiansen14',3,16,44,'The RSS microchip is down, compress the 1080p bandwidth so we can parse the ADP firewall!',45,'2020-12-23 09:01:40.153999','2020-12-23 09:01:40.153999'),(48,'Raphaelle95',17,18,44,'You can\'t connect the port without hacking the optical AGP port!',45,'2020-12-23 09:01:40.585841','2020-12-23 09:01:40.585841'),(49,'Estrella89',19,20,44,'Try to index the COM bus, maybe it will hack the bluetooth protocol!',45,'2020-12-23 09:01:41.085808','2020-12-23 09:01:41.085808'),(50,'Malinda.Spencer',4,11,47,'You can\'t bypass the bandwidth without calculating the multi-byte SDD bandwidth!',45,'2020-12-23 09:01:51.800454','2020-12-23 09:01:51.800454'),(51,'Jacey49',12,13,47,'If we synthesize the card, we can get to the SSL monitor through the redundant SSL program!',45,'2020-12-23 09:01:52.188173','2020-12-23 09:01:52.188173'),(52,'Aida_Jones',14,15,47,'Use the primary CSS firewall, then you can compress the bluetooth port!',45,'2020-12-23 09:01:52.641059','2020-12-23 09:01:52.641059'),(53,'Ines.Bailey',5,6,50,'If we hack the system, we can get to the SCSI array through the open-source SDD interface!',45,'2020-12-23 09:02:04.076950','2020-12-23 09:02:04.076950'),(54,'Nicklaus13',7,8,50,'Use the neural SAS protocol, then you can calculate the online driver!',45,'2020-12-23 09:02:04.362206','2020-12-23 09:02:04.362206'),(55,'Giovani23',9,10,50,'If we synthesize the capacitor, we can get to the RAM array through the online GB circuit!',45,'2020-12-23 09:02:04.802038','2020-12-23 09:02:04.802038'),(56,'Walker.Stanton50',1,2,NULL,'The EXE card is down, quantify the open-source panel so we can back up the JSON protocol!',46,'2020-12-23 09:18:17.849762','2020-12-23 09:18:17.849762'),(57,'Naomi.Sporer',1,2,NULL,'You can\'t connect the protocol without transmitting the auxiliary RAM bus!',46,'2020-12-23 09:18:18.381290','2020-12-23 09:18:18.381290'),(58,'Tate67',1,2,NULL,'The USB circuit is down, program the 1080p system so we can calculate the IB hard drive!',46,'2020-12-23 09:18:18.869399','2020-12-23 09:18:18.869399');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-24 13:08:47
