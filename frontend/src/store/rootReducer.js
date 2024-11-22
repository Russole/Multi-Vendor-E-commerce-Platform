import homeReducer from "./reducers/homeReducer";
import cardReducer from "./reducers/cardReducer";
import authReducer from "./reducers/authReducer";
const rootReducer = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer 
}
export default rootReducer;