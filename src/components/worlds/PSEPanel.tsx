import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, Edit3, Save, X, DollarSign, BarChart2, PieChart, Activity, Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../store/OSContext';

interface Stock {
  id: string;
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: 'above' | 'below';
  active: boolean;
}

const STORAGE_KEY = 'pse_investments_v2';
const ALERTS_KEY = 'pse_alerts_v1';

const INITIAL_STOCKS: Stock[] = [
  { id: '1', symbol: 'ALI', shares: 1600, avgCost: 34.8596, currentPrice: 18.24, sector: 'Property' },
  { id: '2', symbol: 'BPI', shares: 224, avgCost: 79.5662, currentPrice: 100.00, sector: 'Financials' },
  { id: '3', symbol: 'ICT', shares: 30, avgCost: 109.263, currentPrice: 704.00, sector: 'Services' },
  { id: '4', symbol: 'JFC', shares: 150, avgCost: 194.5373, currentPrice: 186.20, sector: 'Services' },
  { id: '5', symbol: 'SMPH', shares: 1400, avgCost: 26.225, currentPrice: 19.18, sector: 'Property' },
  { id: '6', symbol: 'XAKAO', shares: 1412, avgCost: 2.1138, currentPrice: 2.1301, sector: 'Mutual Funds' },
  { id: '7', symbol: 'XMLADBF', shares: 70.8604, avgCost: 56.449, currentPrice: 60.0934, sector: 'Mutual Funds' },
];

export default function PSEPanel() {
  const { showToast } = useOS();
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem(ALERTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Stock Form
  const [newStock, setNewStock] = useState({ symbol: '', shares: '', avgCost: '', currentPrice: '', sector: 'Services' });
  
  // New Alert Form
  const [newAlert, setNewAlert] = useState({ symbol: '', targetPrice: '', type: 'above' as 'above' | 'below' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const totalCost = stocks.reduce((acc, s) => acc + (s.shares * s.avgCost), 0);
  const totalValue = stocks.reduce((acc, s) => acc + (s.shares * s.currentPrice), 0);
  const totalGL = totalValue - totalCost;
  const totalGLPercent = totalCost > 0 ? (totalGL / totalCost) * 100 : 0;

  const addStock = () => {
    if (!newStock.symbol || !newStock.shares || !newStock.avgCost) return;
    const stock: Stock = {
      id: Date.now().toString(),
      symbol: newStock.symbol.toUpperCase(),
      shares: parseFloat(newStock.shares),
      avgCost: parseFloat(newStock.avgCost),
      currentPrice: parseFloat(newStock.currentPrice) || parseFloat(newStock.avgCost),
      sector: newStock.sector
    };
    setStocks([...stocks, stock]);
    setNewStock({ symbol: '', shares: '', avgCost: '', currentPrice: '', sector: 'Services' });
    setIsAdding(false);
  };

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return;
    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      targetPrice: parseFloat(newAlert.targetPrice),
      type: newAlert.type,
      active: true
    };
    setAlerts([...alerts, alert]);
    setNewAlert({ symbol: '', targetPrice: '', type: 'above' });
    setIsAddingAlert(false);
    showToast(`Alert set for ${alert.symbol} at ₱${alert.targetPrice}`);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const removeStock = (id: string) => {
    if (confirm('Remove this stock from portfolio?')) {
      setStocks(stocks.filter(s => s.id !== id));
    }
  };

  const updatePrice = (id: string, price: string) => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice)) {
      setEditingId(null);
      return;
    }

    const stock = stocks.find(s => s.id === id);
    if (!stock) return;

    // Check alerts
    const triggeredAlerts = alerts.filter(a => 
      a.active && 
      a.symbol === stock.symbol && 
      ((a.type === 'above' && newPrice >= a.targetPrice) || (a.type === 'below' && newPrice <= a.targetPrice))
    );

    if (triggeredAlerts.length > 0) {
      triggeredAlerts.forEach(a => {
        showToast(`ALERT: ${a.symbol} reached ₱${newPrice} (Target: ${a.type} ₱${a.targetPrice})`);
      });
      // Deactivate triggered alerts
      setAlerts(prev => prev.map(a => triggeredAlerts.find(ta => ta.id === a.id) ? { ...a, active: false } : a));
    }

    setStocks(stocks.map(s => s.id === id ? { ...s, currentPrice: newPrice } : s));
    setEditingId(null);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* PORTFOLIO SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-paper-3 mb-6 border border-paper-3 rounded-lg overflow-hidden">
        <div className="bg-paper p-5">
          <div className="text-[12px] tracking-[0.15em] uppercase text-ink-3 mb-2">Total Market Value</div>
          <div className="font-serif text-[29px] text-ink">₱{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[12px] text-ink-3 mt-1">Equity Portfolio</div>
        </div>
        <div className="bg-paper p-5">
          <div className="text-[12px] tracking-[0.15em] uppercase text-ink-3 mb-2">Total Cost</div>
          <div className="font-serif text-[29px] text-ink-2">₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[12px] text-ink-3 mt-1">Invested Capital</div>
        </div>
        <div className={`bg-paper p-5 ${totalGL >= 0 ? 'border-t-4 border-t-emerald-500/20' : 'border-t-4 border-t-red-500/20'}`}>
          <div className="text-[12px] tracking-[0.15em] uppercase text-ink-3 mb-2">Unrealized G/L</div>
          <div className={`font-serif text-[29px] flex items-center gap-2 ${totalGL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalGL >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            ₱{Math.abs(totalGL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[14px] font-medium mt-1 ${totalGL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalGL >= 0 ? '+' : '-'}{Math.abs(totalGLPercent).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-[18px] text-ink">Holdings</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddingAlert(!isAddingAlert)}
            className={`flex items-center gap-2 px-4 py-2 text-[12px] uppercase tracking-widest font-bold transition-colors rounded-md border ${isAddingAlert ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-paper-3 hover:bg-paper-2'}`}
          >
            {isAddingAlert ? <X size={12} /> : <Bell size={12} />}
            {isAddingAlert ? 'Cancel' : 'Set Alert'}
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-ink text-[12px] uppercase tracking-widest font-bold hover:bg-gold-2 transition-colors rounded-md"
          >
            {isAdding ? <X size={12} /> : <Plus size={12} />}
            {isAdding ? 'Cancel' : 'Add Stock'}
          </button>
        </div>
      </div>

      {/* ADD ALERT FORM */}
      <AnimatePresence>
        {isAddingAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-paper-2 p-4 border border-paper-3 rounded-lg mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Symbol</label>
              <select 
                value={newAlert.symbol}
                onChange={e => setNewAlert({...newAlert, symbol: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              >
                <option value="">Select Stock</option>
                {stocks.map(s => (
                  <option key={s.id} value={s.symbol}>{s.symbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Condition</label>
              <select 
                value={newAlert.type}
                onChange={e => setNewAlert({...newAlert, type: e.target.value as 'above' | 'below'})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              >
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Target Price</label>
              <input 
                type="number"
                placeholder="0.00"
                value={newAlert.targetPrice}
                onChange={e => setNewAlert({...newAlert, targetPrice: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={addAlert}
                className="w-full bg-ink text-paper py-2 text-[14px] uppercase tracking-widest font-bold hover:bg-ink-2 transition-colors rounded"
              >
                Set Alert
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-paper-2 p-4 border border-paper-3 rounded-lg mb-6 grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            <div className="col-span-2 md:col-span-1">
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Symbol</label>
              <input 
                placeholder="e.g. TEL"
                value={newStock.symbol}
                onChange={e => setNewStock({...newStock, symbol: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Shares</label>
              <input 
                type="number"
                placeholder="0"
                value={newStock.shares}
                onChange={e => setNewStock({...newStock, shares: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Avg Cost</label>
              <input 
                type="number"
                placeholder="0.00"
                value={newStock.avgCost}
                onChange={e => setNewStock({...newStock, avgCost: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Sector</label>
              <select 
                value={newStock.sector}
                onChange={e => setNewStock({...newStock, sector: e.target.value})}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded text-[14px] outline-none focus:border-gold"
              >
                <option>Services</option>
                <option>Financials</option>
                <option>Holding Firms</option>
                <option>Property</option>
                <option>Industrial</option>
                <option>Mining & Oil</option>
                <option>Mutual Funds</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-end">
              <button 
                onClick={addStock}
                className="w-full bg-ink text-paper py-2 text-[14px] uppercase tracking-widest font-bold hover:bg-ink-2 transition-colors rounded"
              >
                Add to Portfolio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STOCK TABLE */}
      <div className="bg-paper border border-paper-3 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper-2 border-b border-paper-3">
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-right">Shares</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-right">Avg Cost</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-right">Market Value</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-right">G/L</th>
                <th className="px-4 py-3 text-[13px] uppercase tracking-widest text-ink-3 font-medium text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-3">
              {stocks.map(stock => {
                const cost = stock.shares * stock.avgCost;
                const value = stock.shares * stock.currentPrice;
                const gl = value - cost;
                const glPercent = cost > 0 ? (gl / cost) * 100 : 0;
                
                return (
                  <tr key={stock.id} className="hover:bg-paper-2 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="font-bold text-ink text-[14px]">{stock.symbol}</div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-3">{stock.sector}</div>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] text-ink-2">{stock.shares.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] text-ink-2">₱{stock.avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                    <td className="px-4 py-4 text-right font-mono text-[14px]">
                      {editingId === stock.id ? (
                        <div className="flex justify-end gap-1">
                          <input 
                            autoFocus
                            defaultValue={stock.currentPrice}
                            onBlur={(e) => updatePrice(stock.id, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updatePrice(stock.id, (e.target as HTMLInputElement).value)}
                            className="w-20 bg-white border border-gold px-1 py-0.5 rounded text-right outline-none"
                          />
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer hover:text-gold transition-colors flex items-center justify-end gap-1"
                          onClick={() => setEditingId(stock.id)}
                        >
                          ₱{stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          <Edit3 size={10} className="opacity-0 group-hover:opacity-100" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] text-ink font-medium">₱{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className={`px-4 py-4 text-right font-mono text-[14px] font-medium ${gl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      <div>{gl >= 0 ? '+' : ''}{gl.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className="text-[13px] opacity-80">{gl >= 0 ? '+' : ''}{glPercent.toFixed(2)}%</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => removeStock(stock.id)}
                        className="p-2 text-ink-3 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {stocks.length === 0 && (
          <div className="p-12 text-center text-ink-3 italic text-[14px]">
            No stocks in portfolio. Start by adding your first PSE holding.
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-paper-2 p-5 rounded-lg border border-paper-3">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={16} className="text-gold" />
            <h3 className="text-[14px] uppercase tracking-[0.15em] font-bold text-ink">Sector Allocation</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(
              stocks.reduce((acc, s) => {
                acc[s.sector] = (acc[s.sector] || 0) + (s.shares * s.currentPrice);
                return acc;
              }, {} as Record<string, number>)
            ).sort((a: [string, number], b: [string, number]) => b[1] - a[1]).map(([sector, value]: [string, number]) => (
              <div key={sector}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-ink-2">{sector}</span>
                  <span className="text-ink font-medium">{((value as number / totalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1 bg-paper-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full" 
                    style={{ width: `${(value as number / totalValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper-2 p-5 rounded-lg border border-paper-3">
          <div className="flex items-center gap-2 mb-4">
            <BellRing size={16} className="text-gold" />
            <h3 className="text-[14px] uppercase tracking-[0.15em] font-bold text-ink">Active Alerts</h3>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
            {alerts.length === 0 ? (
              <div className="text-[13px] text-ink-3 italic">No active price alerts.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-paper rounded border border-paper-3 group">
                  <div>
                    <div className="text-[14px] font-bold text-ink">{alert.symbol}</div>
                    <div className={`text-[12px] uppercase ${alert.active ? 'text-ink-2' : 'text-ink-3 line-through'}`}>
                      {alert.type} ₱{alert.targetPrice}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.active && <span className="text-[11px] uppercase bg-paper-3 px-1 rounded text-ink-3">Triggered</span>}
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-paper-2 p-5 rounded-lg border border-paper-3">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-gold" />
            <h3 className="text-[14px] uppercase tracking-[0.15em] font-bold text-ink">Market Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-gold pl-3 py-1">
              <div className="text-[14px] text-ink font-medium mb-1">Diversification Check</div>
              <p className="text-[13px] text-ink-3 leading-relaxed">
                Your portfolio is heavily weighted in <span className="text-ink font-medium">Services</span>. Consider exploring Property or Financials to balance sector-specific risks.
              </p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3 py-1">
              <div className="text-[14px] text-ink font-medium mb-1">Top Performer</div>
              <p className="text-[13px] text-ink-3 leading-relaxed">
                <span className="text-ink font-medium">ALI</span> is currently your strongest position with a +9.47% unrealized gain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
