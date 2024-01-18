-- Auth.js models
-- see https://authjs.dev/reference/adapter/pg
CREATE TABLE verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
    id SERIAL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT,
    "userId" SERIAL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE TABLE sessions (
    id SERIAL,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,
    "userId" SERIAL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE TABLE users (
    id SERIAL,
    name VARCHAR(255),
    email VARCHAR(255),
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    "roleId" SERIAL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("roleId") REFERENCES user_roles(id)
);

CREATE TABLE user_roles (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- End Auth.js models
CREATE TABLE Products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    quantity INTEGER NOT NULL
);

CREATE TABLE Order_lines(
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    "orderId" SERIAL NOT NULL,
    FOREIGN KEY ("productId") REFERENCES Products(id),
    FOREIGN KEY ("orderId") REFERENCES Orders(id)
);

CREATE TABLE Orders(
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "totalPrice" DECIMAL(10, 2) NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id)
);