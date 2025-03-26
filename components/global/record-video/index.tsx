import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export const RecordVideo = () => {
    return (
        <>
            <p className="text-red-500 text-sm">**The .exe file is not downloadable at this moment as the desktop application based on Electron is not yet deployed. But you can see the already recorded videos here or run the app locally throught this 
                {' '}<a href={'https://www.github.com/MuditSharma21/felvevo-desktop'} target="_blank" className="text-blue-600 hover:underline">GitHub</a>{' '}
            link for yourself as it&apos;s fully functional locally. Other than this you can explore rest of the app freely.</p>
            <div className="flex items-center">
                <Button>
                    <Download size={50}/>
                    Download .exe file
                </Button>
            </div>
        </>
    )
}