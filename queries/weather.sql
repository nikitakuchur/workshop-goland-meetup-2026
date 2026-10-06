-- name: WeatherFind :one
SELECT * FROM weather WHERE id = ?;

-- name: WeatherCreate :one
INSERT INTO weather (
	id,
	observed_at,
	temperature_actual,
	temperature_apparent,
	precipitation_total,
	precipitation_rain,
	precipitation_snowfall,
	wind_speed,
	wind_gusts,
	wind_direction,
	condition_code,
	condition_description,
	cloud_cover,
	humidity
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;
