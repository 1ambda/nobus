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
	txt CHAR(200),
	url CHAR(80),
	write_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	comment_on TINYINT(1) DEFAULT 1,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id));

CREATE TABLE push(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id CHAR(20) NOT NULL,
	task_id INT NOT NULL,
	txt TEXT,
	start_date DATE NOT NULL,
	due_date DATE NOT NULL,
	checked TINYINT(1) NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id)
	);
	
CREATE TABLE toss(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id CHAR(20) NOT NULL,
	task_id INT NOT NULL,
	txt TEXT,
	start_date DATE NOT NULL,
	due_date DATE NOT NULL,
	checked TINYINT(1) NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id)
	);
	
CREATE TABLE submit(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id CHAR(20) NOT NULL,
	task_id INT NOT NULL,
	txt TEXT,
	submit_date DATE NOT NULL,
	checked TINYINT(1) NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (task_id) REFERENCES task(id)
	);
	
CREATE TABLE push_comment(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	push_id INT NOT NULL,
	user_id CHAR(20) NOT NULL,
	txt TEXT,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (push_id) REFERENCES push(id)
	);
	
CREATE TABLE toss_comment(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	toss_id INT NOT NULL,
	user_id CHAR(20) NOT NULL,
	txt TEXT,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (toss_id) REFERENCES push(id)
	);
	
CREATE TABLE submit_comment(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	submit_id INT NOT NULL,
	user_id CHAR(20) NOT NULL,
	txt TEXT,
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (submit_id) REFERENCES push(id)
	);

CREATE TABLE push_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	push_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (push_id) REFERENCES push(id)
);

CREATE TABLE toss_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	toss_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (toss_id) REFERENCES toss(id)
);

CREATE TABLE submit_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	submit_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (submit_id) REFERENCES submit(id)
);

CREATE TABLE push_comment_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	push_comment_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (push_comment_id) REFERENCES push_comment(id)
);

CREATE TABLE toss_comment_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	toss_comment_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (toss_comment_id) REFERENCES toss_comment(id)
);

CREATE TABLE submit_comment_file(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	submit_comment_id INT NOT NULL,
	image CHAR(200),
	file CHAR(200),
	FOREIGN KEY (submit_comment_id) REFERENCES submit_comment(id)
);

