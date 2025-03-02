import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type initiastateProps = {
    workspaces: {
        type: 'PERSONAL' | 'PUBLIC'
        name: string
        id: string
    }[]
}



const initialState: initiastateProps = {
    workspaces: []
}

export const Workspaces = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        WORKSPACES: (state, action: PayloadAction<initiastateProps>) => {
            return { ...action.payload }
        }
    }
})

export const { WORKSPACES } = Workspaces.actions
export default Workspaces.reducer