import {openStore} from './store.mjs';
const store=openStore(process.env.DEMO_DB||'data/demo.sqlite');store.reset();store.db.close();console.log('Demonstration data reset: 30 fictional complaints.');
