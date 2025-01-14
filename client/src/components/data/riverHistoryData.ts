export interface RiverHistory {
  id: number;
  yearlyData: {
    year: number;
    level: number;
  }[];
}

export const riverHistoryData: RiverHistory[] = [
  {
    id: 1, // Danube - Vienna
    yearlyData: [
      { year: 2015, level: 2.8 },
      { year: 2016, level: 3.0 },
      { year: 2017, level: 3.1 },
      { year: 2018, level: 3.4 },
      { year: 2019, level: 3.2 },
      { year: 2020, level: 3.0 },
      { year: 2021, level: 3.1 },
      { year: 2022, level: 3.3 },
      { year: 2023, level: 3.2 },
      { year: 2024, level: 3.2 }
    ]
  },
  {
    id: 2, // Inn River - Innsbruck
    yearlyData: [
      { year: 2015, level: 1.5 },
      { year: 2016, level: 1.7 },
      { year: 2017, level: 1.9 },
      { year: 2018, level: 2.1 },
      { year: 2019, level: 1.9 },
      { year: 2020, level: 1.7 },
      { year: 2021, level: 1.8 },
      { year: 2022, level: 2.0 },
      { year: 2023, level: 1.9 },
      { year: 2024, level: 1.8 }
    ]
  },
  {
    id: 3, // Mur - Graz
    yearlyData: [
      { year: 2015, level: 1.9 },
      { year: 2016, level: 2.0 },
      { year: 2017, level: 2.2 },
      { year: 2018, level: 2.3 },
      { year: 2019, level: 2.1 },
      { year: 2020, level: 2.0 },
      { year: 2021, level: 2.1 },
      { year: 2022, level: 2.2 },
      { year: 2023, level: 2.1 },
      { year: 2024, level: 2.1 }
    ]
  },
  {
    id: 4, // Salzach - Salzburg
    yearlyData: [
      { year: 2015, level: 2.2 },
      { year: 2016, level: 2.3 },
      { year: 2017, level: 2.5 },
      { year: 2018, level: 2.6 },
      { year: 2019, level: 2.4 },
      { year: 2020, level: 2.3 },
      { year: 2021, level: 2.4 },
      { year: 2022, level: 2.5 },
      { year: 2023, level: 2.4 },
      { year: 2024, level: 2.4 }
    ]
  },
  {
    id: 5, // Danube - Krems
    yearlyData: [
      { year: 2015, level: 3.2 },
      { year: 2016, level: 3.3 },
      { year: 2017, level: 3.4 },
      { year: 2018, level: 3.7 },
      { year: 2019, level: 3.5 },
      { year: 2020, level: 3.3 },
      { year: 2021, level: 3.4 },
      { year: 2022, level: 3.6 },
      { year: 2023, level: 3.5 },
      { year: 2024, level: 3.5 }
    ]
  },
  {
    id: 6, // Enns - Steyr
    yearlyData: [
      { year: 2015, level: 1.7 },
      { year: 2016, level: 1.8 },
      { year: 2017, level: 2.0 },
      { year: 2018, level: 2.1 },
      { year: 2019, level: 1.9 },
      { year: 2020, level: 1.8 },
      { year: 2021, level: 1.9 },
      { year: 2022, level: 2.0 },
      { year: 2023, level: 1.9 },
      { year: 2024, level: 1.9 }
    ]
  },
  {
    id: 7, // Drau - Villach
    yearlyData: [
      { year: 2015, level: 2.0 },
      { year: 2016, level: 2.1 },
      { year: 2017, level: 2.3 },
      { year: 2018, level: 2.4 },
      { year: 2019, level: 2.2 },
      { year: 2020, level: 2.1 },
      { year: 2021, level: 2.2 },
      { year: 2022, level: 2.3 },
      { year: 2023, level: 2.2 },
      { year: 2024, level: 2.2 }
    ]
  },
  {
    id: 8, // Traun - Wels
    yearlyData: [
      { year: 2015, level: 1.5 },
      { year: 2016, level: 1.6 },
      { year: 2017, level: 1.8 },
      { year: 2018, level: 1.9 },
      { year: 2019, level: 1.7 },
      { year: 2020, level: 1.6 },
      { year: 2021, level: 1.7 },
      { year: 2022, level: 1.8 },
      { year: 2023, level: 1.7 },
      { year: 2024, level: 1.7 }
    ]
  },
  {
    id: 9, // March - Hohenau
    yearlyData: [
      { year: 2015, level: 2.6 },
      { year: 2016, level: 2.7 },
      { year: 2017, level: 2.9 },
      { year: 2018, level: 3.0 },
      { year: 2019, level: 2.8 },
      { year: 2020, level: 2.7 },
      { year: 2021, level: 2.8 },
      { year: 2022, level: 2.9 },
      { year: 2023, level: 2.8 },
      { year: 2024, level: 2.8 }
    ]
  },
  {
    id: 10, // Raab - Feldbach
    yearlyData: [
      { year: 2015, level: 1.3 },
      { year: 2016, level: 1.4 },
      { year: 2017, level: 1.6 },
      { year: 2018, level: 1.7 },
      { year: 2019, level: 1.5 },
      { year: 2020, level: 1.4 },
      { year: 2021, level: 1.5 },
      { year: 2022, level: 1.6 },
      { year: 2023, level: 1.5 },
      { year: 2024, level: 1.5 }
    ]
  }
];