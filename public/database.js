let database;
const request = indexDatabase.open("budget", 1);

request.onupgradeneeded = function(event){
    const database = event.target.result;
    database.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function(event) {
    database = event.target.result;

    // check app status before pulling from database
if(navigator.onLine){
    checkDatabase();
}
};

request.onerror = function(event) {
    console.log("Error" + event.targer.errorCode);
};