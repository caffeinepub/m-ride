# M Ride

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home dashboard showing recent rides and quick stats (total distance, total rides, total time)
- Ride log: list of past rides with details (name, date, distance, duration, notes)
- Add new ride form: name, date, distance (km/miles), duration, route notes, mood/rating
- Ride detail view: view full info for a selected ride
- Basic stats page: total rides, total distance, average ride length, best/longest ride

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Define backend data model: Ride record (id, name, date, distance, duration, notes, rating)
2. Backend CRUD: createRide, getRides, getRide, updateRide, deleteRide, getStats
3. Frontend: Home dashboard with stats summary and recent rides list
4. Frontend: Add Ride form with validation
5. Frontend: Ride log/list view with sorting
6. Frontend: Ride detail view with edit/delete
7. Frontend: Stats page with summary metrics
