
import { create } from 'zustand'

type State = { token: string | null, login: (t:string)=>void, logout: ()=>void }

export const useAuth = create<State>((set) => ({
  token: localStorage.getItem('token'),
  login: (t:string) => { localStorage.setItem('token', t); set({ token: t }) },
  logout: () => { localStorage.removeItem('token'); set({ token: null }) }
}))
