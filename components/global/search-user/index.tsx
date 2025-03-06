import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutationData } from "@/hooks/useMutationData"
import { useSearch } from "@/hooks/useSearch"
import Loader from "../loader/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { inviteMembers } from "@/actions/user"
import { useState, useCallback } from "react"

export const UserSearch = ({
    workspaceId
}: {
    workspaceId: string
}) => {
    const { query, onSearchQuery, isFetching, onUsers } = useSearch(
        'get-users',
        'USERS'
    )
    
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
    
    const [invitedUsers, setInvitedUsers] = useState<Record<string, boolean>>({})

    const { mutate } = useMutationData(
        ['invite-member'],
        async (data: { receiverId: string; email: string }) => {
            return inviteMembers(
                workspaceId,
                data.receiverId,
                data.email
            )
        }
    )
    
    const handleInvite = useCallback(async (userId: string, email: string) => {
        if (loadingStates[userId] || invitedUsers[userId]) {
            return
        }

        try {
            setLoadingStates(prev => ({ ...prev, [userId]: true }))
            
            await mutate({ receiverId: userId, email })
            
            setInvitedUsers(prev => ({ ...prev, [userId]: true }))
        } catch (error) {
            console.error("Invitation error:", error)
        } finally {
            setLoadingStates(prev => ({ ...prev, [userId]: false }))
        }
    }, [mutate, loadingStates, invitedUsers, workspaceId])
    
    return (
        <div className="flex flex-col gap-y-5">
            <Input
                onChange={onSearchQuery}
                value={query}
                className="bg-transparent border-2 outline-none"
                placeholder="Search for user..."
                type="text"
            />     

            {isFetching ? ( 
              <div className="flex flex-col gap-y-2">
                <Skeleton className="w-full h-8 rounded-xl"/>
              </div> 
            ) : !onUsers ? (
                ''
            ) : (
                <div className="flex flex-col gap-y-2">
                  {onUsers.map((user) => {
                    const isInvited = invitedUsers[user.id];
                    const isLoading = loadingStates[user.id];
                    
                    return (
                      <div
                        key={user.id}
                        className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage src={user.image as string} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <h3 className="text-bold text-lg capitalize">
                            {user.firstname} {user.lastname}
                          </h3>
                          <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                            {user.subscription?.plan}
                          </p>
                        </div>
                        <div className="flex-1 flex justify-end items-center">
                          <Button
                            onClick={() => handleInvite(user.id, user.email!)}
                            variant={'default'}
                            className="w-5/12 font-bold"
                            disabled={isInvited || isLoading}
                          >
                            <Loader
                              state={isLoading}
                              color="#000"
                            >
                              {isInvited ? "Invited" : "Invite"}
                            </Loader>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}
        </div>
    )
}