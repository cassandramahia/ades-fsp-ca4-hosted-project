window.onload = function () {

  var boxCount = 0;
  document.getElementById("plus").addEventListener("click", function (params) {
    boxCount++;

    console.log("pressed");
    var main = document.createElement("div");
    var sub = document.createElement("div");
    var load = document.createElement("div");
    var load2 = document.createElement("div");
    
    main.classList.add("col-md-12");
    main.style.borderStyle = "dotted";
    main.style.margin = "20px";
    main.id = `main-${boxCount}`;
    sub.classList.add("portfolio-item");
    sub.id = `port-${boxCount}`;
    load.id = `loader-${boxCount}`;
    load.className = "loader";
    load.style.display = "none";

    load2.id = `loader2-${boxCount}`;
    load2.className = "loader";
    load2.style.display = "none";

    var closeButton = document.createElement("button");
    closeButton.id = `B-${boxCount}`;
    closeButton.style = "font-size:20px;";
    closeButton.type = "button";
    closeButton.innerHTML = "&#10060;";
    closeButton.setAttribute("onclick", "myFunction(this.id)");




    var col = document.createElement("div");
    col.classList.add("col");
    
    var compRow = document.createElement("div");
    compRow.classList.add("row");
    var title1 = document.createElement("h6");
    title1.className = "tag";
    title1.innerHTML = "Company id";
    var input = document.createElement("input");
    input.className = "field";
    input.id = `field-${boxCount}`;
    input.placeholder = "Company id";
    input.setAttribute("maxlength", "10");



    var submitButon = document.createElement("button");
    submitButon.type = "button";
    submitButon.innerHTML = "Submit"
    submitButon.id = `${boxCount}`;
    submitButon.setAttribute("onclick", "submit(this.id)");
    var failtext = document.createElement("p");
    failtext.className = "fail";
    failtext.id = `comRow-${boxCount}`;
    failtext.innerHTML = "Invalid Queue"
    compRow.appendChild(title1);
    compRow.appendChild(input)
    compRow.appendChild(submitButon);
    compRow.appendChild(failtext);

    var queueRow = document.createElement("div");
    queueRow.classList.add("row");
    var title2 = document.createElement("h6");
    title2.className = "tag";
    title2.innerHTML = "Queue id";
    var dropdown = document.createElement("select");
    dropdown.id = `queue-${boxCount}`;
    dropdown.name = "queue";
    dropdown.setAttribute("onchange", "graph(this.id)");
    dropdown.className = "dropdown";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `hidden-${boxCount}`;
    checkbox.name = "hidden";
    checkbox.value = "hidden";
    checkbox.className = "checkbox";
    checkbox.checked = "true";
    checkbox.setAttribute("onclick", "check(this.id)");
    var label = document.createElement("label");
    label.for = "hidden";
    label.innerHTML = "Hide inactive";
    var cole = document.createElement("div");
    cole.className = "col";

    cole.appendChild(checkbox);
    cole.appendChild(label);
    queueRow.appendChild(title2);
    queueRow.appendChild(dropdown);
    queueRow.appendChild(cole);





    document.getElementById("main").appendChild(main);
    main.appendChild(sub);
    main.appendChild(load2);
    sub.appendChild(closeButton);
    sub.appendChild(col);
    sub.appendChild(load);
    col.appendChild(compRow);
    col.appendChild(queueRow);

  });

}

function check(id) {
  var x = id.substr(7, 1);
  var checkBox = document.getElementById(`hidden-${x}`);
  var dropdown = document.getElementById(`queue-${x}`).childElementCount;
  if (checkBox.checked == false) {
    for (i = 0; i < dropdown; i++) {
      document.getElementById(`loop-${i}-${x}`).style.display = "inline-block"
    }
  } else {
    for (i = 0; i < dropdown; i++) {
      if (document.getElementById(`loop-${i}-${x}`).value == "inactive") {
        document.getElementById(`loop-${i}-${x}`).style.display = "none"
      }
    }
  }
}

function myFunction(id) {
  var x = id.substr(2, 1);
  document.getElementById(id).className = "gone";
  var loaderText = document.createElement('h4');
  loaderText.innerHTML = "Closing Tracking..";
  loaderText.style.color = "orangered";
  var loader = document.createElement('div');
  loader.className = "loader-end";
  document.getElementById(`port-${x}`).appendChild(loaderText);
  document.getElementById(`port-${x}`).appendChild(loader);
  setTimeout(function () {
    document.getElementById(id).parentElement.parentElement.style.display = "none";
    loaderText.style.display = "none";
    loader.style.display = "none";

  }, 2000);

}

function submit(id) {
  document.getElementById(id).disabled = true;
  setTimeout(function () { document.getElementById(id).disabled = false; }, 5000);
  const email = document.getElementById(`field-${id}`);
  const val = email.value;

  if (val == "") {
    email.setCustomValidity("Please fill in the Company Id");
    email.reportValidity();
  }
  else if (val < 999999999) {
    email.setCustomValidity("Company Id must be 10 digits");
    email.reportValidity();
  }
  else if (isNaN(val)) {
    email.setCustomValidity("Company Id must be numeric");
    email.reportValidity();
  }
  else {
    email.setCustomValidity("");

    var get = document.getElementById(`field-${id}`).value;
    document.getElementById(`loader-${id}`).style.display = "inline-block";
    document.getElementById(`comRow-${id}`).style.display = "none";
    $.get(`http://localhost:8080/company/arrival_rate?queue_id=${x}&from=${tree.toISOString()}&duration=3`, function (data, status, xhr) {
      document.getElementById(`loader-${id}`).style.display = "none";
      document.getElementById(`field-${id}`).style.border = "2px solid black";
      
      if (JSON.stringify(data) == '[]') {
        document.getElementById(`field-${id}`).style.border = "2px solid red";
        document.getElementById(`comRow-${id}`).style.display = "inline-block";
        document.getElementById(`comRow-${id}`).innerHTML = "Unknown Company id";
        alert("Failed to fetch");

      }
      if (document.getElementById(`queue-${id}`).length > 0) {
        var Clearlength = document.getElementById(`queue-${id}`).length;

        for (i = Clearlength - 1; i >= 0; i--) {
          document.getElementById(`queue-${id}`).options[i] = null;
        }

        for (let index = 0; index < data.length; index++) {
          var queue = data[index].queue_id;
          var status = data[index].is_active;
          var display = document.createElement("option");
          display.value = queue;
          display.innerHTML = queue;
          display.className = status;
          display.id = `loop-${index}-${id}`;

          if (status == 0) {
            display.value = `inactive`;
            display.innerHTML = `${queue} [X]`
            display.style.display = "none";

          }

          var dropdown = document.getElementById(`queue-${id}`);
          dropdown.appendChild(display);

        }
        console.log("check");
        track(id, dropdown.value);

      }
      else {
        var deafult = document.createElement("option");
        var dropdown = document.getElementById(`queue-${id}`);
        deafult.value = " ";
        deafult.innerHTML = "Select..";
        dropdown.appendChild(deafult);

        for (let index = 0; index < data.length; index++) {
          var queue = data[index].queue_id;
          var status = data[index].is_active;
          var display = document.createElement("option");
          display.value = queue;
          display.innerHTML = queue;
          display.className = queue;
          display.id = `loop-${index}-${id}`;

          if (status == 0) {
            display.value = `inactive`;
            display.innerHTML = `${queue} [X]`
            display.style.display = "none";
          }

          var dropdown = document.getElementById(`queue-${id}`);
          console.log();
          dropdown.appendChild(display);

        }
        console.log("create");
        //console.log(document.getElementById(`queue-${id}`).value);
        send(document.getElementById(`queue-${id}`).value, id);
      }



      var graph = document.createElement("div");
      graph.id = `chartContainer-${id}`;
      graph.style.height = "300px";
      graph.style.width = "100%";
      document.getElementById(`main-${id}`).appendChild(graph);


    }).fail(function (jqXHR, textStatus, error) {
      //console.log(JSON.stringify(jqXHR));
      // alert(jqXHR.status);
      console.log(jqXHR);
      //Fail done by Lian Mao
      if (jqXHR.status == 400) {
        document.getElementById(`loader-${id}`).style.display = "none";
        document.getElementById(`field-${id}`).style.border = "2px solid red";

        document.getElementById(`comRow-${id}`).style.display = "inline-block";
        alert("Failed to fetch");
        //alert(jqXHR.status+ textStatus);
      }
      else {
        alert(jqXHR.status + "UNEXPECTED_ERROR");
      }

    });
  }

}

function graph(id) {
  var x = id.substr(6, 1);
  var value = document.getElementById(`queue-${x}`).value;
  var warning = document.createElement("span");
  warning.style.fontSize = "30px";
  warning.style.color = "red";
  warning.style.display = "none";
  warning.id = `warning-${x}`;
  warning.innerHTML = "&#9888; Error";
  document.getElementById(`main-${x}`).appendChild(warning);
  if (value == 'inactive') {
    document.getElementById(`warning-${x}`).innerHTML = "&#9888; Inactive queue";
    document.getElementById(`main-${x}`).appendChild(warning);
    document.getElementById(`warning-${x}`).style.display = "inline-block";
  }
  else if (value == " ") {

    document.getElementById(`warning-${x}`).innerHTML = "&#9888; No Queues";
    document.getElementById(`warning-${x}`).style.display = "inline-block";
  }
  else {// alert(document.getElementById(`queue-${x}`).value);
    alert("changed queue");
    send(value, x);
    if (document.getElementById(`warning-${x}`)) {
      document.getElementById(`warning-${x}`).style.display = "none";
    }

  }
}

function send(queue, id) {
  console.log(queue);
  if (queue == " ") {


  } else {

    var d = new Date();
    document.getElementById(`loader2-${id}`).style.display = "inline-block";
    $.get(`https://ades-2B04.herokuapp.com/company/arrival_rate?queue_id=${queue}&from=${d.toISOString()}&duration=180`, function (data, status) {
      document.getElementById(`loader2-${id}`).style.display = "none";

      //console.log(finalArr);

      track(id, queue);
      var checkStatus = function (queue) {
        if ((document.getElementById("B-" + id).className != "gone")) {
          $.get(`https://ades-2B04.herokuapp.com/customer/queue?queue_id=${queue}`, function (data, status) {
            // console.log(data.status);
            if (data.status == "INACTIVE") {
              document.getElementById(id).className = "inactive";
            }
            else {
              document.getElementById(id).className = id;
            }
          })
        }


      }
      setInterval(function () { checkStatus(queue) }, 1000);


    }).fail(function (jqXHR, textStatus, error) {
      //console.log(JSON.stringify(jqXHR));
      // alert(jqXHR.status);

      //Fail done by Lian Mao
      if (jqXHR.status == 404) {

        alert("Failed to fetch 404");
        //alert(jqXHR.status+ textStatus);
      }
      else {
        alert("error")
        if (document.getElementById(`warning-${id}`).style.fontSize == "30px") {
          document.getElementById(`warning-${id}`).style.innerHTML = "&#9888; Server Error"
        }
        else {
          var warning = document.createElement("span");
          warning.style.fontSize = "30px";
          warning.style.color = "red";
          warning.id = `warning-${id}`;
          warning.innerHTML = "&#9888; Server Error";
          document.getElementById(`main-${id}`).appendChild(warning);
        }
        alert(jqXHR.status + "UNEXPECTED_ERROR");
      }

    });
  }

}

function track(id, queue) {
  var loader = document.createElement('div');
  loader.className = "loader-refresh";
  loader.id = `refresh-${id}`;
  loader.style.display = "none"
  document.getElementById(`port-${id}`).appendChild(loader);

  // var dps = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];   //dataPoints. 
  var dps = [];
  var chart = new CanvasJS.Chart(`chartContainer-${id}`, {
    title: {
      text: "Arrival Rate " + queue
    },
    axisX: {
      title: "Time"
    },
    axisY: {
      title: "No of request"
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  });

  //chart.render();
  // var xVal = dps.length + 1;
  // var yVal = 15;	
  var updateInterval = 3000;
  var dataLength = 20;
  var warning = document.createElement("span");
  warning.style.fontSize = "30px";
  warning.style.color = "red";
  warning.id = `warning-${id}`;
  warning.style.display = "none";
  warning.innerHTML = "&#9888; Server Error";

  //Problem start

  var updateChart = function (queue) {


    length = length || 1;
    //alert(queue+"Pp");
    console.log(document.getElementById("B-" + id).className);
    if (document.getElementById("B-" + id).className != "gone") {
      console.log(queue);
      //console.log(90);
      var d = new Date();
      document.getElementById(`refresh-${id}`).style.display = "inline-block";


      document.getElementById(`main-${id}`).appendChild(warning);
      var threemin = new Date(d.getTime() - 60000 * 3);
      $.get(`https://ades-2B04.herokuapp.com/company/arrival_rate?queue_id=${queue}&from=${threemin.toISOString()}&duration=3`, function (data, status) {
        document.getElementById(`warning-${id}`).style.display = "none";
        document.getElementById(`refresh-${id}`).style.display = "none";
        //console.log(data.length);
        var final = [];
        for (var j = 0; j < data.length; j++) {
          if (document.getElementById(id).className == "inactive") {
            console.log("inacive");
            final.push({
              x: data[j].timestamp,
              y: 0
            });
          }
          else {
            final.push({
              x: data[j].timestamp,
              y: parseInt(data[j].count)
            });
          }
          console.log(queue);


        }
        if (document.getElementById(id).className != "inactive") {
          dps.splice(0, dps.length, ...final);
        }

        chart.render();

      })
        .fail(function (jqXHR, textStatus, error) {
          console.log(textStatus, error);
          if (jqXHR.status == 0) {
            document.getElementById(`warning-${id}`).style.display = "inline-block";


          }

          //alert("nope");
        });





    }
    else {
      console.log("gone");
    }

  };
  //Problem End


  //updateChart(dataLength,queue);

  setInterval(function () { updateChart(queue) }, updateInterval);
}
