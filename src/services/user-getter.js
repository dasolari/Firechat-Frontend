export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

export function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function deleteCurrentUser() {
  localStorage.removeItem('currentUser');
}
