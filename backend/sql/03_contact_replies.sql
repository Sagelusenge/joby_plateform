USE joby;

DELIMITER //
DROP PROCEDURE IF EXISTS migrate_contact_replies//
CREATE PROCEDURE migrate_contact_replies()
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='contact_messages' AND COLUMN_NAME='admin_reply'
 ) THEN
  ALTER TABLE contact_messages ADD COLUMN admin_reply TEXT NULL AFTER message;
 END IF;

 IF NOT EXISTS (
  SELECT 1 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='contact_messages' AND COLUMN_NAME='replied_by'
 ) THEN
  ALTER TABLE contact_messages ADD COLUMN replied_by BIGINT UNSIGNED NULL AFTER admin_reply;
 END IF;

 IF NOT EXISTS (
  SELECT 1 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='contact_messages' AND COLUMN_NAME='replied_at'
 ) THEN
  ALTER TABLE contact_messages ADD COLUMN replied_at DATETIME NULL AFTER replied_by;
 END IF;

 IF NOT EXISTS (
  SELECT 1 FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='contact_messages'
   AND COLUMN_NAME='replied_by' AND REFERENCED_TABLE_NAME='users'
 ) THEN
  ALTER TABLE contact_messages
   ADD CONSTRAINT fk_contact_reply_user FOREIGN KEY (replied_by)
   REFERENCES users(id) ON DELETE SET NULL;
 END IF;
END//
CALL migrate_contact_replies()//
DROP PROCEDURE migrate_contact_replies//
DELIMITER ;

INSERT IGNORE INTO app_settings(setting_key,setting_value) VALUES
('site_name','Joby'),('site_tagline','Trouvez. Vendez. Connectez.'),
('city_name','Goma, RD Congo'),('contact_email',''),
('contact_phone',''),('contact_whatsapp','');
