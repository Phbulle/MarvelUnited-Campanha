import { useState, useEffect } from 'react';
import './App.css';
import { MapViewer } from './components/MapViewer';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import type { MapMarker, Hero, ToolType } from './types';
import { supabase } from './supabase';

function App() {
  const [session, setSession] = useState<any>(null);
  const [tool, setTool] = useState<ToolType>('pan');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const [loadingData, setLoadingData] = useState(true);

  // States
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [roster, setRoster] = useState<Hero[]>([]);
  const [victoryPoints, setVictoryPoints] = useState<number>(0);
  const [gears, setGears] = useState<number>(0);
  const [brains, setBrains] = useState<number>(0);
  const [keys, setKeys] = useState<number>(0);
  const [heroicTokens, setHeroicTokens] = useState<number>(0);
  const [moveTokens, setMoveTokens] = useState<number>(0);
  const [attackTokens, setAttackTokens] = useState<number>(0);
  const [wildTokens, setWildTokens] = useState<number>(0);

  // Load from Supabase
  useEffect(() => {
    if (!session) return;
    
    const loadData = async () => {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (data && data.data) {
        const d = data.data as any;
        setMarkers(d.markers || []);
        setRoster(d.roster || []);
        setVictoryPoints(d.victoryPoints || 0);
        setGears(d.gears || 0);
        setBrains(d.brains || 0);
        setKeys(d.keys || 0);
        setHeroicTokens(d.heroicTokens || 0);
        setMoveTokens(d.moveTokens || 0);
        setAttackTokens(d.attackTokens || 0);
        setWildTokens(d.wildTokens || 0);
      }
      setLoadingData(false);
    };
    
    loadData();
  }, [session]);

  // Save to Supabase
  useEffect(() => {
    if (!session || loadingData) return;

    const saveData = async () => {
      const payload = {
        markers, roster, victoryPoints, gears, brains, keys,
        heroicTokens, moveTokens, attackTokens, wildTokens
      };
      
      await supabase.from('campaigns').upsert({
        user_id: session.user.id,
        data: payload
      });
    };

    const timeoutId = setTimeout(saveData, 1000); // 1s debounce
    return () => clearTimeout(timeoutId);
  }, [session, loadingData, markers, roster, victoryPoints, gears, brains, keys, heroicTokens, moveTokens, attackTokens, wildTokens]);

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

  if (!session) {
    return <Login />;
  }

  if (loadingData) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Carregando campanha...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        session={session}
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
