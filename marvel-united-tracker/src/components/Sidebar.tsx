import React, { useState } from 'react';
import type { Hero, ToolType } from '../types';
import { Hand, CircleCheck, XCircle, Plus, Trash2, Crosshair, Skull, Settings, Brain, Key, Star, ArrowUpRight, Zap, Sparkles, BookOpen, Users, SlidersHorizontal, LogOut, Moon, Sun } from 'lucide-react';
import { supabase } from '../supabase';

interface SidebarProps {
  session: any;
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
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  session, tool, setTool, roster, setRoster, victoryPoints, setVictoryPoints,
  gears, setGears, brains, setBrains, keys, setKeys,
  heroicTokens, setHeroicTokens, moveTokens, setMoveTokens, attackTokens, setAttackTokens, wildTokens, setWildTokens, className
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

  const removeHero = (id: string) => {
    setRoster(roster.filter(hero => hero.id !== id));
  };

  return (
    <div className={`sidebar glass-panel ${className || ''}`}>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Engrenagens">
          <Settings size={20} color="var(--text-secondary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setGears(Math.max(0, gears - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{gears}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setGears(gears + 1)}>+</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Cérebros">
          <Brain size={20} color="var(--text-secondary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setBrains(Math.max(0, brains - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{brains}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setBrains(brains + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Chaves">
          <Key size={20} color="var(--text-secondary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setKeys(Math.max(0, keys - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{keys}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setKeys(keys + 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="bonus-tokens-section" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Heroico">
          <Star size={20} color="#ffd700" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setHeroicTokens(Math.max(0, heroicTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{heroicTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setHeroicTokens(heroicTokens + 1)}>+</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Movimento">
          <ArrowUpRight size={20} color="var(--success-color)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setMoveTokens(Math.max(0, moveTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{moveTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setMoveTokens(moveTokens + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Ataque">
          <Zap size={20} color="var(--danger-color)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setAttackTokens(Math.max(0, attackTokens - 1))}>-</button>
            <span style={{ fontWeight: 600, width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{attackTokens}</span>
            <button className="icon-btn" style={{ width: '24px', height: '24px', minHeight: '24px' }} onClick={() => setAttackTokens(attackTokens + 1)}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }} title="Coringa (Wild)">
          <Sparkles size={20} color="var(--text-primary)" />
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
          {roster.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px', fontSize: '0.9rem' }}>
              Your roster is empty. <br/> Add unlocked heroes above!
            </div>
          )}

          {(['available', 'resting', 'lost'] as const).map(status => {
            const sectionHeroes = roster.filter(h => h.status === status);
            if (sectionHeroes.length === 0) return null;
            
            const titles: Record<string, string> = {
              available: 'Disponíveis',
              resting: 'Descansando',
              lost: 'Derrotados / Perdidos'
            };

            return (
              <div key={status} style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '0.8rem', 
                  textTransform: 'uppercase', 
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{titles[status]} ({sectionHeroes.length})</span>
                  {status === 'resting' && (
                    <button 
                      className="icon-btn" 
                      style={{ height: '24px', width: 'auto', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)' }}
                      onClick={() => {
                        setRoster(roster.map(h => h.status === 'resting' ? { ...h, status: 'available' } : h));
                      }}
                      title="Nova Rodada (Recuperar Todos)"
                    >
                      Nova Rodada
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sectionHeroes.map(hero => (
                    <div key={hero.id} className="hero-item">
                      <div className="hero-item-content">
                        <div className={`hero-status ${hero.status}`} />
                        <span style={{ 
                          textDecoration: hero.status === 'lost' ? 'line-through' : 'none', 
                          opacity: hero.status === 'lost' ? 0.5 : hero.status === 'resting' ? 0.8 : 1 
                        }}>
                          {hero.name}
                        </span>
                      </div>
                      <div className="hero-actions">
                        {hero.status === 'available' && (
                          <button 
                            className="icon-btn" 
                            onClick={() => setRoster(roster.map(h => h.id === hero.id ? { ...h, status: 'resting' } : h))}
                            title="Usar e Descansar"
                          >
                            <Moon size={16} />
                          </button>
                        )}
                        {hero.status === 'resting' && (
                          <button 
                            className="icon-btn" 
                            onClick={() => setRoster(roster.map(h => h.id === hero.id ? { ...h, status: 'available' } : h))}
                            title="Recuperar Herói"
                          >
                            <Sun size={16} />
                          </button>
                        )}
                        <button 
                          className="icon-btn" 
                          onClick={() => setRoster(roster.map(h => h.id === hero.id ? { ...h, status: hero.status === 'lost' ? 'available' : 'lost' } : h))}
                          title={hero.status === 'lost' ? 'Reviver' : 'Marcar como Derrotado'}
                        >
                          {hero.status === 'lost' ? <Crosshair size={16} /> : <Skull size={16} />}
                        </button>
                        <button 
                          className="icon-btn danger" 
                          onClick={() => removeHero(hero.id)}
                          title="Remover do Roster"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </div>
      </div>

      <div className="sidebar-footer" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={session.user.email}>
          {session.user.email}
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px' }}
          title="Sair da Conta"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );
};
