interface headerProps {
    LandingTitle : string, 
    LandingSubTitle : string
}

export const LandingHeader = ({LandingTitle, LandingSubTitle} : headerProps) => {
  return (
    <>
    <div className="m-10">
   
    <div className="grid grid-cols-2 gap-5 items-center align-baseline">

        <div>
            <h1 className="text-4xl font-bold  text-end animate-slideIn">{LandingTitle}</h1>
        </div>
        <div>
        <h1 className="text-xl font-semibold text-zinc-500  text-start animate-slideIn">talk it out, and share it with your people.</h1>
        </div>

    </div>
         
    </div>

    </>
  )
}