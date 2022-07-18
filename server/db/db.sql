CREATE DATABASE pern_yelp;

CREATE TABLE products(
    product_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) not null,
    price_default INT DEFAULT 999,
    on_sale BOOLEAN DEFAULT TRUE
);

CREATE TABLE restaurants(
    restaurant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name VARCHAR(255) NOT NULL, 
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL CHECK (price_range >= 1 AND price_range<= 5),
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews(
    review_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    review_content VARCHAR(400) NOT NULL, 
	star_rating INT NOT NULL CHECK (star_rating >= 1 AND star_rating<= 5),
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_restaurant_uuid
    FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(restaurant_id)
    ON DELETE CASCADE
);

INSERT INTO restaurants(restaurant_name, location, price_range)
VALUES ('Osteria del Biliardo', 'Affori', 2),
('Birrificio La Ribalta', 'Bovisa', 3),
('Spirit de Milan', 'Bovisa', 3),
('Cracco', 'Duomo', 5);

CREATE MATERIALIZED VIEW avg_ratings AS 
SELECT restaurant_name, 
	   COALESCE(0, star_rating) avg_rating
FROM restaurants res  
left join reviews rev on res.restaurant_id = rev.restaurant_id;


CREATE OR REPLACE FUNCTION refresh_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
    BEGIN 
    IF (TG_OP IN ('UPDATE', 'INSERT', 'DELETE', 'TRUNCATE')) 
        THEN REFRESH MATERIALIZED VIEW avg_ratings;
    END IF;
    RETURN NULL;
    END;
$$;

CREATE OR REPLACE TRIGGER trigger_refresh_avg_rating_review
AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE ON reviews
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_avg_rating();

CREATE OR REPLACE TRIGGER trigger_refresh_avg_rating_restaurant
AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE ON restaurants
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_avg_rating();



