import { neverWantedKinds } from '../src/sim/cookbook';
const k = neverWantedKinds().sort(); console.log(k.length, k.join(','));
