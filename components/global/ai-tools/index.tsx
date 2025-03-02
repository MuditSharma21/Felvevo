import { TabsContent } from "@/components/ui/tabs"
import { Bot, FileTextIcon, Pencil, StarsIcon } from "lucide-react"

export const AiTools = ({
    plan, trial, videoId
}: {
    plan: 'PREMIUM' | 'FREE'
    trial: boolean
    videoId: string
}) => {
    //WIP: Setup the ai hook
    return (
        <TabsContent value="AI Tools">
            <div className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-10">
                <div className="flex items-center">
                    <div className="w-8/12">
                        <h2 className="text-3xl font-bold">AI Tools</h2>
                        <p className="text-[#BDBDBD]">
                            Taking your video to the next step with the power of AI!
                        </p>
                    </div>                       
                </div>
                <div className="flex justify-between">
                    <div className=" border-[1px] rounded-xl p-4 gap-4 flex flex-col bg-[#0f1b1466] ">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-[#005F4C]">Felvevő Ai</h2>
                                <StarsIcon
                                    color="#005F4C"
                                    fill="#005F4C"
                                />
                        </div>
                        <div className="flex gap-2 items-start">
                            <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
                                <Pencil color="#005F4C" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="textmdg">Summary</h3>
                                <p className="text-muted-foreground text-sm">
                                    Generate a description for your video using AI.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-start">
                            <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
                                <FileTextIcon color="#005F4C" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="textmdg">Summary</h3>
                                <p className="text-muted-foreground text-sm">
                                    Generate a description for your video using AI.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-start">
                            <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
                                <Bot color="#005F4C" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-md">AI Agent</h3>
                                <p className="text-muted-foreground text-sm">
                                    Viewers can ask questions on your video and our ai agent will
                                    respond.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}