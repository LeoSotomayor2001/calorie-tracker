import { useState,ChangeEvent,FormEvent, Dispatch,useEffect } from "react"
import {v4 as uuidv4} from 'uuid'
import { categories } from "../data/categories"
import { Activity } from "../types"
import { useActivity } from "../hooks/useActivity"

export default function Form() {
    const initialState:Activity ={
        id:uuidv4(),
        category: 1,
        name: '',
        calories: 0
    }
    const {state, dispatch} = useActivity()
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
       if(state.activeId){
            const selectedActivity=state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
       } 
    },[state.activeId])
    
    // Handle change event in form fields
    // Parses input value to number if it's a number field
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const isNumberField=['category', 'calories'].includes(e.target.id);

        setActivity({
            ...activity,
            [e.target.id]:isNumberField ? Number(e.target.value) : e.target.value
        });
    };

    const isValidActivity = () => {
        const { name, calories} = activity;

        return name.trim() !== '' && calories > 0
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type:'save-activity', payload:{newActivity:activity}})
        setActivity({
            ...initialState,
            id:uuidv4()
        })
        
    }

  return (
    <form
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
    >
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className="font-bold">Categoria</label>

            <select 
                className="border border-slate-300 p-2 rounded-lg bg-white w-full"
                id="category"
                value={activity.category}
                onChange={handleChange}
            >
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
        </div>
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="name" className="font-bold">Actividad</label>
            <input
                id="name"
                type="text"
                className="border border-slate-300 p-2 rounded-lg bg-white w-full"
                placeholder="Ej. Ejercicio"
                value={activity.name}
                onChange={handleChange}
            />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="calories" className="font-bold">Calorias</label>
            <input
                id="calories"
                type="number"
                className="border border-slate-300 p-2 rounded-lg bg-white w-full"
                placeholder="Ej. 200"
                value={activity.calories}
                onChange={handleChange}
            />
        </div>

        <input  
            type="submit"
            value={activity.category===1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
            className="bg-lime-600 text-white font-bold p-2 rounded-lg cursor-pointer w-full
            disabled:opacity-10 disabled:cursor-not-allowed"
            disabled={!isValidActivity()}
        />
    </form>
  )
}
