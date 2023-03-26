(function() {
    "use strict";
    
    /* CLOCK */
    document.addEventListener("DOMContentLoaded", function() {
        let c = document.getElementById("clock");
        
        setInterval(updateClock, 1000);
        
        function updateClock() {
            let date = new Date();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            let lühend = "";
            
            (h < 12 || h == 24) ? lühend = " EL" : lühend = " PL";
            if (h == 0) { h = 12; }
            if (h > 12) { h = h - 12; }
            if (m < 10) { m = "0" + m; }
            if (s < 10) { s = "0" + s; }
            c.innerHTML = h + ":" + m + ":" + s + lühend;
        };
    });
    /* CLOCK */
    
    /* FORMS */
    document.getElementById("form").addEventListener("submit", estimateDelivery);
    
    let e = document.getElementById("delivery");
    let summa_kokku = 0;
    e.innerHTML = summa_kokku.toFixed(2) + " &euro;";
    
    function estimateDelivery(event) {
        event.preventDefault();

        let fname = document.getElementById("fname");
        let lname = document.getElementById("lname");
        if (fname.value.length == 0 || lname.value.length == 0) {
            alert("Mõlemad nimeväljad peavad olema täidetud!");
            return;
        }

        let letters = /^[A-Za-z]+$/;
        if (!fname.value.match(letters) || !lname.value.match(letters)) {
            alert("Nimeväljad ei tohi sisaldada numbreid!");
            return;
        }

        let present = document.getElementById("v1");
        let contactless = document.getElementById("v2");
        let lisasumma = 0;
        if (present.checked) {
            lisasumma += 5;
        }
        if (contactless.checked) {
            lisasumma += 1;
        }

        let linn = document.getElementById("linn");
        if (linn.value === "") {
            alert("Palun valige linn nimekirjast!");
            linn.focus();
            return;
        }

        let radio_btns = document.querySelectorAll("input[type='radio']");
        let is_selected = 0;
        for (let radio_btn of radio_btns) {
            if (radio_btn.checked) {
                is_selected += 1;
            }
        }
        if (is_selected == 0) {
            alert("Tee maksevalik, see on veel tegemata!")
            return;
        }

        if (linn.value === "tln") {
            e.innerHTML = (summa_kokku + lisasumma).toFixed(2) + " &euro;";
        }
        else if (linn.value === "trt") {
            e.innerHTML = (summa_kokku + lisasumma + 2.5).toFixed(2) + " &euro;";
        }
        else if (linn.value === "nrv") {
            e.innerHTML = (summa_kokku + lisasumma + 2.5).toFixed(2) + " &euro;";
        }
        else {
            e.innerHTML = (summa_kokku + lisasumma + 3).toFixed(2) + " &euro;";
        }
        console.log("Tarne hind on arvutatud!");
    }
    /* FORMS */
})();

/* MAP */
let mapAPIKey = "AqLLRE37SJGqIxXEYxezPUa6fF2oCzl3cvG4n05FtFIVBrotBYxchpMYYpwuxBak";
let map;

function GetMap() {
    "use strict";
    
    let center_point = new Microsoft.Maps.Location(58.595272, 25.013607);
    map = new Microsoft.Maps.Map("#map", {
        credentials: mapAPIKey,
        center: center_point,
        zoom: 8,
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        disablePanning: true
    });

    let address_1 = new Microsoft.Maps.Location(58.38104, 26.71992);
    let pushpin_1 = new Microsoft.Maps.Pushpin(address_1, {
            title: "Tartu Ülikool",
            //subTitle: "HEA KOHT NR.1",
            //text: "TÜ",
    });

    let address_2 = new Microsoft.Maps.Location(58.9392891, 23.5415268);
    let pushpin_2 = new Microsoft.Maps.Pushpin(address_2, {
        title: "Haapsalu Kolledž",
        //subTitle: "HEA KOHT NR.2",
        //text: "TLÜ HK"
    });


    let infobox_1 = new Microsoft.Maps.Infobox(address_1, {
        visible: false,
    });
    pushpin_1.metadata = {
        title: "Tartu Ülikool (peahoone)",
        description: "Ülikooli 18, 50090 Tartu",
    };

    let infobox_2 = new Microsoft.Maps.Infobox(address_2, {
        visible: false,
    });
    pushpin_2.metadata = {
        title: "Tallinna Ülikooli Haapsalu Kolledž",
        description: "Lihula mnt 12, Haapsalu, 90507 Lääne maakond",
    };

    infobox_1.setMap(map);
    infobox_2.setMap(map);

    map.entities.push(pushpin_1);
    map.entities.push(pushpin_2);

    Microsoft.Maps.Events.addHandler(pushpin_1, "click", pushpin_clicked);
    Microsoft.Maps.Events.addHandler(pushpin_2, "click", pushpin_clicked);

    function pushpin_clicked(e) {
        if (e.target.metadata) {
            infobox_1.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                description: e.target.metadata.description,
                visible: true
            });
        }
    }
}
/* MAP */

// https://dev.virtualearth.net/REST/v1/Locations?q=1000 Vin Scully Ave, Los Angeles,CA&key=YOUR_KEY_HERE