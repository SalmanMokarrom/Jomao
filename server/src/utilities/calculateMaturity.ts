// install dependencies
import {addMonths} from "date-fns"

const calculateMaturity = (durationMonths: 3|6|9|12):Date=>{
    return addMonths(Date.now(), durationMonths)
}

export default calculateMaturity