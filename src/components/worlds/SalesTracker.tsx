import React, { useState, useEffect } from 'react';
import { Settings, X, Trash2, Calendar, Plus, Minus, BarChart2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface SalesEntry {
  id: string;
  date: string;
  items: Record<string, number>;
  revenue: number;
  notes: string;
}

const DEFAULT_MENU: MenuItem[] = [
  // Coffee
  { id: 'c1', name: 'Americano', price: 60, category: 'Coffee' },
  { id: 'c2', name: 'Vietnamese Coffee', price: 75, category: 'Coffee' },
  { id: 'c3', name: 'Cafe Latte', price: 75, category: 'Coffee' },
  { id: 'c4', name: 'Spanish Latte', price: 75, category: 'Coffee' },
  { id: 'c5', name: 'Cafe Mocha', price: 75, category: 'Coffee' },
  
  // Cold Brew
  { id: 'cb1', name: 'Cold Brew Soda', price: 95, category: 'Cold Brew' },
  { id: 'cb2', name: 'Cold Brew Vanilla Latte', price: 95, category: 'Cold Brew' },
  { id: 'cb3', name: 'Cold Brew Mocha Caramel', price: 95, category: 'Cold Brew' },
  
  // Matcha/Smoothies
  { id: 'm1', name: 'Matcha Latte', price: 100, category: 'Matcha | Smoothies' },
  { id: 'm2', name: 'Mango Smoothie', price: 90, category: 'Matcha | Smoothies' },
  { id: 'm3', name: 'Strawberry Smoothie', price: 90, category: 'Matcha | Smoothies' },
  { id: 'm4', name: 'Blueberry Smoothie', price: 90, category: 'Matcha | Smoothies' },
  
  // Snacks
  { id: 's1', name: 'Fruit Salad', price: 40, category: 'Snacks' },
  { id: 's2', name: 'Cheese Sticks (6)', price: 40, category: 'Snacks' },
  { id: 's3', name: 'Nacho Chips + Salsa', price: 60, category: 'Snacks' },
  { id: 's4', name: 'French Fries', price: 60, category: 'Snacks' },
  { id: 's5', name: 'Tuna Tacos (2)', price: 60, category: 'Snacks' },
  { id: 's6', name: 'Chicken/Pork Adobo Tacos', price: 60, category: 'Snacks' },
  { id: 's7', name: 'Egg Waffle Regular', price: 65, category: 'Snacks' },
  { id: 's8', name: 'Egg Waffle Cheese', price: 70, category: 'Snacks' },
  { id: 's9', name: 'Egg Waffle w/ Ice Cream', price: 80, category: 'Snacks' },
  
  // Silog & Pasta
  { id: 'sp1', name: 'Tapsilog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp2', name: 'Tocilog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp3', name: 'Cornsilog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp4', name: 'Hotsilog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp5', name: 'Spam Silog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp6', name: 'Humba Silog', price: 80, category: 'Silog & Pasta' },
  { id: 'sp7', name: 'Carbonara/Spaghetti', price: 80, category: 'Silog & Pasta' },
  
  // Food Takeout
  { id: 'ft1', name: 'Pork Belly', price: 55, category: 'Food Takeout' },
  { id: 'ft2', name: 'Fried Chicken', price: 40, category: 'Food Takeout' },
  { id: 'ft3', name: 'Chicken Adobo', price: 40, category: 'Food Takeout' },
  { id: 'ft4', name: 'Humba', price: 40, category: 'Food Takeout' },
  { id: 'ft5', name: 'Noodles', price: 35, category: 'Food Takeout' },
  
  // Other Drinks
  { id: 'od1', name: 'Coke/Sprite/Royal Sakto', price: 20, category: 'Other Drinks' },
  { id: 'od2', name: 'Coke/Sprite Mini Can', price: 30, category: 'Other Drinks' },
  { id: 'od3', name: 'Coke/Sprite Litro', price: 60, category: 'Other Drinks' },
  { id: 'od4', name: 'Coke 1.5 Litro', price: 75, category: 'Other Drinks' },
  { id: 'od5', name: 'C2 Mini', price: 30, category: 'Other Drinks' },
  { id: 'od6', name: 'Yakult', price: 20, category: 'Other Drinks' },
  { id: 'od7', name: 'Mountain Dew', price: 30, category: 'Other Drinks' },
  { id: 'od8', name: 'Chuckie Small', price: 20, category: 'Other Drinks' },
  { id: 'od9', name: 'Chuckie Reg', price: 30, category: 'Other Drinks' },
  { id: 'od10', name: 'Mineral Water Small', price: 20, category: 'Other Drinks' },
  { id: 'od11', name: 'Mineral Water Big', price: 30, category: 'Other Drinks' },
  { id: 'od12', name: 'Ice Candy', price: 10, category: 'Other Drinks' },
  { id: 'od13', name: 'Ice Cream', price: 10, category: 'Other Drinks' },
  
  // Desserts
  { id: 'd1', name: 'Chocolate Tiramisu', price: 85, category: 'Desserts' },
];

const STORAGE_KEY_MENU = 'lota_menu_v5';
const STORAGE_KEY_SALES = 'lota_sales_v3';

export default function SalesTracker() {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MENU);
    return saved ? JSON.parse(saved) : DEFAULT_MENU;
  });

  const [entries, setEntries] = useState<SalesEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SALES);
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'entry' | 'summary'>('entry');
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  
  // Entry Form State
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Coffee');

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(entries));
  }, [entries]);

  const categories = Array.from(new Set(menu.map(m => m.category)));

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const calculatedRevenue = Object.entries(quantities).reduce((sum: number, entry: [string, number]) => {
    const [id, qty] = entry;
    const item = menu.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleSaveEntry = () => {
    if (Object.keys(quantities).length === 0) return;

    const newEntry: SalesEntry = {
      id: Date.now().toString(),
      date: entryDate,
      items: { ...quantities },
      revenue: calculatedRevenue,
      notes
    };

    setEntries(prev => [...prev, newEntry].sort((a, b) => b.date.localeCompare(a.date)));
    setQuantities({});
    setNotes('');
    setView('summary');
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  // Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = todayStr.slice(0, 7);
  
  const todayEntries = entries.filter(e => e.date === todayStr);
  const todaySales = todayEntries.reduce((sum, e) => sum + e.revenue, 0);
  const monthSales = entries.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.revenue, 0);

  const totalItemsInOrder = Object.values(quantities).reduce((a: number, b: number) => a + b, 0);

  // Aggregate today's items
  const todayItemsSummary = todayEntries.reduce((acc, entry) => {
    Object.entries(entry.items).forEach(([id, qty]) => {
      acc[id] = (acc[id] || 0) + qty;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedSummary = (Object.entries(todayItemsSummary) as [string, number][])
    .map(([id, qty]) => {
      const item = menu.find(m => m.id === id);
      return {
        item,
        qty,
        total: (item?.price || 0) * qty
      };
    })
    .filter((item): item is { item: MenuItem; qty: number; total: number } => !!item.item)
    .sort((a, b) => b.qty - a.qty);

  return (
    <div className="flex flex-col h-full bg-paper -m-3 min-h-[600px]">
      {/* Header / Stats */}
      <div className="bg-lota p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BarChart2 size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h1 className="font-serif text-[18px] italic tracking-tight">Sales Tracker</h1>
            <p className="text-[12px] uppercase tracking-[0.2em] opacity-70">Lota Kopi Dashboard</p>
          </div>
          <button 
            onClick={() => setIsEditingMenu(!isEditingMenu)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isEditingMenu ? <X size={14} /> : <Settings size={14} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-60 mb-1">Today's Sales</p>
            <p className="text-[24px] font-serif">₱{todaySales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-60 mb-1">This Month</p>
            <p className="text-[24px] font-serif">₱{monthSales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-paper-3 sticky top-0 bg-paper z-20">
        <button 
          onClick={() => setView('entry')}
          className={`flex-1 py-3 text-[12px] uppercase tracking-widest font-bold transition-colors ${view === 'entry' ? 'text-lota border-b-2 border-lota' : 'text-ink-3'}`}
        >
          Quick Entry
        </button>
        <button 
          onClick={() => setView('summary')}
          className={`flex-1 py-3 text-[12px] uppercase tracking-widest font-bold transition-colors ${view === 'summary' ? 'text-lota border-b-2 border-lota' : 'text-ink-3'}`}
        >
          Today's Summary
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {isEditingMenu ? (
          <MenuEditor menu={menu} setMenu={setMenu} />
        ) : (
          <>
            {view === 'entry' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Date Selection */}
                <div className="flex items-center justify-between bg-paper-2 p-3 rounded-lg border border-paper-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-lota" />
                    <span className="text-[12px] uppercase tracking-wider text-ink-2">Entry Date</span>
                  </div>
                  <input 
                    type="date" 
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="bg-transparent text-[12px] font-bold text-ink outline-none"
                  />
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-lota text-white shadow-md' : 'bg-paper-2 text-ink-3 border border-paper-3'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Item Grid */}
                <div className="grid grid-cols-1 gap-2">
                  {menu.filter(m => m.category === activeCategory).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-paper-3 shadow-sm">
                      <div>
                        <p className="text-[14px] font-bold text-ink">{item.name}</p>
                        <p className="text-[11px] text-ink-3 font-serif italic">₱{item.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-paper-2 text-ink-3 hover:bg-lota/10 hover:text-lota transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[12px] font-bold w-4 text-center">{quantities[item.id] || 0}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-paper-2 text-ink-3 hover:bg-lota/10 hover:text-lota transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary & Save */}
                {Object.keys(quantities).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-20 left-4 right-4 bg-ink text-paper p-4 rounded-2xl shadow-2xl z-30"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.2em] opacity-60">Current Total</p>
                        <p className="text-[24px] font-serif">₱{calculatedRevenue.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] uppercase tracking-[0.2em] opacity-60">Items</p>
                        <p className="text-[24px] font-serif">{totalItemsInOrder}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveEntry}
                      className="w-full py-3 bg-lota text-white rounded-xl text-[14px] uppercase tracking-[0.2em] font-bold hover:bg-lota-2 transition-colors shadow-lg"
                    >
                      Save Daily Entry
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {view === 'summary' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Today's Aggregated Summary */}
                <div className="bg-white rounded-2xl border border-paper-3 shadow-sm overflow-hidden">
                  <div className="bg-paper-2 px-4 py-3 border-b border-paper-3 flex justify-between items-center">
                    <h3 className="text-[14px] uppercase tracking-widest font-bold text-ink-2">Today's Item Breakdown</h3>
                    <span className="text-[13px] text-ink-3">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  {sortedSummary.length === 0 ? (
                    <div className="p-8 text-center text-ink-3 italic text-[14px]">No sales logged for today yet.</div>
                  ) : (
                    <div className="divide-y divide-paper-3">
                      {sortedSummary.map(({ item, qty, total }) => (
                        <div key={item?.id} className="px-4 py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-lota/10 text-lota flex items-center justify-center text-[14px] font-bold">
                              {qty}
                            </div>
                            <div>
                              <p className="text-[16px] font-medium text-ink">{item?.name}</p>
                              <p className="text-[12px] text-ink-3 uppercase tracking-tighter">{item?.category}</p>
                            </div>
                          </div>
                          <p className="text-[16px] font-serif text-ink-2">₱{total.toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="px-4 py-3 bg-paper-2 flex justify-between items-center font-bold">
                        <span className="text-[14px] uppercase tracking-widest">Total Today</span>
                        <span className="text-[17px] font-serif text-lota">₱{todaySales.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Logs for Today */}
                {todayEntries.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[12px] uppercase tracking-widest text-ink-3 px-1">Detailed Logs (Today)</h3>
                    {todayEntries.map(entry => (
                      <div key={entry.id} className="bg-white rounded-xl border border-paper-3 p-4 shadow-sm group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[13px] text-ink-3 font-medium">
                              {new Date(entry.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[22px] font-serif">₱{entry.revenue.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-2 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(entry.items).map(([id, qty]) => {
                            const item = menu.find(m => m.id === id);
                            return (
                              <span key={id} className="px-2 py-0.5 bg-paper-2 rounded text-[12px] text-ink-2">
                                {qty}x {item?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MenuEditor({ menu, setMenu }: { menu: MenuItem[], setMenu: (m: MenuItem[]) => void }) {
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Coffee' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  
  const categories = Array.from(new Set(menu.map(m => m.category)));

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category
    };
    setMenu([...menu, item]);
    setNewItem({ ...newItem, name: '', price: '' });
  };

  const startEditing = (item: MenuItem) => {
    setEditingId(item.id);
    setEditPrice(item.price.toString());
  };

  const savePrice = (id: string) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice)) return;
    
    setMenu(menu.map(m => m.id === id ? { ...m, price: newPrice } : m));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-paper-2 p-4 rounded-xl border border-paper-3">
        <h3 className="text-[14px] uppercase tracking-widest font-bold mb-4">Add Menu Item</h3>
        <div className="space-y-3">
          <input 
            placeholder="Item Name"
            value={newItem.name}
            onChange={e => setNewItem({...newItem, name: e.target.value})}
            className="w-full bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-lota"
          />
          <div className="flex gap-2">
            <input 
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={e => setNewItem({...newItem, price: e.target.value})}
              className="flex-1 bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-lota"
            />
            <select 
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
              className="flex-1 bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-lota"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="New Category">+ New Category</option>
            </select>
          </div>
          <button 
            onClick={addItem}
            className="w-full py-2 bg-ink text-white rounded-lg text-[13px] uppercase tracking-[0.2em] font-bold"
          >
            Add to Menu
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat}>
            <h4 className="text-[12px] uppercase tracking-widest text-ink-3 mb-2 px-1">{cat}</h4>
            <div className="space-y-1">
              {menu.filter(m => m.category === cat).map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-paper-3">
                  <span className="text-[14px]">{item.name}</span>
                  <div className="flex items-center gap-3">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-16 bg-paper-2 border border-paper-3 px-1 py-0.5 text-[14px] rounded outline-none focus:border-lota"
                          autoFocus
                        />
                        <button onClick={() => savePrice(item.id)} className="text-lota hover:text-lota-2">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-ink-3">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(item)}
                        className="text-[14px] font-serif italic text-ink-3 hover:text-lota transition-colors"
                        title="Click to change price"
                      >
                        ₱{item.price}
                      </button>
                    )}
                    <button 
                      onClick={() => setMenu(menu.filter(m => m.id !== item.id))}
                      className="text-ink-3 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
