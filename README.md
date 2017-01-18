SFO passenger data visualization
================================

This visualizes some passenger data for [San Francisco International Airport](http://www.flysfo.com/).

Get up and running
------------------

You'll need Node 6+ installed.

1. Get this project's code and `cd` inside.
1. [Download the data as TSV](https://data.sfgov.org/Transportation/Air-Traffic-Passenger-Statistics/rkru-6vcg) from SF OpenData.
1. Place it in the root of this project as `data.tsv`.
1. Run `npm install`.

Once you've set everything up:

- `npm run build` will build all the files into `dist/`
- `npm run development` will run a development server at `localhost:8000`
- `npm test` will lint the JavaScript
