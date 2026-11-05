const { randomInt, randomUUID } = require('node:crypto');

function uniqueToken() {
  return randomUUID().replaceAll('-', '').slice(0, 10);
}

function employeeData() {
  const token = uniqueToken();
  return {
    employeeId: String(randomInt(100_000_000, 1_000_000_000)),
    firstName: `QA${token.slice(0, 6)}`,
    lastName: `Run${token.slice(6)}`,
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  };
}

function nonexistentUsername() {
  return `qa_missing_${uniqueToken()}`;
}

module.exports = { employeeData, nonexistentUsername };
