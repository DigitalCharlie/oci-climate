# Making Updates

There's two aspects to updating the data used in the application, first updating the datasets used and then making some small tweaks to the code to use that data.

## Data

There are a few different CSV files that the application uses to power the visuals. These are all located in the `public/` directory. They inlucde:

1. `public/dataset.csv` - the main data file that powers https://energyfinance.org/#/data
2. `public/FinanceTrackerCountriesTableOnly.csv` - the data behind the Country or Bilateral Instution view at https://energyfinance.org/#/tracker
3. `public/FinanceTrackerMDBsTableOnly.csv` - the Multilateral or MDB view of https://energyfinance.org/#/tracker
4. `public/Sources.csv` - the Source list used for the Finance Tracker https://energyfinance.org/#/tracker

The `dataset.csv` file was provided by OCI. As updates are made, be sure to maintain the csv column headers

The Finance Tracker csv files were created from this Google Sheet, https://docs.google.com/spreadsheets/d/1SAtbGbJNd0e0lrIVcJ9uo7JrTTgQ6ZHGAQZKr9zHYBM/edit , using the Download as CSV feature.

1. `FinanceTrackerCountriesTableOnly.csv` is exported from the CountriesTableOnly tab
2. `FinanceTrackerMDBsTableOnly.csv` is exported from the MDBsTableOnly tab
3. `Sources.csv` is from the Sources tab

Adding to or updating these files will update the finance tracker. I'd recommend making updates in the Google Sheet and then exporting those Tabs with the above filenames.

## Code

The Finance Tracker should update automatically when the files are updated. The Data Dashboard requires one small tweak to ensure the UI and graphs use the latest year.

In `src/App.js` you can edit the `finalYear` variable to the latest year of data:

    export const finalYear = 2021 // can swap to 2022 once new data is ready

### Other Pages

The Resources page is generated via the markdown document `public/Research.md`

The Home page is located in the `src/Intro/` directory.

The About page is located at `src/About/`


