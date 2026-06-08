/* =============================================================================
 * data.js — World Cup XI dataset
 *
 * THE DRAFT UNIT is a "team" = a country at a specific World Cup (e.g. brazil-1970).
 * The wheel spins a team; you pick one of its players. A PLAYER can appear in several
 * teams (Pelé 1958 & 1970) via `caps`.
 *
 * RATINGS are calibrated — see RATINGS.md. Each cap `overall` is the player's level AT
 * that tournament, on a FIFA-anchored scale (modern players match their tournament-era
 * FIFA rating; the ~91 ceiling is gently extended only for the all-time peak performances).
 *
 * Tier rubric: 94-95 greatest-ever peaks · 91-93 best-in-world · 88-90 world-class ·
 *              84-87 key starter · 80-83 reliable starter · 76-79 squad · 73-75 lower-tier.
 *
 * TEAMS[].strength is only a DISPLAY fallback — the engine DERIVES each team's AI strength
 * from its best XI (one source of truth; change a player rating and team strength follows).
 *
 * To ADD a team:   add to TEAMS, then add players whose `caps` reference its id.
 * Positions are ORDERED — [0] is the natural position (best chemistry).
 * ========================================================================== */

const TEAMS = [
  { id:"brazil-1958",   country:"Brazil",       flag:"🇧🇷", year:1958, color:"#FFDF00", strength:87 },
  { id:"brazil-1970",   country:"Brazil",       flag:"🇧🇷", year:1970, color:"#FFDF00", strength:91 },
  { id:"brazil-2002",   country:"Brazil",       flag:"🇧🇷", year:2002, color:"#FFDF00", strength:89 },
  { id:"argentina-1986",country:"Argentina",    flag:"🇦🇷", year:1986, color:"#6CACE4", strength:86 },
  { id:"argentina-2022",country:"Argentina",    flag:"🇦🇷", year:2022, color:"#6CACE4", strength:86 },
  { id:"france-1998",   country:"France",       flag:"🇫🇷", year:1998, color:"#1E3A8A", strength:87 },
  { id:"france-2018",   country:"France",       flag:"🇫🇷", year:2018, color:"#1E3A8A", strength:87 },
  { id:"wgermany-1974", country:"West Germany", flag:"🇩🇪", year:1974, color:"#111111", strength:87 },
  { id:"germany-2014",  country:"Germany",      flag:"🇩🇪", year:2014, color:"#111111", strength:88 },
  { id:"netherlands-1974",country:"Netherlands",flag:"🇳🇱", year:1974, color:"#FF6A13", strength:87 },
  { id:"italy-2006",    country:"Italy",        flag:"🇮🇹", year:2006, color:"#1E5BB8", strength:87 },
  { id:"spain-2010",    country:"Spain",        flag:"🇪🇸", year:2010, color:"#C60B1E", strength:88 },
  { id:"england-1966",  country:"England",      flag:"🏴", year:1966, color:"#FFFFFF", strength:84 },
  { id:"hungary-1954",  country:"Hungary",      flag:"🇭🇺", year:1954, color:"#43A047", strength:84 },
  { id:"portugal-1966", country:"Portugal",     flag:"🇵🇹", year:1966, color:"#006600", strength:82 },
  { id:"uruguay-1950",  country:"Uruguay",      flag:"🇺🇾", year:1950, color:"#5CBFEB", strength:81 },
  { id:"argentina-1978",country:"Argentina",    flag:"🇦🇷", year:1978, color:"#6CACE4", strength:84 },
  { id:"italy-1982",    country:"Italy",        flag:"🇮🇹", year:1982, color:"#1E5BB8", strength:85 },
  { id:"wgermany-1990", country:"West Germany", flag:"🇩🇪", year:1990, color:"#111111", strength:85 },
  { id:"england-1990",  country:"England",      flag:"🏴", year:1990, color:"#FFFFFF", strength:83 },
  { id:"brazil-1994",   country:"Brazil",       flag:"🇧🇷", year:1994, color:"#FFDF00", strength:85 },
  { id:"netherlands-2010",country:"Netherlands",flag:"🇳🇱", year:2010, color:"#FF6A13", strength:85 },
  { id:"portugal-2006", country:"Portugal",     flag:"🇵🇹", year:2006, color:"#006600", strength:84 },
  { id:"croatia-2018",  country:"Croatia",      flag:"🇭🇷", year:2018, color:"#D52B1E", strength:84 },
];

const OPPONENT_STRENGTH = Object.fromEntries(TEAMS.map(t => [t.id, t.strength]));

const PLAYERS = [
  // ---- Brazil 1958 ----
  { id:"gilmar",      name:"Gilmar",          nationality:"Brazil", positions:["GK"],            caps:[{team:"brazil-1958",overall:80}] },
  { id:"d-santos",    name:"Djalma Santos",   nationality:"Brazil", positions:["RB"],            caps:[{team:"brazil-1958",overall:83}] },
  { id:"bellini",     name:"Bellini",         nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1958",overall:80}] },
  { id:"orlando",     name:"Orlando",         nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1958",overall:78}] },
  { id:"n-santos",    name:"Nílton Santos",   nationality:"Brazil", positions:["LB"],            caps:[{team:"brazil-1958",overall:85}] },
  { id:"zito",        name:"Zito",            nationality:"Brazil", positions:["CM","CDM"],      caps:[{team:"brazil-1958",overall:81}] },
  { id:"didi",        name:"Didi",            nationality:"Brazil", positions:["CM","CAM"],      caps:[{team:"brazil-1958",overall:86}] },
  { id:"garrincha",   name:"Garrincha",       nationality:"Brazil", positions:["RW","RM"],       caps:[{team:"brazil-1958",overall:88},{team:"brazil-1962",overall:92}] },
  { id:"vava",        name:"Vavá",            nationality:"Brazil", positions:["ST"],            caps:[{team:"brazil-1958",overall:83}] },
  { id:"zagallo",     name:"Mário Zagallo",   nationality:"Brazil", positions:["LW","LM"],       caps:[{team:"brazil-1958",overall:82}] },

  // ---- Brazil 1970 (Pelé shared with 1958) ----
  { id:"pele",        name:"Pelé",            nationality:"Brazil", positions:["CAM","ST"],      caps:[{team:"brazil-1958",overall:88},{team:"brazil-1970",overall:94}] },
  { id:"felix",       name:"Félix",           nationality:"Brazil", positions:["GK"],            caps:[{team:"brazil-1970",overall:77}] },
  { id:"carlos-alberto",name:"Carlos Alberto",nationality:"Brazil", positions:["RB"],            caps:[{team:"brazil-1970",overall:86}] },
  { id:"brito",       name:"Brito",           nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1970",overall:79}] },
  { id:"piazza",      name:"Piazza",          nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1970",overall:81}] },
  { id:"everaldo",    name:"Everaldo",        nationality:"Brazil", positions:["LB"],            caps:[{team:"brazil-1970",overall:78}] },
  { id:"clodoaldo",   name:"Clodoaldo",       nationality:"Brazil", positions:["CM","CDM"],      caps:[{team:"brazil-1970",overall:82}] },
  { id:"gerson",      name:"Gérson",          nationality:"Brazil", positions:["CM"],            caps:[{team:"brazil-1970",overall:86}] },
  { id:"jairzinho",   name:"Jairzinho",       nationality:"Brazil", positions:["RW","RM"],       caps:[{team:"brazil-1970",overall:88}] },
  { id:"rivellino",   name:"Rivellino",       nationality:"Brazil", positions:["LW","CAM"],      caps:[{team:"brazil-1970",overall:87}] },
  { id:"tostao",      name:"Tostão",          nationality:"Brazil", positions:["ST"],            caps:[{team:"brazil-1970",overall:86}] },

  // ---- Brazil 2002 ----
  { id:"marcos",      name:"Marcos",          nationality:"Brazil", positions:["GK"],            caps:[{team:"brazil-2002",overall:82}] },
  { id:"cafu",        name:"Cafu",            nationality:"Brazil", positions:["RB","RWB"],      caps:[{team:"brazil-2002",overall:86}] },
  { id:"lucio",       name:"Lúcio",           nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-2002",overall:85}] },
  { id:"roque-junior",name:"Roque Júnior",    nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-2002",overall:79}] },
  { id:"roberto-carlos",name:"Roberto Carlos",nationality:"Brazil", positions:["LB","LWB"],      caps:[{team:"brazil-2002",overall:87}] },
  { id:"edmilson",    name:"Edmílson",        nationality:"Brazil", positions:["CDM","CB"],      caps:[{team:"brazil-2002",overall:81}] },
  { id:"gilberto-silva",name:"Gilberto Silva",nationality:"Brazil", positions:["CDM"],           caps:[{team:"brazil-2002",overall:82}] },
  { id:"kleberson",   name:"Kléberson",       nationality:"Brazil", positions:["CM"],            caps:[{team:"brazil-2002",overall:77}] },
  { id:"ronaldinho",  name:"Ronaldinho",      nationality:"Brazil", positions:["CAM","LW"],      caps:[{team:"brazil-2002",overall:87}] },
  { id:"rivaldo",     name:"Rivaldo",         nationality:"Brazil", positions:["CAM","LW"],      caps:[{team:"brazil-2002",overall:88}] },
  { id:"ronaldo",     name:"Ronaldo",         nationality:"Brazil", positions:["ST"],            caps:[{team:"brazil-2002",overall:92}] },

  // ---- Argentina 1986 ----
  { id:"pumpido",     name:"Nery Pumpido",    nationality:"Argentina",positions:["GK"],          caps:[{team:"argentina-1986",overall:78}] },
  { id:"cuciuffo",    name:"José Cuciuffo",   nationality:"Argentina",positions:["RB","CB"],     caps:[{team:"argentina-1986",overall:77}] },
  { id:"ruggeri",     name:"Oscar Ruggeri",   nationality:"Argentina",positions:["CB"],          caps:[{team:"argentina-1986",overall:82}] },
  { id:"brown",       name:"José Luis Brown", nationality:"Argentina",positions:["CB"],          caps:[{team:"argentina-1986",overall:79}] },
  { id:"olarticoechea",name:"Julio Olarticoechea",nationality:"Argentina",positions:["LB"],      caps:[{team:"argentina-1986",overall:78}] },
  { id:"batista",     name:"Sergio Batista",  nationality:"Argentina",positions:["CDM"],         caps:[{team:"argentina-1986",overall:79}] },
  { id:"giusti",      name:"Ricardo Giusti",  nationality:"Argentina",positions:["CM","RM"],     caps:[{team:"argentina-1986",overall:80}] },
  { id:"enrique",     name:"Héctor Enrique",  nationality:"Argentina",positions:["CM"],          caps:[{team:"argentina-1986",overall:80}] },
  { id:"burruchaga",  name:"Jorge Burruchaga",nationality:"Argentina",positions:["CAM","RM"],    caps:[{team:"argentina-1986",overall:83}] },
  { id:"maradona",    name:"Diego Maradona",  nationality:"Argentina",positions:["CAM","ST"],    caps:[{team:"argentina-1986",overall:95}] },
  { id:"valdano",     name:"Jorge Valdano",   nationality:"Argentina",positions:["ST","LW"],     caps:[{team:"argentina-1986",overall:84}] },

  // ---- Argentina 2022 ----
  { id:"e-martinez",  name:"Emiliano Martínez",nationality:"Argentina",positions:["GK"],         caps:[{team:"argentina-2022",overall:85}] },
  { id:"molina",      name:"Nahuel Molina",   nationality:"Argentina",positions:["RB"],          caps:[{team:"argentina-2022",overall:79}] },
  { id:"romero",      name:"Cristian Romero", nationality:"Argentina",positions:["CB"],          caps:[{team:"argentina-2022",overall:84}] },
  { id:"otamendi",    name:"Nicolás Otamendi",nationality:"Argentina",positions:["CB"],          caps:[{team:"argentina-2022",overall:81}] },
  { id:"tagliafico",  name:"Nicolás Tagliafico",nationality:"Argentina",positions:["LB"],        caps:[{team:"argentina-2022",overall:79}] },
  { id:"de-paul",     name:"Rodrigo De Paul", nationality:"Argentina",positions:["CM"],          caps:[{team:"argentina-2022",overall:82}] },
  { id:"enzo",        name:"Enzo Fernández",  nationality:"Argentina",positions:["CM","CDM"],    caps:[{team:"argentina-2022",overall:82}] },
  { id:"mac-allister",name:"Alexis Mac Allister",nationality:"Argentina",positions:["CM","CAM"], caps:[{team:"argentina-2022",overall:82}] },
  { id:"di-maria",    name:"Ángel Di María",  nationality:"Argentina",positions:["RW","LW"],     caps:[{team:"argentina-2022",overall:84}] },
  { id:"messi",       name:"Lionel Messi",    nationality:"Argentina",positions:["RW","CAM"],    caps:[{team:"argentina-2022",overall:92}] },
  { id:"alvarez",     name:"Julián Álvarez",  nationality:"Argentina",positions:["ST"],          caps:[{team:"argentina-2022",overall:83}] },

  // ---- France 1998 ----
  { id:"barthez",     name:"Fabien Barthez",  nationality:"France", positions:["GK"],            caps:[{team:"france-1998",overall:84}] },
  { id:"thuram",      name:"Lilian Thuram",   nationality:"France", positions:["RB","CB"],       caps:[{team:"france-1998",overall:86}] },
  { id:"blanc",       name:"Laurent Blanc",   nationality:"France", positions:["CB"],            caps:[{team:"france-1998",overall:84}] },
  { id:"desailly",    name:"Marcel Desailly", nationality:"France", positions:["CB","CDM"],      caps:[{team:"france-1998",overall:86}] },
  { id:"lizarazu",    name:"Bixente Lizarazu",nationality:"France", positions:["LB"],            caps:[{team:"france-1998",overall:84}] },
  { id:"deschamps",   name:"Didier Deschamps",nationality:"France", positions:["CDM"],           caps:[{team:"france-1998",overall:83}] },
  { id:"petit",       name:"Emmanuel Petit",  nationality:"France", positions:["CM"],            caps:[{team:"france-1998",overall:83}] },
  { id:"zidane",      name:"Zinedine Zidane", nationality:"France", positions:["CAM"],           caps:[{team:"france-1998",overall:92}] },
  { id:"djorkaeff",   name:"Youri Djorkaeff", nationality:"France", positions:["CAM","RM"],      caps:[{team:"france-1998",overall:84}] },
  { id:"henry-98",    name:"Thierry Henry",   nationality:"France", positions:["LW","ST"],       caps:[{team:"france-1998",overall:84}] },
  { id:"trezeguet",   name:"David Trezeguet", nationality:"France", positions:["ST"],            caps:[{team:"france-1998",overall:82}] },

  // ---- France 2018 ----
  { id:"lloris",      name:"Hugo Lloris",     nationality:"France", positions:["GK"],            caps:[{team:"france-2018",overall:85}] },
  { id:"pavard",      name:"Benjamin Pavard", nationality:"France", positions:["RB"],            caps:[{team:"france-2018",overall:81}] },
  { id:"varane",      name:"Raphaël Varane",  nationality:"France", positions:["CB"],            caps:[{team:"france-2018",overall:86}] },
  { id:"umtiti",      name:"Samuel Umtiti",   nationality:"France", positions:["CB"],            caps:[{team:"france-2018",overall:83}] },
  { id:"l-hernandez", name:"Lucas Hernández", nationality:"France", positions:["LB"],            caps:[{team:"france-2018",overall:82}] },
  { id:"kante",       name:"N'Golo Kanté",    nationality:"France", positions:["CDM"],           caps:[{team:"france-2018",overall:88}] },
  { id:"pogba",       name:"Paul Pogba",      nationality:"France", positions:["CM"],            caps:[{team:"france-2018",overall:87}] },
  { id:"matuidi",     name:"Blaise Matuidi",  nationality:"France", positions:["LM","CM"],       caps:[{team:"france-2018",overall:82}] },
  { id:"griezmann",   name:"Antoine Griezmann",nationality:"France",positions:["CAM","ST"],      caps:[{team:"france-2018",overall:89}] },
  { id:"mbappe",      name:"Kylian Mbappé",   nationality:"France", positions:["RW","ST"],       caps:[{team:"france-2018",overall:87}] },
  { id:"giroud",      name:"Olivier Giroud",  nationality:"France", positions:["ST"],            caps:[{team:"france-2018",overall:82}] },

  // ---- West Germany 1974 ----
  { id:"maier",       name:"Sepp Maier",      nationality:"West Germany",positions:["GK"],       caps:[{team:"wgermany-1974",overall:84}] },
  { id:"vogts",       name:"Berti Vogts",     nationality:"West Germany",positions:["RB"],       caps:[{team:"wgermany-1974",overall:84}] },
  { id:"beckenbauer", name:"Franz Beckenbauer",nationality:"West Germany",positions:["CB","CDM"],caps:[{team:"wgermany-1974",overall:92}] },
  { id:"schwarzenbeck",name:"G. Schwarzenbeck",nationality:"West Germany",positions:["CB"],      caps:[{team:"wgermany-1974",overall:79}] },
  { id:"breitner",    name:"Paul Breitner",   nationality:"West Germany",positions:["LB","CM"],  caps:[{team:"wgermany-1974",overall:85}] },
  { id:"bonhof",      name:"Rainer Bonhof",   nationality:"West Germany",positions:["CM","CDM"], caps:[{team:"wgermany-1974",overall:82}] },
  { id:"overath",     name:"Wolfgang Overath",nationality:"West Germany",positions:["CM"],       caps:[{team:"wgermany-1974",overall:84}] },
  { id:"hoeness",     name:"Uli Hoeneß",      nationality:"West Germany",positions:["RW","CAM"], caps:[{team:"wgermany-1974",overall:82}] },
  { id:"grabowski",   name:"Jürgen Grabowski",nationality:"West Germany",positions:["RM","RW"],  caps:[{team:"wgermany-1974",overall:81}] },
  { id:"holzenbein",  name:"Bernd Hölzenbein",nationality:"West Germany",positions:["LW","LM"],  caps:[{team:"wgermany-1974",overall:80}] },
  { id:"g-muller",    name:"Gerd Müller",     nationality:"West Germany",positions:["ST"],       caps:[{team:"wgermany-1974",overall:90}] },

  // ---- Germany 2014 ----
  { id:"neuer",       name:"Manuel Neuer",    nationality:"Germany",positions:["GK"],            caps:[{team:"germany-2014",overall:90}] },
  { id:"lahm",        name:"Philipp Lahm",    nationality:"Germany",positions:["RB","CM"],       caps:[{team:"germany-2014",overall:86}] },
  { id:"boateng",     name:"Jérôme Boateng",  nationality:"Germany",positions:["CB"],            caps:[{team:"germany-2014",overall:84}] },
  { id:"hummels",     name:"Mats Hummels",    nationality:"Germany",positions:["CB"],            caps:[{team:"germany-2014",overall:85}] },
  { id:"howedes",     name:"Benedikt Höwedes", nationality:"Germany",positions:["LB","CB"],      caps:[{team:"germany-2014",overall:80}] },
  { id:"khedira",     name:"Sami Khedira",    nationality:"Germany",positions:["CM","CDM"],      caps:[{team:"germany-2014",overall:83}] },
  { id:"schweinsteiger",name:"B. Schweinsteiger",nationality:"Germany",positions:["CM","CDM"],   caps:[{team:"germany-2014",overall:87}] },
  { id:"kroos",       name:"Toni Kroos",      nationality:"Germany",positions:["CM"],            caps:[{team:"germany-2014",overall:88}] },
  { id:"ozil",        name:"Mesut Özil",      nationality:"Germany",positions:["CAM"],           caps:[{team:"germany-2014",overall:85}] },
  { id:"muller",      name:"Thomas Müller",   nationality:"Germany",positions:["RW","ST"],       caps:[{team:"germany-2014",overall:86}] },
  { id:"klose",       name:"Miroslav Klose",  nationality:"Germany",positions:["ST"],            caps:[{team:"germany-2014",overall:82}] },

  // ---- Netherlands 1974 ----
  { id:"jongbloed",   name:"Jan Jongbloed",   nationality:"Netherlands",positions:["GK"],        caps:[{team:"netherlands-1974",overall:76}] },
  { id:"suurbier",    name:"Wim Suurbier",    nationality:"Netherlands",positions:["RB"],        caps:[{team:"netherlands-1974",overall:80}] },
  { id:"rijsbergen",  name:"Wim Rijsbergen",  nationality:"Netherlands",positions:["CB"],        caps:[{team:"netherlands-1974",overall:79}] },
  { id:"haan",        name:"Arie Haan",       nationality:"Netherlands",positions:["CB","CM"],   caps:[{team:"netherlands-1974",overall:82}] },
  { id:"krol",        name:"Ruud Krol",       nationality:"Netherlands",positions:["LB"],        caps:[{team:"netherlands-1974",overall:84}] },
  { id:"jansen",      name:"Wim Jansen",      nationality:"Netherlands",positions:["CM","CDM"],  caps:[{team:"netherlands-1974",overall:81}] },
  { id:"neeskens",    name:"Johan Neeskens",  nationality:"Netherlands",positions:["CM"],        caps:[{team:"netherlands-1974",overall:86}] },
  { id:"van-hanegem", name:"Wim van Hanegem", nationality:"Netherlands",positions:["CM","CAM"],  caps:[{team:"netherlands-1974",overall:84}] },
  { id:"rep",         name:"Johnny Rep",      nationality:"Netherlands",positions:["RW","RM"],   caps:[{team:"netherlands-1974",overall:82}] },
  { id:"cruyff",      name:"Johan Cruyff",    nationality:"Netherlands",positions:["CAM","ST"],  caps:[{team:"netherlands-1974",overall:93}] },
  { id:"rensenbrink", name:"Rob Rensenbrink", nationality:"Netherlands",positions:["LW"],        caps:[{team:"netherlands-1974",overall:83}] },

  // ---- Italy 2006 ----
  { id:"buffon",      name:"Gianluigi Buffon",nationality:"Italy",  positions:["GK"],            caps:[{team:"italy-2006",overall:90}] },
  { id:"zambrotta",   name:"Gianluca Zambrotta",nationality:"Italy",positions:["RB","LB"],       caps:[{team:"italy-2006",overall:84}] },
  { id:"cannavaro",   name:"Fabio Cannavaro", nationality:"Italy",  positions:["CB"],            caps:[{team:"italy-2006",overall:89}] },
  { id:"materazzi",   name:"Marco Materazzi", nationality:"Italy",  positions:["CB"],            caps:[{team:"italy-2006",overall:82}] },
  { id:"grosso",      name:"Fabio Grosso",    nationality:"Italy",  positions:["LB"],            caps:[{team:"italy-2006",overall:81}] },
  { id:"gattuso",     name:"Gennaro Gattuso", nationality:"Italy",  positions:["CDM"],           caps:[{team:"italy-2006",overall:83}] },
  { id:"pirlo",       name:"Andrea Pirlo",    nationality:"Italy",  positions:["CM","CDM"],      caps:[{team:"italy-2006",overall:88}] },
  { id:"perrotta",    name:"Simone Perrotta", nationality:"Italy",  positions:["CM","LM"],       caps:[{team:"italy-2006",overall:80}] },
  { id:"totti",       name:"Francesco Totti", nationality:"Italy",  positions:["CAM","ST"],      caps:[{team:"italy-2006",overall:87}] },
  { id:"toni",        name:"Luca Toni",       nationality:"Italy",  positions:["ST"],            caps:[{team:"italy-2006",overall:82}] },
  { id:"del-piero",   name:"Alessandro Del Piero",nationality:"Italy",positions:["ST","CAM"],    caps:[{team:"italy-2006",overall:85}] },

  // ---- Spain 2010 ----
  { id:"casillas",    name:"Iker Casillas",   nationality:"Spain",  positions:["GK"],            caps:[{team:"spain-2010",overall:88}] },
  { id:"ramos",       name:"Sergio Ramos",    nationality:"Spain",  positions:["RB","CB"],       caps:[{team:"spain-2010",overall:85}] },
  { id:"pique",       name:"Gerard Piqué",    nationality:"Spain",  positions:["CB"],            caps:[{team:"spain-2010",overall:85}] },
  { id:"puyol",       name:"Carles Puyol",    nationality:"Spain",  positions:["CB"],            caps:[{team:"spain-2010",overall:85}] },
  { id:"capdevila",   name:"Joan Capdevila",  nationality:"Spain",  positions:["LB"],            caps:[{team:"spain-2010",overall:80}] },
  { id:"busquets",    name:"Sergio Busquets", nationality:"Spain",  positions:["CDM"],           caps:[{team:"spain-2010",overall:83}] },
  { id:"xavi",        name:"Xavi",            nationality:"Spain",  positions:["CM"],            caps:[{team:"spain-2010",overall:89}] },
  { id:"alonso",      name:"Xabi Alonso",     nationality:"Spain",  positions:["CM","CDM"],      caps:[{team:"spain-2010",overall:85}] },
  { id:"iniesta",     name:"Andrés Iniesta",  nationality:"Spain",  positions:["CAM","CM"],      caps:[{team:"spain-2010",overall:88}] },
  { id:"villa",       name:"David Villa",     nationality:"Spain",  positions:["ST","LW"],       caps:[{team:"spain-2010",overall:86}] },
  { id:"pedro",       name:"Pedro",           nationality:"Spain",  positions:["RW","LW"],       caps:[{team:"spain-2010",overall:82}] },

  // ---- England 1966 ----
  { id:"banks",       name:"Gordon Banks",    nationality:"England",positions:["GK"],            caps:[{team:"england-1966",overall:85}] },
  { id:"cohen",       name:"George Cohen",    nationality:"England",positions:["RB"],            caps:[{team:"england-1966",overall:78}] },
  { id:"j-charlton",  name:"Jack Charlton",   nationality:"England",positions:["CB"],            caps:[{team:"england-1966",overall:82}] },
  { id:"moore",       name:"Bobby Moore",     nationality:"England",positions:["CB"],            caps:[{team:"england-1966",overall:88}] },
  { id:"wilson",      name:"Ray Wilson",      nationality:"England",positions:["LB"],            caps:[{team:"england-1966",overall:79}] },
  { id:"stiles",      name:"Nobby Stiles",    nationality:"England",positions:["CDM"],           caps:[{team:"england-1966",overall:78}] },
  { id:"b-charlton",  name:"Bobby Charlton",  nationality:"England",positions:["CM","CAM"],      caps:[{team:"england-1966",overall:88}] },
  { id:"ball",        name:"Alan Ball",       nationality:"England",positions:["CM","RM"],       caps:[{team:"england-1966",overall:82}] },
  { id:"peters",      name:"Martin Peters",   nationality:"England",positions:["LM","CM"],       caps:[{team:"england-1966",overall:82}] },
  { id:"hurst",       name:"Geoff Hurst",     nationality:"England",positions:["ST"],            caps:[{team:"england-1966",overall:84}] },
  { id:"hunt",        name:"Roger Hunt",      nationality:"England",positions:["ST"],            caps:[{team:"england-1966",overall:80}] },

  // ---- Hungary 1954 ----
  { id:"grosics",     name:"Gyula Grosics",   nationality:"Hungary",positions:["GK"],            caps:[{team:"hungary-1954",overall:81}] },
  { id:"buzanszky",   name:"Jenő Buzánszky",  nationality:"Hungary",positions:["RB"],            caps:[{team:"hungary-1954",overall:77}] },
  { id:"lorant",      name:"Gyula Lóránt",    nationality:"Hungary",positions:["CB"],            caps:[{team:"hungary-1954",overall:79}] },
  { id:"lantos",      name:"Mihály Lantos",   nationality:"Hungary",positions:["LB"],            caps:[{team:"hungary-1954",overall:78}] },
  { id:"bozsik",      name:"József Bozsik",   nationality:"Hungary",positions:["CM"],            caps:[{team:"hungary-1954",overall:84}] },
  { id:"zakarias",    name:"József Zakariás", nationality:"Hungary",positions:["CDM"],           caps:[{team:"hungary-1954",overall:78}] },
  { id:"budai",       name:"László Budai",    nationality:"Hungary",positions:["RW","RM"],       caps:[{team:"hungary-1954",overall:80}] },
  { id:"kocsis",      name:"Sándor Kocsis",   nationality:"Hungary",positions:["ST"],            caps:[{team:"hungary-1954",overall:88}] },
  { id:"hidegkuti",   name:"Nándor Hidegkuti",nationality:"Hungary",positions:["CAM","ST"],      caps:[{team:"hungary-1954",overall:85}] },
  { id:"puskas",      name:"Ferenc Puskás",   nationality:"Hungary",positions:["ST","CAM"],      caps:[{team:"hungary-1954",overall:92}] },
  { id:"czibor",      name:"Zoltán Czibor",   nationality:"Hungary",positions:["LW","LM"],       caps:[{team:"hungary-1954",overall:83}] },

  // ---- Portugal 1966 ----
  { id:"j-pereira",   name:"José Pereira",    nationality:"Portugal",positions:["GK"],           caps:[{team:"portugal-1966",overall:78}] },
  { id:"morais",      name:"João Morais",     nationality:"Portugal",positions:["RB"],           caps:[{team:"portugal-1966",overall:75}] },
  { id:"vicente",     name:"Vicente Lucas",   nationality:"Portugal",positions:["CB"],           caps:[{team:"portugal-1966",overall:77}] },
  { id:"baptista",    name:"José Carlos",     nationality:"Portugal",positions:["CB"],           caps:[{team:"portugal-1966",overall:76}] },
  { id:"hilario",     name:"Hilário",         nationality:"Portugal",positions:["LB"],           caps:[{team:"portugal-1966",overall:77}] },
  { id:"graca",       name:"Jaime Graça",     nationality:"Portugal",positions:["CM","LM"],      caps:[{team:"portugal-1966",overall:80}] },
  { id:"coluna",      name:"Mário Coluna",    nationality:"Portugal",positions:["CM"],           caps:[{team:"portugal-1966",overall:84}] },
  { id:"augusto",     name:"José Augusto",    nationality:"Portugal",positions:["RW","RM"],      caps:[{team:"portugal-1966",overall:82}] },
  { id:"eusebio",     name:"Eusébio",         nationality:"Portugal",positions:["ST","CAM"],     caps:[{team:"portugal-1966",overall:89}] },
  { id:"jose-torres", name:"José Torres",     nationality:"Portugal",positions:["ST"],           caps:[{team:"portugal-1966",overall:81}] },
  { id:"simoes",      name:"António Simões",  nationality:"Portugal",positions:["LW","LM"],      caps:[{team:"portugal-1966",overall:82}] },

  // ---- Uruguay 1950 (Maracanazo) ----
  { id:"maspoli",     name:"Roque Máspoli",   nationality:"Uruguay",positions:["GK"],            caps:[{team:"uruguay-1950",overall:79}] },
  { id:"m-gonzalez",  name:"Matías González", nationality:"Uruguay",positions:["RB"],            caps:[{team:"uruguay-1950",overall:76}] },
  { id:"tejera",      name:"Eusebio Tejera",  nationality:"Uruguay",positions:["LB"],            caps:[{team:"uruguay-1950",overall:76}] },
  { id:"gambetta",    name:"Schubert Gambetta",nationality:"Uruguay",positions:["CB"],           caps:[{team:"uruguay-1950",overall:78}] },
  { id:"varela",      name:"Obdulio Varela",  nationality:"Uruguay",positions:["CB","CDM"],      caps:[{team:"uruguay-1950",overall:84}] },
  { id:"andrade",     name:"Víctor Andrade",  nationality:"Uruguay",positions:["CM"],            caps:[{team:"uruguay-1950",overall:80}] },
  { id:"r-andrade",   name:"Rodríguez Andrade",nationality:"Uruguay",positions:["CM","RM"],      caps:[{team:"uruguay-1950",overall:80}] },
  { id:"ghiggia",     name:"Alcides Ghiggia", nationality:"Uruguay",positions:["RW","RM"],       caps:[{team:"uruguay-1950",overall:83}] },
  { id:"perez-uru",   name:"Julio Pérez",     nationality:"Uruguay",positions:["CAM"],           caps:[{team:"uruguay-1950",overall:79}] },
  { id:"miguez",      name:"Óscar Míguez",    nationality:"Uruguay",positions:["ST"],            caps:[{team:"uruguay-1950",overall:82}] },
  { id:"schiaffino",  name:"Juan Schiaffino", nationality:"Uruguay",positions:["CAM","ST"],      caps:[{team:"uruguay-1950",overall:88}] },
  { id:"moran",       name:"Rubén Morán",     nationality:"Uruguay",positions:["LW","LM"],       caps:[{team:"uruguay-1950",overall:78}] },

  // ---- Argentina 1978 ----
  { id:"fillol",      name:"Ubaldo Fillol",   nationality:"Argentina",positions:["GK"],          caps:[{team:"argentina-1978",overall:83}] },
  { id:"olguin",      name:"Jorge Olguín",    nationality:"Argentina",positions:["RB"],          caps:[{team:"argentina-1978",overall:79}] },
  { id:"galvan",      name:"Luis Galván",     nationality:"Argentina",positions:["CB"],          caps:[{team:"argentina-1978",overall:80}] },
  { id:"passarella",  name:"Daniel Passarella",nationality:"Argentina",positions:["CB"],         caps:[{team:"argentina-1978",overall:86}] },
  { id:"tarantini",   name:"Alberto Tarantini",nationality:"Argentina",positions:["LB"],         caps:[{team:"argentina-1978",overall:79}] },
  { id:"gallego",     name:"Américo Gallego", nationality:"Argentina",positions:["CDM"],         caps:[{team:"argentina-1978",overall:80}] },
  { id:"ardiles",     name:"Osvaldo Ardiles", nationality:"Argentina",positions:["CM"],          caps:[{team:"argentina-1978",overall:84}] },
  { id:"larrosa",     name:"Omar Larrosa",    nationality:"Argentina",positions:["CM"],          caps:[{team:"argentina-1978",overall:77}] },
  { id:"bertoni",     name:"Daniel Bertoni",  nationality:"Argentina",positions:["RW","RM"],     caps:[{team:"argentina-1978",overall:82}] },
  { id:"kempes",      name:"Mario Kempes",    nationality:"Argentina",positions:["ST","CAM"],    caps:[{team:"argentina-1978",overall:87}] },
  { id:"luque",       name:"Leopoldo Luque",  nationality:"Argentina",positions:["ST"],          caps:[{team:"argentina-1978",overall:82}] },
  { id:"ortiz",       name:"Oscar Ortiz",     nationality:"Argentina",positions:["LW","LM"],     caps:[{team:"argentina-1978",overall:79}] },

  // ---- Italy 1982 ----
  { id:"zoff",        name:"Dino Zoff",       nationality:"Italy",  positions:["GK"],            caps:[{team:"italy-1982",overall:87}] },
  { id:"gentile",     name:"Claudio Gentile", nationality:"Italy",  positions:["RB","CB"],       caps:[{team:"italy-1982",overall:84}] },
  { id:"scirea",      name:"Gaetano Scirea",  nationality:"Italy",  positions:["CB"],            caps:[{team:"italy-1982",overall:85}] },
  { id:"collovati",   name:"Fulvio Collovati",nationality:"Italy",  positions:["CB"],            caps:[{team:"italy-1982",overall:80}] },
  { id:"cabrini",     name:"Antonio Cabrini", nationality:"Italy",  positions:["LB"],            caps:[{team:"italy-1982",overall:82}] },
  { id:"oriali",      name:"Gabriele Oriali", nationality:"Italy",  positions:["CDM"],           caps:[{team:"italy-1982",overall:80}] },
  { id:"tardelli",    name:"Marco Tardelli",  nationality:"Italy",  positions:["CM"],            caps:[{team:"italy-1982",overall:83}] },
  { id:"antognoni",   name:"Giancarlo Antognoni",nationality:"Italy",positions:["CAM","CM"],     caps:[{team:"italy-1982",overall:83}] },
  { id:"conti",       name:"Bruno Conti",     nationality:"Italy",  positions:["RW","RM"],       caps:[{team:"italy-1982",overall:83}] },
  { id:"rossi",       name:"Paolo Rossi",     nationality:"Italy",  positions:["ST"],            caps:[{team:"italy-1982",overall:87}] },
  { id:"graziani",    name:"Francesco Graziani",nationality:"Italy",positions:["ST"],            caps:[{team:"italy-1982",overall:81}] },

  // ---- West Germany 1990 ----
  { id:"illgner",     name:"Bodo Illgner",    nationality:"West Germany",positions:["GK"],       caps:[{team:"wgermany-1990",overall:83}] },
  { id:"berthold",    name:"Thomas Berthold", nationality:"West Germany",positions:["RB"],       caps:[{team:"wgermany-1990",overall:80}] },
  { id:"kohler",      name:"Jürgen Kohler",   nationality:"West Germany",positions:["CB"],       caps:[{team:"wgermany-1990",overall:84}] },
  { id:"augenthaler", name:"Klaus Augenthaler",nationality:"West Germany",positions:["CB"],      caps:[{team:"wgermany-1990",overall:82}] },
  { id:"brehme",      name:"Andreas Brehme",  nationality:"West Germany",positions:["LB"],       caps:[{team:"wgermany-1990",overall:85}] },
  { id:"buchwald",    name:"Guido Buchwald",  nationality:"West Germany",positions:["CB","CDM"], caps:[{team:"wgermany-1990",overall:82}] },
  { id:"matthaus",    name:"Lothar Matthäus", nationality:"West Germany",positions:["CM"],       caps:[{team:"wgermany-1990",overall:89}] },
  { id:"hassler",     name:"Thomas Häßler",   nationality:"West Germany",positions:["CAM","RM"], caps:[{team:"wgermany-1990",overall:83}] },
  { id:"littbarski",  name:"Pierre Littbarski",nationality:"West Germany",positions:["RW","RM"], caps:[{team:"wgermany-1990",overall:82}] },
  { id:"klinsmann",   name:"Jürgen Klinsmann",nationality:"West Germany",positions:["ST"],       caps:[{team:"wgermany-1990",overall:85}] },
  { id:"voller",      name:"Rudi Völler",     nationality:"West Germany",positions:["ST"],       caps:[{team:"wgermany-1990",overall:84}] },

  // ---- England 1990 ----
  { id:"shilton",     name:"Peter Shilton",   nationality:"England",positions:["GK"],            caps:[{team:"england-1990",overall:84}] },
  { id:"parker",      name:"Paul Parker",     nationality:"England",positions:["RB"],            caps:[{team:"england-1990",overall:78}] },
  { id:"walker",      name:"Des Walker",      nationality:"England",positions:["CB"],            caps:[{team:"england-1990",overall:81}] },
  { id:"butcher",     name:"Terry Butcher",   nationality:"England",positions:["CB"],            caps:[{team:"england-1990",overall:81}] },
  { id:"pearce",      name:"Stuart Pearce",   nationality:"England",positions:["LB"],            caps:[{team:"england-1990",overall:83}] },
  { id:"waddle",      name:"Chris Waddle",    nationality:"England",positions:["RW","RM"],       caps:[{team:"england-1990",overall:83}] },
  { id:"platt",       name:"David Platt",     nationality:"England",positions:["CM"],            caps:[{team:"england-1990",overall:81}] },
  { id:"gascoigne",   name:"Paul Gascoigne",  nationality:"England",positions:["CAM","CM"],      caps:[{team:"england-1990",overall:85}] },
  { id:"barnes",      name:"John Barnes",     nationality:"England",positions:["LW","LM"],       caps:[{team:"england-1990",overall:84}] },
  { id:"lineker",     name:"Gary Lineker",    nationality:"England",positions:["ST"],            caps:[{team:"england-1990",overall:86}] },
  { id:"beardsley",   name:"Peter Beardsley", nationality:"England",positions:["ST","CAM"],      caps:[{team:"england-1990",overall:82}] },

  // ---- Brazil 1994 ----
  { id:"taffarel",    name:"Cláudio Taffarel",nationality:"Brazil", positions:["GK"],            caps:[{team:"brazil-1994",overall:83}] },
  { id:"jorginho",    name:"Jorginho",        nationality:"Brazil", positions:["RB"],            caps:[{team:"brazil-1994",overall:81}] },
  { id:"aldair",      name:"Aldair",          nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1994",overall:84}] },
  { id:"marcio-santos",name:"Márcio Santos",  nationality:"Brazil", positions:["CB"],            caps:[{team:"brazil-1994",overall:79}] },
  { id:"branco",      name:"Branco",          nationality:"Brazil", positions:["LB"],            caps:[{team:"brazil-1994",overall:80}] },
  { id:"mauro-silva", name:"Mauro Silva",     nationality:"Brazil", positions:["CDM"],           caps:[{team:"brazil-1994",overall:82}] },
  { id:"dunga",       name:"Dunga",           nationality:"Brazil", positions:["CDM","CM"],      caps:[{team:"brazil-1994",overall:83}] },
  { id:"zinho",       name:"Zinho",           nationality:"Brazil", positions:["LM","CAM"],      caps:[{team:"brazil-1994",overall:81}] },
  { id:"mazinho",     name:"Mazinho",         nationality:"Brazil", positions:["CM","RM"],       caps:[{team:"brazil-1994",overall:78}] },
  { id:"bebeto",      name:"Bebeto",          nationality:"Brazil", positions:["ST","CAM"],      caps:[{team:"brazil-1994",overall:85}] },
  { id:"romario",     name:"Romário",         nationality:"Brazil", positions:["ST"],            caps:[{team:"brazil-1994",overall:91}] },

  // ---- Netherlands 2010 ----
  { id:"stekelenburg",name:"Maarten Stekelenburg",nationality:"Netherlands",positions:["GK"],    caps:[{team:"netherlands-2010",overall:82}] },
  { id:"van-der-wiel",name:"Gregory van der Wiel",nationality:"Netherlands",positions:["RB"],    caps:[{team:"netherlands-2010",overall:79}] },
  { id:"heitinga",    name:"John Heitinga",   nationality:"Netherlands",positions:["CB"],        caps:[{team:"netherlands-2010",overall:81}] },
  { id:"mathijsen",   name:"Joris Mathijsen", nationality:"Netherlands",positions:["CB"],        caps:[{team:"netherlands-2010",overall:79}] },
  { id:"van-bronckhorst",name:"G. van Bronckhorst",nationality:"Netherlands",positions:["LB"],   caps:[{team:"netherlands-2010",overall:81}] },
  { id:"de-jong",     name:"Nigel de Jong",   nationality:"Netherlands",positions:["CDM"],       caps:[{team:"netherlands-2010",overall:81}] },
  { id:"van-bommel",  name:"Mark van Bommel", nationality:"Netherlands",positions:["CDM","CM"],  caps:[{team:"netherlands-2010",overall:82}] },
  { id:"sneijder",    name:"Wesley Sneijder", nationality:"Netherlands",positions:["CAM"],       caps:[{team:"netherlands-2010",overall:88}] },
  { id:"kuyt",        name:"Dirk Kuyt",       nationality:"Netherlands",positions:["RW","ST"],   caps:[{team:"netherlands-2010",overall:81}] },
  { id:"robben",      name:"Arjen Robben",    nationality:"Netherlands",positions:["RW","LW"],   caps:[{team:"netherlands-2010",overall:88}] },
  { id:"van-persie",  name:"Robin van Persie",nationality:"Netherlands",positions:["ST"],        caps:[{team:"netherlands-2010",overall:86}] },

  // ---- Portugal 2006 ----
  { id:"ricardo-gk",  name:"Ricardo",         nationality:"Portugal",positions:["GK"],           caps:[{team:"portugal-2006",overall:82}] },
  { id:"miguel",      name:"Miguel",          nationality:"Portugal",positions:["RB"],           caps:[{team:"portugal-2006",overall:79}] },
  { id:"r-carvalho",  name:"Ricardo Carvalho",nationality:"Portugal",positions:["CB"],           caps:[{team:"portugal-2006",overall:85}] },
  { id:"f-meira",     name:"Fernando Meira",  nationality:"Portugal",positions:["CB"],           caps:[{team:"portugal-2006",overall:79}] },
  { id:"nuno-valente",name:"Nuno Valente",    nationality:"Portugal",positions:["LB"],           caps:[{team:"portugal-2006",overall:77}] },
  { id:"maniche",     name:"Maniche",         nationality:"Portugal",positions:["CM","CDM"],     caps:[{team:"portugal-2006",overall:83}] },
  { id:"costinha",    name:"Costinha",        nationality:"Portugal",positions:["CDM"],          caps:[{team:"portugal-2006",overall:79}] },
  { id:"deco",        name:"Deco",            nationality:"Portugal",positions:["CAM","CM"],     caps:[{team:"portugal-2006",overall:86}] },
  { id:"figo",        name:"Luís Figo",       nationality:"Portugal",positions:["RW","RM"],      caps:[{team:"portugal-2006",overall:86}] },
  { id:"cristiano-06",name:"Cristiano Ronaldo",nationality:"Portugal",positions:["LW","RW"],     caps:[{team:"portugal-2006",overall:84}] },
  { id:"pauleta",     name:"Pauleta",         nationality:"Portugal",positions:["ST"],           caps:[{team:"portugal-2006",overall:82}] },

  // ---- Croatia 2018 ----
  { id:"subasic",     name:"Danijel Subašić", nationality:"Croatia",positions:["GK"],            caps:[{team:"croatia-2018",overall:81}] },
  { id:"vrsaljko",    name:"Šime Vrsaljko",   nationality:"Croatia",positions:["RB"],            caps:[{team:"croatia-2018",overall:80}] },
  { id:"lovren",      name:"Dejan Lovren",    nationality:"Croatia",positions:["CB"],            caps:[{team:"croatia-2018",overall:81}] },
  { id:"vida",        name:"Domagoj Vida",    nationality:"Croatia",positions:["CB"],            caps:[{team:"croatia-2018",overall:79}] },
  { id:"strinic",     name:"Ivan Strinić",    nationality:"Croatia",positions:["LB"],            caps:[{team:"croatia-2018",overall:78}] },
  { id:"brozovic",    name:"Marcelo Brozović",nationality:"Croatia",positions:["CDM"],           caps:[{team:"croatia-2018",overall:82}] },
  { id:"rakitic",     name:"Ivan Rakitić",    nationality:"Croatia",positions:["CM"],            caps:[{team:"croatia-2018",overall:86}] },
  { id:"modric",      name:"Luka Modrić",     nationality:"Croatia",positions:["CM","CAM"],      caps:[{team:"croatia-2018",overall:90}] },
  { id:"perisic",     name:"Ivan Perišić",    nationality:"Croatia",positions:["LW","LM"],       caps:[{team:"croatia-2018",overall:84}] },
  { id:"rebic",       name:"Ante Rebić",      nationality:"Croatia",positions:["RW","ST"],       caps:[{team:"croatia-2018",overall:80}] },
  { id:"mandzukic",   name:"Mario Mandžukić", nationality:"Croatia",positions:["ST"],            caps:[{team:"croatia-2018",overall:85}] },
];

/* teamId -> [{player, overall}] for the wheel/draft */
const PLAYERS_BY_TEAM = (() => {
  const map = {};
  for (const t of TEAMS) map[t.id] = [];
  for (const p of PLAYERS) {
    p.prime = Math.max(...p.caps.map(c => c.overall));   // career-peak rating across tournaments
    for (const c of p.caps) if (map[c.team]) map[c.team].push({ player: p, overall: c.overall });
  }
  for (const id in map) map[id].sort((a, b) => b.overall - a.overall);
  return map;
})();

window.WC_DATA = { TEAMS, PLAYERS, PLAYERS_BY_TEAM, OPPONENT_STRENGTH };
