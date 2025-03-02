import React, { useEffect, useState } from "react"
import { useQueryData } from "./useQueryData"
import { searchUser } from "@/actions/user"
import { searchFolder, searchVideo } from "@/actions/workspace"

export const useSearch = (key: string, type: 'USERS' | 'FOLDERS' | 'VIDEOS') => {
    const [query, setQuery] = useState('')
    const [debounce, setDebounce] = useState('')
    const [onUsers, setOnUsers] = useState<
        | { 
            id: string
            subscription: { plan: 'PREMIUM' | 'FREE' } | null
            firstname: string | null
            lastname: string | null
            image: string | null
            email: string | null
        }[] | undefined
    >(undefined)

    const [onFolders, setOnFolders] = useState<
        { id: string,folderName: string, workspaceName: string, videoCount: number }[] | undefined
    >(undefined)

    const [onVideos, setOnVideos] = useState<
        { id: string, title: string, folderName: string, workspaceName: string, createdBy: string }[] | undefined
    >(undefined)

    const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    // Debouncing
    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebounce(query)
        }, 1000)
        return () => clearTimeout(delayInputTimeoutId)
    }, [query])

    const { refetch, isFetching } = useQueryData([key, debounce], async ({ queryKey }) => {
        if (type === 'USERS') {
            const users = await searchUser(queryKey[1] as string)
            if (users.status === 200) {
                setOnUsers(users.data)
                return users.data
            } else {
                setOnUsers([])
                return []
            }
        }

        if (type === 'FOLDERS') {
            const folders = await searchFolder(queryKey[1] as string)
            if (folders.status === 200) {
                setOnFolders(folders.data)
                return folders.data
            } else {
                setOnFolders([])
                return []
            }
        }

        if (type === 'VIDEOS') {
            const videos = await searchVideo(queryKey[1] as string)
            if (videos.status === 200) {
                setOnVideos(videos.data)
                return videos.data
            } else {
                setOnVideos([])
                return []
            }
        }
    }, false)

    useEffect(() => {
        if (debounce) refetch()
        if (!debounce) {
            setOnUsers(undefined)
            setOnFolders(undefined)
            setOnVideos(undefined)
        }
        return () => {
            debounce
        }
    }, [debounce])

    return { onSearchQuery, query, isFetching, onUsers, onFolders, onVideos }
}
