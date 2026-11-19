USE joby;

CREATE TABLE IF NOT EXISTS home_banners (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(190) NOT NULL, description TEXT NOT NULL,
 image_url VARCHAR(1500) NULL, cta_label VARCHAR(80) NOT NULL DEFAULT 'Découvrir', target_url VARCHAR(1500) NULL,
 sort_order INT NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO home_banners(id,title,description,cta_label,target_url,sort_order,active)
VALUES (1,'Les opportunités de Goma, réunies au même endroit','Découvrez les services, produits et emplois près de chez vous avec Joby.','Explorer les annonces','#annonces',0,TRUE);
