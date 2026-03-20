import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Copy, Trash2, ChevronRight, Calendar, Download, Upload, RotateCcw, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  name: string;
  assignee: string;
  due: string;
  status: string;
  notes: string;
}

interface Section {
  id: string;
  name: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  category: string;
  brief: string;
  quickStatus?: string;
  sections: Section[];
}

const SEED_DATA: Project[] = [
  { id: "mivela-clubhouse1", name: "Mivela Clubhouse", category: "Residential Projects", brief: "Current status: ongoing construction\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "west-village-id2", name: "West Village - ID", category: "Residential Projects", brief: "Current status: approved ID design last year (Q3 2025)\nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "alto-ranudo-id3", name: "Alto Ranudo - ID", category: "Residential Projects", brief: "Current status: approved ID design last year (Q4 2025)\nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "mandtra-clubhouse-lobby-tower-lobby-id4", name: "Mandtra Clubhouse Lobby +Tower Lobby  - ID", category: "Residential Projects", brief: "Current status: ongoing furniture selection for the Clubhouse + Tower Lobby Design already submitted to QS\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "casa-mira-mandaue-1br-showflat5", name: "Casa Mira Mandaue 1BR Showflat", category: "Residential Projects", brief: "Current status: waiting for which unit to be designed from BD \nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "mivela-1-br-unit-semi-furnished6", name: "Mivela 1 BR unit (semi furnished)", category: "Residential Projects", brief: "Current status: declared by sales to have all 1BR units to be semi furnished - ID to select furniture \nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "loft-interior-wave-tower7", name: "Loft Interior (Wave Tower)", category: "Residential Projects", brief: "Current status: pending for cost approval (ID Consultant)\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "wave-tower-id8", name: "Wave Tower ID", category: "Residential Projects", brief: "Current status: ID - DD Submitted  by Aidea \nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "38th-park-penthouse-lift-lobby9", name: "38th park penthouse + lift lobby", category: "Residential Projects", brief: "Current status: ongoing construction\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "pristina-glass-house-showroom10", name: "Pristina Glass House Showroom", category: "Showroom Projects", brief: "Current status: ongoing construction\nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "davao-showroom-dgt11", name: "Davao Showroom DGT", category: "Showroom Projects", brief: "Current status: pending\nTarget: pending", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "costa-mira-mactan-showroom-both-archtl-a12", name: "Costa Mira Mactan Showroom (both archtl and ID)", category: "Showroom Projects", brief: "Current status: pending  \nTarget: pending", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "wave-showroom13", name: "Wave Showroom", category: "Showroom Projects", brief: "Current status: completed (Q3 2025)\nTarget: Q3  2025", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "ormoc-sales-office-branch14", name: "Ormoc Sales Office Branch", category: "Office Projects", brief: "Current status: (QS evaluation + Contractor's Bid) \nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "10-floor-cli-lobby-park-centrale15", name: "10 floor CLI Lobby Park Centrale", category: "Office Projects", brief: "Current status: pending for budget approval \nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "davao-branch-office16", name: "Davao Branch Office", category: "Office Projects", brief: "Current status: completed (Q3 2025)\nTarget: Q3 2025", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "cdosales-branch-office17", name: "CDOSales/ Branch Office", category: "Office Projects", brief: "Current status: (ongoing construction) - expansion \nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "gensan-sales-branch-office18", name: "Gensan Sales / Branch Office", category: "Office Projects", brief: "Current status: completed (Q3 2025)\nTarget: Q3  2025", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "waiting-for-more-branch-offices-tobe-bui19", name: "waiting for more branch offices tobe build  for 2026", category: "Office Projects", brief: "Current status: \nTarget:", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "movenpick-hotel-id-support20", name: "Movenpick Hotel (ID Support)", category: "Hotel Projects", brief: "Current status: SD stage (architectural) -- Accor needs to sign contract ; and provide hotel  brand standard \nTarget: pending", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "mecure-hotel-id-support21", name: "Mecure Hotel (ID Support)", category: "Hotel Projects", brief: "Current status: MUR comments from Design Consultant + Accor  (revision) \nTarget: Q4  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "sofitel22", name: "Sofitel", category: "Hotel Projects", brief: "Current status: pending for cost evaluation (bidcom)\nTarget: pending", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "3rd-floor-main-floor-astra-mall23", name: "3rd floor (main floor) - Astra mall", category: "Retail/ Mall Projects", brief: "Current status: upcoming\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "retail-space-like-maze-fashion-astra-mal24", name: "Retail Space (like Maze fashion) - Astra mall", category: "Retail/ Mall Projects", brief: "Current status: pending for bidcom costing evaluation \nTarget: pending", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "ua-p-business-school25", name: "UA&P Business School", category: "Outside Clients  (Collab Cli ) Projects", brief: "Current status: ongoing construction\nTarget: Q1 2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] },
  { id: "archdiocese-office-patria-3rd-7th-floor26", name: "Archdiocese Office (Patria) 3rd + 7th floor", category: "Outside Clients  (Collab Cli ) Projects", brief: "Current status: ongoing GA quotation + final contract); another presentation for archbishop\nTarget: Q1 - Q2  2026", sections: [{ id: "sec-1", name: "Current Tasks", tasks: [] }] }
];

const STORAGE_KEY = "dioneProjectTracker.notion.v6";

export default function ProjectTrackerModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects)) return parsed.projects;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(SEED_DATA));
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.selectedProjectId) return parsed.selectedProjectId;
      }
    } catch (e) {}
    return SEED_DATA[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'tasks' | 'timeline'>('table');
  
  // Confirmation state
  const [confirmState, setConfirmState] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Drawer state
  const [drawerTask, setDrawerTask] = useState<{ projectId: string, sectionId: string, taskId: string } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, selectedProjectId }));
  }, [projects, selectedProjectId]);

  const generateId = () => Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const categories = Array.from(new Set(projects.map(p => p.category || "Uncategorized"))).sort();

  const filteredProjects = projects.filter(p => {
    const catOk = !categoryFilter || (p.category || "Uncategorized") === categoryFilter;
    if (!catOk) return false;
    if (!searchQuery) return true;
    const hay = `${p.name || ""} ${p.category || ""} ${p.brief || ""}`.toLowerCase();
    return hay.includes(searchQuery.toLowerCase());
  });

  const handleCreateProject = () => {
    const newProject: Project = {
      id: "proj-" + generateId(),
      name: "New Project",
      category: "Uncategorized",
      brief: "",
      quickStatus: "",
      sections: [{ id: "sec-" + generateId(), name: "Current Tasks", tasks: [] }]
    };
    setProjects([newProject, ...projects]);
    setSelectedProjectId(newProject.id);
  };

  const handleDeleteProject = (id: string) => {
    setConfirmState({
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      onConfirm: () => {
        const newProjects = projects.filter(p => p.id !== id);
        setProjects(newProjects);
        if (selectedProjectId === id) setSelectedProjectId(newProjects[0]?.id || null);
        setConfirmState(null);
      }
    });
  };

  const handleDuplicateProject = (id: string) => {
    const p = projects.find(x => x.id === id);
    if (!p) return;
    const clone = JSON.parse(JSON.stringify(p));
    clone.id = "proj-" + generateId();
    clone.name = (clone.name || "Project") + " (Copy)";
    clone.sections.forEach((s: any) => {
      s.id = "sec-" + generateId();
      s.tasks.forEach((t: any) => t.id = "task-" + generateId());
    });
    setProjects([clone, ...projects]);
    setSelectedProjectId(clone.id);
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const addSection = (projectId: string) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        sections: [...p.sections, { id: "sec-" + generateId(), name: "New Section", tasks: [] }]
      };
    }));
  };

  const deleteSection = (projectId: string, sectionId: string) => {
    const p = projects.find(x => x.id === projectId);
    if (p && p.sections.length <= 1) {
      // Instead of alert, we can just show a temporary message or do nothing
      return;
    }

    setConfirmState({
      message: "Delete this section and all its tasks?",
      onConfirm: () => {
        setProjects(projects.map(p => {
          if (p.id !== projectId) return p;
          return { ...p, sections: p.sections.filter(s => s.id !== sectionId) };
        }));
        setConfirmState(null);
      }
    });
  };

  const updateSection = (projectId: string, sectionId: string, patch: Partial<Section>) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        sections: p.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s)
      };
    }));
  };

  const addTask = (projectId: string, sectionId: string) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            tasks: [...s.tasks, { id: "task-" + generateId(), name: "New task", assignee: "", due: "", status: "Not started", notes: "" }]
          };
        })
      };
    }));
  };

  const updateTask = (projectId: string, sectionId: string, taskId: string, patch: Partial<Task>) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t)
          };
        })
      };
    }));
  };

  const deleteTask = (projectId: string, sectionId: string, taskId: string) => {
    setConfirmState({
      message: "Delete this task?",
      onConfirm: () => {
        setProjects(projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            sections: p.sections.map(s => {
              if (s.id !== sectionId) return s;
              return { ...s, tasks: s.tasks.filter(t => t.id !== taskId) };
            })
          };
        }));
        setConfirmState(null);
      }
    });
  };

  const moveTask = (projectId: string, fromSectionId: string, toSectionId: string, taskId: string) => {
    if (fromSectionId === toSectionId) return;
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      let taskToMove: Task | undefined;
      
      // First pass to find and remove
      const sectionsAfterRemove = p.sections.map(s => {
        if (s.id === fromSectionId) {
          taskToMove = s.tasks.find(t => t.id === taskId);
          return { ...s, tasks: s.tasks.filter(t => t.id !== taskId) };
        }
        return s;
      });

      if (!taskToMove) return p;

      // Second pass to add
      return {
        ...p,
        sections: sectionsAfterRemove.map(s => {
          if (s.id === toSectionId) {
            return { ...s, tasks: [...s.tasks, taskToMove!] };
          }
          return s;
        })
      };
    }));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ projects, selectedProjectId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diones-project-tracker-backup.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && Array.isArray(imported.projects)) {
          setProjects(imported.projects);
          setSelectedProjectId(imported.selectedProjectId || imported.projects[0]?.id || null);
        }
      } catch (err) {
        setConfirmState({
          message: "Import failed. The file is not a valid project tracker backup.",
          onConfirm: () => setConfirmState(null)
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    setConfirmState({
      message: "Reset will clear all your saved changes and restore the original project list. Continue?",
      onConfirm: () => {
        setProjects(JSON.parse(JSON.stringify(SEED_DATA)));
        setSelectedProjectId(SEED_DATA[0].id);
        setConfirmState(null);
      }
    });
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  };

  const totalTasks = selectedProject?.sections.reduce((acc, s) => acc + s.tasks.length, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 bg-paper flex flex-col font-sans text-ink">
      {/* Topbar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-paper-3 bg-paper shrink-0">
        <div className="flex items-baseline gap-3">
          <div className="text-[14px] font-bold tracking-wide">Dione's Project Tracker</div>
          <div className="text-[12px] text-ink-3 hidden md:block">Notion-like · minimal · editable projects</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="px-3 py-1.5 text-[12px] font-medium border border-paper-3 rounded-md hover:bg-paper-2 transition-colors flex items-center gap-1">
            <RotateCcw size={12} /> Reset
          </button>
          <button onClick={handleExport} className="px-3 py-1.5 text-[12px] font-medium border border-paper-3 rounded-md hover:bg-paper-2 transition-colors flex items-center gap-1">
            <Download size={12} /> Export
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-[12px] font-medium border border-paper-3 rounded-md hover:bg-paper-2 transition-colors flex items-center gap-1">
            <Upload size={12} /> Import
          </button>
          <input type="file" ref={fileInputRef} accept="application/json" className="hidden" onChange={handleImport} />
          <button onClick={handleCreateProject} className="px-3 py-1.5 text-[12px] font-medium bg-ink text-paper rounded-md hover:bg-ink-2 transition-colors flex items-center gap-1 ml-2">
            <Plus size={12} /> New Project
          </button>
          <button onClick={onClose} className="p-1.5 text-ink-3 hover:text-ink hover:bg-paper-2 rounded-md ml-2 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-paper-3 bg-paper-2 flex flex-col shrink-0">
          <div className="p-3 border-b border-paper-3">
            <div className="relative mb-2">
              <Search size={14} className="absolute left-2 top-2 text-ink-3" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-paper border border-paper-3 rounded-md focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-[12px] bg-paper border border-paper-3 rounded-md focus:outline-none focus:border-ink transition-colors"
            >
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredProjects.length === 0 ? (
              <div className="text-[12px] text-ink-3 italic p-4 text-center">No projects found.</div>
            ) : (
              filteredProjects.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedProjectId === p.id ? 'bg-paper border border-paper-3 shadow-sm' : 'hover:bg-paper border border-transparent'}`}
                >
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">{p.name || "Untitled"}</div>
                    <div className="text-[12px] text-ink-3 truncate mt-0.5">{p.category || "Uncategorized"}</div>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleDuplicateProject(p.id); }} className="p-1 text-ink-3 hover:text-ink hover:bg-paper-2 rounded">
                      <Copy size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} className="p-1 text-ink-3 hover:text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-paper relative">
          {selectedProject ? (
            <div className="max-w-5xl mx-auto p-8 pb-32">
              <input 
                type="text"
                value={selectedProject.name}
                onChange={e => updateProject(selectedProject.id, { name: e.target.value })}
                className="text-[29px] font-bold bg-transparent border-none outline-none w-full mb-4 placeholder-ink-3"
                placeholder="Project Name"
              />

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-ink-3">Category</span>
                  <input 
                    type="text"
                    value={selectedProject.category}
                    onChange={e => updateProject(selectedProject.id, { category: e.target.value })}
                    className="bg-paper-2 px-2 py-1 rounded border border-transparent hover:border-paper-3 focus:border-ink outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-3">Status</span>
                  <select 
                    value={selectedProject.quickStatus || ""}
                    onChange={e => updateProject(selectedProject.id, { quickStatus: e.target.value })}
                    className="bg-paper-2 px-2 py-1 rounded border border-transparent hover:border-paper-3 focus:border-ink outline-none transition-colors"
                  >
                    <option value="">(none)</option>
                    <option value="On track">On track</option>
                    <option value="At risk">At risk</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-3">Tasks</span>
                  <span className="font-medium">{totalTasks}</span>
                </div>
              </div>

              <div className="bg-paper-2 border-l-4 border-ink-2 p-4 rounded-r-lg mb-8">
                <div className="text-[12px] text-ink-3 mb-2 font-medium uppercase tracking-wider">Project Brief</div>
                <textarea 
                  value={selectedProject.brief}
                  onChange={e => updateProject(selectedProject.id, { brief: e.target.value })}
                  className="w-full bg-transparent border-none outline-none resize-none min-h-[60px] text-[14px] leading-relaxed"
                  placeholder="Add a project brief..."
                />
              </div>

              {/* Tabs & Toolbar */}
              <div className="flex items-center justify-between border-y border-paper-3 py-3 mb-6">
                <div className="flex bg-paper-2 p-1 rounded-lg border border-paper-3">
                  {(['table', 'tasks', 'timeline'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-[13px] font-medium rounded-md capitalize transition-colors ${activeTab === tab ? 'bg-paper shadow-sm text-ink' : 'text-ink-3 hover:text-ink'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addSection(selectedProject.id)} className="px-3 py-1.5 text-[12px] font-medium border border-paper-3 rounded-md hover:bg-paper-2 transition-colors">
                    + Section
                  </button>
                  <button onClick={() => {
                    if (selectedProject.sections.length > 0) {
                      addTask(selectedProject.id, selectedProject.sections[0].id);
                    } else {
                      alert("Add a section first.");
                    }
                  }} className="px-3 py-1.5 text-[12px] font-medium border border-paper-3 rounded-md hover:bg-paper-2 transition-colors">
                    + Task
                  </button>
                </div>
              </div>

              {/* Views */}
              {activeTab === 'table' && (
                <div className="border border-paper-3 rounded-xl overflow-hidden bg-paper">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-paper-2 border-b border-paper-3 text-[12px] uppercase tracking-wider text-ink-3">
                        <th className="p-3 font-medium w-1/3">Task</th>
                        <th className="p-3 font-medium w-1/6">Section</th>
                        <th className="p-3 font-medium w-1/6">Assignee</th>
                        <th className="p-3 font-medium w-1/6">Due</th>
                        <th className="p-3 font-medium w-1/6">Status</th>
                        <th className="p-3 font-medium w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.sections.flatMap(s => s.tasks.map(t => (
                        <tr key={t.id} className="border-b border-paper-3 last:border-0 hover:bg-paper-2 group">
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={t.name}
                              onChange={e => updateTask(selectedProject.id, s.id, t.id, { name: e.target.value })}
                              className="w-full bg-transparent border-none outline-none text-[14px] px-2 py-1 hover:bg-paper rounded focus:bg-paper focus:ring-1 focus:ring-paper-3"
                            />
                          </td>
                          <td className="p-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-paper-3 text-[12px] text-ink-2 whitespace-nowrap">
                              {s.name}
                            </span>
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={t.assignee}
                              onChange={e => updateTask(selectedProject.id, s.id, t.id, { assignee: e.target.value })}
                              className="w-full bg-transparent border-none outline-none text-[14px] px-2 py-1 hover:bg-paper rounded focus:bg-paper focus:ring-1 focus:ring-paper-3"
                              placeholder="Unassigned"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="date" 
                              value={t.due}
                              onChange={e => updateTask(selectedProject.id, s.id, t.id, { due: e.target.value })}
                              className="w-full bg-transparent border border-transparent hover:border-paper-3 outline-none text-[14px] px-2 py-1 rounded focus:border-ink"
                            />
                          </td>
                          <td className="p-2">
                            <select 
                              value={t.status}
                              onChange={e => updateTask(selectedProject.id, s.id, t.id, { status: e.target.value })}
                              className="w-full bg-transparent border border-transparent hover:border-paper-3 outline-none text-[14px] px-2 py-1 rounded focus:border-ink"
                            >
                              <option value="Not started">Not started</option>
                              <option value="In progress">In progress</option>
                              <option value="Blocked">Blocked</option>
                              <option value="Done">Done</option>
                            </select>
                          </td>
                          <td className="p-2 text-right">
                            <div className="hidden group-hover:flex items-center justify-end gap-1">
                              <button onClick={() => setDrawerTask({ projectId: selectedProject.id, sectionId: s.id, taskId: t.id })} className="p-1 text-ink-3 hover:text-ink hover:bg-paper rounded">
                                <ChevronRight size={14} />
                              </button>
                              <button onClick={() => deleteTask(selectedProject.id, s.id, t.id)} className="p-1 text-ink-3 hover:text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )))}
                      {totalTasks === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[14px] text-ink-3 italic">
                            No tasks yet. Use <b>+ Task</b> to add one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-8">
                  {selectedProject.sections.map(s => (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-3 group">
                        <div className="flex items-center gap-3">
                          <input 
                            type="text"
                            value={s.name}
                            onChange={e => updateSection(selectedProject.id, s.id, { name: e.target.value })}
                            className="text-[14px] font-bold bg-transparent border-none outline-none hover:bg-paper-2 px-2 py-1 rounded focus:bg-paper-2"
                          />
                          <span className="text-sm text-ink-3">{s.tasks.length} tasks</span>
                        </div>
                        <div className="hidden group-hover:flex items-center gap-2">
                          <button onClick={() => addTask(selectedProject.id, s.id)} className="text-sm px-2 py-1 border border-paper-3 rounded hover:bg-paper-2">
                            + Task
                          </button>
                          <button onClick={() => deleteSection(selectedProject.id, s.id)} className="text-sm px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="border border-paper-3 rounded-xl overflow-hidden bg-paper">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-paper-2 border-b border-paper-3 text-[12px] uppercase tracking-wider text-ink-3">
                              <th className="p-3 font-medium w-2/5">Task</th>
                              <th className="p-3 font-medium w-1/5">Assignee</th>
                              <th className="p-3 font-medium w-1/5">Due</th>
                              <th className="p-3 font-medium w-1/5">Status</th>
                              <th className="p-3 font-medium w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.tasks.length > 0 ? s.tasks.map(t => (
                              <tr key={t.id} className="border-b border-paper-3 last:border-0 hover:bg-paper-2 group">
                                <td className="p-2">
                                  <input 
                                    type="text" 
                                    value={t.name}
                                    onChange={e => updateTask(selectedProject.id, s.id, t.id, { name: e.target.value })}
                                    className="w-full bg-transparent border-none outline-none text-[14px] px-2 py-1 hover:bg-paper rounded focus:bg-paper focus:ring-1 focus:ring-paper-3"
                                  />
                                </td>
                                <td className="p-2">
                                  <input 
                                    type="text" 
                                    value={t.assignee}
                                    onChange={e => updateTask(selectedProject.id, s.id, t.id, { assignee: e.target.value })}
                                    className="w-full bg-transparent border-none outline-none text-[14px] px-2 py-1 hover:bg-paper rounded focus:bg-paper focus:ring-1 focus:ring-paper-3"
                                    placeholder="Unassigned"
                                  />
                                </td>
                                <td className="p-2">
                                  <input 
                                    type="date" 
                                    value={t.due}
                                    onChange={e => updateTask(selectedProject.id, s.id, t.id, { due: e.target.value })}
                                    className="w-full bg-transparent border border-transparent hover:border-paper-3 outline-none text-[14px] px-2 py-1 rounded focus:border-ink"
                                  />
                                </td>
                                <td className="p-2">
                                  <select 
                                    value={t.status}
                                    onChange={e => updateTask(selectedProject.id, s.id, t.id, { status: e.target.value })}
                                    className="w-full bg-transparent border border-transparent hover:border-paper-3 outline-none text-[14px] px-2 py-1 rounded focus:border-ink"
                                  >
                                    <option value="Not started">Not started</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Blocked">Blocked</option>
                                    <option value="Done">Done</option>
                                  </select>
                                </td>
                                <td className="p-2 text-right">
                                  <div className="hidden group-hover:flex items-center justify-end gap-1">
                                    <button onClick={() => setDrawerTask({ projectId: selectedProject.id, sectionId: s.id, taskId: t.id })} className="p-1 text-ink-3 hover:text-ink hover:bg-paper rounded">
                                      <ChevronRight size={14} />
                                    </button>
                                    <button onClick={() => deleteTask(selectedProject.id, s.id, t.id)} className="p-1 text-ink-3 hover:text-red-500 hover:bg-red-50 rounded">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="p-4 text-center text-[14px] text-ink-3 italic">
                                  No tasks in this section.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  {(() => {
                    const datedTasks = selectedProject.sections.flatMap(s => s.tasks.map(t => ({ ...t, sectionId: s.id, sectionName: s.name }))).filter(t => t.due);
                    if (datedTasks.length === 0) {
                      return (
                        <div className="p-8 border border-dashed border-paper-3 rounded-xl text-center text-[14px] text-ink-3 bg-paper-2">
                          Add due dates to your tasks to see a timeline here.<br/><br/>
                          Examples: approvals, QS submissions, mockups, ordering, delivery, punchlist.
                        </div>
                      );
                    }
                    
                    datedTasks.sort((a, b) => a.due.localeCompare(b.due));
                    
                    const groups = new Map<string, typeof datedTasks>();
                    datedTasks.forEach(t => {
                      const d = new Date(t.due + "T00:00:00");
                      const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
                      if (!groups.has(key)) groups.set(key, []);
                      groups.get(key)!.push(t);
                    });

                    return Array.from(groups.entries()).map(([key, items]) => {
                      const [y, m] = key.split("-").map(Number);
                      const d = new Date(y, m - 1, 1);
                      const monthName = d.toLocaleString(undefined, { month: "long", year: "numeric" });
                      const doneCount = items.filter(i => i.status === "Done").length;
                      const pct = Math.round((doneCount / items.length) * 100);

                      return (
                        <div key={key} className="border border-paper-3 rounded-xl overflow-hidden bg-paper">
                          <div className="bg-paper-2 px-4 py-3 border-b border-paper-3 flex items-center justify-between">
                            <div className="font-bold text-[14px]">{monthName}</div>
                            <div className="text-sm px-2 py-1 bg-paper-3 rounded-full text-ink-2">{items.length} tasks · {pct}% done</div>
                          </div>
                          <div className="p-2 space-y-2">
                            {items.map(t => (
                              <div 
                                key={t.id} 
                                onClick={() => setDrawerTask({ projectId: selectedProject.id, sectionId: t.sectionId, taskId: t.id })}
                                className="flex items-center justify-between p-3 border border-paper-3 rounded-lg hover:bg-paper-2 cursor-pointer transition-colors"
                              >
                                <div>
                                  <div className="font-medium text-[14px] mb-1">{t.name || "Task"}</div>
                                  <div className="text-sm text-ink-3 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-paper-3 rounded-full">{t.sectionName}</span>
                                    <span>Due: <strong className="text-ink-2">{formatDate(t.due)}</strong></span>
                                    <span>Assignee: {t.assignee || "—"}</span>
                                  </div>
                                </div>
                                <div className="text-sm px-2 py-1 bg-paper-3 rounded-full text-ink-2">
                                  {t.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-ink-3 italic">
              No project selected. Create one from the top-right.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmState && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmState(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-paper rounded-xl shadow-2xl border border-paper-3 p-6 overflow-hidden"
            >
              <div className="text-[14px] font-bold mb-2">Confirm Action</div>
              <div className="text-sm text-ink-3 mb-6 leading-relaxed">
                {confirmState.message}
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmState(null)}
                  className="px-4 py-2 text-sm font-medium text-ink-3 hover:text-ink hover:bg-paper-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmState.onConfirm}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Drawer */}
      <AnimatePresence>
        {drawerTask && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerTask(null)}
              className="fixed inset-0 bg-black/10 z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-[400px] max-w-full bg-paper border-l border-paper-3 shadow-2xl z-[70] flex flex-col"
            >
              {(() => {
                const p = projects.find(x => x.id === drawerTask.projectId);
                const s = p?.sections.find(x => x.id === drawerTask.sectionId);
                const t = s?.tasks.find(x => x.id === drawerTask.taskId);
                
                if (!p || !s || !t) return null;

                return (
                  <>
                    <div className="flex items-center justify-between p-4 border-b border-paper-3 shrink-0">
                      <div className="font-bold text-sm truncate">{t.name ? `Task: ${t.name}` : 'Task'}</div>
                      <button onClick={() => setDrawerTask(null)} className="p-1 hover:bg-paper-2 rounded text-ink-3 hover:text-ink">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 space-y-4">
                      <div>
                        <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Task name</label>
                        <input 
                          type="text" 
                          value={t.name}
                          onChange={e => updateTask(p.id, s.id, t.id, { name: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink"
                          placeholder="Task name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Assignee</label>
                          <input 
                            type="text" 
                            value={t.assignee}
                            onChange={e => updateTask(p.id, s.id, t.id, { assignee: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink"
                            placeholder="e.g., Dione"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Due date</label>
                          <input 
                            type="date" 
                            value={t.due}
                            onChange={e => updateTask(p.id, s.id, t.id, { due: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Status</label>
                          <select 
                            value={t.status}
                            onChange={e => updateTask(p.id, s.id, t.id, { status: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink"
                          >
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Blocked">Blocked</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Section</label>
                          <select 
                            value={s.id}
                            onChange={e => {
                              moveTask(p.id, s.id, e.target.value, t.id);
                              setDrawerTask({ projectId: p.id, sectionId: e.target.value, taskId: t.id });
                            }}
                            className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink"
                          >
                            {p.sections.map(sec => (
                              <option key={sec.id} value={sec.id}>{sec.name || "Section"}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-ink-3 mb-1.5 ml-0.5">Notes</label>
                        <textarea 
                          value={t.notes}
                          onChange={e => updateTask(p.id, s.id, t.id, { notes: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-paper border border-paper-3 rounded-lg focus:outline-none focus:border-ink min-h-[120px] resize-y"
                          placeholder="Add notes..."
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            if (confirm("Delete this task?")) {
                              deleteTask(p.id, s.id, t.id);
                              setDrawerTask(null);
                            }
                          }}
                          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete task
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
