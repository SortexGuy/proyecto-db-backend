PRAGMA foreign_keys = ON;

-- User tables
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(120) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS teacher (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ic VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  contact VARCHAR(14),

  user_id INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS representative (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ic VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  contact VARCHAR(14),

  user_id INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coordinator (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ic VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  contact VARCHAR(14),
  entry_date DATE NOT NULL,
  withdraw_date DATE,

  user_id INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Student tables
CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ic VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  current_year INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL
);

-- Course tables
CREATE TABLE IF NOT EXISTS period (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS charge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section INTEGER NOT NULL,

  period_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,

  FOREIGN KEY (period_id) REFERENCES period(id),
  FOREIGN KEY (course_id) REFERENCES course(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);

CREATE TABLE IF NOT EXISTS qualification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value INTEGER NOT NULL,
  lapse INTEGER NOT NULL,

  student_id INTEGER NOT NULL,
  charge_id INTEGER NOT NULL,
  
  FOREIGN KEY (student_id) REFERENCES student(id),
  FOREIGN KEY (charge_id) REFERENCES charge(id)
);

--- Relationships
CREATE TABLE IF NOT EXISTS representative_student (
  representative_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,

  PRIMARY KEY (representative_id, student_id),
  FOREIGN KEY (representative_id) REFERENCES representative(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student(id)
);
