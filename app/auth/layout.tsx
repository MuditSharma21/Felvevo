
export default function ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen justify-center items-center container">
            {children}
        </div>
    )
}