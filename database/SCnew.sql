
-- Shopping Cart Schema
CREATE DATABASE IF NOT EXISTS shopping_cart;
USE shopping_cart;

DROP TABLE IF EXISTS user_role, role_permission, user_session, user_verification, guest_session;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS category, brand, product, product_category, product_image, product_attribute, product_attribute_value, product_variant, variant_attribute_value, product_tag, product_tag_map, product_report;
DROP TABLE IF EXISTS review, review_image, review_vote, review_report, product_review_summary;
DROP TABLE IF EXISTS inventory, inventory_history;
DROP TABLE IF EXISTS cart, cart_item, wishlist, wishlist_item;
DROP TABLE IF EXISTS orders, order_item, order_status_history;
DROP TABLE IF EXISTS return_request, return_request_history, return_request_item, refund;
DROP TABLE IF EXISTS coupon, coupon_usage, promotion, promotion_product, promotion_category, banner;
DROP TABLE IF EXISTS ticket, ticket_message, ticket_attachment, ticket_status_history;
DROP TABLE IF EXISTS notification_type, notification, notification_recipient;
DROP TABLE IF EXISTS product_view_history, search_history, search_click_history, product_purchase_history, recommended_product, cart_activity;


-- Security & RBAC

CREATE TABLE user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB;

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

-- Categories & Subcategories.
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)ENGINE=InnoDB;

CREATE TABLE product (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    brand_id BIGINT UNSIGNED,
    primary_category_id BIGINT UNSIGNED,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

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
)ENGINE=InnoDB;



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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)ENGINE=InnoDB;

CREATE TABLE product_attribute_value (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    attribute_id BIGINT UNSIGNED NOT NULL,

    value VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_attribute_value_attribute
        FOREIGN KEY (attribute_id)
        REFERENCES product_attribute(id)
        ON DELETE CASCADE,
    UNIQUE(attribute_id, value)
) ENGINE=InnoDB;


-- check if name or description is needed   
CREATE TABLE product_variant (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,

    sku VARCHAR(100) UNIQUE,

    price DECIMAL(10,2) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)ENGINE=InnoDB;

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

-- product reporting
CREATE TABLE product_report (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    reason VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_report_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_report_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;    


-- Reviews     changing product_id to variant_id to allow reviews on specific variants instead of just the product. This way we can have more accurate reviews for different variants of the same product. For example, if a shirt comes in different sizes and colors, customers can review each variant separately based on their experience with that specific variant. This also allows us to calculate average ratings for each variant instead of just the overall product rating.

CREATE TABLE review (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    variant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    rating TINYINT UNSIGNED NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    title VARCHAR(255),
    body TEXT,

    -- status ENUM(
    --     'PENDING',
    --     'APPROVED',
    --     'REJECTED'
    -- ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    UNIQUE(user_id, variant_id)
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
    performed_by BIGINT UNSIGNED,

    variant_id BIGINT UNSIGNED NOT NULL,

    quantity_before INT NOT NULL,
quantity_after INT NOT NULL,
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
        ON DELETE CASCADE,

    CONSTRAINT fk_inventory_history_performed_by
        FOREIGN KEY (performed_by)
        REFERENCES user(id)
        ON DELETE SET NULL

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
        ON DELETE CASCADE,
    
    CHECK (
  (user_id IS NOT NULL AND guest_session_id IS NULL)
  OR
  (user_id IS NULL AND guest_session_id IS NOT NULL)
)

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

-- Returns & Refunds
CREATE TABLE return_request (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_return_request_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- return request history
CREATE TABLE return_request_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_request_id BIGINT UNSIGNED NOT NULL,
    old_status ENUM('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL,
    new_status ENUM('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT UNSIGNED NOT NULL,
    CONSTRAINT fk_return_request_history_request FOREIGN KEY (return_request_id)
        REFERENCES return_request(id) ON DELETE CASCADE,

    CONSTRAINT fk_return_request_history_changed_by
    FOREIGN KEY (changed_by)
    REFERENCES user(id)
    ON DELETE RESTRICT

) ENGINE=InnoDB;

-- return request item
CREATE TABLE return_request_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    return_request_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_return_request_item_request
        FOREIGN KEY (return_request_id)
        REFERENCES return_request(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_return_request_item_order_item
        FOREIGN KEY (order_item_id)
        REFERENCES order_item(id)
        ON DELETE CASCADE,

    UNIQUE(return_request_id, order_item_id)

) ENGINE=InnoDB;

-- refund
CREATE TABLE refund (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    return_request_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_refund_return_request
        FOREIGN KEY (return_request_id)
        REFERENCES return_request(id)
        ON DELETE CASCADE,
    unique(return_request_id)

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
    max_discount_amount DECIMAL(10,2),

    is_active BOOLEAN DEFAULT TRUE,

    start_date DATE,
    expiration_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;
CREATE TABLE coupon_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    coupon_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,

    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(coupon_id, user_id),

    CONSTRAINT fk_coupon_usage_coupon
        FOREIGN KEY (coupon_id)
        REFERENCES coupon(id),

    CONSTRAINT fk_coupon_usage_user
        FOREIGN KEY (user_id)
        REFERENCES user(id),

    CONSTRAINT fk_coupon_usage_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
)ENGINE=InnoDB;

CREATE TABLE promotion (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM(
    'PERCENTAGE',
    'FIXED_AMOUNT'
),

discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)ENGINE=InnoDB;

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
)ENGINE=InnoDB;
CREATE TABLE promotion_category (
    promotion_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    -- check if it product_id or category_id -- done

    PRIMARY KEY(promotion_id, category_id),

    FOREIGN KEY (promotion_id)
        REFERENCES promotion(id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE CASCADE
)ENGINE=InnoDB;


CREATE TABLE banner (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)ENGINE=InnoDB;



-- Support
CREATE TABLE ticket (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT UNSIGNED NOT NULL,

    subject VARCHAR(255) NOT NULL,
    description TEXT,

    status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
    ) DEFAULT 'OPEN',

    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH',
        'URGENT'
    ) DEFAULT 'MEDIUM',

    assigned_to BIGINT UNSIGNED NULL, -- role or individual user
    assigned_role_id BIGINT UNSIGNED NULL,

    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_assigned
        FOREIGN KEY (assigned_to)
        REFERENCES user(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_ticket_assigned_role
        FOREIGN KEY (assigned_role_id)
        REFERENCES role(id)
        ON DELETE SET NULL

) ENGINE=InnoDB;

CREATE TABLE ticket_message (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    message TEXT NOT NULL,
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
) ENGINE=InnoDB;

CREATE TABLE ticket_status_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,
    old_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NULL,
    new_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL,
    changed_by BIGINT UNSIGNED NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_status_history_ticket FOREIGN KEY (ticket_id)
        REFERENCES ticket(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_status_history_changed_by FOREIGN KEY (changed_by)
        REFERENCES user(id)
) ENGINE=InnoDB;


-- Notifications
CREATE TABLE notification_type (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE notification (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    notification_type_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,

    created_by BIGINT UNSIGNED NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_type
        FOREIGN KEY (notification_type_id)
        REFERENCES notification_type(id),

    CONSTRAINT fk_notification_created_by
        FOREIGN KEY (created_by)
        REFERENCES user(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notification_recipient (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    notification_id BIGINT UNSIGNED NOT NULL,
    recipient_id BIGINT UNSIGNED NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_recipient_notification
        FOREIGN KEY (notification_id)
        REFERENCES notification(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_recipient_user
        FOREIGN KEY (recipient_id)
        REFERENCES user(id)
        ON DELETE CASCADE,
    UNIQUE(notification_id, recipient_id)
) ENGINE=InnoDB;










-- Analytics

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
        ON DELETE CASCADE,

        CHECK(
            (user_id IS NOT NULL AND guest_session_id IS NULL)
            OR
            (user_id IS NULL AND guest_session_id IS NOT NULL)
            )

) ENGINE=InnoDB;
CREATE TABLE search_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED  NULL,
    guest_session_id BIGINT UNSIGNED NULL,
    search_query VARCHAR(255) NOT NULL,
    results_count INT NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_history_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_search_history_guest_session FOREIGN KEY (guest_session_id)
        REFERENCES guest_session(id) ON DELETE CASCADE,
        CHECK(
(user_id IS NOT NULL AND guest_session_id IS NULL)
OR
(user_id IS NULL AND guest_session_id IS NOT NULL)
)
) ENGINE=InnoDB;
CREATE TABLE search_click_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    search_history_id BIGINT UNSIGNED NOT NULL,

    user_id BIGINT UNSIGNED NULL,

    variant_id BIGINT UNSIGNED NOT NULL,

    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (search_history_id)
        REFERENCES search_history(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE CASCADE,

FOREIGN KEY (variant_id)
    REFERENCES product_variant(id)
    ON DELETE CASCADE
);
CREATE TABLE product_purchase_history (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    variant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_purchase_history_user FOREIGN KEY (user_id)
        REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_purchase_history_variant FOREIGN KEY (variant_id)
        REFERENCES product_variant(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- can be calculated on the fly but storing it for faster retrieval and to keep track of when the recommendation was made and if it was clicked or not
CREATE TABLE recommended_product (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    reason VARCHAR(255),
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP NULL,
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

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE CASCADE,

FOREIGN KEY (variant_id)
    REFERENCES product_variant(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;



-- can consider indexes 

-- orders(user_id, status)

-- order_item(variant_id)

-- review(product_id)

-- notification_recipient(recipient_id, is_read)

-- ticket(user_id, status)

-- return_request(user_id)

-- product_view_history(user_id)

-- search_history(user_id)

-- recommended_product(user_id)

