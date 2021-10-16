db.createUser({
  user: 'walter_user',
  pwd: 'secret',
  roles: [
    {
      role: 'readWrite',
      db: 'walter_db',
    },
  ],
});
