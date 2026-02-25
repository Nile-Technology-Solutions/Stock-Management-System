import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { CheckSquare, Square, Calendar, Plus, RefreshCw, Filter, ListTodo, Search, Clock, CheckCircle2 } from '../../../components/icons';
import { todoApi } from '../../../services/todoApi';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await todoApi.getTodos();
      // Since the API uses 'day' enum in spec [Monday, Tuesday...], but the local UI uses HTML dates,
      // we'll fetch all and filter client-side for consistency with the existing UI logic, 
      // or map the date to a day if the backend requires the 'day' parameter.
      // For now, let's just fetch all as per getTodos() call.
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodos(true);
    }, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, [fetchTodos]);

  const handleRefresh = () => {
    fetchTodos(true);
  };

  const toggleTodo = async (todo) => {
    try {
      const updated = { ...todo, isCompleted: !todo.isCompleted };
      await todoApi.updateTodo(todo.id, updated);
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const filteredTodos = todos.filter(t => {
    // Backend spec uses 'day' (Monday, Tuesday...), UI uses date strings.
    // We'll match either if the backend structure varies, but prioritizing 'day' from spec.
    const targetDay = getDayName(filterDate);
    const matchesDate = t.day === targetDay || t.date === filterDate;
    const matchesCompleted = showCompleted || !t.isCompleted;
    return matchesDate && matchesCompleted;
  });

  const completionRate = todos.length > 0 ? Math.round((todos.filter(t => t.isCompleted).length / todos.length) * 100) : 0;

  const getRelativeDateLabel = (date) => {
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return 'Today';
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    if (date === tomorrow) return 'Tomorrow';
    return date;
  };

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
            {[0, 1, 2].map(offset => {
               const d = new Date();
               d.setDate(d.getDate() + offset);
               const dateStr = d.toISOString().split('T')[0];
               return (
                <button
                  key={dateStr}
                  onClick={() => setFilterDate(dateStr)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterDate === dateStr 
                    ? 'bg-cyan-500 text-white shadow-md' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {getRelativeDateLabel(dateStr)}
                </button>
               );
            })}
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
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Loading Tasks...</p>
          </div>
        ) : (
          <>
            {filteredTodos.map(todo => (
              <GlassCard 
                key={todo.id} 
                className={`p-4 transition-all hover:scale-[1.01] cursor-pointer group flex items-center gap-4 ${
                  todo.isCompleted ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : 'border-l-4 border-l-cyan-500'
                }`}
                onClick={() => toggleTodo(todo)}
              >
                <button className="flex-shrink-0 transition-transform active:scale-90">
                  {todo.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 group-hover:border-cyan-400 transition-colors" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`font-semibold text-slate-900 dark:text-slate-100 transition-all ${
                    todo.isCompleted ? 'line-through text-slate-500' : ''
                  }`}>
                    {todo.task || todo.text}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {todo.day || getRelativeDateLabel(todo.date)}
                    </span>
                    {todo.isCompleted && (
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
          </>
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

