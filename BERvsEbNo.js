function Q(x) {
    return 0.5 * (1 - erf(x / Math.sqrt(2)));
}

function erf(x) {
    // Approximation of the error function
    var sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;
    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}

function ber_bpsk(eb_no) {
    return Q(Math.sqrt(2 * eb_no));
}

function ber_psk(eb_no, M) {
    var k = Math.log2(M);
    return (2 / k) * Q(Math.sqrt((2 * k * eb_no) * Math.sin(Math.PI / M) ** 2));
}

function calculateEbNo(modulationType, ber) {
    let berFunction;
    let M;

    if (modulationType === 'BPSK') {
        berFunction = ber_bpsk;
    } else if (modulationType === '8-PSK') {
        berFunction = (eb_no) => ber_psk(eb_no, 8);
        M = 8;
    } else if (modulationType === '16-PSK') {
        berFunction = (eb_no) => ber_psk(eb_no, 16);
        M = 16;
    } else {
        throw new Error('Unsupported modulation type');
    }

    let lowerBound = 0;
    let upperBound = 20;  // Arbitrary upper bound for search
    let tolerance = 1e-6;
    let eb_no;

    while ((upperBound - lowerBound) > tolerance) {
        eb_no = (lowerBound + upperBound) / 2;
        let calculatedBer = berFunction(10 ** (eb_no / 10));
        if (calculatedBer > ber) {
            lowerBound = eb_no;
        } else {
            upperBound = eb_no;
        }
    }

    return eb_no;
}