CREATE DATABASE youth;

USE youth

CREATE TABLE user(
	id CHAR(20) NOT NULL PRIMARY KEY,
	pwd CHAR(20) NOT NULL,
	last DATETIME);

CREATE TABLE team(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name CHAR(20) NOT NULL);

CREATE TABLE task(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	team_id INT NOT NULL,
	name CHAR(50) NOT NULL,
	instruction CHAR(200),
	start_date DATE,
	due_date DATE,
	finished TINYINT(1) DEFAULT 0,
	FOREIGN KEY (team_id) REFERENCES team(id));

 CREATE TABLE user_team(
	user_id CHAR(20) NOT NULL,
	team_id INT NOT NULL,
	take_on TINYINT(1) DEFAULT 1,
	PRIMARY KEY(user_id, team_id),
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (team_id) REFERENCES team(id));
	
CREATE TABLE user_task(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id CHAR(20) NOT NULL,
	task_id INT NOT NULL,
	task_on TINYINT(1) DEFAULT 1,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id));

CREATE TABLE comment(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id char(20) NOT NULL,
	task_id INT NOT NULL,
	txt CHAR(200) NOT NULL,
	comment_on TINYINT(1) DEFAULT 1,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id));
