import Navigator from "./NavigatorBar"
import Heading from "./heading"
export default function Layout({children}){
    return(
        <div>
             <Navigator/>
             <Heading/>
            {children}
        </div>

    )
}