import UserContext from '../model/UserContext'
class ClientID {
  //  创建随机数
  static create(){
    let time = new Date().getTime()
    let id = Math.round(Math.random() * 1000000)
    let head = Math.round(Math.random() * 1000000)
    return head +'creatTime' + time + 'ID' + id
  }
  // 比对是否存在
  static isViable() {
    let userCon = UserContext.get()
    if (userCon.clientIdentifier) {
      return userCon.clientIdentifier
    } else {
      userCon.clientIdentifier = this.create()
      UserContext.set(userCon)
      return userCon.clientIdentifier
    }
  }
}
export default ClientID