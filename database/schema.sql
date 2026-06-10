-- Phase 1 Shopping Cart System Schema
-- MySQL 8.x / InnoDB


--
CREATE TABLE IF NOT EXISTS role (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	role_id BIGINT UNSIGNED NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100),
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(20) UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	status ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
	email_verified BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS address (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT UNSIGNED NOT NULL,
	label VARCHAR(50),
	address_line_1 VARCHAR(255) NOT NULL,
	address_line_2 VARCHAR(255),
	city VARCHAR(100) NOT NULL,
	state VARCHAR(100) NOT NULL,
	postal_code VARCHAR(20) NOT NULL,
	country VARCHAR(100) NOT NULL,
	is_default BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_address_user FOREIGN KEY (user_id)
		REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS category (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	parent_id BIGINT UNSIGNED NULL,
	name VARCHAR(255) NOT NULL,
	slug VARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_category_parent FOREIGN KEY (parent_id)
		REFERENCES category(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	category_id BIGINT UNSIGNED NOT NULL,
	name VARCHAR(255) NOT NULL,
	slug VARCHAR(255) NOT NULL UNIQUE,
	short_description TEXT,
	description LONGTEXT,
	sku VARCHAR(100) UNIQUE,
	brand VARCHAR(150),
	status ENUM('DRAFT','ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_product_category FOREIGN KEY (category_id)
		REFERENCES category(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_image (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	product_id BIGINT UNSIGNED NOT NULL,
	image_url VARCHAR(500) NOT NULL,
	is_primary BOOLEAN DEFAULT FALSE,
	sort_order INT DEFAULT 0,
	CONSTRAINT fk_product_image_product FOREIGN KEY (product_id)
		REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_attribute (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_attribute_value (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	attribute_id BIGINT UNSIGNED NOT NULL,
	value VARCHAR(100) NOT NULL,
	CONSTRAINT fk_attribute_value_attribute FOREIGN KEY (attribute_id)
		REFERENCES product_attribute(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_variant (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	product_id BIGINT UNSIGNED NOT NULL,
	sku VARCHAR(100) UNIQUE,
	price DECIMAL(12,2) NOT NULL,
	stock_quantity INT DEFAULT 0,
	weight DECIMAL(10,2),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_variant_product FOREIGN KEY (product_id)
		REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS variant_attribute_value (
	variant_id BIGINT UNSIGNED NOT NULL,
	attribute_value_id BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (variant_id, attribute_value_id),
	CONSTRAINT fk_vav_variant FOREIGN KEY (variant_id)
		REFERENCES product_variant(id) ON DELETE CASCADE,
	CONSTRAINT fk_vav_attribute_value FOREIGN KEY (attribute_value_id)
		REFERENCES product_attribute_value(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_history (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	variant_id BIGINT UNSIGNED NOT NULL,
	change_type ENUM('PURCHASE','SALE','ADJUSTMENT','RETURN','DAMAGED'),
	quantity_change INT NOT NULL,
	previous_quantity INT NOT NULL,
	new_quantity INT NOT NULL,
	notes TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_inventory_variant FOREIGN KEY (variant_id)
		REFERENCES product_variant(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT UNSIGNED NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_cart_user FOREIGN KEY (user_id)
		REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_item (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	cart_id BIGINT UNSIGNED NOT NULL,
	variant_id BIGINT UNSIGNED NOT NULL,
	quantity INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY uq_cart_variant (cart_id, variant_id),
	CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id)
		REFERENCES cart(id) ON DELETE CASCADE,
	CONSTRAINT fk_cart_item_variant FOREIGN KEY (variant_id)
		REFERENCES product_variant(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT UNSIGNED NOT NULL,
	address_id BIGINT UNSIGNED NOT NULL,
	order_number VARCHAR(50) NOT NULL UNIQUE,
	subtotal DECIMAL(12,2) NOT NULL,
	tax DECIMAL(12,2) DEFAULT 0,
	shipping_cost DECIMAL(12,2) DEFAULT 0,
	total_amount DECIMAL(12,2) NOT NULL,
	status ENUM(
		'PENDING','PAID','PROCESSING',
		'SHIPPED','DELIVERED',
		'CANCELLED','REFUNDED'
	) DEFAULT 'PENDING',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES user(id),
	CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES address(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_item (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	order_id BIGINT UNSIGNED NOT NULL,
	variant_id BIGINT UNSIGNED NOT NULL,
	product_name VARCHAR(255) NOT NULL,
	variant_sku VARCHAR(100),
	quantity INT NOT NULL,
	unit_price DECIMAL(12,2) NOT NULL,
	line_total DECIMAL(12,2) NOT NULL,
	CONSTRAINT fk_order_item_order FOREIGN KEY (order_id)
		REFERENCES orders(id) ON DELETE CASCADE,
	CONSTRAINT fk_order_item_variant FOREIGN KEY (variant_id)
		REFERENCES product_variant(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	order_id BIGINT UNSIGNED NOT NULL,
	payment_method ENUM('COD','CARD','UPI','NETBANKING','WALLET'),
	transaction_reference VARCHAR(255),
	amount DECIMAL(12,2) NOT NULL,
	status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
	paid_at TIMESTAMP NULL,
	CONSTRAINT fk_payment_order FOREIGN KEY (order_id)
		REFERENCES orders(id)
) ENGINE=InnoDB;


"
Security & RBAC
---------------
user
role
permission
user_role
role_permission

Addresses
---------
address

Catalog
-------
category
product
product_image
product_attribute
product_attribute_value
product_variant
variant_attribute_value

Reviews
--------
review
review_image
review_vote
review_report
product_review_summary

Inventory
---------
inventory_history

Cart
----
cart
cart_item
wishlist
wishlist_item
 

Orders
------
orders
order_item

Shipping
--------
warehouse
courier
shipment
shipment_item
tracking_event

Marketing
---------
coupon
promotion
campaign
banner

Recommendations
---------------
product_view_history
search_history
search_click_history
product_purchase_history
recommended_product

Support
-------
ticket
ticket_message
ticket_attachment

Notifications
-------------
notification
notification_recipient

Administration
--------------
admin_activity_log
system_setting

"

