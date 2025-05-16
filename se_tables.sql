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
  meal_cd varchar(10) not null                        -- meal code (e.g., breakfast, lunch, dinner)
);

create table tb_meal_food (
  meal_food_id int auto_increment primary key,        -- unique record for meal-food relation
  meal_id int not null,                               -- foreign key to tb_meal
  food_id int not null                                -- foreign key to food table
);
 
alter table tb_buy
  add constraint
  foreign key (customer_id)
  references tb_customer(customer_id);

alter table tb_meal
  add constraint 
  foreign key (customer_id)
  references tb_customer(customer_id);

alter table tb_meal_food
  add constraint
  foreign key (meal_id)
  references tb_meal(meal_id);


alter table tb_cust_health
  add constraint
  foreign key (customer_id)
  references tb_customer(customer_id);



