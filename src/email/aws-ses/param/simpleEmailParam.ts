import BaseEmailParam from './baseEmailParam'
import Message from './message'
import Destination from './destination'

export default interface SimpleEmailParam extends BaseEmailParam {
  Destination: Destination
  Message: Message
}
