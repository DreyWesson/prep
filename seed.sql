-- CREATE TABLE
CREATE TABLE IF NOT EXISTS "item" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- READ
SELECT * FROM "item";
SELECT * FROM "item" WHERE "id" = 1;
SELECT * FROM "item" WHERE "name" = 'Item 1';

-- CREATE
INSERT INTO "item" ("name", "description")
VALUES ('Item 2', 'Description 2') RETURNING *;

-- UPDATE
UPDATE "item" SET "name" = 'Item 3' WHERE "id" = 2 RETURNING *;

-- DELETE
DELETE FROM "item" WHERE "id" = 2;
