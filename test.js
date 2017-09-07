'use strict';

// This class is used for logins
class Login {
  constructor(hash) {
    this.sessions = [];
    this.users = [];
    Object.keys(hash).map(k => ({k, v: hash[k]})).map(e => {
      this.users.push({name: e.k,password: e.v});
    });
  }

  logout(user) {
    this.sessions.forEach((session, i) => {
      if (session === user) {
        this.sessions[i] = null;
      }
    });
    this.sessions = this.sessions.filter(session => session !== null);
  }

  // Checks if user exists
  userExists(user) {
    // Temp variable for storing the user if found
    for (let i of this.users) {
      if (i.name === user) {
        return true;
      }
    }
    return false;
  }

  // Register user
  registerUser(user, password) {
    if(!this.userExists(user)) this.users[this.users.length] = {name: user, password: password};
  }

  removeUser(user) {
    if(this.userExists(user)) {
      this.users[this.idx(user, this.users)] = null;
      this.users = this.users.filter(user => user !== null);
    }else console.log("The "+ user +" isn't registered");
  }

  checkPassword(user, password) {
    let passwordCorrect = this.users[this.idx(user, this.users)].password === password;
    return passwordCorrect;
  }

  updatePassword(user, oldPassword, newPassword) {
    // First we check if the user exists
    if(this.userExists(user)){
      if (this.checkPassword(user, oldPassword)) {
        this.users[this.idx(user, this.users)].password = newPassword;
        return true;
      }
    }
    return false;
  }

  login(user, password) {
    if (this.users[this.idx(user, this.users)].password === password) {
      this.sessions.push(user);
    }
  }

  // Gets index of an element in an array
  idx(element, array) {
    let cont=0;
    for (let i of array) {
      if (i.name === element) {
        return cont;
      }
      cont += 1;
    }
    return cont;
  }
}

let registeredUsers = {
  user1: 'pass1',
  user2: 'pass2',
  user3: 'pass3'
};

let login = new Login(registeredUsers);

login.registerUser('user4', 'pass4');
login.login('user4', 'pass4');
login.updatePassword('user3', 'pass3', 'pass5');
login.login('user3', 'pass5');
login.logout('user4');
login.logout('user3');
