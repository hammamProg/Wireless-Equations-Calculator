function erlangB(E, C) {
    let numerator = Math.pow(E, C) / factorial(C);
    let denominator = 0;
    for (let k = 0; k <= C; k++) {
        denominator += Math.pow(E, k) / factorial(k);
    }
    return numerator / denominator;
}

function factorial(n) {
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

function findChannels(E, B) {
    let C = 1;
    while (true) {
        let blockingProbability = erlangB(E, C);
        if (blockingProbability <= B) {
            return C;
        }
        C++;
    }
}