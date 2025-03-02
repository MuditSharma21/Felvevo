

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutationData } from "@/hooks/useMutationData"
import { useSearch } from "@/hooks/useSearch"
import Loader from "../loader/loader"
import { useRouter } from "next/navigation" // For navigation
import { Folder, Video } from "lucide-react"
import { useState } from "react"

export const ItemSearch = ({
    workspaceId
}: {
    workspaceId: string
}) => {
    const [searchType, setSearchType] = useState<'VIDEOS' | 'FOLDERS'>('VIDEOS') // State to toggle between videos and folders

    const { query, onSearchQuery, isFetching, onFolders, onVideos } = useSearch(
        'get-search-results', // Modify key based on search type
        searchType // Dynamically set search type (VIDEOS or FOLDERS)
    )



    const router = useRouter()

    // Handler to open a specific folder or video
    const handleOpen = (type: 'folder' | 'video', id: string) => {
        if (type === 'folder') {
            router.push(`/dashboard/${workspaceId}/folder/${id}`) // Navigate to folder detail page
        } else if (type === 'video') {
            router.push(`/dashboard/${workspaceId}/video/${id}`) // Navigate to video detail page
        }
    }

    // Toggle between search types (VIDEOS or FOLDERS)
    const handleSearchTypeChange = (type: 'VIDEOS' | 'FOLDERS') => {
        setSearchType(type)
    }

    return (
        <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={searchType === 'VIDEOS' ? 'default' : 'outline'}
                        onClick={() => handleSearchTypeChange('VIDEOS')}
                    >
                        Videos
                    </Button>
                    <Button
                        variant={searchType === 'FOLDERS' ? 'default' : 'outline'}
                        onClick={() => handleSearchTypeChange('FOLDERS')}
                    >
                        Folders
                    </Button>
                </div>
                <Input
                    onChange={onSearchQuery}
                    value={query}
                    className="bg-transparent border-2 outline-none"
                    placeholder={`Search for ${searchType.toLowerCase()}...`}
                    type="text"
                />
            </div>

            {isFetching ? (
                <div className="flex flex-col gap-y-2">
                    <Skeleton className="w-full h-8 rounded-xl" />
                </div>
            ) : !onFolders && !onVideos ? (
                ''
            ) : (
                <div>
                    {/* Videos */}
                    {searchType === 'VIDEOS' && onVideos && onVideos.length > 0 && (
                        <div className="my-4">
                            <h3 className="text-xl font-bold mb-2">Videos</h3>
                            <div className="overflow-y-auto h-72">
                                {onVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl cursor-pointer mt-2"
                                        onClick={() => handleOpen('video', video.id)}
                                    >
                                        <div className="flex flex-col items-start">
                                            <h3 className="text-bold text-lg">
                                                {video.title || 'Untitled Video'}
                                            </h3>
                                            <p className="text-xs text-[#959393]">
                                                {video.folderName} | {video.workspaceName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Folders */}
                    {searchType === 'FOLDERS' && onFolders && onFolders.length > 0 && (
                        <div className="my-4">
                            <h3 className="text-xl font-bold mb-2">Folders</h3>
                            <div className="overflow-y-auto h-72">
                            {onFolders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl cursor-pointer mt-2"
                                    onClick={() => handleOpen('folder', folder.id)}
                                >
                                    <div className="flex flex-col items-start">
                                        <h3 className="text-bold text-lg">
                                            {folder.folderName || 'Untitled Folder'}
                                        </h3>
                                        <p className="text-xs text-[#959393]">
                                            {folder.workspaceName} | {folder.videoCount} videos
                                        </p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
