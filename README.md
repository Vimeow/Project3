# Project3_Group4

OVERVIEW OF PROJECT & PURPOSE:

The aim was to develop a user-friendly website that offers conservationists as well as the general public sophisticated data visualization derived from global conservation projects. 
This will contribute significantly to wildlife conservation and public education by presenting information in an easily understandable format. 
The goal is to provide accessible and "digestible" data that empowers users to make informed decisions, fostering a greater understanding of conservation efforts worldwide.

INSTRUCTIONS ON HOW TO INTERACT WITH PROJECT:
The webpage comes equipped with 3 visualisations:
  Heat Map
  Bubble Chart
  Pie Chart

Each visualisation comes equipped with 2 dropdown features allowing users to filter data with ease:

Heat Map:
  dataset selection: ability to select 'risk' dataset to visualise.
  species class selection: ability to filter corresponding species class to visualise the quantity of species under selected                            class around the world (within selected countries).
  EXAMPLE: If 'critically endangered species' were selected and 'mammals' were selected, a heat map would generate       
           representing the selected mammal within the extinction risk category by colour/opacity. 
  NOTE: Further quantity information is available via clicking on desired highlighted country.

Bubble Chart:
    dataset selection: ability to select 'risk' dataset to visualise.
    input filter: ability to enter a number of users choice to visualise top countries based on quantity of set risk of
                  extinction level within the nominated range.
    EXAMPLE: If 'critically endangered species' were selected and the number 10 was set, the top 10 countries with         
             critically endangered species would be visualised.

  Pie Chart:
      dataset selection: ability to select 'risk' dataset to visualise.
      country selection: ability to filter all species class data for the corresponding country.
      EXAMPLE: If 'critically endangered species' were selected along with 'Australia' the user will be able to visualise 
               which specie classes fall into the risk category more. (The ability to filter out species class data is 
               available by clicking on the selected species in the legend).
      NOTE: further information about quantities is attainable via hovering mouse over desired pie segment.

SUMMARISING ETHICAL CONSIDERATIONS MADE IN PROJECT:
The data attained for this project are all completely publically sourced.
This project does not disclose any private information on any individual, nor was there any information included in the datasets.
This project does nothing more than present data that is up for the users interpretation. There is no force of belief entailed within this project. 

REFERENCES OF DATA SOURCES:
Data Source 1: Wild Life: https://stats.oecd.org/Index.aspx?DataSetCode=WILD_LIFE
Data Source 2: Country GeoJSON's: https://datahub.io/core/geo-countries#data

REFERENCES OF ANY CODE THAT IS UNORIGINAL:
-None to be mentioned.

PURPOSE OF EACH FILE/FOLDER WITHIN 'Project3_Group4':

DATABASE: //contains sqlite database & datasets converted to csv files
  Conversation.db
  Countries.csv
  CriticallyEndangeredSpecies.csv
  EndangeredSpecies.csv
  KnownSpecies.csv
  ThreatenedSpecies.csv
  VulnerableSpecies.csv

EXCEL TABLES: //contains originall datasets (partially manually edited for simplified handling)
  CriticallyEndangeredSpecies.xlsx
  EndangeredSpecies.xlsx
  KnownSpecies.xlsx
  ThreatenedSpecies.xlsx
  VulnerableSpecies.xlsx

STATIC //contains CSS folder & JS folder

  CSS //contains stye.css file for webpage formatting and styling
    style.css

  JS // contains 3 app.js files, one for each visualisation
    app.js (bubble chart)
    app_b4.js (pie chart)
    app_v7.js (map)

TEMPLATES // contains index.html file for webpage structure
  index.html

Project3_Group4 Presentation.pptx // Presentation for project.
