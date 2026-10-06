-- +goose Up
-- +goose StatementBegin
CREATE TABLE weather (
	id                      UUID PRIMARY KEY,
	created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	observed_at             DATETIME NOT NULL,
	-- degrees Celsius
	temperature_actual      REAL NOT NULL,
	temperature_apparent    REAL NOT NULL,
	-- millimetres, except snowfall in centimetres
	precipitation_total     REAL NOT NULL CHECK (precipitation_total >= 0),
	precipitation_rain      REAL NOT NULL CHECK (precipitation_rain >= 0),
	precipitation_snowfall  REAL NOT NULL CHECK (precipitation_snowfall >= 0),
	-- km/h at ten metres; direction in degrees clockwise from north
	wind_speed              REAL NOT NULL CHECK (wind_speed >= 0),
	wind_gusts              REAL NOT NULL CHECK (wind_gusts >= 0),
	wind_direction          INTEGER NOT NULL CHECK (wind_direction BETWEEN 0 AND 360),
	-- WMO weather code and its description
	condition_code          INTEGER NOT NULL,
	condition_description   TEXT NOT NULL,
	-- percentages
	cloud_cover             INTEGER NOT NULL CHECK (cloud_cover BETWEEN 0 AND 100),
	humidity                INTEGER NOT NULL CHECK (humidity BETWEEN 0 AND 100)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS weather;
-- +goose StatementEnd
