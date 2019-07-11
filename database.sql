DROP TABLE "inventory";

CREATE TABLE "inventory" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(80) NOT NULL,
	"quantity" REAL NOT NULL,
	"measure" VARCHAR(20) NOT NULL
);

INSERT INTO "inventory" ("name", "quantity", "measure")
VALUES 
('bamboo', 200.5, 'lbs'),
('apples', 42, 'bushels'),
('yams', 104, 'items'),
('biscuits', 82, 'pkgs');
