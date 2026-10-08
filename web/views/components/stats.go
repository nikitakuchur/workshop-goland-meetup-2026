package components

import "workshop/internal/domain/sighting"

// TopSpecies ranks the most sighted species by the name a reader would recognise.
func TopSpecies(sightings []sighting.Sighting, n int) []sighting.Tally {
	return sighting.Top(sighting.CountBy(sightings, func(s sighting.Sighting) string {
		return displayName(s.Species)
	}), n)
}
