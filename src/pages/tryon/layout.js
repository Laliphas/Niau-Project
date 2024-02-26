import Navigator from "../../components/NavigatorBar"
import Heading from "@/components/heading"
export default function Layout({children}){
    return(
        <div>
             <Navigator/>
             <Heading/>
             
            {children}
            
        </div>

    )
}


       
    