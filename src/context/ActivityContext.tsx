import { Dispatch, ReactNode, createContext, useMemo, useReducer } from "react";
import { ActivityActions, ActivityState, activityReducer, initialState } from "../reducers/activityReducer";
import { categories } from "../data/categories";
import { Activity } from "../types";
type ActivityProviderProps = {
    children:ReactNode
}

export type ActivityContextProps = {
    state:ActivityState,
    dispatch:Dispatch<ActivityActions>,
    categoryName: (category: Activity['category']) => string
    isEmptyActivity:boolean
}

export const ActivityContext = createContext<ActivityContextProps>({} as ActivityContextProps)


export const ActivityProvider = ({children}:ActivityProviderProps) =>{
    const [state, dispatch] = useReducer(activityReducer,initialState)
    const categoryName=useMemo(() => 
        (category:Activity['category']) => {
            const categoryNames = categories.filter(cat => cat.id === category).map(cat => cat.name);
            return categoryNames.length > 0 ? categoryNames[0] : '';
        }
    , [state.activities])
    const isEmptyActivity=useMemo(() => state.activities.length === 0, [state.activities])
    return(
        <ActivityContext.Provider value={{
            state,
            dispatch,
            isEmptyActivity,
            categoryName
        }}>
            {children}
        </ActivityContext.Provider>
    )
}


