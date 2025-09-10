import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/Layout/DashboardShell';
import Image from 'next/image';

// Riot Data Dragon version (latest from https://ddragon.leagueoflegends.com/api/versions.json)
const ddragonVersion = "14.8.1";

export default function Competitive() {
  const [stats, setStats] = useState({});
  const [totalMatches, setTotalMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');

  // Available JSON files in the project directory
  const jsonFiles = [
    'events_2826097_grid.jsonl',
    'sample_match_data.json',
    'match_data_1.json',
    'match_data_2.json',
    'match_data_3.json',
    'competitive_matches.json',
    'scrim_data.json',
    'tournament_data.json'
  ];

  useEffect(() => {
    // Set initial files as fallback
    setAvailableFiles(jsonFiles);
    
    // Fetch available files from the API
    fetchAvailableFiles();
  }, []);

  const fetchAvailableFiles = async () => {
    try {
      const response = await fetch('/api/list-json-files');
      if (response.ok) {
        const files = await response.json();
        setAvailableFiles(files);
      }
    } catch (error) {
      console.error('Error fetching available files:', error);
    }
  };

  const handleFileSelect = async (filename: string) => {
    if (!filename) return;

    setIsLoading(true);
    setSelectedFile(filename);

    try {
      // Load file directly from the API endpoint
      const response = await fetch(`/api/load-json?file=${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }

      const data = await response.json();
      console.log('Loaded data:', data);
      console.log('Data type:', typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('First item:', data[0]);
        console.log('First item events:', data[0]?.events);
      }
      
      processEvents(data);
    } catch (error) {
      console.error('Error loading file:', error);
      alert(`Failed to load ${filename}. Please ensure the file exists in the project directory.`);
    } finally {
      setIsLoading(false);
    }
  };

  const processEvents = (data: any) => {
    console.log('Processing events with data:', data);
    const newStats: { [key: string]: { picks: number; wins: number; bans: number } } = {};
    const picksByTeam: { [key: string]: any } = {};
    let matchCount = 0;

    // Handle both single match data and array of matches
    const matches = Array.isArray(data) ? data : [data];
    console.log('Matches to process:', matches.length);

    matches.forEach((match, index) => {
      console.log(`Processing match ${index}:`, match);
      if (!match.events) {
        console.log(`Match ${index} has no events, skipping`);
        return;
      }
      console.log(`Match ${index} has ${match.events.length} events`);

              match.events.forEach((ev: any, evIndex: number) => {
          console.log(`Event ${evIndex}:`, ev.type, ev);
          
          if (ev.type === 'team-picked-character') {
          const champName = extractChampionNameFromEvent(ev);
          if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
          newStats[champName].picks++;

          const team = ev.actor?.id || ev.teamId;
          if (!picksByTeam[team]) picksByTeam[team] = [];
          picksByTeam[team].push(champName);
        }

        // Handle Grid.gg draft actions
        if (ev.type === 'grid-sampled-feed' && match.seriesState?.draftActions) {
          match.seriesState.draftActions.forEach((draftAction: any) => {
            if (draftAction.type === 'pick') {
              const champName = draftAction.draftable?.name;
              if (champName) {
                if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
                newStats[champName].picks++;

                const teamId = draftAction.drafter?.id;
                if (teamId) {
                  if (!picksByTeam[teamId]) picksByTeam[teamId] = [];
                  picksByTeam[teamId].push(champName);
                }
              }
            } else if (draftAction.type === 'ban') {
              const champName = draftAction.draftable?.name;
              if (champName) {
                if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
                newStats[champName].bans++;
              }
            }
          });
        }

        if (ev.type === 'team-banned-character') {
          const champName = extractChampionNameFromEvent(ev);
          if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
          newStats[champName].bans++;
        }

        if (ev.type === 'team-won-game') {
          matchCount++;
          const team = ev.actor?.id || ev.teamId;
          const champs = picksByTeam[team] || [];
          champs.forEach((champName: string) => {
            if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
            newStats[champName].wins++;
          });
        }

        // Handle Grid.gg specific events
        if (ev.type === 'series-ended-game') {
          matchCount++;
          // Find the winning team from the series state
          if (match.seriesState && match.seriesState.teams) {
            const winningTeam = match.seriesState.teams.find((team: any) => team.won);
            if (winningTeam) {
              const teamId = winningTeam.id;
              const champs = picksByTeam[teamId] || [];
              champs.forEach((champName: string) => {
                if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
                newStats[champName].wins++;
              });
            }
          }
        }

        // Handle Grid.gg team won series
        if (ev.type === 'team-won-series') {
          matchCount++;
          const teamId = ev.actor?.id;
          if (teamId) {
            const champs = picksByTeam[teamId] || [];
            champs.forEach((champName: string) => {
              if (!newStats[champName]) newStats[champName] = { picks: 0, wins: 0, bans: 0 };
              newStats[champName].wins++;
            });
          }
        }
      });
    });

    setStats(newStats);
    setTotalMatches(matchCount);
  };

  // Extract champion name properly from event data
  const extractChampionNameFromEvent = (ev: any) => {
    let name = ev.target?.state?.name || ev.target?.name || ev.target?.id;
    if (!name) return "Unknown";

    // Remove ability suffix like "-r", "-q", etc.
    name = name.split('-')[0];

    // Handle Grid.gg specific champion name format
    if (ev.target?.state?.type === 'character') {
      name = ev.target.state.name;
    }

    // For Grid.gg, champion names might be in the target directly
    if (ev.target?.name && typeof ev.target.name === 'string') {
      name = ev.target.name;
    }

    console.log('Extracted champion name:', name, 'from event:', ev);
    return riotChampionNameMap(name);
  };

  // Map Riot internal names to Data Dragon champion filenames
  const riotChampionNameMap = (baseName: string) => {
    const map = {
      "monkey": "Wukong",
      "monkeyking": "Wukong",
      "monkey-king": "Wukong",
      "ahri": "Ahri",
      "aatrox": "Aatrox",
      "akali": "Akali",
      "akshan": "Akshan",
      "alistar": "Alistar",
      "amumu": "Amumu",
      "anivia": "Anivia",
      "annie": "Annie",
      "aphelios": "Aphelios",
      "ashe": "Ashe",
      "aurelionsol": "AurelionSol",
      "azir": "Azir",
      "bard": "Bard",
      "belveth": "Belveth",
      "blitzcrank": "Blitzcrank",
      "brand": "Brand",
      "braum": "Braum",
      "caitlyn": "Caitlyn",
      "camille": "Camille",
      "cassiopeia": "Cassiopeia",
      "chogath": "Chogath",
      "corki": "Corki",
      "darius": "Darius",
      "diana": "Diana",
      "draven": "Draven",
      "drmundo": "DrMundo",
      "ekko": "Ekko",
      "elise": "Elise",
      "evelynn": "Evelynn",
      "ezreal": "Ezreal",
      "fiddlesticks": "Fiddlesticks",
      "fiora": "Fiora",
      "fizz": "Fizz",
      "galio": "Galio",
      "gangplank": "Gangplank",
      "garen": "Garen",
      "gnar": "Gnar",
      "gragas": "Gragas",
      "graves": "Graves",
      "gwen": "Gwen",
      "hecarim": "Hecarim",
      "heimerdinger": "Heimerdinger",
      "illaoi": "Illaoi",
      "irelia": "Irelia",
      "ivern": "Ivern",
      "janna": "Janna",
      "jarvaniv": "JarvanIV",
      "jax": "Jax",
      "jayce": "Jayce",
      "jhin": "Jhin",
      "jinx": "Jinx",
      "kaisa": "Kaisa",
      "kalista": "Kalista",
      "karma": "Karma",
      "karthus": "Karthus",
      "kassadin": "Kassadin",
      "katarina": "Katarina",
      "kayle": "Kayle",
      "kayn": "Kayn",
      "kennen": "Kennen",
      "khazix": "Khazix",
      "kindred": "Kindred",
      "kled": "Kled",
      "kogmaw": "KogMaw",
      "leblanc": "Leblanc",
      "leesin": "LeeSin",
      "leona": "Leona",
      "lillia": "Lillia",
      "lissandra": "Lissandra",
      "lucian": "Lucian",
      "lulu": "Lulu",
      "lux": "Lux",
      "malphite": "Malphite",
      "malzahar": "Malzahar",
      "maokai": "Maokai",
      "masteryi": "MasterYi",
      "milio": "Milio",
      "missfortune": "MissFortune",
      "mordekaiser": "Mordekaiser",
      "morgana": "Morgana",
      "nami": "Nami",
      "nasus": "Nasus",
      "nautilus": "Nautilus",
      "neeko": "Neeko",
      "nidalee": "Nidalee",
      "nilah": "Nilah",
      "nocturne": "Nocturne",
      "nunu": "Nunu",
      "olaf": "Olaf",
      "orianna": "Orianna",
      "ornn": "Ornn",
      "pantheon": "Pantheon",
      "poppy": "Poppy",
      "pyke": "Pyke",
      "qiyana": "Qiyana",
      "quinn": "Quinn",
      "rakan": "Rakan",
      "rammus": "Rammus",
      "reksai": "RekSai",
      "rell": "Rell",
      "renata": "Renata",
      "renekton": "Renekton",
      "rengar": "Rengar",
      "riven": "Riven",
      "rumble": "Rumble",
      "ryze": "Ryze",
      "samira": "Samira",
      "sejuani": "Sejuani",
      "senna": "Senna",
      "seraphine": "Seraphine",
      "sett": "Sett",
      "shaco": "Shaco",
      "shen": "Shen",
      "shyvana": "Shyvana",
      "singed": "Singed",
      "sion": "Sion",
      "sivir": "Sivir",
      "skarner": "Skarner",
      "sona": "Sona",
      "soraka": "Soraka",
      "swain": "Swain",
      "sylas": "Sylas",
      "syndra": "Syndra",
      "tahmkench": "TahmKench",
      "taliyah": "Taliyah",
      "talon": "Talon",
      "taric": "Taric",
      "teemo": "Teemo",
      "thresh": "Thresh",
      "tristana": "Tristana",
      "trundle": "Trundle",
      "tryndamere": "Tryndamere",
      "twistedfate": "TwistedFate",
      "twitch": "Twitch",
      "udyr": "Udyr",
      "urgot": "Urgot",
      "varus": "Varus",
      "vayne": "Vayne",
      "veigar": "Veigar",
      "velkoz": "Velkoz",
      "vex": "Vex",
      "vi": "Vi",
      "viego": "Viego",
      "viktor": "Viktor",
      "vladimir": "Vladimir",
      "volibear": "Volibear",
      "warwick": "Warwick",
      "xayah": "Xayah",
      "xerath": "Xerath",
      "xinzhao": "XinZhao",
      "yasuo": "Yasuo",
      "yone": "Yone",
      "yorick": "Yorick",
      "yuumi": "Yuumi",
      "zac": "Zac",
      "zed": "Zed",
      "zeri": "Zeri",
      "ziggs": "Ziggs",
      "zilean": "Zilean",
      "zoe": "Zoe",
      "zyra": "Zyra"
    };
    return (map as { [key: string]: string })[baseName.toLowerCase()] || capitalizeFirstLetter(baseName);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Sort champions by pick rate for better display
  const sortedChampions = Object.keys(stats).sort((a, b) => {
    return stats[b].picks - stats[a].picks;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Competitive Analysis</h1>
          <p className="text-gray-400">League of Legends competitive match statistics and champion analysis</p>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">
            League of Legends Stats Dashboard
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Match Data File
            </label>
            <select
              value={selectedFile}
              onChange={(e) => handleFileSelect(e.target.value)}
              className="block w-full text-sm text-gray-300 bg-dark-700 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a JSON file...</option>
              {availableFiles.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-400">
              Select a JSON file from your project directory to analyze competitive match data
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-gray-400">Processing match data...</p>
            </div>
          )}
        </div>

        {Object.keys(stats).length > 0 && (
          <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Champion Statistics
              </h2>
              <p className="text-gray-400">
                Total Matches Analyzed: <span className="font-semibold text-white">{totalMatches}</span>
              </p>
              <p className="text-gray-400">
                Champions Found: <span className="font-semibold text-white">{Object.keys(stats).length}</span>
              </p>
              <p className="text-gray-400">
                Selected File: <span className="font-semibold text-primary-300">{selectedFile}</span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-white/10">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Champion
                    </th>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Pick Rate
                    </th>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ban Rate
                    </th>
                    <th className="border border-white/10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Picks/Wins/Bans
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-white/10">
                  {sortedChampions.map((champName, index) => {
                    const s = stats[champName];
                    const winRate = s.picks ? ((s.wins / s.picks) * 100).toFixed(2) + '%' : '0%';
                    const pickRate = totalMatches ? ((s.picks / totalMatches) * 100).toFixed(2) + '%' : '0%';
                    const banRate = totalMatches ? ((s.bans / totalMatches) * 100).toFixed(2) + '%' : '0%';
                    const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${champName}.png`;

                    return (
                      <tr key={champName} className={index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-700'}>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {champName}
                        </td>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                          <img
                            src={imgUrl}
                            alt={champName}
                            width={40}
                            height={40}
                            className="rounded-lg"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/40/40';
                              e.target.onerror = null;
                            }}
                          />
                        </td>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`font-medium ${
                            parseFloat(winRate) >= 60 ? 'text-green-400' : 
                            parseFloat(winRate) >= 50 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {winRate}
                          </span>
                        </td>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="font-medium text-blue-400">{pickRate}</span>
                        </td>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="font-medium text-red-400">{banRate}</span>
                        </td>
                        <td className="border border-white/10 px-4 py-4 whitespace-nowrap text-xs text-gray-400">
                          {s.picks}/{s.wins}/{s.bans}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sortedChampions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No champion data found. Please select a valid match data file.</p>
              </div>
            )}
          </div>
        )}

        {Object.keys(stats).length === 0 && !isLoading && (
          <div className="bg-dark-800 rounded-lg p-8 text-center border border-white/10">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400">
              Select a JSON file from the dropdown above to analyze competitive match data and see champion statistics.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Place your JSON files in the project directory and they will appear in the dropdown.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
