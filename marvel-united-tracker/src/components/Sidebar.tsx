import React, { useState } from 'react';
import type { Hero, ToolType } from '../types';
import { Hand, CircleCheck, XCircle, Plus, Trash2, Crosshair, Skull, Settings, Brain, Key, Star, ArrowUpRight, Zap, Sparkles, BookOpen, Users, SlidersHorizontal } from 'lucide-react';

interface SidebarProps {
  tool: ToolType;
  setTool: (t: ToolType) => void;
  roster: Hero[];
  setRoster: React.Dispatch<React.SetStateAction<Hero[]>>;
  victoryPoints: number;
  setVictoryPoints: (vp: number) => void;
  gears: number;
  setGears: (val: number) => void;
  brains: number;
  setBrains: (val: number) => void;
  keys: number;
  setKeys: (val: number) => void;
  heroicTokens: number;
  setHeroicTokens: (val: number) => void;
  moveTokens: number;
  setMoveTokens: (val: number) => void;
  attackTokens: number;
  setAttackTokens: (val: number) => void;
  wildTokens: number;
  setWildTokens: (val: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  tool, setTool, roster, setRoster, victoryPoints, setVictoryPoints,
  gears, setGears, brains, setBrains, keys, setKeys,
  heroicTokens, setHeroicTokens, moveTokens, setMoveTokens, attackTokens, setAttackTokens, wildTokens, setWildTokens
}) => {
  const [newHeroName, setNewHeroName] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'roster'>('tools');

  const handleAddHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroName.trim()) return;
    
    setRoster([...roster, {
      id: Date.now().toString(),
      name: newHeroName.trim(),
      status: 'available'
    }]);
    setNewHeroName('');
  };

  const toggleHeroStatus = (id: string) => {
    setRoster(roster.map(hero => 
      hero.id === id 
        ? { ...hero, status: hero.status === 'available' ? 'lost' : 'available' } 
        : hero
    ));
  };

  const removeHero = (id: string) => {
    setRoster(roster.filter(hero => hero.id !== id));
  };

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2>Marvel United</h2>
        <p>Campaign Tracker</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button 
            className="tool-btn"
            onClick={() => window.open('/regras.pdf', '_blank')}
            style={{ flex: 1, justifyContent: 'center', background: 'var(--accent-color)', color: 'var(--bg-color)', fontWeight: 'bold', padding: '8px', fontSize: '0.9rem' }}
            title="Regras da Campanha"
          >
            <BookOpen size={18} />
            Campanha
          </button>
          <button 
            className="tool-btn"
            onClick={() => window.open('/manual.pdf', '_blank')}
            style={{ flex: 1, justifyContent: 'center', background: 'var(--accent-color)', color: 'var(--bg-color)', fontWeight: 'bold', padding: '8px', fontSize: '0.9rem' }}
            title="Manual do Jogo Base"
          >
            <BookOpen size={18} />
            Jogo Base
          </button>
        </div>
      </div>

      <div className="sidebar-tabs" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '12px' }}>
        <button 
          className={`tool-btn ${activeTab === 'tools' ? 'active' : ''}`}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setActiveTab('tools')}
        >
          <SlidersHorizontal size={18} /> Painel
        </button>
        <button 
          className={`tool-btn ${activeTab === 'roster' ? 'active' : ''}`}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setActiveTab('roster')}
        >
          <Users size={18} /> Heróis ({roster.length})
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
        <div style={{ display: activeTab === 'tools' ? 'flex' : 'none', flexDirection: 'column', gap: '20px' }}>
          <div className="tools-section">
        <h3 className="section-title">Map Tools</h3>
        
        <button 
          className={`tool-btn ${tool === 'pan' ? 'active' : ''}`}
          onClick={() => setTool('pan')}
        >
          <Hand size={20} />
          Pan & Zoom
        </button>
        
        <button 
          className={`tool-btn ${tool === 'unlocked' ? 'active' : ''}`}
          onClick={() => setTool('unlocked')}
        >
          <CircleCheck size={20} />
          Mark Unlocked (Circle)
        </button>
        
        <button 
          className={`tool-btn ${tool === 'defeated' ? 'active-danger' : ''}`}
          onClick={() => setTool('defeated')}
        >
          <XCircle size={20} />
          Mark Defeated/Used (Cross)
        </button>
      </div>

      <div className="vp-tracker">
        <div className="vp-title">VICTORY POINTS</div>
        <div className="vp-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="icon-btn" 
            onClick={() => setVictoryPoints(Math.max(0, victoryPoints - 1))}
          >
            -
          </button>
          <div className="vp-value">{victoryPoints}</div>
          <button 
            className="icon-btn" 
            onClick={() => setVictoryPoints(victoryPoints + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="resources-section" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Settings size={20} color="var(--text-secondary)" title="Engrenagens" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setGears(Math.max(0, gears - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{gears}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setGears(gears + 1)}>+</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Brain size={20} color="var(--text-secondary)" title="Cérebros" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setBrains(Math.max(0, brains - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{brains}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setBrains(brains + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Key size={20} color="var(--text-secondary)" title="Chaves" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setKeys(Math.max(0, keys - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{keys}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setKeys(keys + 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="bonus-tokens-section" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Star size={20} color="#ffd700" title="Heroico" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setHeroicTokens(Math.max(0, heroicTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{heroicTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setHeroicTokens(heroicTokens + 1)}>+</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <ArrowUpRight size={20} color="var(--success-color)" title="Movimento" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setMoveTokens(Math.max(0, moveTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{moveTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setMoveTokens(moveTokens + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Zap size={20} color="var(--danger-color)" title="Ataque" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setAttackTokens(Math.max(0, attackTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{attackTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setAttackTokens(attackTokens + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={20} color="var(--text-primary)" title="Coringa (Wild)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setWildTokens(Math.max(0, wildTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{wildTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setWildTokens(wildTokens + 1)}>+</button>
          </div>
        </div>
      </div>

        </div>
        <div style={{ display: activeTab === 'roster' ? 'flex' : 'none', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="roster-section" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flexShrink: 1, flexGrow: 1 }}>
        <h3 className="section-title">Hero Roster</h3>
        
        <form className="add-hero-form" onSubmit={handleAddHero}>
          <input 
            type="text" 
            className="add-hero-input" 
            placeholder="Add a hero..." 
            value={newHeroName}
            onChange={(e) => setNewHeroName(e.target.value)}
          />
          <button type="submit" className="add-hero-btn">
            <Plus size={20} />
          </button>
        </form>

        <div className="roster-list">
          {roster.map(hero => (
            <div key={hero.id} className="hero-item">
              <div className="hero-item-content">
                <div className={`hero-status ${hero.status === 'lost' ? 'lost' : ''}`} />
                <span style={{ textDecoration: hero.status === 'lost' ? 'line-through' : 'none', opacity: hero.status === 'lost' ? 0.5 : 1 }}>
                  {hero.name}
                </span>
              </div>
              <div className="hero-actions">
                <button 
                  className="icon-btn" 
                  onClick={() => toggleHeroStatus(hero.id)}
                  title={hero.status === 'available' ? 'Mark as Lost' : 'Recover Hero'}
                >
                  {hero.status === 'available' ? <Skull size={16} /> : <Crosshair size={16} />}
                </button>
                <button 
                  className="icon-btn danger" 
                  onClick={() => removeHero(hero.id)}
                  title="Remove from roster"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {roster.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px', fontSize: '0.9rem' }}>
              Your roster is empty. <br/> Add unlocked heroes above!
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};
