function makeNewEvent(title, year=2019, month=11, week=3, day=29, hour=23, minute=59, second=59, date) {
    date = date.split("-").map(tc=>tc.trim()).join("-");
    // console.log(date);
    var newDate = new Date(date);
    return `
                    <div class="event">
                        <div class="event-header">
                            <span class="event-title">${title}</span>
                            <span class="timeType">
                                <select onchange="changeTimeDisplayType(this.parentElement.parentElement.parentElement)">
                                    <option value="full">Full View</option>
                                    <option value="second">Seconds</option>
                                    <option value="minute">Minutes</option>
                                    <option value="hour">Hour</option>
                                    <option value="day">Days</option>
                                    <option value="week">Weeks</option>
                                    <option value="month">Months</option>
                                    <option value="year">Years</option>
                                </select>
                            </span>
                            <span class="event-edit" style="top:10px;right:54px; color:dodgerblue;" onclick="editEvent(this.parentElement.parentElement)">Edit</span>
                            <span class="event-delete" style="top:10px;right:10px; color:red;" onclick="deleteEvent(this.parentElement.parentElement)">Delete</span>
                        </div>
                        <div class="event-body">
                            <div class="event-date">
                                <div style="width: 100%; height:20px;">Date</div>
                                <div class="date" style="margin-top:10px;display:inline-block;width:130px; padding:1.5px 0px; border-radius:4px;color:white;background:dodgerblue;">${date}</div>
                            </div>
                            <div class="event-timeleft" style="">
                                <div style="min-width: 100%; height:20px; display: block;">Time Left </div>
                                <div class="years" style="">${year} Year${year > 1 ? "s" : ""}</div>
                                <div class="months" style="">${month} Month${month > 1 ? "s" : ""}</div>
                                <div class="weeks" style="">${week} Week${week > 1 ? "s" : ""}</div>
                                <div class="days" style="">${day} Day${day > 1 ? "s" : ""}</div>
                                <div class="hours" style="">${hour} Hour${hour > 1 ? "s" : ""}</div>
                                <div class="minutes" style="">${minute} Minute${minute > 1 ? "s" : ""}</div>
                                <div class="seconds" style="">${second} Second${second > 1 ? "s" : ""}</div>
                            </div>
                        </div>
                        <div class="event-footer">

                        </div>
                    </div>`;
}

window.onload = function() {
    loadEvents();
}

$("#searchText").addEventListener("input", function() {
    var findWhat = this.value;
    if (findWhat.length) {
        $("#addnew-event").classList.add("hide");
    } else {
        $("#addnew-event").classList.remove("hide");
    }
    var allEvents = [...$$(".event")];
    allEvents.forEach(e=>{
        var eventName = e.querySelector(".event-title").innerText.toLowerCase();
        if (!eventName.includes(findWhat.toLowerCase())) {
            e.classList.add("hide");
        } else {
            e.classList.remove("hide");
        }
    }
    );
});

function loadEvents() {
    // var data = JSON.stringify([{"eventTitle":"Durga Puja","eventDate":"20-02-2020"},{"eventTitle":"Kali Puja","eventDate":"20-02-2020"}])
    var eventList = localStorage.getItem("timeTracker");
    if ( !eventList ) {
        var data = JSON.stringify([{"eventTitle":"FIFA World Cup 2021","eventDate":"20-02-2021"}]);
        localStorage.setItem("timeTracker", data);
        loadEvents();
    }
    eventList = JSON.parse(eventList);
    var eventMat = $("#event-mat");
    eventList.forEach((e,i,s)=>{
        timeArray = makeTime(e.eventDate.split("-").map(tc=>tc.trim()).join("-")).split("-");
        eventMat.innerHTML += makeNewEvent(e.eventTitle, timeArray[0], timeArray[1], timeArray[2], timeArray[3], timeArray[4], timeArray[5], timeArray[6], e.eventDate);
    });
    [...$$(".event")].forEach((event)=>{
        !parseInt(event.querySelector(".years").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".years").classList.add("hide") : "";
        !parseInt(event.querySelector(".months").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".months").classList.add("hide") : "";
        !parseInt(event.querySelector(".weeks").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".weeks").classList.add("hide") : "";
        !parseInt(event.querySelector(".days").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".days").classList.add("hide") : "";
        !parseInt(event.querySelector(".hours").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".hours").classList.add("hide") : "";
        !parseInt(event.querySelector(".minutes").innerText) && !event.classList.contains("isolatedDisplay") ? event.querySelector(".minutes").classList.add("hide") : "";
    });
}

function showNewEventForm() {
    $("#newEventAdderPane-container").style.display = "block";
}

function addNewEvent() {
    $("#newEventAdderPane-container").style.display = "none";
    var eventTitle = $("#event-name").value;
    $("#event-name").value = "";
    var eventDate = $("#event-date").value;
    $("#event-date").value = "";
    eventDate = `${eventDate.split("-")[1]}-${eventDate.split("-")[0]}-${eventDate.split("-")[2]}`;
    if (eventTitle.length && verifyDate(eventDate)) {
        eventDate = `${eventDate.split("-")[1]} - ${eventDate.split("-")[0]} - ${eventDate.split("-")[2]}`;
        $("#event-mat").innerHTML += makeNewEvent(eventTitle, "3", "10", "9", "2", "2", "1", "59", eventDate);
        storeNewEvent(eventTitle, eventDate);
    } else {
        alert("Invalid Input! \n\t\t Try Again ");
    }
}

function storeNewEvent(eventTitle, eventDate) {
    var allEvents = JSON.parse(localStorage.getItem("timeTracker"));
    // console.log(x);
    allEvents.push({
        "eventTitle": eventTitle,
        "eventDate": eventDate,
        "eventId": allEvents.length + 1
    });
    localStorage.setItem("timeTracker", JSON.stringify(allEvents));
}

function verifyDate(date) {
    return (new Date(date).getDate());
}

function deleteEvent(event) {
    $("#confirmation-popup-container").style.display = "block";
    event.classList.add("toDelete");
}
function yesDelete(what, d) {
    var event = $(".toDelete");
    if (what === "yes") {
        var allEvents = JSON.parse(localStorage.getItem("timeTracker"));
        allEvents = allEvents.filter(e=>{
            if (e.eventTitle.toLowerCase().trim() === event.querySelector(".event-title").innerText.toLowerCase().trim()) {
                return 0;
            } else {
                return 1;
            }
        }
        );
        localStorage.setItem("timeTracker", JSON.stringify(allEvents));
        event.remove();
    } else {
        event.classList.remove("toDelete");
    }
    d.style.display = "none";
}

function editEvent(event) {
    $("#editEventAdderPane-container #event-name").value = event.querySelector(".event-title").innerText;
    $("#editEventAdderPane-container #event-date").value = event.querySelector(".date").innerText;
    $("#editEventAdderPane-container").style.display = "block";
    event.classList.add("being-edited");
}

function updateEvent(node) {
    var eventTitle = node.querySelector("#event-name").value;
    var eventDate = node.querySelector("#event-date").value;
    var eventTitleBackup = $(".being-edited").querySelector(".event-header .event-title").innerText;
    var timeArray = makeTime($(".being-edited").querySelector(".date").innerText).split("-");
    $(".being-edited").querySelector(".event-header .event-title").innerText = eventTitle;
    $(".being-edited").querySelector(".event-date .date").innerText = eventDate;
    $(".being-edited").querySelector(".event-timeleft").innerHTML = `    
            <div style="min-width: 100%; height:20px; display: block;">Time Left </div>
            <div class="years">${timeArray[0]} Year${timeArray[0]>1?"s":""}</div>
            <div class="months">${timeArray[1]} Month${timeArray[1]>1?"s":""}</div>
            <div class="weeks">${timeArray[2]} Week${timeArray[2]>1?"s":""}</div>
            <div class="days">${timeArray[3]} Day${timeArray[3]>1?"s":""}</div>
            <div class="hours">${timeArray[4]} Hour${timeArray[4]>1?"s":""}</div>
            <div class="minutes">${timeArray[5]} Minute${timeArray[5]>1?"s":""}</div>
            <div class="seconds">${timeArray[6]} Second${timeArray[6]>1?"s":""}</div>
    `;
    $(".being-edited").classList.remove("being-edited");
    $("#editEventAdderPane-container").style.display = "none";

    var allEvents = JSON.parse(localStorage.getItem("timeTracker"));

    allEvents = allEvents.map(e=>{
        // console.log(e.eventTitle.toLowerCase());
        // console.log(eventTitleBackup.toLowerCase());
        if (e.eventTitle.toLowerCase().split(" ").filter(e=>e.length).join(" ") === eventTitleBackup.toLowerCase()) {
            // console.log("yes Baby");
            return {
                "eventTitle": eventTitle,
                "eventDate": eventDate,
                "eventId": e.eventId
            };
        } else {
            return e;
        }
    }
    );
    // console.log(allEvents);
    localStorage.setItem("timeTracker", JSON.stringify(allEvents));
}

function sort(arrow) {
    var eventMat = $("#event-mat");
    var orderFactor = parseInt($("select[name='timeleft']").value);
    var order = eventMat.getAttribute("data-sort-order");
    if( orderFactor == 2 ) {
        if ( order === "asc") {
            eventMat.setAttribute("data-sort-order", "desc");
            arrow.style.transform = "rotate(180deg)";
            var allEvents = [...$$(".event")];
            eventMat.innerHTML = "";

            allEvents.sort(function(a, b) {
                return a.querySelector(".event-title").innerText.length - b.querySelector(".event-title").innerText.length;
            }).forEach(function(ev) {
                eventMat.appendChild(ev);
            });

        } else {
            arrow.style.transform = "rotate(0deg)";
            eventMat.setAttribute("data-sort-order", "asc");
            var allEvents = [...$$(".event")];
            eventMat.innerHTML = "";

            allEvents.sort(function(a, b) {
                return b.querySelector(".event-title").innerText.length - a.querySelector(".event-title").innerText.length;
            }).forEach(function(ev) {
                eventMat.appendChild(ev);
            });

        }
    } else if( orderFactor == 1 ) {
        if ( order === "asc") {
            eventMat.setAttribute("data-sort-order", "desc");
            arrow.style.transform = "rotate(180deg)";
            var allEvents = [...$$(".event")];
            eventMat.innerHTML = "";

            allEvents.sort(function(a, b) {
                return getTotalDays(a.querySelector(".date").innerText) - getTotalDays(b.querySelector(".date").innerText);
            }).forEach(function(ev) {
                eventMat.appendChild(ev);
            });

        } else {
            arrow.style.transform = "rotate(0deg)";
            eventMat.setAttribute("data-sort-order", "asc");
            var allEvents = [...$$(".event")];
            eventMat.innerHTML = "";

            allEvents.sort(function(a, b) {
                return getTotalDays(b.querySelector(".date").innerText) - getTotalDays(a.querySelector(".date").innerText);
            }).forEach(function(ev) {
                eventMat.appendChild(ev);
            });

        }
    }
}

function makeTime(date) {
    // console.log(new Date(date));
    console.log( date );
    
    var timeNow = new Date();
    var eDate = date.split("-");
    // var totalDays = (parseInt(eDate[2]) * 365 + parseInt(eDate[1]) * 30 + parseInt(eDate[0])) - parseInt(timeNow.getFullYear() * 365 + (timeNow.getMonth() + 1) * 30 + timeNow.getDate()) - 1;
    var totalDays = parseInt(((new Date(`${eDate[1]}-${eDate[0]}-${eDate[2]}`).getTime()) - Date.now()) / (24 * 60 * 60 * 1000));
    console.log(totalDays);
    
    var y = parseInt(totalDays / 365);
    var m = parseInt((totalDays % 365) / 30);
    var w = parseInt(((totalDays % 365) % 30) / 7);
    var d = parseInt(((totalDays % 365) % 30) % 7);
    var hour = parseInt(((24 * 60) - ((new Date().getHours() * 60) + (new Date().getMinutes()))) / 60);
    var min = 60 - timeNow.getMinutes();
    var sec = 60 - timeNow.getSeconds();

    // console.log(`${y}-${m}-${w}-${d}-${hour}-${min}-${sec}`);
    return `${y}-${m}-${w}-${d}-${hour}-${min}-${sec}`;
}

function getTotalDays(date) {    
    
    var eDate = date.split("-");
    var totalDays = parseInt(((new Date(`${eDate[1]}-${eDate[0]}-${eDate[2]}`).getTime()) - Date.now()) / (24 * 60 * 60 * 1000));

  
  return totalDays;
}


var timeUpdater = setInterval(updateTime, 1000);

function updateTime() {
    // console.log("time ticking");
    var timeNow = new Date();
    var allEvents = [...$$(".event")];
    allEvents.forEach((event,i,elist)=>{
        // console.log(event.classList);
        if( !event.classList.contains("isolatedDisplay")) {
            eDate = event.querySelector(".date").innerText.split("-");
            let totalDays = parseInt(((new Date(`${eDate[1]}-${eDate[0]}-${eDate[2]}`).getTime()) - Date.now()) / (24 * 60 * 60 * 1000));

            var y = parseInt(totalDays / 365);
            !y && !event.classList.contains("isolatedDisplay") ? event.querySelector(".years").classList.add("hide") :"";
            var m = parseInt((totalDays % 365) / 30);
            !m ? event.querySelector(".months").classList.add("hide") :"";
            var w = parseInt(((totalDays % 365) % 30) / 7);
            !w ? event.querySelector(".weeks").classList.add("hide") :"";
            var d = parseInt(((totalDays % 365) % 30) % 7);
            !d ? event.querySelector(".days").classList.add("hide") :"";
            var hour = parseInt(((24 * 60) - ((new Date().getHours() * 60) + (new Date().getMinutes()))) / 60);
            !hour ? event.querySelector(".hours").classList.add("hide") :"";
            var min = 60 - timeNow.getMinutes();
            !min ? event.querySelector(".minutes").classList.add("hide") :"";
            var sec = 60 - timeNow.getSeconds();

            event.querySelector(".years").innerText = `${y} Year${y > 1 ? "s" : ""}`;
            event.querySelector(".months").innerText = `${m} Month${m > 1 ? "s" : ""}`;
            event.querySelector(".weeks").innerText = `${w} Week${w > 1 ? "s" : ""}`;
            event.querySelector(".days").innerText = `${d} Day${d > 1 ? "s" : ""}`;
            event.querySelector(".hours").innerText = `${hour} Hour${hour > 1 ? "s" : ""}`;
            event.querySelector(".minutes").innerText = `${min} Minute${min > 1 ? "s" : ""}`;
            event.querySelector(".seconds").innerText = `${sec} Second${sec > 1 ? "s" : ""}`;
        } else {
            var targerElemt = event.querySelector(".target");
            var whichFormat = targerElemt.innerText.split(" ")[1].toLowerCase(); 
            whichFormat = whichFormat[whichFormat.length-1] == "s" ? whichFormat.substr(0,whichFormat.length-1) : whichFormat;
            var date = event.querySelector(".date").innerText;
            console.log(targerElemt.innerText.split(" ")[1].substr(0,targerElemt.innerText.split(" ")[1].length-1).toLowerCase());
            var isolatedTime = getIsolatedTime( date,whichFormat );
            event.querySelector(".target").innerText = `${isolatedTime} ${whichFormat[0].toUpperCase()}${whichFormat.substr(1,whichFormat.length)}${isolatedTime > 1? "s" : ""}`;
        }  
    });
}

function showDetailTab(detailsTab) {
    if (detailsTab.parentElement.getAttribute("data-visible") === "no") {
        detailsTab.parentElement.setAttribute("data-visible", "yes");
        detailsTab.parentElement.style.top = "0px";
        detailsTab.style.top = "0px";
        detailsTab.style.transform = "rotate(0deg)";
    } else {
        detailsTab.parentElement.setAttribute("data-visible", "no");
        detailsTab.parentElement.style.top = "100%";
        detailsTab.style.top = "-25px";
        detailsTab.style.transform = "rotate(180deg)";
    }
}

function getIsolatedTime( date, whichFormat ) {
    console.log(date,whichFormat);
    var now = new Date();
    if( whichFormat == "second" ) { 
        var s = getTotalDays(date) * 24 * 60 * 60;
        s = s + ( now.getHours() * 60 * 60 );
        s = s + ( now.getMinutes() * 60 );
        s = s + ( 60 - now.getSeconds());
      return parseInt(s);
    } else if( whichFormat == "minute" ) { 
        var min = getTotalDays(date) * 24 * 60;
        min = min + ( now.getHours() * 60 );
        min = min + ( 60 - now.getMinutes() );        
      return parseInt(min);
    } else if( whichFormat == "hour" ) { 
        var hour = getTotalDays(date) * 24;
        hour = hour + ( 24 - now.getHours() );   
      return parseInt(hour);
    } else if( whichFormat == "day" ) { 
        var day = getTotalDays(date);
      return parseInt(day);
    } else if( whichFormat == "week" ) { 
        return parseInt(getTotalDays(date) / 7);
    } else if( whichFormat == "month" ) { 
        return parseInt(getTotalDays(date) / 30);
    } else if( whichFormat == "year" ) { 
        return parseInt(getTotalDays(date) / 365);
    }
}

function changeTimeDisplayType(event) {
    var displayType = event.querySelector(".timeType > select").value;
    var times = [...event.querySelectorAll(".event-timeleft > div")].filter( (e,i) => {if( i==0 ) return 0;else return 1;});
    var date = event.querySelector(".date").innerText;
    times.forEach( ev => {
        ev.classList.add("hide");
    });
    event.classList.add("isolatedDisplay");
    switch ( displayType ) {
        case "second" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("second") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "second" );
                    e.innerText = `${totalSecond} Second${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");                        
                    e.classList.add("target");
                }
            });
            break;
            case "minute" :
                times.forEach( (e) => {
                    // e.style.display = "inline-block";
                    if( !e.className.includes("minute") ){
                        e.classList.add("hide");
                        e.classList.remove("target");
                    } else {
                        var totalSecond = getIsolatedTime( date, "minute" );
                        e.innerText = `${totalSecond} Minute${totalSecond > 1 ? "s" : "" }`;
                        e.classList.remove("hide");              
                        e.classList.add("target");
                    }
                });
            break;
         
        case "hour" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("hour") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "hour" );
                    e.innerText = `${totalSecond} Hour${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");              
                    e.classList.add("target");
                }
            });
        break;
         
        case "day" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("day") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "day" );
                    e.innerText = `${totalSecond} Day${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");              
                    e.classList.add("target");
                }
            });
        break;
           
        case "week" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("week") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "week" );
                    e.innerText = `${totalSecond} Week${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");              
                    e.classList.add("target");
                }
            });
        break;
            
        case "month" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("month") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "month" );
                    e.innerText = `${totalSecond} Month${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");              
                    e.classList.add("target");
                }
            });
            break;
           
        case "year" :
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                if( !e.className.includes("year") ){
                    e.classList.add("hide");
                    e.classList.remove("target");
                } else {
                    var totalSecond = getIsolatedTime( date, "year" );
                    e.innerText = `${totalSecond} Year${totalSecond > 1 ? "s" : "" }`;
                    e.classList.remove("hide");              
                    e.classList.add("target");
                }
            });
            break;

        case "full" :          
            $(".target").classList.add("hide");
            times.forEach( (e) => {
                // e.style.display = "inline-block";
                setTimeout( ()=>{
                    e.classList.remove("hide");
                },1);
                // console.log(e);
            });
            
            event.classList.remove("isolatedDisplay");
          
            break;
         
        default:
            break;
    }
    // console.log(times);
}



function $(iden) {
    return document.querySelector(iden);
}
function $$(iden) {
    return document.querySelectorAll(iden);
}
