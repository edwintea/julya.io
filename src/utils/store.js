import { createStore } from 'redux'



const storeManage =  {
    hasil : [],
    storeHasil(dataUser){
        this.hasil = dataUser;
        console.log("hasil : ", this.hasil);
    },
    stateManage(state = [], action) {
        return state;
    },
    store(dataUser){
        const stored = createStore(this.stateManage, dataUser);
        this.storeHasil(stored.getState());
    },
    getStates(){
        return 'false'
    }
}


export default storeManage;