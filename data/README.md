# JSON Data Files for LoL Stats Dashboard

This directory contains JSON files with League of Legends match data that will be automatically loaded by the competitive page.

## File Format

Each JSON file should contain match data with the following structure:

```json
{
  "matchId": "unique_match_identifier",
  "timestamp": "2024-01-15T10:30:00Z",
  "events": [
    {
      "type": "team-picked-character",
      "actor": {
        "id": "team_identifier"
      },
      "target": {
        "state": {
          "name": "champion_name"
        }
      },
      "teamId": "team_identifier"
    },
    {
      "type": "team-banned-character",
      "actor": {
        "id": "team_identifier"
      },
      "target": {
        "state": {
          "name": "champion_name"
        }
      },
      "teamId": "team_identifier"
    },
    {
      "type": "team-won-game",
      "actor": {
        "id": "team_identifier"
      },
      "teamId": "team_identifier"
    }
  ]
}
```

## Event Types

- `team-picked-character`: When a team picks a champion
- `team-banned-character`: When a team bans a champion  
- `team-won-game`: When a team wins the game

## Champion Names

Use the internal Riot champion names (e.g., "ahri", "yasuo", "zed"). The system will automatically map these to proper display names.

## How to Use

1. Place your JSON files in this `data/` directory
2. Files will automatically appear in the dropdown on the competitive page
3. Select a file to analyze the match data
4. View champion statistics including pick rates, ban rates, and win rates

## Example Files

- `sample_match_data.json` - Basic example with one match
- `competitive_matches.json` - Multiple competitive matches
- `tournament_data.json` - Tournament match data

## Notes

- Files are loaded via the `/api/load-json` endpoint
- The system supports both single match files and files with multiple matches
- Champion images are loaded from Riot's Data Dragon CDN
- All statistics are calculated in real-time from the uploaded data
