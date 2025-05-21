import { useNavigation } from "@react-navigation/native"

export const navigate  = useNavigation()

export const actions = [{
    key :1 , icon :"home" , onPress: ()=>{
        navigate.navigate("Home")
    } , 
},
{
    key : 2 , icon : "arrow-downward" , onPress : () => {
        navigate.navigate("RecievedOrders")
    }
},
{
    key : 3 , icon : "arrow-upward" , onPress : () => {
        navigate.navigate("DispatchedOrders")
    }
},
{
    key:4 , icon : "Menu" , onPress :()=> {}
}
]