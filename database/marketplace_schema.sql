
-- Shopping Cart Schema
CREATE DATABASE IF NOT EXISTS shopping_cart;
USE shopping_cart;

-- Security & RBAC

CREATE TABLE user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permission (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_role (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY(user_id, role_id),

    CONSTRAINT fk_user_role_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_role_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE role_permission (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY(role_id, permission_id),

    CONSTRAINT fk_role_permission_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permission_permission
        FOREIGN KEY (permission_id)
        REFERENCES permission(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_session (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_session_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_verification (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    verification_code VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_verification_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE guest_session (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;



-- Addresses
CREATE TABLE address (
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

    CONSTRAINT fk_address_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;





-- Catalog
CREATE TABLE category (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category_parent
        FOREIGN KEY (parent_id)
        REFERENCES category(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;
    
CREATE TABLE brand (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE product (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    brand_id BIGINT UNSIGNED,
    primary_category_id BIGINT UNSIGNED,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_brand
        FOREIGN KEY (brand_id)
        REFERENCES brand(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_product_primary_category
        FOREIGN KEY (primary_category_id)
        REFERENCES category(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE product_category (
    product_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY(product_id, category_id),

    FOREIGN KEY(product_id)
        REFERENCES product(id)
        ON DELETE CASCADE,

    FOREIGN KEY(category_id)
        REFERENCES category(id)
        ON DELETE CASCADE
);



CREATE TABLE product_image (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,

    url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),

    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_image_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_attribute (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE product_attribute_value (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    attribute_id BIGINT UNSIGNED NOT NULL,

    value VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_attribute_value_attribute
        FOREIGN KEY (attribute_id)
        REFERENCES product_attribute(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variant (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,

    sku VARCHAR(100) UNIQUE,

    price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_variant_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE variant_attribute_value (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    variant_id BIGINT UNSIGNED NOT NULL,
    attribute_value_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_variant_attribute_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_variant_attribute_value
        FOREIGN KEY (attribute_value_id)
        REFERENCES product_attribute_value(id)
        ON DELETE CASCADE,

    UNIQUE(variant_id, attribute_value_id)
) ENGINE=InnoDB;

CREATE TABLE product_tag (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE product_tag_map (
    product_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(product_id, tag_id),

    CONSTRAINT fk_product_tag_map_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_tag_map_tag
        FOREIGN KEY (tag_id)
        REFERENCES product_tag(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reviews
CREATE TABLE review (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    rating TINYINT UNSIGNED NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    title VARCHAR(255),
    body TEXT,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    UNIQUE(user_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE review_image (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    review_id BIGINT UNSIGNED NOT NULL,

    url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_image_review
        FOREIGN KEY (review_id)
        REFERENCES review(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE review_vote (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    vote_type ENUM(
        'UPVOTE',
        'DOWNVOTE'
    ) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_vote_review
        FOREIGN KEY (review_id)
        REFERENCES review(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_vote_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    UNIQUE(review_id, user_id)
) ENGINE=InnoDB;

CREATE TABLE review_report (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    reason VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_report_review
        FOREIGN KEY (review_id)
        REFERENCES review(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_report_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_review_summary (
    product_id BIGINT UNSIGNED PRIMARY KEY,

    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_review_summary_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Inventory
CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    variant_id BIGINT UNSIGNED NOT NULL UNIQUE,

    quantity INT NOT NULL DEFAULT 0,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE inventory_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    variant_id BIGINT UNSIGNED NOT NULL,

    quantity_change INT NOT NULL,

    change_type ENUM(
        'PURCHASE',
        'SALE',
        'RETURN',
        'ADJUSTMENT',
        'DAMAGED',
        'RESTOCK'
    ) NOT NULL,

    note VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_history_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Cart & Wishlist
CREATE TABLE cart (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NULL,
    guest_session_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_guest_session
        FOREIGN KEY (guest_session_id)
        REFERENCES guest_session(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    cart_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,

    quantity INT NOT NULL
        CHECK(quantity > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES cart(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE,

    UNIQUE(cart_id, variant_id)
) ENGINE=InnoDB;

CREATE TABLE wishlist (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlist_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    wishlist_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_item_wishlist
        FOREIGN KEY (wishlist_id)
        REFERENCES wishlist(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_wishlist_item_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE,

    UNIQUE(wishlist_id, variant_id)
) ENGINE=InnoDB;

-- Orders
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    total_amount DECIMAL(12,2) NOT NULL,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
) ENGINE=InnoDB;

CREATE TABLE order_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT UNSIGNED NOT NULL,

    variant_id BIGINT UNSIGNED NOT NULL,

    sku VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
) ENGINE=InnoDB;

CREATE TABLE order_status_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    old_status ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL,
    new_status ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_status_history_order FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Shipping
CREATE TABLE warehouse (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),

    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE courier (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE shipment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT UNSIGNED NOT NULL,

    warehouse_id BIGINT UNSIGNED NOT NULL,
    courier_id BIGINT UNSIGNED NOT NULL,

    tracking_number VARCHAR(255) UNIQUE,

    status ENUM(
        'PENDING',
        'IN_TRANSIT',
        'DELIVERED',
        'RETURNED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shipment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id),

    CONSTRAINT fk_shipment_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouse(id),

    CONSTRAINT fk_shipment_courier
        FOREIGN KEY (courier_id)
        REFERENCES courier(id)
);
CREATE TABLE shipment_item (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shipment_item_shipment FOREIGN KEY (shipment_id)
        REFERENCES shipment(id) ON DELETE CASCADE,
    CONSTRAINT fk_shipment_item_order_item FOREIGN KEY (order_item_id)
        REFERENCES order_item(id)
) ENGINE=InnoDB;
CREATE TABLE tracking_event (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL,
    event_type ENUM('CREATED','IN_TRANSIT','DELIVERED','RETURNED') NOT NULL,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tracking_event_shipment FOREIGN KEY (shipment_id)
        REFERENCES shipment(id)
) ENGINE=InnoDB;

-- Marketing
CREATE TABLE coupon (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    discount_type ENUM(
        'PERCENTAGE',
        'FIXED_AMOUNT'
    ) NOT NULL,

    discount_value DECIMAL(10,2) NOT NULL,

    minimum_order_amount DECIMAL(12,2),

    usage_limit INT,
    usage_count INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    start_date DATE,
    expiration_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE coupon_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    coupon_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,

    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_coupon_usage_coupon
        FOREIGN KEY (coupon_id)
        REFERENCES coupon(id),

    CONSTRAINT fk_coupon_usage_user
        FOREIGN KEY (user_id)
        REFERENCES user(id),

    CONSTRAINT fk_coupon_usage_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
);

CREATE TABLE promotion (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE promotion_product (
    promotion_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY(promotion_id, product_id),

    FOREIGN KEY (promotion_id)
        REFERENCES promotion(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
);
CREATE TABLE promotion_category (
    promotion_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY(promotion_id, category_id),

    FOREIGN KEY (promotion_id)
        REFERENCES promotion(id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE CASCADE
);
CREATE TABLE campaign (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE banner (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Recommendations
CREATE TABLE product_view_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NULL,
    guest_session_id BIGINT UNSIGNED NULL,

    variant_id BIGINT UNSIGNED NOT NULL,

    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    FOREIGN KEY (guest_session_id)
        REFERENCES guest_session(id)
        ON DELETE CASCADE,

    FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE
);
CREATE TABLE search_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    results_count INT NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_history_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE search_click_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    search_history_id BIGINT UNSIGNED NOT NULL,

    user_id BIGINT UNSIGNED NULL,

    variant_id BIGINT UNSIGNED NOT NULL,

    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (search_history_id)
        REFERENCES search_history(id)
        ON DELETE CASCADE
);
CREATE TABLE product_purchase_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_purchase_history_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_purchase_history_variant FOREIGN KEY (variant_id)
        REFERENCES product_variant(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE recommended_product (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    reason VARCHAR(255),
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_clicked BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_recommended_product_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_recommended_product_variant FOREIGN KEY (variant_id)
        REFERENCES product_variant(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE cart_activity (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED,

    variant_id BIGINT UNSIGNED NOT NULL,

    action ENUM(
        'ADD',
        'REMOVE'
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Support
CREATE TABLE ticket (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
    priority ENUM(
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
) DEFAULT 'MEDIUM',

assigned_to BIGINT UNSIGNED NULL,

resolved_at TIMESTAMP NULL,
closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ticket_message (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_message_ticket FOREIGN KEY (ticket_id)
        REFERENCES ticket(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_message_sender FOREIGN KEY (sender_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE ticket_attachment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    ticket_message_id BIGINT UNSIGNED NOT NULL,

    file_url VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_attachment_message
        FOREIGN KEY (ticket_message_id)
        REFERENCES ticket_message(id)
        ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notification (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE notification_recipient (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    notification_id BIGINT UNSIGNED NOT NULL,
    recipient_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_recipient_notification FOREIGN KEY (notification_id)
        REFERENCES notification(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_recipient_user FOREIGN KEY (recipient_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Administration
CREATE TABLE admin_activity_log (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT UNSIGNED NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_activity_log_admin FOREIGN KEY (admin_id)
        REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE system_setting (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Future Payments
CREATE TABLE payment (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE payment_transaction (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    transaction_reference VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_transaction_payment FOREIGN KEY (payment_id)
        REFERENCES payment(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE refund (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reason VARCHAR(255),
    status ENUM('PENDING','APPROVED','REJECTED','COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_payment FOREIGN KEY (payment_id)
        REFERENCES payment(id) ON DELETE CASCADE
) ENGINE=InnoDB;
