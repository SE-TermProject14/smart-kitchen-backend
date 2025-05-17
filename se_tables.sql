create database se_termproject;
use se_termproject;

create table tb_buy (
	buy_id int auto_increment primary key, -- pk
    customer_id int not null,  -- fk for customer table
    food_id int not null, -- food id
    buy_date date not null, -- purchase date
    buy_cnt int not null, -- number of purchases
    expire_date date -- food expiration date
);

create table tb_customer (
  customer_id int auto_increment primary key,        -- primary key (auto-incremented)
  name varchar(10) not null UNIQUE,                         -- customer name (required)
  birthday date,                                     -- customer's date of birth
  sex_cd enum('male', 'female'),                     -- gender: male or female
  `registration` date,            					 -- registration date 
  `modified` date,         						     -- last modified date
  password varchar(100) not null					 -- password
);

create table tb_cust_health (
  cust_health_id int auto_increment primary key,      -- unique health record ID 
  customer_id int not null,                           -- foreign key to tb_customer
  health_cd varchar(10) not null,                     -- health code (e.g., bmi, fat)
  health_value varchar(45)                            -- value of the health metric
);


create table tb_meal (
  meal_id int auto_increment primary key,             -- unique meal ID (auto-incremented)
  customer_id int not null,                           -- foreign key to tb_customer
  meal_date date not null,                            -- date of the meal
  meal_cd ENUM('breakfast', 'lunch', 'dinner') NOT NULL                       -- meal code (e.g., breakfast, lunch, dinner)
);

CREATE TABLE tb_food (
  food_id INT AUTO_INCREMENT PRIMARY KEY,
  food_code VARCHAR(50) NOT NULL UNIQUE,  -- API에서 제공하는 식품 코드 (UNIQUE)
  food_name VARCHAR(100) NOT NULL,        -- 식품명
  quantity INT NOT NULL DEFAULT 100,      -- 100g 또는 100ml 기준
  calorie DECIMAL(6, 2),                  -- 소수점 허용
  carb DECIMAL(6, 2),
  protein DECIMAL(6, 2),
  fat DECIMAL(6, 2)
);

CREATE TABLE tb_meal_food (
  meal_food_id INT AUTO_INCREMENT PRIMARY KEY,  -- unique record for meal-food relation
  meal_id INT NOT NULL,                         -- foreign key to tb_meal
  food_id INT NOT NULL,                         -- foreign key to tb_food
  customer_id INT NOT NULL,                     -- foreign key to tb_customer
  quantity INT NOT NULL,                        -- 섭취량 (g 또는 ml)
  calorie_total DECIMAL(6, 2),                  -- 총 칼로리
  carb_total DECIMAL(6, 2),                     -- 총 탄수화물
  protein_total DECIMAL(6, 2),                  -- 총 단백질
  fat_total DECIMAL(6, 2),                      -- 총 지방
  FOREIGN KEY (meal_id) REFERENCES tb_meal(meal_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES tb_food(food_id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES tb_customer(customer_id) ON DELETE CASCADE
);

alter table tb_buy
  add constraint
  foreign key (customer_id)
  references tb_customer(customer_id);

alter table tb_meal
  add constraint 
  foreign key (customer_id)
  references tb_customer(customer_id);

alter table tb_cust_health
  add constraint
  foreign key (customer_id)
  references tb_customer(customer_id);
