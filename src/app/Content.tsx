'use client';

import { url } from 'inspector';
import { useEffect, useState } from 'react';

interface ServerData {
  url: string;
  region: string;
  currentPlayerCount: number;
  maxPlayerCount: number;
  map: {
    name: string;
    version: string;
    gameMode: number;
    customMode: number;
    customModeSettings: number;
    description?: string;
  };
  time: number;
}

function parseData(data: any): ServerData[] {
  const parsedData: ServerData[] = [];
  data.games.forEach((server: any) => {
    const serverData: ServerData = {
      url: server[0],
      region: server[1],
      currentPlayerCount: server[2],
      maxPlayerCount: server[3],
      map: {
        name: server[4].i,
        version: server[4].v,
        gameMode: server[4].g,
        customMode: server[4].c,
        customModeSettings: server[4].cm,
        description: server[4].h ? server[4].h : '',
      },
      time: server[5],
    };
    parsedData.push(serverData);
  });
  return parsedData;
}

async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  const parsedData = parseData(data);
  return parsedData;
}
export function Content() {
  const [data, setData] = useState<ServerData[]>([]);
  const filteredData = data.filter((server) => server.map.customMode === 0);
  const tokServer = filteredData.filter((server) => server.url.startsWith('TOK'));
  const sortPing = tokServer.sort((a, b) => a.time - b.time);
  const sortPing2 = sortPing.sort((a, b) => b.currentPlayerCount - a.currentPlayerCount);
  useEffect(() => {
    getData().then((data) => setData(data));

    let interval = setInterval(() => {
      getData().then((data) => setData(data));
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (

    <table className="w-full h-screen p-2">
      <thead>
        <tr className="[&>th]:text-2xl">
          <th>URL</th>
          <th>Region</th>
          <th>Players</th>
          <th>maxPlayers</th>
          <th>Map Name</th>
          {/* <th>Map Version</th> */}
          <th>Map Mode</th>
          <th>customMode</th>
          <th>customModeSettings</th>
          {/* <th>description</th> */}
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {sortPing2.map((server) => (
          <tr className="text-xl [&>td]:text-center border-b border-gray-600 hover:bg-gray-500" key={server.url}>
            <td>{server.url}</td>
            <td>{server.region}</td>
            <td>{server.currentPlayerCount}</td>
            <td>{server.maxPlayerCount}</td>
            <td>{server.map.name}</td>
            {/* <td>{server.map.version}</td> */}
            <td>{server.map.gameMode}</td>
            <td>{server.map.customMode}</td>
            <td>{server.map.customModeSettings}</td>
            {/* <td>{server.map.description}</td> */}
            <td>{server.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

