-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;

CREATE TABLE IF NOT EXISTS public.accounts (
    id serial NOT NULL,
    "userId" integer NOT NULL,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    provider character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "providerAccountId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    refresh_token text COLLATE pg_catalog."default",
    access_token text COLLATE pg_catalog."default",
    expires_at bigint,
    id_token text COLLATE pg_catalog."default",
    scope text COLLATE pg_catalog."default",
    session_state text COLLATE pg_catalog."default",
    token_type text COLLATE pg_catalog."default",
    CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_lines (
    productid integer NOT NULL,
    quantity integer NOT NULL,
    userid serial NOT NULL,
    CONSTRAINT cart_lines_pkey PRIMARY KEY (productid, userid)
);

CREATE TABLE IF NOT EXISTS public.order_lines (
    id serial NOT NULL,
    status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL,
    orderid integer NOT NULL,
    productid integer NOT NULL,
    CONSTRAINT order_lines_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id serial NOT NULL,
    totalquantity integer NOT NULL,
    createdat timestamp with time zone NOT NULL DEFAULT now(),
    updatedat timestamp with time zone NOT NULL DEFAULT now(),
    totalprice numeric(10, 2) NOT NULL,
    userid integer NOT NULL,
    status character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.products (
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    price numeric(10, 2) NOT NULL,
    image text COLLATE pg_catalog."default",
    quantity integer NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.sessions (
    id serial NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    "sessionToken" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users (
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    "emailVerified" timestamp with time zone,
    image text COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user' :: character varying,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.verification_token (
    identifier text COLLATE pg_catalog."default" NOT NULL,
    expires timestamp with time zone NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT verification_token_pkey PRIMARY KEY (identifier, token)
);

ALTER TABLE
    IF EXISTS public.cart_lines
ADD
    CONSTRAINT fk_product FOREIGN KEY (productid) REFERENCES public.products (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE
    IF EXISTS public.cart_lines
ADD
    CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE
    IF EXISTS public.order_lines
ADD
    CONSTRAINT order_lines_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE
    IF EXISTS public.order_lines
ADD
    CONSTRAINT order_lines_productid_fkey FOREIGN KEY (productid) REFERENCES public.products (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE
    IF EXISTS public.orders
ADD
    CONSTRAINT orders_userid_fkey FOREIGN KEY (userid) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- Triggers
CREATE
OR REPLACE FUNCTION update_order_on_orderline_update() RETURNS TRIGGER AS $ $ DECLARE local_quantity int;

local_price int;

BEGIN IF NEW.quantity != OLD.quantity
OR NEW.price != OLD.price THEN
SELECT
    SUM(order_lines.price * order_lines.quantity) INTO local_price
FROM
    order_lines
WHERE
    orderid = NEW.orderid;

SELECT
    SUM(order_lines.quantity) INTO local_quantity
FROM
    order_lines
WHERE
    orderid = NEW.orderid;

UPDATE
    orders
SET
    totalquantity = local_quantity,
    totalprice = local_price,
    updatedat = NOW()
WHERE
    id = NEW.orderid;

END IF;

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION update_order_on_orderline_insert() RETURNS TRIGGER AS $ $ DECLARE local_quantity int;

local_price int;

BEGIN
SELECT
    SUM(order_lines.price * order_lines.quantity) INTO local_price
FROM
    order_lines
WHERE
    orderid = NEW.orderid;

SELECT
    SUM(order_lines.quantity) INTO local_quantity
FROM
    order_lines
WHERE
    orderid = NEW.orderid;

UPDATE
    orders
SET
    totalquantity = local_quantity,
    totalprice = local_price,
    updatedat = NOW()
WHERE
    id = NEW.orderid;

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION update_order_on_orderline_delete() RETURNS TRIGGER AS $ $ DECLARE local_quantity int;

local_price int;

BEGIN
SELECT
    SUM(order_lines.price * order_lines.quantity) INTO local_price
FROM
    order_lines
WHERE
    orderid = OLD.orderid;

SELECT
    SUM(order_lines.quantity) INTO local_quantity
FROM
    order_lines
WHERE
    orderid = OLD.orderid;

UPDATE
    orders
SET
    totalquantity = local_quantity,
    totalprice = local_price,
    updatedat = NOW()
WHERE
    id = OLD.orderid;

RETURN OLD;

END;

$ $ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER order_line_update
AFTER
UPDATE
    ON order_lines FOR EACH ROW EXECUTE PROCEDURE update_order_on_orderline_update();

CREATE
OR REPLACE TRIGGER order_line_insert
AFTER
INSERT
    ON order_lines FOR EACH ROW EXECUTE PROCEDURE update_order_on_orderline_insert();

CREATE
OR REPLACE TRIGGER order_line_delete
AFTER
    DELETE ON order_lines FOR EACH ROW EXECUTE PROCEDURE update_order_on_orderline_delete();
END;

CREATE OR REPLACE TRIGGER review_line_deletion_trigger
    AFTER DELETE
    ON public.review_lines
    FOR EACH ROW
    EXECUTE FUNCTION public.review_deletion();

CREATE OR REPLACE TRIGGER review_line_inserion_trigger
    AFTER INSERT
    ON public.review_lines
    FOR EACH ROW
    EXECUTE FUNCTION public.review_creation();

CREATE OR REPLACE FUNCTION public.review_creation()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 

DECLARE local_average NUMERIC(10,2);
BEGIN
	SELECT AVG(rating) INTO local_average FROM review_lines WHERE productid= NEW.productid;

	UPDATE products	
		SET review_score = local_average
		WHERE id = NEW.productid;
		
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.review_creation()
    OWNER TO "default";


CREATE OR REPLACE FUNCTION public.review_deletion()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 

DECLARE local_average NUMERIC(10,2);
BEGIN
	SELECT AVG(rating)  INTO local_average
		FROM review_lines
		WHERE productid = OLD.productid;

	UPDATE products
		SET review_score = local_average
		WHERE id = OLD.productid;
	
	RETURN OLD;
END;
$BODY$;

ALTER FUNCTION public.review_deletion()
    OWNER TO "default";