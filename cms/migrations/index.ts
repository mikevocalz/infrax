import * as migration_20261106_211324_initial_auth_editorial from './20261106_211324_initial_auth_editorial';

export const migrations = [
  {
    up: migration_20261106_211324_initial_auth_editorial.up,
    down: migration_20261106_211324_initial_auth_editorial.down,
    name: '20261106_211324_initial_auth_editorial'
  },
];
