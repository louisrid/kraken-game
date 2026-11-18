/* OUTLIER question bank.
   Tiers: C crowd 10 · H hipster 15 · O offbeat 30 · R rare 60 · F fringe 85 · X outlier 100 (one per prompt).
   Items are comma-separated; aliases separated by "/" (first is the display name).
   no: "Name/alias: reason; ..." — near-misses that get a specific explanation. */
const BANK_SRC = [

/* ───────── GEOGRAPHY ───────── */
{id:"landlocked", cat:"geo", q:"Name a landlocked country", a:`
C: Switzerland, Austria, Bolivia, Nepal, Mongolia, Paraguay, Afghanistan, Hungary
H: Liechtenstein, Vatican City/Vatican/Holy See, San Marino, Lesotho, Uzbekistan
O: Czech Republic/Czechia, Slovakia, Luxembourg, Ethiopia, Uganda, Zimbabwe, Zambia, Chad, Mali, Niger, Serbia, Belarus, Laos, Bhutan, Rwanda, Botswana, Kazakhstan, Andorra
R: Burkina Faso, Malawi, Moldova, North Macedonia/Macedonia, Kyrgyzstan, Tajikistan, Turkmenistan, Kosovo, Central African Republic/CAR
F: Eswatini/Swaziland, South Sudan, Burundi, Armenia
X: Azerbaijan`,
fact:"Its only coastline is on the Caspian Sea, which is technically the world's largest lake.",
no:"Bosnia and Herzegovina/Bosnia: Bosnia has about 20 km of Adriatic coast at Neum; Slovenia: Slovenia has a short Adriatic coastline; Jordan: Jordan reaches the Red Sea at Aqaba; Iraq: Iraq has a short coastline on the Gulf; DR Congo/Democratic Republic of the Congo/DRC/Congo: Both Congos touch the Atlantic; Belgium: Belgium has a North Sea coast; Sudan: Sudan has a Red Sea coast; Montenegro: Montenegro is on the Adriatic"},

{id:"africa", cat:"geo", q:"Name a country in Africa", a:`
C: Egypt, South Africa, Nigeria, Kenya, Morocco, Ghana, Ethiopia
H: Madagascar, Djibouti, Burkina Faso, Chad
O: Algeria, Tunisia, Libya, Sudan, Somalia, Uganda, Tanzania, Zimbabwe, Zambia, Senegal, Cameroon, Ivory Coast/Côte d'Ivoire/Cote d Ivoire, Angola, Mozambique, Namibia, Botswana, Rwanda, Mali, Niger, Democratic Republic of the Congo/DR Congo/DRC/Congo-Kinshasa/Zaire, Republic of the Congo/Congo/Congo-Brazzaville, Liberia, Sierra Leone
R: Malawi, Burundi, Benin, Togo, Gambia/The Gambia, Guinea, Mauritania, Eritrea, Gabon, Lesotho, Eswatini/Swaziland, Mauritius, Seychelles, Cape Verde/Cabo Verde, South Sudan, Central African Republic/CAR
F: Guinea-Bissau, Equatorial Guinea, Comoros
X: São Tomé and Príncipe/Sao Tome/Sao Tome and Principe`,
fact:"Africa's second-smallest country: two volcanic islands in the Gulf of Guinea.",
no:"Western Sahara: A disputed territory, not one of Africa's 54 recognised states; Somaliland: Self-declared, but not internationally recognised; Rhodesia: That's the old name for Zimbabwe; Abyssinia: An old name — try Ethiopia"},

{id:"oneneighbour", cat:"geo", q:"Name a country with exactly one land neighbour", a:`
C: Canada, Portugal, Ireland/Republic of Ireland
H: Vatican City/Vatican/Holy See, San Marino, Lesotho, Monaco
O: Denmark, United Kingdom/UK/Britain/Great Britain, Haiti, Dominican Republic, South Korea
R: Gambia/The Gambia, Brunei, Papua New Guinea/PNG
F: Timor-Leste/East Timor
X: Qatar`,
fact:"Its only land border is with Saudi Arabia, which kept it closed from 2017 to 2021.",
no:"Liechtenstein: Two — Switzerland and Austria; Andorra: Two — France and Spain; Spain: Spain has several, including France and Portugal; Bahrain: No land neighbours — just a causeway to Saudi Arabia; Singapore: No land border — a causeway links it to Malaysia; North Korea: Three — China, Russia and South Korea; Mexico: Three — the USA, Guatemala and Belize; United States/USA: Two — Canada and Mexico; New Zealand: No land borders at all; Australia: No land borders at all; Japan: No land borders at all; Iceland: No land borders at all; Norway: Three — Sweden, Finland and Russia"},

{id:"olympics", cat:"geo", q:"Name a city that has hosted the Summer Olympics", a:`
C: London, Paris, Beijing, Tokyo, Athens, Sydney, Rio de Janeiro/Rio
H: Atlanta, Moscow
O: Barcelona, Los Angeles/LA, Seoul, Munich, Montreal
R: Mexico City, Rome, Berlin, Helsinki, Amsterdam, Melbourne
F: Stockholm, Antwerp
X: St. Louis/Saint Louis`,
fact:"In 1904 the first runner across the marathon finish line had ridden part of the course in a car.",
no:"Brisbane: Hosting in 2032 — not yet; Manchester: Bid twice, never hosted; Madrid: Bid several times, never hosted; Istanbul: Bid five times, never hosted; Chicago: Bid for 2016, lost to Rio; Sochi: Winter Olympics, not Summer; Vancouver: Winter Olympics, not Summer; Salt Lake City: Winter Olympics, not Summer; Lillehammer: Winter Olympics, not Summer; Turin: Winter Olympics, not Summer; Calgary: Winter Olympics, not Summer; Sarajevo: Winter Olympics, not Summer; Nagano: Winter Olympics, not Summer; Pyeongchang: Winter Olympics, not Summer; Milan/Cortina/Milan Cortina: Winter Olympics (2026), not Summer; Innsbruck: Winter Olympics, not Summer"},

{id:"capitals", cat:"geo", q:"Name a European capital city", a:`
C: London, Paris, Berlin, Rome, Madrid, Dublin, Amsterdam
H: Reykjavik/Reykjavík, Valletta, Bern/Berne
O: Lisbon, Vienna, Athens, Brussels, Prague, Warsaw, Budapest, Stockholm, Oslo, Copenhagen, Helsinki, Moscow, Kyiv/Kiev, Edinburgh, Cardiff, Belfast
R: Bratislava, Ljubljana, Zagreb, Belgrade, Sofia, Bucharest, Tallinn, Riga, Vilnius, Minsk, Tirana, Sarajevo, Luxembourg/Luxembourg City, Nicosia, Ankara, Monaco
F: Chișinău/Chisinau, Skopje, Podgorica, Pristina, Vaduz, San Marino, Vatican City, Tbilisi, Yerevan, Baku
X: Andorra la Vella`,
fact:"The highest capital city in Europe, sitting at about 1,023 metres in the Pyrenees.",
no:"Geneva: Switzerland's capital is Bern; Zurich: Switzerland's capital is Bern; Istanbul: Turkey's capital is Ankara; Barcelona: Not a national capital; Milan: Not a capital; Munich: Not a capital; Manchester: Not a capital; St Petersburg/Saint Petersburg: Russia's capital moved to Moscow in 1918; Rotterdam: Not a capital; The Hague: Seat of government, but Amsterdam is the capital; Krakow/Kraków: Warsaw took over in 1596; Glasgow: Scotland's capital is Edinburgh; Constantinople: That's Istanbul now, and not a capital; Porto: Not a capital; Astana: Kazakhstan's capital is in Asia"},

/* ───────── FOOD & DRINK ───────── */
{id:"pasta", cat:"food", q:"Name a type of pasta", a:`
C: Spaghetti, Penne, Lasagne/Lasagna, Macaroni/Elbow macaroni, Fusilli, Tagliatelle, Ravioli
H: Orecchiette, Orzo/Risoni, Gnocchi, Farfalle/Bow tie/Bowtie
O: Linguine, Fettuccine/Fettucine, Rigatoni, Tortellini, Cannelloni, Conchiglie/Shells/Pasta shells, Pappardelle, Vermicelli, Capellini/Angel hair, Ditalini, Ziti, Bucatini, Gemelli, Rotini, Manicotti, Tortelloni, Cavatappi, Couscous
R: Paccheri, Tortiglioni, Cavatelli, Agnolotti, Trofie, Radiatori, Casarecce/Caserecce, Mafaldine/Reginette, Campanelle, Garganelli, Pici, Bigoli, Anelletti/Anelli, Lumache, Stelline, Pastina, Mezze maniche, Fregola/Fregula, Cappelletti, Malloreddus, Rotelle/Wagon wheels, Spaghettini, Fideo/Fideos, Tagliolini/Taglierini, Calamarata, Candele, Mostaccioli, Pizzoccheri, Maltagliati
F: Strozzapreti, Corzetti, Lorighittas, Busiate, Culurgiones, Sagne, Scialatielli, Mezzelune, Fileja, Lagane, Testaroli, Gramigna, Cappellacci, Tajarin, Umbricelli/Umbrichelli, Stringozzi, Chitarra/Spaghetti alla chitarra, Sorprese
X: Su filindeu/Filindeu`,
fact:"Made by hand by only a few people in Nuoro, Sardinia. The name means 'threads of God'.",
no:"Ramen: That's a noodle, not pasta; Udon: That's a noodle, not pasta; Soba: That's a noodle, not pasta; Noodles: Too general — name a pasta; Carbonara: That's a sauce; Bolognese: That's a sauce; Pesto: That's a sauce; Mac and cheese: That's a dish — the pasta is macaroni"},

{id:"cheese", cat:"food", q:"Name a cheese", a:`
C: Cheddar, Brie, Mozzarella, Parmesan/Parmigiano Reggiano/Parmigiano, Feta, Gouda, Camembert, Stilton, Blue cheese, Cream cheese, Cottage cheese, Swiss cheese
H: Halloumi, Gruyère/Gruyere, Roquefort, Manchego, Burrata
O: Edam, Emmental/Emmentaler/Emmenthal, Ricotta, Mascarpone, Gorgonzola, Wensleydale, Red Leicester, Double Gloucester, Monterey Jack, Paneer, Comté/Comte, Pecorino/Pecorino Romano, Provolone, Havarti, Jarlsberg, Raclette, Boursin, Leerdammer, Lancashire, Caerphilly, Cheshire, Danish Blue, Colby, Pepper Jack, Babybel, Queso fresco, Labneh, Asiago, Fontina, American cheese, Philadelphia, Saint Agur, Dolcelatte, Cambozola, Port Salut, Shropshire Blue, Cornish Yarg/Yarg, Stinking Bishop, Grana Padano
R: Taleggio, Reblochon, Époisses/Epoisses, Morbier, Beaufort, Cantal, Mimolette, Pont-l'Évêque/Pont l Eveque, Vacherin/Vacherin Mont d'Or, Tête de Moine/Tete de Moine, Kashkaval, Oaxaca, Scamorza, Caciocavallo, Stracchino, Robiola, Sage Derby, Brunost/Gjetost, Limburger, Munster, Tilsit/Tilsiter, Cotija, Manouri, Kefalotyri, Graviera, Tomme/Tomme de Savoie, Saint-Nectaire, Chaource, Brillat-Savarin, Langres, Valençay/Valencay, Crottin/Crottin de Chavignol, Bleu d'Auvergne, Fourme d'Ambert, Ossau-Iraty, Idiazabal, Mahón/Mahon, Cabrales, Torta del Casar, Appenzeller, Sbrinz, Maasdam, Bergkäse/Bergkase, Bel Paese, Castelmagno, Montasio, Stracciatella, Bocconcini, Panela, Quark, Lanark Blue, Akkawi, Nabulsi
F: Pule, Bryndza, Oscypek, Juustoleipä/Juustoleipa/Leipäjuusto/Leipajuusto/Squeaky cheese, Paški sir/Pag cheese, Formaggio di fossa, Rollot, Vieux-Boulogne, Bitto, Västerbottensost/Vasterbottensost/Vasterbotten, Tulum, Chhurpi, Fiore Sardo, Humboldt Fog, Teleme, Brick cheese
X: Casu marzu`,
fact:"A Sardinian sheep's cheese deliberately left to be colonised by live insect larvae.",
no:"Tofu: Bean curd, not cheese; Butter: Dairy, but not a cheese; Yoghurt/Yogurt: Dairy, but not a cheese; Dairylea: A brand of cheese spread — name the cheese"},

{id:"cocktail", cat:"food", q:"Name a cocktail", a:`
C: Mojito, Margarita, Martini, Piña Colada/Pina Colada, Cosmopolitan/Cosmo, Old Fashioned, Bloody Mary, Long Island Iced Tea/Long Island, Daiquiri, Sex on the Beach, Gin and Tonic/G and T
H: Negroni, Espresso Martini, Aperol Spritz/Spritz, Pornstar Martini/Passion fruit martini
O: Manhattan, Mai Tai, Moscow Mule, Whiskey Sour/Whisky Sour, Tequila Sunrise, Caipirinha, Cuba Libre/Rum and Coke, Gin Fizz, Tom Collins, Bellini, Mimosa, White Russian, Black Russian, Mint Julep, Dark 'n' Stormy/Dark and Stormy, Paloma, Sidecar, Kir Royale, Kir, Gimlet, Singapore Sling, Zombie, Blue Lagoon, Hurricane, Screwdriver, Sea Breeze, Woo Woo, Pisco Sour, Irish Coffee, Michelada, Bramble, Buck's Fizz/Bucks Fizz, Snowball, Amaretto Sour, Bay Breeze, Cape Codder, Sangria, Pimm's/Pimms/Pimm's Cup, Hot Toddy, Mudslide, B-52/B52, Kamikaze, Lemon Drop, Appletini/Apple Martini, French Martini
R: Sazerac, Boulevardier, Aviation, French 75, Last Word, Corpse Reviver, Ramos Gin Fizz, Clover Club, Paper Plane, Penicillin, Vesper, Rob Roy, Rusty Nail, Godfather, Grasshopper, Brandy Alexander, Sherry Cobbler, Hanky Panky, Bee's Knees, Southside, Gin Rickey, Harvey Wallbanger, Painkiller, Jungle Bird, Mary Pickford, El Diablo, Americano, Garibaldi, Hugo/Hugo Spritz, Sgroppino, Stinger, Gibson, Salty Dog, Greyhound, Tommy's Margarita, Planter's Punch, Navy Grog, Scorpion, Fog Cutter, Pink Lady, White Lady, Bronx, Caipiroska, Rossini, Tinto de verano, Kalimotxo/Calimocho, Pegu Club, Champagne Cocktail, Blue Hawaiian, Ward Eight, Fish House Punch, Rum Swizzle, Charlie Chaplin
F: Vieux Carré/Vieux Carre, Martinez, Bijou, Tuxedo, Brooklyn, Monkey Gland, Blood and Sand, Jack Rose, Japanese Slipper, Saturn, Trinidad Sour, Toronto, Remember the Maine, Naked and Famous, Widow's Kiss, Hemingway Daiquiri, Corn 'n' Oil/Corn and Oil, Satan's Whiskers, Twentieth Century, Final Ward, Gold Rush, Old Cuban, Chartreuse Swizzle
X: Death in the Afternoon`,
fact:"Ernest Hemingway's own recipe: absinthe topped with iced champagne, published in 1935.",
no:"Beer: Not a cocktail; Wine: Not a cocktail; Shandy: Beer and lemonade — not really a cocktail; Snakebite: More of a pub dare than a cocktail"},

{id:"spice", cat:"food", q:"Name a herb or spice", a:`
C: Basil, Oregano, Cinnamon, Black pepper/Pepper/Peppercorn, Rosemary, Thyme, Parsley, Mint, Paprika/Smoked paprika/Pimentón, Cumin, Chilli/Chili/Chilli powder/Chili powder/Chilli flakes, Ginger, Nutmeg, Coriander/Cilantro, Turmeric, Garlic/Garlic powder
H: Saffron, Sumac, Za'atar/Zaatar, Star anise
O: Cardamom, Cloves/Clove, Dill, Sage, Bay leaf/Bay/Bay leaves, Chives, Tarragon, Fennel/Fennel seed, Mustard seed/Mustard, Allspice, Cayenne/Cayenne pepper, Vanilla, Lemongrass, Fenugreek, Caraway, Marjoram, Anise/Aniseed, Curry leaf/Curry leaves, Juniper/Juniper berries, Chervil, Lovage, Sesame/Sesame seed, Poppy seed, Celery seed, Garam masala, Five spice/Chinese five spice, Ras el hanout, Herbes de Provence, Curry powder, White pepper, Pink peppercorn, Wasabi, Horseradish, Lavender, Lemon balm, Pandan, Onion powder
R: Asafoetida/Hing, Galangal, Mace, Nigella/Black seed/Kalonji/Nigella seed, Sichuan pepper/Szechuan pepper, Sorrel, Borage, Savory/Summer savory/Winter savory, Epazote, Shiso/Perilla, Ajwain/Carom, Amchur/Amchoor/Mango powder, Kaffir lime leaf/Makrut lime leaf/Lime leaf, Annatto/Achiote, Hyssop, Angelica, Cubeb, Aleppo pepper/Pul biber, Urfa biber/Urfa pepper, Baharat, Berbere, Dukkah, Shichimi/Shichimi togarashi, Gochugaru, Tajín/Tajin, Old Bay, Panch phoron, Chaat masala, Kashmiri chilli/Kashmiri chili
F: Long pepper/Pippali, Mahlab/Mahleb, Wattleseed, Culantro/Sawtooth coriander, Rue, Sweet cicely, Lemon myrtle, Mastic, Pepperberry/Tasmanian pepper, Anardana, Kokum, Black lime/Loomi, Zedoary, Grains of Selim, Timur pepper, Costmary, Filé powder/File powder/Sassafras, Fingerroot/Krachai
X: Grains of paradise/Melegueta pepper`,
fact:"A peppery West African seed that medieval Europe used as a fancy stand-in for black pepper.",
no:"Salt: A mineral — not a herb or spice; MSG: A flavour enhancer, not a spice; Sugar: Not a spice; Onion: A vegetable — try onion powder"},

{id:"citrus", cat:"food", q:"Name a citrus fruit", a:`
C: Lemon, Lime, Orange, Grapefruit, Mandarin, Clementine, Satsuma, Tangerine
H: Yuzu, Kumquat, Blood orange
O: Pomelo/Pummelo, Bergamot, Key lime, Ugli fruit/Ugli, Seville orange, Citron, Tangelo, Kaffir lime/Makrut lime, Calamansi/Calamondin, Navel orange, Valencia orange, Meyer lemon, Bitter orange
R: Sudachi, Kabosu, Dekopon/Sumo/Sumo citrus/Shiranui, Minneola/Mineola, Buddha's hand, Etrog, Rangpur, Chinotto, Cara cara/Cara cara orange, Persian lime/Tahiti lime, Sweet lime/Mosambi, Blood lime, Oroblanco, Jaffa orange, Moro orange, Tarocco, Hassaku, Iyokan, Amanatsu, Ponkan, Kinnow
F: Desert lime/Australian desert lime, Jabara, Shikuwasa/Shekwasha/Hirami lemon, Citrange, Mandarinquat, Limequat, Rough lemon, Volkamer lemon, Natsumikan, Papeda, Ichang papeda, Trifoliate orange/Poncirus, Sanbokan
X: Finger lime/Caviar lime`,
fact:"Native to Australian rainforests: slice one open and the pulp spills out as tiny caviar-like beads.",
no:"Pineapple: Tangy, but not a citrus; Kiwi/Kiwi fruit: Not a citrus; Passion fruit: Not a citrus; Tamarind: Sour, but not a citrus"},

{id:"bread", cat:"food", q:"Name a type of bread", a:`
C: Baguette, Sourdough, Bagel, Naan/Nan, Pitta/Pita, Ciabatta, Focaccia, Brioche, Rye/Rye bread, Wholemeal/Whole wheat, White bread, Garlic bread, Tortilla, Flatbread, Cornbread/Corn bread, Soda bread
H: Challah, Pumpernickel, Bao/Bao bun
O: Chapati, Roti, Paratha, Bloomer, Cob, English muffin, Pretzel, Matzo/Matzah, Injera, Lavash, Arepa, Panettone, Stollen, Pain de mie, Fougasse, Tiger bread/Giraffe bread, Milk bread/Hokkaido milk bread/Shokupan, Crumpet, Teacake, Bap, Barm/Barm cake, Stottie/Stottie cake, Farl, Oatcake, Damper, Puri/Poori, Kulcha, Bhatura, Pão de queijo/Pao de queijo/Brazilian cheese bread, Simit, Pide, Khachapuri, Lángos/Langos, Bialy, Grissini/Breadstick, Brown bread, Multigrain, Spelt, Hot cross bun, Banana bread, Monkey bread, Pandoro, Crispbread/Knäckebröd/Knackebrod, Bánh mì/Banh mi, Piadina
R: Pain d'épices/Pain d epices, Barmbrack/Brack, Bara brith, Kalach, Pikelet, Tsoureki, Lefse, Barbari, Johnnycake, Hoecake, Rewena, Fry bread, Bannock, Taboon, Ka'ak, Markook, Manakish/Manoushe, Chipa, Roti canai, Appam, Rugbrød/Rugbrod, Vollkornbrot, Pan de muerto, Concha, Bolillo, Telera, Kaiser roll, Pan dulce, Cozonac, Pogača/Pogaca, Lepinja, Somun, Tonis puri, Michetta/Rosetta, Vinschgauer, Pandesal/Pan de sal, Ensaymada, Mantou, Youtiao, Shaobing, Melonpan, Anpan, Zopf, Pane di Altamura, Pane toscano
F: Pane carasau/Carta da musica, Rúgbrauð/Rugbraud/Hverabrauð/Hverabraud, Bammy, Pan de coco, Tunnbröd/Tunnbrod, Flatbrød/Flatbrod, Obi non, Tandyr nan, Shoti, Dabo kolo, Kisra
X: Sangak`,
fact:"A Persian flatbread whose name means 'little stone': it's baked on a bed of hot pebbles.",
no:"Croissant: That's a pastry; Scone: Too cake-like for us; Pizza: Nice try; Doughnut/Donut: That's a doughnut; Toast: That's just bread, but warmer; Muffin: Which kind? Try English muffin"},

/* ───────── FILM & TV ───────── */
{id:"animoscar", cat:"screen", q:"Name a film that won the Oscar for Best Animated Feature", a:`
C: Shrek, Frozen, Toy Story 3, Up, Coco, Finding Nemo, Inside Out, Encanto, Spirited Away
H: Wallace and Gromit: The Curse of the Were-Rabbit/Wallace and Gromit/The Curse of the Were-Rabbit/Curse of the Were-Rabbit, Spider-Man: Into the Spider-Verse/Into the Spider-Verse/Spider-Verse
O: The Incredibles/Incredibles, Ratatouille, WALL-E/Wall E, Zootopia/Zootropolis, Big Hero 6, Brave, Soul, Toy Story 4, KPop Demon Hunters/K-Pop Demon Hunters
R: Happy Feet, Rango, Guillermo del Toro's Pinocchio/Pinocchio, The Boy and the Heron
X: Flow`,
fact:"A wordless Latvian film about a cat in a flood, made with the free open-source software Blender.",
no:"Toy Story: Released before the category existed (2001); The Lion King: Released before the category existed; Monsters Inc/Monsters, Inc.: Lost the first-ever award to Shrek; Shrek 2: Lost to The Incredibles; Cars: Lost to Happy Feet; How to Train Your Dragon: Nominated, never won; Kung Fu Panda: Nominated, never won; Moana: Lost to Zootopia; The Lego Movie: Famously not even nominated; The Wild Robot: Lost to Flow; Inside Out 2: Nominated, didn't win; Elemental: Lost to The Boy and the Heron; Isle of Dogs: Lost to Into the Spider-Verse; Klaus: Lost to Toy Story 4; Fantastic Mr Fox/Fantastic Mr. Fox: Lost to Up; Coraline: Lost to Up; Puss in Boots: Nominated, never won"},

{id:"nolan", cat:"screen", q:"Name a film directed by Christopher Nolan", a:`
C: Inception, Interstellar, Oppenheimer, The Dark Knight/Dark Knight
H: Memento, The Prestige/Prestige
O: Batman Begins, The Dark Knight Rises/Dark Knight Rises, Dunkirk, Tenet
R: Insomnia, The Odyssey/Odyssey
F: Following
X: Doodlebug`,
fact:"His three-minute 1997 short about a man chasing a tiny creature round his flat, which turns out to be a miniature him.",
no:"The Matrix: That's the Wachowskis; Shutter Island: That's Martin Scorsese; Man of Steel: He produced it; Zack Snyder directed; Transcendence: He executive-produced; Wally Pfister directed; Batman: Be specific — he made three; Fight Club: That's David Fincher; Arrival: That's Denis Villeneuve; Dune: That's Denis Villeneuve"},

{id:"ghibli", cat:"screen", q:"Name a Studio Ghibli film", a:`
C: Spirited Away, My Neighbor Totoro/My Neighbour Totoro/Totoro, Howl's Moving Castle, Princess Mononoke/Mononoke, Kiki's Delivery Service
H: Grave of the Fireflies, Ponyo, The Boy and the Heron
O: Castle in the Sky/Laputa/Laputa: Castle in the Sky, Nausicaä of the Valley of the Wind/Nausicaa/Nausicaa of the Valley of the Wind, Porco Rosso, The Wind Rises, Arrietty/The Secret World of Arrietty/The Borrower Arrietty, Whisper of the Heart, The Cat Returns
R: Pom Poko, The Tale of the Princess Kaguya/Princess Kaguya, When Marnie Was There, From Up on Poppy Hill/Poppy Hill, Tales from Earthsea/Earthsea, Only Yesterday, Earwig and the Witch
F: Ocean Waves, My Neighbors the Yamadas/My Neighbours the Yamadas
X: The Red Turtle`,
fact:"A wordless Ghibli co-production directed by the Dutch animator Michaël Dudok de Wit.",
no:"Akira: Katsuhiro Otomo — not Ghibli; Your Name: Makoto Shinkai — not Ghibli; Weathering with You: Makoto Shinkai — not Ghibli; Suzume: Makoto Shinkai — not Ghibli; Perfect Blue: Satoshi Kon — not Ghibli; Paprika: Satoshi Kon — not Ghibli; Wolf Children: Mamoru Hosoda — not Ghibli; Mary and the Witch's Flower: Studio Ponoc, founded by ex-Ghibli staff; The Girl Who Leapt Through Time: Mamoru Hosoda — not Ghibli"},

{id:"simpsons", cat:"screen", q:"Name a character from The Simpsons", a:`
C: Homer/Homer Simpson, Marge/Marge Simpson, Bart/Bart Simpson, Lisa/Lisa Simpson, Maggie/Maggie Simpson, Mr. Burns/Mr Burns/Montgomery Burns/Burns, Ned Flanders/Flanders/Ned, Krusty/Krusty the Clown, Moe/Moe Szyslak, Apu, Milhouse/Milhouse Van Houten
H: Hans Moleman/Moleman, Comic Book Guy, Disco Stu, Gil/Gil Gunderson
O: Sideshow Bob, Smithers/Waylon Smithers, Chief Wiggum/Clancy Wiggum, Ralph Wiggum/Ralph, Barney/Barney Gumble, Patty/Patty Bouvier, Selma/Selma Bouvier, Grampa Simpson/Grampa/Grandpa Simpson/Abe Simpson/Abraham Simpson, Nelson/Nelson Muntz, Martin Prince/Martin, Principal Skinner/Skinner/Seymour Skinner, Edna Krabappel/Mrs Krabappel/Krabappel, Groundskeeper Willie/Willie, Otto, Lenny, Carl, Dr Hibbert/Julius Hibbert, Dr Nick/Dr Nick Riviera, Lionel Hutz, Troy McClure, Kent Brockman, Itchy, Scratchy, Snowball/Snowball II, Santa's Little Helper, Mayor Quimby/Quimby, Fat Tony, Professor Frink/Frink, Rod Flanders/Rod, Todd Flanders/Todd, Maude Flanders/Maude, Reverend Lovejoy/Rev Lovejoy, Helen Lovejoy, Jimbo/Jimbo Jones, Kearney, Dolph, Sherri, Terri, Uter, Bumblebee Man, Cletus, Duffman, Rainier Wolfcastle/McBain, Sideshow Mel, Lou, Snake, Kang, Kodos, Agnes Skinner, Jasper, Sea Captain/Captain McCallister, Squeaky Voiced Teen, Luann Van Houten, Kirk Van Houten, Superintendent Chalmers/Chalmers, Lunchlady Doris/Doris, Crazy Cat Lady, Frank Grimes/Grimey, Poochie, Mrs Hoover/Ms Hoover/Miss Hoover
R: Mona Simpson, Herb Powell/Uncle Herb, Jacqueline Bouvier, Artie Ziff, Bleeding Gums Murphy, Drederick Tatum, Database, Wendell, Lewis, Janey, Manjula, Allison Taylor, Jessica Lovejoy, Plopper/Spider-Pig, Blinky, Dewey Largo/Mr Largo, Ling, Old Jewish Man, Judge Snyder, Legs, Louie, Johnny Tightlips, Arnie Pye, Lindsey Naegle, Brandine, Cookie Kwan, Akira, Sanjay, Hank Scorpio, Roger Meyers Jr./Roger Meyers, Herman, Dr Marvin Monroe/Marvin Monroe, Cecil Terwilliger, Gunter, Ernst, Jebediah Springfield, Mr Teeny, Shauna Chalmers, Hyman Krustofsky/Rabbi Krustofsky
F: Hugo Simpson/Hugo, Larry Burns, Shary Bobbins, Mr Sparkle, Captain Lance Murdock/Lance Murdock, Princess Kashmir, Baby Gerald, Sophie Krustofsky, Lurleen Lumpkin, Gabbo, Laura Powers, Ruth Powers
X: Lyle Lanley`,
fact:"The fast-talking monorail salesman from 'Marge vs. the Monorail', voiced by Phil Hartman.",
no:"Peter Griffin: Wrong show — that's Family Guy; Stewie: Wrong show — that's Family Guy; Cartman: Wrong show — that's South Park; Hank Hill: Wrong show — that's King of the Hill; Wiggum: Which one — Chief or Ralph?; Lovejoy: Which one? Be specific"},

{id:"bond", cat:"screen", q:"Name a James Bond film", a:`
C: Skyfall, Casino Royale, GoldenEye/Golden Eye, Goldfinger, Dr. No/Dr No/Doctor No, No Time to Die, Spectre
H: Octopussy, Live and Let Die
O: From Russia with Love, Quantum of Solace, Die Another Day, Tomorrow Never Dies, The World Is Not Enough, Thunderball, You Only Live Twice, The Spy Who Loved Me, Moonraker, Diamonds Are Forever, The Man with the Golden Gun
R: For Your Eyes Only, A View to a Kill, The Living Daylights, Licence to Kill/License to Kill, On Her Majesty's Secret Service/OHMSS
X: Never Say Never Again`,
fact:"Sean Connery's unofficial 1983 comeback, made outside the official Eon series.",
no:"Kingsman: Wrong spy; Johnny English: Wrong spy (sort of); Austin Powers: Wrong spy, baby; Mission Impossible/Mission: Impossible: Wrong spy; Tinker Tailor Soldier Spy: Wrong spy; Bond 26: Not made yet"},

{id:"bestpicture", cat:"screen", q:"Name a Best Picture Oscar winner", a:`
C: Titanic, The Godfather/Godfather, Forrest Gump, Gladiator, Oppenheimer, Parasite, Schindler's List, The Silence of the Lambs/Silence of the Lambs, Casablanca, Braveheart, Gone with the Wind, Rocky, The Sound of Music/Sound of Music
H: Moonlight, Crash, The Artist, Everything Everywhere All at Once, Birdman, Green Book
O: Ben-Hur, West Side Story, Lawrence of Arabia, My Fair Lady, The Godfather Part II/Godfather Part 2/The Godfather Part 2/Godfather 2/Godfather II/Godfather Part II, One Flew Over the Cuckoo's Nest, Platoon, Rain Man, Dances with Wolves, Unforgiven, Shakespeare in Love, American Beauty, A Beautiful Mind, Chicago, The Lord of the Rings: The Return of the King/The Return of the King/Return of the King, Million Dollar Baby, The Departed, No Country for Old Men, Slumdog Millionaire, The Hurt Locker, The King's Speech, Argo, 12 Years a Slave/Twelve Years a Slave, Spotlight, The Shape of Water, Nomadland, CODA, Anora, One Battle After Another, Amadeus, The English Patient, Annie Hall, The Deer Hunter, Midnight Cowboy, All Quiet on the Western Front
R: It Happened One Night, Mrs. Miniver/Mrs Miniver, The Best Years of Our Lives, All About Eve, An American in Paris, From Here to Eternity, On the Waterfront, Around the World in 80 Days, The Bridge on the River Kwai, Gigi, The Apartment, Tom Jones, A Man for All Seasons, In the Heat of the Night, Oliver!/Oliver, Patton, The French Connection, The Sting, Kramer vs. Kramer/Kramer vs Kramer, Ordinary People, Chariots of Fire, Gandhi, Terms of Endearment, Out of Africa, The Last Emperor, Driving Miss Daisy, Rebecca, Hamlet, Marty, The Lost Weekend, Going My Way, How Green Was My Valley
F: The Broadway Melody, Cimarron, Grand Hotel, Cavalcade, Mutiny on the Bounty, The Great Ziegfeld, The Life of Emile Zola, You Can't Take It with You, Gentleman's Agreement, All the King's Men, The Greatest Show on Earth
X: Wings`,
fact:"The very first Best Picture winner (1929): a silent First World War dogfight epic.",
no:"Citizen Kane: Famously lost, to How Green Was My Valley; Pulp Fiction: Lost to Forrest Gump; The Shawshank Redemption/Shawshank: Also lost to Forrest Gump; Brokeback Mountain: Lost to Crash; La La Land: Announced by mistake — Moonlight won; Star Wars: Lost to Annie Hall; E.T./ET: Lost to Gandhi; Avatar: Lost to The Hurt Locker; The Social Network: Lost to The King's Speech; Saving Private Ryan: Lost to Shakespeare in Love; Goodfellas: Lost to Dances with Wolves; Jaws: Lost to One Flew Over the Cuckoo's Nest; Taxi Driver: Lost to Rocky; Black Panther: Lost to Green Book; The Brutalist: Lost to Anora; Barbie: Lost to Oppenheimer; Killers of the Flower Moon: Lost to Oppenheimer; The Lord of the Rings/Lord of the Rings: Only the third film won — be specific; Jurassic Park: Not even nominated"},

/* ───────── MUSIC ───────── */
{id:"beatles", cat:"music", q:"Name a Beatles song", a:`
C: Hey Jude, Let It Be, Yesterday, Help!/Help, Yellow Submarine, Here Comes the Sun, Come Together, All You Need Is Love, Twist and Shout, A Hard Day's Night, Love Me Do, She Loves You, I Want to Hold Your Hand, Eleanor Rigby, Strawberry Fields Forever/Strawberry Fields, Penny Lane, Hello Goodbye, Something, Get Back
H: Helter Skelter, Ob-La-Di Ob-La-Da/Obladi Oblada, Octopus's Garden, Blackbird, Revolution 9
O: Can't Buy Me Love, Day Tripper, Paperback Writer, Lucy in the Sky with Diamonds, While My Guitar Gently Weeps, In My Life, Norwegian Wood, Michelle, Drive My Car, With a Little Help from My Friends, Sgt. Pepper's Lonely Hearts Club Band/Sgt Pepper, A Day in the Life, Back in the U.S.S.R./Back in the USSR, Across the Universe, The Long and Winding Road, I Am the Walrus, Ticket to Ride, Eight Days a Week, Nowhere Man, Taxman, Tomorrow Never Knows, Lady Madonna, Revolution, Here There and Everywhere, Golden Slumbers, Girl, Rain, I Saw Her Standing There, From Me to You, Please Please Me, We Can Work It Out, I Feel Fine, All My Loving, Dear Prudence, Got to Get You into My Life, Magical Mystery Tour, The Fool on the Hill, Don't Let Me Down, The Ballad of John and Yoko, Maxwell's Silver Hammer, Oh! Darling/Oh Darling, Because, I Want You (She's So Heavy), Now and Then, Two of Us, Good Day Sunshine, When I'm Sixty-Four/When I'm 64, Getting Better, She's Leaving Home, Being for the Benefit of Mr. Kite!/Mr Kite, Lovely Rita, Within You Without You, Happiness Is a Warm Gun, Julia, Birthday, Glass Onion, Rocky Raccoon, Piggies, The End, Carry That Weight, You Never Give Me Your Money, And I Love Her, If I Fell, You've Got to Hide Your Love Away, I've Just Seen a Face, I'm Only Sleeping, For No One, Free as a Bird
R: Things We Said Today, I Should Have Known Better, No Reply, I'm a Loser, Baby's in Black, Rock and Roll Music, Mr. Moonlight, Words of Love, Every Little Thing, I Don't Want to Spoil the Party, What You're Doing, I Need You, Another Girl, You're Going to Lose That Girl, Act Naturally, It's Only Love, Tell Me What You See, Dizzy Miss Lizzy, Yes It Is, I'm Down, Think for Yourself, The Word, You Won't See Me, What Goes On, Wait, If I Needed Someone, Run for Your Life, Love You To, She Said She Said, And Your Bird Can Sing, Doctor Robert, I Want to Tell You, Baby You're a Rich Man, Blue Jay Way, Your Mother Should Know, Flying, Hey Bulldog, All Together Now, Martha My Dear, I'm So Tired, I Will, Yer Blues, Mother Nature's Son, Sexy Sadie, Savoy Truffle, Cry Baby Cry, Honey Pie, Good Night, Old Brown Shoe, I Me Mine, For You Blue, I've Got a Feeling, Dig a Pony, One After 909, Sun King, Mean Mr. Mustard, Polythene Pam, She Came In Through the Bathroom Window, Real Love, P.S. I Love You/PS I Love You, Do You Want to Know a Secret, Till There Was You, Please Mister Postman/Please Mr Postman, Roll Over Beethoven, Money (That's What I Want), Anna (Go to Him), Boys, Chains, Misery, There's a Place, This Boy, I Call Your Name, Long Tall Sally, She's a Woman, Thank You Girl, I'll Follow the Sun, I'll Be Back, I'll Cry Instead, Any Time at All, When I Get Home, You Can't Do That, Tell Me Why, It Won't Be Long, All I've Got to Do, Hold Me Tight, Little Child, I Wanna Be Your Man, Not a Second Time
F: You Know My Name (Look Up the Number), It's All Too Much, Only a Northern Song, Wild Honey Pie, The Continuing Story of Bungalow Bill/Bungalow Bill, Long Long Long, Don't Pass Me By, Why Don't We Do It in the Road?, Everybody's Got Something to Hide Except Me and My Monkey, Dig It, Maggie Mae, The Inner Light, Ask Me Why, Baby It's You, A Taste of Honey, Devil in Her Heart, You Really Got a Hold on Me, Don't Bother Me, Slow Down, Matchbox, Bad Boy, Kansas City, Honey Don't, Everybody's Trying to Be My Baby, Good Morning Good Morning, Fixing a Hole, You Like Me Too Much
X: Her Majesty`,
fact:"A 23-second throwaway tucked after the end of Abbey Road, often called the first hidden track.",
no:"Imagine: John Lennon solo; Give Peace a Chance: Plastic Ono Band; Instant Karma!/Instant Karma: John Lennon solo; Jealous Guy: John Lennon solo; My Sweet Lord: George Harrison solo; Live and Let Die: Paul McCartney and Wings; Band on the Run: Paul McCartney and Wings; Mull of Kintyre: Wings; Maybe I'm Amazed: Paul McCartney solo; Photograph: Ringo Starr solo; Wonderwall: Oasis — close, but no; Mrs Robinson/Mrs. Robinson: Simon & Garfunkel"},

{id:"instrument", cat:"music", q:"Name a musical instrument", a:`
C: Guitar, Piano, Drums/Drum, Violin/Fiddle, Trumpet, Flute, Saxophone/Sax, Cello, Clarinet, Harp, Bass/Bass guitar, Keyboard, Recorder, Ukulele, Harmonica, Trombone, Tambourine
H: Theremin, Triangle, Kazoo, Didgeridoo, Bagpipes
O: Oboe, Bassoon, Tuba, French horn/Horn, Viola, Double bass/Upright bass, Banjo, Mandolin, Accordion, Xylophone, Glockenspiel, Cymbals/Cymbal, Bongos, Maracas, Sitar, Harpsichord, Organ, Synthesizer/Synth, Piccolo, Cornet, Euphonium, Timpani, Marimba, Vibraphone, Steel drum/Steelpan/Steel pan, Lute, Lyre, Pan flute/Panpipes/Pan pipes, Castanets, Cowbell, Djembe, Tabla, Bodhrán/Bodhran, Melodica, Cajón/Cajon, Snare drum, Bass drum, Gong, Celesta, Cor anglais/English horn, Flugelhorn, Sousaphone, Tin whistle/Penny whistle, Ocarina, Harmonium, Zither, Koto, Balalaika, Bouzouki, Dulcimer, Hurdy-gurdy, Kalimba/Thumb piano, Bugle, Keytar, Washboard, Jaw harp/Jew's harp, Autoharp, Spoons, Handpan/Hang drum, Electric guitar, Acoustic guitar, Concertina, Mbira, Shamisen, Erhu, Oud, Gamelan, Taiko, Bell/Bells, Chimes/Tubular bells, Contrabassoon, Bass clarinet, Rainstick, Vuvuzela
R: Shakuhachi, Sarangi, Veena, Santoor, Guzheng, Pipa, Theorbo, Viola da gamba, Sackbut, Crumhorn, Ophicleide, Ondes Martenot, Waterphone, Nyckelharpa, Kora, Talking drum, Charango, Cuatro, Bandoneón/Bandoneon, Melodeon, Cimbalom, Mridangam, Dhol, Darbuka/Doumbek, Güiro/Guiro, Claves, Agogô/Agogo, Cabasa, Berimbau, Hardanger fiddle, Psaltery, Rebab, Kantele, Hulusi, Sheng, Dizi, Duduk, Zurna, Sarod, Tanpura/Tambura, Shruti box, Udu, Slit drum, Glass harmonica, Lap steel/Pedal steel/Steel guitar, Mellotron, Clavichord, Spinet, Virginal, Rebec, Shawm, Bass recorder, Sopranino, Tenor horn, Baritone horn, Wagner tuba, Contrabass, Musical saw/Saw, Flexatone, Vibraslap, Ratchet, Anvil, Thunder sheet, Wind machine, Hammered dulcimer, Appalachian dulcimer, Dobro/Resonator guitar, Pipe organ, Hammond organ, Calliope, Accordina, Bawu, Suona, Morin khuur, Kemenche, Saz/Bağlama/Baglama, Tar, Setar, Kamancheh, Ney, Bansuri, Shehnai, Nadaswaram, Ghatam, Kanjira, Tumbi, Ektara, Bulbul tarang, Jal tarang
F: Serpent, Hydraulophone, Laúd/Laud, Gusli, Domra, Bandura, Kobza, Tromba marina, Sarrusophone, Heckelphone, Octobass, Subcontrabass saxophone, Cristal Baschet, Daxophone, Array mbira, Chapman Stick/Stick, Eigenharp, Rubab, Dutar, Komuz, Dombra, Valiha, Ngoni, Akonting, Balafon, Mbira dzavadzimu, Txalaparta, Alphorn, Lur, Carnyx, Cornamuse, Gemshorn, Nose flute, Bullroarer
X: Stylophone`,
fact:"A pocket synth played by touching a metal stylus to its keyboard. David Bowie used one on 'Space Oddity'.",
no:"Voice: Technically... no; Microphone: Not an instrument; Amplifier/Amp: Not an instrument; Speaker: Not an instrument; Turntable/Turntables/Decks: The DJs will argue. We won't; Metronome: It keeps time; it doesn't play"},

{id:"eurovision", cat:"music", q:"Name a country that won Eurovision before 2026", a:`
C: Sweden, Ireland, United Kingdom/UK/Britain, Ukraine, Italy
H: Finland, Yugoslavia
O: Netherlands/Holland, France, Norway, Denmark, Germany, Israel, Spain, Austria, Greece, Russia, Portugal, Switzerland
R: Estonia, Latvia, Turkey/Türkiye, Serbia, Azerbaijan, Belgium, Luxembourg
X: Monaco`,
fact:"Won in 1971 but had no suitable venue to host, so the 1972 contest was held in Edinburgh.",
no:"Australia: Competes since 2015 but hasn't won; Iceland: Never won, though 2020's cancellation stung; Malta: Never won; Cyprus: Never won; Poland: Never won; Croatia: Never won as Croatia — though Yugoslavia's 1989 winners were from Zadar; Hungary: Never won; Romania: Never won; Lithuania: Never won; Armenia: Never won; Moldova: Never won; Albania: Never won; San Marino: Never won; Czechia/Czech Republic: Never won; Belarus: Never won; Wales: Never competed on its own; Scotland: Never competed on its own; ABBA: The band, not the country — that was Sweden"},

{id:"mj", cat:"music", q:"Name a Michael Jackson solo song", a:`
C: Thriller, Billie Jean, Beat It, Smooth Criminal, Bad, Man in the Mirror, Black or White, Earth Song, Don't Stop 'Til You Get Enough, Remember the Time, The Way You Make Me Feel, Heal the World, They Don't Care About Us
H: Dirty Diana, Leave Me Alone, Scream, Smile
O: Rock with You, Off the Wall, You Are Not Alone, Human Nature, Wanna Be Startin' Somethin', P.Y.T. (Pretty Young Thing)/PYT, I Just Can't Stop Loving You, Liberian Girl, Jam, Who Is It, In the Closet, Will You Be There, Stranger in Moscow, Blood on the Dance Floor, You Rock My World, Dangerous, Give In to Me, Speed Demon, Another Part of Me, Childhood, HIStory/History, Ghosts, Got to Be There, Rockin' Robin, She's Out of My Life, Girlfriend, This Is It, Love Never Felt So Good, Hold My Hand, Butterflies, Cry, Gone Too Soon, Workin' Day and Night, The Girl Is Mine, Unbreakable, Invincible, Xscape
R: Tabloid Junkie, D.S., Money, 2 Bad, Little Susie, This Time Around, Keep the Faith, Can't Let Her Get Away, Why You Wanna Trip on Me, She Drives Me Wild, Speechless, Threatened, Break of Dawn, Heaven Can Wait, Privacy, Whatever Happens, Baby Be Mine, The Lady in My Life, Just Good Friends, I Can't Help It, Get on the Floor, Burn This Disco Out, It's the Falling in Love, One Day in Your Life, Farewell My Summer Love, Music and Me, We're Almost There, Happy, Is It Scary, Morphine, Breaking News, Hollywood Tonight, (I Like) The Way You Love Me, Behind the Mask, A Place with No Name, Slave to the Rhythm, Chicago, Loving You, Do You Know Where Your Children Are, Blue Gangsta, Fly Away, Streetwalker, Ain't No Sunshine, Superfly Sister, 2000 Watts, Heartbreaker
F: Just a Little Bit of You, Maria (You Were the Only One), In Our Small Way, Al Capone, Price of Fame, Monkey Business, Someone Put Your Hand Out, Fall Again, Beautiful Girl, Cheater, We've Had Enough, On the Line, For All Time, Much Too Soon, Best of Joy, (I Can't Make It) Another Day, Love Is Here and Now You're Gone
X: Ben`,
fact:"His first solo US No.1 (1972): a tender love song to a pet rat, from a horror film of the same name.",
no:"Say Say Say: Paul McCartney's single, with Michael as guest; ABC: That's The Jackson 5; I Want You Back: That's The Jackson 5; I'll Be There: That's The Jackson 5; Blame It on the Boogie: That's The Jacksons; Can You Feel It: That's The Jacksons; Shake Your Body (Down to the Ground)/Shake Your Body: That's The Jacksons; State of Shock: That's The Jacksons (with Mick Jagger); We Are the World: A charity single by USA for Africa; Smooth Operator: That's Sade; Moonwalk: That's a dance move; Uptown Funk: Bruno Mars and Mark Ronson"},

/* ───────── SPORT ───────── */
{id:"plclubs", cat:"sport", q:"Name a club that played in the Premier League up to 2025–26", a:`
C: Manchester United/Man United/Man Utd/Man U, Liverpool, Arsenal, Chelsea, Manchester City/Man City, Tottenham Hotspur/Tottenham/Spurs, Everton, Newcastle United/Newcastle
H: Wimbledon/Wimbledon FC
O: Aston Villa/Villa, West Ham United/West Ham, Leicester City/Leicester, Leeds United/Leeds, Southampton, Wolverhampton Wanderers/Wolves, Crystal Palace/Palace, Fulham, Brighton & Hove Albion/Brighton, Brentford, AFC Bournemouth/Bournemouth, Nottingham Forest/Forest/Nottm Forest, Burnley, Sunderland, Middlesbrough/Boro, Norwich City/Norwich, Watford, Stoke City/Stoke, Sheffield United/Sheff Utd, West Bromwich Albion/West Brom/WBA, Blackburn Rovers/Blackburn, Ipswich Town/Ipswich, Luton Town/Luton
R: Bolton Wanderers/Bolton, Wigan Athletic/Wigan, Swansea City/Swansea, Portsmouth/Pompey, Queens Park Rangers/QPR, Derby County/Derby, Charlton Athletic/Charlton, Birmingham City/Birmingham, Hull City/Hull, Coventry City/Coventry, Sheffield Wednesday/Sheff Wed, Cardiff City/Cardiff, Reading, Huddersfield Town/Huddersfield
F: Barnsley, Blackpool, Bradford City/Bradford, Oldham Athletic/Oldham
X: Swindon Town/Swindon`,
fact:"Their only Premier League season (1993–94) ended with 100 goals conceded in 42 games.",
no:"Millwall: Never in the Premier League up to 2025–26; Wrexham: Never in the Premier League up to 2025–26; Bristol City: Never in the Premier League; Preston/Preston North End: Never in the Premier League; Rotherham/Rotherham United: Never in the Premier League; Plymouth/Plymouth Argyle: Never in the Premier League; Notts County: Never in the Premier League; Bristol Rovers: Never in the Premier League; Celtic: Scottish — wrong league; Rangers: Scottish — wrong league; MK Dons/Milton Keynes Dons: Never in the Premier League (Wimbledon were, though)"},

{id:"f1", cat:"sport", ppl:1, q:"Name a Formula 1 World Drivers' Champion", a:`
C: Lewis Hamilton, Michael Schumacher, Ayrton Senna, Max Verstappen, Sebastian Vettel, Fernando Alonso
H: James Hunt, Niki Lauda
O: Alain Prost, Nigel Mansell, Jenson Button, Kimi Räikkönen/Kimi Raikkonen/Kimi, Damon Hill, Mika Häkkinen/Mika Hakkinen, Nico Rosberg, Jackie Stewart, Lando Norris, Juan Manuel Fangio/Fangio, Jim Clark, Jacques Villeneuve, Graham Hill
R: Emerson Fittipaldi, Nelson Piquet, Mario Andretti, Jack Brabham, Keke Rosberg, Alberto Ascari, Jody Scheckter, John Surtees, Alan Jones, Phil Hill
F: Denny Hulme, Mike Hawthorn, Giuseppe Farina/Nino Farina
X: Jochen Rindt`,
fact:"The only driver crowned champion after his death, in 1970.",
no:"Stirling Moss/Moss: Never won the title — four times the runner-up; Gilles Villeneuve: Never champion — his son Jacques was; Ralf Schumacher: Never champion — his brother Michael was; David Coulthard/Coulthard: Never champion; Rubens Barrichello/Barrichello: Never champion; Mark Webber/Webber: Never champion; Felipe Massa/Massa: Lost the 2008 title by a single point; Charles Leclerc/Leclerc: Not a champion yet; Oscar Piastri/Piastri: Not a champion yet; George Russell: Not a champion yet; Daniel Ricciardo/Ricciardo: Never champion; Valtteri Bottas/Bottas: Never champion; Lewis: First names won't do here"},

{id:"ballondor", cat:"sport", ppl:1, q:"Name a men's Ballon d'Or winner (up to 2025)", a:`
C: Lionel Messi, Cristiano Ronaldo/CR7/Cristiano, Ronaldinho, Zinedine Zidane/Zidane, Kaká/Kaka, Luka Modrić/Luka Modric
H: Lev Yashin, George Weah
O: Ronaldo Nazário/Ronaldo Nazario/R9/Brazilian Ronaldo, Karim Benzema, Rivaldo, Luís Figo/Luis Figo, Michael Owen, Andriy Shevchenko, Pavel Nedvěd/Pavel Nedved, Fabio Cannavaro, Marco van Basten/Van Basten, Johan Cruyff/Cruyff, Franz Beckenbauer, Michel Platini, Ruud Gullit, Roberto Baggio, Ousmane Dembélé/Ousmane Dembele, Rodri, Lothar Matthäus/Lothar Matthaus, Eusébio/Eusebio, Alfredo Di Stéfano/Alfredo Di Stefano/Di Stefano, Bobby Charlton, George Best, Kevin Keegan, Gerd Müller/Gerd Muller
R: Stanley Matthews, Raymond Kopa, Denis Law, Matthias Sammer, Hristo Stoichkov, Jean-Pierre Papin, Karl-Heinz Rummenigge, Paolo Rossi, Omar Sívori/Omar Sivori, Gianni Rivera, Oleg Blokhin, Allan Simonsen
F: Josef Masopust, Flórián Albert/Florian Albert, Igor Belanov
X: Luis Suárez/Luis Suarez`,
fact:"Not that one! Spain's Luis Suárez Miramontes won it in 1960, long before the Uruguayan striker was born.",
no:"Ronaldo: Two Ronaldos have won it — be specific; Thierry Henry/Henry: Never won it; Xavi: Never won it; Andrés Iniesta/Iniesta: Never won it — runner-up in 2010; Neymar: Never won it; Robert Lewandowski/Lewandowski: Never won it — the 2020 award was cancelled; Diego Maradona/Maradona: Never won it — only Europeans were eligible until 1995; Pelé/Pele: Never eligible — only Europeans could win until 1995; Kylian Mbappé/Mbappe: Not up to 2025; Erling Haaland/Haaland: Not up to 2025; Mohamed Salah/Salah: Never won it; Paolo Maldini/Maldini: Never won it; Gianluigi Buffon/Buffon: Never won it; Andrea Pirlo/Pirlo: Never won it; Steven Gerrard/Gerrard: Never won it; Frank Lampard/Lampard: Never won it; David Beckham/Beckham: Never won it — runner-up in 1999; Raúl/Raul: Never won it; Gareth Bale/Bale: Never won it; Virgil van Dijk/Van Dijk: Runner-up in 2019; Vinícius Júnior/Vinicius Junior/Vinicius: Runner-up in 2024; Toni Kroos/Kroos: Never won it"},

{id:"wimbledon", cat:"sport", ppl:1, q:"Name a Wimbledon singles champion (1968–2025)", a:`
C: Roger Federer, Novak Djokovic, Andy Murray, Rafael Nadal/Rafa Nadal, Serena Williams, Venus Williams, Björn Borg/Bjorn Borg, Carlos Alcaraz
H: Virginia Wade, Marion Bartoli
O: John McEnroe, Pete Sampras, Boris Becker, Andre Agassi, Jimmy Connors, Steffi Graf, Martina Navratilova, Maria Sharapova, Jannik Sinner, Lleyton Hewitt, Billie Jean King, Chris Evert, Stefan Edberg, Iga Świątek/Iga Swiatek, Ash Barty/Ashleigh Barty, Petra Kvitová/Petra Kvitova, Arthur Ashe, Rod Laver
R: Pat Cash, Michael Stich, Richard Krajicek, Martina Hingis, Lindsay Davenport, Amélie Mauresmo/Amelie Mauresmo, Garbiñe Muguruza/Garbine Muguruza, Angelique Kerber, Simona Halep, Elena Rybakina, Markéta Vondroušová/Marketa Vondrousova, Barbora Krejčíková/Barbora Krejcikova, John Newcombe, Evonne Goolagong/Evonne Goolagong Cawley, Margaret Court, Jana Novotná/Jana Novotna, Conchita Martínez/Conchita Martinez, Stan Smith
F: Jan Kodeš/Jan Kodes, Ann Jones
X: Goran Ivanišević/Goran Ivanisevic`,
fact:"Won in 2001 as a wildcard ranked 125th in the world.",
no:"Tim Henman/Henman: Four semi-finals, never a title; Ivan Lendl/Lendl: Twice a finalist, never the champion; Andy Roddick/Roddick: Three finals, three losses to Federer; Ken Rosewall/Rosewall: Four finals, never won; Tracy Austin: Never won Wimbledon; Monica Seles/Seles: Never won Wimbledon; Kim Clijsters/Clijsters: Never won Wimbledon; Justine Henin/Henin: Twice a finalist, never won; Emma Raducanu/Raducanu: Won the US Open, not Wimbledon; Nick Kyrgios/Kyrgios: Runner-up in 2022; Aryna Sabalenka/Sabalenka: Not a Wimbledon champion up to 2025; Coco Gauff/Gauff: Not a Wimbledon champion up to 2025; Daniil Medvedev/Medvedev: Never won Wimbledon; Fred Perry/Perry: Won three times — but in the 1930s; Williams: Which Williams? There are two"},

{id:"wchosts", cat:"sport", q:"Name a country that has hosted the men's FIFA World Cup", a:`
C: Brazil, Qatar, Russia, England, Germany/West Germany, France, United States/USA/US/America
H: Uruguay
O: Italy, Mexico, Spain, Argentina, South Africa, Japan, South Korea/Korea, Canada
R: Sweden, Chile
X: Switzerland`,
fact:"Hosted the highest-scoring World Cup ever, in 1954: more than five goals a game.",
no:"Morocco: Co-hosting in 2030 — not yet; Portugal: Co-hosting in 2030 — not yet; Saudi Arabia: Hosting in 2034 — not yet; Australia: Co-hosted the Women's World Cup, not the men's; New Zealand: Co-hosted the Women's World Cup, not the men's; Paraguay: Staging centenary games in 2030 — not yet; Netherlands/Holland: Co-hosted the Euros, not the World Cup; Belgium: Co-hosted the Euros, not the World Cup; United Kingdom/UK/Britain: Be specific — England hosted in 1966; Scotland: Never hosted; China: Hosted the Women's World Cup, not the men's"},

{id:"ballsport", cat:"sport", q:"Name a sport played with a ball", a:`
C: Football/Soccer/Association football, Basketball, Tennis, Golf, Cricket, Rugby/Rugby union/Rugby league, Baseball, Volleyball
H: Water polo, Polo, Lacrosse, Quidditch/Quadball
O: Table tennis/Ping pong, Squash, Handball, Netball, Bowling/Ten-pin bowling/Tenpin bowling, Snooker, Pool, Billiards, Hockey/Field hockey, American football/Gridiron, Australian rules football/Aussie rules/AFL, Gaelic football, Softball, Rounders, Croquet, Bowls/Lawn bowls, Racquetball, Padel, Pickleball, Futsal, Beach volleyball, Kickball, Bocce, Pétanque/Petanque/Boules, Hurling, Beach soccer, Dodgeball, Wheelchair basketball, Wheelchair rugby, Paddle tennis
R: Camogie, Shinty, Bandy, Sepak takraw, Korfball, Goalball, Boccia, Jai alai/Basque pelota/Pelota, Fives/Eton fives/Rugby fives, Real tennis, Rackets/Racquets, Tchoukball, Floorball/Unihockey, Canoe polo, Horseball, Teqball, Footvolley, Underwater rugby, Roundnet/Spikeball, Stoolball, Gateball, Throwball, Speedball, Slamball, Bossaball, Wiffle ball/Wiffleball, Stickball, Tetherball, Four square, Sitting volleyball, Footgolf, Bike polo/Bicycle polo, Platform tennis, Footbag/Hacky sack
F: Kemari, Knattleikr, Pato, Kilikiti, Vigoro, Trugo, Chinlone, Lapta, Calcio storico, Elephant polo, Cycle ball/Radball, Sipa, Ulama, Cuju
X: Pesäpallo/Pesapallo`,
fact:"Finland's national sport: baseball reinvented in the 1920s, with the pitcher standing beside the batter and throwing straight up.",
no:"Ice hockey: Played with a puck; Badminton: Uses a shuttlecock; Ultimate/Ultimate frisbee/Frisbee: That's a disc; Disc golf: That's a disc; Curling: Stones, not balls; Darts: No ball involved; Kabaddi: No ball at all; Ringette: Uses a rubber ring; Buzkashi: That's a goat carcass. Not a ball; Shuffleboard: Pucks, not balls; Jianzi: Played with a shuttlecock"},

/* ───────── GAMING ───────── */
{id:"poketype", cat:"games", q:"Name a Pokémon type", a:`
C: Fire, Water, Grass, Electric
H: Dragon, Psychic
O: Normal, Flying, Rock, Ground, Ice, Ghost, Bug, Poison, Fighting
R: Steel, Dark, Fairy
X: Stellar`,
fact:"A special Tera Type added in Scarlet & Violet's 2023 'Indigo Disk' DLC.",
no:"Metal: Close — it's called Steel; Earth: Close — it's called Ground; Plant: Close — it's called Grass; Lightning: Close — it's called Electric; Wind/Air: Close — it's called Flying; Light: Not a type; Sound: Not a type; Cosmic: Not a type; Shadow: Shadow Pokémon exist in Colosseum, but it's not a standard type; Magic: Not a type — try Psychic or Fairy; Legendary: A category, not a type"},

{id:"gen1", cat:"games", q:"Name an original 151 Pokémon", a:`
C: Pikachu, Charmander, Bulbasaur, Squirtle, Charizard, Mewtwo, Mew, Eevee, Snorlax, Jigglypuff, Psyduck, Meowth, Gengar, Magikarp, Gyarados, Raichu, Blastoise, Venusaur, Pidgey, Rattata, Caterpie, Onix, Machamp, Vulpix, Dragonite
H: Ditto, Farfetch'd/Farfetchd, Mr. Mime/Mr Mime, Jynx, Lickitung, Slowpoke
O: Ivysaur, Charmeleon, Wartortle, Metapod, Butterfree, Weedle, Beedrill, Pidgeotto, Pidgeot, Raticate, Spearow, Fearow, Ekans, Arbok, Sandshrew, Sandslash, Nidoran, Nidoqueen, Nidoking, Clefairy, Clefable, Ninetales, Wigglytuff, Zubat, Golbat, Oddish, Vileplume, Diglett, Dugtrio, Persian, Mankey, Growlithe, Arcanine, Poliwag, Abra, Kadabra, Alakazam, Machop, Geodude, Golem, Ponyta, Slowbro, Magnemite, Shellder, Cloyster, Gastly, Haunter, Voltorb, Electrode, Exeggutor, Cubone, Marowak, Koffing, Rhyhorn, Chansey, Horsea, Staryu, Starmie, Scyther, Electabuzz, Magmar, Tauros, Lapras, Vaporeon, Jolteon, Flareon, Omanyte, Kabuto, Aerodactyl, Articuno, Zapdos, Moltres, Dratini, Dragonair, Bellsprout, Tentacool, Seel, Grimer, Muk, Kangaskhan, Hitmonchan, Hitmonlee, Krabby, Drowzee
R: Kakuna, Nidorina, Nidorino, Gloom, Paras, Venonat, Golduck, Primeape, Poliwhirl, Poliwrath, Machoke, Graveler, Rapidash, Magneton, Doduo, Dewgong, Hypno, Exeggcute, Weezing, Rhydon, Tangela, Goldeen, Seaking, Pinsir, Omastar, Kabutops, Victreebel, Tentacruel, Kingler
F: Weepinbell, Parasect, Venomoth, Seadra, Dodrio
X: Porygon`,
fact:"The star of the 1997 anime episode whose flashing lights sent hundreds of viewers in Japan to hospital.",
no:"MissingNo/MissingNo./Missingno: A glitch, not a Pokémon; Togepi: From Gold and Silver, not the original 151; Pichu: From Gold and Silver, not the original 151; Lucario: Generation 4; Greninja: Generation 6; Mimikyu: Generation 7; Sylveon: Generation 6; Espeon: Generation 2; Umbreon: Generation 2; Scizor: Generation 2; Steelix: Generation 2; Bellossom: Generation 2; Crobat: Generation 2; Kingdra: Generation 2; Porygon2/Porygon 2: Generation 2 — but you're close"},

{id:"console", cat:"games", q:"Name a video game console or handheld", a:`
C: PlayStation/PS1/PSX/PlayStation 1, PlayStation 2/PS2, PlayStation 3/PS3, PlayStation 4/PS4, PlayStation 5/PS5, Xbox, Xbox 360, Nintendo Switch/Switch, Wii, Game Boy/Gameboy, Nintendo 64/N64, Nintendo DS/DS, Xbox One
H: Virtual Boy, Dreamcast/Sega Dreamcast, Magnavox Odyssey/Odyssey
O: Xbox Series X/Series X, Xbox Series S/Series S, PSP/PlayStation Portable, PS Vita/PlayStation Vita/Vita, NES/Nintendo Entertainment System, SNES/Super Nintendo/Super Nintendo Entertainment System, GameCube/Nintendo GameCube, Wii U, Nintendo 3DS/3DS, Game Boy Advance/GBA, Game Boy Color/GBC, Nintendo Switch 2/Switch 2, Mega Drive/Sega Mega Drive/Genesis/Sega Genesis, Master System/Sega Master System, Sega Saturn/Saturn, Game Gear/Sega Game Gear, Atari 2600, Steam Deck, Switch Lite, Game & Watch/Game and Watch, Famicom, Super Famicom, Neo Geo, Atari Jaguar/Jaguar, Atari Lynx/Lynx, 3DO, ColecoVision, Intellivision, N-Gage, Ouya, Stadia/Google Stadia, DSi/Nintendo DSi, DS Lite, 2DS/Nintendo 2DS, New 3DS, PS One/PSone, Game Boy Pocket, Analogue Pocket, Switch OLED
R: TurboGrafx-16/PC Engine, CD-i/Philips CD-i, Atari 5200, Atari 7800, Vectrex, Neo Geo Pocket, WonderSwan, Mega-CD/Sega CD/Mega CD, 32X/Sega 32X, Sega Nomad/Nomad, 64DD/Nintendo 64DD, Playdate, Evercade, Atari VCS, Channel F/Fairchild Channel F, Odyssey 2/Magnavox Odyssey 2, Pokémon Mini/Pokemon Mini, PocketStation, Game Boy Micro, Xbox One X, Xbox One S, PS4 Pro, PS5 Pro, PlayStation Portal, PlayStation TV, Amiga CD32/CD32, SG-1000/Sega SG-1000, NES Classic/NES Mini, SNES Classic/SNES Mini, PlayStation Classic, Mega Drive Mini, ROG Ally, Legion Go, Meta Quest/Oculus Quest, Neo Geo CD, Sega Pico, Leapster, V.Smile/VSmile, Game Boy Light, Famicom Disk System, Satellaview
F: R-Zone/Tiger R-Zone, Casio Loopy, PC-FX, FM Towns Marty, LaserActive/Pioneer LaserActive, Super Cassette Vision, Playdia/Bandai Playdia, GX4000/Amstrad GX4000, Tapwave Zodiac, Zeebo, CDTV/Commodore CDTV, Atari XEGS, Nuon, Game.com, Pippin/Apple Pippin, Cassette Vision, Color TV-Game/Colour TV-Game, Neo Geo X, GP32, Polymega
X: Gizmondo`,
fact:"A 2005 handheld that flopped spectacularly. One of its executives later wrecked a Ferrari Enzo in Malibu at a reported 162 mph.",
no:"Atari: Atari made several — be specific; Nintendo: That's the company; Sega: That's the company; Sony: That's the company; PC: Not a console; Mac: Not a console; iPhone: A phone, not a console; iPad: Not a console; Commodore 64/C64: A home computer, not a console; ZX Spectrum/Spectrum: A home computer, not a console; Amiga: A home computer — the CD32 counts, though; PlayStation 6/PS6: Not out yet; Xbox 720: Rumoured name — it became the Xbox One; Arcade: Not a console; PlayStation VR/PSVR: An accessory, not a console"},

{id:"zelda", cat:"games", q:"Name a game in The Legend of Zelda series", a:`
C: Breath of the Wild/BOTW, Tears of the Kingdom/TOTK/Breath of the Wild 2, Ocarina of Time/OOT, Twilight Princess, The Wind Waker/Wind Waker, Majora's Mask, A Link to the Past/Link to the Past/ALTTP, Skyward Sword
H: Link's Awakening, The Legend of Zelda (1986)/The Legend of Zelda/Legend of Zelda/Zelda 1, Zelda II: The Adventure of Link/Zelda II/Zelda 2/The Adventure of Link/Adventure of Link
O: The Minish Cap/Minish Cap, Phantom Hourglass, Spirit Tracks, A Link Between Worlds/Link Between Worlds, Echoes of Wisdom, Hyrule Warriors, Four Swords, Oracle of Seasons, Oracle of Ages, Tri Force Heroes/Triforce Heroes, Four Swords Adventures, Hyrule Warriors: Age of Calamity/Age of Calamity, Cadence of Hyrule, Hyrule Warriors: Age of Imprisonment/Age of Imprisonment
R: Link's Crossbow Training, Hyrule Warriors Legends, Freshly-Picked Tingle's Rosy Rupeeland/Tingle's Rosy Rupeeland, Hyrule Warriors: Definitive Edition
F: Zelda: The Wand of Gamelon/The Wand of Gamelon/Wand of Gamelon, Zelda's Adventure, BS The Legend of Zelda/BS Zelda, BS Zelda: Ancient Stone Tablets/Ancient Stone Tablets, Zelda Game & Watch/Zelda Game and Watch
X: Link: The Faces of Evil/Faces of Evil`,
fact:"One of three infamous Zelda games for the Philips CD-i. Its cutscenes became a meme goldmine.",
no:"Zelda: Be more specific — which game?; Super Smash Bros/Smash Bros: Link's in it, but no; Soulcalibur II/Soulcalibur 2: Link guest-starred, but no; Mario Kart 8: Link's a racer, but no; Hollow Knight: Great game, wrong series; Okami: Inspired by Zelda, but no; Breath of Fire: Different series entirely"},

{id:"minecraft", cat:"games", q:"Name a Minecraft mob", a:`
C: Creeper, Zombie, Skeleton, Enderman, Spider, Pig, Cow, Sheep, Chicken, Villager, Ender Dragon/Enderdragon, Wither
H: Warden, Axolotl, Allay, Sniffer
O: Witch, Slime, Blaze, Ghast, Iron Golem/Golem, Snow Golem/Snowman, Wolf/Dog, Cat, Ocelot, Horse, Donkey, Mule, Llama, Trader Llama, Wandering Trader, Pillager, Vindicator, Evoker, Ravager, Vex, Phantom, Drowned, Husk, Stray, Guardian, Elder Guardian, Shulker, Endermite, Silverfish, Cave Spider, Magma Cube, Zombie Villager, Piglin, Piglin Brute, Zombified Piglin/Zombie Pigman/Pigman, Hoglin, Zoglin, Strider, Wither Skeleton, Bat, Squid, Glow Squid, Dolphin, Turtle, Panda, Fox, Bee, Polar Bear, Rabbit, Parrot, Goat, Frog, Tadpole, Camel, Cod, Salmon, Pufferfish, Tropical Fish, Mooshroom/Mushroom cow, Breeze, Bogged, Armadillo, Creaking, Happy Ghast, Copper Golem
R: Illusioner, Killer Bunny/Killer Rabbit, Chicken Jockey, Spider Jockey, Skeleton Horse, Zombie Horse, Ghastling, Nautilus, Zombie Nautilus, Parched, Camel Husk, Agent, NPC
X: Giant`,
fact:"A huge zombie that exists in the game's code but never spawns naturally. You can only summon it with commands.",
no:"Herobrine: A myth — 'removed' in countless patch notes, never actually in the game; Steve: That's you, the player; Alex: That's you, the player; Notch: The game's creator, not a mob; Moon Cow: An April Fools' joke; Ender Pearl: An item, not a mob; Wither Storm: Only in Minecraft: Story Mode; Jeb: A developer, not a mob"},

/* ───────── SCIENCE & NATURE ───────── */
{id:"element", cat:"sci", q:"Name a chemical element", a:`
C: Oxygen, Hydrogen, Carbon, Gold, Iron, Helium, Nitrogen, Silver, Copper, Sodium, Calcium, Uranium, Lead, Aluminium/Aluminum, Neon, Zinc
H: Tungsten, Bismuth, Plutonium
O: Silicon, Chlorine, Potassium, Magnesium, Sulfur/Sulphur, Phosphorus, Mercury, Lithium, Titanium, Nickel, Platinum, Tin, Argon, Fluorine, Iodine, Cobalt, Chromium, Radium, Radon, Krypton, Xenon, Arsenic, Boron
R: Manganese, Beryllium, Barium, Caesium/Cesium, Strontium, Palladium, Cadmium, Neodymium, Bromine, Selenium, Thorium, Polonium, Americium, Einsteinium, Iridium, Osmium, Gallium, Germanium, Antimony, Vanadium, Zirconium, Molybdenum, Rhodium, Francium, Californium, Curium, Nobelium, Mendelevium, Copernicium, Indium, Tellurium, Rubidium, Scandium, Yttrium, Tantalum, Astatine, Technetium, Oganesson, Tennessine, Nihonium, Lanthanum, Cerium, Europium, Gadolinium
F: Niobium, Ruthenium, Hafnium, Rhenium, Thallium, Actinium, Protactinium, Neptunium, Fermium, Berkelium, Lawrencium, Rutherfordium, Dubnium, Seaborgium, Bohrium, Hassium, Meitnerium, Darmstadtium, Roentgenium, Flerovium, Moscovium, Livermorium, Praseodymium, Promethium, Samarium, Terbium, Dysprosium, Holmium, Erbium, Thulium, Lutetium
X: Ytterbium`,
fact:"One of four elements named after Ytterby, a single Swedish village (with yttrium, terbium and erbium).",
no:"Unobtainium: Fictional (see: Avatar); Adamantium: Fictional (see: Wolverine); Vibranium: Fictional (see: Wakanda); Kryptonite: Superman's weakness, not an element; Water: A compound; Steel: An alloy; Bronze: An alloy; Brass: An alloy; Diamond: A form of carbon; Salt: A compound; Graphite: A form of carbon; Mithril: Fictional (see: Middle-earth)"},

{id:"bone", cat:"sci", q:"Name a bone in the human body", a:`
C: Femur/Thigh bone, Skull/Cranium, Rib/Ribs, Tibia/Shinbone/Shin bone, Humerus, Spine/Vertebra/Vertebrae/Backbone, Pelvis/Hip bone/Hip, Clavicle/Collarbone/Collar bone, Mandible/Jawbone/Jaw
H: Stapes/Stirrup, Hyoid, Coccyx/Tailbone/Tail bone
O: Fibula, Radius, Ulna, Patella/Kneecap/Knee cap, Scapula/Shoulder blade, Sternum/Breastbone/Breast bone, Sacrum, Maxilla, Metacarpal/Metacarpals, Metatarsal/Metatarsals, Phalanges/Phalanx, Carpals/Carpal, Tarsals/Tarsal, Incus/Anvil, Malleus/Hammer, Calcaneus/Heel bone, Talus/Ankle bone, Ilium, Ischium, Pubis/Pubic bone, Atlas, Axis, Zygomatic/Cheekbone/Cheek bone, Nasal bone, Frontal bone/Frontal, Parietal/Parietal bone, Temporal/Temporal bone, Occipital/Occipital bone
R: Sphenoid, Ethmoid, Palatine, Scaphoid, Lunate, Triquetrum, Pisiform, Trapezium, Trapezoid, Capitate, Hamate, Navicular, Cuboid, Cuneiform, Sesamoid, Manubrium
F: Lacrimal, Vomer, Inferior nasal concha/Nasal concha/Turbinate, Xiphoid process/Xiphoid, Wormian bones/Sutural bones, Os trigonum, Os peroneum
X: Fabella`,
fact:"A tiny bone behind the knee that only some people have — and it's become roughly three times more common in the last century.",
no:"Funny bone: Not a bone — it's the ulnar nerve; Wishbone: That's a bird's; Cartilage: Not bone; Tooth/Teeth: Teeth aren't bones; Penis bone/Baculum: Humans don't have one; Elbow: A joint, not a bone; Knee: A joint — try kneecap; Ankle: A joint — try talus; Wrist: A joint — try carpals"},

{id:"dog", cat:"sci", q:"Name a dog breed", a:`
C: Labrador/Labrador Retriever/Lab, German Shepherd/Alsatian, Golden Retriever, Poodle, Bulldog/English Bulldog, Beagle, Chihuahua, Dachshund/Sausage dog, Pug, Husky/Siberian Husky, Rottweiler, Border Collie, Jack Russell/Jack Russell Terrier, Dalmatian, Boxer, Great Dane, Yorkshire Terrier/Yorkie, Shih Tzu, Corgi/Welsh Corgi/Pembroke Welsh Corgi, French Bulldog/Frenchie, Cocker Spaniel, Greyhound, Staffordshire Bull Terrier/Staffy/Staffie, Pit Bull/Pitbull/American Pit Bull Terrier, Pomeranian
H: Shiba Inu, Basenji, Xoloitzcuintli/Xolo/Mexican hairless dog
O: Labradoodle, Cockapoo, Dobermann/Doberman/Doberman Pinscher, Schnauzer/Miniature Schnauzer, Saint Bernard/St Bernard, Bernese Mountain Dog, Newfoundland, Akita, Chow Chow, Shar Pei, Samoyed, Alaskan Malamute/Malamute, Whippet, Bloodhound, Basset Hound, Afghan Hound, Irish Wolfhound, Weimaraner, Vizsla, German Shorthaired Pointer/Pointer, English Springer Spaniel/Springer Spaniel, Cavalier King Charles Spaniel/Cavalier/King Charles Spaniel, West Highland Terrier/Westie, Scottish Terrier/Scottie, Bichon Frise, Maltese, Pekingese, Lhasa Apso, Papillon, Bull Terrier, Border Terrier, Airedale Terrier/Airedale, Cairn Terrier, Australian Shepherd/Aussie, Shetland Sheepdog/Sheltie, Old English Sheepdog, Rhodesian Ridgeback, Pyrenean Mountain Dog/Great Pyrenees, Mastiff, Bullmastiff, Cane Corso, Dogue de Bordeaux, Havanese, Italian Greyhound, Miniature Pinscher/Min Pin, Boston Terrier, Irish Setter/Red Setter, English Setter, Rough Collie/Collie, Puggle, Cavapoo, Goldendoodle, Maltipoo, Lurcher, Bedlington Terrier, Patterdale Terrier, Belgian Malinois/Malinois
R: Borzoi, Saluki, Pharaoh Hound, Ibizan Hound, Komondor, Puli, Kuvasz, Leonberger, Tibetan Mastiff, Anatolian Shepherd/Kangal, Dutch Shepherd, Briard, Bouvier des Flandres, Keeshond, Schipperke, Brussels Griffon/Griffon Bruxellois, Affenpinscher, Chinese Crested, Japanese Chin, Coton de Tulear, Lagotto Romagnolo, Spinone/Italian Spinone, Portuguese Water Dog, Nova Scotia Duck Tolling Retriever/Toller, Flat-Coated Retriever, Curly-Coated Retriever, Chesapeake Bay Retriever, Clumber Spaniel, Sussex Spaniel, Field Spaniel, Brittany/Brittany Spaniel, Dandie Dinmont Terrier, Skye Terrier, Sealyham Terrier, Norfolk Terrier, Norwich Terrier, Lakeland Terrier, Manchester Terrier, Kerry Blue Terrier, Soft-coated Wheaten Terrier/Wheaten Terrier, Parson Russell Terrier, Rat Terrier, Plott Hound, Redbone Coonhound, Bluetick Coonhound, Treeing Walker Coonhound, American Foxhound, English Foxhound/Foxhound, Harrier, Black Russian Terrier, Jindo/Korean Jindo, Tosa, Finnish Spitz, Finnish Lapphund, Norwegian Elkhound, Icelandic Sheepdog, Hovawart, Entlebucher, Greater Swiss Mountain Dog, Boerboel, Fila Brasileiro, Dogo Argentino, Presa Canario, Neapolitan Mastiff, Beauceron, Bracco Italiano, Bolognese, Löwchen/Lowchen, Wirehaired Pointing Griffon, Hokkaido
F: Azawakh, Sloughi, Cirneco dell'Etna, Mudi, Pumi, Kai Ken, Kishu Ken, Glen of Imaal Terrier, Cesky Terrier, Bergamasco, Otterhound, Thai Ridgeback, Peruvian Inca Orchid/Peruvian Hairless Dog, Catahoula Leopard Dog/Catahoula, Swedish Vallhund, Volpino Italiano, Segugio Italiano, Appenzeller Sennenhund, Pyrenean Shepherd, Carolina Dog, Sapsali, Telomian, Kintamani, Chinook, Lancashire Heeler
X: Norwegian Lundehund/Lundehund`,
fact:"Six toes on each foot and a neck that bends its head back to its spine — bred to clamber up cliffs hunting puffins.",
no:"Wolf: A wild animal, not a dog breed; Dingo: A wild dog, not a breed; Fox: Not a dog; Hyena: Not a dog — genetically closer to cats; Mutt/Mongrel: Lovely, but not a breed; Teacup: A size marketing term, not a breed; Spaniel: Which spaniel? Be specific; Terrier: Which terrier? Be specific; Retriever: Which retriever? Be specific; Sheepdog: Which sheepdog? Be specific; Scooby-Doo: He's a Great Dane — name the breed"},

{id:"solar", cat:"sci", q:"Name a planet, dwarf planet or moon in our Solar System", a:`
C: Earth, Mars, Jupiter, Saturn, Venus, Mercury, Neptune, Uranus, Pluto, The Moon/Moon/Luna
H: Europa, Titan, Io
O: Ganymede, Callisto, Ceres, Eris, Phobos, Deimos, Triton, Enceladus, Charon, Makemake, Haumea, Miranda
R: Oberon, Titania, Umbriel, Ariel, Mimas, Iapetus, Rhea, Dione, Tethys, Hyperion, Phoebe, Nereid, Proteus, Amalthea, Nix, Hydra, Puck, Pandora, Prometheus, Janus, Epimetheus, Pan, Atlas, Himalia, Larissa, Galatea, Despina, Thalassa, Naiad, Cordelia, Ophelia, Bianca, Cressida, Desdemona, Juliet, Portia, Rosalind, Belinda, Caliban, Sycorax, Helene, Telesto, Calypso, Ymir
F: Kerberos, Styx, Thebe, Metis, Adrastea, Daphnis, Perdita, Cupid, Mab, Prospero, Setebos, Stephano, Trinculo, Francisco, Margaret, Ferdinand, Elara, Pasiphae, Sinope, Lysithea, Carme, Ananke, Leda, Methone, Pallene, Polydeuces, Paaliaq, Tarvos, Ijiraq, Kiviuq, Mundilfari, Albiorix, Skathi, Erriapus, Siarnaq, Thrymr, Narvi, Aegaeon, Anthe, Halimede, Psamathe, Sao, Laomedeia, Neso, Hippocamp, Hi'iaka/Hiiaka, Namaka, Valetudo, Themisto, Callirrhoe, Megaclite, Taygete, Kalyke, Iocaste, Praxidike, Harpalyke, Bestla, Fenrir, Hati, Skoll, Surtur, Loge, Fornjot, Bergelmir, Greip, Jarnsaxa, Kari, Hyrrokkin, Tarqeq, Aegir, Bebhionn, Farbauti
X: Dysnomia`,
fact:"Eris's moon, named after the goddess of lawlessness — a nod to Eris's old nickname, Xena.",
no:"Sedna: Only a dwarf-planet candidate, not official; Vulcan: A hypothetical planet that doesn't exist; Nibiru: Doesn't exist; Planet X/Planet Nine: Still hypothetical; The Sun/Sun: That's a star; Halley's Comet/Halleys Comet: A comet; Vesta: A large asteroid, not a dwarf planet; Pallas: A large asteroid, not a dwarf planet; Quaoar: Only a dwarf-planet candidate; Gonggong: Only a dwarf-planet candidate; Orcus: Only a dwarf-planet candidate; Death Star: That's no moon; Tatooine: Fictional; Arrakis: Fictional; Endor: Fictional; Krypton: Fictional (and also a gas)"},

{id:"dino", cat:"sci", q:"Name a dinosaur", a:`
C: Tyrannosaurus/Tyrannosaurus rex/T. rex/T rex/Trex, Triceratops, Velociraptor/Raptor, Stegosaurus, Brachiosaurus, Diplodocus, Spinosaurus, Ankylosaurus
H: Brontosaurus, Parasaurolophus, Pachycephalosaurus, Dilophosaurus
O: Iguanodon, Allosaurus, Apatosaurus, Gallimimus, Compsognathus, Carnotaurus, Giganotosaurus, Argentinosaurus, Megalosaurus, Oviraptor, Protoceratops, Deinonychus, Utahraptor, Styracosaurus, Hadrosaurus
R: Baryonyx, Therizinosaurus, Carcharodontosaurus, Microraptor, Troodon, Coelophysis, Dreadnoughtus, Amargasaurus, Corythosaurus, Lambeosaurus, Ceratosaurus, Kentrosaurus, Psittacosaurus, Herrerasaurus, Eoraptor, Albertosaurus, Tarbosaurus, Yutyrannus, Edmontosaurus, Maiasaura, Ouranosaurus, Suchomimus, Mamenchisaurus, Plateosaurus, Camarasaurus, Euoplocephalus, Majungasaurus, Acrocanthosaurus, Torosaurus, Chasmosaurus, Centrosaurus, Pentaceratops, Saltasaurus, Patagotitan, Supersaurus, Hypsilophodon, Heterodontosaurus, Cryolophosaurus, Sinosauropteryx, Deinocheirus, Struthiomimus, Ornithomimus, Citipati, Minmi, Muttaburrasaurus, Scelidosaurus, Hylaeosaurus, Polacanthus, Nigersaurus, Stygimoloch, Dracorex, Gorgosaurus, Mapusaurus, Pachyrhinosaurus, Nodosaurus, Sauroposeidon, Concavenator, Zuul, Borealopelta, Kosmoceratops, Shunosaurus, Guanlong, Dilong, Caudipteryx, Massospondylus
F: Halszkaraptor, Balaur, Magyarosaurus, Europasaurus, Brachytrachelopan, Bajadasaurus, Leaellynasaura, Australovenator, Lesothosaurus, Mussaurus, Riojasaurus, Thecodontosaurus, Monolophosaurus, Sinornithosaurus, Austroraptor, Dakotaraptor, Pyroraptor, Gastonia, Wuerhosaurus, Tuojiangosaurus, Huayangosaurus, Gigantspinosaurus, Rebbachisaurus, Omeisaurus, Tyrannotitan, Nothronychus, Segnosaurus, Alxasaurus, Beipiaosaurus, Avimimus, Mononykus, Shuvuuia, Alvarezsaurus, Nasutoceratops, Regaliceratops, Zuniceratops, Leptoceratops, Bagaceratops, Yinlong, Wendiceratops, Sinoceratops, Achelousaurus, Diabloceratops, Ampelosaurus, Rapetosaurus, Futalognkosaurus, Einiosaurus, Titanosaurus
X: Irritator`,
fact:"Named for the irritation its describers felt on finding that fossil dealers had faked parts of its skull with plaster.",
no:"Pterodactyl/Pterodactylus/Pteranodon/Pterosaur: A flying reptile — not a dinosaur; Mosasaurus/Mosasaur: A marine reptile — not a dinosaur; Plesiosaurus/Plesiosaur: A marine reptile — not a dinosaur; Ichthyosaur/Ichthyosaurus: A marine reptile — not a dinosaur; Dimetrodon: Not a dinosaur — it's closer to mammals; Woolly mammoth/Mammoth: A mammal; Megalodon: A shark; Archaeopteryx: An early bird — we're keeping birds out of this; Indominus rex/Indominus: Fictional (Jurassic World); Godzilla: A kaiju, not a dinosaur; Barney: Purple, but no; Yoshi: Nice try; Chicken: Technically a dinosaur... but we said no birds; Sabre-toothed tiger/Smilodon: A mammal"},

/* ───────── WORDS & CULTURE ───────── */
{id:"japanese", cat:"words", q:"Name an English word borrowed from Japanese", a:`
C: Sushi, Karaoke, Emoji, Tsunami, Anime, Manga, Karate, Origami, Ninja, Samurai, Sake
H: Tycoon, Honcho
O: Bonsai, Haiku, Kimono, Sumo, Judo, Tofu, Wasabi, Teriyaki, Tempura, Ramen, Sashimi, Geisha, Zen, Futon, Kamikaze, Shogun, Rickshaw, Umami, Kawaii, Otaku, Edamame, Matcha, Miso, Udon, Soba, Bento, Yakuza, Ikebana, Sudoku, Senpai, Banzai, Hibachi, Koi, Shiitake, Daikon, Tatami, Dojo, Sensei, Shinto, Satsuma, Katana, Shuriken, Nunchaku/Nunchucks, Jiu-jitsu/Jujitsu/Jujutsu, Aikido, Kendo, Reiki, Shiatsu, Kaiju, Gyoza, Yakitori, Wagyu, Mochi, Ponzu, Panko, Nori, Dashi, Furikake
R: Kaizen, Tsundoku, Ikigai, Karoshi, Hikikomori, Kintsugi, Wabi-sabi, Kudzu, Gaijin, Bushido, Sayonara, Ronin, Daimyo, Kabuki, Noh, Netsuke, Raku, Shamisen, Koto, Tanuki, Akita, Shiba, Kombu, Yuzu
F: Mikado, Soy/Soya, Ginkgo, Kaki, Nisei, Issei, Hakama, Obi, Geta, Zori, Tsukemono, Torii, Pachinko, Hiragana, Katakana, Kanji, Seppuku, Hara-kiri/Harakiri, Kakemono, Tokonoma, Byobu
X: Skosh`,
fact:"Slang for 'a little bit', picked up from Japanese 'sukoshi' by American servicemen in the 1950s.",
no:"Typhoon: Its origins are disputed — Greek, Chinese and Arabic all claim it; Kung fu: That's from Chinese; Tai chi: That's from Chinese; Feng shui: That's from Chinese; Ketchup: Probably from a Chinese dialect; Taekwondo: That's from Korean; Kimchi: That's from Korean; K-pop: Korean; Pho: Vietnamese"},

{id:"typeface", cat:"words", q:"Name a typeface (font)", a:`
C: Arial, Times New Roman/Times, Comic Sans/Comic Sans MS, Helvetica, Calibri, Verdana, Courier/Courier New, Georgia
H: Papyrus, Wingdings, Futura, Garamond
O: Gill Sans, Baskerville, Tahoma, Trebuchet/Trebuchet MS, Impact, Roboto, Open Sans, Lato, Montserrat, Bodoni, Didot, Rockwell, Cambria, Consolas, Segoe UI/Segoe, San Francisco/SF Pro, Lucida Grande/Lucida, Palatino, Century Gothic, Franklin Gothic, Frutiger, Avenir, Univers, Optima, Myriad/Myriad Pro, Minion/Minion Pro, Book Antiqua, Brush Script, Copperplate, Cooper Black, Bauhaus, Clarendon, Caslon, Inter, Noto, Source Sans/Source Sans Pro, Poppins, Raleway, Ubuntu, Fira Sans, Monaco, Menlo, Arial Black, Lucida Console, Candara, Constantia, Corbel, Bookman, Perpetua, Gotham, Proxima Nova, DIN, Eurostile, Trajan, Jokerman, Chiller, Curlz/Curlz MT, Bradley Hand, Lobster, Pacifico, Old English, Zapfino, Zapf Dingbats, Avant Garde/ITC Avant Garde, Neue Haas Grotesk, Aptos, Segoe Script, Cascadia Code, JetBrains Mono, Fira Code
R: Johnston/Johnston Sans, Transport, Akzidenz-Grotesk/Akzidenz Grotesk, Kabel, Peignot, Hobo, Tiempos, Guardian Egyptian, Mrs Eaves, Comic Neue, OpenDyslexic, Highway Gothic, Clearview, Calvert, Albertus, Fraktur, Cheltenham, Gotham Rounded, Sabon, Bembo, Plantin, Times Europa, Gill Sans Nova, Joanna, Souvenir, Benguiat, ITC Garamond, Goudy Old Style/Goudy, Hoefler Text, Mercury, Chronicle, Galaxie Polaris, Graphik, Circular, Gilroy, Mistral, Cochin, Fette Fraktur, Wide Latin, Broadway, Showcard Gothic, Stencil, Algerian, Harrington, Trade Gothic, News Gothic, Interstate, FF Meta/Meta, Scala, Officina, Dax, Rotis, Syntax, Lucida Sans
F: Golden Type, Jenson/Nicolas Jenson, Fell Types/Fell, Caslon Antique, Bifur, Bodoni Poster, Template Gothic, Dead History, Keedy Sans, Lo-Res, Oakland, Matrix, Westminster, MICR/E-13B, OCR-A/OCR A, OCR-B/OCR B, Data 70, Countdown, Chicago, Geneva, New York, Charcoal, Fixedsys, Terminal
X: Doves Type`,
fact:"Its co-creator threw every piece of the metal type into the Thames between 1916 and 1917. Divers recovered some of it in 2015.",
no:"Bold: That's a weight, not a typeface; Italic: That's a style, not a typeface; Serif: That's a category — name one; Sans serif/Sans-serif: That's a category — name one; Font: Name one!; Microsoft Word: That's the program"},

{id:"blue", cat:"words", q:"Name a shade of blue", a:`
C: Navy/Navy blue, Sky blue, Royal blue, Light blue, Baby blue, Turquoise, Teal, Cyan, Aqua, Dark blue
H: Cerulean, Periwinkle, Tiffany blue
O: Cobalt/Cobalt blue, Azure, Indigo, Sapphire, Ultramarine, Electric blue, Powder blue, Steel blue, Midnight blue, Denim, Duck egg/Duck egg blue, Cornflower/Cornflower blue, Ice blue, Petrol/Petrol blue, Air Force blue, Oxford blue, Cambridge blue, Egyptian blue, Persian blue, Prussian blue, Robin's egg blue/Robin egg blue, Alice blue, Dodger blue, Cadet blue, Slate blue, Delft blue, Carolina blue, Yale blue, Columbia blue, Aquamarine, Teal blue, Peacock blue, Sea blue, Ocean blue, Arctic blue, French blue, Pastel blue, Neon blue, Blue-grey/Blue grey/Blue gray, Lapis lazuli/Lapis, Celeste
R: International Klein Blue/Klein blue/IKB, Majorelle blue/Majorelle, Phthalo blue/Phthalocyanine blue, Bleu de France, Zaffre, Smalt, Woad, Han blue, Maya blue, Glaucous, Bice/Blue bice, Liberty blue, Space cadet, Pantone Classic Blue/Classic Blue, Wedgwood blue/Wedgwood, Eton blue, Uranian blue, Tufts blue, Morning blue, Bondi blue, Savoy blue, Marian blue, Byzantine blue, Duke blue, Federal blue, Polynesian blue, Picotee blue, Ruddy blue, Silver Lake blue, Stone blue, True blue
F: Caeruleum, Verditer/Blue verditer, Mazarine/Mazarine blue, Bleu celeste, Lavender blue, Medici blue, Egyptian frit, Azurite, Bremen blue, Thénard's blue/Thenard's blue, Manganese blue, Cerulean frost
X: YInMn Blue/YInMn/Mas blue`,
fact:"Discovered by accident at Oregon State University in 2009: the first new inorganic blue pigment in about 200 years.",
no:"Blue: We need a shade of it; Purple: That's another colour; Green: That's another colour; Vantablack: That's the blackest black; Mountbatten pink: A naval camouflage — and pink"},

{id:"defunct", cat:"words", q:"Name a social network or messaging app that has shut down", a:`
C: Vine, Google+/Google Plus, MSN Messenger/Windows Live Messenger/MSN, Bebo, Skype
H: Friendster, Orkut, Google Wave
O: AIM/AOL Instant Messenger, Yahoo Messenger/Yahoo! Messenger, Periscope, ICQ, Musical.ly/Musically, Google Hangouts/Hangouts, BBM/BlackBerry Messenger, Houseparty, Google Buzz, Path, Friends Reunited, Club Penguin, Yahoo Answers, StumbleUpon
R: Formspring, Meerkat, Ello, Allo/Google Allo, Secret, Windows Live Spaces/MSN Spaces, Jaiku, Miiverse, Posterous, Yahoo! 360/Yahoo 360
F: Pownce, Google Lively/Lively, Dodgeball, Glassboard, Klout
X: Ping/Apple Ping/iTunes Ping`,
fact:"Apple's music social network, built right into iTunes — launched in 2010, quietly shut down in 2012.",
no:"Myspace/MySpace: Still online, believe it or not; Twitter: Renamed X in 2023 — still running; X: Still running; Tumblr: Still going; Clubhouse: Still around; Yik Yak: Shut in 2017 but relaunched in 2021; Digg: Relaunched — still exists; LiveJournal: Still running; Habbo/Habbo Hotel: Still running; Second Life: Still going; Kik: Still running; Facebook: Very much alive; Snapchat: Still running; Threads: Still running; BeReal: Still running"},

{id:"greekgod", cat:"words", q:"Name a Greek god or goddess", a:`
C: Zeus, Poseidon, Hades, Athena/Athene, Aphrodite, Apollo, Ares, Hermes, Hera
H: Nike, Eros, Pan, Nemesis
O: Artemis, Demeter, Hephaestus, Dionysus, Hestia, Persephone, Gaia/Gaea, Kronos/Cronus/Cronos, Hecate/Hekate, Morpheus, Helios, Selene, Eos, Iris, Hypnos, Thanatos, Tyche, Hebe, Uranus/Ouranos, Rhea, Eris, Asclepius/Asklepios, Triton, Atlas, Prometheus, Oceanus, Hyperion, Themis, Mnemosyne, Leto, Heracles/Herakles, Nyx
R: Erebus, Chaos, Tartarus, Aether, Hemera, Pontus, Ananke, Chronos, Boreas, Zephyrus/Zephyr, Notus, Eurus, Aeolus, Proteus, Nereus, Thetis, Amphitrite, Enyo, Phobos, Deimos, Harmonia, Peitho, Bia, Zelus, Momus, Pheme, Hygieia, Panacea, Plutus, Priapus, Hymen/Hymenaios, Eileithyia, Metis, Tethys, Coeus, Crius, Iapetus, Phoebe, Theia, Epimetheus, Pallas, Styx, Charon, Kairos, Eunomia, Dike, Eirene, Asteria, Perses, Hesperus, Phosphorus
F: Despoina, Palaemon, Ploutos, Achlys, Algea, Geras, Oizys, Apate, Dolos, Lethe, Soteria, Aidos, Alastor, Arke, Euthenia, Hedone, Homonoia, Pothos, Himeros, Anteros, Hermaphroditus
X: Kratos`,
fact:"Yes, the God of War hero shares his name with the actual Greek god of strength — son of Styx and brother of Nike.",
no:"Jupiter: That's the Roman name — try Zeus; Neptune: That's the Roman name — try Poseidon; Mars: That's the Roman name — try Ares; Venus: That's the Roman name — try Aphrodite; Mercury: That's the Roman name — try Hermes; Minerva: That's the Roman name — try Athena; Juno: That's the Roman name — try Hera; Pluto: That's the Roman name — try Hades; Cupid: That's the Roman name — try Eros; Diana: That's the Roman name — try Artemis; Vulcan: That's the Roman name — try Hephaestus; Bacchus: That's the Roman name — try Dionysus; Hercules: That's the Roman name — try Heracles; Ceres: That's the Roman name — try Demeter; Vesta: That's the Roman name — try Hestia; Saturn: That's the Roman name — try Kronos; Odin: Wrong pantheon — he's Norse; Thor: Wrong pantheon — he's Norse; Loki: Wrong pantheon — he's Norse; Ra: Wrong pantheon — he's Egyptian; Anubis: Wrong pantheon — he's Egyptian; Medusa: A gorgon, not a goddess; Achilles: A hero, not a god; Perseus: A hero, not a god; Odysseus: A hero, not a god"},

{id:"boardgame", cat:"words", q:"Name a board game", a:`
C: Monopoly, Chess, Scrabble, Cluedo/Clue, Risk, Snakes and Ladders/Chutes and Ladders, Draughts/Checkers, Trivial Pursuit, Battleship/Battleships, Operation, Guess Who/Guess Who?, Connect Four/Connect 4
H: Catan/Settlers of Catan, Ticket to Ride, Pandemic, Go
O: Backgammon, Carcassonne, Mouse Trap/Mousetrap, Hungry Hungry Hippos/Hungry Hippos, The Game of Life/Game of Life/Life, Sorry!/Sorry, Ludo, Pictionary, Articulate, Stratego, Othello/Reversi, Mancala, Chinese checkers, Mastermind, Cranium, Axis & Allies/Axis and Allies, Diplomacy, Azul, Wingspan, Gloomhaven, Splendor, 7 Wonders/Seven Wonders, Dixit, Agricola, Puerto Rico, Power Grid, Small World, King of Tokyo, Terraforming Mars, Scythe, Twilight Imperium, Arkham Horror, Betrayal at House on the Hill, HeroQuest, Blood Bowl, Mahjong/Mahjongg, Scotland Yard, Labyrinth, Blokus, Carrom, Parcheesi, Rummikub, Trouble, Downfall, Frustration, Escape from Colditz
R: Shogi, Xiangqi/Chinese chess, Nine Men's Morris, Hnefatafl, Pachisi, Halma, Crokinole, Tigris & Euphrates/Tigris and Euphrates, El Grande, Brass, Twilight Struggle, Spirit Island, Root, Everdell, Cascadia, Patchwork, Mysterium, Survive, Kingmaker, Buccaneer, Hotels, Quarto, Abalone, Pente, Mr. Jack/Mr Jack, Hive, Santorini, Dominion, Concordia, Caylus, Le Havre, Through the Ages, Great Western Trail, Brass: Birmingham, Ark Nova, Dune: Imperium, Lords of Waterdeep, Eldritch Horror, Mansions of Madness, Talisman, Fireball Island, Dark Tower, Crossbows and Catapults, Go for Broke, Fox and Geese, Alquerque, Fanorona
F: Senet, Royal Game of Ur/Game of Ur/Ur, Mehen, Hounds and Jackals, Patolli, Latrunculi, Ludus latrunculorum, Petteia, Tablut, Shatranj, Chaturanga, Konane, Bao, Oware, Surakarta, Dou shou qi/Jungle, Chaupar, Pallanguzhi
X: The Landlord's Game/Landlord's Game/Landlords Game`,
fact:"Lizzie Magie's 1904 game, designed to show the evils of monopolies. It was later reworked into Monopoly.",
no:"Uno: That's a card game; Cards Against Humanity: That's a card game; Exploding Kittens: That's a card game; Poker: That's a card game; Jenga: No board — it's a stacking game; Twister: That's a mat, not a board; Dungeons & Dragons/Dungeons and Dragons/D&D: A role-playing game; Dominoes: Tiles, but no board; Boggle: A word game with no board; Yahtzee: A dice game; Codenames: A card game; Werewolf: A party game; Mafia: A party game"},

{id:"proglang", cat:"words", q:"Name a programming language", a:`
C: Python, Java, JavaScript/JS, C, C++, C#/C sharp, PHP, Ruby, SQL
H: Rust, Go/Golang, COBOL, Fortran
O: Swift, Kotlin, TypeScript/TS, Perl, R, MATLAB, Scala, Haskell, Lua, Dart, Objective-C/Obj-C, Assembly/Assembly language, Visual Basic/VB/VBA, BASIC, Pascal, Lisp, Prolog, Julia, Elixir, Erlang, Clojure, F#/F sharp, Groovy, Bash/Shell, PowerShell, Delphi, Ada, Scratch, Solidity, Zig, Elm, OCaml, Smalltalk, Logo, Racket, Scheme, Crystal, Nim, Mojo, Gleam, Common Lisp, Visual Basic .NET/VB.NET, Apex, ABAP, PL-SQL/PLSQL, Tcl, AWK, VHDL, Verilog, CUDA, GLSL, HLSL, WebAssembly/Wasm, AppleScript, ActionScript, CoffeeScript, GDScript, Arduino, LabVIEW, SAS, Stata
R: Simula, ALGOL, APL, Forth, Odin, Carbon, V, Hack, J, K, Q, Raku/Perl 6, Modula-2, Oberon, PL-I/PL1, RPG, MUMPS, BCPL, B, Eiffel, Idris, Agda, Coq/Rocq, Lean, PureScript, ReasonML/Reason, Dylan, Self, Io, Factor, Red, Rebol, Ballerina, Chapel, Pony, Haxe, Vala, D, Fantom, Ceylon, Xojo, AutoHotkey, Squirrel, Wren, Janet, Hy, Ring, Bosque, Unison, Koka, Roc, Grain, Vale, Hare, Jai, Mercury, Curry, Clean, Miranda, ML/Standard ML, Joy, Snobol/SNOBOL, Icon, REXX, JCL, Turing, Occam
F: Brainf*ck/Brainfuck/BF, Whitespace, INTERCAL, Malbolge, Befunge, Piet, LOLCODE, Shakespeare, Chef, Ook!, Rockstar, ArnoldC, Emojicode, Chicken, Unlambda, FALSE, FlowMatic/FLOW-MATIC, Short Code, Autocode, IPL, COMTRAN, JOVIAL, Speedcoding, A-0
X: Plankalkül/Plankalkul`,
fact:"Designed by Konrad Zuse in the 1940s — arguably the first high-level programming language. It wasn't implemented until 1998.",
no:"HTML: A markup language — the internet has argued about this enough; CSS: A style sheet language — not quite; Markdown: A formatting syntax; JSON: A data format; XML: A markup language; YAML: A data format; Excel: That's a spreadsheet (even if it is Turing-complete now); Regex: A pattern syntax, not a language (sort of); LaTeX: A typesetting system — debatable, but no"},

/* ───────── HIGH SEAS ───────── */
{id:"seacreature", cat:"sea", q:"Name a sea creature", a:`
C: Shark, Whale, Dolphin, Octopus, Jellyfish, Crab, Lobster, Starfish/Sea star, Seal, Sea turtle/Turtle, Squid, Clownfish
H: Blobfish, Narwhal, Anglerfish, Mantis shrimp
O: Orca/Killer whale, Manta ray/Manta, Stingray/Ray, Sea urchin/Urchin, Seahorse/Sea horse, Sea lion, Walrus, Moray eel/Eel, Barracuda, Swordfish, Tuna, Cod, Hammerhead shark/Hammerhead, Great white shark/Great white, Whale shark, Blue whale, Humpback whale/Humpback, Sperm whale, Beluga, Pufferfish/Puffer fish, Lionfish, Coral, Sea anemone/Anemone, Sea cucumber, Shrimp/Prawn, Oyster, Mussel, Clam, Scallop, Cuttlefish, Nautilus, Hermit crab, Krill, Plankton, Sardine, Herring, Mackerel, Marlin, Sunfish/Ocean sunfish/Mola mola, Flounder, Halibut, Sea otter, Dugong, Manatee, Penguin, Leopard seal, Elephant seal, Portuguese man o' war/Man o war, Blue tang, Sea sponge/Sponge, Plaice, Haddock, Anchovy, Sea bass, Bottlenose dolphin, Tiger shark, Bull shark, Sea snail, Barnacle
R: Giant squid, Colossal squid, Vampire squid, Goblin shark, Frilled shark, Gulper eel, Oarfish, Sea pig, Siphonophore, Sea butterfly, Dumbo octopus, Blue-ringed octopus, Mimic octopus, Coelacanth, Hagfish, Lamprey, Viperfish, Fangtooth, Barreleye, Nudibranch/Sea slug, Sea spider, Box jellyfish, Irukandji, Lion's mane jellyfish, Sea angel, Sea snake, Cookiecutter shark, Megamouth shark, Basking shark, Greenland shark, Wobbegong, Remora, Triggerfish, Parrotfish, Moorish idol, Wrasse, Grouper, Giant isopod, Yeti crab, Giant tube worm/Tube worm, Bobbit worm, Christmas tree worm, Feather star, Brittle star, Sand dollar, Sea lily/Crinoid, Salp, Comb jelly/Ctenophore, Japanese spider crab, Horseshoe crab, Sea dragon/Leafy seadragon/Weedy seadragon, Frogfish, Pipefish, Ribbon eel, Napoleon wrasse/Humphead wrasse, Mahi-mahi/Dorado, Wahoo, Cownose ray, Electric ray/Torpedo ray, Sawfish, Guitarfish, Thresher shark, Mako shark, Pilot whale, Minke whale, Bowhead whale, Right whale, Fin whale, Vaquita
F: Pyrosome, Stoplight loosejaw, Black swallower, Pelican eel, Telescope octopus, Glass squid, Sea toad, Chimaera/Ghost shark/Ratfish, Bone-eating worm/Osedax/Zombie worm, Pompeii worm, Scaly-foot snail, Sixgill shark, Bigfin squid, Ping-pong tree sponge, Hairy angler, Barrel sponge, Dragonfish, Hatchetfish, Lanternfish, Tripod fish, Faceless cusk, Cusk eel, Snipe eel
X: Sarcastic fringehead`,
fact:"A small fish that settles arguments with mouth-to-mouth wrestling matches, flaring a mouth far bigger than its head.",
no:"Kraken: Nice try. The kraken doesn't count... yet; Mermaid: Fictional, sadly; Nemo: Name the species — he's a clownfish; Dory: Name the species — she's a blue tang; SpongeBob/Spongebob: Name the species — he's a sea sponge; Piranha: Freshwater; Goldfish: Freshwater; Hippo/Hippopotamus: Rivers, not the sea; Seagull/Gull: Lives by the sea, steals chips, doesn't count; Fish: Too general — name one; Loch Ness Monster/Nessie: A lake, and probably not real; Megalodon: Extinct for millions of years"},

{id:"pirate", cat:"sea", ppl:1, q:"Name a pirate, real or fictional", a:`
C: Blackbeard/Edward Teach, Captain Jack Sparrow/Jack Sparrow/Sparrow, Captain Hook/Hook/James Hook, Long John Silver
H: Anne Bonny, Captain Kidd/William Kidd/Kidd, Hector Barbossa/Barbossa/Captain Barbossa, Davy Jones
O: Calico Jack/Jack Rackham, Mary Read, Henry Morgan/Captain Morgan, Bartholomew Roberts/Black Bart, Sir Francis Drake/Francis Drake/Drake, Monkey D. Luffy/Luffy, Captain Pugwash/Pugwash, Guybrush Threepwood/Guybrush, LeChuck, Mr. Smee/Smee, Will Turner, Elizabeth Swann, Gol D. Roger/Gold Roger, Grace O'Malley/Gráinne Mhaol/Granuaile, Henry Every/Henry Avery, Stede Bonnet, Black Sam Bellamy/Sam Bellamy, Jean Lafitte, Captain Flint/Flint, Billy Bones, Dread Pirate Roberts, Edward Kenway, Captain Feathersword, Red Beard/Redbeard, The Pirate King, Roronoa Zoro/Zoro, Shanks, Whitebeard
R: Hayreddin Barbarossa/Barbarossa, Oruç Reis/Oruc Reis, Charles Vane, Edward Low/Ned Low, Thomas Tew, François l'Olonnais/L'Olonnais/Francois l Olonnais, Anne Dieu-le-Veut, Jacquotte Delahaye, Benjamin Hornigold, Zheng Yi, Rachel Wall, Sadie the Goat, Nami, Sanji, Boa Hancock, Marshall D. Teach, Captain Blood/Peter Blood, Captain Crook, Pirate Pete, Captain Red, Anne Providence
F: Klaus Störtebeker/Klaus Stortebeker/Störtebeker/Stortebeker, Eustace the Monk, Sayyida al Hurra, Jeanne de Clisson, Murat Reis, Turgut Reis, Peter Easton, Henry Jennings, Olivier Levasseur/La Buse, Bartholomew Sharp, Laurens de Graaf, Roche Braziliano, Black Caesar, Hippolyte Bouchard, Samuel Burgess, Christopher Condent, Howell Davis, Paulsgrave Williams, Ann Mills, Charlotte de Berry
X: Ching Shih/Zheng Yi Sao/Cheng I Sao/Madame Ching`,
fact:"Commanded a pirate fleet of over 1,500 ships in the early 1800s, then retired undefeated and kept her fortune.",
no:"Captain Haddock/Haddock: A sea captain, not a pirate; Captain Birdseye/Captain Birds Eye: Fish fingers, not plunder; Popeye: A sailor, not a pirate; Moana: A wayfinder, not a pirate; Captain Nemo/Nemo: A submarine captain, not quite a pirate; Captain America: Wrong kind of captain; Captain Cook/James Cook: An explorer, not a pirate; Christopher Columbus/Columbus: An explorer, not a pirate; Captain Ahab/Ahab: A whaler, not a pirate; Captain Phillips: The captain who was attacked by pirates; Captain Barnacles: An Octonaut, not a pirate; Cutler Beckett/Lord Beckett: He hunted pirates"},

{id:"seas", cat:"sea", strip:["sea","ocean","the","of"], q:"Name a sea or ocean", a:`
C: Pacific Ocean, Atlantic Ocean, Indian Ocean, Arctic Ocean, Southern Ocean/Antarctic Ocean, Mediterranean Sea, Caribbean Sea, North Sea, Red Sea, Black Sea
H: Baltic Sea, Irish Sea
O: Aegean Sea, Adriatic Sea, Arabian Sea, Bering Sea, Coral Sea, Tasman Sea, Yellow Sea, East China Sea, South China Sea, Sea of Japan/East Sea, Barents Sea, Norwegian Sea, Celtic Sea, Ionian Sea, Tyrrhenian Sea, Philippine Sea, Java Sea, Andaman Sea, Weddell Sea, Ross Sea, Labrador Sea, Beaufort Sea, Greenland Sea, Sea of Okhotsk, Sea of Marmara, Sea of Azov, White Sea, Ligurian Sea
R: Kara Sea, Laptev Sea, Chukchi Sea, East Siberian Sea, Alboran Sea, Balearic Sea, Wadden Sea, Bismarck Sea, Solomon Sea, Timor Sea, Arafura Sea, Banda Sea, Celebes Sea/Sulawesi Sea, Sulu Sea, Molucca Sea, Flores Sea, Scotia Sea, Amundsen Sea, Bellingshausen Sea, Salish Sea, Irminger Sea, Lincoln Sea, Sea of Crete, Levantine Sea, Libyan Sea, Thracian Sea, Sea of the Hebrides
F: Halmahera Sea, Seram Sea/Ceram Sea, Savu Sea, Bali Sea, Davis Sea, Cosmonauts Sea, Lazarev Sea, Riiser-Larsen Sea, Mawson Sea, Dumont d'Urville Sea, Somov Sea, King Haakon VII Sea, Myrtoan Sea, Cilician Sea, Wandel Sea, Pechora Sea
X: Sargasso Sea`,
fact:"The only sea with no coastline at all: it's bounded entirely by ocean currents in the middle of the Atlantic.",
no:"Dead Sea: Despite the name, it's a landlocked salt lake; Caspian Sea: Technically the world's largest lake; Sea of Galilee: A freshwater lake; Aral Sea: A (shrinking) lake; Salton Sea: A lake in California; Gulf of Mexico/Gulf of America: A gulf — close, but no; Hudson Bay: A bay — close, but no; English Channel: A channel — close, but no; Bay of Biscay: A bay — close, but no; Persian Gulf/Arabian Gulf: A gulf — close, but no; Seven Seas: Name one!; Sea of Tranquility: That's on the Moon"},
];
