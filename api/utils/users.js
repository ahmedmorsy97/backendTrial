export class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const removedUser = this.getUser(id);
    if (removedUser) this.users = this.users.filter((el) => el.id !== id);
    return removedUser;
  }

  getUser(id) {
    return this.users.filter((el) => el.id === id)[0];
  }

  getUserList(room) {
    const userList = this.users.filter((el) => el.room === room);
    const namesArray = userList.map((el) => el.name);
    return namesArray;
  }

  checkUserName(name) {
    const userList = this.users.filter((el) => el.name === name);
    return userList.length > 0 ? true : false;
  }
}
