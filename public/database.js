let db;
const request = indexDatabase.open("budget", 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    // check app status before pulling from database

if(navigator.onLine){
    checkDatabase();
}
};

request.onerror = function(event) {
    console.log("Error" + event.targer.errorCode);
};

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending"), 
    const getAll = store.getAll();

    getAll.onsuccess = function(){
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {

                method: "POST",
                body: JSON.stringify(getAll.result),
                header: {
                            // define content type the client accepts
                    accept: "application/json, text/plain, */*",
                    "Content-Type":"application/json",
                },
            })
            .then((response) => response.json())
            .then(() => {
                const transfer = db.transaction(["pending"], "readwrite");
                const store = transfer.objectStore("pending");
                // clear all stored in database
                store.clear();
            });
        }
    };
}

function saveTransaction(record) {
    const transaction = dbtransaction(["pending"], "readwrite");
    const store = transaction.objectStore(pending);
    // record & save transaction for future
    store.add(record)

}

window.addEventListener("online", checkDatabase)