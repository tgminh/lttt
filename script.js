class Shannon {
  constructor(data) {
    this.data = data;
    this.prob = this.calculateProbability(data);
    this.codes = this.shannonEncoding();
    this.hesonen = this.hesonen();
    this.hesonentoiuu = this.hesonen2();
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
      console.log(codeLength);
      const cumulativeProbBin = cumulativeProb.toString(2);
      if (cumulativeProbBin === '0') {
        codes[char] = cumulativeProbBin.padStart(codeLength, '0');
      } else {
        codes[char] = cumulativeProbBin.slice(2, 2 + codeLength);
      }
      cumulativeProb += p;
    }
    return codes;
  }

  hesonen() {
    const prob = Object.entries(this.prob).sort((a, b) => b[1] - a[1]);
    let tong_entropy = 0;
    let tong_do_dai = 0;
    for (const [char, p] of prob) {
      const entropy = p * -Math.log2(p);
      const averageCodelength = p * Math.ceil(-Math.log2(p));
      tong_entropy += entropy;
      tong_do_dai += averageCodelength;
    }
    const hesonen = tong_entropy / tong_do_dai;
    return hesonen;
  }

  hesonen2() {
    const prob = Object.entries(this.prob).sort((a, b) => b[1] - a[1]);
    let tong_do_dai = 0;
    let count = 0;
    for (const [char, p] of prob) {
      const averageCodelength = p * Math.ceil(-Math.log2(p));
      tong_do_dai += averageCodelength;
      count += 1;
    }
    const hesonen = Math.log2(count) / tong_do_dai;
    console.log(count);
    return hesonen;
  }

  encode() {
    return this.data
      .split('')
      .map(char => this.codes[char])
      .join('');
  }

  decode(encodedData) {
    const reverseCodes = Object.fromEntries(
      Object.entries(this.codes).map(([k, v]) => [v, k])
    );
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

    // Nếu tổng giá trị = 1, coi đầu vào là xác suất
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    if (total !== 1) {
      console.warn(
        'Input data does not represent probabilities. Assuming frequency input.'
      );
    }
  }

  huffman() {
    this.codes = {};
    // Khởi tạo heap với cặp [tần suất, [ký tự, mã]]
    let heap = Object.entries(this.data).map(([char, freq]) => [
      freq,
      [[char, '']],
    ]);
    heap.sort((a, b) => a[0] - b[0]); // Sắp xếp heap theo tần suất tăng dần
    while (heap.length > 1) {
      let low1 = heap.shift(); // Tần suất nhỏ nhất
      let low2 = heap.shift(); // Tần suất nhỏ thứ hai

      // Gắn thêm '0' cho mã của low1
      for (let pair of low1[1]) {
        pair[1] = '0' + pair[1];
      }
      // Gắn thêm '1' cho mã của low2
      for (let pair of low2[1]) {
        pair[1] = '1' + pair[1];
      }

      // Kết hợp hai node và đưa lại vào heap
      let combined = [low1[0] + low2[0], [...low1[1], ...low2[1]]];
      heap.push(combined);
      heap.sort((a, b) => a[0] - b[0]); // Sắp xếp lại heap
    }

    // Trích xuất mã cuối cùng từ node gốc của cây
    for (let [char, code] of heap[0][1]) {
      this.codes[char] = code;
    }
  }

  decode(encodedText) {
    const reverseCodes = Object.fromEntries(
      Object.entries(this.codes).map(([k, v]) => [v, k])
    );
    let decodedText = '';
    let buffer = '';

    for (const bit of encodedText) {
      buffer += bit;
      if (buffer in reverseCodes) {
        decodedText += reverseCodes[buffer];
        buffer = '';
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
    this._buildCodes(sortedData, '');
  }

  _buildCodes(data, prefix) {
    if (data.length === 1) {
      this.codes[data[0][0]] = prefix || '0';
      return;
    }

    const splitIdx = this._findBestSplit(data);
    this._buildCodes(data.slice(0, splitIdx), prefix + '0');
    this._buildCodes(data.slice(splitIdx), prefix + '1');
  }

  _findBestSplit(data) {
    const total = data.reduce((sum, [, freq]) => sum + freq, 0);
    let runningSum = 0;
    let minDifference = Infinity;
    let splitIdx = 0;

    for (let i = 0; i < data.length - 1; i++) {
      runningSum += data[i][1];
      const difference = Math.abs(total - 2 * runningSum);
      if (difference < minDifference) {
        minDifference = difference;
        splitIdx = i + 1;
      }
    }

    return splitIdx;
  }

  decode(encodedText) {
    const reverseCodes = Object.fromEntries(
      Object.entries(this.codes).map(([k, v]) => [v, k])
    );
    let decodedText = '';
    let buffer = '';

    for (const bit of encodedText) {
      buffer += bit;
      if (buffer in reverseCodes) {
        decodedText += reverseCodes[buffer];
        buffer = '';
      }
    }

    return decodedText;
  }
}

window.encodeText = function () {
  const input = document.getElementById('input-text').value;
  const algorithm = document.getElementById('algorithm-select').value;
  let encodedText = '';
  let codes = {};
  let probString = '';
  let kt = '';
  let kn = '';

  if (algorithm === 'shannon') {
    const shannon = new Shannon(input);
    encodedText = shannon.encode();
    codes = shannon.codes;
    const prob = shannon.prob;
    probString = JSON.stringify(prob, null, 2);
    console.log(probString);
    const ktphu = shannon.hesonen;
    kt = JSON.stringify(ktphu);
    const knphu = shannon.hesonentoiuu;
    kn = JSON.stringify(knphu);
  } else if (algorithm === 'huffman') {
    const frequency = {};
    for (const char of input) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    const huffman = new Huffman(frequency);
    huffman.huffman();
    encodedText = input
      .split('')
      .map(char => huffman.codes[char])
      .join('');
    codes = huffman.codes;
  } else if (algorithm === 'fano') {
    const frequency = {};
    for (const char of input) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    const fano = new Fano(frequency);
    fano.fano();
    encodedText = input
      .split('')
      .map(char => fano.codes[char])
      .join('');
    codes = fano.codes;
  }

  document.getElementById(
    'output-text'
  ).innerText = `Encoded Text: ${encodedText}\nCodes: ${JSON.stringify(
    codes
  )}\nProbability: ${probString}\nHe_so_nen_thong_ke: ${kt}\nHe_so_nen_toi_uu: ${kn}`;
};

window.decodeText = function () {
  const input = document.getElementById('input-text').value.split('\n')[0]; // Assume encoded text is in the first line
  const codes = JSON.parse(
    document.getElementById('input-text').value.split('\n')[1] || '{}'
  ); // Assume codes are in the second line
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

  document.getElementById(
    'output-text'
  ).innerText = `Decoded Text: ${decodedText}`;
};

window.encodeTextProb = function () {
  const input = document.getElementById('dictInput').value;
  const algorithm = document.getElementById('algorithm-select-2').value;
  let encodedText = '';
  let codes = {};
  let probString = '';

  if (algorithm === 'shannon') {
    const shannon = new Shannon(input);
    encodedText = shannon.shannonEncodingProb();
    codes = shannon.codes;
    const prob = shannon.prob;
    probString = JSON.stringify(prob, null, 2);
    console.log(probString);
  }
};
window.encodeUsingProb_Huffman = function () {
  const probInput = document.getElementById('prob-input').value; // Nhập JSON xác suất
  let encodedResult = '';
  let codes = {};

  try {
    const probDict = JSON.parse(probInput); // Parse input JSON
    const total = Object.values(probDict).reduce(
      (sum, value) => sum + value,
      0
    );

    // Kiểm tra tổng xác suất có bằng 1 không
    if (Math.abs(total - 1) > 1e-6) {
      throw new Error(
        'The probabilities do not sum to 1. Please provide valid probabilities.'
      );
    }

    const huffman = new Huffman(probDict);
    huffman.huffman(); // Tạo mã Huffman
    encodedResult = Object.keys(probDict)
      .map(key => `${key}: ${huffman.codes[key]}`)
      .join('\n'); // Tạo chuỗi mã hóa từng ký tự
    codes = huffman.codes; // Lưu mã Huffman
  } catch (error) {
    document.getElementById('prob-output').innerText =
      'Error: Invalid JSON format or probabilities. ' + error.message;
    return;
  }

  document.getElementById(
    'prob-output'
  ).innerText = `Encoded Keys:\n${encodedResult}`;
};
