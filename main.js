const readline = require('readline');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var data = [] 
var sections = 0; // number of plane sections
var numberOfPassengers = 0;


const question1 = () => {
    return new Promise((resolve, reject) => {
        read.question('Enter the seats as arrays: ', (d) => {
            data = d;
            resolve()
        })
    })
}


const question2 = () => {
    return new Promise((resolve, reject) => {
        read.question('Enter number of passengers: ', (num) => {
            num = parseInt(num);
            numberOfPassengers = num;
            resolve()
        })
    })
}


const main = async () => {
    await question1()
    await question2()


    var raw = JSON.parse(data)
    var input = []

    //filtering out erroneous information about the plane seating plan.
    for (i = 0; i < raw.length; i++) {
        if (raw[i] == null || raw[i].length <= 1 || raw[i][0] == 0 || raw[i][1] == 0) { continue; }
        input.push(raw[i])
        sections++;
    }

    var maxSeatRowNo = Math.max.apply(Math, input.map(e => e[1]));

    var seats = { seats: initializeSeats(input), counter: 1, numberOfPassengers: numberOfPassengers };

    fillSeats("Aisle", seats, maxSeatRowNo);
    fillSeats("Window", seats, maxSeatRowNo);
    fillSeats("Middle", seats, maxSeatRowNo);

    print(seats.seats, maxSeatRowNo)

    read.close()
}


main();





function initializeSeats(array) {
    //sets tags every location in the seats array with appropriate label (Aisle, Middle, or Window)
    var seats = [];
    for (var i = 0; i < array.length; i++)
        seats.push(Array(array[i][1]).fill().map(() => Array(array[i][0]).fill("Middle")));

    for (var i = 0; i < seats.length; i++) {
        for (var j = 0; j < seats[i].length; j++) {
            seats[i][j][0] = "Aisle";
            seats[i][j][seats[i][j].length - 1] = "Aisle";
        }
    }

    for (var i = 0; i < seats[0].length; i++)
        seats[0][i][0] = "Window";
    for (var i = 0; i < seats[seats.length - 1].length; i++)
        seats[seats.length - 1][i][(seats[seats.length - 1][i].length) - 1] = "Window";

    return seats;
}



function fillSeats(tag, seats, maxSeatRowNo) {
    // fills in the seats based on the tags assigned
    outerLoop: for (var i = 0; i < maxSeatRowNo; i++) {
        for (var j = 0; j < sections; j++) {
            if (seats.seats[j] == null || seats.seats[j][i] == null)
                continue;
            for (k = 0; k < seats.seats[j][i].length; k++) {
                if (seats.counter > seats.numberOfPassengers) {
                    break outerLoop;
                }
                if (seats.seats[j] != null && seats.seats[j][i] != null && seats.seats[j][i][k] === tag) {
                    seats.seats[j][i][k] = seats.counter;
                    seats.counter++;
                }
            }
        }

    }
}




function print(seats, maxSeatRowNo) {

    var output = "\n\n"
    for (var i = 0; i < maxSeatRowNo; i++) {
        for (var j = 0; j < sections; j++) {
            if (i >= (seats[j].length)) {
                output += " ".repeat((3 * (seats[j][0].length))) + "| ";
                continue;

            }
            for (k = 0; k < seats[j][i].length; k++) {
                let next = seats[j][i][k];
                next = ((typeof next === 'number') ? ("" + next + " ") : ("   "));
                next = (next.length == 2) ? " " + next : next;
                output += next
            }
            output += "| ";
        }
        output += "\n"
    }
    console.log(output)
}
