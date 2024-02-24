import Navigator from "./NavigatorBar"
export default function Layout({children}){
    return(
        <div>
             <Navigator/>
            {children}
        </div>

    )
}