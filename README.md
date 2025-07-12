# Market Charts

### Live Demo: https://market-charts-ten.vercel.app/

Market Charts is a web application that allows to receive real time market data and historical price charts
for different market assets.

## Tech Stack

- Angular
- WebSocket

## Installation

1. Clone the repository:
```bash
git clone https://github.com/d-art3m/market-charts
```

2. Install dependencies:
```bash
npm install
```

3. Create your `.env` file

4. Open the `.env` file and configure the following environment variables:
```bash
NG_APP_USERNAME=
NG_APP_PASSWORD=
```

5. Run the development server:
```bash
ng serve --proxy-config proxy.conf.json
```