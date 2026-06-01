import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { settingsApi, tasksApi } from '../../services/api';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    // Começa com estado inicial; API vai sobrescrever no useEffect
    return initialTaskState;
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const worker = TimerWorkerManager.getInstance();

  // ── Carrega settings e tasks da API no startup ──────────────────────────
  useEffect(() => {
    settingsApi.get().then(settings => {
      dispatch({
        type: TaskActionTypes.CHANGE_SETTINGS,
        payload: {
          workTime: settings.workTime,
          shortBreakTime: settings.shortBreakTime,
          longBreakTime: settings.longBreakTime,
        },
      });
    }).catch(() => {
      // API offline: tenta localStorage como fallback
      const storageState = localStorage.getItem('state');
      if (storageState) {
        const parsed = JSON.parse(storageState) as TaskStateModel;
        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: parsed.config,
        });
      }
    });

    tasksApi.list().then(apiTasks => {
      dispatch({
        type: TaskActionTypes.LOAD_TASKS,
        payload: apiTasks.map(t => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          startDate: t.startDate,
          completeDate: t.completeDate,
          interruptDate: t.interruptDate,
          type: t.type as TaskStateModel['config'] extends Record<infer K, unknown> ? K : never,
        })),
      });
    }).catch(() => {
      // API offline: usa localStorage
      const storageState = localStorage.getItem('state');
      if (storageState) {
        const parsed = JSON.parse(storageState) as TaskStateModel;
        dispatch({ type: TaskActionTypes.LOAD_TASKS, payload: parsed.tasks });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer worker ────────────────────────────────────────────────────────
  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        // Persiste complete na API
        if (state.activeTask) {
          tasksApi.complete(state.activeTask.id, Date.now()).catch(() => {});
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker, state.activeTask]);

  useEffect(() => {
    // Salva no localStorage como fallback
    localStorage.setItem('state', JSON.stringify(state));

    if (!state.activeTask) {
      worker.terminate();
    }

    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
