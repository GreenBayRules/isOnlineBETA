window.onload = function() {

    document.getElementById("enablefriendlist").onclick = function() {
        chrome.runtime.sendMessage({friendlist: "refresh"});
        chrome.permissions.contains({
            permissions: ['notifications'],
        }, function(result) {
            if (result) {
                if(document.getElementById("enablefriendlist").checked) {
                    localStorage.setItem("iOfriendlistenabled",1);chrome.storage.sync.set({iOfriendsenabled : "1"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
                else {
                    localStorage.setItem("iOfriendlistenabled",0);chrome.storage.sync.set({iOfriendsenabled : "0"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
            } else { // If there's no permission
                chrome.permissions.request({
                    permissions: ['notifications'],
                }, function(granted) {if(!granted){return;}localStorage.setItem("iOfriendlistenabled",1);chrome.storage.sync.set({iOfriendsenabled : "1"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});});
            }
        }
                                   );
    };


    document.getElementById("soundnotif").onclick = function() {
		audio = new Audio('sound.mp3');audio.play();
        localStorage.setItem("iOfriendlistsound",document.getElementById("soundnotif").checked ? 1 : 0);};

    if(localStorage.getItem("iOfriendsawaytoonline")==1) {
        document.getElementById("awaytoonline").checked = true;
    }
	
    if(localStorage.getItem("iOfriendlistsound")==1) {
        document.getElementById("soundnotif").checked = true;
    }

    if(localStorage.getItem("iOfriendlistenabled")==1) {
        document.getElementById("enablefriendlist").checked = true;
    }
    else{document.getElementById("settings").remove();document.getElementById("anote").remove();document.getElementById("newlines").remove();return;}

    onlineresponse = {"thelist":"0"};
    awayresponse = {"thelist":"0"};
    offlineresponse = {"thelist":"0"};
    unknownresponse = {"thelist":"0"};
    onlineList();setInterval(onlineList, 2000);

    function getStatuses(){
        chrome.runtime.sendMessage({getfriendsbystatus: "Online"}, function (response){
            console.log(response);
            if(JSON.stringify(response.thelist)===onlineresponse){console.log("online is same");return;}
            onlineresponse = JSON.stringify(response.thelist);
            document.getElementById("onlinefriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                            if(document.getElementById("onlinefriends").innerHTML === ""){document.getElementById("onlinefriends").innerHTML = '<br><img id="iostatusimage" src="online.svg" height="12" width="12"> <b><span id="iOstatustext" style="color:red">Online</span></b>';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("onlinefriends").innerHTML += "<br><img height='20' width='20' id='"+id+"'src='"+image+"'/>&nbsp;<a href='https://scratch.mit.edu/users/"+username+"/'_target='_blank'>"+username+"</a>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Away"}, function (response){
            if(JSON.stringify(response.thelist)===awayresponse){console.log("same");return;}
            awayesponse = JSON.stringify(response.thelist);
            document.getElementById("awayfriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                            if(document.getElementById("awayfriends").innerHTML === ""){document.getElementById("awayfriends").innerHTML = '<br><img id="iostatusimage" src="away.svg" height="12" width="12"> <b><span id="iOstatustext" style="color:red">Away</span></b>';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("awayfriends").innerHTML += "<br><img height='20' width='20' id='"+id+"'src='"+image+"'/>&nbsp;<a href='https://scratch.mit.edu/users/"+username+"/'_target='_blank'>"+username+"</a>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            };
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Offline"}, function (response){
            var id;
            if(JSON.stringify(response.thelist)===offlineresponse){console.log("same");return;}
            offlineresponse = JSON.stringify(response.thelist);
            document.getElementById("offlinefriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                            if(document.getElementById("offlinefriends").innerHTML === ""){document.getElementById("offlinefriends").innerHTML = '<br><img id="iostatusimage" src="offline.svg" height="12" width="12"> <b><span id="iOstatustext" style="color:red">Offline</span></b>';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("offlinefriends").innerHTML += "<br><img height='20' width='20' id='"+id+"'src='"+image+"'/>&nbsp;<a href='https://scratch.mit.edu/users/"+username+"/'_target='_blank'>"+username+"</a>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }
            
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Unknown"}, function (response){
            if(JSON.stringify(response.thelist)===unknownresponse){console.log("same");return;}
            unknownresponse = JSON.stringify(response.thelist);
            document.getElementById("unknownfriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                if(response.thelist[i] !== ""){
                    if(document.getElementById("unknownfriends").innerHTML === ""){document.getElementById("unknownfriends").innerHTML = '<br><b><span id="iOstatustext" style="color:grey">Loading statuses from...</span></b>';}
                    document.getElementById("unknownfriends").innerHTML += "<br><a href='https://scratch.mit.edu/users/"+response.thelist[i]+"/' target='_blank'>"+response.thelist[i]+"</a>";}}
        });
    }

    function onlineList() {
        chrome.tabs.query({url:"https://scratch.mit.edu/*"}, function(tabs) {
            if (tabs.length!==0){getStatuses();}
            else {document.getElementById("onlinefriends").innerHTML="Friend list only works when you have at least one Scratch tab open";}
        });
    }


}; //onload
