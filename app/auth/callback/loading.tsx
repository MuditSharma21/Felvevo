import Loader from "@/components/global/loader/loader";

const AuthLoading = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <div className="flex h-screen w-full justify-center items-center">
            <Loader state={isLoading} color="white"/>
        </div>
    );
}

export default AuthLoading;