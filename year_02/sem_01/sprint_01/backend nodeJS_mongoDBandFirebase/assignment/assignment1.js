//  1. Coding Assessment

function codingScoreCheck(marks, cutoff) {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            let total = 0;

            for (let i = 0; i < marks.length; i++) {
                total = total + marks[i];
            }

            let average = total / marks.length;

            if (average >= cutoff) {
                resolve(average);
            } else {
                reject("sorry coding assessment not cleared");
            }

        }, 2000);
    });
}


codingScoreCheck([80, 70, 90], 75)

    .then((average) => {
        console.log("average score:", average);
        console.log("coding assessment cleared!");
    })

    .catch((error) => {
        console.log(error);
    });


//   2. Technical Assessment

function technicalInterviewCheck(marks, cutoff) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            let total = 0;

            for (let i = 0; i < marks.length; i++) {
                total = total + marks[i];
            }

            let average = total / marks.length;

            if (average >= cutoff) {
                resolve(average);
            } else {
                reject("sorry technical interview not cleared");
            }

        }, 2000);
    });
}


// Calling the function
technicalInterviewCheck([72, 81, 86], 70)

    .then((average) => {
        console.log("average score:", average);
        console.log("technical interview cleared!");
    })

    .catch((error) => {
        console.log(error);
    });




//   3. Final Selection Review

function finalSelectionCheck(codingAverage, technicalAverage, cutoff) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            let finalAverage = (codingAverage + technicalAverage) / 2;

            if (finalAverage >= cutoff) {
                resolve(finalAverage);
            } else {
                reject("sorry final selection cutoff not cleared");
            }

        }, 2000);
    });
}


// Calling the function
finalSelectionCheck(80, 80, 75)

    .then((finalAverage) => {
        console.log("final average:", finalAverage);
        console.log("final selection cleared!");
    })

    .catch((error) => {
        console.log(error);
    });

