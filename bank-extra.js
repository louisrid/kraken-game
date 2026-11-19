/* Additional authored prompts. Groups run from familiar answers to specialist picks. */
(() => {
  const topics = [
    ['dessert','food','Name a dessert', ['Ice cream, Cake, Brownie, Cheesecake','Apple pie, Tiramisu, Crème brûlée/Creme brulee','Pavlova, Baklava, Profiterole','Panna cotta, Eton mess, Trifle','Knafeh/Kunafa, Kulfi, Basbousa','Serradura']],
    ['soup','food','Name a soup', ['Tomato soup/Tomato, Chicken soup/Chicken, Mushroom soup/Mushroom','Minestrone, French onion soup/French onion, Pumpkin soup/Pumpkin','Gazpacho, Miso soup/Miso, Chowder/Clam chowder','Borscht, Tom yum, Laksa','Avgolemono, Cullen skink, Harira','Khash']],
    ['sauce','food','Name a sauce or condiment', ['Ketchup, Mayonnaise/Mayo, Mustard, Soy sauce','Barbecue sauce/BBQ sauce, Pesto, Gravy','Hollandaise, Béarnaise/Bearnaise, Sriracha','Chimichurri, Romesco, Sambal','Tkemali, Zhoug/Zhug, Chermoula','Toum']],
    ['nuts','food','Name an edible nut or seed', ['Peanut, Almond, Cashew, Sunflower seed','Walnut, Pistachio, Pumpkin seed','Hazelnut, Pecan, Sesame','Macadamia, Brazil nut, Chia','Hemp seed, Poppy seed, Pine nut','Pili nut/Pili']],
    ['tea','food','Name a type of tea or herbal infusion', ['Green tea, Black tea, Peppermint, Earl Grey','Chamomile/Camomile, English breakfast, Matcha','Oolong, Rooibos, Jasmine tea/Jasmine','Pu-erh/Puerh, Darjeeling, Lapsang souchong','Genmaicha, Hojicha, Silver needle','Kukicha']],
    ['coffee','food','Name a coffee drink', ['Latte, Cappuccino, Espresso, Americano','Flat white, Mocha, Iced coffee','Macchiato, Cortado, Cold brew','Affogato, Ristretto, Lungo','Galao/Galão, Bicerin, Mazagran','Einspänner/Einspanner']],
    ['baked','food','Name a pastry or sweet baked good', ['Croissant, Doughnut/Donut, Muffin, Cookie','Danish, Éclair/Eclair, Cinnamon roll','Pain au chocolat, Choux bun, Strudel','Kouign-amann, Cannoli, Pastel de nata','Sfogliatella, Ensaimada, Kolaczki','Gibassier']],
    ['mushroom','sci','Name a kind of mushroom', ['Button mushroom/Button, Shiitake, Oyster mushroom/Oyster','Portobello/Portabella, Chestnut mushroom, Enoki','Porcini, Chanterelle, Morel','Lion’s mane/Lions mane, Maitake, Shimeji','Hedgehog mushroom, Chicken of the woods, Wood ear','Caesar’s mushroom/Caesars mushroom']],
    ['reptile','sci','Name a reptile', ['Snake, Crocodile, Lizard, Turtle','Alligator, Tortoise, Gecko','Iguana, Chameleon, Komodo dragon','Tuatara, Gila monster, Slow worm','Thorny devil, Basilisk, Gharial','Mary River turtle']],
    ['insect','sci','Name an insect', ['Ant, Bee, Butterfly, Fly','Wasp, Beetle, Mosquito','Dragonfly, Grasshopper, Ladybird/Ladybug','Lacewing, Earwig, Silverfish','Caddisfly, Stonefly, Antlion','Zorapteran/Angel insect']],
    ['tree','sci','Name a type of tree', ['Oak, Pine, Birch, Willow','Maple, Beech, Elm','Ash, Cedar, Sycamore','Ginkgo, Baobab, Sequoia','Wollemi pine, Kauri, Monkey puzzle','Dragon blood tree']],
    ['flower','sci','Name a flowering plant', ['Rose, Tulip, Daisy, Sunflower','Lily, Daffodil, Orchid','Peony, Hydrangea, Lavender','Foxglove, Delphinium, Wisteria','Fritillary, Hellebore, Nerine','Jade vine']],
    ['rock','sci','Name a rock or mineral', ['Granite, Diamond, Quartz, Marble','Slate, Sandstone, Limestone','Obsidian, Basalt, Amethyst','Gneiss, Schist, Malachite','Labradorite, Rhodochrosite, Serpentine','Charoite']],
    ['cloud','sci','Name a cloud type', ['Cumulus, Stratus, Cirrus','Cumulonimbus, Nimbostratus, Altocumulus','Cirrostratus, Stratocumulus, Altostratus','Cirrocumulus, Lenticular cloud/Lenticular, Mammatus','Noctilucent cloud/Noctilucent, Asperitas, Pileus','Fluctus/Kelvin-Helmholtz cloud']],
    ['organ','sci','Name an organ in the human body', ['Heart, Brain, Lung/Lungs, Liver','Kidney/Kidneys, Stomach, Skin','Pancreas, Spleen, Bladder','Thyroid, Gallbladder, Thymus','Pituitary gland/Pituitary, Adrenal gland, Pineal gland','Parathyroid gland/Parathyroid']],
    ['moon','sci','Name a moon in our Solar System', ['Moon/The Moon/Luna, Titan, Europa','Ganymede, Io, Callisto','Enceladus, Triton, Phobos','Deimos, Rhea, Iapetus','Miranda, Oberon, Dione','Halimede']],
    ['river','geo','Name a river', ['Nile, Amazon, Thames, Mississippi','Seine, Danube, Ganges','Mekong, Rhine, Yangtze','Zambezi, Orinoco, Volga','Lena, Irrawaddy, Amu Darya','Onyx River/Onyx']],
    ['mountain','geo','Name a mountain', ['Everest/Mount Everest, Kilimanjaro, K2','Fuji/Mount Fuji, Ben Nevis, Mont Blanc','Denali, Aconcagua, Matterhorn','Annapurna, Elbrus, Kangchenjunga','Vinson Massif/Vinson, Nanga Parbat, Dhaulagiri','Gangkhar Puensum']],
    ['desert','geo','Name a desert', ['Sahara, Gobi, Kalahari','Atacama, Arabian Desert/Arabian, Mojave','Namib, Sonoran, Thar','Great Victoria Desert/Great Victoria, Taklamakan, Simpson','Dasht-e Lut/Lut, Karakum, Kyzylkum','Błędów Desert/Bledow']],
    ['currency','geo','Name a currency', ['Dollar/US dollar, Euro, Pound sterling/Pound, Yen','Rupee, Yuan/Renminbi, Peso','Swiss franc/Franc, Baht, Won','Zloty, Forint, Ringgit','Lari, Lempira, Quetzal','Ariary']],
    ['language','words','Name a spoken language', ['English, Spanish, French, Chinese/Mandarin','German, Japanese, Arabic','Swahili, Hindi, Portuguese','Welsh, Basque, Icelandic','Xhosa, Quechua, Guarani','Rotokas']],
    ['mythical','words','Name a mythical creature', ['Dragon, Unicorn, Mermaid, Vampire','Werewolf, Phoenix, Griffin/Gryphon','Centaur, Minotaur, Pegasus','Basilisk, Manticore, Kelpie','Nuckelavee, Bunyip, Tikbalang','Ahuizotl']],
    ['egypt','words','Name an ancient Egyptian god or goddess', ['Ra/Re, Anubis, Isis','Osiris, Horus, Bastet','Set/Seth, Thoth, Hathor','Sekhmet, Sobek, Anuket','Nephthys, Khnum, Ptah','Renenutet']],
    ['norse','words','Name a figure from Norse mythology', ['Thor, Odin, Loki','Freya/Freyja, Hel, Fenrir','Tyr, Baldr/Baldur, Heimdall','Skadi, Njord, Jormungandr','Idun/Idunn, Sif, Nanna','Ratatoskr']],
    ['artmedia','words','Name an art material or technique', ['Pencil, Paint, Watercolour/Watercolor, Charcoal','Acrylic, Oil paint, Pastel','Gouache, Etching, Screen printing','Linocut, Drypoint, Encaustic','Mezzotint, Sgraffito, Cyanotype','Cliché verre/Cliche verre']],
    ['dance','music','Name a dance style', ['Ballet, Hip hop, Salsa, Tap','Tango, Waltz, Breakdance/Breaking','Foxtrot, Samba, Flamenco','Lindy hop, Kathak, Capoeira','Kizomba, Bharatanatyam, Gwara gwara','Zaouli']],
    ['percussion','music','Name a percussion instrument', ['Drum/Drums, Tambourine, Triangle, Cymbal','Bongo/Bongos, Xylophone, Maraca/Maracas','Glockenspiel, Timpani, Conga','Cajón/Cajon, Djembe, Vibraphone','Bodhrán/Bodhran, Udu, Berimbau','Flexatone']],
    ['bowed','music','Name a string instrument', ['Guitar, Violin, Cello, Harp','Bass guitar/Bass, Ukulele, Banjo','Viola, Mandolin, Double bass','Sitar, Lute, Erhu','Kora, Nyckelharpa, Sarangi','Morin khuur']],
    ['racket','sport','Name a sport at the Summer Olympics (past or present)', ['Swimming, Athletics, Gymnastics, Football/Soccer','Basketball, Tennis, Boxing','Fencing, Archery, Rowing','Breaking, Skateboarding, Sport climbing','Tug of war, Croquet, Basque pelota','Jeu de paume']],
    ['winter','sport','Name a Winter Olympic sport or discipline', ['Ice hockey, Figure skating, Curling','Bobsleigh/Bobsled, Ski jumping, Snowboarding','Luge, Skeleton, Biathlon','Nordic combined, Short track/Short-track speed skating, Ski cross','Ski mountaineering, Moguls, Aerials','Military patrol']],
    ['chess','games','Name a chess term', ['Check, Checkmate, Pawn, King','Castling, Stalemate, En passant','Fork, Pin, Skewer','Zugzwang, Fianchetto, Gambit','Zwischenzug, Underpromotion, Opposition','Smothered mate']],
    ['cardgame','games','Name a card game', ['Poker, Blackjack, Uno, Solitaire','Bridge, Snap, Rummy','Cribbage, Hearts, Spades','Canasta, Euchre, Pinochle','Durak, Skat, Scopa','Schafkopf']],
    ['zelda','games','Name a character from The Legend of Zelda', ['Link, Zelda, Ganondorf/Ganon','Epona, Navi, Tingle','Midna, Impa, Sidon','Mipha, Revali, Urbosa','Groose, Ravio, Fi','Beedle']],
    ['mariocharacter','games','Name a Mario character', ['Mario, Luigi, Peach, Bowser','Yoshi, Toad, Wario','Waluigi, Rosalina, Daisy','Birdo, Kamek, Bowser Jr./Bowser Junior','Nabbit, Pauline, Toadette','Dimentio']],
    ['spongebob','screen','Name a SpongeBob SquarePants character', ['SpongeBob/SpongeBob SquarePants, Patrick/Patrick Star, Squidward','Mr. Krabs/Mr Krabs, Sandy/Sandy Cheeks, Plankton','Gary, Pearl, Mrs. Puff/Mrs Puff','Karen, Larry the Lobster/Larry, Mermaid Man','Barnacle Boy, Flying Dutchman, Bubble Bass','Fred']],
    ['avatar','screen','Name a character from Avatar: The Last Airbender', ['Aang, Katara, Sokka, Zuko','Toph, Iroh, Azula','Appa, Momo, Suki','Ty Lee, Mai, Ozai','Bumi, Jet, Yue','Long Feng']],
    ['ship','sea','Name a type of boat or ship', ['Yacht, Ferry, Submarine, Canoe','Kayak, Dinghy, Cruise ship','Galleon, Schooner, Frigate','Catamaran, Brigantine, Caravel','Felucca, Dhow, Coracle','Knarr']],
    ['nautical','sea','Name a part of a sailing ship', ['Sail, Mast, Deck, Anchor','Rudder, Keel, Bow','Stern, Boom, Rigging','Bowsprit, Gunwale, Capstan','Binnacle, Ratlines, Taffrail','Dolphin striker']],
    ['clothes','brands','Name a clothing or footwear brand', ['Nike, Adidas, Gucci, Zara','Puma, H&M/H and M, Levi’s/Levis','Patagonia, Uniqlo, New Balance','Carhartt, Arc’teryx/Arcteryx, Veja','Acronym, Story mfg./Story mfg, Kapital','Bode']],
    ['stationery','words','Name an item of stationery', ['Pen, Pencil, Paper, Eraser/Rubber','Ruler, Stapler, Notebook','Highlighter, Protractor, Compass','Correction tape, Binder clip, Fountain pen','Bone folder, Awl, French curve','Pounce wheel']],
    ['breakfast','food','Name a breakfast food', ['Toast, Cereal, Porridge, Pancakes','Waffles, Scrambled eggs, Granola','French toast, Muesli, Hash browns, Bagel, Omelette','Kedgeree, Shakshuka, Congee, Chilaquiles','Ful medames, Idli, Upma','Changua']],
    ['berry','food','Name a culinary berry', ['Strawberry, Raspberry, Blueberry, Blackberry','Cranberry, Gooseberry, Blackcurrant','Redcurrant, Mulberry, Elderberry, Boysenberry, Loganberry','Cloudberry, Lingonberry, Huckleberry, Tayberry','Salmonberry, Wineberry, Marionberry','Jostaberry']],
    ['apple','food','Name an apple variety', ['Granny Smith, Pink Lady, Gala, Golden Delicious','Braeburn, Fuji, Bramley','Honeycrisp, Cox’s Orange Pippin/Cox, Red Delicious, Jazz, Jonagold','Egremont Russet, Worcester Pearmain, Discovery, McIntosh','Ashmead’s Kernel, D’Arcy Spice, Cornish Gilliflower','Court Pendu Plat']],
    ['sandwich','food','Name a sandwich or filled roll', ['BLT, Cheese sandwich, Ham sandwich, Tuna sandwich','Club sandwich, Grilled cheese, Bacon sandwich','Reuben, Croque monsieur, Bánh mì/Banh mi, Meatball sub, Philly cheesesteak','Muffuletta, Cubano, Po’ boy/Po boy, Chivito','Francesinha, Vada pav, Gatsby','Bocadillo de calamares']],
    ['salad','food','Name a salad', ['Caesar salad/Caesar, Greek salad/Greek, Potato salad, Coleslaw','Waldorf salad/Waldorf, Pasta salad, Fruit salad','Niçoise salad/Nicoise, Cobb salad/Cobb, Caprese, Tabbouleh, Fattoush','Panzanella, Gado-gado/Gado gado, Som tam, Olivier salad','Shopska salad, Kachumber, Solterito','Yam wun sen']],
    ['dumpling','food','Name a type of dumpling', ['Gyoza, Wonton, Pierogi, Ravioli','Momo, Baozi, Tortellini','Shumai/Siu mai, Jiaozi, Mandu, Khinkali, Pelmeni','Manti, Har gow, Knödel/Knodel, Varenyky','Kreplach, Shish barak, Buuz','Chuchvara']],
    ['mocktail','food','Name a non-alcoholic drink', ['Water, Orange juice, Lemonade, Cola','Ginger beer, Milkshake, Iced tea','Horchata, Lassi, Kombucha, Root beer, Shirley Temple','Ayran, Tepache, Tamarind juice, Agua de jamaica','Chicha morada, Sahlab, Boza','Borhani']],
    ['legume','food','Name an edible bean, pea or lentil', ['Baked bean/Haricot bean/Navy bean, Chickpea, Kidney bean, Garden pea','Black bean, Red lentil, Broad bean/Fava bean','Butter bean/Lima bean, Pinto bean, Mung bean, Green lentil, Soybean/Soya bean','Adzuki bean, Black-eyed pea/Black eyed pea, Puy lentil, Split pea','Borlotti bean, Pigeon pea, Lupin bean','Bambara groundnut']],
    ['fishdish','food','Name a seafood dish', ['Fish and chips, Sushi, Prawn cocktail, Fish pie','Paella, Calamari, Moules marinières/Moules marinieres','Ceviche, Kedgeree, Crab cakes, Lobster roll, Bouillabaisse','Cullen skink, Zarzuela, Moqueca, Cioppino','Kinilaw, Chupe de camarones, Fideuà/Fideua','Hokke no hiraki']],
    ['cake','food','Name a type of cake', ['Chocolate cake, Carrot cake, Cheesecake, Victoria sponge','Red velvet cake, Black Forest gateau/Black Forest cake, Coffee cake','Battenberg, Madeira cake, Lemon drizzle cake, Angel food cake, Opera cake','Dobos torte, Prinsesstårta/Princess cake, Baumkuchen, Sachertorte','Kransekake, Spekkoek, Medovik','Šakotis/Sakotis']],
    ['africountry','geo','Name a country in Africa', ['Egypt, South Africa, Kenya, Nigeria','Morocco, Ghana, Tunisia','Algeria, Ethiopia, Tanzania, Uganda, Senegal','Benin, Togo, Lesotho, Eritrea','Comoros, Djibouti, São Tomé and Príncipe/Sao Tome and Principe','Eswatini/Swaziland']],
    ['asiacountry','geo','Name a country in Asia', ['China, India, Japan, Thailand','Vietnam, South Korea, Indonesia','Malaysia, Singapore, Mongolia, Nepal, Sri Lanka','Bhutan, Laos, Cambodia, Myanmar','Kyrgyzstan, Tajikistan, Timor-Leste/East Timor','Brunei']],
    ['usstate','geo','Name a US state', ['California, Texas, Florida, New York','Alaska, Hawaii, Nevada','Ohio, Colorado, Georgia, Arizona, Washington','Vermont, Maine, Oregon, Wisconsin','Delaware, Rhode Island, New Hampshire','North Dakota']],
    ['ukcounty','geo','Name a ceremonial county of England', ['Cornwall, Devon, Kent, Essex','Surrey, Norfolk, Suffolk','Dorset, Somerset, Hampshire, Lancashire, Cumbria','Rutland, Herefordshire, Worcestershire, Shropshire','Bedfordshire, East Riding of Yorkshire, Bristol','City of London']],
    ['eurocapital','geo','Name a European capital city', ['London, Paris, Rome, Berlin','Madrid, Athens, Amsterdam','Lisbon, Vienna, Prague, Warsaw, Dublin','Ljubljana, Bratislava, Tallinn, Vilnius','Vaduz, San Marino, Andorra la Vella','Podgorica']],
    ['landmark','geo','Name a human-made world landmark', ['Eiffel Tower, Great Wall of China, Taj Mahal, Statue of Liberty','Colosseum, Big Ben, Sydney Opera House','Machu Picchu, Petra, Angkor Wat, Stonehenge, Sagrada Família/Sagrada Familia','Borobudur, Moai, Chichén Itzá/Chichen Itza, Alhambra','Great Mosque of Djenné/Great Mosque of Djenne, Rani ki Vav, Nan Madol','Minaret of Jam']],
    ['waterfall','geo','Name a waterfall', ['Niagara Falls/Niagara, Victoria Falls, Angel Falls, Iguazu Falls/Iguassu Falls','Yosemite Falls, Gullfoss, Rhine Falls','Dettifoss, Skógafoss/Skogafoss, Seljalandsfoss, Kaieteur Falls, Tugela Falls','Jog Falls, Sutherland Falls, Multnomah Falls, Gocta Falls','Nohkalikai Falls, Plitvice Waterfalls, Shoshone Falls','Vinnufossen']],
    ['lake','geo','Name a lake', ['Lake Superior, Lake Victoria, Loch Ness, Lake Michigan','Lake Baikal, Lake Titicaca, Lake Geneva','Lake Como, Lake Garda, Lake Erie, Lake Huron, Lake Ontario','Lake Tanganyika, Lake Malawi, Lake Bled, Lake Tahoe','Lake Balkhash, Lake Peipus, Lake Van','Lake Assal']],
    ['volcano','geo','Name a volcano', ['Vesuvius/Mount Vesuvius, Etna/Mount Etna, Fuji/Mount Fuji, Mount St Helens/Mount Saint Helens','Krakatoa/Krakatau, Kilauea, Mauna Loa','Eyjafjallajökull/Eyjafjallajokull, Pinatubo, Stromboli, Cotopaxi, Popocatépetl/Popocatepetl','Sakurajima, Merapi, Nyiragongo, Teide','Ol Doinyo Lengai, Erta Ale, Villarrica','Beerenberg']],
    ['bridge','geo','Name a famous bridge', ['Golden Gate Bridge, Tower Bridge, Brooklyn Bridge, Sydney Harbour Bridge','London Bridge, Forth Bridge, Rialto Bridge','Ponte Vecchio, Charles Bridge, Millau Viaduct, Akashi Kaikyo Bridge, Clifton Suspension Bridge','Øresund Bridge/Oresund Bridge, Vasco da Gama Bridge, Stari Most, Helix Bridge','Khaju Bridge, Si-o-se-pol/Si o se pol, Puente Nuevo','Pont du Gard']],
    ['sharks','sci','Name a shark species or recognised shark group', ['Great white shark/Great white, Hammerhead shark/Hammerhead, Tiger shark, Whale shark','Bull shark, Basking shark, Nurse shark','Blue shark, Lemon shark, Mako shark/Mako, Thresher shark, Blacktip reef shark','Greenland shark, Goblin shark, Frilled shark, Megamouth shark','Cookiecutter shark, Epaulette shark, Port Jackson shark','Viper dogfish']],
    ['whale','sci','Name a whale, dolphin or porpoise', ['Blue whale, Humpback whale, Orca/Killer whale, Bottlenose dolphin','Sperm whale, Beluga, Narwhal','Minke whale, Fin whale, Grey whale/Gray whale, Common dolphin, Harbour porpoise/Harbor porpoise','Bowhead whale, Sei whale, Risso’s dolphin/Rissos dolphin, Pilot whale','Vaquita, Franciscana, Irrawaddy dolphin','Omura’s whale/Omuras whale']],
    ['penguin','sci','Name a penguin species', ['Emperor penguin/Emperor, King penguin/King, Adélie penguin/Adelie, Rockhopper penguin/Rockhopper','Gentoo penguin/Gentoo, Chinstrap penguin/Chinstrap, Macaroni penguin/Macaroni','Little penguin/Little blue penguin/Fairy penguin, African penguin/African, Humboldt penguin/Humboldt, Magellanic penguin/Magellanic','Galápagos penguin/Galapagos, Yellow-eyed penguin/Yellow eyed penguin, Royal penguin/Royal','Fiordland penguin/Fiordland, Snares penguin/Snares, Erect-crested penguin/Erect crested penguin','Northern rockhopper penguin/Northern rockhopper']],
    ['raptor','sci','Name a bird of prey', ['Eagle, Hawk, Falcon, Owl','Kestrel, Peregrine falcon/Peregrine, Buzzard','Osprey, Red kite, Barn owl, Golden eagle, Bald eagle','Secretarybird/Secretary bird, Goshawk, Harrier, Condor','Bateleur, Lammergeier/Bearded vulture, Caracara','Philippine eagle']],
    ['marsupial','sci','Name a marsupial', ['Kangaroo, Koala, Wombat, Wallaby','Tasmanian devil, Opossum, Quokka','Sugar glider, Bandicoot, Bilby, Quoll, Numbat','Pademelon, Bettong, Cuscus, Tree kangaroo','Dunnart, Planigale, Antechinus','Monito del monte']],
    ['bones','sci','Name a human bone or bone group', ['Skull, Femur, Rib, Spine/Vertebral column','Tibia, Fibula, Humerus','Radius, Ulna, Clavicle/Collarbone, Scapula/Shoulder blade, Patella/Kneecap','Sternum/Breastbone, Mandible/Jawbone, Sacrum, Coccyx/Tailbone','Hyoid, Vomer, Ethmoid','Pisiform']],
    ['cell','sci','Name a structure found in a cell', ['Nucleus, Cell membrane, Cytoplasm, Mitochondrion/Mitochondria','Ribosome, Cell wall, Chloroplast','Vacuole, Golgi apparatus/Golgi body, Endoplasmic reticulum, Lysosome, Nucleolus','Centriole, Cytoskeleton, Flagellum, Peroxisome','Plasmodesma/Plasmodesmata, Tonoplast, Glycocalyx','Kinetochore']],
    ['energy','sci','Name a form of energy or energy source', ['Solar energy/Solar, Wind energy/Wind, Electricity/Electrical energy, Heat/Thermal energy','Nuclear energy/Nuclear, Hydroelectricity/Hydroelectric, Kinetic energy','Geothermal energy/Geothermal, Tidal energy/Tidal, Chemical energy, Sound energy/Sound, Light energy/Light','Elastic potential energy, Gravitational potential energy, Biomass, Wave energy','Osmotic power, Piezoelectricity, Thermoelectricity','Betavoltaic energy']],
    ['unit','sci','Name a unit of measurement', ['Metre/Meter, Kilogram, Second, Litre/Liter','Centimetre/Centimeter, Mile, Gram','Newton, Joule, Watt, Pascal, Volt','Tesla, Weber, Siemens, Becquerel','Katal, Sievert, Candela','Sverdrup']],
    ['spacecraft','sci','Name a spacecraft or space probe', ['Apollo 11, Voyager 1, International Space Station/ISS, Hubble Space Telescope/Hubble','Voyager 2, Sputnik 1/Sputnik, Curiosity','Perseverance, New Horizons, Cassini, Juno, James Webb Space Telescope/JWST','Rosetta, BepiColombo, Hayabusa2, Parker Solar Probe','Akatsuki, IKAROS, Giotto','Sakigake']],
    ['disneyvillain','screen','Name a Disney animated-film villain', ['Scar, Jafar, Ursula, Maleficent','Cruella de Vil/Cruella, Captain Hook, Hades','Gaston, Evil Queen, Lady Tremaine, Yzma, Mother Gothel','Dr Facilier/Doctor Facilier, Frollo, Shan Yu, Shere Khan','Madame Medusa, Ratigan, Horned King','Bowler Hat Guy/Goob']],
    ['pixar','screen','Name a Pixar feature film', ['Toy Story, Finding Nemo, Cars, The Incredibles','Monsters Inc/Monsters Inc., Up, WALL-E/WALL E','Ratatouille, Inside Out, Coco, Brave, A Bug’s Life/A Bugs Life','Onward, Soul, Luca, Turning Red','The Good Dinosaur, Elemental, Elio','Hoppers']],
    ['ghibli','screen','Name a Studio Ghibli feature film', ['Spirited Away, My Neighbor Totoro/My Neighbour Totoro, Howl’s Moving Castle/Howls Moving Castle, Princess Mononoke','Ponyo, Kiki’s Delivery Service/Kikis Delivery Service, Castle in the Sky','Grave of the Fireflies, The Wind Rises, Porco Rosso, Whisper of the Heart, The Cat Returns','Only Yesterday, Pom Poko, When Marnie Was There, From Up on Poppy Hill','Ocean Waves, My Neighbors the Yamadas/My Neighbours the Yamadas, Earwig and the Witch','The Tale of the Princess Kaguya']],
    ['sitcom','screen','Name a sitcom', ['Friends, The Office, The Big Bang Theory, Brooklyn Nine-Nine/Brooklyn 99','Modern Family, How I Met Your Mother/HIMYM, Seinfeld','Frasier, Cheers, Community, Parks and Recreation/Parks and Rec, Scrubs','Derry Girls, Peep Show, Black Books, Spaced','Detectorists, Stath Lets Flats, This Country','Garth Marenghi’s Darkplace/Darkplace']],
    ['doctorwho','screen','Name a Doctor Who character, species or enemy', ['The Doctor/Doctor, Dalek/Daleks, Cyberman/Cybermen, TARDIS','Rose Tyler, Donna Noble, The Master/Master','Martha Jones, Amy Pond, Rory Williams, Clara Oswald, River Song','Davros, Sontaran, Ood, Weeping Angel/Weeping Angels','Silurian, Zygon, The Rani/Rani','Frobisher']],
    ['startrek','screen','Name a Star Trek character', ['Spock, James T Kirk/James Kirk/Kirk, Jean-Luc Picard/Jean Luc Picard/Picard, Data','Worf, Uhura, Leonard McCoy/Bones','William Riker/Riker, Geordi La Forge, Deanna Troi, Kathryn Janeway/Janeway, Seven of Nine','Benjamin Sisko/Sisko, Jadzia Dax, Odo, Quark','Garak, T’Pol/Tpol, Hoshi Sato','Lwaxana Troi']],
    ['starwarsplanet','screen','Name a Star Wars planet or moon', ['Tatooine, Hoth, Endor, Coruscant','Naboo, Mustafar, Dagobah','Bespin, Kamino, Kashyyyk, Alderaan, Jakku','Scarif, Crait, Geonosis, Utapau','Lothal, Dathomir, Mandalore','Ahch-To/Ahch To']],
    ['potterspell','screen','Name a spell from Harry Potter', ['Expelliarmus, Lumos, Wingardium Leviosa, Avada Kedavra','Expecto Patronum, Accio, Alohomora','Stupefy, Petrificus Totalus, Riddikulus, Reparo, Obliviate','Sectumsempra, Protego, Incendio, Aguamenti','Muffliato, Levicorpus, Geminio','Piertotum Locomotor']],
    ['friendschar','screen','Name a character from Friends', ['Rachel Green/Rachel, Ross Geller/Ross, Monica Geller/Monica, Chandler Bing/Chandler','Joey Tribbiani/Joey, Phoebe Buffay/Phoebe, Gunther','Janice, Mike Hannigan/Mike, Richard Burke/Richard, Carol Willick/Carol, Susan Bunch/Susan','Emily Waltham/Emily, Jack Geller, Judy Geller, Frank Buffay Jr/Frank Buffay Junior','Estelle Leonard/Estelle, Mr Heckles, Treeger','Eddie Menuek/Eddie']],
    ['superpower','words','Name a fictional superpower', ['Flight/Flying, Invisibility, Super strength, Teleportation','Telepathy, Telekinesis, Super speed','Shapeshifting, Time travel, Healing factor, Force field generation, Mind control','Intangibility/Phasing, Technopathy, Precognition, Size manipulation','Density manipulation, Psychometry, Probability manipulation','Omnilingualism']],
    ['poetic','words','Name a poetry or literary term', ['Rhyme, Metaphor, Simile, Alliteration','Stanza, Sonnet, Haiku','Enjambment, Assonance, Onomatopoeia, Hyperbole, Personification','Caesura, Spondee, Anaphora, Chiasmus','Zeugma, Anadiplosis, Epistrophe','Epizeuxis']],
    ['punctuation','words','Name a punctuation mark or typographic symbol', ['Full stop/Period, Comma, Question mark, Exclamation mark/Exclamation point','Apostrophe, Colon, Semicolon','Hyphen, Em dash, En dash, Ellipsis, Asterisk','Pilcrow, Dagger, Interrobang, Section sign','Hedera, Double dagger, Reference mark','Irony mark']],
    ['philosopher','words','Name a philosopher', ['Socrates, Plato, Aristotle, Confucius','Friedrich Nietzsche/Nietzsche, Immanuel Kant/Kant, René Descartes/Descartes','Simone de Beauvoir, Jean-Paul Sartre/Sartre, John Locke, David Hume, Karl Marx','Hannah Arendt, Baruch Spinoza/Spinoza, Mary Wollstonecraft, Diogenes','Hypatia, Zhuangzi, Simone Weil','Dignāga/Dignaga']],
    ['painter','words','Name a painter', ['Vincent van Gogh/Van Gogh, Pablo Picasso/Picasso, Claude Monet/Monet, Leonardo da Vinci/Da Vinci','Frida Kahlo/Kahlo, Salvador Dalí/Salvador Dali/Dali, Rembrandt','Georgia O’Keeffe/Georgia O Keeffe, Henri Matisse/Matisse, Edvard Munch/Munch, Johannes Vermeer/Vermeer, Jackson Pollock/Pollock','Artemisia Gentileschi, Hilma af Klint, Leonora Carrington, Zinaida Serebriakova','Amrita Sher-Gil, Ibrahim El-Salahi, Remedios Varo','Alma Thomas']],
    ['fabric','words','Name a fabric or textile material', ['Cotton, Silk, Wool, Denim','Linen, Polyester, Velvet','Satin, Chiffon, Tweed, Corduroy, Nylon','Organza, Taffeta, Muslin, Brocade','Seersucker, Gabardine, Damask','Barathea']],
    ['martial','sport','Name a martial art or combat sport', ['Karate, Judo, Boxing, Taekwondo','Kung fu, Kickboxing, Wrestling','Muay Thai, Brazilian jiu-jitsu/BJJ, Aikido, Fencing, Kendo','Capoeira, Savate, Sumo, Sambo','Pencak silat/Silat, Lethwei, Baguazhang','Bökh/Bokh']],
    ['athletic','sport','Name an athletics event', ['100 metres/100m, 200 metres/200m, Marathon, Long jump','High jump, Shot put, Javelin throw/Javelin','Discus throw/Discus, Pole vault, Triple jump, Hammer throw/Hammer, Decathlon','Heptathlon, 3000 metres steeplechase/3000m steeplechase, 20 kilometres race walk/20km race walk, 400 metres hurdles/400m hurdles','Pentathlon, 35 kilometres race walk/35km race walk, 4 × 400 metres relay/4x400m relay','Standing triple jump']],
    ['swimstroke','sport','Name a swimming stroke or technique', ['Front crawl/Freestyle, Breaststroke, Backstroke, Butterfly','Dog paddle/Doggy paddle, Sidestroke, Treading water','Sculling, Dolphin kick, Flutter kick, Eggbeater kick, Streamline','Trudgen, Elementary backstroke, Combat sidestroke, Flip turn/Tumble turn','Corkscrew stroke, Inverted breaststroke, Scissor kick','Overarm sidestroke']],
    ['chessopening','games','Name a chess opening or defence', ['Sicilian Defence/Sicilian Defense/Sicilian, Queen’s Gambit/Queens Gambit, French Defence/French Defense, London System','Caro-Kann Defence/Caro Kann, Italian Game, Ruy Lopez','King’s Indian Defence/Kings Indian, English Opening, Scandinavian Defence/Scandinavian Defense, Pirc Defence/Pirc Defense, Dutch Defence/Dutch Defense','Nimzo-Indian Defence/Nimzo Indian, Grünfeld Defence/Grunfeld Defense, Alekhine’s Defence/Alekhine Defense, Vienna Game','Bird’s Opening/Birds Opening, Benko Gambit, Réti Opening/Reti Opening','Grob Opening/Grob']],
    ['minecraftblock','games','Name a Minecraft block', ['Dirt, Stone, Sand, Cobblestone','Obsidian, Bedrock, Glass','Netherrack, End stone, Soul sand, Glowstone, Redstone block','Prismarine, Purpur block, Crying obsidian, Ancient debris','Calibrated sculk sensor, Chiseled bookshelf, Respawn anchor','Lodestone']],
    ['minecraftbiome','games','Name a Minecraft biome', ['Plains, Desert, Forest, Jungle','Taiga, Swamp, Savanna','Badlands, Mushroom fields, Deep ocean, Frozen ocean, Birch forest','Cherry grove, Mangrove swamp, Dark forest, Ice spikes','Soul sand valley, Warped forest, Basalt deltas','Eroded badlands']],
    ['sonicchar','games','Name a Sonic the Hedgehog character', ['Sonic, Tails, Knuckles, Dr Eggman/Doctor Eggman/Robotnik','Amy Rose/Amy, Shadow, Metal Sonic','Silver, Blaze, Rouge, Big the Cat/Big, Cream the Rabbit/Cream','Vector, Espio, Charmy, Jet the Hawk/Jet','Wave the Swallow/Wave, Storm the Albatross/Storm, Fang the Hunter/Fang','Mighty the Armadillo/Mighty']],
    ['zeldaitem','games','Name an item or weapon from The Legend of Zelda', ['Master Sword, Hylian Shield, Ocarina of Time, Hookshot','Boomerang, Bow, Bomb','Megaton Hammer, Lens of Truth, Iron Boots, Deku Stick, Fire Rod','Gust Bellows, Spinner, Dominion Rod, Sand Wand','Cane of Somaria, Switch Hook, Magnetic Gloves','Cane of Pacci']],
    ['musictempo','music','Name a musical tempo or expression marking', ['Allegro, Adagio, Forte, Piano','Andante, Presto, Crescendo','Largo, Moderato, Vivace, Fortissimo, Pianissimo','Larghetto, Andantino, Accelerando, Ritardando','Sforzando, Morendo, Perdendosi','Calando']],
    ['musicensemble','music','Name a musical ensemble type', ['Orchestra, Choir, Band, Quartet','Trio, Duet/Duo, Brass band','String quartet, Jazz band, Big band, Chamber orchestra, Concert band','Quintet, Sextet, Gamelan, Mariachi','Guggenmusik, Rondalla, Cobla','Piphat']],
    ['navigation','sea','Name a navigation instrument, aid or method', ['Compass, Map, GPS, Lighthouse','Sextant, Radar, Nautical chart','Astrolabe, Gyrocompass, Dead reckoning, Sonar, Buoy','Cross-staff/Cross staff, Backstaff, Traverse board, Lead line','Kamal, Pelorus, Chip log','Nocturnal']],
  ];
  for (const [id, cat, q, groups] of topics) {
    BANK_SRC.push({ id, cat, q, exact: 1, a: groups.map((answers, i) => 'CHORFX'[i] + ': ' + answers).join('\n') });
  }
})();

/* Broader choices for the shorter banks, from everyday answers to specialist picks.
   Slash-separated spellings remain aliases of the same answer, never extra scores. */
(() => {
  const additions = {
    dessert: ['Custard, Jelly/Jello, Rice pudding, Bread pudding, Apple crumble','Banoffee pie, Sticky toffee pudding, Lemon posset, Crêpe/Crepe, Churros, Sorbet','Gulab jamun, Rasmalai, Mochi, Halva, Tres leches cake','Aşure/Asure, Tavuk göğsü/Tavuk gogsu, Qatayef, Sütlaç/Sutlac'],
    soup: ['Lentil soup/Lentil, Leek and potato soup, Pea soup, Vegetable soup, Oxtail soup','Wonton soup, Pho, Ramen, Hot and sour soup, Scotch broth, Cock-a-leekie','Pozole, Caldo verde, Ribollita, Solyanka, Mulligatawny','Zurek/Żurek, Tarator, Ajiaco, Erwtensoep'],
    sauce: ['Brown sauce, Hot sauce, Sweet chilli sauce, Worcestershire sauce, Tartare sauce/Tartar sauce','Tahini, Hoisin sauce, Oyster sauce, Fish sauce, Teriyaki, Aioli','Harissa, Gochujang, Ajvar, Satay sauce, Ponzu','Bagna càuda/Bagna cauda, Shatta, Nam prik, Satsivi'],
    nuts: ['Chestnut, Flaxseed/Linseed, Watermelon seed, Cacao nib','Coconut, Apricot kernel, Lotus seed, Mustard seed, Pomegranate seed','Tiger nut, Ginkgo nut, Candlenut, Acorn, Sacha inchi','Baru nut, Breadnut, Egusi, Ogbono'],
    tea: ['Lemon and ginger tea, Chai/Masala chai, Lemon verbena, Hibiscus tea','Assam, Ceylon tea, Sencha, Nettle tea, Dandelion tea, Yerba mate','Gyokuro, Tieguanyin, Dong ding, Keemun, Yunnan tea','Da hong pao, Huangshan maofeng, Longjing, Bai mudan'],
    coffee: ['Decaf coffee, Filter coffee, Café au lait/Cafe au lait, Frappé/Frappe','Turkish coffee, Vietnamese iced coffee, Red eye, Dirty chai, Espresso con panna, Piccolo latte','Café bombón/Cafe bombon, Barraquito, Cà phê trứng/Egg coffee, Dalgona coffee, Eiskaffee','Kopi tubruk, Qishr, Café de olla/Cafe de olla, Caffè shakerato/Caffe shakerato'],
    baked: ['Scone, Flapjack, Shortbread, Swiss roll, Apple turnover','Madeleine, Palmier, Financier, Macaron, Baklava, Eccles cake','Canelé/Canele, Paris-Brest/Paris Brest, Mille-feuille/Mille feuille, Rugelach, Babka','Pithivier, Jésuite/Jesuite, Bichon au citron, Kouignette'],
    mushroom: ['Field mushroom, Puffball, Truffle, Fly agaric, Death cap','Black trumpet, Yellowfoot, King oyster, Pioppino, Nameko, Blewit','Parasol mushroom, Shaggy ink cap, Dryad’s saddle/Dryads saddle, Beefsteak fungus, Slippery jack','Cauliflower fungus, Velvet shank, Saffron milk cap, St George’s mushroom/St Georges mushroom'],
    reptile: ['Python, Cobra, Boa constrictor, Rattlesnake, Viper','Anaconda, King snake, Corn snake, Leopard gecko, Bearded dragon, Nile crocodile','Blue-tongued skink/Blue tongued skink, Frilled lizard, Caiman, Monitor lizard, Red-eared slider/Red eared slider','Mata mata, Pig-nosed turtle/Pig nosed turtle, Armadillo girdled lizard, Mexican mole lizard'],
    insect: ['Moth, Cricket, Locust, Flea, Cockroach','Termite, Cicada, Firefly, Praying mantis, Stick insect, Weevil','Dobsonfly, Alderfly, Mayfly, Scorpionfly, Booklouse','Webspinner, Twisted-wing parasite, Jumping bristletail, Ice crawler'],
    tree: ['Apple tree, Cherry tree, Palm, Fir, Spruce','Larch, Yew, Holly, Hazel, Horse chestnut, Walnut','Sweet chestnut, Rowan, Alder, Hornbeam, Blackthorn','Sourwood, Katsura, Zelkova, Handkerchief tree'],
    flower: ['Poppy, Bluebell, Buttercup, Snowdrop, Violet','Iris, Dahlia, Gladiolus, Geranium, Magnolia, Sweet pea','Agapanthus, Alstroemeria, Anemone, Echinacea, Liatris','Tigridia, Tricyrtis, Dierama, Lapageria'],
    rock: ['Gold, Silver, Copper, Coal, Chalk','Flint, Pumice, Gabbro, Diorite, Rhyolite, Gypsum','Olivine, Feldspar, Calcite, Tourmaline, Fluorite','Eclogite, Larvikite, Sugilite, Rhodochrosite'],
    cloud: ['Fog, Mist, Contrail, Shelf cloud, Wall cloud','Roll cloud, Funnel cloud, Pyrocumulus, Pileus cloud/Pileus, Virga, Fallstreak hole/Hole-punch cloud','Cumulus humilis, Cumulus congestus, Cirrus uncinus, Altocumulus castellanus, Cap cloud','Nacreous cloud/Polar stratospheric cloud, Volutus, Cavum, Cauda'],
    organ: ['Small intestine, Large intestine/Colon, Oesophagus/Esophagus, Tongue, Eye','Uterus/Womb, Ovary, Testis/Testicle, Prostate, Placenta, Appendix','Hypothalamus, Hippocampus, Cerebellum, Medulla oblongata, Retina','Organ of Corti, Carotid body, Vomeronasal organ, Mesentery'],
    moon: ['Titania, Ariel, Umbriel, Tethys, Charon','Mimas, Hyperion, Phoebe, Nereid, Proteus, Nix','Hydra, Kerberos, Styx, Amalthea, Himalia','Despina, Galatea, Larissa, Thalassa'],
    river: ['Tigris, Euphrates, Jordan, Indus, Colorado','Congo, Niger, Murray, Darling, Po, Tagus','Dnieper, Dniester, Oder, Vistula, Yukon','Essequibo, Sepik, Fly River/Fly, Vjosa'],
    mountain: ['Snowdon/Yr Wyddfa, Scafell Pike, Mount Olympus, Mount Kenya, Mount Elgon','Mount Cook/Aoraki, Mount Rainier, Mount Kosciuszko, Mount Elgon, Mount Whitney, Mount Logan','Manaslu, Makalu, Cho Oyu, Shishapangma, Gasherbrum I','Saser Kangri, Jomolhari, Mount Sidley, Mount Erebus'],
    desert: ['Antarctic Desert/Antarctica, Arctic Desert/Arctic, Great Sandy Desert, Chihuahuan Desert, Patagonian Desert','Great Basin Desert, Syrian Desert, Negev, Sinai Desert, Gibson Desert, Rub al Khali/Empty Quarter','Danakil Desert, Dasht-e Kavir/Dasht e Kavir, Registan Desert, Dzungarian Desert, Sechura Desert','Tabernas Desert, Accona Desert, Oleshky Sands, Ryn Desert'],
    currency: ['Australian dollar, Canadian dollar, New Zealand dollar, Rand, Ruble/Rouble','Dirham, Dinar, Rial, Riyal, Taka, Rupiah','Dong, Kip, Kyat, Tenge, Som','Paʻanga/Paanga, Vatu, Tala, Ouguiya'],
    language: ['Arabic, Portuguese, Russian, Japanese, German','Swahili, Korean, Turkish, Dutch, Polish, Greek','Tamil, Telugu, Amharic, Zulu, Yoruba','Aymara, Quechua, Inuktitut, Xhosa'],
    mythical: ['Dragon, Unicorn, Mermaid, Fairy, Werewolf','Vampire, Griffin, Centaur, Minotaur, Cyclops, Pegasus','Basilisk, Chimera, Manticore, Kelpie, Selkie','Ahuizotl, Nuckelavee, Peryton, Catoblepas'],
    egypt: ['Bastet/Bast, Thoth, Sobek, Khonsu, Nut','Geb, Shu, Tefnut, Nephthys, Ptah, Ma’at/Maat','Khnum, Hapi, Taweret, Bes, Wepwawet','Seshat, Serket/Selket, Neith, Meretseger'],
    norse: ['Baldr/Baldur, Frigg, Freyr, Tyr, Heimdall','Hel, Fenrir, Jörmungandr/Jormungandr, Sleipnir, Skadi, Sif','Idunn, Bragi, Njord, Forseti, Vidar','Váli/Vali, Nótt/Nott, Dellingr, Hœnir/Hoenir'],
    artmedia: ['Charcoal, Pastel, Ink, Acrylic paint, Oil paint','Watercolour/Watercolor, Gouache, Collage, Clay, Linocut, Screen printing','Etching, Lithography, Woodcut, Fresco, Encaustic','Cyanotype, Mezzotint, Aquatint, Sgraffito'],
    dance: ['Ballet, Salsa, Tango, Hip hop, Waltz','Foxtrot, Quickstep, Jive, Tap, Contemporary, Breakdancing/Breaking','Kathak, Bharatanatyam, Bhangra, Flamenco, Bachata','Kizomba, Sabar, Dabke, Rebetiko'],
    percussion: ['Drum, Triangle, Tambourine, Cymbals, Maracas','Xylophone, Glockenspiel, Bongo/Bongos, Conga/Congas, Timpani, Snare drum','Djembe, Cajón/Cajon, Tabla, Bodhrán/Bodhran, Guiro/Güiro','Udu, Berimbau, Flexatone, Waterphone'],
    bowed: ['Electric guitar, Acoustic guitar, Fiddle, Zither, Dulcimer','Balalaika, Bouzouki, Shamisen, Guzheng, Pipa, Oud','Saz/Bağlama/Baglama, Charango, Cuatro, Rebab, Sarod','Hardanger fiddle, Tagelharpa, Jouhikko, Igil'],
    racket: ['Volleyball, Rugby sevens, Table tennis, Badminton, Weightlifting','Handball, Hockey, Water polo, Sailing, Canoeing, Cycling','Modern pentathlon, Triathlon, Taekwondo, Judo, Surfing','Lacrosse, Polo, Rackets, Roque'],
    winter: ['Alpine skiing, Cross-country skiing/Cross country skiing, Speed skating, Freestyle skiing, Nordic skiing','Downhill, Slalom, Giant slalom, Super-G/Super G, Snowboard cross, Halfpipe','Parallel giant slalom, Slopestyle, Big air, Team pursuit, Mass start','Ice dance, Pair skating/Pairs skating, Four-man bobsleigh/Four man bobsleigh, Mixed doubles curling'],
    chess: ['Queen, Rook, Bishop, Knight, Capture','Promotion, Discovered check, Double check, Back rank mate, Sacrifice, Blunder','Outpost, Passed pawn, Isolated pawn, Doubled pawns, Perpetual check','Lucena position, Philidor position, Minority attack, Desperado'],
    cardgame: ['Go Fish, Old Maid, Crazy Eights, War, Beggar My Neighbour','Whist, Gin rummy, Baccarat, President, Speed, Cheat','Belote, Briscola, Tichu, Doppelkopf, Oh Hell','Schnapsen, Préférence/Preference, Ninety-nine/Ninety nine, Bezique'],
    zelda: ['Daruk, Riju, Purah, Robbie, Hestu','Tulin, Yunobo, Rauru, Sonia, Mineru, King Rhoam','Malon, Talon, Saria, Darunia, Ruto','Agitha, Yeto, Yeta, Linebeck'],
    mariocharacter: ['Goomba, Koopa Troopa, Boo, Shy Guy, Piranha Plant','Donkey Kong, Diddy Kong, Lakitu, Petey Piranha, Boom Boom, Pom Pom','Fawful, Cackletta, Count Bleck, Vivian, Goombella','Admiral Bobbery/Bobbery, Flurrie, Mallow, Geno'],
    spongebob: ['Patchy the Pirate/Patchy, Potty the Parrot/Potty, Man Ray, Dirty Bubble, King Neptune','Squilliam Fancyson/Squilliam, Old Man Jenkins, Harold SquarePants, Margaret SquarePants, Grandma SquarePants, Perch Perkins','Flats the Flounder/Flats, Scooter, Tom, Nat Peterson, Dennis','SpongeGar, Patar, Squog, Princess Mindy/Mindy'],
    avatar: ['Zhao, Roku, Kyoshi, Hakoda, Kya','Haru, Teo, Jeong Jeong, Pakku, Piandao, Combustion Man','Hama, Koh, Wan Shi Tong, Guru Pathik, The Boulder/Boulder','June, Smellerbee, Longshot, Pipsqueak'],
    ship: ['Rowboat/Rowing boat, Lifeboat, Fishing boat, Tugboat, Speedboat','Sloop, Cutter, Ketch, Yawl, Barque, Brig','Junk, Sampan, Trireme, Galley, Carrack','Birlinn, Curragh/Currach, Umiak, Proa'],
    nautical: ['Hull, Porthole, Cabin, Helm, Figurehead','Cleat, Bollard, Halyard, Sheet, Tiller, Yardarm','Scupper, Hawsehole, Futtock, Mizzenmast, Transom','Gammon iron, Bobstay, Chainplate, Knighthead'],
    clothes: ['Reebok, Vans, Converse, Primark, Gap','COS, Arket, AllSaints, Barbour, Superdry, Timberland','Gramicci, Norse Projects, Universal Works, Our Legacy, Sunspel','Sassafras, Battenwear, And Wander, Engineered Garments'],
    stationery: ['Scissors, Glue stick, Sticky note/Post-it/Post it, Envelope, Pencil sharpener','Paper clip, Hole punch, Ring binder, Sellotape/Adhesive tape, Index card, Clipboard','Set square, Drawing pin/Thumbtack, Tracing paper, Carbon paper, Blotting paper','Ruling pen, Erasing shield, Lead pointer, Parallel ruler'],
  };
  const key = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [id, groups] of Object.entries(additions)) {
    const q = BANK_SRC.find(q => q.id === id);
    const known = new Set(q.a.split('\n').flatMap(line => line.replace(/^[CHORFX]:\s*/, '').split(',')).flatMap(s => s.split('/').map(key)));
    groups.forEach((group, i) => {
      const items = group.split(',').map(s => s.trim()).filter(item => {
        const aliases = item.split('/').map(key);
        if (aliases.some(k => known.has(k))) return false;
        aliases.forEach(k => known.add(k)); return true;
      });
      if (items.length) q.a += '\n' + 'HORF'[i] + ': ' + items.join(', ');
    });
  }
})();

/* Extra specialist choices for the established prompts. */
(() => {
  const more = {
    pasta: 'R: Spatzle/Spätzle, Passatelli, Sagnarelli, Quadrefiore, Spighe, Tripoline, Occhi di lupo, Sedani, Gnocchetti sardi\nF: Alfabeto, Lanterne, Marille, Caccavelle',
    cheese: 'R: Stichelton, Durrus, Gubbeen, Cashel Blue, Coolea, Doddington\nF: Beenleigh Blue, Berkswell, Tunworth, Baron Bigod, Cotherstone, Innes Log',
    cocktail: 'R: Division Bell, Oaxaca Old Fashioned, Siesta, Illegal, Enzoni\nF: Benton’s Old Fashioned/Bentons Old Fashioned, Improved Whiskey Cocktail, La Louisiane, Adonis, Bamboo',
    spice: 'R: Lemon thyme, Vietnamese coriander, Thai basil, Holy basil, Mexican oregano\nF: Sansho, Sanshō/Sanshou, Jimbu, Kencur, Uziza, Uda',
    bread: 'R: Luchi, Sheermal, Taftan, Sangak, Kulich\nF: Rgaïf/Rghaif, Msemen, Bazlama, Gözleme/Gozleme, Malawach, Jachnun',
    simpsons: 'R: Kumiko Albertson, Julio, Just Stamp the Ticket Man, Yes Guy, Very Tall Man\nF: Don Vittorio DiMaggio, Leopold, Lucius Sweet, Jeremy Freedman, Alice Glick',
    bond: 'R: Safin/Lyutsifer Safin, Valdo Obruchev, Primo, Paloma, Logan Ash\nF: Milton Krest, Professor Joe Butcher, Truman-Lodge/Truman Lodge, Hinx/Mr Hinx',
    bestpicture: 'R: Anora, Everything Everywhere All at Once, CODA, Nomadland, Parasite, Green Book, Oppenheimer',
    beatles: 'R: Carnival of Light, Suzy Parker, Watching Rainbows\nF: Cayenne, In Spite of All the Danger, Christmas Time Is Here Again, Free as a Bird, Real Love, Now and Then',
    instrument: 'R: Cristal Baschet, Yaybahar, Roli Seaboard, Continuum fingerboard\nF: Eigenharp, Hydraulophone, Pyrophone, Sea organ, Hyperbass flute, Octobass',
    eurovision: 'R: Nemo, The Code, JJ, Wasted Love, Loreen, Tattoo, Zitti e buoni/Zitti e buoni, Stefania, Kalush Orchestra',
    mj: 'R: Chicago, Loving You, A Place with No Name, Blue Gangsta, Xscape, Slave to the Rhythm, Best of Joy, Hollywood Tonight\nF: Scared of the Moon, Beautiful Girl, We’ve Had Enough/Weve Had Enough, Shout',
    f1: 'R: Oliver Bearman, Andrea Kimi Antonelli/Kimi Antonelli, Gabriel Bortoleto, Isack Hadjar, Franco Colapinto, Liam Lawson\nF: Jack Doohan, Paul Pietsch, Peter Hirt, Ernst Klodwig, Toni Branca',
    ballsport: 'R: Teqball, Headis, Roundnet/Spikeball, Footvolley, Bossaball\nF: Tamburello, Pallapugno, Fistball, Vigoro, Cnapan, Tsu chu/Cuju',
    console: 'R: Playdate, Analogue Pocket, Evercade, Atari VCS, Polymega\nF: Casio Loopy, Pippin, Playdia, Bandai Design Master, Gamate',
    minecraft: 'H: Armadillo, Breeze, Bogged\nR: Creaking, Happy Ghast, Copper Golem\nF: Tadpole, Camel, Sniffer, Allay',
    dog: 'R: Silken Windhound, Tamaskan, Northern Inuit Dog, Yakutian Laika, Biewer Terrier\nF: Chongqing Dog, Chortai, Taigan, Sinhala Hound, Jonangi',
    solar: 'R: Gonggong, Quaoar, Sedna, Orcus, Salacia\nF: Weywot, Xiangliu, Vanth, Actaea, Ilmarë/Ilmare, Dysnomia',
    dino: 'R: Lokiceratops, Asiatyrannus, Coahuilasaurus, Fona, Koleken\nF: Qianjiangsaurus, Musankwa, Comptonatus, Alpkarakush, Vectidromeus',
    japanese: 'R: Kintsugi, Komorebi, Shinrin-yoku/Shinrin yoku, Ikigai, Omotenashi\nF: Hikikomori, Yūgen/Yugen, Mottainai, Karoshi, Tsundoku',
    typeface: 'R: Atkinson Hyperlegible, Bricolage Grotesque, Instrument Serif, Doto, Geist\nF: Departure Mono, Monaspace, Commit Mono, Recursive, Berkeley Mono',
    blue: 'R: YinMn blue/YInMn blue, Zaffre, St Patrick’s blue/St Patricks blue, Savoy blue\nF: Bleu de France, Delft blue, Marian blue, Glaucous, Wild blue yonder',
    defunct: 'R: Google Stadia/Stadia, Google Podcasts, Artifact, Pebble app, Cohost\nF: Post News, Omnivore, Readmill, Rdio, Springpad',
    greekgod: 'R: Aergia, Alala, Alectrona, Apate, Dolos\nF: Eucleia, Eupheme, Homados, Horkos, Pheme',
    boardgame: 'R: Arcs, Earth, Sky Team, Harmonies, Daybreak\nF: The White Castle, The Guild of Merchant Explorers, Faraway, Revive, Forest Shuffle',
    proglang: 'R: Mojo, Roc, Gleam, Uiua, V\nF: Bend, Austral, Carp, Hare, Hylo',
    seacreature: 'R: Yeti crab, Dumbo octopus, Vampire squid, Barreleye, Salp\nF: Pelican eel, Bigfin squid, Tripod fish, Black swallower, Sea pig',
    pirate: 'R: Stede Bonnet, Zheng Yi Sao/Ching Shih, Samuel Bellamy/Black Sam Bellamy, Rahmah ibn Jabir\nF: Awilda/Alwilda, Sadie the Goat, Olivier Levasseur/La Buse, Hendrick Lucifer',
    seas: 'R: Amundsen Sea, Bellingshausen Sea, Davis Sea, Lazarev Sea\nF: Riiser-Larsen Sea/Riiser Larsen Sea, Cosmonauts Sea, Cooperation Sea, Somov Sea',
    animated: 'R: Flow, The Wild Robot, Memoir of a Snail, Robot Dreams, Mars Express\nF: The Peasants, Chicken for Linda!, The Imaginary, The Glassworker, Sirocco and the Kingdom of the Winds',
    horror: 'R: Oddity, Longlegs, Late Night with the Devil, The Substance, Heretic\nF: Exhuma, Caveat, Stopmotion, MadS, In a Violent Nature',
    olysport: 'R: Squash, Flag football, Coastal rowing, Kayak cross, Cricket\nF: Obstacle racing, Motorboating, Plunge for distance, Rope climbing',
    footballer: 'R: Lamine Yamal, Pau Cubarsí/Pau Cubarsi, Désiré Doué/Desire Doue, Estêvão/Estevao, Franco Mastantuono\nF: Geovany Quenda, Rodrigo Mora, Konstantinos Karetsas, Chris Rigg, Ayyoub Bouaddi',
    vgchar: 'R: Astro Bot, Eve from Stellar Blade/Eve, Maelle, Verso, Gustave\nF: Hornet, Melinoë/Melinoe, Chai, 808, Clive Rosfield',
    nintendo: 'R: Super Mario Bros Wonder/Super Mario Bros. Wonder, Princess Peach Showtime/Princess Peach: Showtime!, The Legend of Zelda Echoes of Wisdom/The Legend of Zelda: Echoes of Wisdom\nF: Famicom Detective Club Emio/Emio – The Smiling Man, Nintendo World Championships NES Edition, Another Code Recollection',
    tennis: 'R: João Fonseca/Joao Fonseca, Jakub Menšík/Jakub Mensik, Learner Tien, Alexandra Eala, Mirra Andreeva\nF: Victoria Mboko, Loïs Boisson/Lois Boisson, Iva Jovic, Clervie Ngounoue, Nishesh Basavareddy',
    club: 'R: Auckland FC, San Diego FC, Inter Kashi, FC Andorra, Union Saint-Gilloise\nF: USV Hercules, KÍ Klaksvík/KI Klaksvik, Lincoln Red Imps, Larne, Hamrun Spartans',
    island: 'R: Floreana, Isabela Island, Fernandina Island, San Cristóbal Island/San Cristobal Island\nF: Rapa Iti, Mangareva, Rurutu, Tubuai, Makatea',
    body: 'R: Philtrum, Tragus, Antihelix, Glabella, Hallux\nF: Popliteal fossa, Cubital fossa, Anatomical snuffbox, Lacrimal caruncle, Pterygopalatine fossa',
    rh_day: 'R: Cabaret, Matinée/Matinee, Naiveté/Naivete, Protégé/Protege\nF: Soubriquet, Auto-da-fé/Auto da fe, Jeté/Jete',
    rh_bee: 'R: Chablis, Potpourri, Bourgeoisie, Debris, Ennui\nF: Apogee, Perigee, Appointee, Internee, Detainee',
    rh_night: 'R: Selenite, Aragonite, Amazonite, Aegirine augite\nF: Tanzanite, Rhodonite, Sphalerite, Lepidolite, Sugilite',
    rh_blue: 'R: Roux, Aperçu/Apercu, Bijou, Ingenue\nF: Purlieu, Parvenu, Impromptu',
    w_q: 'R: Quasicrystal, Quadcopter, Quishing, Queercore, Quokka\nF: Quodlibet, Quinquennial, Quincuncial, Quisling, Quaquaversal',
    w_ology: 'R: Exoplanetology, Paleopathology, Aerobiology\nF: Speleobiology, Tephrochronology, Ichnology, Pteridology, Trichology',
    w_zz: 'R: Pizzazz, Razzmatazz, Jazzercise, Fuzzball, Buzzword\nF: Pizzaiolo, Pizzicato, Quizzicality, Bedazzlement, Embezzlement',
    anypoke: 'R: Pecharunt, Ogerpon, Terapagos, Gouging Fire, Raging Bolt, Iron Boulder, Iron Crown, Iron Leaves, Walking Wake',
    city: 'R: Nusantara, Putrajaya, Naypyidaw, Astana, New Administrative Capital\nF: Sejong, Songdo, Xiong’an/Xiongan, Masdar City, Rawabi',
    comics: 'R: Spider-Boy/Bailey Briggs, Jeff the Land Shark, Luna Snow, Squirrel Girl\nF: Doop, Slapstick, Sleepwalker, Terror Inc, Forbush Man',
    bird: 'R: Shoebill, Secretarybird, Kākāpō/Kakapo, Kagu, Hoatzin\nF: Standard-winged nightjar, Vulturine guineafowl, Long-wattled umbrellabird, White-necked rockfowl, Ribbon-tailed astrapia',
    genre: 'R: Amapiano, Gqom, Jersey club, Brazilian phonk, Hyperpop\nF: HexD, Dariacore, Shibuya-kei, Deconstructed club, Singeli',
    fruit: 'R: Feijoa, Jabuticaba, Salak, Santol, Langsat\nF: Kepel, Bignay, Mabolo, Mundu, Bacuri',
    veg: 'R: Celtuce, Oca, Ulluco, Mashua, Skirret\nF: Good King Henry, Sea beet, Scorzonera, Earthnut pea, Hamburg parsley',
    tech: 'R: Framework, Nothing, Fairphone, Hugging Face, Mistral AI\nF: Cerebras, Groq, Tenstorrent, SiFive, Ampere Computing',
    cars: 'R: Xiaomi, Yangwang, Fangchengbao, Ineos, VinFast\nF: Praga, Czinger, Apollo Automobil, Piëch/Piech, Delage',
    airline: 'R: Riyadh Air, Beond, Air Premia, Greater Bay Airlines, Akasa Air\nF: BermudAir, Fly Jinnah, Arajet, Global Airlines, Air Samarkand',
    film: 'R: Anora, The Brutalist, Conclave, Sing Sing, A Real Pain\nF: All We Imagine as Light, Dìdi/Didi, Nickel Boys, Vermiglio, Grand Tour',
    videogame: 'R: Clair Obscur Expedition 33/Clair Obscur: Expedition 33, Blue Prince, Split Fiction, Animal Well, Lorelei and the Laser Eyes\nF: UFO 50, Mouthwashing, 1000xResist, Nine Sols, Thank Goodness You’re Here/Thank Goodness Youre Here',
    yt2010: 'R: Simone Giertz, William Osman, Michael Reeves, Tom Scott, Jelle’s Marble Runs/Jelles Marble Runs\nF: Tantacrul, Technology Connections, Atomic Shrimp, Steve Mould, Captain Disillusion',
    yt2020: 'R: Fern, BobbyBroccoli, Dime Store Adventures, Angela Collier, Answer in Progress\nF: Posy, Asianometry, Cathode Ray Dude, James Bruton, Stuff Made Here',
    candy: 'R: Tony’s Chocolonely/Tonys Chocolonely, LoveRaw, Nomo, Rhythm 108, Ombar\nF: Pump Street, Duffy’s/Duffys, Original Beans, Akesson’s/Akessons, Friis-Holm/Friis Holm',
    tvshow: 'R: Shōgun/Shogun, Severance, Slow Horses, The Pitt, Adolescence\nF: Scavengers Reign, Pantheon, Blue Eye Samurai, Somebody Somewhere, Pachinko',
    musician: 'R: Chappell Roan, Doechii, Mk.gee/Mkgee, Geese, The Last Dinner Party\nF: Cameron Winter, Saya Gray, Nala Sinephro, Arooj Aftab, Ichiko Aoba',
    fastfood: 'R: Dave’s Hot Chicken/Daves Hot Chicken, Raising Cane’s/Raising Canes, Wingstop, Jollibee, Slim Chickens\nF: Chook, Bleecker, Honest Burgers, Black Bear Burger, Truffle Burger',
    toy: 'R: Tonies, Yoto, Connetix, Magna-Tiles/Magna Tiles, Clixo\nF: Stapelstein, Wobbel, Waytoplay, Grapat, Grimm’s/Grimms',
    song: 'R: Good Luck Babe/Good Luck Babe!, Birds of a Feather, Not Like Us, Pink Pony Club, Espresso\nF: Messy, A Bar Song Tipsy/A Bar Song (Tipsy), Beautiful Things, Die with a Smile, Golden',
    book: 'R: James, Intermezzo, Orbital, The Book of Elsewhere, The Ministry of Time\nF: The Safekeep, Held, Creation Lake, The Wren The Wren, Small Things Like These',
    app: 'R: Bluesky, Threads, Tapestry, Flashes, Cara\nF: Obsidian, Anytype, Capacities, Superlist, Arc Search',
  };
  const key = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [id, lines] of Object.entries(more)) {
    const q = BANK_SRC.find(q => q.id === id);
    const known = new Set(q.a.split('\n').flatMap(line => line.replace(/^[CHORFX]:\s*/, '').split(',')).flatMap(s => s.split('/').map(key)));
    for (const line of lines.split('\n')) {
      const items = line.slice(3).split(',').map(s => s.trim()).filter(item => {
        const aliases = item.split('/').map(key);
        if (aliases.some(k => known.has(k))) return false;
        aliases.forEach(k => known.add(k)); return true;
      });
      if (items.length) q.a += '\n' + line.slice(0, 3) + items.join(', ');
    }
  }
  // These banks already cover the finite set; expand accepted names rather than invent entries.
  const aliases = {
    element: { Aluminium: 'Aluminum', Sulfur: 'Sulphur', Caesium: 'Cesium', Tungsten: 'Wolfram' },
    country: { China: 'People’s Republic of China', 'United States': 'United States of America', 'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland', Bolivia: 'Plurinational State of Bolivia', Tanzania: 'United Republic of Tanzania', Laos: 'Lao People’s Democratic Republic' },
    capital: { Kyiv: 'Kiev', Beijing: 'Peking', 'Sri Jayawardenepura Kotte': 'Kotte', 'Naypyidaw': 'Nay Pyi Taw', 'Ulaanbaatar': 'Ulan Bator' },
  };
  for (const [id, map] of Object.entries(aliases)) {
    const q = BANK_SRC.find(q => q.id === id);
    q.a = q.a.split('\n').map(line => line.replace(/^([CHORFX]:\s*)(.*)$/, (_, tier, items) => tier + items.split(',').map(item => {
      const names = item.trim().split('/');
      const extra = map[names[0]];
      if (extra && !names.some(n => key(n) === key(extra))) names.push(extra);
      return names.join('/');
    }).join(', '))).join('\n');
  }
})();

(() => {
  const extras = {
    mythical: 'R: Banshee, Dullahan, Bunyip, Qilin, Tanuki, Kitsune, Roc, Simurgh, Garuda, Jorogumo\nF: Wolpertinger, Tatzelwurm, Mapinguari, Encantado, Tikbalang',
    norse: 'R: Mimir, Völundr/Volundr, Ratatoskr, Nidhogg, Surtr, Ymir, Audhumla\nF: Hraesvelgr, Hrungnir, Garmr, Angrboda, Jarnsaxa',
    artmedia: 'R: Monoprint, Drypoint, Photogravure, Tempera, Silverpoint, Stippling, Impasto, Decoupage\nF: Fumage, Frottage, Grattage, Collagraphy, Intaglio',
    dance: 'R: Charleston, Lindy hop, Balboa, Bolero, Merengue, Samba, Rumba, Cha-cha-cha/Cha cha cha\nF: Odissi, Kuchipudi, Mohiniyattam, Chhau, Pantsula',
    percussion: 'R: Marimba, Vibraphone, Tubular bells, Woodblock, Castanets, Claves, Cowbell, Agogo, Surdo, Pandeiro\nF: Cuíca/Cuica, Caxixi, Shekere, Daf, Zarb',
    seacreature: 'R: Strawberry squid, Blanket octopus, Peacock mantis shrimp, Flamboyant cuttlefish, Leafy seadragon\nF: Sea angel, Ping-pong tree sponge/Ping pong tree sponge, Venus’ flower basket/Venus flower basket, Basket star, Harp sponge',
    animal: 'R: Annamite striped rabbit, Sumatran striped rabbit, Ili pika, Hirola, Gerenuk\nF: Sengi, Dibatag, Saola, Zorilla, Binturong, Fossa, Owston’s civet/Owstons civet',
  };
  const key = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [id, lines] of Object.entries(extras)) {
    const q = BANK_SRC.find(q => q.id === id);
    const known = new Set(q.a.split('\n').flatMap(line => line.replace(/^[CHORFX]:\s*/, '').split(',')).flatMap(s => s.split('/').map(key)));
    for (const line of lines.split('\n')) {
      const items = line.slice(3).split(',').map(s => s.trim()).filter(item => {
        const aliases = item.split('/').map(key);
        if (aliases.some(k => known.has(k))) return false;
        aliases.forEach(k => known.add(k)); return true;
      });
      if (items.length) q.a += '\n' + line.slice(0, 3) + items.join(', ');
    }
  }
})();

/* Fill the finite geography lists and add alternatives to every new open topic. */
(() => {
  const extras = {
    breakfast: 'R: Eggs Benedict, Eggs Florentine, Full English breakfast, Breakfast burrito, Breakfast sandwich, Dosa, Poha, Paratha, Crumpet, Kippers\nF: Nasi lemak, Akee and saltfish/Ackee and saltfish, Menemen, Çılbır/Cilbir',
    berry: 'R: Whitecurrant, Dewberry, Bilberry, Crowberry, Goji berry, Sea buckthorn, Aronia/Chokeberry, Barberry, Serviceberry, Saskatoon berry\nF: Haskap/Honeyberry, Buffaloberry, Goumi, Ugni berry',
    apple: 'R: Cripps Red/Sundowner, Elstar, Braeburn, Envy, Kanzi, Ambrosia, Empire, Spartan, Russet\nF: Pitmaston Pine Apple, Ribston Pippin, Reine des Reinettes, Belle de Boskoop',
    sandwich: 'R: Peanut butter and jelly/PB and J, Egg mayonnaise sandwich/Egg salad sandwich, Cucumber sandwich, Coronation chicken sandwich, Chip butty, Croque madame, Lobster roll, Chicken sandwich, Pulled pork sandwich, Pastrami sandwich\nF: Smørrebrød/Smorrebrod, Sabich, Bifana, Mitraillette',
    salad: 'R: Egg salad, Tuna salad, Chicken salad, Bean salad, Couscous salad, Rice salad, Wedge salad, Watermelon and feta salad, Beetroot salad, Green salad\nF: Larb/Laab, Karedok, Urnebes, Mechouia',
    dumpling: 'R: Samosa, Gnocchi, Soup dumpling/Xiaolongbao, Tangyuan, Zongzi, Har gow, Modak, Gujiya, Dango, Malai kofta\nF: Cepelinai, Kroppkaka, Kalduny, Kartacz',
    mocktail: 'R: Apple juice, Pineapple juice, Grapefruit juice, Tomato juice, Cranberry juice, Grape juice, Coconut water, Coconut milk, Tonic water, Cream soda\nF: Switchel, Shrub, Sobolo, Sujeonggwa',
    legume: 'R: Cannellini bean, Green pea, Snow pea/Mangetout, Sugar snap pea, Green bean/French bean, Black lentil/Beluga lentil, Yellow lentil, Horse gram, Rice bean, Black gram/Urad dal\nF: Moth bean, Tepary bean, Runner bean, Hyacinth bean',
    fishdish: 'R: Salmon en croûte/Salmon en croute, Gravlax, Sashimi, Fish tacos, Fish curry, Seafood risotto, Clam chowder, Lobster thermidor, Oysters Rockefeller, Jambalaya\nF: Bacalhau à Brás/Bacalhau a Bras, Garudhiya, Poke, Fish amok',
    cake: 'R: Fruitcake/Fruit cake, Christmas cake, Simnel cake, Dundee cake, Pound cake, Bundt cake, Chiffon cake, Hummingbird cake, Lamington, Torta caprese\nF: Esterházy torte/Esterhazy torte, Kiev cake, Bolo de rolo, Ma lai go',
    africountry: 'O: Angola, Botswana, Burkina Faso, Burundi, Cameroon, Cape Verde/Cabo Verde, Central African Republic, Chad, Democratic Republic of the Congo/DR Congo, Republic of the Congo/Congo Republic, Equatorial Guinea, Gabon, Gambia/The Gambia, Guinea, Guinea-Bissau/Guinea Bissau, Ivory Coast/Côte d’Ivoire/Cote d Ivoire, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Mauritius, Mozambique, Namibia, Niger, Rwanda, Seychelles, Sierra Leone, Somalia, South Sudan, Sudan, Zambia, Zimbabwe',
    asiacountry: 'O: Afghanistan, Armenia, Azerbaijan, Bahrain, Bangladesh, Bhutan, Brunei, Cambodia, Cyprus, Georgia, Iran, Iraq, Israel, Jordan, Kazakhstan, Kuwait, Kyrgyzstan, Laos, Lebanon, Maldives, Myanmar/Burma, Nepal, North Korea, Oman, Pakistan, Palestine, Philippines, Qatar, Saudi Arabia, Syria, Tajikistan, Timor-Leste/East Timor, Turkey/Türkiye/Turkiye, Turkmenistan, United Arab Emirates/UAE, Uzbekistan, Yemen\nR: Russia, Taiwan',
    usstate: 'O: Alabama, Arkansas, Connecticut, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Minnesota, Mississippi, Missouri, Montana, Nebraska, New Jersey, New Mexico, North Carolina, Oklahoma, Pennsylvania, South Carolina, South Dakota, Tennessee, Utah, Virginia, West Virginia, Wyoming, Michigan',
    ukcounty: 'O: Berkshire, Buckinghamshire, Cambridgeshire, Cheshire, City of Bristol/Bristol, County Durham/Durham, Derbyshire, East Sussex, Gloucestershire, Greater London, Greater Manchester, Hertfordshire, Isle of Wight, Leicestershire, Lincolnshire, Merseyside, North Yorkshire, Northamptonshire, Northumberland, Nottinghamshire, Oxfordshire, South Yorkshire, Staffordshire, Tyne and Wear, Warwickshire, West Midlands, West Sussex, West Yorkshire, Wiltshire',
    eurocapital: 'O: Belgrade, Bern, Brussels, Bucharest, Budapest, Chisinau/Chișinău, Copenhagen, Helsinki, Kyiv/Kiev, Luxembourg, Minsk, Monaco, Moscow, Nicosia, Oslo, Pristina, Reykjavik/Reykjavík, Riga, Sarajevo, Skopje, Sofia, Stockholm, Tirana, Valletta, Vatican City, Zagreb\nR: Ankara, Tbilisi, Yerevan, Baku',
    landmark: 'R: Burj Khalifa, Burj Al Arab, Leaning Tower of Pisa, Acropolis, Parthenon, Giza pyramids/Pyramids of Giza, Great Sphinx of Giza/Sphinx, Christ the Redeemer, Mount Rushmore, Brandenburg Gate\nF: Sigiriya, Himeji Castle, Lalibela churches/Lalibela, Bagan',
    waterfall: 'R: Athirappilly Falls, Dudhsagar Falls, Bridalveil Fall, Vernal Fall, Nevada Fall, Takakkaw Falls, Helmcken Falls, Athabasca Falls, Krimml Waterfalls, Staubbach Falls\nF: Nachi Falls, Havasu Falls, Wailua Falls, Baatara Gorge waterfall',
    lake: 'R: Lake Chad, Lake Turkana, Lake Albert, Lake Edward, Lake Kivu, Lake Winnipeg, Great Bear Lake, Great Slave Lake, Lake Ladoga, Lake Onega\nF: Issyk-Kul/Issyk Kul, Lake Ohrid, Lake Prespa, Lake Toba',
    volcano: 'R: Mount Erebus, Mount Rainier, Mount Ruapehu, Mount Tongariro, Hekla, Katla, Tambora, Agung, Mayon, Taal\nF: La Soufrière/La Soufriere, Mount Pelée/Mount Pelee, Ol Doinyo Lengai, Nevado del Ruiz',
    bridge: 'R: Harbour Bridge/Sydney Harbour Bridge, Humber Bridge, Severn Bridge, Tyne Bridge, Gateshead Millennium Bridge, Royal Albert Bridge, Pont Neuf, Pont Alexandre III, Széchenyi Chain Bridge/Chain Bridge, Ponte 25 de Abril/25 de Abril Bridge\nF: Ronda Bridge/Puente Nuevo, Dragon Bridge Da Nang, Langkawi Sky Bridge, Bixby Creek Bridge',
    sharks: 'R: Sand tiger shark, Porbeagle, Spiny dogfish, Smooth hammerhead, Scalloped hammerhead, Great hammerhead, Zebra shark, Leopard shark, Silvertip shark\nF: Wobbegong, Crocodile shark, Pyjama shark, Kitefin shark',
    whale: 'R: Southern right whale, North Atlantic right whale, North Pacific right whale, Bryde’s whale/Brydes whale, Pygmy right whale, Pygmy sperm whale, Dwarf sperm whale, Spinner dolphin, Striped dolphin, Dusky dolphin\nF: Commerson’s dolphin/Commersons dolphin, Heaviside’s dolphin/Heavisides dolphin, Hector’s dolphin/Hectors dolphin, Blainville’s beaked whale/Blainvilles beaked whale',
    raptor: 'R: Sparrowhawk, Hobby, Merlin, Tawny owl, Little owl, Long-eared owl/Long eared owl, Short-eared owl/Short eared owl, Snowy owl, Eagle owl, Harpy eagle\nF: Crested serpent eagle, African fish eagle, Snail kite, Palm-nut vulture/Palm nut vulture',
    marsupial: 'R: Red kangaroo, Eastern grey kangaroo, Western grey kangaroo, Red-necked wallaby/Red necked wallaby, Swamp wallaby, Rock wallaby, Southern hairy-nosed wombat/Southern hairy nosed wombat, Northern hairy-nosed wombat/Northern hairy nosed wombat, Greater bilby, Common brushtail possum\nF: Honey possum, Marsupial mole, Kowari, Kultarr',
    bones: 'R: Frontal bone, Parietal bone, Temporal bone, Occipital bone, Sphenoid, Nasal bone, Maxilla, Zygomatic bone, Lacrimal bone, Palatine bone\nF: Hamate, Capitate, Scaphoid, Lunate',
    cell: 'R: Cilium/Cilia, Chromosome, Chromatin, Nuclear envelope, Nuclear pore, Centrosome, Vesicle, Microtubule, Microfilament, Intermediate filament\nF: Desmosome, Gap junction, Tight junction, Actin cortex',
    energy: 'R: Coal, Oil/Petroleum, Natural gas, Hydrogen, Biofuel, Biogas, Ethanol, Biodiesel, Wood, Charcoal\nF: Flywheel energy storage, Compressed air energy, Salinity gradient power/Blue energy, Fusion energy',
    unit: 'R: Inch, Foot/Feet, Yard, Ounce, Pound, Stone, Acre, Hectare, Gallon, Pint\nF: Angstrom/Ångström, Furlong, Barn, Jansky',
    spacecraft: 'R: Vostok 1, Luna 2, Luna 9, Luna 16, Viking 1, Viking 2, Pioneer 10, Pioneer 11, Mariner 4, Mariner 10\nF: Deep Space 1, Deep Impact, Stardust, NEAR Shoemaker',
    disneyvillain: 'R: Prince John, King Candy, Hans/Prince Hans, Ernesto de la Cruz, Bellwether/Dawn Bellwether, Te Kā/Te Ka, Tamatoa, Governor Ratcliffe, Clayton\nF: Alameda Slim, Sykes, Percival C McLeach/McLeach, Commander Rourke/Rourke',
    pixar: 'O: Toy Story 2, Toy Story 3, Toy Story 4, Cars 2, Cars 3, Finding Dory, Incredibles 2, Inside Out 2, Monsters University, Lightyear\nR: Toy Story 5',
    ghibli: 'O: Nausicaä of the Valley of the Wind/Nausicaa of the Valley of the Wind, Tales from Earthsea, The Secret World of Arrietty/Arrietty, The Boy and the Heron, The Red Turtle',
    sitcom: 'R: The Good Place, New Girl, Abbott Elementary, Superstore, Schitt’s Creek/Schitts Creek, Only Fools and Horses, Fawlty Towers, Father Ted, The IT Crowd, Friday Night Dinner\nF: Green Wing, People Just Do Nothing, Man Down, We Are Lady Parts',
    doctorwho: 'R: Sarah Jane Smith, Susan Foreman, Ian Chesterton, Barbara Wright, Jamie McCrimmon, Jo Grant, Ace, Bill Potts, Nardole, Yasmin Khan/Yaz\nF: Vislor Turlough, Tegan Jovanka, Nyssa, Kamelion',
    startrek: 'R: Beverly Crusher, Wesley Crusher, Tom Paris, B’Elanna Torres/Belanna Torres, Harry Kim, Tuvok, Chakotay, Neelix, Kes, Jonathan Archer\nF: Travis Mayweather, Malcolm Reed, Phlox, Porthos',
    starwarsplanet: 'R: Yavin 4/Yavin IV, Jedha, Eadu, Lah’mu/Lahmu, Wobani, Canto Bight, Cantonica, Exegol, Kijimi, Kef Bir\nF: Peridea, Bracca, Zeffo, Bogano',
    potterspell: 'R: Nox, Crucio, Imperio, Diffindo, Reducto, Reducio, Engorgio, Duro, Silencio, Confundo\nF: Locomotor Mortis, Tarantallegra, Waddiwasi, Avis',
    friendschar: 'R: Ben Geller/Ben, Emma Geller/Emma, David the Scientist Guy/David, Ursula Buffay/Ursula, Jill Green/Jill, Amy Green/Amy, Pete Becker/Pete, Charlie Wheeler/Charlie, Kathy, Tag Jones/Tag\nF: Paolo, Julie, Gary',
    superpower: 'R: X-ray vision/X ray vision, Heat vision, Night vision, Water breathing, Immortality, Invulnerability, Elasticity, Duplication, Energy absorption, Pyrokinesis\nF: Cryokinesis, Electrokinesis, Hydrokinesis, Geokinesis',
    poetic: 'R: Iambic pentameter, Trochee, Dactyl, Anapest, Meter/Metre, Blank verse, Free verse, Couplet, Quatrain, Elegy\nF: Sestina, Villanelle, Terza rima, Pantoum',
    punctuation: 'R: Slash/Forward slash, Backslash, Bracket, Parenthesis/Parentheses, Brace/Curly bracket, Quotation mark, Ampersand, At sign, Percent sign, Number sign/Hash sign\nF: Per mille sign, Lozenge, Prime, Asterism',
    philosopher: 'R: Thomas Hobbes, John Stuart Mill, Jeremy Bentham, Bertrand Russell, Ludwig Wittgenstein, Søren Kierkegaard/Soren Kierkegaard, Arthur Schopenhauer, Georg Wilhelm Friedrich Hegel/Hegel, Thomas Aquinas, Augustine of Hippo\nF: Ibn Sina/Avicenna, Ibn Rushd/Averroes, Nagarjuna, Dogen',
    painter: 'R: Paul Cézanne/Paul Cezanne, Edgar Degas, Pierre-Auguste Renoir/Renoir, Édouard Manet/Edouard Manet, Paul Gauguin, Gustav Klimt, Egon Schiele, Wassily Kandinsky, Piet Mondrian, Joan Miró/Joan Miro\nF: Tarsila do Amaral, Wifredo Lam, Beauford Delaney, Fahrelnissa Zeid',
    fabric: 'R: Fleece, Flannel, Jersey, Calico, Canvas, Hessian/Burlap, Lace, Tulle, Crepe/Crêpe, Georgette\nF: Buckram, Voile, Lawn, Ottoman',
    martial: 'R: Krav Maga, Hapkido, Tang Soo Do, Jeet Kune Do, Wing Chun, Tai chi/Taijiquan, Jujutsu/Jujitsu, Kenjutsu, Iaido, Naginatajutsu\nF: Shuai jiao, Kurash, Ssireum, Glima',
    athletic: 'R: 400 metres/400m, 800 metres/800m, 1500 metres/1500m, 5000 metres/5000m, 10000 metres/10000m, 100 metres hurdles/100m hurdles, 110 metres hurdles/110m hurdles, 4 × 100 metres relay/4x100m relay, Half marathon, Cross country running\nF: 60 metres/60m, 60 metres hurdles/60m hurdles, 3000 metres/3000m, Distance medley relay',
    swimstroke: 'R: Breaststroke kick, Breaststroke pullout, Butterfly kick, Two-beat kick/Two beat kick, Six-beat kick/Six beat kick, Catch-up drill/Catch up drill, Bilateral breathing, Open turn, Backstroke start, Freestyle catch\nF: Early vertical forearm, Fingertip drag drill, Zipper drill, Closed-fist drill/Closed fist drill',
    chessopening: 'R: King’s Gambit/Kings Gambit, Scotch Game, Four Knights Game, Two Knights Defence/Two Knights Defense, Petroff Defence/Petrov Defense, Philidor Defence/Philidor Defense, Budapest Gambit, Benoni Defence/Benoni Defense, Modern Defence/Modern Defense, Catalan Opening\nF: Sokolsky Opening, Orangutan Opening, Trompowsky Attack, Torre Attack',
    minecraftblock: 'R: Oak log, Oak planks, Crafting table, Furnace, Chest, Barrel, Hopper, Dispenser, Dropper, Observer\nF: Target block, Sculk shrieker, Crafter, Vault',
    minecraftbiome: 'R: Meadow, Grove, Snowy slopes, Jagged peaks, Frozen peaks, Stony peaks, Lush caves, Dripstone caves, Deep dark, Pale garden\nF: Nether wastes, Crimson forest, Small end islands, End midlands',
    sonicchar: 'R: Ray the Flying Squirrel/Ray, Tikal, Chaos, E-102 Gamma/Gamma, E-123 Omega/Omega, Maria Robotnik/Maria, Gerald Robotnik/Gerald, Mephiles, Infinite, Zavok\nF: Sticks the Badger/Sticks, Marine the Raccoon/Marine, Trip the Sungazer/Trip, Bean the Dynamite/Bean',
    zeldaitem: 'R: Pegasus Boots, Power Bracelet, Roc’s Feather/Rocs Feather, Magic Mirror, Magic Cape, Fire Arrow, Ice Arrow, Light Arrow, Deku Nut, Bombchu\nF: Cane of Byrna, Mermaid Suit, Mole Mitts, Ball and Chain',
    musictempo: 'R: Diminuendo, Decrescendo, Legato, Staccato, Tenuto, Marcato, Rubato, A tempo, Da capo, Dal segno\nF: Prestissimo, Larghissimo, Stringendo, Smorzando',
    musicensemble: 'R: Barbershop quartet, Octet, Nonet, Septet, String trio, Piano trio, Piano quartet, Woodwind quintet, Brass quintet, Percussion ensemble\nF: Charanga, Batucada, Fife and drum corps, Taiko ensemble',
    navigation: 'R: Chronometer/Marine chronometer, Speed log, Inertial navigation, Celestial navigation, Pilotage, LORAN, AIS/Automatic identification system, ECDIS, Radio beacon, Radio direction finder\nF: Decca Navigator, Gunter’s quadrant/Gunters quadrant, Davis quadrant, Reflecting circle',
  };
  const key = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [id, lines] of Object.entries(extras)) {
    const q = BANK_SRC.find(q => q.id === id);
    const known = new Set(q.a.split('\n').flatMap(line => line.replace(/^[CHORFX]:\s*/, '').split(',')).flatMap(s => s.split('/').map(key)));
    for (const line of lines.split('\n')) {
      const items = line.slice(3).split(',').map(s => s.trim()).filter(item => {
        const aliases = item.split('/').map(key);
        if (aliases.some(k => known.has(k))) return false;
        aliases.forEach(k => known.add(k)); return true;
      });
      if (items.length) q.a += '\n' + line.slice(0, 3) + items.join(', ');
    }
  }
})();
