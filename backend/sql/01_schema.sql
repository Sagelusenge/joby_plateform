CREATE DATABASE IF NOT EXISTS joby CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE joby;
CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL, phone VARCHAR(35), whatsapp VARCHAR(35), role ENUM('user','moderator','admin') NOT NULL DEFAULT 'user',
 status ENUM('active','suspended') NOT NULL DEFAULT 'active', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS cities (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(90) NOT NULL, province VARCHAR(90) NOT NULL DEFAULT 'Nord-Kivu', country VARCHAR(90) NOT NULL DEFAULT 'RDC', UNIQUE KEY uq_city(name,province));
CREATE TABLE IF NOT EXISTS districts (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, city_id BIGINT UNSIGNED NOT NULL, name VARCHAR(100) NOT NULL, FOREIGN KEY(city_id) REFERENCES cities(id), UNIQUE KEY uq_district(city_id,name));
CREATE TABLE IF NOT EXISTS categories (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(110) NOT NULL, slug VARCHAR(120) NOT NULL UNIQUE, parent_id BIGINT UNSIGNED NULL, active BOOLEAN NOT NULL DEFAULT TRUE, FOREIGN KEY(parent_id) REFERENCES categories(id) ON DELETE SET NULL);
CREATE TABLE IF NOT EXISTS listings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, category_id BIGINT UNSIGNED NOT NULL,
 city_id BIGINT UNSIGNED NOT NULL, district_id BIGINT UNSIGNED NULL, type ENUM('service','product','business','job','mission') NOT NULL,
 title VARCHAR(190) NOT NULL, description TEXT NOT NULL, price DECIMAL(12,2) NULL, currency ENUM('USD','CDF') NOT NULL DEFAULT 'USD',
 phone VARCHAR(35) NOT NULL, whatsapp VARCHAR(35), address VARCHAR(255), status ENUM('pending','published','rejected','expired','hidden') NOT NULL DEFAULT 'pending',
 rejection_reason VARCHAR(500), views INT UNSIGNED NOT NULL DEFAULT 0, featured_until DATETIME NULL, expires_at DATETIME NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(city_id) REFERENCES cities(id), FOREIGN KEY(district_id) REFERENCES districts(id), INDEX idx_listing_filters(status,type,category_id,city_id), INDEX idx_listing_user(user_id)
);
CREATE TABLE IF NOT EXISTS listing_images (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, listing_id BIGINT UNSIGNED NOT NULL, image_url VARCHAR(1500) NOT NULL, sort_order INT NOT NULL DEFAULT 0, FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS promotion_plans (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(110) NOT NULL, price DECIMAL(12,2) NOT NULL, currency ENUM('USD','CDF') NOT NULL DEFAULT 'USD', duration_days INT UNSIGNED NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS promotions (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, listing_id BIGINT UNSIGNED NOT NULL, plan_id BIGINT UNSIGNED NOT NULL, status ENUM('requested','active','rejected','expired') NOT NULL DEFAULT 'requested', starts_at DATETIME NULL, ends_at DATETIME NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(listing_id) REFERENCES listings(id), FOREIGN KEY(plan_id) REFERENCES promotion_plans(id));
CREATE TABLE IF NOT EXISTS ad_campaigns (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, advertiser_id BIGINT UNSIGNED NOT NULL, title VARCHAR(190) NOT NULL, image_url VARCHAR(1500), target_url VARCHAR(1500), placement ENUM('home','search','sidebar') NOT NULL DEFAULT 'home', status ENUM('draft','active','paused','ended') NOT NULL DEFAULT 'draft', starts_at DATETIME NULL, ends_at DATETIME NULL, impressions INT UNSIGNED DEFAULT 0, clicks INT UNSIGNED DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(advertiser_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS payments (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, promotion_id BIGINT UNSIGNED NULL, campaign_id BIGINT UNSIGNED NULL, amount DECIMAL(12,2) NOT NULL, currency ENUM('USD','CDF') NOT NULL DEFAULT 'USD', method VARCHAR(60) NOT NULL DEFAULT 'manual', reference VARCHAR(150), status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending', verified_by BIGINT UNSIGNED NULL, verified_at DATETIME NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(promotion_id) REFERENCES promotions(id), FOREIGN KEY(campaign_id) REFERENCES ad_campaigns(id), FOREIGN KEY(verified_by) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS reports (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, listing_id BIGINT UNSIGNED NOT NULL, reporter_id BIGINT UNSIGNED NULL, reason VARCHAR(120) NOT NULL, details TEXT, status ENUM('open','reviewing','resolved','dismissed') NOT NULL DEFAULT 'open', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(listing_id) REFERENCES listings(id), FOREIGN KEY(reporter_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS content_pages (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(120) NOT NULL UNIQUE, title VARCHAR(190) NOT NULL, body MEDIUMTEXT NOT NULL, published BOOLEAN NOT NULL DEFAULT FALSE, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS announcements (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(190) NOT NULL, body TEXT NOT NULL, published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS home_banners (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(190) NOT NULL, description TEXT NOT NULL,
 image_url VARCHAR(1500) NULL, cta_label VARCHAR(80) NOT NULL DEFAULT 'Découvrir', target_url VARCHAR(1500) NULL,
 sort_order INT NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS contact_messages (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL, subject VARCHAR(190) NOT NULL, message TEXT NOT NULL, admin_reply TEXT NULL, replied_by BIGINT UNSIGNED NULL, replied_at DATETIME NULL, status ENUM('new','read','closed') NOT NULL DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(replied_by) REFERENCES users(id) ON DELETE SET NULL);
CREATE TABLE IF NOT EXISTS notifications (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, title VARCHAR(190) NOT NULL, body TEXT, read_at DATETIME NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS app_settings (setting_key VARCHAR(120) PRIMARY KEY, setting_value TEXT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_logs (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, actor_id BIGINT UNSIGNED NULL, action VARCHAR(110) NOT NULL, entity VARCHAR(100) NOT NULL, entity_id BIGINT UNSIGNED NULL, details JSON NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE SET NULL, INDEX idx_audit_time(created_at));
CREATE OR REPLACE VIEW v_listing_summary AS SELECT l.id,l.title,l.type,l.status,l.views,l.created_at,u.name AS advertiser,c.name AS category,ci.name AS city FROM listings l JOIN users u ON u.id=l.user_id JOIN categories c ON c.id=l.category_id JOIN cities ci ON ci.id=l.city_id;
CREATE OR REPLACE VIEW v_monthly_revenue AS SELECT DATE_FORMAT(verified_at,'%Y-%m') AS month,currency,COUNT(*) AS payments_count,SUM(amount) AS revenue FROM payments WHERE status='verified' AND verified_at IS NOT NULL GROUP BY DATE_FORMAT(verified_at,'%Y-%m'),currency;
CREATE OR REPLACE VIEW v_listing_stats AS SELECT status,type,COUNT(*) AS total,SUM(views) AS total_views FROM listings GROUP BY status,type;
INSERT IGNORE INTO cities(id,name,province,country) VALUES (1,'Goma','Nord-Kivu','RDC');
INSERT IGNORE INTO districts(city_id,name) VALUES (1,'Goma'),(1,'Karisimbi');
INSERT IGNORE INTO categories(id,name,slug) VALUES (1,'Services','services'),(2,'Produits','produits'),(3,'Entreprises','entreprises'),(4,'Emplois','emplois'),(5,'Missions','missions');
INSERT IGNORE INTO promotion_plans(id,name,price,currency,duration_days) VALUES (1,'Mise en avant 7 jours',5,'USD',7),(2,'Mise en avant 30 jours',15,'USD',30);
INSERT IGNORE INTO home_banners(id,title,description,cta_label,target_url,sort_order,active)
VALUES (1,'Les opportunités de Goma, réunies au même endroit','Découvrez les services, produits et emplois près de chez vous avec Joby.','Explorer les annonces','#annonces',0,TRUE);
INSERT IGNORE INTO app_settings(setting_key,setting_value) VALUES
('site_name','Joby'),('site_tagline','Trouvez. Vendez. Connectez.'),('city_name','Goma, RD Congo'),
('contact_email',''),('contact_phone',''),('contact_whatsapp','');
