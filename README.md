# MeetMe Server

An Express API app returns recommended journeys from multiple locations
to a convenient point in the middle using TFL API.

## Endpoints


### Directions endpoint

```
<API_HOST>/api/v1/directions/:coord1/:coord2
```

e.g.

```
http://localhost:5000/api/v1/directions/51.5710352,-0.09261149999999999/51.5452153,-0.07491830000000001
```

## Setup

### Requirements

- node - v12.x
- npm

Install all dependencies with

```
npm i
```

Create an `.env` file in the project root with TFL API credentials similar to

```
TFL_APP_ID=<your_tfl_api_id>
TFL_APP_KEY=<your_tfl_app_key>
```

## Development

Run

```
npm run start
```

## Tests

```
npm run test:watch
```

## Deployment

Push to the heroku remote with:

```
git push heroku
```
