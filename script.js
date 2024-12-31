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

function encodeText() {
    const input = document.getElementById('input-text').value;
    const algorithm = document.getElementById('algorithm-select').value;
    let encodedText = '';
    let codes = {};

    if (algorithm === 'shannon') {
        const shannon = new Shannon(input);
        encodedText = shannon.encode();
        codes = shannon.codes;
    } else if (algorithm === 'huffman') {
        const frequency = {};
        for (const char of input) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
        const huffman = new Huffman(frequency);
        huffman.huffman();
        encodedText = input.split('').map(char => huffman.codes[char]).join('');
        codes = huffman.codes;
    } else if (algorithm === 'fano') {
        const frequency = {};
        for (const char of input) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
        const fano = new Fano(frequency);
        fano.fano();
        encodedText = input.split('').map(char => fano.codes[char]).join('');
        codes = fano.codes;
    }

    document.getElementById('output-text').innerText = `Encoded Text: ${encodedText}\nCodes: ${JSON.stringify(codes)}`;
}

function decodeText() {
    const input = document.getElementById('input-text').value.split("\n")[0]; // Assume encoded text is in the first line
    const codes = JSON.parse(document.getElementById('input-text').value.split("\n")[1] || "{}"); // Assume codes are in the second line
    const algorithm = document.getElementById('algorithm-select').value;
    let decodedText = '';

    if (algorithm === 'shannon') {
        const shannon = new Shannon('');
        shannon.codes = codes;
        decodedText = shannon.decode(input);
    } else if (algorithm === 'huffman') {
        const huffman = new Huffman({});
        huffman.codes = codes;
        decodedText = huffman.decode(input);
    } else if (algorithm === 'fano') {
        const fano = new Fano({});
        fano.codes = codes;
        decodedText = fano.decode(input);
    }

    document.getElementById('output-text').innerText = `Decoded Text: ${decodedText}`;
}
