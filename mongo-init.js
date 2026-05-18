db = db.getSiblingDB('mitharva_ai');

db.createUser({
  user: 'admin',
  pwd: 'MitharvaDB@2026',
  roles: [
    {
      role: 'readWrite',
      db: 'mitharva_ai'
    }
  ]
});
