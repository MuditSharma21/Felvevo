import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type initiastateProps = {
    folders: ({
        _count: {
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workspaceId: string | null
    })[]
}


const initialState: initiastateProps = {
    folders: []
}

export const Folders = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        FOLDERS: (state, action: PayloadAction<initiastateProps>) => {
            return { ...action.payload }
        }
    }
}) 

export const { FOLDERS } = Folders.actions
export default Folders.reducer