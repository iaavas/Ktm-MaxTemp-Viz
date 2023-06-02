let data;

let months;

let currentRow = 1;
let currentMonth = 0;
let previousAnomaly = 0;

let zeroRadius = 125;
let oneRadius = 200;
function preload() {
  data = loadTable('weather_kathmandu.csv', 'csv', 'header');
}

function setup() {
  createCanvas(600, 600);


  months = [
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
  ];

  let row = data.getRow(0)
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(16)
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, zeroRadius * 2);
  fill(255);
  noStroke();
  text("0°", zeroRadius + 10, 0);

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, oneRadius * 2);
  fill(255);
  noStroke();
  textSize(14);
  text("1°", oneRadius + 10, 0)

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 500);
  

  for (let i = 0; i < months.length; i++) {
    noStroke();
    fill(255);
    textSize(24);

    let angle = map(i, 0, months.length, 0, TWO_PI);
    push();
    let x = 264 * cos(angle);
    let y = 264 * sin(angle);
    translate(x, y);
    rotate(angle + PI / 2);
    text(months[i], 0, 0);
    pop();
  }
  let year = data.getRow(currentRow).get("Year");
  textSize(32)

  text(year, 0, 0);

  noFill();
  stroke(255);

  let firstValue = true;

  for (let j = 0; j < currentRow; j++) {
    let row = data.getRow(j);

    


    

    
    let totalMonths = months.length;
    
    if (j == currentRow - 1) {
      totalMonths = currentMonth;
    }

    for (let i = 0; i < totalMonths; i++) {
      console.log(row)
      let anomaly = row.get(months[i]);
        anomaly = parseFloat(anomaly);
        
        let angle = map(i, 0, months.length, 0, TWO_PI) - PI / 3;

        let pr = map(previousAnomaly, 10, 31, zeroRadius, oneRadius);
        let r = map(anomaly, 10, 31, zeroRadius, oneRadius);

        console.log(pr,r)
        // noLoop()
        
        

        let x1 = r * cos(angle);
        let y1 = r * sin(angle);
        let x2 = pr * cos(angle - PI / 6);
        let y2 = pr * sin(angle - PI / 6);
        
        if (!firstValue) {
          let cold = color(0, 0, 255);
          let warm = color(255, 0, 0);
          let zero = color(255);

          let lineColor = zero;
          let avg = (anomaly + previousAnomaly) * 0.5;

          if (avg < 20) {
            lineColor = lerpColor(zero, cold, abs(avg));
          }
          if (avg > 25) {
            lineColor = lerpColor(zero, warm, abs(avg));
          }
          stroke(lineColor);
          

          line(x1, y1, x2, y2);
        }
        firstValue = false;
        previousAnomaly = anomaly;
      }
    }
  

 
  currentMonth = currentMonth + 1;
  if (currentMonth == months.length) {
    currentMonth = 0;
    currentRow = currentRow + 1;
    if (currentRow == data.getRowCount()) {
      noLoop();
    }
  }
}