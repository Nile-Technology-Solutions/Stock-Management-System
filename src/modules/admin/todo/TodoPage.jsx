import { useState, useEffect } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { CheckSquare, Square, Calendar, Plus, RefreshCw, Filter, ListTodo, Search, Clock, CheckCircle2 } from '../../../components/icons';
import { mockTodos } from '../../../services/mockData';

const TodoPage = () => {
  const [todos, setTodos] = useState(mockTodos);
  const [filterDate, setFilterDate] = useState('2026-02-17');
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const filteredTodos = todos.filter(t => {
    const matchesDate = t.date === filterDate;
    const matchesCompleted = showCompleted || !t.completed;
    return matchesDate && matchesCompleted;
  });

  const completionRate = todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Admin Tasks
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-cyan-100 text-sm">System integrity & Operations</span>
                <span className="w-1 h-1 rounded-full bg-cyan-300" />
                <span className="text-cyan-100 text-sm font-bold">{completionRate}% Done</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
               variant="glass-secondary" 
               className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
               onClick={handleRefresh}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button className="bg-white text-cyan-600 hover:bg-cyan-50 border-none font-bold px-6 shadow-xl">
              <Plus className="w-4 h-4 mr-2" />
              Quick Task
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Toolbox */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <GlassCard className="flex-1 p-3 flex items-center gap-4 border-slate-200/50 dark:border-slate-800/50">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div className="flex-1 flex gap-2">
            {['2026-02-17', '2026-02-18', '2026-02-19'].map(date => (
              <button
                key={date}
                onClick={() => setFilterDate(date)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterDate === date 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {date === '2026-02-17' ? 'Today' : date === '2026-02-18' ? 'Tomorrow' : date}
              </button>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="p-3 flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
              className="hidden"
            />
            <div className={`w-10 h-5 rounded-full p-1 transition-all ${showCompleted ? 'bg-green-500' : 'bg-slate-300'}`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-all ${showCompleted ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Show Done</span>
          </label>
        </GlassCard>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTodos.map(todo => (
          <GlassCard 
            key={todo.id} 
            className={`p-4 transition-all hover:scale-[1.01] cursor-pointer group flex items-center gap-4 ${
              todo.completed ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : 'border-l-4 border-l-cyan-500'
            }`}
            onClick={() => toggleTodo(todo.id)}
          >
            <button className="flex-shrink-0 transition-transform active:scale-90">
              {todo.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 group-hover:border-cyan-400 transition-colors" />
              )}
            </button>
            
            <div className="flex-1">
              <p className={`font-semibold text-slate-900 dark:text-slate-100 transition-all ${
                todo.completed ? 'line-through text-slate-500' : ''
              }`}>
                {todo.text}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due {todo.date === '2026-02-17' ? 'Today' : 'Upcoming'}
                </span>
                {todo.completed && (
                  <span className="text-[10px] font-bold uppercase text-green-500">Verified</span>
                )}
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 text-slate-400 hover:text-cyan-500">
                  <Search className="w-4 h-4" />
               </button>
            </div>
          </GlassCard>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-20">
             <ListTodo className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <h3 className="text-slate-500 font-bold uppercase tracking-widest">No Tasks Found</h3>
             <p className="text-slate-400 text-sm mt-1">Enjoy your productivity!</p>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live Sync Active
      </div>
    </div>
  );
};

export default TodoPage;
