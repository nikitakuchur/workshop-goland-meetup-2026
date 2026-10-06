package weathersqlite

import (
	"uuid"
	"workshop/internal/domain/weather"
	db "workshop/internal/infra/db/sqlc"
)

func transform(r db.Weather) weather.Weather {
	return weather.Weather{
		ID:         r.ID,
		ObservedAt: r.ObservedAt,
		Temperature: weather.Temperature{
			Actual:   r.TemperatureActual,
			Apparent: r.TemperatureApparent,
		},
		Precipitation: weather.Precipitation{
			Total:    r.PrecipitationTotal,
			Rain:     r.PrecipitationRain,
			Snowfall: r.PrecipitationSnowfall,
		},
		Wind: weather.Wind{
			Speed:     r.WindSpeed,
			Gusts:     r.WindGusts,
			Direction: int(r.WindDirection),
		},
		Condition: weather.Condition{
			Code:        int(r.ConditionCode),
			Description: r.ConditionDescription,
		},
		CloudCover: int(r.CloudCover),
		Humidity:   int(r.Humidity),
		CreatedAt:  r.CreatedAt,
		UpdatedAt:  r.UpdatedAt,
	}
}

func toWeatherCreateParams(id uuid.UUID, in weather.CreateParams) db.WeatherCreateParams {
	return db.WeatherCreateParams{
		ID:                    id,
		ObservedAt:            in.ObservedAt,
		TemperatureActual:     in.Temperature.Actual,
		TemperatureApparent:   in.Temperature.Apparent,
		PrecipitationTotal:    in.Precipitation.Total,
		PrecipitationRain:     in.Precipitation.Rain,
		PrecipitationSnowfall: in.Precipitation.Snowfall,
		WindSpeed:             in.Wind.Speed,
		WindGusts:             in.Wind.Gusts,
		WindDirection:         int64(in.Wind.Direction),
		ConditionCode:         int64(in.Condition.Code),
		ConditionDescription:  in.Condition.Description,
		CloudCover:            int64(in.CloudCover),
		Humidity:              int64(in.Humidity),
	}
}
