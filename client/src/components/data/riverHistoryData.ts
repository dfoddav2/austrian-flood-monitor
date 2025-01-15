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
    { year: 1951, level: 0 },   // May 11, 1951
    { year: 1959, level: 0 },   // July 21, 1959
    { year: 1975, level: 0 },   // July 10, 1975
    { year: 1991, level: 3.41 }, // May 18, 1991
    { year: 2002, level: 4.96 }, // August 7, 2002
    { year: 2005, level: 3.26 }, // July 12, 2005
    { year: 2008, level: 4.03 }, // June 24, 2008
    { year: 2009, level: 3.27 }, // July 6, 2009
    { year: 2010, level: 3.55 }, // July 16, 2010
    { year: 2010, level: 3.32 }  // August 7, 2010
  ]
},

  // {
  //   id: 2, // Inn River - Innsbruck
  //   yearlyData: [
  //     { year: 2015, level: 1.5 },
  //     { year: 2016, level: 1.7 },
  //     { year: 2017, level: 1.9 },
  //     { year: 2018, level: 2.1 },
  //     { year: 2019, level: 1.9 },
  //     { year: 2020, level: 1.7 },
  //     { year: 2021, level: 1.8 },
  //     { year: 2022, level: 2.0 },
  //     { year: 2023, level: 1.9 },
  //     { year: 2024, level: 1.8 }
  //   ]
  // },
  // {
  //   id: 3, // Mur - Graz
  //   yearlyData: [
  //     { year: 2015, level: 1.9 },
  //     { year: 2016, level: 2.0 },
  //     { year: 2017, level: 2.2 },
  //     { year: 2018, level: 2.3 },
  //     { year: 2019, level: 2.1 },
  //     { year: 2020, level: 2.0 },
  //     { year: 2021, level: 2.1 },
  //     { year: 2022, level: 2.2 },
  //     { year: 2023, level: 2.1 },
  //     { year: 2024, level: 2.1 }
  //   ]
  // },
  // {
  //   id: 4, // Salzach - Salzburg
  //   yearlyData: [
  //     { year: 2015, level: 2.2 },
  //     { year: 2016, level: 2.3 },
  //     { year: 2017, level: 2.5 },
  //     { year: 2018, level: 2.6 },
  //     { year: 2019, level: 2.4 },
  //     { year: 2020, level: 2.3 },
  //     { year: 2021, level: 2.4 },
  //     { year: 2022, level: 2.5 },
  //     { year: 2023, level: 2.4 },
  //     { year: 2024, level: 2.4 }
  //   ]
  // },
  // {
  //   id: 5, // Danube - Krems
  //   yearlyData: [
  //     { year: 2015, level: 3.2 },
  //     { year: 2016, level: 3.3 },
  //     { year: 2017, level: 3.4 },
  //     { year: 2018, level: 3.7 },
  //     { year: 2019, level: 3.5 },
  //     { year: 2020, level: 3.3 },
  //     { year: 2021, level: 3.4 },
  //     { year: 2022, level: 3.6 },
  //     { year: 2023, level: 3.5 },
  //     { year: 2024, level: 3.5 }
  //   ]
  // },
  // {
  //   id: 6, // Enns - Steyr
  //   yearlyData: [
  //     { year: 2015, level: 1.7 },
  //     { year: 2016, level: 1.8 },
  //     { year: 2017, level: 2.0 },
  //     { year: 2018, level: 2.1 },
  //     { year: 2019, level: 1.9 },
  //     { year: 2020, level: 1.8 },
  //     { year: 2021, level: 1.9 },
  //     { year: 2022, level: 2.0 },
  //     { year: 2023, level: 1.9 },
  //     { year: 2024, level: 1.9 }
  //   ]
  // },
  // {
  //   id: 7, // Drau - Villach
  //   yearlyData: [
  //     { year: 2015, level: 2.0 },
  //     { year: 2016, level: 2.1 },
  //     { year: 2017, level: 2.3 },
  //     { year: 2018, level: 2.4 },
  //     { year: 2019, level: 2.2 },
  //     { year: 2020, level: 2.1 },
  //     { year: 2021, level: 2.2 },
  //     { year: 2022, level: 2.3 },
  //     { year: 2023, level: 2.2 },
  //     { year: 2024, level: 2.2 }
  //   ]
  // },
  // {
  //   id: 8, // Traun - Wels
  //   yearlyData: [
  //     { year: 2015, level: 1.5 },
  //     { year: 2016, level: 1.6 },
  //     { year: 2017, level: 1.8 },
  //     { year: 2018, level: 1.9 },
  //     { year: 2019, level: 1.7 },
  //     { year: 2020, level: 1.6 },
  //     { year: 2021, level: 1.7 },
  //     { year: 2022, level: 1.8 },
  //     { year: 2023, level: 1.7 },
  //     { year: 2024, level: 1.7 }
  //   ]
  // },
  // {
  //   id: 9, // March - Hohenau
  //   yearlyData: [
  //     { year: 2015, level: 2.6 },
  //     { year: 2016, level: 2.7 },
  //     { year: 2017, level: 2.9 },
  //     { year: 2018, level: 3.0 },
  //     { year: 2019, level: 2.8 },
  //     { year: 2020, level: 2.7 },
  //     { year: 2021, level: 2.8 },
  //     { year: 2022, level: 2.9 },
  //     { year: 2023, level: 2.8 },
  //     { year: 2024, level: 2.8 }
  //   ]
  // },
  // {
  //   id: 10, // Raab - Feldbach
  //   yearlyData: [
  //     { year: 2015, level: 1.3 },
  //     { year: 2016, level: 1.4 },
  //     { year: 2017, level: 1.6 },
  //     { year: 2018, level: 1.7 },
  //     { year: 2019, level: 1.5 },
  //     { year: 2020, level: 1.4 },
  //     { year: 2021, level: 1.5 },
  //     { year: 2022, level: 1.6 },
  //     { year: 2023, level: 1.5 },
  //     { year: 2024, level: 1.5 }
  //   ]
  // },
  {
  id: 11, // Erlauf
  yearlyData: [
    { year: 1989, level: 4.10 }, // Level on May 11, 1989
    { year: 1991, level: 4.52 }, // Level on August 5, 1991
    { year: 1991, level: 4.34 }, // Level on December 31, 1991
    { year: 1997, level: 4.09 }, // Level on July 8, 1997
    { year: 1997, level: 5.39 }, // Level on October 20, 1997
    { year: 2006, level: 4.93 }, // Level on June 18, 2006
    { year: 2007, level: 4.90 }, // Level on September 7, 2007
    { year: 2009, level: 3.80 }, // Level on June 25, 2009
    { year: 2014, level: 4.34 }  // Level on May 16, 2014
  ]
},
{
  id: 12, // Ybbs
  yearlyData: [
    { year: 1959, level: 0 }, // Level on June 1, 1959
    { year: 1973, level: 0 }, // Level on September 10, 1973
    { year: 1977, level: 0 }, // Level on December 15, 1977
    { year: 1982, level: 2.85 }, // Level on July 23, 1982
    { year: 1991, level: 0 }, // Level on April 14, 1991
    { year: 2003, level: 2.84 }, // Level on October 19, 2003
          { year: 2006, level: 3.24 },

    { year: 2007, level: 3.45 }, // Level on September 12, 2007
    { year: 2009, level: 3.41 }, // Level on June 25, 2009
    { year: 2014, level: 3.30 }  // Level on May 16, 2014
  ]
},
{
  id: 13, // Fischa
  yearlyData: [
    { year: 1997, level: 4.01 }, // Level on July 8, 1997
    { year: 2002, level: 4.49 }, // Level on June 7, 2002
    { year: 2005, level: 2.68 }, // Level on March 19, 2005
    { year: 2005, level: 2.51 }, // Level on August 21, 2005
    { year: 2006, level: 2.48 }, // Level on June 3, 2006
    { year: 2007, level: 3.39 }, // Level on September 7, 2007
    { year: 2009, level: 2.27 }, // Level on June 25, 2009
    { year: 2013, level: 2.05 }, // Level on January 7, 2013
    { year: 2014, level: 3.44 }, // Level on May 16, 2014
    { year: 2015, level: 2.43 }  // Level on January 10, 2015
  ]
},
{
  id: 14, // Leitha
  yearlyData: [
    { year: 1991, level: 4.18 }, // Level on August 5, 1991
    { year: 1997, level: 4.33 }, // Level on July 10, 1997
    { year: 2017, level: 2.99 }, // Level on September 20, 2017
    { year: 2018, level: 3.70 }, // Level on June 14, 2018
    { year: 2018, level: 3.18 }, // Level on June 29, 2018
    { year: 2018, level: 3.06 }, // Level on December 25, 2018
    { year: 2019, level: 3.03 }  // Level on May 12, 2019
  ]
},
{
  id: 15, // Thaya
  yearlyData: [
    { year: 1993, level: 2.24 }, // Level on March 22, 1993
    { year: 1996, level: 2.25 }, // Level on April 6, 1996
    { year: 1998, level: 2.30 }, // Level on August 18, 1998
    { year: 2002, level: 2.38 }, // Level on December 30, 2002
    { year: 2006, level: 2.29 }, // Level on March 29, 2006
    { year: 2010, level: 2.86 }, // Level on June 18, 2010
    { year: 2010, level: 3.29 }, // Level on July 15, 2010
    { year: 2010, level: 3.45 }, // Level on August 7, 2010
    { year: 2011, level: 2.96 }, // Level on June 4, 2011
    { year: 2012, level: 2.35 }, // Level on August 6, 2012

  ]
}
,
{
  id: 16, // Lainsitz
  yearlyData: [
    { year: 2014, level: 2.72 }, // Level on October 23, 2014
    { year: 2014, level: 2.28 }, // Level on May 18, 2014
    { year: 2014, level: 2.27 }, // Level on July 31, 2014
    { year: 2018, level: 3.02 }, // Level on May 20, 2018
    { year: 2018, level: 2.32 }, // Level on June 28, 2018
    { year: 2018, level: 2.07 }, // Level on December 24, 2018
    { year: 2019, level: 2.32 }, // Level on March 16, 2019
    { year: 2020, level: 2.37 }, // Level on August 4, 2020
    { year: 2020, level: 2.13 }, // Level on June 14, 2020
    { year: 2020, level: 2.12 }  // Level on June 21, 2020
  ]
},
{
  id: 17, // March
  yearlyData: [
    { year: 1977, level: 6.22 }, // Level on February 27, 1977
    { year: 1985, level: 6.11 }, // Level on August 13, 1985
    { year: 1997, level: 6.48 }, // Level on July 23, 1997
    { year: 1999, level: 5.89 }, // Level on March 8, 1999
    { year: 2005, level: 6.10 }, // Level on March 22, 2005
    { year: 2006, level: 7.46 }, // Level on April 4, 2006
    { year: 2009, level: 6.27 }, // Level on March 10, 2009
    { year: 2010, level: 6.57 }, // Level on June 5, 2010
    { year: 2010, level: 6.26 }, // Level on May 20, 2010
    { year: 2020, level: 6.27 }  // Level on October 17, 2020
  ]
},
    {
  id: 18, // Traisen
  yearlyData: [
    { year: 2006, level: 3.95 }, // Level on August 8, 2006
    { year: 2007, level: 4.11 }, // Level on September 7, 2007
    { year: 2009, level: 3.93 }, // Level on June 29, 2009
    { year: 2009, level: 3.90 }, // Level on June 24, 2009
    { year: 2010, level: 3.02 }, // Level on June 3, 2010
    { year: 2013, level: 3.01 }, // Level on January 6, 2013
    { year: 2014, level: 4.50 }, // Level on May 16, 2014
    { year: 2017, level: 2.90 }, // Level on September 10, 2017
    { year: 2018, level: 2.79 }, // Level on June 29, 2018
    { year: 2020, level: 3.34 }  // Level on June 21, 2020
  ]
},
    {
  id: 19, // Pielach
  yearlyData: [
    { year: 2012, level: 1.62 }, // Level on December 23, 2012
    { year: 2013, level: 1.63 }, // Level on June 2, 2013
    { year: 2013, level: 1.95 }, // Level on January 5, 2013
    { year: 2013, level: 1.96 }, // Level on June 25, 2013
    { year: 2014, level: 1.79 }, // Level on October 23, 2014
    { year: 2014, level: 3.06 }, // Level on May 16, 2014
    { year: 2014, level: 1.62 }, // Level on May 28, 2014
    { year: 2015, level: 1.90 }, // Level on January 10, 2015
    { year: 2017, level: 1.54 }, // Level on March 19, 2017
    { year: 2020, level: 2.02 }  // Level on June 21, 2020
  ]
}




];
