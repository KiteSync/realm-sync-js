import realm from '../components/realm';
import scripts from './scripts';

create = function(type, properties, update) {
  update = update || false;
  try {
    let dog = realm.create(type, properties, update);
    scripts.addObjectToSyncQueue('Dog', dog);
  } catch(error) {
    console.log("ERROR", error);
  }
}


module.exports = {
  create: create,
}
