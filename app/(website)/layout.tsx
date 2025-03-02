import { LandingPageNavbar } from "./_components/navbar";

export default function ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col my-10 mx-10 xl:px-0">
            <LandingPageNavbar />
            {children}
        </div>
    )
}