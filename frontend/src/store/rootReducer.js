import homeReducer from "./reducers/homeReducer";
import cardReducer from "./reducers/cardReducer";
import authReducer from "./reducers/authReducer";
import orderReducer from "./reducers/orderReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import chatReducer from "./reducers/chatReducer";
const rootReducer = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    chat: chatReducer
}
export default rootReducer;