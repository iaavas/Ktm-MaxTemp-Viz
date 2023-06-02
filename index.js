let data;

let months;

let currentRow = 1;
let currentMonth = 0;
let previousAnomaly = 0;
let old_x1 = 0;
let old_y1 = 0;
let old_x2 = 0;
let old_y2 = 0;
let old_c = 'red';

let zeroRadius = 200;
let oneRadius = 300;
function preload() {
  data = loadTable('weather_kathmandu.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let row = data.getRow(0);
}
document.addEventListener('keydown', function (event) {});
function draw() {
  background(51);
  translate(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(16);
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, zeroRadius * 2);
  fill(255);
  noStroke();
  text('10°', zeroRadius - 15, 0);

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, oneRadius * 2);
  fill(255);
  noStroke();
  textSize(14);
  text('30°', oneRadius - 15, 0);

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 300);

  for (let i = 0; i < months.length; i++) {
    noStroke();
    fill(255);
    textSize(15);

    let angle = map(i, 0, months.length, 0, TWO_PI);
    push();
    let x = 314 * cos(angle);
    let y = 314 * sin(angle);
    translate(x, y);
    rotate(angle + PI / 2);
    text(months[i], 0, 0);
    pop();
  }
  let year = data.getRow(currentRow).get('Year');
  textSize(22);

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
      strokeWeight(2);
      stroke(old_c);

      line(old_x1, old_y1, old_x2, old_y2);
      console.log(row);
      let anomaly = row.get(months[i]);
      anomaly = parseFloat(anomaly);

      let angle = map(i, 0, months.length, 0, TWO_PI);

      let pr = map(previousAnomaly, 10, 31, zeroRadius, oneRadius);
      let r = map(anomaly, 10, 31, zeroRadius, oneRadius);

      console.log(pr, r);
      // noLoop()

      let x1 = r * cos(angle);
      let y1 = r * sin(angle);
      let x2 = pr * cos(angle - PI / 6);
      let y2 = pr * sin(angle - PI / 6);

      if (!firstValue) {
        let cold = color(20, 20, 255);
        let warm = color(255, 30, 30);
        let zero = color(255);

        let lineColor = zero;
        let avg = (anomaly + previousAnomaly) * 0.5;

        if (avg < 15) {
          lineColor = lerpColor(zero, color(135, 206, 235), abs(avg));
        }
        if (avg > 15 && avg < 20) {
          lineColor = lerpColor(zero, color(30, 144, 255), abs(avg));
        }
        if (avg > 25) {
          lineColor = lerpColor(zero, color(214, 0, 28), abs(avg));
        }
        stroke('yellow');

        noFill();
        strokeWeight(2);
        old_x1 = x1;
        old_y1 = y1;
        old_x2 = x2;
        old_y2 = y2;
        old_c = lineColor;
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
  frameRate(2);
}
