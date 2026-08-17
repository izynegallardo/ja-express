CREATE TABLE IF NOT EXISTS Otp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    otp VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    UNIQUE KEY unique_destination_purpose (destination, purpose)
);
