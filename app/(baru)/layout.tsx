import Sidebar from "../component/Sidebar";

export default function layout({children}: { children: React.ReactNode}){
    return(

<div className="flex">
     <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto">
              {children}
            </main>
</div>
    )
}