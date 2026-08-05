import { useState, useEffect } from 'react';
import './App.css';
import { MapViewer } from './components/MapViewer';
import { Sidebar } from './components/Sidebar';
import type { MapMarker, Hero, ToolType } from './types';

function App() {
  const [tool, setTool] = useState<ToolType>('pan');
  
  // Load state from local storage or use defaults
  const [markers, setMarkers] = useState<MapMarker[]>(() => {
    const saved = localStorage.getItem('mu-campaign-markers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [roster, setRoster] = useState<Hero[]>(() => {
    const saved = localStorage.getItem('mu-campaign-roster');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [victoryPoints, setVictoryPoints] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-vp');
    return saved ? JSON.parse(saved) : 0;
  });

  const [gears, setGears] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-gears');
    return saved ? JSON.parse(saved) : 0;
  });

  const [brains, setBrains] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-brains');
    return saved ? JSON.parse(saved) : 0;
  });

  const [keys, setKeys] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-keys');
    return saved ? JSON.parse(saved) : 0;
  });

  const [heroicTokens, setHeroicTokens] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-heroic');
    return saved ? JSON.parse(saved) : 0;
  });

  const [moveTokens, setMoveTokens] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-move');
    return saved ? JSON.parse(saved) : 0;
  });

  const [attackTokens, setAttackTokens] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-attack');
    return saved ? JSON.parse(saved) : 0;
  });

  const [wildTokens, setWildTokens] = useState<number>(() => {
    const saved = localStorage.getItem('mu-campaign-wild');
    return saved ? JSON.parse(saved) : 0;
  });

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('mu-campaign-markers', JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-roster', JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-vp', JSON.stringify(victoryPoints));
  }, [victoryPoints]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-gears', JSON.stringify(gears));
  }, [gears]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-brains', JSON.stringify(brains));
  }, [brains]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-keys', JSON.stringify(keys));
  }, [keys]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-heroic', JSON.stringify(heroicTokens));
  }, [heroicTokens]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-move', JSON.stringify(moveTokens));
  }, [moveTokens]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-attack', JSON.stringify(attackTokens));
  }, [attackTokens]);

  useEffect(() => {
    localStorage.setItem('mu-campaign-wild', JSON.stringify(wildTokens));
  }, [wildTokens]);

  const handleAddMarker = (x: number, y: number) => {
    if (tool === 'pan') return;
    
    setMarkers([...markers, {
      id: Date.now().toString(),
      x,
      y,
      type: tool
    }]);
  };

  const handleRemoveMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  return (
    <div className="app-container">
      <Sidebar 
        tool={tool} 
        setTool={setTool} 
        roster={roster} 
        setRoster={setRoster}
        victoryPoints={victoryPoints}
        setVictoryPoints={setVictoryPoints}
        gears={gears} setGears={setGears}
        brains={brains} setBrains={setBrains}
        keys={keys} setKeys={setKeys}
        heroicTokens={heroicTokens} setHeroicTokens={setHeroicTokens}
        moveTokens={moveTokens} setMoveTokens={setMoveTokens}
        attackTokens={attackTokens} setAttackTokens={setAttackTokens}
        wildTokens={wildTokens} setWildTokens={setWildTokens}
      />
      
      <main className="main-content">
        <MapViewer 
          markers={markers} 
          tool={tool} 
          onAddMarker={handleAddMarker}
          onRemoveMarker={handleRemoveMarker}
        />
      </main>
    </div>
  );
}

export default App;
