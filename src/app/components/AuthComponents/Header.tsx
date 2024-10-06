interface HeaderProps {
    headerTitle: string,
}

export const Header = ({headerTitle}: HeaderProps) => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-5">{headerTitle}</h1>
        </div>
    )
}

