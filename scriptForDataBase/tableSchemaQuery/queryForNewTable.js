module.exports = [
 "CREATE TABLE IF NOT EXISTS user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), email VARCHAR(255), time_stamp TIMESTAMP, last_attempt_time TIMESTAMP, last_token_time TIMESTAMP, user_type INT(11))",
 "CREATE TABLE IF NOT EXISTS controller (controller_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), route VARCHAR(255), parent_controller_id INT(11))",
 "CREATE TABLE IF NOT EXISTS login_history (history_id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(255), auth_token VARCHAR(255), login_time TIMESTAMP,logout_time TIMESTAMP)"
];