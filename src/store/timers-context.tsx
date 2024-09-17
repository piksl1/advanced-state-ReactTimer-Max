import {  createContext, useContext, useReducer, type ReactNode } from "react";

export type Timer = {
    name: string;
    duration: number;
};

type TimersState= {
    isRunning: boolean;
    timers: Timer[];
};
const initialState: TimersState = {
    isRunning: true,
    timers: [],
};

type TimersContextValue= TimersState & {
    addTimer: (timerData: Timer) => void;
    startTimer: () => void;
    stopTimer: () => void;
};



 const TimersContext = createContext<TimersContextValue | null>(null);

 export const useTimersContext= ()=> {
    const timersCtx = useContext(TimersContext);
    if (timersCtx === null) {
        throw new Error('useTimersContext must be used within a TimersContextProvider');
    }
    return timersCtx;
}

type TimersContextProviderProps= {
    children: ReactNode;
};

type StartTimerAction= {
    type: 'START_TIMER';
}

type StopTimerAction= {
    type: 'STOP_TIMER';
}

type AddTimerAction= {
    type: 'ADD_TIMER';
    payload: Timer;
}

type Action= StartTimerAction | StopTimerAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
    switch (action.type) {
        case 'START_TIMER':
            return {
                ...state,
                isRunning: true,
            };
        case 'STOP_TIMER':
            return {
                ...state,
                isRunning: false,
            };
        case 'ADD_TIMER':
            return {
                ...state,
                timers: [...state.timers, {name: action.payload.name, duration: action.payload.duration}],
            };  
        default:
            return state;
    }
}
    


export default function TimersContextProvider({ children }: TimersContextProviderProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState);
    const ctx: TimersContextValue = {
        isRunning: timersState.isRunning,    
        timers: timersState.timers,
        addTimer: (timerData) => {
            dispatch({ type: 'ADD_TIMER', payload: timerData });
        },
        startTimer: () => {
            dispatch({ type: 'START_TIMER' });
        },
        stopTimer: () => {
            dispatch({ type: 'STOP_TIMER' });
        },
    };
    return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>;
}