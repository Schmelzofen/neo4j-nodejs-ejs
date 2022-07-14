function sendInput() {
    let values = {
        query: document.getElementById("inputSearch").value,
        property: document.getElementById("propertySelect").value
    }
    fetch("/data/querry",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        })
        .then((res) => {
            console.log("bla")
        })
}