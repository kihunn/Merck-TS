import { combineReducers } from "redux";

import samples from './samples'
import psamples from './psamples'
import printers from './printers'

export default combineReducers({ samples, printers, psamples });