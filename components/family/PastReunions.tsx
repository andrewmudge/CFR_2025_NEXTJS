'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Crown, Camera } from 'lucide-react';

interface Reunion {
  year: number;
  theme?: string;
  location: string;
  attendance?: number | null;
  adults?: number | null;
  kids?: number | null;
  president?: string | string[];
  vicePresident?: string | string[];
  secretary?: string | string[];
  treasurer?: string | string[];
  pressSecretary?: string | string[];
  historian?: string;
  highlights?: string[];
  photos?: string[];
  notes?: string;
}

const reunions: Reunion[] = [
  {
    year: 2024,
    location: "Casa De Fruta, Hollister",
    president: "Andrew Mudge",
    vicePresident: "Angela Jachetti",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
    historian: "Sarah Churchwell",
  },
  {
    year: 2023,
    location: "Casa De Fruta, Hollister",
    attendance: 109,
    adults: 88,
    kids: 21,
    president: "Paul Riker",
    vicePresident: "Paul Ferry",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2022,
    location: "Casa De Fruta, Hollister",
    attendance: 83,
    adults: 70,
    kids: 13,
    president: "Kyle Bennett",
    vicePresident: "Nik Boone",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2021,
    location: "Casa De Fruta, Hollister",
    attendance: 102,
    adults: 88,
    kids: 14,
    president: "Angela Mudge",
    vicePresident: "Sarah Churchwell",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2020,
    location: "Casa De Fruta, Hollister",
    attendance: 67,
    adults: 52,
    kids: 15,
    president: "Christina Enns",
    vicePresident: "Dana Miller",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
    notes: "COVID YEAR",
  },
  {
    year: 2019,
    location: "Casa De Fruta, Hollister",
    attendance: 107,
    president: "Nik Boone",
    vicePresident: "Kyle Bennett",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2018,
    location: "Casa De Fruta, Hollister",
    attendance: 130,
    president: "Gianna Giuliani",
    vicePresident: "Angela Mudge",
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2017,
    location: "Casa De Fruta, Hollister",
    president: ["Jim Churchwell", "Don Churchwell"],
    vicePresident: ["Michelle Trivitt", "Nicole Baker"],
    secretary: "Janet Mudge",
    pressSecretary: "Angela Mudge",
    treasurer: "Toni Vasquez",
    notes: "50th!",
  },
  {
    year: 2016,
    location: "Casa De Fruta, Hollister",
    president: "Brian Churchwell",
    vicePresident: "Destany Churchwell",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2015,
    location: "Casa De Fruta, Hollister",
    president: "Chris Baker",
    vicePresident: "Casey Shaw",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2014,
    location: "Casa De Fruta, Hollister",
    president: "Rich AKA Hank Bittleson",
    vicePresident: "Dana Miller",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2013,
    location: "Casa De Fruta, Hollister",
    president: "Sandy Blackburn",
    vicePresident: "Justin Enns",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2012,
    location: "Casa De Fruta, Hollister",
    attendance: 96,
    adults: 71,
    kids: 25,
    president: "Adam Bennett",
    vicePresident: "Andrew Mudge",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2011,
    location: "Casa De Fruta, Hollister",
    attendance: 137,
    adults: 92,
    kids: 45,
    president: "Lee Ann Enns",
    vicePresident: "Justin Enns",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2009,
    location: "Casa De Fruta, Hollister",
    president: "Jennifer Lokken",
    vicePresident: "Bill Trivitt",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2008,
    location: "Casa De Fruta, Hollister",
    attendance: 139,
    adults: 93,
    kids: 46,
    president: "Kelly Burton",
    vicePresident: "Rick Giuliani",
    secretary: "Janet Mudge",
    treasurer: "Toni Vasquez",
  },
  {
    year: 2007,
    location: "Casa De Fruta, Hollister",
    president: "Todd Churchwell",
    vicePresident: "Rachel Allen",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2006,
    location: "Casa De Fruta, Hollister",
    president: "John Walker",
    vicePresident: "Rob Enns",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2005,
    location: "Knights Ferry, Oakdale",
    president: "Kathryn Ferguson",
    vicePresident: "Bud Leedy",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2004,
    location: "Knights Ferry, Oakdale",
    attendance: 113,
    president: "Justin Enns",
    vicePresident: "Rachell Allen",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2003,
    location: "Knights Ferry, Oakdale",
    attendance: 113,
    president: "Nicole Baker",
    vicePresident: "Glen Shaw",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2001,
    location: "Knights Ferry, Oakdale",
    president: "Paul Ferry",
    vicePresident: "Michelle Trivitt",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 2000,
    location: "Knights Ferry, Oakdale",
    president: "Kami Giuliani",
    vicePresident: "Nicole Baker",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 1999,
    location: "Knights Ferry, Oakdale",
    president: "Darrell Churchwell II",
    vicePresident: "Kami Giuliani",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 1998,
    location: "Knights Ferry, Oakdale",
    attendance: 71,
    president: "Michelle Trivitt",
    vicePresident: "Paul Ferry",
    secretary: "Janet Mudge",
    treasurer: "Dan Mudge",
  },
  {
    year: 1997,
    location: "Knights Ferry, Oakdale",
    attendance: 96,
    president: "Ross McDonald",
    vicePresident: "Dan Mudge",
    secretary: "Janet Mudge",
    treasurer: "Michelle Trivitt",
  },
  {
    year: 1996,
    location: "Knights Ferry, Oakdale",
    attendance: 84,
    president: "Hellen Ray",
    vicePresident: "Lee Ann Enns",
    secretary: "Janet Mudge",
    treasurer: "Jennifer Churchwell",
    notes: "Honorary Pres Lois Churchwell",
  },
  {
    year: 1995,
    location: "Knights Ferry, Oakdale",
    attendance: 84,
    president: "John Bennett",
    vicePresident: "Curt Ince",
    secretary: "Bud Leedy",
    treasurer: "Michelle Churchwell",
  },
  {
    year: 1994,
    location: "Knights Ferry, Oakdale",
    attendance: 94,
    president: "Dean Churchwell II",
    vicePresident: "Jim Churchwell II",
    secretary: "Nicole Churchwell",
    treasurer: "Michelle Churchwell",
  },
  {
    year: 1993,
    location: "Knights Ferry, Oakdale",
    attendance: 105,
    president: "Janet Mudge",
    vicePresident: "Kami Giuliani",
    secretary: "Nicole Churchwell",
    treasurer: "Michelle Churchwell",
  },
  {
    year: 1992,
    location: "Knights Ferry, Oakdale",
    attendance: 79,
    president: "Julie Churchwell",
    vicePresident: "Jill Churchwell",
    secretary: "Nicole Churchwell",
    treasurer: "Michelle Churchwell",
  },
  {
    year: 1991,
    location: "Knights Ferry, Oakdale",
    attendance: 86,
    president: "Dean Churchwell",
    vicePresident: "Jim Churchwell",
    secretary: "Janet Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1990,
    location: "Knights Ferry, Oakdale",
    attendance: 83,
    president: "Sue Poncia",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1989,
    location: "Knights Ferry, Oakdale",
    attendance: 102,
    president: "Darlene Churchwell",
    vicePresident: "Darrell Churchwell",
    secretary: "Marsha Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1988,
    location: "Knights Ferry, Oakdale",
    attendance: 101,
    president: "Rob Enns",
    vicePresident: "Darrell Churchwell",
    secretary: "Michelle Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1987,
    location: "Knights Ferry, Oakdale",
    attendance: 96,
    president: "Sonny Carlile",
    vicePresident: "Walter Poncia",
    secretary: "Sue Poncia",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1986,
    location: "Casa De Fruta, Hollister",
    attendance: 93,
    president: "Mike Cercone",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1985,
    location: "Casa De Fruta, Hollister",
    attendance: 79,
    president: "Susan Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1984,
    location: "Casa De Fruta, Hollister",
    attendance: 80,
    president: "Bill Churchwell Jr",
    vicePresident: "Jim Churchwell",
    secretary: "Shelley Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1983,
    location: "Casa De Fruta, Hollister",
    attendance: 54,
    president: "Debbie Flores",
    vicePresident: "Walter Poncia",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1982,
    location: "Casa De Fruta, Hollister",
    attendance: 80,
    president: "Lynn Keener (Walter Poncia)",
    vicePresident: "Walter Poncia",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1981,
    location: "Casa De Fruta, Hollister",
    attendance: 62,
    president: "Lee Ann Enns",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1980,
    location: "Casa De Fruta, Hollister",
    attendance: 63,
    president: "Willadene Churchwell",
    vicePresident: "Pat Smith",
    secretary: "Carol Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1979,
    location: "Casa De Fruta, Hollister",
    attendance: 65,
    president: "Darrell Churchwell",
    vicePresident: "Walter Poncia",
    secretary: "Shelley Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1978,
    location: "Coarsegold, Paso Robles",
    attendance: 75,
    president: "Dave Churchwell",
    vicePresident: "Don Churchwell",
    secretary: "Lee Ann Enns",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1977,
    location: "Oakwood Lake Camp Resort Manteca",
    attendance: 94,
    president: "Maud Ray",
    vicePresident: "Dean Churchwell",
    secretary: "Sheryl Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1976,
    location: "Coarsegold, Paso Robles",
    attendance: 80,
    president: "Don Churchwell",
    vicePresident: "Dave Churchwell",
    secretary: "Patti Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1975,
    location: "Coarsegold, Paso Robles",
    attendance: 78,
    president: "Robert Ray",
    vicePresident: "La Verne Ray",
    secretary: "Pat Shores",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1974,
    location: "Coarsegold, Paso Robles",
    attendance: 92,
    president: "Jim Churchwell",
    vicePresident: "Don Churchwell",
    secretary: "Sheryl Churchwell",
    treasurer: "Darlene Churchwell",
  },
  {
    year: 1973,
    location: "Coarsegold, Paso Robles",
    attendance: 98,
    president: "Sonny Carlile",
    vicePresident: "Bill Churchwell Jr.",
    secretary: "Darlene Churchwell",
    treasurer: "Jim Churchwell",
  },
  {
    year: 1972,
    location: "Coarsegold, Paso Robles",
    attendance: 95,
    president: "Bill Churchwell Sr.",
    vicePresident: "Dave Churchwell",
    secretary: "Sheryl Churchwell",
    treasurer: "Sarah Beth Churchwell",
  },
  {
    year: 1971,
    location: "Resthaven Park, Paso Robles",
    attendance: 79,
    president: "Clark Churchwell",
    vicePresident: "Cullin Hulsey",
    secretary: "Louise Jones",
  },
  {
    year: 1970,
    location: "Resthaven Park, Paso Robles",
    attendance: 105,
    president: "Dean Churchwell",
    vicePresident: "Clem Churchwell",
    secretary: "Patty Smith",
    treasurer: "Sarah Beth Churchwell",
  },
  {
    year: 1969,
    location: "Rollins Lake",
    attendance: 76,
    president: "Bill Churchwell Jr.",
    vicePresident: "Jerry Jones",
    secretary: "Barbara Krenkau",
  },
  {
    year: 1968,
    location: "Gardeners Cove, Modesto",
    attendance: 112,
    president: "Marshall Churchwell",
    vicePresident: "Clyde Churchwell",
    secretary: "Willadene Churchwell",
  },
  {
    year: 1967,
    location: "Hope Valley",
    attendance: 118,
    president: "Lois Churchwell",
    notes: "1st President",
  },
];

// Sort by year descending
const sortedReunions = [...reunions].sort((a, b) => b.year - a.year);

const PastReunions = () => {
  const [selectedYear, setSelectedYear] = useState(sortedReunions[0].year);
  const selectedReunion = sortedReunions.find(r => r.year === selectedYear);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Past Reunions
        </h3>
        <p className="text-slate-600">
          A journey through our family gatherings over the years, celebrating our traditions and memories.
        </p>
      </motion.div>

      {/* Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          className="border border-slate-300 rounded-lg px-4 py-2 text-lg"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {sortedReunions.map(r => (
            <option key={r.year} value={r.year}>{r.year}</option>
          ))}
        </select>
      </div>

      {/* Reunion Details */}
      {selectedReunion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-600">{selectedReunion.year}</span>
              <span className="text-lg text-slate-700">{selectedReunion.location}</span>
            </div>
            {selectedReunion.theme && (
              <h4 className="text-xl font-semibold text-slate-800">{selectedReunion.theme}</h4>
            )}
            <div className="flex flex-wrap gap-4">
              {selectedReunion.attendance && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{selectedReunion.attendance} attendees</span>
                </div>
              )}
              {selectedReunion.adults && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{selectedReunion.adults} adults</span>
                </div>
              )}
              {selectedReunion.kids && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{selectedReunion.kids} kids</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-red-600 flex items-center"><Crown className="w-4 h-4 mr-2" />President</h5>
                <p>{Array.isArray(selectedReunion.president) ? selectedReunion.president.join(', ') : selectedReunion.president}</p>
              </div>
              <div>
                <h5 className="font-semibold text-blue-600 flex items-center"><Crown className="w-4 h-4 mr-2" />Vice President</h5>
                <p>{Array.isArray(selectedReunion.vicePresident) ? selectedReunion.vicePresident.join(', ') : selectedReunion.vicePresident}</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-600 flex items-center"><Users className="w-4 h-4 mr-2" />Secretary</h5>
                <p>{Array.isArray(selectedReunion.secretary) ? selectedReunion.secretary.join(', ') : selectedReunion.secretary}</p>
              </div>
              {selectedReunion.treasurer && (
                <div>
                  <h5 className="font-semibold text-purple-600 flex items-center"><Crown className="w-4 h-4 mr-2" />Treasurer</h5>
                  <p>{Array.isArray(selectedReunion.treasurer) ? selectedReunion.treasurer.join(', ') : selectedReunion.treasurer}</p>
                </div>
              )}
              {selectedReunion.pressSecretary && (
                <div>
                  <h5 className="font-semibold text-pink-600 flex items-center"><Users className="w-4 h-4 mr-2" />Press Secretary</h5>
                  <p>{Array.isArray(selectedReunion.pressSecretary) ? selectedReunion.pressSecretary.join(', ') : selectedReunion.pressSecretary}</p>
                </div>
              )}
              {selectedReunion.historian && (
                <div>
                  <h5 className="font-semibold text-yellow-600 flex items-center"><Users className="w-4 h-4 mr-2" />Historian</h5>
                  <p>{selectedReunion.historian}</p>
                </div>
              )}
            </div>
            {selectedReunion.highlights && selectedReunion.highlights.length > 0 && (
              <div>
                <h5 className="text-lg font-semibold text-slate-800">Highlights</h5>
                <ul className="list-disc ml-6">
                  {selectedReunion.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {selectedReunion.notes && (
              <div className="text-slate-600 italic">{selectedReunion.notes}</div>
            )}
            {selectedReunion.photos && selectedReunion.photos.length > 0 && (
              <div>
                <h5 className="text-lg font-semibold text-slate-800 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Memories
                </h5>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {selectedReunion.photos.map((photo, idx) => (
                    <motion.img
                      key={idx}
                      src={photo}
                      alt={`${selectedReunion.year} reunion`}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer border border-slate-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PastReunions;