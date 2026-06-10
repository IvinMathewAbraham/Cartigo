-- Phase 1 seed data

INSERT INTO role (id, name)
VALUES
	(1, 'ADMIN'),
	(2, 'CUSTOMER')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO user (
	id,
	role_id,
	first_name,
	last_name,
	email,
	phone,
	password_hash,
	status,
	email_verified
)
VALUES
	(1, 1, 'Admin', 'User', 'admin@shop.local', '5550000001', '$2a$12$cGhtcwsi2bvOuMadehmeJ.2KtC7EerkoYD/OyuSeXXlyWQ6WqGZsG', 'ACTIVE', TRUE),
	(2, 2, 'Jane', 'Doe', 'jane@shop.local', '5550000002', '$2a$12$cGhtcwsi2bvOuMadehmeJ.2KtC7EerkoYD/OyuSeXXlyWQ6WqGZsG', 'ACTIVE', TRUE)
ON DUPLICATE KEY UPDATE
	role_id = VALUES(role_id),
	first_name = VALUES(first_name),
	last_name = VALUES(last_name),
	phone = VALUES(phone),
	password_hash = VALUES(password_hash),
	status = VALUES(status),
	email_verified = VALUES(email_verified);

INSERT INTO address (
	id,
	user_id,
	label,
	address_line_1,
	address_line_2,
	city,
	state,
	postal_code,
	country,
	is_default
)
VALUES
	(1, 2, 'Home', '42 Market Street', 'Unit 7', 'Springfield', 'IL', '62701', 'USA', TRUE)
ON DUPLICATE KEY UPDATE
	label = VALUES(label),
	address_line_1 = VALUES(address_line_1),
	address_line_2 = VALUES(address_line_2),
	city = VALUES(city),
	state = VALUES(state),
	postal_code = VALUES(postal_code),
	country = VALUES(country),
	is_default = VALUES(is_default);

INSERT INTO category (id, parent_id, name, slug, description)
VALUES
	(1, NULL, 'Electronics', 'electronics', 'Audio, gadgets, and devices.'),
	(2, NULL, 'Apparel', 'apparel', 'Everyday clothing and accessories.')
ON DUPLICATE KEY UPDATE
	parent_id = VALUES(parent_id),
	name = VALUES(name),
	description = VALUES(description);

INSERT INTO product (
	id,
	category_id,
	name,
	slug,
	short_description,
	description,
	sku,
	brand,
	status
)
VALUES
	(
		1,
		1,
		'Wireless Headphones',
		'wireless-headphones',
		'Comfortable over-ear Bluetooth headphones.',
		'Premium wireless headphones with ANC and 30-hour battery life.',
		'WH-1000',
		'AudioPro',
		'ACTIVE'
	),
	(
		2,
		2,
		'Classic T-Shirt',
		'classic-t-shirt',
		'Soft cotton crew neck tee.',
		'Breathable cotton t-shirt for daily wear.',
		'TSHIRT-CLASSIC',
		'BasicWear',
		'ACTIVE'
	)
ON DUPLICATE KEY UPDATE
	category_id = VALUES(category_id),
	name = VALUES(name),
	short_description = VALUES(short_description),
	description = VALUES(description),
	sku = VALUES(sku),
	brand = VALUES(brand),
	status = VALUES(status);

INSERT INTO product_image (id, product_id, image_url, is_primary, sort_order)
VALUES
	(1, 1, 'https://example.com/images/headphones-primary.jpg', TRUE, 0),
	(2, 2, 'https://example.com/images/tshirt-primary.jpg', TRUE, 0)
ON DUPLICATE KEY UPDATE
	image_url = VALUES(image_url),
	is_primary = VALUES(is_primary),
	sort_order = VALUES(sort_order);

INSERT INTO product_attribute (id, name)
VALUES
	(1, 'Size'),
	(2, 'Color')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO product_attribute_value (id, attribute_id, value)
VALUES
	(1, 1, 'M'),
	(2, 1, 'L'),
	(3, 2, 'Black'),
	(4, 2, 'White')
ON DUPLICATE KEY UPDATE
	attribute_id = VALUES(attribute_id),
	value = VALUES(value);

INSERT INTO product_variant (
	id,
	product_id,
	sku,
	price,
	stock_quantity,
	weight
)
VALUES
	(1, 1, 'WH-1000-BLK', 199.99, 25, 0.45),
	(2, 2, 'TSHIRT-M-BLK', 19.99, 100, 0.20)
ON DUPLICATE KEY UPDATE
	product_id = VALUES(product_id),
	sku = VALUES(sku),
	price = VALUES(price),
	stock_quantity = VALUES(stock_quantity),
	weight = VALUES(weight);

INSERT INTO variant_attribute_value (variant_id, attribute_value_id)
VALUES
	(1, 3),
	(2, 1),
	(2, 3)
ON DUPLICATE KEY UPDATE
	attribute_value_id = VALUES(attribute_value_id);

INSERT INTO inventory_history (
	id,
	variant_id,
	change_type,
	quantity_change,
	previous_quantity,
	new_quantity,
	notes
)
VALUES
	(1, 1, 'PURCHASE', 25, 0, 25, 'Initial stock'),
	(2, 2, 'PURCHASE', 100, 0, 100, 'Initial stock')
ON DUPLICATE KEY UPDATE
	change_type = VALUES(change_type),
	quantity_change = VALUES(quantity_change),
	previous_quantity = VALUES(previous_quantity),
	new_quantity = VALUES(new_quantity),
	notes = VALUES(notes);

INSERT INTO cart (id, user_id)
VALUES
	(1, 2)
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id);

INSERT INTO cart_item (id, cart_id, variant_id, quantity)
VALUES
	(1, 1, 2, 2)
ON DUPLICATE KEY UPDATE
	cart_id = VALUES(cart_id),
	variant_id = VALUES(variant_id),
	quantity = VALUES(quantity);

INSERT INTO orders (
	id,
	user_id,
	address_id,
	order_number,
	subtotal,
	tax,
	shipping_cost,
	total_amount,
	status
)
VALUES
	(1, 2, 1, 'ORD-0001', 39.98, 0.00, 5.00, 44.98, 'PAID')
ON DUPLICATE KEY UPDATE
	user_id = VALUES(user_id),
	address_id = VALUES(address_id),
	subtotal = VALUES(subtotal),
	tax = VALUES(tax),
	shipping_cost = VALUES(shipping_cost),
	total_amount = VALUES(total_amount),
	status = VALUES(status);

INSERT INTO order_item (
	id,
	order_id,
	variant_id,
	product_name,
	variant_sku,
	quantity,
	unit_price,
	line_total
)
VALUES
	(1, 1, 2, 'Classic T-Shirt', 'TSHIRT-M-BLK', 2, 19.99, 39.98)
ON DUPLICATE KEY UPDATE
	order_id = VALUES(order_id),
	variant_id = VALUES(variant_id),
	product_name = VALUES(product_name),
	variant_sku = VALUES(variant_sku),
	quantity = VALUES(quantity),
	unit_price = VALUES(unit_price),
	line_total = VALUES(line_total);

INSERT INTO payment (
	id,
	order_id,
	payment_method,
	transaction_reference,
	amount,
	status,
	paid_at
)
VALUES
	(1, 1, 'CARD', 'TEST-0001', 44.98, 'SUCCESS', NOW())
ON DUPLICATE KEY UPDATE
	order_id = VALUES(order_id),
	payment_method = VALUES(payment_method),
	transaction_reference = VALUES(transaction_reference),
	amount = VALUES(amount),
	status = VALUES(status),
	paid_at = VALUES(paid_at);
