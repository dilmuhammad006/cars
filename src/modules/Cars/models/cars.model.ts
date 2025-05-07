export const CarsModelTable = `
    CREATE TABLE IF NOT EXISTS cars(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR NOT NULL,
    brand VARCHAR NOT NULL,
    year INT NOT NULL,
    price INT NOT NULL
    );
`;

export const CarsImagesModelTable = `
    CREATE TABLE IF NOT EXISTS images(
    id SERIAL PRIMARY KEY NOT NULL,
    images TEXT ,
    car_id INT REFERENCES cars(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    );
`;
