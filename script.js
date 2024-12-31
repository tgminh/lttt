class Shannon {
    constructor(data) {
        this.data = data;
        this.prob = this.calculateProbability(data);
        this.codes = this.shannonEncoding();
    }

    calculateProbability(data) {
        const freq = {};
        for (const char of data) {
            freq[char] = (freq[char] || 0) + 1;
        }
        const total = data.length;
        const prob = {};
        for (const char in freq) {
            prob[char] = freq[char] / total;
        }
        return prob;
    }

    shannonEncoding() {
        const prob = Object.entries(this.prob).sort((a, b) => b[1] - a[1]);
        let cumulativeProb = 0;
        const codes = {};

        for (const [char, p] of prob) {
            const codeLength = Math.ceil(-Math.log2(p));
            const cumulativeProbBin = cumulativeProb.toString(2).padStart(codeLength, '0').slice(0, codeLength);
            codes[char] = cumulativeProbBin;
            cumulativeProb += p;
        }

        return codes;
    }

    encode() {
        return this.data.split('').map(char => this.codes[char]).join('');
    }

    decode(encodedData) {
        const reverseCodes = Object.fromEntries(Object.entries(this.codes).map(([k, v]) => [v, k]));
        let temp = '';
        let decoded = '';

        for (const bit of encodedData) {
            temp += bit;
            if (temp in reverseCodes) {
                decoded += reverseCodes[temp];
                temp = '';
            }
        }

        return decoded;
    }
}

class Huffman {
    constructor(data) {
        this.codes = {};
        this.data = data;
    }

    huffman() {
        this.codes = {};
        let heap = Object.entries(this.data).map(([char, freq]) => [freq, [char, ""]]);
        heap.sort((a, b) => a[0] - b[0]);

        while (heap.length > 1) {
            let low1 = heap.shift();
            let low2 = heap.shift();

            for (let pair of low1[1]) {
                pair[1] = "0" + pair[1];
            }
            for (let pair of low2[1]) {
                pair[1] = "1" + pair[1];
            }

            let combined = [low1[0] + low2[0], ...low1[1], ...low2[1]];
            heap.push(combined);
            heap.sort((a, b) => a[0] - b[0]);
        }

        for (let [char, code] of heap[0].slice(1)) {
            this.codes[char] = code;
        }
    }

    decode(encodedText) {
        const reverseCodes = Object.fromEntries(Object.entries(this.codes).map(([k, v]) => [v, k]));
        let decodedText = "";
        let buffer = "";

        for (const bit of encodedText) {
            buffer += bit;
            if (buffer in reverseCodes) {
                decodedText += reverseCodes[buffer];
                buffer = "";
            }
        }

        return decodedText;
    }
}

class Fano {
    constructor(data) {
        this.codes = {};
        this.data = data;
    }

    fano() {
        this.codes = {};
        const sortedData = Object.entries(this.data).sort((a, b) => b[1] - a[1]);
        this._buildCodes(sortedData, "");
    }

    _buildCodes(data, prefix) {
        if (data.length === 1) {
            this.codes[data[0][0]] = prefix || "0";
            return;
        }

        const total = data.reduce((sum, [char, freq]) => sum + freq, 0);
        let runningSum = 0;
        let splitIdx = 0;

        for (let i = 0; i < data.length; i++) {
            runningSum += data[i][1];
            if (runningSum >= total / 2) {
                splitIdx = i + 1;
                break;
            }
        }

        this._buildCodes(data.slice(0, splitIdx), prefix + "0");
        this._buildCodes(data.slice(splitIdx), prefix + "1");
    }

    decode(encodedText) {
        const reverseCodes = Object.fromEntries(Object.entries(this.codes).map(([k, v]) => [v, k]));
        let decodedText = "";
        let buffer = "";

        for (const bit of encodedText) {
            buffer += bit;
            if (buffer in reverseCodes) {
                decodedText += reverseCodes[buffer];
                buffer = "";
            }
        }

        return decodedText;
    }
}

function processText() {
    const input = document.getElementById('input-text').value;
    const algorithm = document.getElementById('algorithm-select').value;
    let encodedText = '';
    let decodedText = '';
    let codes = {};
    let frequencies = {};
    let entropy = 0;
    let avgCodeLength = 0;
    let compressionRatio = 0;

    if (!input) {
        document.getElementById('results').innerText = "Please enter text to process.";
        return;
    }

    const frequency = {};
    for (const char of input) {
        frequency[char] = (frequency[char] || 0) + 1;
    }
    frequencies = frequency;

    if (algorithm === 'shannon') {
        const shannon = new Shannon(input);
        encodedText = shannon.encode();
        codes = shannon.codes;
        decodedText = shannon.decode(encodedText);
    } else if (algorithm === 'huffman') {
        const huffman = new Huffman(frequency);
        huffman.huffman();
        encodedText = input.split('').map(char => huffman.codes[char]).join('');
        codes = huffman.codes;
        decodedText = huffman.decode(encodedText);
    } else if (algorithm === 'fano') {
        const fano = new Fano(frequency);
        fano.fano();
        encodedText = input.split('').map(char => fano.codes[char]).join('');
        codes = fano.codes;
        decodedText = fano.decode(encodedText);
    }

    const totalCount = input.length;
    const probabilities = Object.fromEntries(Object.entries(frequencies).map(([char, count]) => [char, count / totalCount]));
    entropy = -Object.values(probabilities).reduce((sum, prob) => sum + prob * Math.log2(prob), 0);
    avgCodeLength = Object.entries(codes).reduce((sum, [char, code]) => sum + code.length * probabilities[char], 0);
    compressionRatio = entropy / avgCodeLength;

    document.getElementById('encoded-text').innerText = `Encoded Text: ${encodedText}`;
    document.getElementById('decoded-text').innerText = `Decoded Text: ${decodedText}`;
    document.getElementById('frequencies').innerText = `Frequencies: ${JSON.stringify(frequencies)}`;
    document.getElementById('codes').innerText = `Codes: ${JSON.stringify(codes)}`;
    document.getElementById('entropy').innerText = `Entropy: ${entropy.toFixed(4)}`;
    document.getElementById('avg-code-length').innerText = `Average Code Length: ${avgCodeLength.toFixed(4)}`;
    document.getElementById('compression-ratio').innerText = `Compression Ratio: ${compressionRatio.toFixed(4)}`;
}
